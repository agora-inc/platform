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

try:
    con = pymysql.connect(host=host, user=user, password=password, db=db_name, cursorclass=pymysql.cursors.DictCursor)
except pymysql.MySQLError as e:
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
    logger.error(e)
    sys.exit()

def _wrapper(status_code, body, header={}):
    return {"statusCode": status_code, "body": body}

def handler(event, context):
    """
    This function fetches content from RDS instance
    """
    # get "RemoteAddr" from the HTTP request and add it in the DB
    return _wrapper(200, "yesbro2")
    ip_address = event["headers"]["X-Forwarded-For"]


# if __name__ == "__main__":
#     #############
#     # TEST UNIT: #
#     #############
#     import time
#     event_example = {"chat_id": 16, "headers": {"X-Forwarded-For": "192.168.1.1"}}
#     time_before = time.time()
#     print(handler(event_example, {}))
#     print(time.time() - time_before)