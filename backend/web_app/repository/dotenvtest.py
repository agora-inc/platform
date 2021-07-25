import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

DB = os.environ.get("db")
USER = os.environ.get("user")
PASSWORD = os.environ.get("password")
HOST = os.environ.get("host")


print(DB , USER , PASSWORD , HOST) 