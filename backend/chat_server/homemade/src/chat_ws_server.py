from socket import AF_INET, socket, SOCK_STREAM, timeout
from threading import Thread, enumerate, active_count
import time
from chat_participant import ChatParticipant
from base64 import b64encode, b64decode, decodebytes
from hashlib import sha1
import logging
import logging.handlers as handlers
import ws_config_chat
import ast
from chat_db import ChatDb
from tools import Tools
import sys
import re
from pprint import pprint
from email_notifier import send_error_email
import cchardet


"""
TODO: 
        - Check timeouts for connection in code.
        - Add "editMsg", "deleteMsg", "silenceUser", "banUser"
"""


# LOGGER CONFIGS
LOG_LEVEL = logging.DEBUG
LOG_FILENAME = '/home/cloud-user/logs/chat_ws_server.log'
logger = logging.getLogger()
logger.setLevel(LOG_LEVEL)
formatter = logging.Formatter('%(asctime)s %(levelname)s {%(module)s} [%(funcName)s] %(message)s')

# "Log things everydayyyy!" - Snoop Dogg
logHandler = handlers.TimedRotatingFileHandler(LOG_FILENAME, when='midnight', interval=1)
logHandler.setLevel(LOG_LEVEL)
logHandler.setFormatter(formatter)
logHandler.suffix = "%Y%m%d"
logger.addHandler(logHandler)


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

        # dictionary indexed by chat_participant_group_id and list of participants
        self.chat_groups = {}

        # connecting to db
        self.chat_db = ChatDb()

    def _stop(self):
        self.chat_db._disconnect_from_db()
        self.socket.close()

    def _reset_memory(self):
        self.chat_groups = {}

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
                    # byte_msg = self.tools.dict_to_bytes(msg)
                    byte_msg = self.encode_websocket_string_msg(str(msg))
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

        elif action == "banUser":
            raise NotImplementedError

        elif action == "unbanUser":
            raise NotImplementedError

        elif action == "silenceUser":
            raise NotImplementedError

        elif action == "unsilenceUser":
            raise NotImplementedError

        elif action == "editMsg":
            raise NotImplementedError

        elif action == "deleteMsg":
            raise NotImplementedError

        elif action == "requestMic":
            self.handle_client_requestMic(msg, participant=participant)

        elif action == "passMic":
            self.handle_client_passMic(msg, participant=participant)

        elif action == "removeMic":
            self.handle_client_removeMic(msg, participant=participant)   

    def handle_client_connect(self, msg, ip_address=None, client=None, participant=None):
        # msg in json format
        if "user_id" in msg:
            user_id = msg["user_id"]
        else:
            user_id = None

        if "user_status" in msg:
            user_status = msg["user_status"]
        else:
            user_status = None

        if msg["action"] != "connect":
            logging.warning(f"handle_client_connect: an unconnected client sent another request. msg: {msg}")
            if msg["action"] == "disconnect":
                self._on_message(msg, ip_address=ip_address, client=client)
        else:
            # get user
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

                        participant = ChatParticipant(ip_address, client, chat_participant_id_subscribed, chat_participant_id_blocked, user_status=user_status)
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
                        participant = ChatParticipant(ip_address, client, chat_participant_id_subscribed, chat_participant_id_blocked, user_status=user_status)
                        
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
                    encoded_bytes = self.encode_websocket_string_msg(str(payload))
                    participant.client.send(encoded_bytes)

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
                body = {
                            "action": "sendMsg",
                            "user_name": participant.name,
                            "user_id": participant.user_id,
                            "chat_participant_group_id": sub_group_id,
                            "msg": msg["msg"]
                            }

                if TESTING:
                    body["query_time"] = time.time() - msg["utc_ts_s"]

                payload = self.tools._wrapper(200, body)

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

    def handle_client_requestMic(self, msg, participant):
        # 2 check that room allows such status to request mic 
        # IGNORED FOR NOW - EVERYBODY CAN REQUEST
        # possible values: visitor, verified, admin, moderator, community_member, partner

        # 3 broadcast request message to user in chatroom so see that he requested it
        try:
            if participant.user_status != "silenced" or participant.user_status != "banned":
                chat_participant_group_id = msg["chat_participant_group_id"]
                body = {
                    "action": "requestMic",
                    "user_name": participant.name,
                    "user_id": participant.user_id,
                    "chat_participant_group_id": chat_participant_group_id
                    }
                
                payload = self.tools._wrapper(200, body)
                self.broadcast(payload, chat_participant_group_id)
                logging.warning("handle_client_requestMic: request successfully broadcasted.") 
        except Exception as e:
            logging.warning(f"handle_client_requestMic: exception encountered: {e}.") 


    def handle_client_passMic(self, msg, participant):
        try:
            # check that user is admin
            if participant.user_status in ["admin", "moderator"]:
                chat_participant_group_id = msg["chat_participant_group_id"]
                user_id_target = msg["user_id_target"]
                
                # find requester
                requester_was_found = False
                for potential_requester in self.chat_groups[chat_participant_group_id]:
                    if potential_requester.user_id == user_id_target:
                        if potential_requester.user_status not in ["banned", "silenced"]:
                            body = {
                                "action": "passMic",
                                "user_id__target": potential_requester.user_id,
                                "chat_participant_group_id": chat_participant_group_id,
                                "user_name_target": potential_requester.name
                                }
                            payload = self.tools._wrapper(200, body)
                            self.broadcast(payload, chat_participant_group_id)
                            logging.warning("handle_client_passMic: request successfully broadcasted.")
                            requester_was_found = True
                            break
                        else:
                            body = {
                                "action": "passMic",
                                "error_msg": "mic requester not found"
                                "user_id__target": potential_requester.user_id,
                                "chat_participant_group_id": chat_participant_group_id,
                                "user_name_target": potential_requester.name
                                }
                            payload = self.tools._wrapper(403, body)

                            self.broadcast(payload, chat_participant_group_id)
                            logging.warning("handle_client_passMic: attempt to give microphone to a banned/silenced user. Contact software dev team to follow that on (not normal that it happened.).")
                
                # if Requester not found
                if requester_was_found is False:
                    body = {
                        "action": "passMic",
                        "error_msg": "mic requester not found"
                        "user_id__target": potential_requester.user_id,
                        "chat_participant_group_id": chat_participant_group_id,
                        "user_name_target": potential_requester.name
                        }
                    payload = self.tools._wrapper(404, body)

                    self.broadcast(payload, chat_participant_group_id)
                    logging.warning("handle_client_passMic: mic requester not found.")

        except Exception as e:
            logging.warning(f"handle_client_passMic: exception encountered: {e}.") 

    def handle_client_removeMic(self, participant):
        # 1 check that user is admin
        if participant.user_status in ["admin", "moderator"]:
            chat_participant_group_id = msg["chat_participant_group_id"]
            user_id_current_speaker = msg["user_id_target"]

            # Look for that user that has the mic
            current_speaker_was_found = False
            for potential_current_speaker in self.chat_groups[chat_participant_group_id]:
                if potential_current_speaker.user_id == uuser_id_current_speaker:
                    body = {
                        "action": "removeMic",
                        "user_id__target": potential_requester.user_id,
                        "chat_participant_group_id": chat_participant_group_id,
                        "user_name_target": potential_requester.name
                        }
                    payload = self.tools._wrapper(200, body)
                    self.broadcast(payload, chat_participant_group_id)
                    logging.warning("handle_client_removeMic: request successfully broadcasted.")
                    current_speaker_was_found = True
            
            # if speaker not found
            if current_speaker_was_found is False:
                body = {
                    "action": "removeMic",
                    "error_msg": "current speaker not found"
                    "user_id__target": potential_requester.user_id,
                    "chat_participant_group_id": chat_participant_group_id,
                    "user_name_target": potential_requester.name
                    }
                payload = self.tools._wrapper(404, body)

                self.broadcast(payload, chat_participant_group_id)
                logging.warning("handle_client_removeMic: current speaker not found.")

    def handle_error(self, client, error_dict):
        encoded_msg = self.encode_websocket_string_msg(str(error_dict))
        client.send(encoded_msg)

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

    def _listen_connection_thread(self, client, addr, timeout_on_acceptance=30):
        """ Logic for each new connections.

        it is written such that the handshake at the start is not required.
        """
        client.settimeout(timeout_on_acceptance)
        try:
            msg = client.recv(self.buffer_size)
            logging.warning(f"_listen_connection_thread: msg = {msg}.")

            # (prevents from reading empty messages; 5 arbitrary
            if len(msg) > 5:
                msg = msg.decode("utf-8")
                # A. Forces that the first message is a handshake (and not a json)
                if "{" not in msg:
                    logging.warning(f"_listen_connection_thread: received a non-json msg. msg: {msg}.")
                    response_key = self._get_handshake_key(msg)

                    if response_key != None:
                        logging.warning(f"_listen_connection_thread: checking client handshake format.")
                        self.handle_client_handshake(response_key, client=client)
                        logging.warning(f"_listen_connection_thread: successfull handshake. Waiting for a connection request.")

                        # B. If handshake successful, wait for connection request
                        wait_for_request_msg = True
                        _start_waiting_time = time.time()
                        
                        # (while loop to filter empty message and timeout for next message)
                        while wait_for_request_msg:
                            if time.time() - _start_waiting_time > timeout_on_acceptance:
                                payload = {"msg": "connection timed out."}
                                msg = self.tools._wrapper(408, payload)
                                # byte_msg = self.tools.dict_to_bytes(msg)
                                byte_msg = self.encode_websocket_string_msg(str(msg))
                                client.client.send(byte_msg)
                                wait_for_request_msg=False
                            else:
                                msg = client.recv(self.buffer_size)
                                if len(msg) > 5:
                                    logging.warning(f"_listen_connection_thread: raw msg = {msg}.")
                                    decoded_string = self.decode_websocket_byte_msg(msg)
                                    logging.warning(f"_listen_connection_thread: decoded_string = {decoded_string}.")
                                    if "{" in decoded_string:
                                        logging.warning(f"_listen_connection_thread: request msg = {decoded_string}.")
                                        msgs = self.tools.split_concatenated_dict_strings(decoded_string)

                                        for raw_str in msgs:
                                            dict_msg = ast.literal_eval(raw_str)
                                            logging.warning(f"Current state of the chat_groups: {self.chat_groups}")
                                            logging.warning(f"_listen_connection_thread: rcv msg: {dict_msg}, type: {type(dict_msg)}")

                                            self.handle_client_connect(msg=dict_msg, ip_address=addr[0], client=client)
                                    
                                        wait_for_request_msg = False

        except Exception as e:
            logging.warning(f"_listen_connection_thread: exception encountered: {e}")

        finally:
            logging.warning(f"_listen_connection_thread: thread terminated.")

    def handle_client_handshake(self, response_key, client):
        handshake_ans = (
            'HTTP/1.1 101 Switching Protocols',
            'Upgrade: websocket',
            'Connection: Upgrade',
            'Sec-WebSocket-Accept: {key}\r\n\r\n'
            )

        response = '\r\n'.join(handshake_ans).format(key=response_key)
        client.send(response.encode("utf-8"))
        logging.warning(f"handle_handshake: handshake from client in good format. Sending response: {response}.")

    def _get_handshake_key(self, text_msg):
        """Example of expected Handshake form:

        GET / HTTP/1.1
        Connection: keep-alive, Upgrade
        Host: localhost:5500
        User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:75.0) Gecko/20100101 Firefox/75.0
        Origin: http://localhost:3000
        Accept: /
        Upgrade: websocket
        Accept-Language: en-US,en;q=0.5
        Accept-Encoding: gzip, deflate
        Sec-WebSocket-Version: 13
        Sec-WebSocket-Extensions: permessage-deflate
        Sec-WebSocket-Key: AgtYvRfpQVCYykSvVSabGQ==
        DNT: 1
        Cookie: JSESSIONID=B348ED333491B3BABA4E9BE04D77A1E4
        Pragma: no-cache
        Cache-Control: no-cache
        """
        # get the key
        key = re.search('Sec-WebSocket-Key:\s+(.*?)[\n\r]+', text_msg)
        if key is not None:
            try:
                key = (key.groups()[0].strip())
                GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"  # defined by RFC 6455
                response_key = b64encode(sha1((key + GUID).encode("utf-8")).digest()).decode("utf-8")

                return response_key

            except Exception as e:
                raise Exception(f"_get_handshake_key: received message did not contain a websocket key. Exception: {e}")

    def _communication_thread(self, participant, time_sleep=1, timeout=60):
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
                    # byte_msg = self.tools.dict_to_bytes(msg)
                    byte_msg = self.encode_websocket_string_msg(str(msg))
                    participant.client.send(byte_msg)
                    participant.flag_connection=False

                elif time.time() - participant.last_ping < 0:
                    logging.warning("_communication_thread: problem with the timestamps provided by the ping/pong. Negative value raised.")

                else:
                    # handle message msg
                    raw_msg = participant.client.recv(self.buffer_size)
                    decoded_msg = self.decode_websocket_byte_msg(raw_msg)
                    if "{" in decoded_msg and "}" in decoded_msg:
                        msgs = self.tools.split_concatenated_dict_strings(decoded_msg)
                        for msg in msgs:
                            if len(msg) > 0:
                                msg = ast.literal_eval(msg)
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

    @staticmethod
    def decode_websocket_byte_msg(ws_encoded_byte):
        """Takes a bytes as input and returns a string
        
        Stolen from https://stackoverflow.com/questions/8125507/how-can-i-send-and-receive-websocket-messages-on-the-server-side
        
        Args:
            ws_encoded_byte (bytes): decoded bytes

        Returns:
            string: decoded bytes
        """
        byteArray =  ws_encoded_byte 
        datalength = byteArray[1] & 127
        indexFirstMask = 2 
        if datalength == 126:
            indexFirstMask = 4
        elif datalength == 127:
            indexFirstMask = 10
        masks = [m for m in byteArray[indexFirstMask : indexFirstMask+4]]
        indexFirstDataByte = indexFirstMask + 4
        decodedChars = []
        i = indexFirstDataByte
        j = 0
        while i < len(byteArray):
            decodedChars.append( chr(byteArray[i] ^ masks[j % 4]) )
            i += 1
            j += 1
        return ''.join(decodedChars)

    @staticmethod
    def encode_websocket_string_msg(string_msg):
        """Takes a string as input and returns a byte. Required in ws handshake.
        
        Stolen from https://stackoverflow.com/questions/8125507/how-can-i-send-and-receive-websocket-messages-on-the-server-side
        
        Args:
            string: real message

        Returns:
            ws_encoded_byte (bytes): encoded bytes
        """
        bytesFormatted = []
        bytesFormatted.append(129)

        bytesRaw = string_msg.encode()
        bytesLength = len(bytesRaw)
        if bytesLength <= 125 :
            bytesFormatted.append(bytesLength)
        elif bytesLength >= 126 and bytesLength <= 65535 :
            bytesFormatted.append(126)
            bytesFormatted.append( ( bytesLength >> 8 ) & 255 )
            bytesFormatted.append( bytesLength & 255 )
        else :
            bytesFormatted.append( 127 )
            bytesFormatted.append( ( bytesLength >> 56 ) & 255 )
            bytesFormatted.append( ( bytesLength >> 48 ) & 255 )
            bytesFormatted.append( ( bytesLength >> 40 ) & 255 )
            bytesFormatted.append( ( bytesLength >> 32 ) & 255 )
            bytesFormatted.append( ( bytesLength >> 24 ) & 255 )
            bytesFormatted.append( ( bytesLength >> 16 ) & 255 )
            bytesFormatted.append( ( bytesLength >>  8 ) & 255 )
            bytesFormatted.append( bytesLength & 255 )

        bytesFormatted = bytes(bytesFormatted)
        bytesFormatted = bytesFormatted + bytesRaw

        return bytesFormatted


if __name__ == "__main__":
    server = ChatWsServer()
    server.run()
    send_error_email("ChatWebsocket", "Not running anymore", "")
