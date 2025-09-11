#!/bin/sh
# run as root (image should start as root for this to run),
# fix permissions for /app and /app/logs if necessary, then drop to nestjs
set -e

# if running as root (UID 0), ensure /app/logs exists and owned by nestjs:nodejs
if [ "$(id -u)" = "0" ]; then
  mkdir -p /app/logs
  chown -R 1001:1001 /app/logs 2>/dev/null || true
  # if dist is root-owned when a volume overlaid files, optionally chown entire app
  # chown -R 1001:1001 /app || true  # uncomment only if safe
  # finally drop privileges and exec the original CMD as nestjs
  exec su-exec nestjs "$@"
else
  # already non-root, just exec
  exec "$@"
fi
