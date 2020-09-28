import random
import logging
from repository.ChannelRepository import ChannelRepository

# for emails
from flask_mail import Message
from flask import render_template


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
        channel_id_invited_user_query = f'''SELECT channel_id FROM InvitedUsers WHERE email = {email};'''#
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

    def addInvitedMemberToChannel(self, invitationEmailList, channelId, role):
        # Remove all duplicates in the email_list
        if isinstance(invitationEmailList, str):
            invitationEmailList = [invitationEmailList]

        # A. Separate emails from users who have an agora account from from the other ones
        if len(invitationEmailList) == 1:
            sql_syntax_email_list = "('" + str(invitationEmailList[0]) + "')"
        elif len(invitationEmailList) > 1:
            sql_syntax_email_list = str(tuple(invitationEmailList))

        # query emails that are registered to an account which is not already member or owner of the channel
        registered_users_email_query = f'''
        SELECT t1.id, t1.email FROM Users t1
        WHERE NOT EXISTS (
            SELECT *
            FROM ChannelUsers t2
            WHERE t1.id = t2.user_id AND t2.channel_id = {channelId} AND t2.role in ('member', 'owner')
            )
            AND t1.email in {sql_syntax_email_list}
        ;
        '''
        registered_users_sql = self.db.run_query(registered_users_email_query)
        registered_users_emails = [i["email"] for i in registered_users_sql]

        # query emails from existing members or admins
        registered_members_email_query = f'''
            SELECT t1.email FROM Users t1
            INNER JOIN ChannelUsers t2
            WHERE t1.id = t2.user_id AND t2.channel_id = {channelId} AND t2.role in ('member', 'owner')
            ;
            '''
        registered_members_sql = self.db.run_query(registered_members_email_query)
        registered_members_emails = [i["email"] for i in registered_members_sql]

        # Gather addresses of non-existing users to be invited
        for email in invitationEmailList:
            if email in registered_users_emails or email in registered_members_emails:
                invitationEmailList.remove(email)

        # B. Make existing users new members (if they are some)
        if isinstance(registered_users_emails, list):
            if len(registered_users_emails) > 0:
                if len(registered_users_emails) == 1:
                    sql_values_formatting = f'''({channelId}, {registered_users_sql[0]["id"]}, "member")'''
                elif len(registered_users_emails) > 1:
                    sql_values_formatting = str([tuple(channelId, i["id"], "member") for i in registered_users_sql])[1:-1]

                add_query = f'''
                    INSERT INTO ChannelUsers (channel_id, user_id, role)
                    VALUES {sql_values_formatting};
                    '''
                self.db.run_query(add_query)

                # Send emails
                channel_name = self.channels.getChannelById(channelId)["name"]
                for email in registered_users_emails:
                    msg = Message(sender = ("Agora.stream Team", 'team@agora.stream'), recipients = [email])
                    msg.html = f'''<p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 16px;">Hi there!</span></p>
                        <p><span style="font-size: 16px;"><span style="font-family: Arial, Helvetica, sans-serif;">You have been granted a membership by the administrators of <strong>{channel_name}</strong> to their agora community on <a href="https://agora.stream/{channel_name}">agora.stream</a>!&nbsp;</span></span></p>
                        <p><span style="font-size: 16px;"><span style="font-family: Arial, Helvetica, sans-serif;"><span style="color: rgb(0, 0, 0); font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; float: none; display: inline !important;">As a member, you have the privileged access to talk recordings, members-only events and much more!</span></span></span></p>
                        <p><span style="font-size: 16px;"><span style="font-family: Arial, Helvetica, sans-serif;">See you very soon!</span></span></p>
                        <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 16px;">The agora.stream Team</span></p>'''
                    msg.subject = f"Agora.stream: you have been granted a membership to {channel_name}"
                    self.mail_sys.send(msg)

        # C. Add invitations in DB and send emails to new ones
        if len(invitationEmailList) > 0:
            # Insert invitations in DB
            if len(invitationEmailList) == 1:
                sql_email_list = f"('{invitationEmailList[0]}', {channelId})"
            else:
                sql_email_list = str(list([tuple([i.lower(), channelId]) for i in invitationEmailList]))[1:-1]

            add_query = f'''INSERT INTO InvitedUsers (email, channel_id) VALUES {sql_email_list};'''
            self.db.run_query(add_query)

            # Send emails
            channel_name = self.channels.getChannelById(channelId)["name"]
            for email in invitationEmailList:
                msg = Message(sender = 'team@agora.stream', recipients = [email])
                msg.html = f'''<p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 16px;">Hi there!</span></p>
                    <p><span style="font-size: 16px;"><span style="font-family: Arial, Helvetica, sans-serif;">You have been granted a membership by the administrators of <strong>{channel_name}</strong> to their agora community on <a href="https://agora.stream/{channel_name}">agora.stream</a>!&nbsp;</span></span></p>
                    <p><span style="font-size: 16px;"><span style="font-family: Arial, Helvetica, sans-serif;"><span style="color: rgb(0, 0, 0); font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; float: none; display: inline !important;">As a member, you have the privileged access to talk recordings, members-only events and much more!</span></span></span></p>
                    <p><span style="font-size: 16px;"><span style="font-family: Arial, Helvetica, sans-serif;">To claim your membership, simply register on <a href="https://agora.stream">agora.stream</a> using this email address.</span></span></p>
                    <p><span style="font-size: 16px;"><span style="font-family: Arial, Helvetica, sans-serif;">See you very soon!</span></span></p>
                    <p><span style="font-family: Arial, Helvetica, sans-serif; font-size: 16px;">The agora.stream Team</span></p>'''
                msg.subject = f"Agora.stream: you have been granted a membership to {channel_name}"
                self.mail_sys.send(msg)

    def getInvitedMembersEmails(self, channelId):
        all_invited_emails_query = f'''SELECT email FROM InvitedUsers
            WHERE channel_id = {channelId};
            '''

        emails = self.db.run_query(all_invited_emails_query)
        return [i["email"] for i in emails]