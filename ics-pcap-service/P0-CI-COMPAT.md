# PR #8: CI compatibility, without production changes

## Observed failures in run 40208898302

- `build`: `ubuntu-latest` selected Ubuntu 26.04; Playwright 1.57.0 refused browser
  dependency installation. Lint, type-check, unit tests and build had already passed.
  Fix: pin this job to `ubuntu-24.04`. Keep Node 20, the lockfile, Playwright version
  and every existing check unchanged.
- `zeek-offline`: Ubuntu 24.04 installed Zeek 9.0.0 and bubblewrap 0.9.0 successfully,
  but `--unshare-all` failed configuring loopback (`RTM_NEWADDR: Operation not permitted`)
  before Zeek executed. The suite correctly failed, rather than falling back.
  The old log does not contain AppArmor audit records: it proves namespace setup was
  denied, not the exact LSM rule responsible. This is consistent with Ubuntu 24.04's
  AppArmor restrictions on capabilities inside unprivileged user namespaces.

## GitHub-hosted strategy

Use the supported `ubuntu-22.04` hosted VM for the Zeek job, with the matching official
Zeek **9.0.0** Jammy package. Its SHA-256 is pinned separately from the Noble package.
Jammy permits the required unprivileged namespaces without installing/loading a new
AppArmor profile, disabling AppArmor, writing sysctls, adding capabilities, setuid,
sudo test execution or privileged containers. This selects a compatible maintained
VM image; it does not change the policy on a running host.

Jammy's stock bubblewrap 0.6.1 lacks `--size`, so using that binary would break the
unchanged production command. Instead, CI builds Ubuntu's **0.9.0-1ubuntu0.3** source
for Jammy's libc. Both original source and Debian/Ubuntu patch archives are SHA-pinned;
every patch in the distribution series is applied with failure propagation. This keeps
the same upstream release and distribution fixes as the earlier Noble binary, rather
than compiling the unpatched upstream release or dropping the bounded `/tmp` option.
PIE, stack protection, fortification, RELRO and immediate binding are enabled. SELinux
support remains enabled. The resulting ordinary-UID executable stays under RUNNER_TEMP,
is not installed setuid, and has no file capabilities. Only package/bootstrap installation
uses the pre-existing hosted-runner sudo facility; decoder/test execution never does.

The job passes only the trusted binary location through `P0_BWRAP`, which the existing
tests already support. **No production Python, Zeek scripts, resource limits or tests
are changed.** It retains the exact `--unshare-all`, network/PID/mount/user isolation,
read-only binds, capability drops, environment clearing, process cleanup and limits.
The entire eleven-capture corpus and all 20 regression methods must execute with real
Zeek, without skipped integration tests. Existing injected-failure tests remain alongside
the real decoder tests. They do not substitute for real Modbus decoding.

Read-only diagnostics record namespace sysctls (if present), current security label,
UID, kernel, binary version and absence of setuid/setgid/file capabilities. Missing tools,
denied namespaces or assertion failures still make the job fail. No continue-on-error,
shared-host networking, unsandboxed fallback or suppressed test failure is introduced.

The sandbox boundaries are unchanged, but the runner OS differs: this does not claim
to validate deployment under Noble's default AppArmor policy. A Noble deployment still
needs an administrator-approved application profile that permits sandbox setup.

## Verification

Local WSL Ubuntu 24.04, extracted Zeek 9.0.0/bubblewrap 0.9.0:

```bash
cd ics-pcap-service
P0_ZEEK=/tmp/ics-ot-poc-20261025/engines/opt/zeek/bin/zeek \
P0_BWRAP=/tmp/ics-ot-poc-20261025/engines/usr/bin/bwrap \
P0_RUNTIME_ROOT=/tmp/ics-ot-poc-20261025/engines \
python3 -m unittest discover -s tests -v
```

Executed result: **20/20 PASS, all 11 captures, zero skips**. The suite includes denial
of unavailable isolation, missing executable, network/filesystem isolation, malformed
captures/logs, cancellation/descendant termination and CPU/memory/output/time limits.
`bash -n ics-pcap-service/ci-install-zeek.sh` and `git diff --check` also pass.
The Jammy bootstrap and hosted execution must be confirmed by the new PR CI run;
local success alone is not a claim of remote CI verification.

## If a hosted image no longer permits these namespaces

Leave the check failing. Do not silently select an unsandboxed runner or skip tests.
The smallest approved change for a Noble host is an application-specific AppArmor
profile for a fixed, administrator-owned bubblewrap binary, permitting the namespace
setup/capabilities it needs; retain global restrictions and all decoder sandbox limits.
This is a security policy change and requires explicit administrator approval. Do not
add an unconfined catch-all profile, disable AppArmor or set the restriction sysctl to 0.

A dedicated runner alternative requires an ephemeral, patched Linux x86_64 VM per job,
unprivileged dedicated runner UID, user/network/mount/PID/IPC/UTS namespace support,
an approved narrowly scoped LSM policy, pinned Zeek 9.0.0 and patched bubblewrap >=0.9,
Python 3.10+, protected quota-limited spool, resource/cgroup limits and bounded retention.
No plant network, production secrets, capture interface privileges or reusable privileged
container/host socket may be exposed. Bootstrap downloads can use management networking;
decoder namespaces must have only loopback/no routes. Use a read-only repository token,
restrict eligible workflows/repositories and destroy the VM after the job. Self-hosted
execution of arbitrary fork PR code needs a separately approved trust/isolation policy.
No dedicated runner, access grant or security-policy modification is provisioned here.

## Primary references

- [GitHub supported hosted VM labels](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)
- [Ubuntu namespace restriction rationale](https://discourse.ubuntu.com/t/understanding-apparmor-user-namespace-restriction/58007)
- [Ubuntu security feature matrix](https://documentation.ubuntu.com/security/security-features/security-features-overview/)
- [Zeek Jammy packages](https://download.opensuse.org/repositories/security:/zeek/xUbuntu_22.04/amd64/)
- [Ubuntu patched source descriptor](https://archive.ubuntu.com/ubuntu/pool/main/b/bubblewrap/bubblewrap_0.9.0-1ubuntu0.3.dsc)
