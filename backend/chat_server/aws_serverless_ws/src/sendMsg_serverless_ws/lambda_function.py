import pymysql
import logging
import rds_config
import sys
import requests

# logger
logger = logging.getLogger()
logger.info("SUCCESS: Connection to RDS instance succeeded")

# DB
host = rds_config.host
user = rds_config.user
password = rds_config.password
db_name = rds_config.name
con = pymysql.connect(host=host, user=user, password=password, db=db_name, cursorclass=pymysql.cursors.DictCursor)

def _wrapper(status_code, body, header={}):
    return {"statusCode": status_code, "body": body}

def handler(event, context):
    """
    This function fetches content from RDS instance
    """
    try:
        # get "RemoteAddr" from the HTTP request and add it in the DB
        ip_address = event["headers"]["X-Forwarded-For"]

        assert("chat_participant_group_id" in event)
        chat_participant_group_id = event["chat_participant_group_id"]

        if "user_id" in event:
            user_id = event["user_id"]
        else:
            user_id = "NULL"

        body = {
            "msg": event["msg"],
            "action": "receiveMsg",
            "group_type": event["group_type"],
            "chat_participant_group_id": chat_participant_group_id,
            "source_user_id": user_id
            }
    
        # A) if target_user_id, one-one conversation
        if "target_user_id" in event:
            cursor = con.cursor()
            cursor.execute(f"SELECT ip_address FROM OnlineUsers WHERE user_id={event[target_user_id]}")
            res = cursor.fetchall()

            for ip in res:
                requests.post(url=ip, body=body)

        # B) else, this is a msg to broadcast
        else:
            cursor.execute(f"SELECT ip_address FROM ChatParticipantGroups WHERE chat_id={chat_id} and chat_type='{event['group_type']}'")
            ips = cursor.fetchall()

            for i in ips:
                request.post(url=i["ip"], body=body)

        return _wrapper(200, body)
    
    except Exception as e:
        return _wrapper(500, f"Exception: {e}")


# if __name__ == "__main__":
#     #############
#     # TEST UNIT: #
#     #############
#     event_example = {"chat_id": 16, "headers": {"X-Forwarded-For": "192.168.1.1"}}
#     print(handler(event_example, {}))