#!/bin/bash
# GlohibAI PostgreSQL Backup Script
# Automated daily backups with retention policy

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/backups/postgres}"
DB_NAME="${POSTGRES_DB:-glohib_db}"
DB_USER="${POSTGRES_USER:-glohib}"
DB_HOST="${POSTGRES_HOST:-postgres}"
DB_PORT="${POSTGRES_PORT:-5432}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo "Starting PostgreSQL backup at $(date)"
echo "Database: ${DB_NAME}"
echo "Backup file: ${BACKUP_FILE}"

# Perform backup
PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
    -h "${DB_HOST}" \
    -p "${DB_PORT}" \
    -U "${DB_USER}" \
    -d "${DB_NAME}" \
    -F c \
    -f "${BACKUP_FILE}.tmp"

# Compress the backup
gzip "${BACKUP_FILE}.tmp"
mv "${BACKUP_FILE}.tmp.gz" "${BACKUP_FILE}"

# Verify backup
if [ -f "${BACKUP_FILE}" ]; then
    BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    echo "Backup completed successfully: ${BACKUP_SIZE}"
else
    echo "ERROR: Backup file not created!"
    exit 1
fi

# Cleanup old backups
echo "Cleaning up backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete

# List remaining backups
echo "Remaining backups:"
ls -lh "${BACKUP_DIR}"/*.sql.gz 2>/dev/null || echo "No backups found"

echo "Backup process completed at $(date)"
