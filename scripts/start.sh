#!/bin/bash
DATESTAMP="$(date +%FT%H:%m)"
cd /home/ec2-user/kitten
#chmod 775 *

npm run start
echo "[${DATESTAMP}] application started"