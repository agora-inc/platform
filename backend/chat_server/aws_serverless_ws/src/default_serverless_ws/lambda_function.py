import pymysql
import logging
import rds_config
import sys

# logger
logger = logging.getLogger()
logger.info("SUCCESS: Connection to RDS instance succeeded")

# DB
class Database:
    def __init__(self):
        host = rds_config.host
        user = rds_config.user
        password = rds_config.password
        db_name = rds_config.name
        self.con = pymysql.connect(host=host, user=user, password=password, db=db_name, cursorclass=pymysql.cursors)

def _wrapper(body, status_code, header):
    return {"statusCode": status_code, "body": body}


def handler(event, context):
    """
    This function fetches content from RDS instance
    """

    # get "RemoteAddr" from the HTTP request and add it in the DB
    id_addr = event["headers"]["X-Forwarded-For"]
    # test_2 = sourceIP

    return _wrapper()