#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root"
if ! command -v codex >/dev/null 2>&1; then
  printf '%s\n' 'Codex CLI is not on PATH. Follow CODEX_CLI.md to install and sign in.' >&2
  exit 127
fi
exec codex --sandbox workspace-write --ask-for-approval on-request "$(cat prompts/codex-kickoff.txt)"
