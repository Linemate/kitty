#!/bin/bash
DATESTAMP="$(date +%FT%H:%m)"
cd /home/ec2-user/kitten

# nvm 초기화 스크립트
export NVM_DIR="/home/ec2-user/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

nohup npm run start > /dev/null 2>&1 &
echo "[${DATESTAMP}] application started"