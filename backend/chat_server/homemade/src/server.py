from socket import AF_INET, socket, SOCK_STREAM
from threading import Thread
import time
from chat_participant import ChatParticipant
import logging
import ws_config_chat
from chat_db import ChatDb

logging.getLogger().setLevel(logging.INFO)

# GLOBAL CONSTANTS
HOST = ws_config_chat.host
PORT = ws_config_chat.port
MAX_CONNECTIONS = ws_config_chat.max_connections
BUFFER_SIZE = ws_config_chat.buffer_size

def _wrapper(status_code, body):
    return {"statusCode": status_code, "body": body}

class ChatWsServer:
    def __init__(self):
        # meta variable
        self.host = HOST
        self.port = PORT
        self.addr = (self.host, self.port)
        self.max_connections = MAX_CONNECTIONS
        self.buffer_size = BUFFER_SIZE

        # dictionary indexed by chat_participant_group_id and list of 
        # participants
        self.chat_groups = {}

        # connecting to db
        self.chat_db = ChatDb()

        # setting socket
        self.socket = socket(AF_INET, SOCK_STREAM)
        self.socket.bind(self.addr)

    def _stop(self):
        self.chat_db._disconnect_from_db()
        self.socket.close()

    def _reset_memory(self):
        self.chat_participant = {}

    def _reload_memory(self):
        # Fetch all the data from the DB to restaure connections
        pass

    def broadcast(self, msg, chat_participant_group_id):
        """
        send new messages to all clients
        :param msg: bytes["utf8"]
        :par
        am name: str
        :return:
        """
        for participant in self.chat_participant[chat_participant_group_id]:
            client = participant.client
            try:
                client.send(bytes(msg, "utf8"))
            except Exception as e:
                logging.warning(f"broadcast: exception: {e}")

    def _on_message(self, msg, ip_address=None, client=None, participant=None):
        action = msg["action"]

        if action == "connect":
            logging.warning("on_message: connection not handled.")

        if action == "disconnect":
            self.handle_client_disconnect(msg, participant=participant)

        elif action == "sendMsg":
            logging.warning("_on_message: ")

        elif action == "editMsg":
            raise NotImplementedError

        elif action == "deleteMsg":
            raise NotImplementedError
 
    def handle_client_connect(self, msg, ip_address=None, client=None):
        if "user_id" in msg:
            user_id = msg["user_id"]
        else:
            user_id = "*"

        # A. get room id
        chat_id = msg["chat_id"]
        cursor = self.chat_db.con.cursor()
        con = self.chat_db.con

        chat_participant_id_subscribed, chat_group_id_blocked, group_type = self.chat_db.get_chat_participant_group_ids(chat_id)

        cursor.execute(f"SELECT * FROM ChatParticipants WHERE chat_participant_group_id='{chat_group_id_blocked}' and ip_address='{ip_address}'")
        result = cursor.fetchall()

        # B. If user blocked, do not accept
        if len(result) > 0:
            con.commit()
            cursor.close() 
            response = _wrapper(400, {"error":"you have been blocked by an admin."})
            client.send(bytes(response, "utf8"))

        else:
            # I) Add in DB
            cursor.execute(f"INSERT INTO ChatParticipants(user_id, ip_address, chat_participant_group_id, chat_id) VALUES ({user_id}, '{ip_address}', {chat_participant_id_subscribed}, {chat_id})")
            con.commit()
            cursor.close()

            # II) add in memory
            participant = ChatParticipant(ip_address, client, chat_participant_id_subscribed, chat_group_id_blocked)
            if chat_participant_id_subscribed in self.chat_groups:
                self.chat_groups[chat_participant_id_subscribed].append(participant)
            else:
                self.chat_groups[chat_participant_id_subscribed] = [participant]

            # III) send a response
            if user_id != "NULL":
                body={"action": "connect", "chat_participant_group_id": chat_participant_id_subscribed, "group_type": group_type, "source_user_id": user_id}
            else:
                body={"action": "connect", "chat_participant_group_id": chat_participant_id_subscribed, "group_type": group_type}

            payload = _wrapper(200, body=body)
            participant.client.send(bytes(payload, "utf8"))

            # Dedicate a thread to the client that is perma-listening it.
            Thread(target=self.communication_thread, args=(participant,)).start()
            logging.info("handle_client_connect: new admitted connection; ip_address: {ip_address}, chat_participant_id_subscribed: {chat_participant_id_subscribed}")
    
    def handle_client_disconnect(self, msg, participant):
        sub_group_id = participant.chat_participant_id_subscribed

        # broadcast to its group that he left
        payload = {
                    "action": "sendMsg",
                    "user_name": participant.name,
                    "chat_participant_group_id": sub_group_id
                    }

        self.broadcast(payload, sub_group_id)

        # delete the guy
        participant.client.close()
        self.chat_groups[sub_group_id].remove(participant)
        logging.info(f"handle_client_disconnect: participant {participant.name} succesfully disconnected.")


    def handle_client_sendMsg(self, msg, participant):
        sub_group_id = participant.chat_participant_id_subscribed
        payload = {
                    "action": "sendMsg",
                    "user_name": participant.name,
                    "chat_participant_group_id": sub_group_id
                    }

        self.broadcast(payload, sub_group_id)

    def handle_client_editMsg(self):
        raise NotImplementedError

    def handle_client_deleteMsg(self):
        raise NotImplementedError

    def handle_error(self, exception):
        pass

    def wait_for_connection(self, acceptance_time_window=10):
        """
        Wait for connecton from new clients, start new thread once connected
        :return: None
        """
        while True:
            try:
                client, addr = self.socket.accept()
                
                # wait for subscription message from participant
                start_time = time.time()
                while True:                
                    msg = client.recv(self.buffer_size)

                    if time.time() - start_time > acceptance_time_window:
                        break
                    if msg:
                        self.handle_client_connect(msg, ip_address=addr, client=client)
            
            except Exception as e:
                logging.warning(f"wait_for_connection: exception encountered: {e}")
                break

        logging.warning("wait_for_connection: Server stopped.")

    def communication_thread(self, participant, time_sleep=1):
        client = participant.client
        while True:  # wait for any messages from participant
            msg = client.recv(self.buffer_size)
            self._on_message(msg, participant=participant)
            time.sleep(time_sleep)

    def load_memory_from_db(self):
        pass

    def _restart(self, tentatives=10, time_interval=3):
        for _ in range(tentatives):
            try:
                self._stop()
                self.load_memory_from_db()
                self.run()
                logging.info("_restart: successfull reconnection.")
            except Exception as e:
                logging.warning(f"_restart: reconnection failed, exception: {e}. Attempt number {_}/{tentatives}")
            time.sleep(time_interval)

    def run(self):
        try:
            self.socket.listen(MAX_CONNECTIONS)
            logging.warning("run: ws successfully started. Listening.")
            ACCEPT_THREAD = Thread(target=self.wait_for_connection)
            ACCEPT_THREAD.start()
            ACCEPT_THREAD.join()
            server.socket.close()

        except Exception as e:
            logging.warning(f"run: exception encountered {e}")
            self._restart()


if __name__ == "__main__":
    server = ChatWsServer()
    server.run()












# class Server:
#     def __init__(self):
#         # meta vars
#         self.host = HOST
#         self.port = PORT
#         self.addr = (self.host, self.port)
#         self.max_connections = MAX_CONNECTIONS
#         self.buffer_size = BUFFER_SIZE
#         self.participants = []

#         # setting socket
#         self.socket = socket(AF_INET, SOCK_STREAM)
#         self.socket.bind(self.addr)

#     def broadcast(self, msg, name):
#         """
#         send new messages to all clients
#         :param msg: bytes["utf8"]
#         :param name: str
#         :return:
#         """
#         for participant in self.participants:
#             client = participant.client
#             try:
#                 client.send(bytes(name, "utf8") + msg)
#             except Exception as e:
#                 print("[EXCEPTION]", e)


#     def client_communication(self, participant):
#         """
#         Thread to handle all messages from client
#         :param participant: participant
#         :return: None
#         """
#         client = participant.client

#         # first message received is always the participants name
#         name = client.recv(self.buffer_size).decode("utf8")
#         participant.set_name(name)

#         msg = bytes(f"{name} has joined the chat!", "utf8")
#         self.broadcast(msg, "")  # broadcast welcome message

#         while True:  # wait for any messages from participant
#             msg = client.recv(self.buffer_size)

#             if msg == bytes("{quit}", "utf8"):  # if message is qut disconnect client
#                 client.close()
#                 self.participants.remove(participant)
#                 self.broadcast(bytes(f"{name} has left the chat...", "utf8"), "")
#                 print(f"[DISCONNECTED] {name} disconnected")
#                 break
#             else:  # otherwise send message to all other clients
#                 self.broadcast(msg, name+": ")
#                 print(f"{name}: ", msg.decode("utf8"))


#     def wait_for_connection(self):
#         """
#         Wait for connecton from new clients, start new thread once connected
#         :return: None
#         """

#         while True:
#             try:
#                 client, addr = self.socket.accept()  # wait for any new connections
#                 participant = ChatParticipant(addr, client)  # create new participant for connection
#                 self.participants.append(participant)

#                 print(f"[CONNECTION] {addr} connected to the server at {time.time()}")
#                 Thread(target=self.client_communication, args=(participant,)).start()
#             except Exception as e:
#                 print("[EXCEPTION]", e)
#                 break

#         print("SERVER CRASHED")


# if __name__ == "__main__":
#     server = Server()
#     server.socket.listen(MAX_CONNECTIONS)  # open server to listen for connections
#     logging.info("[STARTED] Waiting for connections...")
#     ACCEPT_THREAD = Thread(target=server.wait_for_connection)
#     ACCEPT_THREAD.start()
#     ACCEPT_THREAD.join()
#     server.socket.close()