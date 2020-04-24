import psycopg2
import logging
import rds_config
import sys

#rds settings
rds_host  = "rds-instance-endpoint"
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

# logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

try:
    conn = psycopg2.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
except Exception as e:
    logger.error("ERROR: Unexpected error: Could not connect to PostgreSQL-1 instance.")
    logger.error(e)
    sys.exit()

logger.info("SUCCESS: Connection to RDS PostgreSQL-1 instance succeeded")
def handler(event, context):
    """
    This function fetches content from PostgreSQL-1 RDS instance
    """

    with conn.cursor() as cur:
        cur.execute("create table Employee ( EmpID  int NOT NULL, Name varchar(255) NOT NULL, PRIMARY KEY (EmpID))")
    conn.commit()

    return "Deleted 1 item from RDS PostgreSQL-1 table"