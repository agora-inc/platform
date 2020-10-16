import random
import logging


class ChannelRepository:
    def __init__(self, db):
        self.db = db

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

    def createChannel(self, channelName, channelDescription, userId):
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
        # colour = random.choice(colours)
        colour = "white"

        query = f'INSERT INTO Channels(name, long_description, colour) VALUES ("{channelName}", "{channelDescription}", "{colour}")'
        insertId = self.db.run_query(query)[0]
    
        query = f'INSERT INTO ChannelUsers(user_id, channel_id, role) VALUES ({userId}, {insertId}, "owner")'
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
        query = f'UPDATE Channels SET long_description = "{newDescription}" WHERE id = {channelId}'
        [insertId, rowCount] = self.db.run_query(query)
        return [insertId, rowCount]

    def getChannelsForUser(self, userId, roles):
        query = f'SELECT Channels.id, Channels.name, Channels.description, Channels.colour, Channels.has_avatar FROM Channels INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id WHERE ChannelUsers.user_id = {userId} AND ChannelUsers.role IN {tuple(roles)}'.replace(",)", ")")
        result = self.db.run_query(query)
        return result

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

    def getViewsForChannel(self, channelId):
        query = f'SELECT views FROM Videos where channel_id = {channelId}'
        result = self.db.run_query(query)
        return sum([x["views"] for x in result])

    def getAvatarLocation(self, channelId):
        query = f'SELECT has_avatar FROM Channels WHERE id = {channelId}'
        res = self.db.run_query(query)

        if res[0]["has_avatar"] == 1:
            return f"/home/cloud-user/plateform/agora/images/avatars/{channelId}.jpg"
        else:
            return f"/home/cloud-user/plateform/agora/images/avatars/default.jpg"

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
            return f"/home/cloud-user/plateform/agora/images/covers/{channelId}.jpg"
        else:
            return f"/home/cloud-user/plateform/agora/images/covers/default.jpg"

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

    def getEmailAddressesMembersAndAdmins(self, channelId):
        #
        # TODO: TEST
        #
        email_members_and_admins_query = f'''
            SELECT email from Users t1
            INNER JOIN ChannelUsers t2
            WHERE
                (t1.id = t2.user_id 
                    AND (t2.role in ('member', 'admin'))
                )
            ;
            '''
        return self.db.run_query(email_members_and_admins_query)

    def applyMembership(self, channelId, userId, fullName, position, institution, email=None, personal_homepage=None):
        #
        # TODO: TEST
        #
        personal_homepage_var = "''" if personal_homepage == None else personal_homepage
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
            res = self.db.run_query(apply_membership_insert_query)
            return res
        except:
            # TODO: error handling
            pass

    def getMembershipApplications(self, channelId, userId):
        # check if user is a owner of an agora to see that
        membership_applications_query = f'''
            SELECT * IN  MembershipApplications
            WHERE channel_id = {channelId};
            '''

        res = self.db.run_query(membership_applications_query)
        return res