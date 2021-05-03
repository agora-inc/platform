import random
import logging
from repository.ChannelRepository import ChannelRepository
from mailing.sendgridApi import sendgridApi

import json


class MailingListRepository:
    def __init__(self, db, mail_sys):
        self.db = db
        self.mail_sys = mail_sys
        self.channels = ChannelRepository(db=db)
        
    def addToMailingList(self, channelId, emails):
        for email in emails:
            add_email_query = f'''
                INSERT INTO ChannelMailingList (email, channel_id)
                VALUES {email}, {channelId};
            '''
            self.db.run_query(add_email_query)


