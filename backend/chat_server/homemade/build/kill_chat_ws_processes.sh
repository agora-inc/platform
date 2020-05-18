ps -ef | grep 'chat_ws_server.py' | grep -v grep | awk '{print $2}' | xargs -r kill -9
