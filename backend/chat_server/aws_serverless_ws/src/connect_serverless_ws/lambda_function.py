import pymysql
import logging
import rds_config
import sys

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

    # get "RemoteAddr" from the HTTP request and add it in the DB
    ip_address = event["headers"]["X-Forwarded-For"]

    assert("chat_id" in event)
    chat_id = event["chat_id"]

    if "user_id" in event:
        user_id = event["user_id"]
    else:
        user_id = "NULL"

    try:
        cursor = con.cursor()

        ####################### TO DO ########################
        # PLACEHOLDER: check if user has as a special role in the channel
        # CHECK UserGroups table associated to the channel
        # IF USER BLOCKED: STOP. 
        # (For now, ignore)
        ######################################################

        # get chat_participant_group_id of the subscribed_chat
        ids = []
        for group_type in ["subscribed", "blocked"]:
            cursor.execute(f"SELECT id, chat_type FROM ChatParticipantGroups WHERE chat_id={chat_id} and group_type='{group_type}'")
            result = cursor.fetchall()

            if len(result) > 1:
                con.commit()
                cursor.close() 
                return _wrapper(f"internal_db_error: ChatParticipantGroups with group_type '{group_type}' for channel {chat_id} is not unique", 500)
            elif len(result) == 0:
                con.commit()
                cursor.close()      
                return _wrapper(f"internal_db_error: ChatParticipantGroups with group_type '{group_type}' for channel {chat_id} does not exist.", 500)
            else:
                ids.append(result[0])

        subscribed_id, blocked_id = ids[0]["id"], ids[1]["id"]
        chat_type = ids[0]["chat_type"]

        # check if visiting user is blocked
        cursor.execute(f"SELECT * FROM ChatParticipants WHERE chat_participant_group_id='{blocked_id}' and ip_address='{ip_address}'")
        result = cursor.fetchall()

        if len(result) > 0:
            con.commit()
            cursor.close() 
            return _wrapper(400, "you have been blocked by an admin.")

        else:
            cursor.execute(f"INSERT INTO ChatParticipants(user_id, ip_address, chat_participant_group_id, chat_id) VALUES ({user_id}, '{ip_address}', {subscribed_id}, {chat_id})")
            con.commit()
            cursor.close()
            return _wrapper(200, body={"action": "connect", "chat_participant_group_id": subscribed_id, "group_type": chat_type})

    except Exception as e:
        con.commit()
        cursor.close()
        return _wrapper(500, f"internal error: {e}")


if __name__ == "__main__":
    #############
    # TEST UNIT: #
    #############
    event_example = {"chat_id": 16, "headers": {"X-Forwarded-For": "192.168.1.1"}}
    print(handler(event_example, {}))