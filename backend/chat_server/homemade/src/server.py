from socket import AF_INET, socket, SOCK_STREAM
from threading import Thread
import time
from chat_participant import ChatParticipant
import logging

logging.getLogger().setLevel(logging.INFO)

# GLOBAL CONSTANTS
HOST = 'localhost'
PORT = 5500
MAX_CONNECTIONS = 10
BUFFER_SIZE = 512

class Server:
    def __init__(self):
        # meta vars
        self.host = HOST
        self.port = PORT
        self.addr = (self.host, self.port)
        self.max_connections = MAX_CONNECTIONS
        self.buffer_size = BUFFER_SIZE
        self.participants = []

        # setting socket
        self.socket = socket(AF_INET, SOCK_STREAM)
        self.socket.bind(self.addr)

    def broadcast(self, msg, name):
        """
        send new messages to all clients
        :param msg: bytes["utf8"]
        :param name: str
        :return:
        """
        for participant in self.participants:
            client = participant.client
            try:
                client.send(bytes(name, "utf8") + msg)
            except Exception as e:
                print("[EXCEPTION]", e)


    def client_communication(self, participant):
        """
        Thread to handle all messages from client
        :param participant: participant
        :return: None
        """
        client = participant.client

        # first message received is always the participants name
        name = client.recv(self.buffer_size).decode("utf8")
        participant.set_name(name)

        msg = bytes(f"{name} has joined the chat!", "utf8")
        self.broadcast(msg, "")  # broadcast welcome message

        while True:  # wait for any messages from participant
            msg = client.recv(self.buffer_size)

            if msg == bytes("{quit}", "utf8"):  # if message is qut disconnect client
                client.close()
                self.participants.remove(participant)
                self.broadcast(bytes(f"{name} has left the chat...", "utf8"), "")
                print(f"[DISCONNECTED] {name} disconnected")
                break
            else:  # otherwise send message to all other clients
                self.broadcast(msg, name+": ")
                print(f"{name}: ", msg.decode("utf8"))


    def wait_for_connection(self):
        """
        Wait for connecton from new clients, start new thread once connected
        :return: None
        """

        while True:
            try:
                client, addr = self.socket.accept()  # wait for any new connections
                participant = ChatParticipant(addr, client)  # create new participant for connection
                self.participants.append(participant)

                print(f"[CONNECTION] {addr} connected to the server at {time.time()}")
                Thread(target=self.client_communication, args=(participant,)).start()
            except Exception as e:
                print("[EXCEPTION]", e)
                break

        print("SERVER CRASHED")


if __name__ == "__main__":
    server = Server()
    server.socket.listen(MAX_CONNECTIONS)  # open server to listen for connections
    logging.info("[STARTED] Waiting for connections...")
    ACCEPT_THREAD = Thread(target=server.wait_for_connection)
    ACCEPT_THREAD.start()
    ACCEPT_THREAD.join()
    server.socket.close()