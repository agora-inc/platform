import random
import logging
from mailing.sendgridApi import sendgridApi
from repository import UserRepository
from databases import agora_db
import hashlib
from datetime import datetime

mail_sys = sendgridApi()

class FetchedChannelsRepository:
    def __init__(self, db=agora_db, mail_sys=mail_sys):
        self.db = db
        self.mail_sys = mail_sys
        self.users = UserRepository.UserRepository(db=self.db)
        
    # Get insertId after adding channel to db
    def addFetchedChannelsFromRss(self, insertId, organiser_contact, userId, isClaimed):
        if(organiser_contact is not None):
            h = hashlib.new('ripemd160')
            h.update(f"2{insertId} {datetime.now()}".encode('utf-8'))
            if 'email_address' in organiser_contact:
                query = f'''INSERT INTO FetchedChannels 
                (channel_id, user_id, claimed, organiser_name, organiser_email, mailToken) 
                VALUES 
                ({insertId}, {userId}, {isClaimed},"{organiser_contact['name']}", "{organiser_contact['email_address']}", "{h.hexdigest()}"))'''
                self.db.run_query(query)
            elif 'homepage' in organiser_contact:
                query = f'''INSERT INTO FetchedChannels 
                (channel_id, user_id, claimed, organiser_name, organiser_homepage_url, mailToken) 
                VALUES 
                ({insertId},  {userId}, {isClaimed}, "{organiser_contact['name']}", "{organiser_contact['homepage']}", "{h.hexdigest()}"))'''
                self.db.run_query(query)