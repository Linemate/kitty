#!/usr/bin/env bash
DATESTAMP="$(date +%FT%H:%m)"
chmod 775 *
cd ../

npm run start
echo "[${DATESTAMP}] application started"