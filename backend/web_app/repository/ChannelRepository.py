import random
import logging
from mailing.sendgridApi import sendgridApi
from repository import UserRepository
from app.databases import agora_db

mail_sys = sendgridApi()

class ChannelRepository:
    def __init__(self, db=agora_db, mail_sys=mail_sys):
        self.db = db
        self.mail_sys = mail_sys
        self.users = UserRepository.UserRepository(db=self.db)

    def getChannelById(self, id):
        query = f"SELECT * FROM Channels WHERE id = {id}"
        result = self.db.run_query(query)
        if not result:
            return None
        return result[0]

    def getChannelByName(self, name):
        query = f'SELECT * FROM Channels WHERE name = "{name}"'
        result = self.db.run_query(query)
        if not result:
            return None
        return result[0]

    def getChannelsByTopic(self, name):
        raise NotImplementedError

    def getAllChannels(self, limit, offset):
        query = f'SELECT * FROM Channels LIMIT {limit} OFFSET {offset}'
        result = self.db.run_query(query)
        return result

    def getTrendingChannels(self):
        query = """SELECT
            c.id, 
            c.name, 
            c.colour,
            c.has_avatar,
            count(*) as count
        from Channels c
        join Talks t 
        on c.id = t.channel_id
        where t.date > now()
        group by c.id
        order by count desc
        limit 5"""

        result = self.db.run_query(query)
        return result

    def createChannel(self, channelName, channelDescription, userId, topic_1_id, claimed=1, organiser_contact = None):
        # colours = [
        #     "orange",
        #     "goldenrod",
        #     "teal",
        #     "aquamarine",
        #     "mediumslateblue",
        #     "blueviolet",
        #     "palevioletred",
        #     "lightcoral",
        #     "pink",
        # ]
        colour = "#5454A0"

        #  TODO : Add query to store email addresses of organisers

        query = f'INSERT INTO Channels(name, long_description, colour, topic_1_id, claimed) VALUES ("{channelName}", "{channelDescription}", "{colour}", "{topic_1_id}", "{claimed}")'
        insertId = self.db.run_query(query)[0]
    
        query = f'INSERT INTO ChannelUsers(user_id, channel_id, role) VALUES ({userId}, {insertId}, "owner")'
        self.db.run_query(query)

        if(organiser_contact is not None):
            if 'email_address' in organiser_contact:
                query = f'''INSERT INTO FetchedChannels 
                (channel_id, user_id, claimed, organiser_name, organiser_email) 
                VALUES 
                ({insertId}, "{organiser_contact['name']}", {userId}, {claimed}, "{organiser_contact['email_address']}")'''
                self.db.run_query(query)
            elif 'homepage' in organiser_contact:
                query = f'''INSERT INTO FetchedChannels 
                (channel_id, user_id, claimed, organiser_name, organiser_homepage_url) 
                VALUES 
                ({insertId}, "{organiser_contact['name']}", {userId}, {claimed}, "{organiser_contact['homepage']}")'''
                self.db.run_query(query)

        return self.getChannelById(insertId)

    def getChannelColour(self, channelId):
        query = f"SELECT colour FROM Channels WHERE id = {channelId}"
        result = self.db.run_query(query)
        return result[0]["colour"]

    def updateChannelColour(self, channelId, newColour):
        query = f'UPDATE Channels SET colour = "{newColour}" WHERE id = {channelId}'
        self.db.run_query(query)
        return "ok"

    def updateChannelDescription(self, channelId, newDescription):
        """TODO: Refactor this into updateShortChannelDescription with DB field as well into short_description
        """
        query = f'UPDATE Channels SET description = "{newDescription}" WHERE id = {channelId}'
        self.db.run_query(query)
        return "ok"

    def updateLongChannelDescription(self, channelId, newDescription):
        # HACK: escaping double quotes in insertion
        self.db.open_connection()
        try:
            with self.db.con.cursor() as cur:
                cur.execute('UPDATE Channels SET long_description = %s WHERE id = %s;', [newDescription, str(channelId)])
                self.db.con.commit()
                cur.close()
            return "ok"
        except Exception as e:
            return str(e)
        
    def getChannelsForUser(self, userId, roles):
        query = f'SELECT Channels.id, Channels.name, Channels.description, Channels.colour, Channels.has_avatar FROM Channels INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id WHERE ChannelUsers.user_id = {userId} AND ChannelUsers.role IN {tuple(roles)}'.replace(",)", ")")
        result = self.db.run_query(query)
        return result

    def addUserToChannel(self, userId, channelId, role):
        if role not in ["follower", "owner", "member"]:
            return "500", "Invalid role" 
        query = f'''
            INSERT INTO ChannelUsers(user_id, channel_id, role) 
            VALUES ({userId},{channelId},"{role}");
            '''
        self.db.run_query(query)

    def removeUserFromChannel(self, userId, channelId):
        query = f'DELETE FROM ChannelUsers WHERE user_id = {userId} AND channel_id = {channelId}'
        self.db.run_query(query)
    
    def getUsersForChannel(self, channelId, roles):
        query = f'SELECT Users.id, Users.username FROM Users INNER JOIN ChannelUsers ON Users.id = ChannelUsers.user_id WHERE ChannelUsers.channel_id = {channelId} AND ChannelUsers.role IN {tuple(roles)}'.replace(",)", ")")
        result = self.db.run_query(query)
        return result

    def isUserInChannel(self, channelId, userId, roles):
        users = self.getUsersForChannel(channelId, roles)
        for user in users:
            if user["id"] == userId:
                return True
        return False

    def getRoleInChannel(self, channelId, userId):
        query = f'SELECT role FROM ChannelUsers WHERE user_id = {userId} AND channel_id = {channelId}'
        result = self.db.run_query(query)
        if not result:
            return "none"
        return result[0]["role"]

    def getAvatarLocation(self, channelId):
        query = f'SELECT has_avatar FROM Channels WHERE id = {channelId}'
        res = self.db.run_query(query)

        if res[0]["has_avatar"] == 1:
            return f"/home/cloud-user/plateform/agora/storage/images/avatars/{channelId}.jpg"
        else:
            return f"/home/cloud-user/plateform/agora/storage/images/avatars/default.jpg"

    def addAvatar(self, channelId):
        query = f'UPDATE Channels SET has_avatar=1 WHERE id = {channelId}'
        self.db.run_query(query)

    def addCover(self, channelId):
        query = f'UPDATE Channels SET has_cover=1 WHERE id = {channelId}'
        self.db.run_query(query)

    def removeCover(self, channelId):
        query = f'UPDATE Channels SET has_cover=0 WHERE id = {channelId}'
        self.db.run_query(query)

    def getCoverLocation(self, channelId):
        query = f'SELECT has_cover FROM Channels WHERE id = {channelId}'
        res = self.db.run_query(query)

        if res[0]["has_cover"] == 1:
            return f"/home/cloud-user/plateform/agora/storage/images/covers/{channelId}.jpg"
        else:
            return f"/home/cloud-user/plateform/agora/storage/images/covers/default.jpg"

    def getContactAddresses(self, channelId):
        query = f"SELECT * FROM ChannelContacts WHERE channel_id = {channelId}"
        result = self.db.run_query(query)

        list_res = list(map(lambda x: x["email_address"], result))

        return list_res

    def addContactAddress(self, contactAddress, channelId, userId):
        # check user is an admin in the agora
        query = f"SELECT * FROM ChannelUsers where channel_id = {channelId} AND user_id = {userId} AND role = 'owner'"
        res = self.db.run_query(query)

        if res:
            if len(self.db.run_query(query)) != 0:
                # add new address
                query = f"INSERT INTO ChannelContacts (channel_id, email_address) VALUES ({channelId}, '{contactAddress}')"
                result = self.db.run_query(query)

                logging.warning(f"addContactAddress: RESULT = {result}")
                return result

    def removeContactAddress(self, contactAddress, channelId, userId):
        # check user is an admin in the agora
        query = f"SELECT * FROM ChannelUsers where channel_id = {channelId} AND user_id = {userId} AND role = 'owner'"
        res = self.db.run_query(query)
        if res:
            if len(self.db.run_query(query)) != 0:
                # add new address
                query = f"DELETE FROM ChannelContacts WHERE email_address = '{contactAddress}' AND channel_id = {channelId}"
                result = self.db.run_query(query)
                return result

    def removeAllContactAddresses(self, contactAddress, channelId, userId):
        # check user is an admin in the agora
        query = f"SELECT * FROM ChannelUsers where channel_id = {channelId} AND user_id = {userId} AND role = 'owner'"
        res = self.db.run_query(query)

        if res:
            if len(self.db.run_query(query)) != 0:
                # add new address
                query = f"DELETE FROM ChannelContacts WHERE channel_id = {channelId}"
                result = self.db.run_query(query)
                return result

    def deleteChannel(self, id):
        query = f"DELETE FROM Channels where id = {id}"
        return self.db.run_query(query)

    def getEmailAddressesMembersAndAdmins(self, channelId, getMembersAddress: bool, getAdminsAddress: bool):
        if getMembersAddress:
            if getAdminsAddress:
                role_sql_str = "('member','owner')"
            else:
                role_sql_str = "('member')"
        else:
            if getAdminsAddress:
                role_sql_str = "('owner')"
            else:
                return []

        email_members_and_admins_query = f'''
            SELECT email from Users t1
            INNER JOIN ChannelUsers t2
            WHERE
                (t1.id = t2.user_id 
                    AND (t2.role in {role_sql_str})
                    AND t2.channel_id = {channelId}
                )
            ;
            '''
        res = self.db.run_query(email_members_and_admins_query)

        return [x["email"] for x in res]


    def applyMembership(self, channelId, userId, fullName, position, institution, email=None, personal_homepage=None):
        personal_homepage_var = str() if personal_homepage == None else personal_homepage
        email = str() if email == None else email

        # check user already applied
        check_if_membership_application = f'''
            SELECT * FROM MembershipApplications
                WHERE user_id = {userId}
                    AND channel_id = {channelId};
            '''

        res_check = self.db.run_query(check_if_membership_application)
        application_exists = True if len(res_check) > 0 else False

        if application_exists:
            apply_membership_insert_query = f'''
                UPDATE MembershipApplications
                    SET
                        channel_id = {channelId},
                        user_id = {userId}, 
                        full_name = "{fullName}",
                        position = "{position}",
                        institution = "{institution}",
                        email = "{email}",
                        personal_homepage = "{personal_homepage_var}"           
                    WHERE channel_id = {channelId}
                        AND user_id = {userId};
                '''

        else:
            apply_membership_insert_query = f'''
                INSERT INTO MembershipApplications(
                    channel_id,
                    user_id, 
                    full_name,
                    position,
                    institution,
                    email,
                    personal_homepage
                    )

                VALUES (
                    "{channelId}",
                    "{userId}", 
                    "{fullName}",
                    "{position}",
                    "{institution}",
                    "{email}",
                    "{personal_homepage_var}"             
                    );
                '''

        try:
            self.db.run_query(apply_membership_insert_query)

            # Send confirmation email applicant
            agora_name = self.getChannelById(channelId)["name"]
            self.mail_sys.send_confirmation_agora_membership_request(email, fullName, agora_name)

            try:
                # Send notification email administrator
                admin_addresses = self.getEmailAddressesMembersAndAdmins(
                    channelId,
                    getMembersAddress=False, 
                    getAdminsAddress=True
                )

                for email in admin_addresses:
                    self.mail_sys.notify_admin_membership_application(email, agora_name)
            except Exception as e:
                return str(e)

            return "ok"

        except Exception as e:
            return str(e)

    def getMembershipApplications(self, channelId, userId):
        membership_applications_query = f'''
            SELECT * FROM  MembershipApplications
            WHERE channel_id = {channelId};
            '''
        if userId != None:
            membership_applications_query = membership_applications_query[:-1] + f" AND user_id = {userId};"

        res = self.db.run_query(membership_applications_query)
        if res is not None:
            return res
        else:
            return []

    def cancelMembershipApplication(self, channelId, userId):
        withdraw_app_query = f'''
            DELETE FROM MembershipApplications
            WHERE channel_id = {channelId} and user_id = {userId};
            '''

        try:
            self.db.run_query(withdraw_app_query)
            res = "ok"
        except Exception as e:
            res = str(e)
        return res

    def acceptMembershipApplication(self, channelId, userId):
        # A. Check if user is already a member
        check_membership_query = f'''
            SELECT * FROM ChannelUsers
            WHERE channel_id = {channelId} 
                AND user_id = {userId}
                AND role in ("owner", "member"); 
            '''
        res = self.db.run_query(check_membership_query)

        # B. If not, add as member
        if len(res) == 0:
            add_membership_query = f'''
            INSERT into ChannelUsers(
                channel_id, user_id, role
            )
            VALUES (
                {channelId},
                {userId},
                "member"
            )
            '''
            # C. remove membership request from list
            remove_membership_request_query = f'''
                DELETE FROM MembershipApplications
                WHERE channel_id = {channelId}
                    AND user_id = {userId}
                ;'''

            res = self.db.run_query([add_membership_query, 
            remove_membership_request_query])
        
            # D. Send acceptance email to applicant
            user_name = self.users.getUserById(userId)["username"]
            user_email = self.users.getUserById(userId)["email"]
            agora_name = self.getChannelById(channelId)["name"]

            self.mail_sys.send_confirmation_agora_membership_acceptance(user_email, agora_name, user_name)

        return "ok"

    def increaseChannelViewCount(self, channelId):
        try:
            increase_counter_query = f'''
                UPDATE ChannelViewCounts
                    SET total_views = total_views + 1
                    WHERE channel_id = {channelId};'''
            res = self.db.run_query(increase_counter_query)

            if type(res) == list:
                if res[0] == 0 and res[1] == 0:
                    initialise_counter_query = f'''
                        INSERT INTO ChannelViewCounts (channel_id, total_views) 
                            VALUES ({channelId}, 4);
                    '''
                    res = self.db.run_query(initialise_counter_query)
                    return "ok" 

        except Exception as e:
            return str(e)

    def getChannelViewCount(self, channelId):
        get_counter_query = f'''
            SELECT * FROM ChannelViewCounts 
                WHERE channel_id = {channelId};
            '''
        try:
            return self.db.run_query(get_counter_query)[0]["total_views"]
        except Exception as e:
            return str(e)

    def editChannelTopic(self, channelId, topic_1_id, topic_2_id, topic_3_id):
        topicsQuery = f'''
            UPDATE Channels
                set topic_1_id="{topic_1_id}", 
                topic_2_id="{topic_2_id}", 
                topic_3_id="{topic_3_id}"
            WHERE id = {channelId};
            '''
        try:
            return self.db.run_query(topicsQuery)
        except Exception as e:
            return str(e)

    def getChannelTopic(self, channelId):
        query = f'SELECT topic_1_id FROM Channels WHERE id = {channelId}'
        result = self.db.run_query(query)
        return result

    def getChannelsWithTopic(self, limit, topicId, offset):
        query = f'SELECT * FROM Channels WHERE topic_1_id = {topicId} LIMIT {limit} OFFSET {offset};'
        result = self.db.run_query(query)
        return result