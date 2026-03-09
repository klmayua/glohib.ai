#!/bin/sh
# Glohib.ai - MinIO initialization
set -e

mc alias set local http://minio:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}

# Create buckets
for BUCKET in glohib glohib-uploads glohib-processed; do
  mc mb --ignore-existing local/${BUCKET}
  mc anonymous set download local/${BUCKET}
done

echo "MinIO buckets created."
