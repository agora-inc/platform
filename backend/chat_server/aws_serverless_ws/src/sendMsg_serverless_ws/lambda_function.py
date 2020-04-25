import pymysql
import logging
import rds_config
import sys

from serverless_db import db 

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
        self.con = pymysql.connect(host=host, user=user, password=password, db=db_name, curso$
                                   DictCursor)


def handler(event, context):
    """
    This function fetches content from RDS instance
    """

    try:
        # get "RemoteAddr" from the HTTP request
        # get list of all adresses in DB
        # send msg to all the addresses

    except:

        return {"statusCode": 200, "data": event["action"]}