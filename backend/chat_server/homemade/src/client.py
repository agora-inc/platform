from socket import AF_INET, socket, SOCK_STREAM
import time
from tools import Tools

def main():
    tools = Tools()

    _socket = socket(AF_INET, SOCK_STREAM)
    addr = ("localhost", 5500)
    _socket.connect(addr)

    payload = {
        "action": "connect",
        "chat_id": 15,
        "utc_ts_s": time.time(),
        "user_id": 20
    }
    payload = tools.dict_to_bytes(payload)
    _socket.send(payload)


    payload = {
        "statusCode": 200,
        "action": "ping",
        "utc_ts_in_s": time.time()
    }
    payload = tools.dict_to_bytes(payload)

    while True:
        time.sleep(3)
        _socket.send(payload)

if __name__ == "__main__":
    main()


