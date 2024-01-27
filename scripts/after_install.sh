#!/bin/bash

# nvm 초기화 스크립트
export NVM_DIR="/home/ec2-user/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

# 이 스크립트가 실행되는 디렉토리로 이동
cd /home/ec2-user/kitten

# 모든 파일에 실행 권한 추가
chmod +x *

# nvm 설정
nvm use node

# npm install
npm install

# npm build
npm run build