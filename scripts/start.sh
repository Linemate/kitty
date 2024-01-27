#!/usr/bin/env bash
DATESTAMP="$(date +%FT%H:%m)"
chmod 775 *
cd ../
npm install
npm run build
npm run start
echo "[${DATESTAMP}] application started"