from socket import AF_INET, socket, SOCK_STREAM, timeout
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
from email_notifier import send_error_email

# GLOBAL CONSTANTS
HOST = ws_config_chat.host
PORT = ws_config_chat.port
MAX_CONNECTIONS = ws_config_chat.max_connections
BUFFER_SIZE = ws_config_chat.buffer_size

TESTING = True


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
            logging.info("on_message: already connected user requests connection.")
            pass

        elif action == "disconnect":
            self.handle_client_disconnect(msg, participant=participant)

        elif action == "ping":
            self.handle_client_ping(msg, participant=participant)

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

            # A. check if the chatgroups exist, else return error to client
            try:
                response = self.chat_db.get_chat_participant_group_ids(chat_id)
                chat_participant_id_subscribed, chat_participant_id_blocked, group_type = response
                if chat_participant_id_subscribed == None:
                    raise Exception(f"handle_client_connect: no chat_participant_id_subscribed associated to {chat_id} exists ")

            except Exception as e:
                self.handle_error(client, response)
                return
            
            # opens a connection to DB
            con = self.chat_db.get_thread_con()
            cursor = con.cursor()
            cursor.execute(f"SELECT id FROM ChatParticipants WHERE chat_participant_group_id='{chat_participant_id_blocked}' and ip_address='{ip_address}'")
            result = cursor.fetchall()
            logging.warning(f"handle_client_connect: room_id obtained: subs_id: {chat_participant_id_subscribed}; block_id:{chat_participant_id_blocked}")

            # B. If user blocked, do not accept
            if len(result) > 0:
                con.commit()
                cursor.close() 
                con.close()
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
                        con.close()

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

                    if TESTING:
                        body["query_time"] = time.time() - msg["utc_ts_s"]

                    payload = self.tools._wrapper(200, body=body)
                    participant.client.send(bytes(str(payload), "utf8"))

                    # F. Start listening to the client.
                    logging.warning(f"handle_client_connect: new admitted connection; ip_address: {ip_address}, chat_participant_id_subscribed: {chat_participant_id_subscribed}")
                    self._communication_thread(participant)

                except Exception as e:
                    logging.warning(f"handle_client_connect: Exception section B: {e}")

    def _remove_participant_from_memory(self, participant):
        sub_group_id = participant.chat_participant_id_subscribed
        
        # clean exit the communication thread
        participant.flag_connection = False

        # delete the guy from memory
        if sub_group_id in self.chat_groups:
            try:
                self.chat_groups[sub_group_id].remove(participant)
                del participant
            except:
                pass

    def _remove_participant_from_db(self, ip_address=None, sub_group_id=None, participant=None):
        if (ip_address != None and sub_group_id != None) or participant != None:
            try:
                if (ip_address == None and sub_group_id == None):
                    ip_address = participant.addr
                    sub_group_id = participant.chat_participant_id_subscribed

                con = self.chat_db.get_thread_con()
                cursor = con.cursor()
                cursor.execute(f"DELETE FROM ChatParticipants where ip_address='{ip_address}' and chat_participant_group_id={sub_group_id}")
                con.commit()
                cursor.close()
                con.close()

                logging.warning("remove_participant_from_db: user succesfully removed from DB.")
            except Exception as e:
                logging.debug(f"remove_participant_from_db: participant ({ip_address}) removal from db failed; exception {e}.")

        else:
            logging.warning("remove_participant_from_db: did not act as all arguments were None.")

    def _remove_participant_from_system(self, ip_address=None, sub_group_id=None, participant=None):
        
        if (ip_address != None and sub_group_id != None) or participant != None:
            pass
        else:
            logging.warning("remove_participant_from_db: inedequate arguments")

        try:
            # (order of deletion matter)
            if participant != None:
                self._remove_participant_from_db(ip_address, sub_group_id)
                self._remove_participant_from_memory(participant)

            elif not (ip_address != None and sub_group_id != None):
                self._remove_participant_from_db(ip_address, sub_group_id)
            
            logging.warning(f"_remove_participant_from_system: participant ({ip_address}) successfully removed from system.")

        except Exception as e:
            logging.debug(f"_remove_participant_from_system: participant ({ip_address}) removal from system failed; exception {e}.")
    
    def handle_client_disconnect(self, msg, participant, broadcast_on_leave=False):
        logging.warning(f"handle_client_disconnect: msg:{msg}")
        if participant == None:
            ip_address = msg["ip_address"]
            sub_group_id = msg["chat_participant_group_id"]
        else:
            ip_address = participant.addr
            sub_group_id = participant.chat_participant_id_subscribed
            
        try:
            if participant != None and broadcast_on_leave:
                # broadcast to its group that he left
                body = {
                            "action": "disconnect",
                            "user_name": participant.name,
                            "chat_participant_group_id": sub_group_id
                            }

                if TESTING:
                    body["query_time"] = time.time() - msg["utc_ts_s"]

                payload = self.tools._wrapper(200, body)
                self.broadcast(payload, sub_group_id)

            if participant == None:
                self._remove_participant_from_system(ip_address, sub_group_id)
            else:
                self._remove_participant_from_system(participant=participant)

            logging.warning(f"handle_client_disconnect: successfully removed participant ({ip_address}, {sub_group_id}) from the system")

        except Exception as e:
            logging.warning(f"handle_client_disconnect: participant ({ip_address}) disconnection failed; exception {e}.")

    def handle_client_ping(self, msg, participant):
        new_ping_time = msg["utc_ts_in_s"]

        if type(new_ping_time) == str:
            try:
                new_ping_time = int(new_ping_time)
                participant.last_ping = new_ping_time
            except Exception as e:
                logging.warning(f"handle_client_ping: timestamp for ping not an integer. Exception: {e}")

        assert(isinstance(new_ping_time, int))

        pong_dict = {"statusCode": 200, "action": "pong", "utc_time_in_s": time.time()}
        response = self.tools.dict_to_bytes(pong_dict)

        participant.client.send(response)

    def handle_client_sendMsg(self, msg, participant):
        # check if user is blocked
        con = self.chat_db.get_thread_con()
        cursor = con.cursor()
        cursor.execute(f"SELECT id FROM ChatParticipants WHERE chat_participant_group_id='{participant.chat_participant_id_blocked}' and ip_address='{participant.addr}'")
        res = cursor.fetchall()
        cursor.close()
        con.close()

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

                if TESTING:
                    payload["query_time"] = time.time() - msg["utc_ts_s"]

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

    def wait_for_connection(self):
        """
        Wait for connection from new clients, start new thread once connected
        :return: None
        """
        # wait for subscription message from participant
        while True:
            try:                
                client, addr = self.socket.accept()
                logging.warning("wait_for_connection: new connection.")
                logging.debug(f"_communication_thread: number of active threads: {active_count()}")
                logging.debug(f"_communication_thread: list of active threads: {enumerate()}")
        
                t = Thread(target=self._listen_connection_thread, kwargs={"client": client, "addr": addr})
                t.name = f"listening_connection_thread: {addr}"
                t.setDaemon(True)
                t.start()

            except Exception as e:
                logging.warning(f"wait_for_connection: exception encountered: {e}")
                break

        self.socket.close()
        logging.warning("wait_for_connection: Server stopped.")

    def _listen_connection_thread(self, client, addr, timeout_on_acceptance=3600):
        client.settimeout(timeout_on_acceptance)
        # prevents from reading empty messages
        try:
            msg = client.recv(self.buffer_size).decode("utf-8")
            logging.warning(f"_listen_connection_thread: msg = {msg}.")

            if len(msg) > 5:
                client.settimeout(None)
                msgs = self.tools.split_concatenated_dict_strings(msg)

                for msg in msgs:
                    dict_msg = ast.literal_eval(msg)
                    logging.warning(f"Current state of the chat_groups: {self.chat_groups}")
                    logging.warning(f"_listen_connection_thread: rcv msg: {dict_msg}, type: {type(dict_msg)}")

                    self.handle_client_connect(msg=dict_msg, ip_address=addr[0], client=client)

        except Exception as e:
            logging.warning(f"wait_for_connection: exception encountered: {e}")

    def _communication_thread(self, participant, time_sleep=1, timeout=6000):
        logging.warning(f"_communication_thread: number of active threads: {active_count()}")
        logging.debug(f"_communication_thread: list of active threads: {enumerate()}")

        # set a timeout on the socket
        participant.client.settimeout(timeout)
        ip_address = participant.addr
        chat_participant_id_subscribed = participant.chat_participant_id_subscribed

        while participant.flag_connection:  # wait for any messages from participant
            try:
                # check thread is not timed out
                if time.time() - participant.last_ping > timeout:
                    payload = {"msg": "connection timed out."}
                    msg = self.tools._wrapper(408, payload)
                    byte_msg = self.tools.dict_to_bytes(msg)
                    participant.client.send(byte_msg)
                    participant.flag_connection=False

                elif time.time() - participant.last_ping < 0:
                    logging.warning("_communication_thread: problem with the timestamps provided by the ping/pong. Negative value raised.")

                else:
                    # handle message msg
                    raw_msg = participant.client.recv(self.buffer_size)
                    msgs = self.tools.bytes_to_dict(raw_msg)
                    for msg in msgs:
                        if len(msg) > 0:
                            self._on_message(msg, participant=participant)

            except Exception as e:
                logging.warning(f"_communication_thread: exception: {e}")
                participant.flag_connection = False

        # HACK: sometimes, participant is None at this stage
        if participant != None:
            self._remove_participant_from_system(participant=participant)
        else:
            self._remove_participant_from_system(ip_address=ip_address, sub_group_id=chat_participant_id_subscribed)

    def fetch_chat_data_from_db(self):
        pass

    def _restart(self, tentatives=20, time_interval=5):
        for _ in range(tentatives):
            try:
                self.fetch_chat_data_from_db()
                logging.warning(f"_restart: restarting attempt: {_ + 1}/{tentatives}.")
                self._start()
            except Exception as e:
                logging.warning(f"_restart: reconnection failed, exception: {e}. Attempt number {_ + 1}/{tentatives}")
            logging.warning(f"_restart: sleeping {time_interval} seconds before next tentative.")
            time.sleep(time_interval)

    def _start(self):
        logging.warning(f"_start: running websocket on {self.addr}")
        self.socket = socket(AF_INET, SOCK_STREAM)
        self.socket.bind(self.addr)
        self.socket.listen(self.max_connections)

        logging.warning("_start: ws successfully started. Listening.")
        self.wait_for_connection()
        server.socket.close()

    def run(self):
        logging.warning(f"run: starting run method.")
        while True:
            try:
                self._start()
            except Exception as e:
                logging.warning(f"run: exception encountered {e}")
                break
        
        self.socket.close()
        logging.warning("run: Server stopped.")
        self._restart()


if __name__ == "__main__":
    server = ChatWsServer()
    server.run()
    send_error_email("ChatWebsocket", "Not running anymore", "")
