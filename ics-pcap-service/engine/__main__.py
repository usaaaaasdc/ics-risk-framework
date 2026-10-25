"""Explicit local opt-in. No network listener or frontend default change."""

import argparse
import json
from .worker import Config, OfflineWorker

parser = argparse.ArgumentParser(
    description="Authorized offline Zeek 9.0.0 analysis (Linux)"
)
parser.add_argument("capture")
parser.add_argument("--enable-zeek", action="store_true")
parser.add_argument("--authorized", action="store_true")
parser.add_argument("--synthetic-fixture", action="store_true")
parser.add_argument("--site-id", default="local")
parser.add_argument("--zeek", default="/opt/zeek/bin/zeek")
parser.add_argument("--bubblewrap", default="/usr/bin/bwrap")
parser.add_argument("--runtime-root")
args = parser.parse_args()
worker = OfflineWorker(
    Config(
        enabled=args.enable_zeek,
        zeek=args.zeek,
        bubblewrap=args.bubblewrap,
        runtime_root=args.runtime_root,
    )
)
try:
    job = worker.submit(
        args.capture,
        authorized=args.authorized,
        site_id=args.site_id,
        classification="synthetic_fixture"
        if args.synthetic_fixture
        else "unvalidated_capture",
    )
    try:
        result = worker.wait(job)
    except KeyboardInterrupt:
        worker.cancel(job)
        result = worker.wait(job)
    print(json.dumps(result, indent=2, allow_nan=False))
    raise SystemExit(0 if result["state"] in {"COMPLETED", "PARTIAL"} else 1)
finally:
    worker.close()
