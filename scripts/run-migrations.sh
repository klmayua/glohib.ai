#!/bin/bash
set -e
echo "Waiting for PostgreSQL..."
until pg_isready -h "${POSTGRES_HOST:-postgres}" -U "${POSTGRES_USER:-glohib}" -q; do
  sleep 1
done
echo "PostgreSQL is ready. Running migrations..."
for f in /migrations/*.sql; do
  echo "Applying: $f"
  psql -h "${POSTGRES_HOST:-postgres}" -U "${POSTGRES_USER:-glohib}" -d "${POSTGRES_DB:-glohib_db}" -f "$f"
done
echo "All migrations applied."
