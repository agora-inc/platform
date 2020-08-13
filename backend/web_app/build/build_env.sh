#!/bin/bash -x
#
# Script setting up the environment in the base folder web_app
#


#if ! /usr/bin/git pull; then
#    echo "Failed to git pull..."
#    exit
#fi

if ! [ -d "../.env" ]; then
  virtualenv -p python3 ../.env_web_app
fi
source ../.env_web_app/bin/activate

pip install -r requirements.txt
