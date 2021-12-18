from __future__ import annotations
from mailing.sendgridApi import sendgridApi
from datetime import datetime, timedelta
from repository.ChannelRepository import ChannelRepository
from databases import agora_db
from typing import Final

mail_sys = sendgridApi()

class AgoraClaimRepository():
    
    def __init__(self, db=agora_db, VIEW_THRESHOLD = None, MAX_EMAIL_COUNT = 4):
        self.db = db
        self.channelRepo = ChannelRepository(db=db)
        self.mail_sys = mail_sys
        self.VIEW_THRESHOLD : Final = VIEW_THRESHOLD
        self.MAX_EMAIL_COUNT : Final = MAX_EMAIL_COUNT


    # Get channel(name,org_name,org_email, claimEmail count, mailToken)
    def getUnclaimedChannels(self: AgoraClaimRepository):

        if(self.VIEW_THRESHOLD == None):
            channel_query = '''SELECT Channels.id, Channels.name, FetchedChannels.organiser_name , 
                            FetchedChannels.organiser_email, FetchedChannels.mailToken, 
                            FetchedChannels.claim_email_count 
                            FROM Channels
                            INNER JOIN ChannelUsers
                            ON Channels.id = ChannelUsers.channel_id 
                            INNER JOIN FetchedChannels 
                            ON Channels.id = FetchedChannels.channel_id 
                            WHERE ChannelUsers.user_id = 360 and ChannelUsers.`role` = 'owner'
                            and FetchedChannels.user_id = 360 and FetchedChannels.claimed = 0
                            and FetchedChannels.organiser_email IS NOT NULL;'''
            unacquired_channels = self.db.run_query(channel_query)
            return unacquired_channels
        elif(isinstance(self.VIEW_THRESHOLD, int) and  self.VIEW_THRESHOLD > 0):
            channel_query = f'''SELECT Channels.id, Channels.name, 
                        FetchedChannels.organiser_name , FetchedChannels.organiser_email, 
                        FetchedChannels.mailToken, FetchedChannels.claim_email_count, 
                        ChannelViewCounts.total_views 
                        FROM Channels
                        INNER JOIN ChannelUsers
                        ON Channels.id = ChannelUsers.channel_id 
                        INNER JOIN FetchedChannels 
                        ON Channels.id = FetchedChannels.channel_id
                        INNER JOIN ChannelViewCounts 
                        ON Channels.id = ChannelViewCounts.channel_id
                        WHERE ChannelUsers.user_id = 360 and ChannelUsers.`role` = 'owner'
                        and FetchedChannels.user_id = 360 and FetchedChannels.claimed = 0
                        and FetchedChannels.organiser_email IS NOT NULL and
                        ChannelViewCounts.total_views >= {self.VIEW_THRESHOLD};'''
            unacquired_channels = self.db.run_query(channel_query)
            return unacquired_channels
            

    # Placeholder for pseudocode
    def send_email(self, channel):
        # Get channel name and mailing address and do magic
        if(channel['claim_email_count'] < self.MAX_EMAIL_COUNT - 1):
            # Send emails using sendgrid
            self.mail_sys.send_confirmation_agora_claim_request(
                channel['organiser_email'],
                channel['organiser_name'],
                channel['name'],
                channel['mailToken']
            )

            # Update tables
            query_email = f'''INSERT INTO claimEmails (channel_id, time) 
                            VALUES ({channel['id']}, {datetime.now()});'''
            self.db.run_query(query_email)
            query_email_2 = f'''UPDATE FetchedChannels SET claim_email_count = {channel['claim_email_count'] + 1} 
                            WHERE channel_id = {channel['id']};'''
            self.db.run_query(query_email_2)

        elif(channel['claim_email_count'] == self.MAX_EMAIL_COUNT - 1):
            # Send email using sendgrid
            self.mail_sys.send_confirmation_agora_claim_request_final(
                channel['organiser_email'],
                channel['organiser_name'],
                channel['name'],
                channel['mailToken']
            )

            # Update tables
            query_email = f'''INSERT INTO claimEmails (channel_id, time) 
                            VALUES ({channel['id']}, {datetime.now()});'''
            self.db.run_query(query_email)
            query_email_2 = f'''UPDATE FetchedChannels SET claim_email_count = {channel['claim_email_count'] + 1} 
                            WHERE channel_id = {channel['id']};'''
            self.db.run_query(query_email_2)

    
    def sendUnclaimedEmails(self):
        unclaimedChannels = self.getUnclaimedChannels()
        map(self.send_email(), unclaimedChannels)
        channelsToBeDeleted = [channel['id'] for channel in unclaimedChannels if channel['claim_email_count'] == self.MAX_EMAIL_COUNT]
        map(self.channelRepo.deleteChannel() , channelsToBeDeleted )
        # Run a query to update the claim_email_sent field in TABLE Channels
        # It should update it by one everytime until a certain limit
        # After the limit has been reached and the user doesn't claim within x days we delete the agora

    def updateClaim(self, mailToken):
        token_query = f'''UPDATE FetchedChannels SET claimed = 1 WHERE mailToken = {mailToken}'''
        self.db.run_query(token_query)

    
    def assignClaimEmail(self):
        pass



    
        

