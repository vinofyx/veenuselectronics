#!/usr/bin/env bash
# Runs the database migrations + security tests on a throwaway local PostgreSQL (14+).
# Usage: scripts/test-db.sh            (needs initdb/pg_ctl/psql on PATH, Linux/macOS/WSL)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA="$(mktemp -d)"; PORT="${PGTEST_PORT:-55432}"
cleanup() { pg_ctl -D "$DATA" stop -m fast >/dev/null 2>&1 || true; rm -rf "$DATA"; }
trap cleanup EXIT
initdb -D "$DATA" -A trust -U postgres >/dev/null
pg_ctl -D "$DATA" -o "-p $PORT -k $DATA" -l "$DATA/log" -w start >/dev/null
PSQL=(psql -h "$DATA" -p "$PORT" -U postgres -v ON_ERROR_STOP=1 -q)
"${PSQL[@]}" -c "create database veenus_test"
"${PSQL[@]}" -d veenus_test -f "$ROOT/supabase/tests/supabase_mock.sql"
for m in "$ROOT"/supabase/migrations/*.sql; do
  echo "Applying $(basename "$m")"; "${PSQL[@]}" -d veenus_test -f "$m" 2>&1 | grep -v NOTICE || true
  "${PSQL[@]}" -d veenus_test -f "$m" >/dev/null 2>&1 && echo "  re-applied cleanly (idempotent)"
done
"${PSQL[@]}" -d veenus_test -f "$ROOT/supabase/tests/rls_test.sql" 2>&1 | sed 's/^psql:[^ ]* NOTICE:  /  /'
