from __future__ import annotations
import secrets
import string
from mailing.sendgridApi import sendgridApi
from datetime import datetime, timedelta
from repository.ChannelRepository import ChannelRepository
from repository.UserRepository import UserRepository
from typing import Final

mail_sys = sendgridApi()

class AgoraClaimRepository():
    
    def __init__(self, db, mail_sys = mail_sys, VIEW_THRESHOLD = None, MAX_EMAIL_COUNT = 4):
        self.db = db
        self.channelRepo = ChannelRepository(db=db)
        self.userRepo = UserRepository(db=db)
        self.mail_sys = mail_sys
        self.VIEW_THRESHOLD : Final = VIEW_THRESHOLD
        self.MAX_EMAIL_COUNT : Final = MAX_EMAIL_COUNT

    def get_all_fetched_channels(self):
        get_all_fetched_channels_query = f'''SELECT FetchedChannels.id FROM FetchedChannels WHERE claimed = 0 and reminderSet = 0 and claim_email_count  = 0;
        '''
        unreminded_channels = self.db.run_query(get_all_fetched_channels_query)
        print
        return [i['id'] for i in unreminded_channels]


    def generate_claim_reminders(self, start_datetime, intervals, fetched_channel_id):
        for interval in intervals:
            send_datetime = start_datetime +  timedelta(days=interval)
            now = datetime.now()
            if now < send_datetime: send_datetime = send_datetime.strftime("%Y-%m-%d %H:%M")
            print(f"{interval},{send_datetime},{fetched_channel_id}")
            claim_reminder_query = f'''
                        INSERT INTO claimReminders (
                            sendtime,
                            fetchedchannelID,
                            status,
                        ) VALUES (
                            {send_datetime},
                            {fetched_channel_id},
                            "pending"
                        );
                    '''
            self.db.run_query(claim_reminder_query)
            claimReminderQuery = f'''UPDATE FetchedChannels SET claimReminder = 1 WHERE id = {fetched_channel_id}'''
            self.db.run_query(claimReminderQuery)

    # Get channel(name,org_name,org_email, claimEmail count, mailToken)
    def getUnclaimedChannelDetails(self: AgoraClaimRepository, reminderID: int):

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
                            and FetchedChannels.organiser_email IS NOT NULL and FetchedChannels.id = {reminderID};'''
            unacquired_channel = self.db.run_query(channel_query)
            return unacquired_channel

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
                        ChannelViewCounts.total_views >= {self.VIEW_THRESHOLD} and FetchedChannels.id  = {reminderID};'''
            unacquired_channel = self.db.run_query(channel_query)
            return unacquired_channel
            

    # Placeholder for pseudocode
    def send_email(self, reminder_id):
            # Get channel name and mailing address and do magic
            channel = self.getUnclaimedChannelDetails(reminder_id)
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

    
    def sendUnclaimedEmails(self, reminderIds):
        unclaimedChannels = self.getReminderIdsToBeSent
        map(self.send_email(), unclaimedChannels)
        # channelsToBeDeleted = [channel['id'] for channel in unclaimedChannels if channel['claim_email_count'] == self.MAX_EMAIL_COUNT]
        # map(self.channelRepo.deleteChannel() , channelsToBeDeleted )
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

    
    def getReminderIdsToBeSent(self, delta_time_window):
        # get reminders whose time_sending are within [time_sending-delta_time_window; time_sending + delta_time_window]
        delete_reminders_query = f'''DELETE * FROM claimReminders WHERE sendtime < DATE_ADD(NOW(), INTERVAL - {delta_time_window} HOUR);
        '''
        self.db.run_query(delete_reminders_query)
        get_reminders_query = f'''
            SELECT id from claimReminders
            WHERE (
                sendtime > DATE_ADD(NOW(), INTERVAL - {delta_time_window} HOUR)
                AND sendtime < DATE_ADD(NOW(), INTERVAL {delta_time_window} HOUR)
                )
                AND status != "sent"
            ;
        '''
        res = self.db.run_query(get_reminders_query)

        if res is None:
            return []
        else:
            return [i["id"] for i in res]
