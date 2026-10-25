"""Local, bounded offline jobs. No HTTP listener, decoder fallback or live capture."""

from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from pathlib import Path
from threading import Event, Lock, BoundedSemaphore
import copy
import hashlib
import os
import shutil
import signal
import stat
import subprocess
import sys
import tempfile
import time
import uuid

from .capture_validation import inspect_capture
from .normalization import normalize_capture, stable

HERE = Path(__file__).resolve().parent
TERMINAL = {"COMPLETED", "PARTIAL", "FAILED", "CANCELLED"}


@dataclass(frozen=True)
class Config:
    enabled: bool = False
    zeek: str = "/opt/zeek/bin/zeek"
    bubblewrap: str = "/usr/bin/bwrap"
    # Optional administrator-owned extracted runtime, NOT user capture input.
    runtime_root: str | None = None
    max_input_bytes: int = 32 * 1024 * 1024
    wall_seconds: float = 30
    cpu_seconds: int = 20
    memory_bytes: int = 2 * 1024 * 1024 * 1024
    output_bytes: int = 16 * 1024 * 1024
    concurrency: int = 1
    queue_capacity: int = 2
    max_jobs: int = 32

    def __post_init__(self):
        if not 0 < self.max_input_bytes <= 32 * 1024 * 1024:
            raise ValueError("input limit must be 1..32 MiB")
        if (
            min(
                self.wall_seconds,
                self.cpu_seconds,
                self.memory_bytes,
                self.output_bytes,
                self.concurrency,
                self.queue_capacity,
                self.max_jobs,
            )
            <= 0
        ):
            raise ValueError("limits must be positive")


class OfflineWorker:
    """One process-local bounded queue; use one worker process at P0.

    The caller is the trusted local OS user. Paths/configuration are never accepted
    from public HTTP. Results are in-memory until forgotten/restart, not inventory.
    """

    def __init__(self, config=Config()):
        self.config = config
        self._lock = Lock()
        self._jobs = {}
        self._slots = BoundedSemaphore(config.concurrency + config.queue_capacity)
        self._pool = ThreadPoolExecutor(max_workers=config.concurrency)
        self._closed = False
        self._spool = tempfile.TemporaryDirectory(prefix="ics-zeek-")
        os.chmod(self._spool.name, 0o700)

    def submit(
        self,
        capture,
        *,
        authorized=False,
        site_id="local",
        classification="unvalidated_capture",
    ):
        if not self.config.enabled:
            raise PermissionError(
                "Zeek P0 is disabled; explicitly enable for authorized offline use"
            )
        if not authorized:
            raise PermissionError(
                "local capture authorization acknowledgement required"
            )
        if classification not in {"unvalidated_capture", "synthetic_fixture"}:
            raise ValueError("invalid classification")
        with self._lock:
            if self._closed or len(self._jobs) >= self.config.max_jobs:
                raise RuntimeError(
                    "worker closed or retained-job limit; forget terminal jobs"
                )
            if not self._slots.acquire(blocking=False):
                raise RuntimeError("job queue full")
            job_id = uuid.uuid4().hex
            folder = Path(self._spool.name) / job_id
            folder.mkdir(mode=0o700)
            try:
                # O_NOFOLLOW + fstat: reject symlinks/devices/FIFOs before reading.
                fd = os.open(
                    capture, os.O_RDONLY | os.O_NONBLOCK | getattr(os, "O_NOFOLLOW", 0)
                )
                with os.fdopen(fd, "rb") as source:
                    if not stat.S_ISREG(os.fstat(source.fileno()).st_mode):
                        raise ValueError("capture must be a regular local file")
                    if os.fstat(source.fileno()).st_size > self.config.max_input_bytes:
                        raise ValueError("input_limit")
                    with (folder / "capture").open("xb") as target:
                        copied = 0
                        while chunk := source.read(65536):
                            copied += len(chunk)
                            if copied > self.config.max_input_bytes:
                                raise ValueError("input_limit")
                            target.write(chunk)
                self._jobs[job_id] = {
                    "id": job_id,
                    "state": "QUEUED",
                    "history": ["QUEUED"],
                    "diagnostics": [],
                    "result": None,
                    "exitCode": None,
                    "artifacts": [],
                    "cancel": Event(),
                }
                self._pool.submit(self._run, job_id, folder, site_id, classification)
            except BaseException:
                shutil.rmtree(folder)
                self._slots.release()
                raise
        return job_id

    def get(self, job_id):
        with self._lock:
            return copy.deepcopy(
                {k: v for k, v in self._jobs[job_id].items() if k != "cancel"}
            )

    def cancel(self, job_id):
        with self._lock:
            self._jobs[job_id]["cancel"].set()

    def forget(self, job_id):
        with self._lock:
            if self._jobs[job_id]["state"] not in TERMINAL:
                raise RuntimeError("cancel/wait before forgetting")
            del self._jobs[job_id]
            shutil.rmtree(Path(self._spool.name) / job_id)

    def artifact(self, job_id, name):
        """Local evidence retrieval; names must match the completed manifest."""
        with self._lock:
            job = self._jobs[job_id]
            if job["state"] not in TERMINAL or name not in {
                a["name"] for a in job["artifacts"]
            }:
                raise ValueError("artifact unavailable")
            return (Path(self._spool.name) / job_id / "out" / name).read_bytes()

    def wait(self, job_id):
        while True:
            job = self.get(job_id)
            if job["state"] in TERMINAL:
                return job
            time.sleep(0.02)

    def close(self):
        with self._lock:
            self._closed = True
            for job in self._jobs.values():
                job["cancel"].set()
        self._pool.shutdown(wait=True)
        self._spool.cleanup()

    def _set(self, job_id, **values):
        with self._lock:
            job = self._jobs[job_id]
            if "state" in values:
                job["history"].append(values["state"])
            job.update(values)

    def _command(self, folder, arguments):
        c = self.config
        if sys.platform != "linux":
            raise RuntimeError(
                "Linux bubblewrap isolation required; no unsandboxed fallback"
            )
        zeek = Path(c.zeek).resolve(strict=True)
        bwrap = Path(c.bubblewrap).resolve(strict=True)
        if not os.access(zeek, os.X_OK) or not os.access(bwrap, os.X_OK):
            raise RuntimeError("Zeek/bubblewrap is not executable")
        cmd = [
            str(bwrap),
            "--unshare-all",
            "--die-with-parent",
            "--new-session",
            "--cap-drop",
            "ALL",
            "--clearenv",
            "--setenv",
            "PATH",
            "/usr/bin:/bin",
            "--setenv",
            "HOME",
            "/tmp",
            "--setenv",
            "TZ",
            "UTC",
        ]
        for path in ["/usr", "/lib", "/lib64", "/bin"]:
            if Path(path).exists():
                cmd += ["--ro-bind", path, path]
        # Never expose /home, host /tmp, /run, credentials or management sockets.
        runtime = (
            Path(c.runtime_root).resolve(strict=True)
            if c.runtime_root
            else Path("/opt/zeek")
        )
        if runtime == Path("/") or not zeek.is_relative_to(runtime):
            raise ValueError("Zeek must be under the dedicated trusted runtime root")
        cmd += [
            "--size",
            "1048576",
            "--tmpfs",
            "/tmp",
            "--ro-bind",
            str(runtime),
            str(runtime),
        ]
        if c.runtime_root:
            prefix = runtime / "opt/zeek"
            cmd += [
                "--setenv",
                "LD_LIBRARY_PATH",
                str(runtime / "usr/lib/x86_64-linux-gnu"),
            ]
        else:
            prefix = runtime
        cmd += [
            "--setenv",
            "ZEEKPATH",
            ":".join(
                str(prefix / "share/zeek" / p)
                for p in ["", "policy", "site", "builtin-plugins"]
            ),
            "--setenv",
            "ZEEK_PLUGIN_PATH",
            str(prefix / "lib/zeek/plugins"),
            "--setenv",
            "ZEEK_SPICY_MODULE_PATH",
            str(prefix / "lib/zeek/spicy"),
            "--proc",
            "/proc",
            "--dev",
            "/dev",
            "--ro-bind",
            str(HERE / "sandbox_exec.py"),
            "/launcher.py",
            "--ro-bind",
            str(HERE / "observe.zeek"),
            "/observe.zeek",
            "--ro-bind",
            str(folder / "capture"),
            "/capture",
            "--bind",
            str(folder / "out"),
            "/out",
            "--chdir",
            "/out",
            "--",
            "/usr/bin/python3",
            "-I",
            "/launcher.py",
            str(c.memory_bytes),
            str(c.cpu_seconds),
            str(c.output_bytes),
            str(zeek),
            *arguments,
        ]
        return cmd

    def _execute(self, job_id, folder, arguments, label):
        job = self._jobs[job_id]
        out = folder / "out"
        start = time.monotonic()
        with (
            (out / f"{label}.stdout").open("wb") as stdout,
            (out / f"{label}.stderr").open("wb") as stderr,
        ):
            child = subprocess.Popen(
                self._command(folder, arguments),
                stdin=subprocess.DEVNULL,
                stdout=stdout,
                stderr=stderr,
                start_new_session=True,
                env={"PATH": "/usr/bin:/bin"},
                close_fds=True,
            )
            try:
                while child.poll() is None:
                    if job["cancel"].is_set():
                        raise InterruptedError("cancelled")
                    if time.monotonic() - start > self.config.wall_seconds:
                        raise TimeoutError("runtime_limit")
                    if (
                        sum(p.lstat().st_size for p in out.iterdir())
                        > self.config.output_bytes
                    ):
                        raise RuntimeError("output_limit")
                    time.sleep(0.01)
            finally:
                # Always kill the whole sandbox, including descendants on normal exit.
                try:
                    os.killpg(child.pid, signal.SIGKILL)
                except ProcessLookupError:
                    pass
                child.wait()
                self._set(job_id, exitCode=child.returncode)
        self._set(job_id, exitCode=child.returncode)
        if sum(p.lstat().st_size for p in out.iterdir()) > self.config.output_bytes:
            raise RuntimeError("output_limit")
        if child.returncode:
            raise RuntimeError(f"zeek_{label}_exit:{child.returncode}")
        output = out / f"{label}.stdout"
        if output.is_symlink() or not output.is_file():
            raise RuntimeError("unsafe_output")
        return output.read_text(errors="replace").strip()

    def _run(self, job_id, folder, site_id, classification):
        result, state, diagnostics = None, "FAILED", []
        out = folder / "out"
        out.mkdir(mode=0o700)
        try:
            if self._jobs[job_id]["cancel"].is_set():
                raise InterruptedError("cancelled")
            self._set(job_id, state="PROCESSING")
            admission = inspect_capture(folder / "capture")
            self._set(job_id, captureSha256=admission["sha256"])
            if admission["issues"] != ["no_observations"] and not admission["admitted"]:
                raise ValueError(",".join(admission["issues"]))
            version = self._execute(job_id, folder, ["--version"], "version")
            if version not in {
                "zeek version 9.0.0",
                f"{Path(self.config.zeek).resolve()} version 9.0.0",
            }:
                raise RuntimeError(f"unsupported_zeek_version:{version[:100]}")
            profile = {
                "engine": "Zeek",
                "version": "9.0.0",
                "executableSha256": hashlib.sha256(
                    Path(self.config.zeek).read_bytes()
                ).hexdigest(),
                "scriptSha256": hashlib.sha256(
                    (HERE / "observe.zeek").read_bytes()
                ).hexdigest(),
                "normalizerSha256": hashlib.sha256(
                    (HERE / "normalization.py").read_bytes()
                ).hexdigest(),
            }
            profile["admissionSha256"] = hashlib.sha256(
                (HERE / "capture_validation.py").read_bytes()
            ).hexdigest()
            profile["launcherSha256"] = hashlib.sha256(
                (HERE / "sandbox_exec.py").read_bytes()
            ).hexdigest()
            profile["limits"] = {
                "inputBytes": self.config.max_input_bytes,
                "wallSeconds": self.config.wall_seconds,
                "cpuSeconds": self.config.cpu_seconds,
                "memoryBytes": self.config.memory_bytes,
                "outputBytes": self.config.output_bytes,
            }
            profile["sha256"] = stable(profile)
            if admission["admitted"]:
                self._execute(
                    job_id, folder, ["-r", "/capture", "/observe.zeek"], "decode"
                )
            result = normalize_capture(
                folder / "capture", out, profile, job_id, site_id, classification
            )
            if (out / "decode.stderr").exists() and (
                out / "decode.stderr"
            ).stat().st_size:
                result["quality"]["issues"].append("decoder_stderr")
                result["quality"]["completeness"] = "partial"
                result["captureJob"]["status"] = "partial"
            state = result["captureJob"]["status"].upper()
            if self._jobs[job_id]["cancel"].is_set():
                raise InterruptedError("cancelled")
        except InterruptedError as exc:
            state, diagnostics = "CANCELLED", [str(exc)]
            result = None
        except Exception as exc:
            diagnostics = [f"{type(exc).__name__}:{str(exc)[:1000]}"]
        finally:
            artifacts = []
            for p in sorted(out.iterdir()):
                if p.is_file() and not p.is_symlink():
                    artifacts.append(
                        {
                            "name": p.name,
                            "bytes": p.stat().st_size,
                            "sha256": hashlib.sha256(p.read_bytes()).hexdigest(),
                        }
                    )
                    if p.suffix == ".stderr" and p.stat().st_size:
                        diagnostics.append(p.read_text(errors="replace")[:4096])
            if result:
                result["captureJob"]["status"] = state
            (folder / "capture").unlink()
            self._set(
                job_id,
                state=state,
                diagnostics=diagnostics,
                result=result,
                artifacts=artifacts,
            )
            self._slots.release()
