import datetime
from flask import Flask
from flask_mail import Mail
from flask_cors import CORS
import logging
import sys

app = Flask(__name__)
logging.basicConfig(filename=f"/home/cloud-user/logs/{datetime.datetime.utcnow().isoformat()[:10]}.log", level=logging.DEBUG, format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')
# logging.basicConfig(filename="agora.log", level=logging.DEBUG, format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')
CORS(app)

app.config['MAIL_SERVER']='smtp.office365.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'team@agora.stream'
app.config['MAIL_PASSWORD'] = '123.qwe.asd'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

from app import routes