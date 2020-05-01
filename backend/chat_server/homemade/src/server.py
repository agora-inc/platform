from socket import AF_INET, socket, SOCK_STREAM
from threading import Thread
import time
from chat_participant import ChatParticipant
import logging
import ws_config_chat
import ast
from chat_db import ChatDb
from tools import Tools


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
        self.tools = Tools()
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
                client.send(bytes(msg, "utf-8"))
            except Exception as e:
                logging.warning(f"broadcast: exception: {e}")
        
        logging.warning("broadcast: successfull broadcast.")

    def _on_message(self, msg, ip_address=None, client=None, participant=None):
        logging.warning(f"_on_message: rcv message: {msg}")
        action = msg["action"]

        if action == "connect":
            logging.info("on_message: alrealdy connected user requests connection.")
            pass

        if action == "disconnect":
            self.handle_client_disconnect(msg, participant=participant)

        elif action == "sendMsg":
            logging.warning("_on_message: ")

        elif action == "editMsg":
            raise NotImplementedError

        elif action == "deleteMsg":
            raise NotImplementedError
 
    def handle_client_connect(self, msg, ip_address=None, client=None, participant=None):
        # msg in json format
        if "user_id" in msg:
            user_id = msg["user_id"]
        else:
            user_id = None

        if msg["action"] != "connect":
            logging.warning(f"handle_client_connect: an unconnected client sent another request. msg: {msg}")
            if msg["action"] == "disconnect":
                self._on_message(msg, ip_address=ip_address, client=client)

        else:
            # A. get user
            chat_id = msg["chat_id"]
            cursor = self.chat_db.con.cursor()
            con = self.chat_db.con

            # check if the chatgroups exist, else return error to client
            try:
                response = self.chat_db.get_chat_participant_group_ids(chat_id)
                chat_participant_id_subscribed, chat_group_id_blocked, group_type = response

            except Exception as e:
                self.handle_error(client, response)
                return

            cursor.execute(f"SELECT id FROM ChatParticipants WHERE chat_participant_group_id='{chat_group_id_blocked}' and ip_address='{ip_address}'")
            result = cursor.fetchall()

            logging.warning(f"handle_client_connect: room_id obtained: subs_id: {chat_participant_id_subscribed}; block_id:{chat_group_id_blocked}")
            
            # B. If user blocked, do not accept
            if len(result) > 0:
                con.commit()
                cursor.close() 
                response = _wrapper(400, {"error":"you have been blocked by an admin."})
                client.send(bytes(str(response), "utf8"))
                logging.warning(f"handle_client_connect: attempt to log by a blocked user; id:{result}")

            else:
                try:
                    # I) Add in DB
                    if user_id != None:
                        cursor.execute(f"INSERT INTO ChatParticipants(user_id, ip_address, chat_participant_group_id, chat_id) VALUES ({user_id}, '{ip_address}', {chat_participant_id_subscribed}, {chat_id})")
                    else:
                        cursor.execute(f"INSERT INTO ChatParticipants(ip_address, chat_participant_group_id, chat_id) VALUES ('{ip_address}', {chat_participant_id_subscribed}, {chat_id})")
                    con.commit()
                    cursor.close()
                    logging.warning(f"handle_client_connect: new user (ip={ip_address}) added in DB")

                    # II) add in memory
                    participant = ChatParticipant(ip_address, client, chat_participant_id_subscribed, chat_group_id_blocked)
                    if chat_participant_id_subscribed in self.chat_groups:
                        self.chat_groups[chat_participant_id_subscribed].append(participant)
                    else:
                        self.chat_groups[chat_participant_id_subscribed] = [participant]
                    
                    logging.warning(f"handle_client_connect: new user (ip={ip_address}) added in memory")


                    # III) send a response
                    if user_id != "NULL":
                        body={"action": "connect", "chat_participant_group_id": chat_participant_id_subscribed, "group_type": group_type, "source_user_id": user_id}
                    else:
                        body={"action": "connect", "chat_participant_group_id": chat_participant_id_subscribed, "group_type": group_type}

                    payload = _wrapper(200, body=body)
                    participant.client.send(bytes(str(payload), "utf8"))

                    # Dedicate a thread to the client that is perma-listening it.
                    logging.warning(f"handle_client_connect: new admitted connection; ip_address: {ip_address}, chat_participant_id_subscribed: {chat_participant_id_subscribed}")
                    self._open_communication_thread(participant)

                except Exception as e:
                    logging.warning(f"handle_client_connect: Exception: {e}")


    def handle_client_disconnect(self, msg, participant):
        logging.warning(f"handle_client_disconnect: msg:{msg}")

        try:
            # A) Remove from memory: disconnection from a connected user (if not tracked, ignore).
            if participant != None:
                ip_address = participant.addr[0]
                sub_group_id = participant.chat_participant_id_subscribed
                # broadcast to its group that he left
                body = {
                            "action": "disconnect",
                            "user_name": participant.name,
                            "chat_participant_group_id": sub_group_id
                            }
                payload = self.tools._wrapper(200, body)
                self.broadcast(payload, sub_group_id)

                # delete the guy from memory
                participant.client.close()
                self.chat_groups[sub_group_id].remove(participant)

            # B) Remove from DB
            if participant == None:
                ip_address = msg["ip_address"]
                sub_group_id = msg["chat_participant_group_id"]

            cursor = self.chat_db.con.cursor()
            cursor.execute(f"DELETE FROM ChatParticipants where ip_address='{ip_address}' and chat_participant_group_id={sub_group_id}")
            self.chat_db.con.commit()
            cursor.close()

            logging.warning(f"handle_client_disconnect: participant (ip_address={ip_address}; chat_participant_group={sub_group_id}) succesfully disconnected.")

        except Exception as e:
            logging.warning(f"handle_client_disconnect: participant ({ip_address}) disconnection failed; exception {e}.")

    
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

    def handle_error(self, client, error_dict):
        client.send(bytes(str(error_dict), "utf-8"))

    def wait_for_connection(self, acceptance_time_window=5):
        """
        Wait for connecton from new clients, start new thread once connected
        :return: None
        """
        # wait for subscription message from participant
        while True:
            print("while true")
            time.sleep(5)
            try:                
                client, addr = self.socket.accept()
                logging.warning("wait_for_connection: new connection.")
                msg = client.recv(self.buffer_size).decode("utf-8")

                start_time = time.time()
                if time.time() - start_time > acceptance_time_window:
                    logging.warning(f"wait_for_connection: timeout for {addr}, no subscription received.")
                    break

                if len(msg) > 0:
                    try:
                        msg = ast.literal_eval(str(msg))
                        logging.warning(f"wait_for_connection: rcv msg: {msg}, type: {type(msg)}")
                        self.handle_client_connect(msg, ip_address=addr[0], client=client)
                        
                    except SyntaxError:
                        logging.warning(f"wait_for_connection: received message with a bad syntax.")
        
            except Exception as e:
                logging.warning(f"wait_for_connection: exception encountered: {e}")
                break

        self.socket.close()
        logging.warning("wait_for_connection: Server stopped.")

    def _communication_thread(self, participant, time_sleep=1, lifetime=24*3600):
        client = participant.client
        _creation_time = time.time()

        while True:  # wait for any messages from participant
            raw_msg = client.recv(self.buffer_size)

            try:
                msg = self.tools.bytes_to_dict(raw_msg)
                time.sleep(time_sleep)

                if len(msg) >0:
                    self._on_message(msg, participant=participant)
                if time.time() - _creation_time > lifetime:
                    break

            except Exception as e:
                logging.warning("_communication_thread: exception {e}")
                return


    def _open_communication_thread(self, participant):
        logging.warning("_open_communication_thread: opening")
        Thread(target=self._communication_thread, args=(participant,)).start()

    def load_memory_from_db(self):
        pass

    def _restart(self, tentatives=10, time_interval=3):
        for _ in range(tentatives):
            try:
                self._stop()
                self.load_memory_from_db()
                self.run()
                logging.warning("_restart: successfull reconnection.")
            except Exception as e:
                logging.warning(f"_restart: reconnection failed, exception: {e}. Attempt number {_}/{tentatives}")
            time.sleep(time_interval)

    def run(self):
        logging.warning(f"run: running websocket on {self.addr}")
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
#     logging.warning("[STARTED] Waiting for connections...")
#     ACCEPT_THREAD = Thread(target=server.wait_for_connection)
#     ACCEPT_THREAD.start()
#     ACCEPT_THREAD.join()
#     server.socket.close()