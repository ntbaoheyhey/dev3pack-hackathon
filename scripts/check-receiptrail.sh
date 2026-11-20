#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Build/test only. No installer, validator, wallet file, deploy, RPC or key generation.
platform_tools="${RECEIPTRAIL_PLATFORM_TOOLS:-$HOME/.cache/solana/v1.57/platform-tools}"
host_tools="${RECEIPTRAIL_HOST_TOOLS:-$HOME/.rustup/toolchains/1.100.0-aarch64-apple-darwin/bin}"
host_cargo="$host_tools/cargo"
for executable in "$platform_tools/rust/bin/cargo" "$platform_tools/rust/bin/rustc" "$platform_tools/llvm/bin/llvm-objcopy" "$host_cargo" "$host_tools/rustc" "$host_tools/rustdoc" "$host_tools/rustfmt" "$host_tools/cargo-fmt"; do
  if [[ ! -x "$executable" ]]; then
    printf 'Missing cached executable; ask before installing: %s\n' "$executable" >&2
    exit 2
  fi
done
lock_before="$(cksum Cargo.lock)"
started_at="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
start_seconds="$(date +%s)"
export CARGO_NET_OFFLINE=true
export CARGO_TERM_COLOR=never
unset RUSTUP_TOOLCHAIN RUSTFLAGS CARGO_ENCODED_RUSTFLAGS
export PATH="$host_tools:$PATH"
export RUSTC="$host_tools/rustc"
export RUSTDOC="$host_tools/rustdoc"
export RUSTFMT="$host_tools/rustfmt"
"$host_cargo" fmt -p receiptrail -- --check
(
  unset RUSTFLAGS CARGO_ENCODED_RUSTFLAGS
  export RUSTC="$platform_tools/rust/bin/rustc"
  export RUSTDOC="$platform_tools/rust/bin/rustdoc"
  export CC="$platform_tools/llvm/bin/clang"
  export AR="$platform_tools/llvm/bin/llvm-ar"
  export CARGO_TARGET_SBPFV3_SOLANA_SOLANA_RUSTFLAGS='-C link-arg=-z -C link-arg=defs -Zremap-cwd-prefix='
  "$platform_tools/rust/bin/cargo" build --offline --locked --release --lib -p receiptrail \
    --target sbpfv3-solana-solana --target-dir target/receiptrail-build
)
mkdir -p target/receiptrail-spike
"$platform_tools/llvm/bin/llvm-objcopy" --strip-all \
  target/receiptrail-build/sbpfv3-solana-solana/release/receiptrail.so \
  target/receiptrail-spike/receiptrail.so
export RECEIPTRAIL_SO="$PWD/target/receiptrail-spike/receiptrail.so"
"$host_cargo" test -p receiptrail --offline --locked -- --nocapture --test-threads=1
[[ "$(cksum Cargo.lock)" == "$lock_before" ]] || { printf 'Cargo.lock changed.\n' >&2; exit 1; }
if compgen -G 'target/receiptrail-spike/*keypair*' > /dev/null; then
  printf 'Unexpected signer artifact in spike output.\n' >&2
  exit 1
fi
printf 'Started: %s; elapsed_seconds=%s\n' "$started_at" "$(( $(date +%s) - start_seconds ))"
shasum -a 256 programs/receiptrail/src/lib.rs programs/receiptrail/tests/runtime.rs Cargo.lock target/receiptrail-spike/receiptrail.so
