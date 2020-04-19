from flask import Flask
import pymysql
from flask_cors import CORS

class Database:
    def __init__(self):
        host = "apollo-2.c91ghtqneybi.eu-west-2.rds.amazonaws.com"
        user = "admin"
        password = "123.qwe.asd"
        db = "apollo"
        self.con = pymysql.connect(host=host, user=user, password=password, db=db, cursorclass=pymysql.cursors.
                                   DictCursor)

app = Flask(__name__)
CORS(app)

db = Database()

from app import routes