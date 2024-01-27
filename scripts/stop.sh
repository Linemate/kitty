#!/bin/bash
DATESTAMP="$(date +%FT%H:%m)"

cd /home/ec2-user/kitten

# PID 파일이 있는지 확인
PID_FILE="kitten.pid"

if [ -f "$PID_FILE" ]; then
  # 프로세스의 PID를 읽어옴
  PID=$(cat "$PID_FILE")

  # 프로세스 종료
  kill "$PID"

  echo "Process with PID $PID has been terminated."
  # PID 파일 삭제
  rm "$PID_FILE"
else
  echo "No running process found."
fi
