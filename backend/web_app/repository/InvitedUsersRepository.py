import random
import logging
from repository.ChannelRepository import ChannelRepository
from flask_mail import Message


class InvitedUsersRepository:
    def __init__(self, db, mail_sys):
        self.db = db
        self.mail_sys = mail_sys
        self.channels = ChannelRepository(db=db)

    def sendNewInvitation(self, emailAddress, channelId, role):
        # 1. create user

        # 2. send email
        raise NotImplementedError

    def getRolesandChannelIds(self, emailAddress):
        # get all roles and chnannels ids for an emailAddress
        raise NotImplementedError

    def transfertInvitedMembershipsToUser(self, userId, email):
        channel_id_invited_user_query = f'''SELECT channel_id FROM InvitedUsers WHERE email = {email};'''
        invited_channel_ids = self.db.run_query(channel_id_invited_user_query)

        invited_channel_id_formatted = [tuple(i, userId, "member") for i in invited_channel_ids]
        sql_insert_memberships = str(invited_channel_id_formatted)
        if len(sql_insert_memberships) >=2:
            sql_insert_memberships = sql_insert_memberships[1:-1]

        # Add memberships for this new user and delete this user from mailing lists
        add_member_query = f'''
            INSERT (channel_id, user_id, role) INTO ChannelUsers
            VALUES
                {sql_insert_memberships};
            '''

        delete_email_mailing_list_query = f'''DELETE FROM InvitedUsers
            WHERE channel_id IN {tuple(invited_channel_ids)};
            '''
        return self.db.run_query(add_member_query, delete_email_mailing_list_query)

    def addInvitedMemberToChannel(self, emailList: list, channelId, role):
        #
        # TODO: TO TEST
        #
        # Remove all duplicates in the email_list
        assert(isinstance(email_list, list))
        email_list_cleaned = list(set([email.lower() for email in email_list]))

        # A. if one of the email is already associated to a user, remove it
        registered_users_email_query = f'''
            SELECT email FROM Users t1
            INNER JOIN ChannelUsers t2
                ON (t2.user_id = t1.id 
                        AND t2.channel_id = {channelId}
                        AND (t2.role IN ('member', 'owner')))
            WHERE email IS NOT NULL
            ;
        '''

        registered_users_emails = self.db.run_query(registered_users_email_query)

        for email in email_list_cleaned:
            if email in registered_users_emails:
                email_list_cleaned.remove(email) 

        # B. Insert emails in DB
        email_list_insert = list([tuple(i[0].lower(), channelId) for i in email_list_cleaned])
        # app.logger.debug(f"Invitation send to")
        sql_email_list = str(email_list_insert)
        if len(sql_email_list) >=2:
            sql_email_list = sql_email_list[1:-1]

        add_query = f'''INSERT INTO 'GhostUsers' (email, channel_id) VALUES {sql_email_list};'''
        self.db.run_query(add_query)

        # send emails
        channel_name = self.channels.getChannelById(channelId)["name"]
        text_msg = 'Agora.stream: password reset'
        for email in emailList:
            msg = Message(text_msg, sender = 'team@agora.stream', recipients = [email])
            msg.body = f'Hi there! This is a test from {channel_name}'
            msg.subject = f"Agora.stream: invitation to {channel_name}"
            self.mail_sys.send(msg)

    def getInvitedMembersEmails(self, channelId):
        #
        # TODO: TO TEST
        #
        all_invited_emails_query = f'''SELECT email FROM InvitedMembers 
            WHERE channel_id = {channelId};
            '''
        return self.db.run_query(all_invited_emails_query)
