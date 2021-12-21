from __future__ import annotations
import secrets
import string
from mailing.sendgridApi import sendgridApi
from datetime import datetime, timedelta
from repository.ChannelRepository import ChannelRepository
from repository.UserRepository import UserRepository
from app.databases import agora_db
from typing import Final

mail_sys = sendgridApi()

class AgoraClaimRepository():
    
    def __init__(self, db=agora_db, VIEW_THRESHOLD = None, MAX_EMAIL_COUNT = 4):
        self.db = db
        self.channelRepo = ChannelRepository(db=db)
        self.userRepo = UserRepository(db=db)
        self.mail_sys = mail_sys
        self.VIEW_THRESHOLD : Final = VIEW_THRESHOLD
        self.MAX_EMAIL_COUNT : Final = MAX_EMAIL_COUNT

    def get_all_fetched_channels(self):
        get_all_fetched_channels_query = f''' SELECT FetchedChannels.id FROM FetchedChannels WHERE claimReminder = 0
        '''
        unreminded_channels = self.db.run_query(get_all_fetched_channels_query)
        return unreminded_channels


    def generate_reminders(self, start_datetime, intervals, channel_id):
        for interval in intervals:
            start_datetime =  datetime.strptime(start_datetime, "%Y-%m-%d %H:%M")
            send_datetime = start_datetime +  timedelta(days=interval)
            now = datetime.now()
            if now < send_datetime: send_datetime = send_datetime.strftime("%Y-%m-%d %H:%M")
            claim_reminder_query = f'''
                        INSERT INTO claimReminders (
                            send_time,
                            fetchedchannelID,
                            status,
                        ) VALUES (
                            {send_datetime},
                            {channel_id},
                            "pending"
                        );
                    '''
            self.db.run_query(claim_reminder_query)
            claimReminderQuery = f'''UPDATE FetchedChannels SET claimReminder = 1 WHERE id = {channel_id}'''

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
    def send_email(self, channel, reminder_times):
        for reminder in reminder_times:
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

    def safePassword(self: AgoraClaimRepository, password_len : int = 12):
        return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(password_len))

    def updateAndAssignClaim(self : AgoraClaimRepository, mailToken : str):
        token_query = f'''UPDATE FetchedChannels SET claimed = 1 WHERE mailToken = {mailToken}'''
        self.db.run_query(token_query)
        # assign_claim_query = f'''SELECT channel_id, organiser_name, organiser_email FROM FetchedChannels WHERE mailToken = {mailToken}'''
        # channel = self.db.run_query(assign_claim_query)
        # userId = self.userRepo.addUser(channel['organiser_name'], self.safePassword(), channel['organiser_email'],channel['channel_id'], mode= 'claim' )
        # return userId
