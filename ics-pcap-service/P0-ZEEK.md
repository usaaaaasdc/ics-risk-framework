# P0: opt-in local offline Zeek engine

Zeek **9.0.0** is the only decoder in this path. Python performs bounded admission,
job orchestration and structured-log normalization. No HTTP endpoint, port, service,
live capture, scanner, PLC command or external capture upload is introduced.
`main.py`, the Next PCAP proxy and UI remain unchanged. There is no fallback.

## Run on Linux

Use an on-prem Ubuntu 24.04 x86_64 machine with Python 3.12, an administrator-installed
Zeek 9.0.0 at `/opt/zeek` and bubblewrap >=0.9. The CI bootstrap demonstrates the exact
Zeek package URL and SHA-256; it installs system packages and is intended for disposable
CI runners, not automatic production setup. Engine Python code needs no pip packages.

Run as a dedicated unprivileged OS account with access only to authorized captures.
User/network/mount/PID namespaces must be permitted. If bubblewrap is unavailable or
namespace creation is prohibited, execution fails closed. Do not remove isolation to
work around a host policy. Windows development uses WSL/Linux, not a native fallback.

```bash
cd ics-pcap-service
python3 -m unittest discover -s tests -v
python3 -m engine tests/fixtures/good.pcap --enable-zeek --authorized \
  --synthetic-fixture --site-id synthetic-lab > /protected/local/result.json
```

Remove `--synthetic-fixture` for a locally supplied capture. Its classification is
then `unvalidated_capture`: decoding bytes does not establish provenance/authenticity.
`--authorized` records an operator acknowledgement, not a substitute for OS access
control. P0 is disabled unless `--enable-zeek` or `Config(enabled=True)` is explicit.
Use local protected output destinations; stdout can contain sensitive addresses.

No Vercel-to-factory connection is assumed. Do not expose this interface through
the existing unauthenticated PCAP HTTP route. An authenticated, size-bounded local
API gateway requires a later scoped integration.

## Internal interface and lifecycle

```python
from engine.worker import Config, OfflineWorker

worker = OfflineWorker(Config(enabled=True))
try:
    job_id = worker.submit("/authorized/capture.pcapng", authorized=True, site_id="plant-a")
    snapshot = worker.wait(job_id)  # get(job_id) polls without waiting
    # worker.cancel(job_id) works for queued and running jobs.
    if snapshot["state"] in {"COMPLETED", "PARTIAL"}:
        observations = snapshot["result"]["protocolObservations"]
    # Retrieve manifest-listed evidence while retained:
    # worker.artifact(job_id, "modbus.log") -> bytes
    worker.forget(job_id)  # terminal jobs only; deletes local logs
finally:
    worker.close()  # cancel outstanding work, reap sandboxes, remove spool
```

One process-local worker/queue is supported, not a distributed scheduler. States:
`QUEUED -> PROCESSING -> COMPLETED | PARTIAL | FAILED | CANCELLED`.
Queued cancellation can transition directly to `CANCELLED`. The job snapshot retains
state history, capture SHA-256, exit code (including timeout/cancellation), diagnostics
and artifact names/hashes/lengths. Failed/cancelled jobs publish no normal analysis.

Raw capture copies are deleted at terminal state. Native logs remain in a private
0700 temporary spool until `forget()`/`close()`; restart recovery is not provided.
Use a protected, quota-limited local `TMPDIR` and remove orphaned spools after crashes
through an operator-managed retention policy. Do not share spool access across tenants.

## Safety and limits

Each job copies a regular local file (no symlinks, devices or FIFOs), bounds bytes
while copying and computes SHA-256 over that immutable copy. Container admission
precedes decoding; extensions are irrelevant. No shell is used. Only the bundled
read-only Zeek script is passed. Executable/runtime paths are trusted administrator
configuration, never capture/API parameters. Pin the entire installed runtime and
plugin set; the profile records executable, script, admission/normalizer/launcher
digests and limits, not a recursive hash of every installed shared library/plugin.

Bubblewrap removes external networking and host home/run/socket access, makes runtime
and capture read-only, drops capabilities, clears inherited environment and creates
separate user/PID/mount/IPC/UTS namespaces. Only this job's output is writable. A small
1 MiB sandbox `/tmp` is also available. The launcher uses two available CPUs and
RLIMITs: 2 GiB address space, 20 CPU seconds, 128 descriptors, 256 processes/threads,
no core dump; these are inherited per-process limits, not cgroup aggregate accounting.
The worker kills/reaps the sandbox process group on timeout/cancellation/exit; the PID
namespace reaper prevents surviving descendants. A subprocess timeout is not the only
protection. Use a dedicated UID and host/cgroup quotas for a production multi-user host;
P0 is not a replacement for kernel patching or a hardened hostile-code VM boundary.

Defaults: 32 MiB input, 100,000 capture records/log rows, 30s wall per version/decode
invocation, 16 MiB per output file plus monitored 16 MiB total output (10ms polling;
aggregate can overshoot between polls), one running + two queued jobs, 32 retained jobs.
Input, time, memory, output, concurrency, queue and retained-job limits are configurable
through `Config`; input cannot exceed the P0 32 MiB profile. Admission/normalization
are bounded by input/record limits; CPU/wall subprocess budgets apply to the decoder.
Do not interpret 2 GiB virtual memory as observed RSS or a throughput sizing promise.
No actual FPS/throughput/capacity claim is made.

## Contract and interpretation

`engine/contracts.py` defines **1.0-p0**. It adapts the evaluation's broader proposed
contracts without claiming P1 durable inventory. IDs for endpoints/flows/observations
are capture/profile-scoped deterministic keys; native Zeek UIDs and log row references
are preserved separately. Job IDs and native UIDs may change across runs. Source PDU
timestamps are retained; no packet numbers, offsets, identities, vulnerabilities,
incidents or risk scores are invented. Vendor/model/firmware/operational class stay null.

FC03/06/16 are the validated Modbus functions. Writes and their replies are observations,
with authorization `not_evaluated`; findings/alerts are empty. Transaction pairing is
FIFO per connection/TID/unit/function; more complex TID reuse/pipelining needs expanded
corpus coverage. Other function names remain visible with unknown operation and a
partial/unsupported quality issue. Native connection metadata is also exposed; other
OT semantic decoders/plugins are not validated in P0.

Supported admission profile: classic PCAP 2.4, microsecond precision, Ethernet; PCAPNG
1.0, one section, unknown section length, default-microsecond Ethernet interfaces and
EPB packet blocks. Interface options, other link types, packet block styles and timestamp
resolutions are conservatively rejected. Unknown ancillary blocks/packet options are
reported as limitations/partial. This is not universal PCAPNG support.

Valid empty capture: `COMPLETED` with `no_observations` and unknown completeness, never
zero risk. Unsupported/undecoded application: `PARTIAL` quality reason. Truncated frames,
missing responses, stream gaps and decoder violations: `PARTIAL`, retaining observations
that exist. Corrupt/truncated containers: `FAILED` before decoding. Missing/malformed
native logs or mismatched completion-marker row counts: `FAILED`. A normal Zeek exit
alone cannot establish completeness. Capture loss and physical device identity remain
unknown. Partial output is not proof that all plant traffic was observed.

## Compatibility and known legacy defects

The default legacy HTTP parser still parses classic PCAP per-packet, lacks TCP-stream
reassembly/PCAPNG admission and labels writes (including responses) unauthorized without
site policy. Its HTTP handler buffers uploads before its size check and lacks an auth
boundary. This PR neither exposes the new worker there nor endorses those classifications.
The pre-existing `test_engine.py` demonstration's indentation/import-path defects are
repaired and its misleading all-tests-passed message corrected. It remains a demonstration,
not an assertion suite. CI syntax-checks it and explicitly discovers the new `tests/` suite,
requiring real Zeek and bubblewrap with no engine-test skips. Existing frontend CI
checks remain enabled.

## Tests and next task

The committed corpus is eleven self-authored synthetic laboratory captures, RFC5737
addresses, fixed historical timestamps; no customer traffic. `tests/fixtures/manifest.json`
records hashes, `golden.json` records expected PDUs and `tests/make_fixtures.py` regenerates
them offline (standard library only). Fixture/generator provenance: the approved
2026-10-25 Zeek/Suricata evaluation PoC; synthetic fixtures dedicated to CC0.

Tests exercise real Zeek FC03/06/16, per-PDU times/direction, PCAPNG, segmentation and
retransmission, all negative captures, stable semantic IDs, unknown identities and no
fabricated findings. Trusted failure executables exercise the same sandbox for missing
runtime, wrong version, crashes, CPU/memory/output/wall limits, missing/malformed logs,
cancellation, descendants, bounded queue and network/filesystem/environment isolation.

P1 recommendation: durable site/address-namespace-scoped observed inventory and evidence
storage with idempotent capture/profile imports and operator-reviewed project linking.
Keep manual project bytes untouched, retain conflicting identity evidence and add an
authenticated local metadata boundary before considering UI import. No continuous
sensor, polling, auto-blocking or second decoder is implied.
