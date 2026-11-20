#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# CI kiểm bytecode theo declare_id, không cần private key triển khai.
build_args=(--no-idl --tools-version v1.57 --arch v3)
if [[ $# -eq 1 && "$1" == "--ci" ]]; then
  build_args+=(--ignore-keys)
elif [[ $# -ne 0 ]]; then
  printf 'Usage: bash scripts/check-lab.sh [--ci]\n' >&2
  exit 2
fi

anchor_bin="${ANCHOR_BIN:-anchor}"
lock_before="$(cksum Cargo.lock)"
cargo fmt --all -- --check
"$anchor_bin" build "${build_args[@]}" -- -- --locked
mkdir -p target/idl target/types
"$anchor_bin" idl build -p phase3_hello -o target/idl/phase3_hello.json -t target/types/phase3_hello.ts -- --locked
cargo test --locked --workspace
if [[ "$(cksum Cargo.lock)" != "$lock_before" ]]; then
  printf 'Cargo.lock changed during the check.\n' >&2
  exit 1
fi
