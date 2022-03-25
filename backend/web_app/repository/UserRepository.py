from repository.InstitutionRepository import InstitutionRepository
from mailing.sendgridApi import sendgridApi
from app.databases import agora_db
# for emails
from flask_mail import Message

mail_sys = sendgridApi()

# class User:
#     def __init__(self, username, password):
#         self.username = username
#         self.password = generate_password_hash(password)

class UserRepository:
    def __init__(self, db=agora_db, mail_sys=mail_sys):
        self.db = db
        self.secret = b'\xccu\x9e2\xda\xe8\x16\x8a\x137\xde@G\xc7T\xf1\x16\xca\x05\xee\xa7\xa4\x98\x05'
        self.mail_sys = mail_sys
        self.institutions = InstitutionRepository(db=self.db)
        
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
        query = f"SELECT * FROM Users WHERE email = '{email}'"
        result = self.db.run_query(query)
        if not result:
            return None
        return result[0]

    def addUser(self, auth0Id, username, email, position, institution, channelId = 0):
        email = str(email).lower()

        if self.getUserByEmail(email):
            return "Email already in use", 400
        
        # check if username exists
        if self.getUser(username):
            return "Username already in use", 400

        query = f'''INSERT INTO Users 
            (auth0_id, username, email, position, institution) 
            VALUES ("{auth0Id}", "{username}", "{email}", "{position}", "{institution}");
        '''
        userId = self.db.run_query(query)[0]

        # check if user has been referred by a channel
        # let me know if you also want to add the user as a follower to an agora automatically
        query_channel_id = f"SELECT * FROM Channels WHERE id = {channelId}"
        result = self.db.run_query(query_channel_id)
        if result:
            try:
                increase_counter_query = f'''
                UPDATE ChannelReferrals
                    SET num_referrals = num_referrals + 1
                    WHERE channel_id = {channelId};'''
                res = self.db.run_query(increase_counter_query)

                if type(res) == list:
                    if res[0] == 0 and res[1] == 0:
                        initialise_counter_query = f'''
                            INSERT INTO ChannelReferrals (channel_id, num_referrals) 
                                VALUES ({channelId}, 1);
                    '''
                        res = self.db.run_query(initialise_counter_query)
            
            except Exception as e:
                print(e)
                
        """ (ALAIN:) circular imports, we can't use this.
        if self.channels.getChannelById(channelId):
            self.channels.increaseChannelReferralCount(channelId)
            # channel.acceptMembershipApplication(channelId, self.getUserById(username) )
        """

        # check if user has been invited to some agoras
        query_existing_invitations = f'''
            SELECT Channels.name, Channels.id 
            FROM InvitedUsers
            INNER JOIN Channels 
            ON InvitedUsers.email = "{email}" AND InvitedUsers.channel_id = Channels.id;'''

        existing_invitations = self.db.run_query(query_existing_invitations)
        existing_invitation_paragraph = ""

        try:
            # if user invited, make this user member and reformat email
            if isinstance(existing_invitations,list) and len(existing_invitations) > 0:
                # add user as member
                sql_synt_invit = str([tuple([i["id"], userId, "member"]) for i in existing_invitations])[1:-1]

                add_member_query = f'''
                    INSERT INTO ChannelUsers (channel_id, user_id, role) 
                    VALUES {sql_synt_invit}
                    '''
                self.db.run_query(add_member_query)

                # delete invitations with his email address
                delete_old_invit_query = f"DELETE FROM InvitedUsers WHERE email='{email}';"
                self.db.run_query(delete_old_invit_query)

                # edit email paragraph for invitations
                bullet_point_html = ""
                for invit in existing_invitations:
                    text = f'''<li><span style="font-family: Arial, Helvetica, sans-serif;"><b>{invit["name"]}</b><br></span></li>
                    '''
                    bullet_point_html = bullet_point_html + text

                existing_invitation_paragraph = f'''
                        <p><span style="font-family: Arial, Helvetica, sans-serif;">We are happy to announce that you have already been invited to be a member of:</span></p>
                        <ul>
                            {bullet_point_html}
                        </ul>
                        '''

                # send confirmation email
                msg = Message(sender = 'team@agora.stream', recipients = [email])
                msg.html = f'''<p><span style="font-family: Arial, Helvetica, sans-serif;">Dear <strong>{username}</strong>,</span></p>
                        <p><span style="font-family: Arial, Helvetica, sans-serif;">We are very happy to welcome you on </span><a href="https://mora.stream"><span style="font-family: Arial, Helvetica, sans-serif;">mora.stream</span></a><span style="font-family: Arial, Helvetica, sans-serif;">! Your expertise, curiosity and passion will be driving forces for many research communities.</span></p>
                        
                        <p><span style="font-family: Arial, Helvetica, sans-serif;">With your new account, you can:</span></p>
                        <ol>
                            <li><span style="font-family: Arial, Helvetica, sans-serif;"><strong>Become a member of an agora</strong> and have access to its <strong>exclusive content</strong>, such as recordings of past seminars and members-only events.</span></li>
                            <li><span style="font-family: Arial, Helvetica, sans-serif;"><strong>Create your own agora</strong> and/or become the <strong>administrator</strong> of one, allowing you to advertise your events to the audience you desire, receive talk applications from researchers all around the world and much more!</span></li>
                        </ol>
                        {existing_invitation_paragraph}
                        <p><span style="font-family: Arial, Helvetica, sans-serif;">You can visit our <a href="https://mora.stream/info/getting-started">getting started page</a> to explore all the features of mora.stream.</span></p>
                        <p><span style="font-family: Arial, Helvetica, sans-serif;">If you have any question, feedback or suggestion, please reach out to us by replying to this email.</span></p>
                        <p><span style="font-family: Arial, Helvetica, sans-serif;"><em>The mora.stream team</em></span></p>
                    '''
                msg.subject = f"Welcome to mora.stream!"
                self.mail_sys.send(msg)

            # New email formatting (Sendgrid) if no invitations
            else:
                self.mail_sys.send_confirmation_account_creation(email, username)

        except Exception as e:
            return 500, str(e)

        return self.getUserById(userId)

    def UserIsVerifiedAcademics(self, userId):
        # query academic email account
        get_academic_email = f'''
            SELECT email FROM Users WHERE user_id = {userId};
        '''
        email = self.db.run_query(get_academic_email)["email"]

        # check if in verified domains
        if email is None:
            return False
        else:
            return self.institutions.isEmailVerifiedAcademicEmail(email)

    def updateBio(self, userId, newBio):
        query = f'UPDATE Users SET bio = "{newBio}" WHERE id = {userId}'
        self.db.run_query(query)
        return self.getUserById(userId)

    def updatePublic(self, userId, public):
        query = f'UPDATE Users SET public = "{int(public)}" WHERE id = {userId}'
        self.db.run_query(query)
        return self.getUserById(userId)
