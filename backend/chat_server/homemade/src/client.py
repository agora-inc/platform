from socket import AF_INET, socket, SOCK_STREAM
from threading import Thread, Lock
import time
import logging

HOST = "localhost"
PORT = 5500
ADDR = (HOST, PORT)
BUFFER_SIZE = 512

logging.getLogger().setLevel(logging.INFO)


class Client:
    """
    for communication with server
    """
    def __init__(self, name):
        """
        Init object and send name to server
        :param name: str
        """
        # meta params
        self.host = HOST
        self.port = PORT
        self.addr = (self.host, self.port)
        self.buffer_size = BUFFER_SIZE

        # setting socket
        self.client_socket = socket(AF_INET, SOCK_STREAM)
        self.client_socket.connect(self.addr)
        self.messages = []
        receive_thread = Thread(target=self.receive_msg)
        receive_thread.start()
        self.send_msg(name)
        self.lock = Lock()

    def receive_msg(self):
        """
        receive messages from server
        :return: None
        """
        while True:
            try:
                msg = self.client_socket.recv(self.buffer_size).decode()
                logging.info(f"receive_msg: msg = {msg}")

                # make sure memory is safe to access
                self.lock.acquire()
                self.messages.append(msg)
                self.lock.release()
            except Exception as e:
                raise Exception(f"receive_msg: Exception. {e}")

    def send_msg(self, msg):
        """
        send messages to server
        :param msg: str
        :return: None
        """
        try:
            self.client_socket.send(bytes(msg, "utf8"))
            if msg == "{quit}":
                self.client_socket.close()
        except Exception as e:
            self.client_socket = socket(AF_INET, SOCK_STREAM)
            self.client_socket.connect(self.ADDR)
            raise Exception(f"send_msg: Exception. {e}")


    def get_messages(self):
        """
        :returns a list of str messages
        :return: list[str]
        """
        messages_copy = self.messages[:]

        # make sure memory is safe to access
        self.lock.acquire()
        self.messages = []
        self.lock.release()

        return messages_copy
    
    def disconnect(self):
        self.send_msg("{quit}")
