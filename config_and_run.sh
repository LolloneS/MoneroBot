#!/bin/bash
FIRST_PART="{\n\t\"token\" : \""
SECOND_PART="\"\n}"
echo -e $FIRST_PART$1$SECOND_PART > config.json
printf "Installing dependencies..."
npm install
command -v screen >/dev/null 2>&1 || { echo >&2 "screen is needed but not installed. Aborting."; exit 1; }
screen -mdS bot bash -c "node main.js &> monerobot.log"
