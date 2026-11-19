#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
# All tooling is already cached. Missing modules fail; this runner never installs.
node scripts/generate-receiptrail-client.mjs --check
node --experimental-vm-modules --test packages/receiptrail-client/tests/*.test.mjs
node --test tools/receiptrail-devnet/checks.test.mjs
node --check tools/receiptrail-devnet/smoke.mjs
node --check tools/receiptrail-devnet/deploy.mjs
node --check tools/receiptrail-devnet/verify.mjs
node apps/web/node_modules/typescript/bin/tsc --noEmit --strict --skipLibCheck --target ES2022 --module NodeNext --moduleResolution NodeNext packages/receiptrail-client/tests/typecheck.mts
