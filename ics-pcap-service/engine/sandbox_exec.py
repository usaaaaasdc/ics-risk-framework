"""Trusted launcher, executed inside bubblewrap; never accepts capture scripts."""

import os
import resource
import sys

memory, cpu, output = map(int, sys.argv[1:4])
for kind, limit in [
    (resource.RLIMIT_AS, memory),
    (resource.RLIMIT_CPU, cpu),
    (resource.RLIMIT_FSIZE, output),
    (resource.RLIMIT_NOFILE, 128),
    (resource.RLIMIT_CORE, 0),
    (resource.RLIMIT_NPROC, 256),
]:
    resource.setrlimit(kind, (limit, limit))
os.sched_setaffinity(0, sorted(os.sched_getaffinity(0))[:2])
os.umask(0o077)
os.execv(sys.argv[4], sys.argv[4:])
