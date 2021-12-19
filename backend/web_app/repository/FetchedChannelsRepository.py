import random
import logging
from mailing.sendgridApi import sendgridApi
from repository import UserRepository
from databases import agora_db

mail_sys = sendgridApi()

class FetchedChannelsRepository:
    def __init__(self, db=agora_db, mail_sys=mail_sys):
        self.db = db
        self.mail_sys = mail_sys
        self.users = UserRepository.UserRepository(db=self.db)
        

    def addFetchedChannelsFromRss(self, organiser_contact, userId, isClaimed):
        if(organiser_contact is not None):
            if 'email_address' in organiser_contact:
                query = f'''INSERT INTO FetchedChannels 
                (channel_id, user_id, claimed, organiser_name, organiser_email) 
                VALUES 
                ({insertId}, "{organiser_contact['name']}", {userId}, {isClaimed}, "{organiser_contact['email_address']}")'''
                self.db.run_query(query)
            elif 'homepage' in organiser_contact:
                query = f'''INSERT INTO FetchedChannels 
                (channel_id, user_id, claimed, organiser_name, organiser_homepage_url) 
                VALUES 
                ({insertId}, "{organiser_contact['name']}", {userId}, {isClaimed}, "{organiser_contact['homepage']}")'''
                self.db.run_query(query)