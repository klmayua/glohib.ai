#!/bin/sh
# Simple HTTP health check
URL=$1
if [ -z "$URL" ]; then
  echo "Usage: health_check.sh <url>"
  exit 1
fi
curl -f -s -o /dev/null "$URL" || exit 1
