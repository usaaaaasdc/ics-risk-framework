"""Real Zeek corpus plus isolated failure injection. Requires Linux/bubblewrap."""

from dataclasses import replace
from pathlib import Path
import hashlib
import json
import os
import shutil
import tempfile
import time
import unittest

from engine.capture_validation import inspect_capture
from engine.worker import Config, OfflineWorker

FIXTURES = Path(__file__).parent / "fixtures"


def configuration(**kwargs):
    return replace(
        Config(
            enabled=True,
            zeek=os.environ.get("P0_ZEEK", "/opt/zeek/bin/zeek"),
            bubblewrap=os.environ.get("P0_BWRAP", "/usr/bin/bwrap"),
            runtime_root=os.environ.get("P0_RUNTIME_ROOT"),
        ),
        **kwargs,
    )


class CorpusTests(unittest.TestCase):
    def setUp(self):
        self.worker = OfflineWorker(configuration())
        self.addCleanup(self.worker.close)

    def analyze(self, name):
        job = self.worker.submit(
            FIXTURES / name,
            authorized=True,
            site_id="synthetic-lab",
            classification="synthetic_fixture",
        )
        return self.worker.wait(job)

    def test_golden_pcap_pcapng_and_stream_reassembly(self):
        expected = [
            (1, 3, "request", "read"),
            (1, 3, "response", "read"),
            (2, 6, "request", "write"),
            (2, 6, "response", "write"),
            (3, 16, "request", "write"),
            (3, 16, "response", "write"),
        ]
        for name in ["good.pcap", "good.pcapng", "segmented-retransmit.pcap"]:
            with self.subTest(name=name):
                job = self.analyze(name)
                self.assertEqual(job["state"], "COMPLETED", job["diagnostics"])
                self.assertEqual(job["history"], ["QUEUED", "PROCESSING", "COMPLETED"])
                r = job["result"]
                self.assertEqual(
                    [
                        (
                            o["transactionId"],
                            o["functionCode"],
                            o["direction"],
                            o["operation"],
                        )
                        for o in r["protocolObservations"]
                    ],
                    expected,
                )
                self.assertEqual(
                    [t["status"] for t in r["transactions"]], ["paired"] * 3
                )
                self.assertEqual(
                    r["captureJob"]["sha256"],
                    hashlib.sha256((FIXTURES / name).read_bytes()).hexdigest(),
                )
                self.assertEqual(r["dataClassification"], "synthetic_fixture")
                self.assertEqual(r["alerts"], [])
                self.assertEqual(r["findings"], [])
                for o in r["protocolObservations"]:
                    self.assertEqual(o["authorization"], "not_evaluated")
                    self.assertIsNone(o["evidence"]["packetOrdinals"])
                    self.assertTrue(o["evidence"]["nativeFlowId"])
                    self.assertEqual(o["unitId"], 1)
                    request = o["direction"] == "request"
                    self.assertEqual(
                        o["source"],
                        {
                            "ip": "192.0.2.10" if request else "192.0.2.20",
                            "port": 41000 if request else 502,
                        },
                    )
                for a in r["assets"]:
                    for k in [
                        "vendor",
                        "model",
                        "firmware",
                        "deviceClass",
                        "operationalFunction",
                    ]:
                        self.assertIsNone(a["identity"][k])
                if name != "segmented-retransmit.pcap":
                    self.assertEqual(
                        [o["sourceEpochSeconds"] for o in r["protocolObservations"]],
                        [1700000000 + x / 100 for x in range(3, 9)],
                    )
                self.assertTrue(self.worker.artifact(job["id"], "modbus.log"))

    def test_all_negative_and_partial_fixtures(self):
        expected = {
            "request-only.pcap": ("PARTIAL", "response_not_observed"),
            "truncated-packet.pcap": ("PARTIAL", "truncated_frame"),
            "not-modbus-on-502.pcap": ("PARTIAL", "undecoded_application"),
            "malformed-mbap.pcap": ("PARTIAL", "invalid_mbap"),
            "unsupported-link.pcap": ("FAILED", "unsupported_linktype"),
            "empty.pcap": ("COMPLETED", "no_observations"),
            "malformed.bin": ("FAILED", "invalid_container"),
            "truncated-container.pcap": ("FAILED", "truncated_container"),
        }
        for name, (state, reason) in expected.items():
            with self.subTest(name=name):
                job = self.analyze(name)
                self.assertEqual(job["state"], state, job)
                self.assertIn(reason, json.dumps(job))
                if name not in {"request-only.pcap"} and job["result"]:
                    self.assertEqual(job["result"]["protocolObservations"], [])
                if state == "FAILED":
                    self.assertIsNone(job["result"])
                    self.assertIsNone(job["exitCode"])  # rejected before decoder start

    def test_stable_semantics_not_native_uids(self):
        a, b = [self.analyze("good.pcap")["result"] for _ in range(2)]
        for key in ["flows", "protocolObservations", "transactions", "assets"]:
            self.assertEqual([v["id"] for v in a[key]], [v["id"] for v in b[key]])
        self.assertNotEqual(a["captureJob"]["id"], b["captureJob"]["id"])

    def test_fixture_hashes(self):
        for entry in json.loads((FIXTURES / "manifest.json").read_text()):
            self.assertEqual(
                hashlib.sha256((FIXTURES / entry["file"]).read_bytes()).hexdigest(),
                entry["sha256"],
            )

    def test_unknown_zeek_and_no_fallback(self):
        worker = OfflineWorker(configuration(zeek="/missing/zeek"))
        self.addCleanup(worker.close)
        job = worker.wait(worker.submit(FIXTURES / "good.pcap", authorized=True))
        self.assertEqual(job["state"], "FAILED")
        self.assertIsNone(job["result"])

    def test_missing_isolation_fails_closed(self):
        worker = OfflineWorker(configuration(bubblewrap="/missing/bwrap"))
        self.addCleanup(worker.close)
        job = worker.wait(worker.submit(FIXTURES / "good.pcap", authorized=True))
        self.assertEqual(job["state"], "FAILED")
        self.assertIsNone(job["result"])


class GuardTests(unittest.TestCase):
    def test_disabled_and_unauthorized(self):
        for config, authorization in [(Config(), True), (configuration(), False)]:
            worker = OfflineWorker(config)
            try:
                with self.assertRaises(PermissionError):
                    worker.submit(FIXTURES / "good.pcap", authorized=authorization)
            finally:
                worker.close()

    def test_size_file_type_and_filename_irrelevance(self):
        worker = OfflineWorker(configuration(max_input_bytes=100))
        self.addCleanup(worker.close)
        with self.assertRaisesRegex(ValueError, "input_limit"):
            worker.submit(FIXTURES / "good.pcap", authorized=True)
        with self.assertRaises(ValueError):
            worker.submit("/dev/null", authorized=True)
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "not-a-capture.txt"
            shutil.copyfile(FIXTURES / "good.pcap", p)
            self.assertTrue(inspect_capture(p)["admitted"])
            p.unlink()
            p.symlink_to(FIXTURES.resolve() / "good.pcap")
            with self.assertRaises(OSError):
                worker.submit(p, authorized=True)


class FailureTests(unittest.TestCase):
    """Trusted test executable runs INSIDE the same production sandbox/limits."""

    def fake(self, body, **limits):
        temp = tempfile.TemporaryDirectory(prefix="ics-fake-runtime-")
        self.addCleanup(temp.cleanup)
        root = Path(temp.name)
        executable = root / "zeek"
        executable.write_text(
            "#!/usr/bin/python3\nimport sys, os, time, json, socket\n"
            'if "--version" in sys.argv:\n'
            ' print(sys.argv[0] + " version 9.0.0"); sys.exit()\n' + body
        )
        executable.chmod(0o700)
        worker = OfflineWorker(
            configuration(zeek=str(executable), runtime_root=str(root), **limits)
        )
        self.addCleanup(worker.close)
        return worker

    def run_job(self, worker):
        return worker.wait(worker.submit(FIXTURES / "good.pcap", authorized=True))

    def test_crash(self):
        job = self.run_job(self.fake("os.kill(os.getpid(), 11)\n"))
        self.assertEqual(job["state"], "FAILED")
        self.assertNotEqual(job["exitCode"], 0)

    def test_timeout(self):
        job = self.run_job(self.fake("time.sleep(10)\n", wall_seconds=0.5))
        self.assertEqual(job["state"], "FAILED")
        self.assertIn("runtime_limit", str(job["diagnostics"]))
        self.assertIsNotNone(job["exitCode"])

    def test_cpu_limit(self):
        job = self.run_job(
            self.fake("while True: pass\n", cpu_seconds=1, wall_seconds=5)
        )
        self.assertEqual(job["state"], "FAILED")
        self.assertNotEqual(job["exitCode"], 0)

    def test_descendants_stop_with_cancel(self):
        worker = self.fake("""pid = os.fork()
if pid == 0:
 while True:
  with open("child.log", "a") as f: f.write("x")
  time.sleep(.01)
else:
 time.sleep(10)
""")
        job_id = worker.submit(FIXTURES / "good.pcap", authorized=True)
        deadline = time.monotonic() + 5
        while not (Path(worker._spool.name) / job_id / "out" / "child.log").exists():
            self.assertLess(time.monotonic(), deadline)
            time.sleep(0.01)
        worker.cancel(job_id)
        self.assertEqual(worker.wait(job_id)["state"], "CANCELLED")
        before = worker.artifact(job_id, "child.log")
        time.sleep(0.1)
        self.assertEqual(before, worker.artifact(job_id, "child.log"))

    def test_unsupported_version(self):
        worker = self.fake("pass\n")
        p = Path(worker.config.zeek)
        p.write_text(p.read_text().replace("version 9.0.0", "version 8.0.0"))
        p.chmod(0o700)
        job = self.run_job(worker)
        self.assertEqual(job["state"], "FAILED")
        self.assertIn("unsupported_zeek_version", str(job["diagnostics"]))

    def test_missing_completion(self):
        job = self.run_job(self.fake("pass\n"))
        self.assertEqual(job["state"], "FAILED")
        self.assertIsNone(job["result"])

    def test_missing_expected_output(self):
        job = self.run_job(
            self.fake('open("complete.marker","w").write("ics-zeek-p0-v1 1 6")\n')
        )
        self.assertEqual(job["state"], "FAILED")
        self.assertIn("missing_or_incomplete_output", str(job["diagnostics"]))

    def test_malformed_json(self):
        job = self.run_job(
            self.fake(
                'open("complete.marker","w").write("ics-zeek-p0-v1 1 0")\n'
                'open("conn.log","w").write("{bad\\n")\n'
            )
        )
        self.assertEqual(job["state"], "FAILED")

    def test_output_limit(self):
        job = self.run_job(
            self.fake('open("huge.log","wb").write(b"x" * 100000)\n', output_bytes=1024)
        )
        self.assertEqual(job["state"], "FAILED")

    def test_memory_limit(self):
        job = self.run_job(
            self.fake("x = bytearray(500000000)\n", memory_bytes=64 * 1024 * 1024)
        )
        self.assertEqual(job["state"], "FAILED")
        self.assertIn("MemoryError", str(job["diagnostics"]))

    def test_cancel_running_queued_and_queue_limits(self):
        worker = self.fake("time.sleep(10)\n", concurrency=1, queue_capacity=1)
        first = worker.submit(FIXTURES / "good.pcap", authorized=True)
        while worker.get(first)["state"] == "QUEUED":
            time.sleep(0.01)
        second = worker.submit(FIXTURES / "good.pcap", authorized=True)
        with self.assertRaisesRegex(RuntimeError, "queue full"):
            worker.submit(FIXTURES / "good.pcap", authorized=True)
        worker.cancel(second)
        worker.cancel(first)
        self.assertEqual(worker.wait(first)["state"], "CANCELLED")
        self.assertEqual(worker.wait(second)["state"], "CANCELLED")
        worker.forget(first)
        with self.assertRaises(KeyError):
            worker.get(first)

    def test_network_filesystem_and_environment_isolation(self):
        body = """probe = {"interfaces": socket.if_nameindex(), "home": os.path.exists("/home/Os"),
 "routes": open("/proc/net/route").read(), "environment": dict(os.environ)}
try:
 socket.create_connection(("192.0.2.123", 502), timeout=.1)
 probe["external_connection"] = True
except OSError:
 probe["external_connection"] = False
open("probe.json", "w").write(json.dumps(probe))
open("complete.marker", "w").write("ics-zeek-p0-v1 0 0")
"""
        worker = self.fake(body)
        job = self.run_job(worker)
        probe = json.loads(worker.artifact(job["id"], "probe.json"))
        self.assertEqual(probe["interfaces"], [[1, "lo"]])
        self.assertFalse(probe["external_connection"])
        self.assertFalse(probe["home"])
        self.assertEqual(len(probe["routes"].strip().splitlines()), 1)
        self.assertNotIn("PYTHONPATH", probe["environment"])
        with self.assertRaises(ValueError):
            worker.artifact(job["id"], "../../capture")


if __name__ == "__main__":
    unittest.main()
