import random

class ChannelRepository:
    def __init__(self, db):
        self.db = db


    def getChannelById(self, id):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Channels WHERE id = "%d"' % id)
        result = cursor.fetchall()
        cursor.close()
        if not result:
            return None
        return result[0]

    def getChannelByName(self, name):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Channels WHERE name = "%s"' % name)
        result = cursor.fetchall()
        cursor.close()
        if not result:
            return None
        return result[0]

    
    def getAllChannels(self):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Channels')
        result = cursor.fetchall()
        cursor.close()
        return result


    def createChannel(self, channelName, channelDescription):
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

        cursor = self.db.con.cursor()
        cursor.execute('INSERT INTO Channels(name, description, colour) VALUES ("%s", "%s", "%s")' % (channelName, channelDescription, colour))
        self.db.con.commit()
        insertId = cursor.lastrowid
        cursor.close()
        return self.getChannelById(insertId)

    def updateChannelColour(self, channelId, newColor):
        cursor = self.db.con.cursor()
        cursor.execute('UPDATE Channels SET colour = "%s" WHERE id = %d' % (newColor, channelId))
        self.db.con.commit()
        cursor.close()
        return "ok"

    def updateChannelDescription(self, channelId, newDescription):
        cursor = self.db.con.cursor()
        cursor.execute('UPDATE Channels SET description = "%s" WHERE id = %d' % (newDescription, channelId))
        self.db.con.commit()
        cursor.close()
        return "ok"

    def getChannelsForUser(self, userId):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT Channels.id, Channels.name, Channels.description, Channels.colour FROM Channels INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id WHERE ChannelUsers.user_id = %d' % userId)
        result = cursor.fetchall()
        cursor.close()
        return result


    def addUserToChannel(self, userId, channelId, role):
        cursor = self.db.con.cursor()
        cursor.execute('INSERT INTO ChannelUsers(user_id, channel_id, role) VALUES (%d, %d, "%s")' % (userId, channelId, role))
        self.db.con.commit()
        cursor.close()

    def removeUserFromChannel(self, userId, channelId):
        cursor = self.db.con.cursor()
        cursor.execute(f'DELETE FROM ChannelUsers WHERE user_id = {userId} AND channel_id = {channelId}')
        self.db.con.commit()
        cursor.close()
    
    def getUsersForChannel(self, channelId, roles):
        cursor = self.db.con.cursor()
        cursor.execute(f'SELECT Users.id, Users.username FROM Users INNER JOIN ChannelUsers ON Users.id = ChannelUsers.user_id WHERE ChannelUsers.channel_id = {channelId} AND ChannelUsers.role IN {tuple(roles)}')
        result = cursor.fetchall()
        cursor.close()
        return result

    def getViewsForChannel(self, channelId):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT views FROM Videos where channel_id = %d' % channelId)
        result = cursor.fetchall()
        cursor.close()
        return sum([x["views"] for x in result])