#!/bin/bash
# GlohibAI Redis Backup Script
# RDB snapshot backups

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/backups/redis}"
REDIS_HOST="${REDIS_HOST:-redis}"
REDIS_PORT="${REDIS_PORT:-6379}"
REDIS_PASSWORD="${REDIS_PASSWORD:-}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/redis_${TIMESTAMP}.rdb"

# Create backup directory
mkdir -p "${BACKUP_DIR}"

echo "Starting Redis backup at $(date)"

# Use redis-cli to trigger BGSAVE and wait for completion
if [ -n "${REDIS_PASSWORD}" ]; then
    redis-cli -h "${REDIS_HOST}" -p "${REDIS_PORT}" -a "${REDIS_PASSWORD}" BGSAVE
else
    redis-cli -h "${REDIS_HOST}" -p "${REDIS_PORT}" BGSAVE
fi

# Wait for BGSAVE to complete
echo "Waiting for BGSAVE to complete..."
sleep 5

# Copy the RDB file (assuming Redis is running in a container with shared volume)
# Adjust this path based on your Redis configuration
REDIS_DATA_DIR="${REDIS_DATA_DIR:-/data}"
if [ -f "${REDIS_DATA_DIR}/dump.rdb" ]; then
    cp "${REDIS_DATA_DIR}/dump.rdb" "${BACKUP_FILE}"
    echo "Backup saved to: ${BACKUP_FILE}"
    
    # Compress the backup
    gzip "${BACKUP_FILE}"
    echo "Backup compressed: ${BACKUP_FILE}.gz"
else
    echo "Warning: Redis dump.rdb not found at ${REDIS_DATA_DIR}"
    echo "Make sure Redis persistence is configured correctly"
fi

# Cleanup old backups
echo "Cleaning up backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "*.rdb.gz" -type f -mtime +${RETENTION_DAYS} -delete

echo "Redis backup completed at $(date)"
