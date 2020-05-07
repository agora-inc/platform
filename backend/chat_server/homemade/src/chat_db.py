import pymysql
import logging
import rds_cred
import time
from tools import Tools
from threading import Thread


class ChatDb:
    def __init__(self):
        self.tools = Tools()
        self._connect_to_db()

        # start thread to keep db connection on
        # t = Thread(target=self._check_connection, args=())
        # t.start()

    def get_thread_con(self):
        host = rds_cred.host
        user = rds_cred.user
        psw = rds_cred.psw
        db = rds_cred.db_name
        try:
            con = pymysql.connect(host=host, user=user, password=psw, db=db, cursorclass=pymysql.cursors.DictCursor)
            return con
        except Exception as e:
            logging.warning(f"(ChatDb)_connect_to_db: exception raised: {e}")

    def _connect_to_db(self):
        host = rds_cred.host
        user = rds_cred.user
        psw = rds_cred.psw
        db = rds_cred.db_name
        try:
            self.con = pymysql.connect(host=host, user=user, password=psw, db=db, cursorclass=pymysql.cursors.DictCursor)
        except Exception as e:
            logging.warning(f"(ChatDb)_connect_to_db: exception raised: {e}")

    def _reconnect_to_db(self, tentatives=10, time_interval=3):
        for _ in range(tentatives):
            try:
                self._disconnect_from_db()
                self._connect_to_db()
                logging.info("(ChatDb)_reconnect: successfull reconnection.")
            except Exception as e:
                logging.warning(f"(ChatDb)_reconnect_to_db: reconnection failed, exception: {e}. Attempt number {_ + 1}/{tentatives}")
            time.sleep(time_interval)

    def _disconnect_from_db(self):
        try:
            self.con.close()
        except Exception as e:
            logging.info(f"(ChatDb)_disconnect_from_db: failed attempt to disconnect. Exception: {e}")

    def get_chat_participant_group_ids(self, chat_id):
        """Queries id of the chat participant groups for the "subscribed" and "block" groups and recovers as well the chat type.

        Args:
            chat_id (int): chat id in db

        Returns:
            list: first element is the id of the subscribed group; second one is the one of the block group.
        """
        ids = []
        try:
            cursor = self.con.cursor()
            # get id chat_participant_id_subscribed and chat_participant_id_blocked
            for group_type in ["subscribed", "blocked"]:
                cursor.execute(f"SELECT id, chat_type FROM ChatParticipantGroups WHERE chat_id={chat_id} and group_type='{group_type}'")
                result = cursor.fetchall()

                if len(result) > 1:
                    self.con.commit()
                    error_payload = {"error_msg": f"internal_db_error: ChatParticipantGroups with group_type '{group_type}' for channel {chat_id} is not unique", "src": "db"}
                    return self.tools._wrapper(500, body=error_payload)
                elif len(result) == 0:
                    self.con.commit()
                    error_payload = {"error_msg": f"internal_db_error: ChatParticipantGroups with group_type '{group_type}' for channel {chat_id} does not exist.", "src": "db"}
                    return self.tools._wrapper(500, body=error_payload)
                else:
                    ids.append(result[0])

            cursor.close()      
            chat_participant_id_subscribed, chat_participant_id_blocked = ids[0]["id"], ids[1]["id"]
            chat_type = ids[0]["chat_type"]

            return chat_participant_id_subscribed, chat_participant_id_blocked, chat_type

        except Exception as e:
            logging.warning(f"(ChatDb)get_chat_participant_group_ids: exception: {e}")

    def _check_connection(self):
        while True:
            if not self.con.open:
                logging.warning("_check_connection: connection failed; restarting it.")
                self._reconnect_to_db()
            time.sleep(0.1)


# TEST UNIT:
# if __name__ == "__main__":
#     obj = ChatDb()
#     print(obj.get_chat_participant_group_ids(15))