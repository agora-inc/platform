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

    def addInvitedMemberToChannel(self, emailList, channelId, role):
        # Remove all duplicates in the email_list
        if isinstance(emailList, str):
            emailList = [emailList]

        # A. Separate emails from users who have an agora account from from the other ones
        if len(emailList) == 1:
            sql_syntax_email_list = "('" + str(emailList[0]) + "')"
        elif len(emailList) > 1:
            sql_syntax_email_list = str(tuple(emailList))

        with open("/home/cloud-user/test/billy1.txt", "w") as file:
            file.write(str(sql_syntax_email_list))

        # NOTE: the 'registered_users_email_query' queries user id of people who might already be members in the agora
        registered_users_email_query = f'''
            SELECT * FROM Users
            WHERE email in {sql_syntax_email_list}
            '''
        registered_users_sql = self.db.run_query(registered_users_email_query)
        registered_users_emails = [i["email"] for i in registered_users_sql]

        # NOTE: this bit in the code could be rewritten to be faster (i.e only one LEFT OUTER JOIN query instead of two queries)
        existing_members_query = f'''
            SELECT email FROM Users t1
            LEFT JOIN ChannelUsers t2
            ON t1.id = t2.user_id 
                AND t2.channel_id = {channelId}
                AND t2.role in ('members', 'owners');
            '''

        existing_members_sql = self.db.run_query(existing_members_query)
        existing_members_emails = [i["email"] for i in existing_members_sql]

        with open("/home/cloud-user/test/billy2.txt", "w") as file:
            file.write(str(registered_users_sql))

        for email in emailList:
            if email in registered_users_emails or email in existing_members_emails:
                emailList.remove(email)

        # B. Make existing users new members (if they are some)
        if isinstance(registered_users_emails, list):
            if len(registered_users_emails) > 0:
                if len(registered_users_emails) == 1:
                    sql_values_formatting = f'''({channelId}, {registered_users_emails[0]["id"]}, "member")'''
                elif len(registered_users_emails) > 1:
                    sql_values_formatting = str([tuple(channelId, i["id"], "member") for i in registered_users_emails])[1:-1]

            with open("/home/cloud-user/test/federer44.txt", "w") as file:
                file.write(str(sql_values_formatting))
                #
                #
                #
                # CURRENT TESTING POINTER
                #
                #
                ##

            add_query = f'''
                INSERT INTO ChannelUsers (channel_id, user_id, role)
                VALUES {sql_values_formatting};
                '''

            with open("/home/cloud-user/test/federer33.txt", "w") as file:
                file.write(add_query)

            self.db.run_query(add_query)


        # C. Add invitations in DB and send emails to new ones
        if len(emailList) > 0:
            # Insert invitations in DB
            email_list_insert = list([tuple([i.lower(), channelId]) for i in emailList])

            sql_email_list = str(email_list_insert)
            if len(sql_email_list) > 1:
                sql_email_list = sql_email_list[1:-1]

            add_query = f'''INSERT INTO InvitedUsers (email, channel_id) VALUES {sql_email_list};'''
            self.db.run_query(add_query)

            # Send emails
            channel_name = self.channels.getChannelById(channelId)["name"]
            for email in emailList:
                msg = Message(sender = 'team@agora.stream', recipients = [email])
                msg.html = f'''
                    <p>yoyo there!</p>
                    <p>This is a <b>mega test</b>  from {channel_name}</p>
                    <p>Signe: PAtrick</p>
                    '''
                msg.subject = f"Agora.stream: invitation to {channel_name}"
                self.mail_sys.send(msg)


    def getInvitedMembersEmails(self, channelId):
        all_invited_emails_query = f'''SELECT email FROM InvitedUsers
            WHERE channel_id = {channelId};
            '''

        emails = self.db.run_query(all_invited_emails_query)
        return [i["email"] for i in emails]