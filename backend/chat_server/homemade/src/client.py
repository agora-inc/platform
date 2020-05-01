from socket import AF_INET, socket, SOCK_STREAM
from threading import Thread, Lock
import time
import logging
from chat_db import ChatDb
import json
import ast
from tools import Tools
import sys

HOST = "localhost"
PORT = 5500
ADDR = (HOST, PORT)
BUFFER_SIZE = 512

logging.getLogger().setLevel(logging.INFO)


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

        # connect to chat
        #self._connect_to_chat()

        # (set thread for listening)
        receive_thread = Thread(target=self.receive_msg)
        receive_thread.start()

        # Test
        # msg = "This is a message from the client! yoyo!"
        # self.send_msg(bytes(msg, "utf-8"))
        self.lock = Lock()

    def _connect_to_chat(self):
        try:
            connect_payload = {
                            "action": "connect",
                            "chat_id": self.chat_id,
                                }

            if self.channel_id != None:
                connect_payload["channel_id"] = self.channel_id

            if self.user_id != None:
                connect_payload["user_id"] = self.user_id

            self.send_msg(connect_payload)

        except Exception as e:
            raise Exception(f"_connect_to_chat: Exception. {e}")

    
    def _disconnect(self, ip_address):
        assert(self.chat_participant_group_id != None)
        try:
            disconnect_payload = {
                                "action": "disconnect",
                                "chat_participant_group_id": self.chat_participant_group_id,
                                "ip_address": ip_address
                                }

            if self.channel_id != None:
                disconnect_payload["channel_id"] = self.channel_id

            if self.user_id != None:
                disconnect_payload["user_id"] = self.user_id

            self.send_msg(disconnect_payload)
            self.client_socket.close()

        except Exception as e:
            raise Exception(f"_disconnect_to_chat: Exception. {e}")

    def send_msg(self, raw_msg):
        print(raw_msg)
        msg = bytes(str(raw_msg), "utf-8")
        try:
            self.client_socket.send(msg)
        except Exception as e:
            self.client_socket = socket(AF_INET, SOCK_STREAM)
            self.client_socket.connect(self.addr)
            raise Exception(f"send_msg: Exception. {e}")

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
                msg = self.tools.bytes_to_dict(raw_msg)
                logging.info(f"receive_msg: msg = {msg}")

                # if this is a connect msg, store the value of chat_participant_group_id in memory
                if msg["statusCode"] == 200:
                    if msg["body"]["action"] == "connect":
                        print("hehe")
                        # ANSWER:
                        #     {
                        #     "statusCode": 200,
                        #             "body": {
                        # 			"action": "connect",
                        # 			"chat_participant_group_id": 12389203,
                        # 			"source_user_id": 32423 
                        # 			"group_type": "private" (possible values: "channel" or "independent")
                        # 		            }
                        #     }
                        self.chat_participant_group_id = msg["body"]["chat_participant_group_id"]
                else:
                    print("ERROR MSG RECEIVED: ", msg)

                # make sure memory is safe to access
                self.lock.acquire()
                self.messages.append(msg)
                self.lock.release()


            except Exception as e:
                raise Exception(f"receive_msg: Exception. {e}")


if __name__ == "__main__":
    import time

    client = Client(17, chat_participant_group_id=74)
    client._connect_to_chat()
    time.sleep(3)
    client._disconnect("127.0.0.1")

    print("sleepting before disconnecting")

    print("disconnecting")



# class Client:
#     """
#     for communication with server
#     """
#     def __init__(self, name):
#         """
#         Init object and send name to server
#         :param name: str
#         """
#         # meta params
#         self.host = HOST
#         self.port = PORT
#         self.addr = (self.host, self.port)
#         self.buffer_size = BUFFER_SIZE

#         # setting socket
#         self.client_socket = socket(AF_INET, SOCK_STREAM)
#         self.client_socket.connect(self.addr)
#         self.messages = []
#         receive_thread = Thread(target=self.receive_msg)
#         receive_thread.start()
#         self.send_msg(name)
#         self.lock = Lock()

#     def receive_msg(self):
#         """
#         receive messages from server
#         :return: None
#         """
#         while True:
#             try:
#                 msg = self.client_socket.recv(self.buffer_size).decode()
#                 logging.info(f"receive_msg: msg = {msg}")

#                 # make sure memory is safe to access
#                 self.lock.acquire()
#                 self.messages.append(msg)
#                 self.lock.release()
#             except Exception as e:
#                 raise Exception(f"receive_msg: Exception. {e}")

#     def send_msg(self, msg):
#         """
#         send messages to server
#         :param msg: str
#         :return: None
#         """
#         try:
#             self.client_socket.send(bytes(msg, "utf8"))
#             if msg == "{quit}":
#                 self.client_socket.close()
#         except Exception as e:
#             self.client_socket = socket(AF_INET, SOCK_STREAM)
#             self.client_socket.connect(self.ADDR)
#             raise Exception(f"send_msg: Exception. {e}")


#     def get_messages(self):
#         """
#         :returns a list of str messages
#         :return: list[str]
#         """
#         messages_copy = self.messages[:]

#         # make sure memory is safe to access
#         self.lock.acquire()
#         self.messages = []
#         self.lock.release()

#         return messages_copy
    
#     def disconnect(self):
#         self.send_msg("{quit}")
