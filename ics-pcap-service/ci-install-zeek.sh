#!/usr/bin/env bash
# CI only, Ubuntu 22.04/24.04 x86_64. Never change kernel/security policy.
set -euo pipefail
work=$(mktemp -d)
trap 'rm -rf -- "$work"' EXIT
. /etc/os-release
case "$ID:$VERSION_ID:$(uname -m)" in
  ubuntu:22.04:x86_64)
    distro=22.04
    zeek_sha=f68ac153df51db5c1b5f797ff89bdfbc3a260be3ec9732f1d898b86b10d3a68c
    ;;
  ubuntu:24.04:x86_64)
    distro=24.04
    zeek_sha=49b3282617ca68f4f52b07d5125ef59b6d0d6d95ecd8dd5e702d2ba2921c5abd
    ;;
  *) echo 'Unsupported CI distribution/architecture' >&2; exit 1 ;;
esac
curl --fail --location --retry 3 \
  "https://download.opensuse.org/repositories/security:/zeek/xUbuntu_${distro}/amd64/zeek-9.0-core_9.0.0-0_amd64.deb" \
  --output "$work/zeek.deb"
echo "$zeek_sha  $work/zeek.deb" | sha256sum --check
sudo apt-get update
if test "$distro" = 22.04; then
  # Jammy's stock bwrap 0.6 lacks --size. Rebuild Noble's patched 0.9.0 source
  # for Jammy's libc; do not downgrade sandbox features or use an unpatched tarball.
  # All compilation/execution remains the ordinary runner UID, never setuid/root.
  sudo apt-get install --yes build-essential meson ninja-build pkg-config \
    libcap-dev libcap2-bin libselinux1-dev "$work/zeek.deb"
  build_root=$(mktemp -d "${RUNNER_TEMP:?}/ics-p0-bwrap.XXXXXXXX")
  archive=https://archive.ubuntu.com/ubuntu/pool/main/b/bubblewrap
  curl --fail --location --retry 3 "$archive/bubblewrap_0.9.0.orig.tar.xz" --output "$work/orig.tar.xz"
  curl --fail --location --retry 3 "$archive/bubblewrap_0.9.0-1ubuntu0.3.debian.tar.xz" --output "$work/debian.tar.xz"
  echo "c6347eaced49ac0141996f46bba3b089e5e6ea4408bc1c43bab9f2d05dd094e1  $work/orig.tar.xz" | sha256sum --check
  echo "4d6c71db380bb69d19a09501bd5caec92e46bf54c7f505805e75687daf783939  $work/debian.tar.xz" | sha256sum --check
  tar -xJf "$work/orig.tar.xz" -C "$build_root"
  source_root="$build_root/bubblewrap-0.9.0"
  tar -xJf "$work/debian.tar.xz" -C "$source_root"
  while IFS= read -r patch_name; do
    case "$patch_name" in ''|'#'*) continue ;; esac
    patch --batch --forward -d "$source_root" -p1 < "$source_root/debian/patches/$patch_name"
  done < "$source_root/debian/patches/series"
  CFLAGS='-O2 -D_FORTIFY_SOURCE=2 -fstack-protector-strong' \
  LDFLAGS='-Wl,-z,relro,-z,now' \
    meson setup "$build_root/build" "$source_root" --buildtype=release \
      -Db_pie=true -Dselinux=enabled -Dman=disabled \
      -Dbash_completion=disabled -Dzsh_completion=disabled
  meson compile -C "$build_root/build"
  bwrap="$build_root/build/bwrap"
  test ! -u "$bwrap"
  test ! -g "$bwrap"
  test -z "$(getcap "$bwrap")"
else
  sudo apt-get install --yes bubblewrap libcap2-bin "$work/zeek.deb"
  bwrap=/usr/bin/bwrap
fi
printf 'P0_BWRAP=%s\n' "$bwrap" >> "${GITHUB_ENV:?}"
"$bwrap" --version
/opt/zeek/bin/zeek --version
