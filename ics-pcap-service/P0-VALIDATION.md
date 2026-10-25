# P0 validation — 2026-10-25

Base: origin/main 792b3c3eac79ea0b2d8fc46821d1fc9ea454bc64.
Implementation branch: feat/zeek-offline-p0, isolated worktree.
Original feat/analytics-ai-ui eb49c20816b84f42ad0db2990baacff4dcfa4e19 stayed clean.

| Executed check | Actual result |
|---|---|
| Linux Python 3.12.3 + Zeek 9.0.0 + bubblewrap 0.9.0 regression suite | PASS: 20 methods, all 11 fixtures, zero skips |
| Python static undefined/unused-name check (ruff 0.14.0, select F) | PASS |
| Legacy demonstration syntax and execution | PASS execution; does not validate its security classifications |
| npm run lint | PASS: 0 errors, 55 existing warnings |
| npm run type-check | PASS |
| npm run test -- --run | PASS: 24 tests / 6 files |
| npm run build | PASS: all 31 routes generated |
| CI=true npm run test:e2e | PASS: 33 Chromium tests, 1.9 minutes |
| bash -n ics-pcap-service/ci-install-zeek.sh | PASS |
| git diff --check | PASS |

Frontend checks used Windows Node 24.19.0 / npm 11.17.0. Existing remote frontend
CI uses Node 20; remote results must be read from the PR rather than inferred here.
The first build with a node_modules junction failed on Turbopack's filesystem-root
restriction. The junction was removed; npm ci installed local worktree dependencies,
and the unchanged build command passed. No package/lockfile was changed.

## Exact Linux test command on this workstation

```bash
cd /mnt/c/Users/Os/ics-risk-framework-zeek-p0/ics-pcap-service
P0_ZEEK=/tmp/ics-ot-poc-20261025/engines/opt/zeek/bin/zeek \
P0_BWRAP=/tmp/ics-ot-poc-20261025/engines/usr/bin/bwrap \
P0_RUNTIME_ROOT=/tmp/ics-ot-poc-20261025/engines \
python3 -m unittest discover -s tests -v
```

With a standard installed runtime, use `python3 -m unittest discover -s tests -v`
in ics-pcap-service. No test silently skips missing tools. The CI installer is hash-pinned;
its sudo/apt installation path is exercised by remote CI, not claimed as a local install.
Local tests use the extracted evaluation runtime plus bubblewrap, without system install.

[Running instructions and limits](P0-ZEEK.md).
[Actual FC06 normalized request/response excerpt](example-modbus.json): synthetic
capture hash e44a83bb3b5148efc40d4a798443d1a4341574f03428a91f990f8c21f11cfee3,
6 observed PDUs, 3 paired transactions; no findings/alerts. Example IDs/Zeek UIDs are
from the documented run and not golden values for another profile/runtime.

## Exact changed files

- `.gitattributes`
- `.github/workflows/ci.yml`
- `.gitignore`
- `ics-pcap-service/P0-VALIDATION.md`
- `ics-pcap-service/P0-ZEEK.md`
- `ics-pcap-service/ci-install-zeek.sh`
- `ics-pcap-service/engine/__init__.py`
- `ics-pcap-service/engine/__main__.py`
- `ics-pcap-service/engine/capture_validation.py`
- `ics-pcap-service/engine/contracts.py`
- `ics-pcap-service/engine/normalization.py`
- `ics-pcap-service/engine/observe.zeek`
- `ics-pcap-service/engine/sandbox_exec.py`
- `ics-pcap-service/engine/worker.py`
- `ics-pcap-service/example-modbus.json`
- `ics-pcap-service/test_engine.py`
- `ics-pcap-service/tests/fixtures/empty.pcap`
- `ics-pcap-service/tests/fixtures/golden.json`
- `ics-pcap-service/tests/fixtures/good.pcap`
- `ics-pcap-service/tests/fixtures/good.pcapng`
- `ics-pcap-service/tests/fixtures/malformed-mbap.pcap`
- `ics-pcap-service/tests/fixtures/malformed.bin`
- `ics-pcap-service/tests/fixtures/manifest.json`
- `ics-pcap-service/tests/fixtures/not-modbus-on-502.pcap`
- `ics-pcap-service/tests/fixtures/request-only.pcap`
- `ics-pcap-service/tests/fixtures/segmented-retransmit.pcap`
- `ics-pcap-service/tests/fixtures/truncated-container.pcap`
- `ics-pcap-service/tests/fixtures/truncated-packet.pcap`
- `ics-pcap-service/tests/fixtures/unsupported-link.pcap`
- `ics-pcap-service/tests/make_fixtures.py`
- `ics-pcap-service/tests/test_offline.py`
