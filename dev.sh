#!/usr/bin/env bash
set -euo pipefail
trap 'kill 0' EXIT
pnpm --dir api develop &
pnpm --dir web dev &
wait