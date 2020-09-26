
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
import jwt

# for emails
from flask_mail import Message
from flask import render_template


class User:
    def __init__(self, username, password):
        self.username = username
        self.password = generate_password_hash(password)

class UserRepository:
    def __init__(self, db, mail_sys):
        self.db = db
        self.secret = b'\xccu\x9e2\xda\xe8\x16\x8a\x137\xde@G\xc7T\xf1\x16\xca\x05\xee\xa7\xa4\x98\x05'
        self.mail_sys = mail_sys

    def getAllUsers(self):
        query = "SELECT * FROM Users"
        result = self.db.run_query(query)
        return result

    def getAllPublicUsers(self):
        query = "SELECT id, username, email, bio FROM Users WHERE public = 1"
        result = self.db.run_query(query)
        return result

    def getUser(self, username):
        query = f'SELECT * FROM Users WHERE username = "{username}"'
        result = self.db.run_query(query)
        if not result:
            return None
        return result[0]

    def getUserById(self, id):
        query = f'SELECT * FROM Users WHERE id = {id}'
        result = self.db.run_query(query)
        if not result:
            return None
        return result[0]

    def getUserByEmail(self, email):
        query = f'SELECT * FROM Users WHERE email = {email}'
        result = self.db.run_query(query)
        if not result:
            return None
        return result[0]

    def addUser(self, username, password, email):
        email = str(email).lower()

        # check if email exists
        if self.getUserByEmail(email):
            return None

        passwordHash = generate_password_hash(password)
        query = f'INSERT INTO Users(username, password_hash, email) VALUES ("{username}", "{passwordHash}", "{email}")'
        userId = self.db.run_query(query)[0]

        # check if user has been invited to some agoras
        query_existing_invitations = f'''
            SELECT Channels.name, Channels.id 
            FROM InvitedUsers
            INNER JOIN Channels 
            ON InvitedUsers.email = "{email}" AND InvitedUsers.channel_id = Channels.id'''

        existing_invitations = self.db.run_query(query_existing_invitations)
        existing_invitation_paragraph = ""

        # if user invited, make this user member and reformat email
        if existing_invitations is not None:
            if len(existing_invitations) > 0:
                # add user as member
                sql_synt_invit = str([tuple([i["id"], userId, "member"]) for i in existing_invitations])[1:-1]

                add_member_query = f'''
                    INSERT INTO ChannelUsers (channel_id, user_id, role) 
                    VALUES {sql_synt_invit}
                    '''
                self.db.run_query(add_member_query)

                # delete invitations with his email address
                delete_old_invit_query = f"DELETE FROM InvitedUsers WHERE email='{email}'"
                self.db.run_query(delete_old_invit_query)

                # edit email paragraph for invitations
                bullet_point_html = ""
                for invit in existing_invitations:
                    text = f'''<li><span style="font-family: Arial, Helvetica, sans-serif;"><b>{invit["name"]}</b><br></span></li>
                    '''
                    bullet_point_html = bullet_point_html + text

                existing_invitation_paragraph = f'''
                        <p><span style="font-family: Arial, Helvetica, sans-serif;">As some communities have invited you to be part of them, we are happy to announce you that your account has now memberships to:</span></p>
                        <ul>
                            {bullet_point_html}
                        </ul>
                        '''

                with open("/home/cloud-user/test/ipkiss3.txt", "w") as file:
                    file.write(str(bullet_point_html))

        # send confirmation email
        msg = Message(sender = 'team@agora.stream', recipients = [email])
        msg.html = f'''<p><span style="font-family: Arial, Helvetica, sans-serif;">Dear <strong>{username}</strong>,</span></p>
                <p><span style="font-family: Arial, Helvetica, sans-serif;">We are very happy to welcome you on </span><a href="https://agora.stream"><span style="font-family: Arial, Helvetica, sans-serif;">agora.stream</span></a><span style="font-family: Arial, Helvetica, sans-serif;">! We are certain that your expertises, curiosity and passion for research will be driving forces to several research communities!</span></p>
                
                <p><span style="font-family: Arial, Helvetica, sans-serif;">With your new account, you gained the ability to:</span></p>
                <ol>
                    <li><span style="font-family: Arial, Helvetica, sans-serif;"><strong>Become a member of agoras</strong> and have access to some of their <strong>exclusive content</strong>, such a talk recordings or members-only events.</span></li>
                    <li><span style="font-family: Arial, Helvetica, sans-serif;"><strong>Create your own agora</strong> or/and become the <strong>administrator</strong> of one, allowing you to advertise your events to your community only or to an internationally broader audience, receive talk applications from researchers all around the world and many more!</span></li>
                </ol>
                {existing_invitation_paragraph}
                <p><span style="font-family: Arial, Helvetica, sans-serif;">If you have any questions / feedbacks / suggestions, please consult our <a href="https://agora.stream/info/getting-started">getting started page</a> or simply reach out to us!</span></p>
                <p><span style="font-family: Arial, Helvetica, sans-serif;">With the hope to bump into each other during a future seminar, we wish you a happy research!</span></p>
                <p><span style="font-family: Arial, Helvetica, sans-serif;"><em>The agora.stream Team</em></span></p>
            '''
        msg.subject = f"Welcome to agora.stream!"
        self.mail_sys.send(msg)

        return self.getUserById(userId)

    def authenticate(self, username, password):
        user = self.getUser(username)

        if user != None and check_password_hash(user["password_hash"], password):
            return user 
        else:
            return None

    def encodeAuthToken(self, userId, type):
        now = datetime.utcnow()

        if type == "refresh":
            exp = now + timedelta(days=7)
        elif type == "changePassword":
            exp = now + timedelta(minutes=15)
        else:
            exp = now + timedelta(minutes=30)

        try:
            payload = {
                'exp': exp,
                'iat': now,
                'sub': userId
            }
            return jwt.encode(
                payload,
                self.secret,
                algorithm='HS256'
            )
        except Exception as e:
            return e

    def decodeAuthToken(self, token):
        try:
            payload = jwt.decode(token, self.secret)
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'

    def changePassword(self, userId, newPassword):
        passwordHash = generate_password_hash(newPassword)
        query = f'UPDATE Users SET password_hash = "{passwordHash}" WHERE id = {userId}'
        self.db.run_query(query)

    def updateBio(self, userId, newBio):
        query = f'UPDATE Users SET bio = "{newBio}" WHERE id = {userId}'
        self.db.run_query(query)
        return self.getUserById(userId)

    def updatePublic(self, userId, public):
        query = f'UPDATE Users SET public = "{int(public)}" WHERE id = {userId}'
        self.db.run_query(query)
        return self.getUserById(userId)
