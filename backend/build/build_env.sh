#!/bin/bash -x
#
# Script setting up the environment in the base folder web_app
#


#if ! /usr/bin/git pull; then
#    echo "Failed to git pull..."
#    exit
#fi

if ! [ -d "../.env" ]; then
  virtualenv -p python3 ../.env_backend
fi
source ../.env_backend/bin/activate;

pip install -r /home/cloud-user/plateform/agora/backend/build/requirements.txt;

python /home/cloud-user/plateform/agora/setup.py install;
