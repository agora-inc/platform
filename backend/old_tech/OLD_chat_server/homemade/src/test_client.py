from socket import AF_INET, socket, SOCK_STREAM
from threading import Thread, Lock
import time
import logging
from chat_db import ChatDb
import json
import ast
from tools import Tools
import sys

HOST = "35.177.126.194"
PORT = 5500
ADDR = (HOST, PORT)
BUFFER_SIZE = 1024

logging.getLogger().setLevel(logging.INFO)


TESTING = True

class Client:
    """
    Client class; written for testing purpose in Python; will be rewritten in 
    Javascript on the javascript side.
    """
    def __init__(self, chat_id, chat_participant_group_id=None, user_id=None, channel_id=None):
        self.tools = Tools()
        # to be extracted from session in frontend
        self.user_id = user_id
        self.chat_id = chat_id
        self.chat_participant_group_id = chat_participant_group_id # can be recovered after connect
        self.channel_id = channel_id  #necessary only if this is a chat assocaited to a channel

        # to be extracted from memory
        self.host = HOST
        self.port = PORT
        self.addr = (self.host, self.port)

        # meta variables
        self.buffer_size = 512

        # memory
        self.messages = []

        # Initialising connection
        self.client_socket = socket(AF_INET, SOCK_STREAM)
        
        # handshake + init connection
        self.client_socket.connect(self.addr)
        self.send_handshake()

        # connect to chat
        #self.connect()

        # (set thread for listening)
        receive_thread = Thread(target=self.receive_msg)
        receive_thread.start()

        # Test
        # msg = "This is a message from the client! yoyo!"
        # self.send_server(bytes(msg, "utf-8"))
        # self.lock = Lock()

    def connect(self):
        try:
            connect_payload = {
                            "action": "connect",
                            "chat_id": self.chat_id,
                            "utc_ts_s": time.time(),
                            "user_id": self.user_id
                                }

            if self.channel_id != None:
                connect_payload["channel_id"] = self.channel_id

            if self.user_id != None:
                connect_payload["user_id"] = self.user_id

            self.send_server(connect_payload)

        except Exception as e:
            raise Exception(f"connect: Exception. {e}")

    
    def _disconnect(self, ip_address):
        assert(self.chat_participant_group_id != None)
        try:
            disconnect_payload = {
                                "action": "disconnect",
                                "chat_participant_group_id": self.chat_participant_group_id,
                                "ip_address": ip_address,
                                "utc_ts_s": time.time(),
                                "user_id": self.user_id
                                }

            if self.channel_id != None:
                disconnect_payload["channel_id"] = self.channel_id

            if self.user_id != None:
                disconnect_payload["user_id"] = self.user_id

            self.send_server(disconnect_payload)

        except Exception as e:
            raise Exception(f"_disconnect_to_chat: Exception. {e}")

    def send_server(self, dict_msg):
        logging.warning(f"sendmsg: {dict_msg}")
        msg = self.tools.dict_to_bytes(dict_msg)
        try:
            self.client_socket.send(msg)
        except Exception as e:
            self.client_socket = socket(AF_INET, SOCK_STREAM)
            self.client_socket.connect(self.addr)
            raise Exception(f"send_server: Exception. {e}")

    def send_msg(self, txt_msg, chat_type="channel", chat_group_id=17):
        logging.warning(f"send_msg: {txt_msg}")
        payload = {
                    "msg": txt_msg,
                    "action": "sendMsg",
                    "user_name": self.user_name,
                    "chat_type": chat_type,
                    "chat_participant_group_id": chat_group_id,
                    "utc_ts_s": time.time()
                    }
        
        self.send_server(payload)

    def edit_msg(self):
        pass

    # Javascript might handle this differently
    def receive_msg(self):
        """
        receive messages from server;
        :return: None
        """
        while True:
            try:
                raw_msg = self.client_socket.recv(self.buffer_size)
                try:
                    msg = self.tools.bytes_to_dict(raw_msg)
                    logging.warning(f"receive_msg: msg = {msg}")

                    if msg["statusCode"] == 200 and msg["body"]["action"] == "disconnect":
                        client.client_socket.close()

                except:
                    pass

                # msg = self.tools.bytes_to_dict(raw_msg)
                # logging.info(f"receive_msg: msg = {msg}")

                # # if this is a connect msg, store the value of chat_participant_group_id in memory
                # if msg["statusCode"] == 200:
                #     if msg["body"]["action"] == "connect":
                #         print("hehe")
                #         # ANSWER:
                #         #     {
                #         #     "statusCode": 200,
                #         #             "body": {
                #        # 			"action": "connect",
                #         # 			"chat_participant_group_id": 12389203,
                #         # 			"source_user_id": 32423 
                #         # 			"gro marking your spawned threads as daemons allows you to exit yoicipant_group_id = msg["body"]["chat_participant_group_id"]
            except Exception as e:
                raise Exception(f"receive_msg: Exception. {e}")

    def send_handshake(self):
        handshake_req = """GET / HTTP/1.1
                Host: localhost:5500
                User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:75.0) Gecko/20100101 Firefox/75.0
                Accept: /
                Accept-Language: en-US,en;q=0.5
                Accept-Encoding: gzip, deflate
                Sec-WebSocket-Version: 13
                Origin: http://localhost:3000
                Sec-WebSocket-Extensions: permessage-deflate
                Sec-WebSocket-Key: AgtYvRfpQVCYykSvVSabGQ==
                DNT: 1
                Connection: keep-alive, Upgrade
                Cookie: JSESSIONID=B348ED333491B3BABA4E9BE04D77A1E4
                Pragma: no-cache
                Cache-Control: no-cache
                Upgrade: websocket"""

        msg_bytes = bytes(handshake_req.encode("utf-8"))

        self.client_socket.send(msg_bytes)
        response = self.client_socket.recv(self.buffer_size)

        logging.warning(f"{response}")



if __name__ == "__main__":
    import time
    import random

    # clients = []
    # for i in range(500):
    #     clients.append(Client(15, 74))
    #     clients[i].connect()
    #     clients[i].user_name = "JOHN COLTRANE"
    #     print(f"create: {i}")
    #     time.sleep(0.2)

    # for i in range(len(clients)):
    #     clients[i].send_msg("Lets get this working")
    #     print(f"send msg: {i}")
    #     time.sleep(0.25)
    
    # for i in range(len(clients)):
    #     clients[i]._disconnect("127.0.0.1")
    #     print(f"disconnect: {i}")
    #     time.sleep(0.1)


    client2 = Client(17, chat_participant_group_id=74, user_id = 11111111)




    # client2 = Client(17, chat_participant_group_id=74, user_id = 222222)
    # client3 = Client(17, chat_participant_group_id=74, user_id = 3333333)
    # client4 = Client(17, chat_participant_group_id=74, user_id = 444444444)
