import random


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

    def createChannel(self, channelName, channelDescription, userId):
        colours = [
            "orange",
            "goldenrod",
            "teal",
            "aquamarine",
            "mediumslateblue",
            "blueviolet",
            "palevioletred",
            "lightcoral",
            "pink",
        ]
        colour = random.choice(colours)

        query = f'INSERT INTO Channels(name, description, colour) VALUES ("{channelName}", "{channelDescription}", "{colour}")'
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

    def addUserToChannel(self, userId, channelId, role):
        query = f'UPDATE ChannelUsers SET role="{role}" WHERE user_id={userId} AND channel_id={channelId}'
        rowcount = self.db.run_query(query)[1]
        if rowcount != 0:
            return

        # if user has no current role wrt channel, create new link between user and channel    
        query = f'INSERT INTO ChannelUsers(user_id, channel_id, role) VALUES ({userId}, {channelId}, "{role}")'
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

    def getViewsForChannel(self, channelId):
        query = f'SELECT views FROM Videos where channel_id = {channelId}'
        result = self.db.run_query(query)
        return sum([x["views"] for x in result])

    def addAvatar(self, channelId):
        query = f'UPDATE Channels SET has_avatar=1 WHERE id = {channelId}'
        self.db.run_query(query)

    def addCover(self, channelId):
        query = f'UPDATE Channels SET has_cover=1 WHERE id = {channelId}'
        self.db.run_query(query)

    def removeCover(self, channelId):
        query = f'UPDATE Channels SET has_cover=NULL WHERE id = {channelId}'
        self.db.run_query(query)