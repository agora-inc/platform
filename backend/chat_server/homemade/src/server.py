from socket import AF_INET, socket, SOCK_STREAM
from threading import Thread, enumerate, active_count
import time
from chat_participant import ChatParticipant
import logging
import ws_config_chat
import ast
from chat_db import ChatDb
from tools import Tools
import sys
from pprint import pprint


# GLOBAL CONSTANTS
HOST = ws_config_chat.host
PORT = ws_config_chat.port
MAX_CONNECTIONS = ws_config_chat.max_connections
BUFFER_SIZE = ws_config_chat.buffer_size


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
        if chat_participant_group_id in self.chat_groups:
            for participant in self.chat_groups[chat_participant_group_id]:
                client = participant.client
                try:
                    byte_msg = self.tools.dict_to_bytes(msg)
                    client.send(byte_msg)
                    logging.warning(f"broadcast: successfully sent msg to client: msg: {msg}; chat_group_id: {chat_participant_group_id}")
                except Exception as e:
                    logging.warning(f"broadcast: exception: {e}")
        
            logging.warning("broadcast: successfull broadcast.")
        
        else:
            logging.warning(f"broadcast: attempt to disconnect from an empty room (roomid={chat_participant_group_id}).")

    def _on_message(self, msg, ip_address=None, client=None, participant=None):
        logging.warning(f"_on_message: rcv message: {msg}")
        action = msg["action"]

        if action == "connect":
            logging.info("on_message: alrealdy connected user requests connection.")
            pass

        if action == "disconnect":
            self.handle_client_disconnect(msg, participant=participant)

        elif action == "sendMsg":
            self.handle_client_sendMsg(msg, participant=participant)

        elif "action" == "blockUser":
            raise NotImplementedError

        elif "action" == "unblockUser":
            raise NotImplementedError

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

            # A. check if the chatgroups exist, else return error to client
            try:
                response = self.chat_db.get_chat_participant_group_ids(chat_id)
                chat_participant_id_subscribed, chat_participant_id_blocked, group_type = response
                if chat_participant_id_subscribed == None:
                    raise Exception(f"handle_client_connect: no chat_participant_id_subscribed associated to {chat_id} exists ")

            except Exception as e:
                self.handle_error(client, response)
                return

            cursor.execute(f"SELECT id FROM ChatParticipants WHERE chat_participant_group_id='{chat_participant_id_blocked}' and ip_address='{ip_address}'")
            result = cursor.fetchall()
            logging.warning(f"handle_client_connect: room_id obtained: subs_id: {chat_participant_id_subscribed}; block_id:{chat_participant_id_blocked}")
            
            # B. If user blocked, do not accept
            if len(result) > 0:
                con.commit()
                cursor.close() 
                response = self.tools._wrapper(400, {"error":"you have been blocked by an admin."})
                client.send(bytes(str(response), "utf8"))
                logging.warning(f"handle_client_connect: attempt to log by a blocked user; id:{result}")

            else:
                try:
                    # C. check if user is already in DB; if he is, close other connections and update memory
                    cursor.execute(f"SELECT id FROM ChatParticipants WHERE chat_participant_group_id='{chat_participant_id_subscribed}' and ip_address='{ip_address}'")
                    res = cursor.fetchall()
                    if len(res) > 0:
                        if chat_participant_id_subscribed in self.chat_groups:
                            for current_participant in self.chat_groups[chat_participant_id_subscribed]:
                                if current_participant.addr[0] == ip_address:
                                    self.chat_groups[chat_participant_id_subscribed].remove(current_participant)
                                    current_participant.client.close()
                        else:
                            self.chat_groups[chat_participant_id_subscribed] = []
                        
                        logging.warning(f"handle_client_connect: updated connection of participant in chat_group_id={chat_participant_id_subscribed} and ip={ip_address}")
                        participant = ChatParticipant(ip_address, client, chat_participant_id_subscribed, chat_participant_id_blocked)
                        self.chat_groups[chat_participant_id_subscribed].append(participant)

                    # D. If not blocked or already register, register him
                    else:
                        # I) Add in DB
                        if user_id != None:
                            cursor.execute(f"INSERT INTO ChatParticipants(user_id, ip_address, chat_participant_group_id, chat_id) VALUES ({user_id}, '{ip_address}', {chat_participant_id_subscribed}, {chat_id})")
                        else:
                            cursor.execute(f"INSERT INTO ChatParticipants(ip_address, chat_participant_group_id, chat_id) VALUES ('{ip_address}', {chat_participant_id_subscribed}, {chat_id})")
                        con.commit()
                        cursor.close()
                        logging.warning(f"handle_client_connect: new user (ip={ip_address}) added in DB")

                        # II) add in memory
                        participant = ChatParticipant(ip_address, client, chat_participant_id_subscribed, chat_participant_id_blocked)
                        
                        if chat_participant_id_subscribed in self.chat_groups:
                            self.chat_groups[chat_participant_id_subscribed].append(participant)
                        else:
                            self.chat_groups[chat_participant_id_subscribed] = [participant]
                        
                        logging.warning(f"handle_client_connect: new user (ip={ip_address}) added in memory")

                    # E. send a response
                    if user_id != "NULL":
                        body={"action": "connect", "chat_participant_group_id": chat_participant_id_subscribed, "group_type": group_type, "source_user_id": user_id}
                    else:
                        body={"action": "connect", "chat_participant_group_id": chat_participant_id_subscribed, "group_type": group_type}

                    payload = self.tools._wrapper(200, body=body)
                    participant.client.send(bytes(str(payload), "utf8"))

                    # F. Dedicate a thread to the client that is perma-listening him.
                    logging.warning(f"handle_client_connect: new admitted connection; ip_address: {ip_address}, chat_participant_id_subscribed: {chat_participant_id_subscribed}")
                    self._open_communication_thread(participant)

                except Exception as e:
                    logging.warning(f"handle_client_connect: Exception section B: {e}")

    def handle_client_disconnect(self, msg, participant):
        logging.warning(f"handle_client_disconnect: msg:{msg}")

        try:
            # A) Remove from memory: disconnection from a connected user (if not tracked, ignore).
            try:
                if participant != None:
                    ip_address = participant.addr
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
                    if sub_group_id in self.chat_groups:
                        try:
                            self.chat_groups[sub_group_id].remove(participant)
                        except:
                            pass

                    logging.warning("handle_client_disconnect: 1/3: user succesfully removed from memory.")
            except Exception as e:
                logging.warning(f"handle_client_disconnect: (A) participant ({ip_address}) disconnection failed; exception {e}.")
                raise Exception(f"{e}")
            
            # B) Remove from DB
            try:
                if participant == None:
                    ip_address = msg["ip_address"]
                    sub_group_id = msg["chat_participant_group_id"]

                cursor = self.chat_db.con.cursor()
                cursor.execute(f"DELETE FROM ChatParticipants where ip_address='{ip_address}' and chat_participant_group_id={sub_group_id}")
                self.chat_db.con.commit()
                cursor.close()
                logging.warning("handle_client_disconnect: 2/3: user succesfully removed from DB.")
                logging.warning(f"handle_client_disconnect: participant (ip_address={ip_address}; chat_participant_group={sub_group_id}) succesfully disconnected.")
            except Exception as e:
                logging.warning(f"handle_client_disconnect: participant ({ip_address}) disconnection failed; exception {e}.")
                raise Exception(f"{e}")

            # C) Update the connectivity flag for thread
            try:
                participant.flag_connection = False
                logging.warning(f"handle_client_disconnect: 3/3 successfully removed participant (ip={ip_address}, chat_participant_group={sub_group_id}) from system.")

            except Exception as e:
                logging.warning(f"handle_client_disconnect: participant ({ip_address}) disconnection failed; exception {e}.")
                raise Exception(f"{e}")

        except Exception as e:
            logging.warning(f"handle_client_disconnect: participant ({ip_address}) disconnection failed; exception {e}.")

    
    def handle_client_sendMsg(self, msg, participant):
        # check if user is blocked
        cursor = self.chat_db.con.cursor()
        cursor.execute(f"SELECT id FROM ChatParticipants WHERE chat_participant_group_id='{participant.chat_participant_id_blocked}' and ip_address='{participant.addr}'")
        res = cursor.fetchall()
        try:
            if len(res) > 0:
                try:
                    error_payload = self.tools._wrapper(403, {"error_msg:" "user blocked from the chat."})
                    self.handle_error(participant.client, error_payload)
                except Exception as e:
                    logging.warning(f"handle_client_sendMsg: failed to send error msg to blocked user; exception: {e}.")

            else:
                sub_group_id = participant.chat_participant_id_subscribed
                payload = {
                            "action": "sendMsg",
                            "user_name": participant.name,
                            "chat_participant_group_id": sub_group_id,
                            "msg": msg
                            }

                self.broadcast(payload, sub_group_id)
                logging.warning("handle_client_sendMsg: msg successfully broadcasted.")    
        except Exception as e:
            logging.warning(f"handle_client_sendMsg: exception raised: {e}")    

    def handle_client_editMsg(self):
        raise NotImplementedError

    def handle_client_deleteMsg(self):
        raise NotImplementedError

    def handle_client_blockUser(self):
        raise NotImplementedError

    def handle_client_unblockUser(self):
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
            try:                
                client, addr = self.socket.accept()

                logging.warning("wait_for_connection: new connection.")
                logging.warning(f"list of active threads: {enumerate()}")

                msg = client.recv(self.buffer_size).decode("utf-8")
                logging.warning(f"wait_for_connection: msg = {msg}.")

                raise Exception("test exception to see that it restarts: to be deleted")
                break

                try:
                    msg = ast.literal_eval(str(msg))
                    logging.warning(f"Current state of the chat_groups: {self.chat_groups}")
                    logging.warning(f"wait_for_connection: rcv msg: {msg}, type: {type(msg)}")
                    self.handle_client_connect(msg, ip_address=addr[0], client=client)

                except SyntaxError:
                    try:
                        # if msg of the form "{...}{...}"" multiple dic appended, separate them.
                        split_dic = self.tools.split_concatenated_dict_strings(msg)
                        for split_msg in split_dic:
                            logging.warning(f"wait_for_connection: rcv msg: {split_msg}, type: {type(split_msg)}")
                            self.handle_client_connect(split_msg, ip_address=addr[0], client=client)
                    except:
                        pass

            except Exception as e:
                logging.warning(f"wait_for_connection: exception encountered: {e}")
                break

        self.socket.close()
        logging.warning("wait_for_connection: Server stopped.")

    def _communication_thread(self, participant, time_sleep=1, lifetime=3600):
        client = participant.client
        _creation_time = time.time()

        logging.warning(f"_communication_thread: number of active threads: {active_count()}")
        logging.warning(f"_communication_thread: list of active threads: {enumerate()}")

        while participant.flag_connection:  # wait for any messages from participant
            try:
                raw_msg = client.recv(self.buffer_size)
                msg = self.tools.bytes_to_dict(raw_msg)
                time.sleep(time_sleep)

                if len(msg) >0:
                    self._on_message(msg, participant=participant)
                if time.time() - participant.creation_time > lifetime:
                    payload = {"msg": "connection timed out."}
                    msg = self.tools._wrapper(408, payload)
                    participant.client.send(msg)
                    participant.flag_connection=False

            except Exception as e:
                logging.warning(f"_communication_thread: exception: {e}; last message: {raw_msg}")
                participant.flag_connection = False

        logging.warning(f"_communication_thread: closing thread for {participant}")
        logging.warning(f"_communication_thread: list of active threads: {enumerate()}")
        participant.client.close()

    def _open_communication_thread(self, participant):
        logging.warning("_open_communication_thread: opening")
        t = Thread(target=self._communication_thread, args=(participant,))
        t.name = f"com_thread_({participant.addr}; {participant.chat_participant_id_subscribed}; {participant.name})"
        t.start()

    def fetch_chat_data_from_db(self):
        pass

    def _restart(self, tentatives=10, time_interval=3):
        for _ in range(tentatives):
            try:
                self.fetch_chat_data_from_db()
                logging.warning(f"_restart: restarting attempt: {_}/{tentatives}.")
                self.run()
            except Exception as e:
                logging.warning(f"_restart: reconnection failed, exception: {e}. Attempt number {_}/{tentatives}")
            logging.warning(f"_restart: sleeping {3} seconds before next tentative.")
            time.sleep(time_interval)

    def run(self):
        logging.warning(f"run: running websocket on {self.addr}")

        while True:
            try:
                self.socket = socket(AF_INET, SOCK_STREAM)
                self.socket.bind(self.addr)
                self.socket.listen(MAX_CONNECTIONS)
                logging.warning("run: ws successfully started. Listening.")
                ACCEPT_THREAD = Thread(target=self.wait_for_connection, name="run_thread")
                ACCEPT_THREAD.start()
                ACCEPT_THREAD.join()
                server.socket.close()

            except Exception as e:
                logging.warning(f"run: exception encountered {e}")
                break
            
        time.sleep(5)  # give time for port to be freed again
        self._restart()


if __name__ == "__main__":
    server = ChatWsServer()
    server.run()
