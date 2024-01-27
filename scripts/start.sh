#!/usr/bin/env bash
DATESTAMP="$(date +%FT%H:%m)"
chmod 775 *
cd ../
npm install
npm build
npm start
echo "[${DATESTAMP}] application started"