#!/usr/bin/env bash
# CI only, Ubuntu 24.04 x86_64. No packet data leaves the runner.
set -euo pipefail
work=$(mktemp -d)
trap 'rm -rf -- "$work"' EXIT
curl --fail --location --retry 3 \
  'https://download.opensuse.org/repositories/security:/zeek/xUbuntu_24.04/amd64/zeek-9.0-core_9.0.0-0_amd64.deb' \
  --output "$work/zeek.deb"
echo "49b3282617ca68f4f52b07d5125ef59b6d0d6d95ecd8dd5e702d2ba2921c5abd  $work/zeek.deb" | sha256sum --check
sudo apt-get update
sudo apt-get install --yes bubblewrap "$work/zeek.deb"
/opt/zeek/bin/zeek --version
