#!/usr/bin/env bash
# Glohib.ai - Run All Database Migrations
# Usage: ./run_all_migrations.sh [database_name]
# Default database: glohib

set -euo pipefail

DB=${1:-glohib}

echo "==> Running migrations on database: $DB"

for f in migrations/*.sql; do
    echo "==> $f"
    psql -v ON_ERROR_STOP=1 -d "$DB" -f "$f"
done

echo "✅ All migrations applied to $DB"
