#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Cached compilers only. No wrapper that installs tools or creates deployment keys.
if [[ $# -ne 0 ]]; then
  printf 'Usage: bash scripts/check-phase3-offline.sh\n' >&2
  exit 2
fi
platform_tools="${PHASE3_PLATFORM_TOOLS:-$HOME/.cache/solana/v1.57/platform-tools}"
host_tools="${PHASE3_HOST_TOOLS:-$HOME/.rustup/toolchains/1.100.0-aarch64-apple-darwin/bin}"
for executable in "$platform_tools/rust/bin/cargo" "$platform_tools/rust/bin/rustc" \
  "$platform_tools/llvm/bin/llvm-objcopy" "$platform_tools/llvm/bin/clang" \
  "$platform_tools/llvm/bin/llvm-ar" "$host_tools/cargo" "$host_tools/rustc" \
  "$host_tools/rustdoc" "$host_tools/rustfmt" "$host_tools/cargo-fmt"; do
  if [[ ! -x "$executable" ]]; then
    printf 'Missing cached executable; ask before installing: %s\n' "$executable" >&2
    exit 2
  fi
done

output_dir="$PWD/target/phase3-offline"
lock_before="$(cksum Cargo.lock)"
started_at="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
start_seconds="$(date +%s)"
export CARGO_NET_OFFLINE=true CARGO_TERM_COLOR=never
unset RUSTUP_TOOLCHAIN RUSTFLAGS CARGO_ENCODED_RUSTFLAGS CARGO_TARGET_DIR
export PATH="$host_tools:$PATH"
export RUSTC="$host_tools/rustc" RUSTDOC="$host_tools/rustdoc" RUSTFMT="$host_tools/rustfmt"
"$host_tools/cargo" --version
"$host_tools/rustc" --version
"$platform_tools/rust/bin/rustc" --version
"$host_tools/cargo" fmt --all -- --check
(
  export RUSTC="$platform_tools/rust/bin/rustc" RUSTDOC="$platform_tools/rust/bin/rustdoc"
  export CC="$platform_tools/llvm/bin/clang" AR="$platform_tools/llvm/bin/llvm-ar"
  export CARGO_TARGET_SBPFV3_SOLANA_SOLANA_RUSTFLAGS='-C link-arg=-z -C link-arg=defs -Zremap-cwd-prefix='
  "$platform_tools/rust/bin/cargo" build --offline --locked --release --workspace --lib \
    --target sbpfv3-solana-solana --target-dir "$output_dir/build"
)
mkdir -p "$output_dir/deploy"
for program in phase3_hello receiptrail; do
  "$platform_tools/llvm/bin/llvm-objcopy" --strip-all \
    "$output_dir/build/sbpfv3-solana-solana/release/$program.so" \
    "$output_dir/deploy/$program.so"
done
export RECEIPTRAIL_SO="$output_dir/deploy/receiptrail.so"
"$host_tools/cargo" test --offline --locked --workspace --target-dir "$output_dir" \
  -- --nocapture --test-threads=1
[[ "$(cksum Cargo.lock)" == "$lock_before" ]] || { printf 'Cargo.lock changed.\n' >&2; exit 1; }
if compgen -G "$output_dir/deploy/*keypair*" > /dev/null; then
  printf 'Unexpected signer artifact in offline output.\n' >&2
  exit 1
fi
printf 'Started: %s; elapsed_seconds=%s\n' "$started_at" "$(( $(date +%s) - start_seconds ))"
shasum -a 256 Cargo.lock scripts/check-phase3-offline.sh \
  "$output_dir/deploy/phase3_hello.so" "$output_dir/deploy/receiptrail.so"
