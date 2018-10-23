#!/bin/bash

echo -e "\nstart raspberry-tools\n"
cd /home/pi/git/raspberry-tools/
git pull
npm run setup
npm run bot
cd /home/pi/
