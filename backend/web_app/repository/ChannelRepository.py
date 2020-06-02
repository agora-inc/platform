import random

class ChannelRepository:
    def __init__(self, db):
        self.db = db


    def getChannelById(self, id):
        # cursor = self.db.con.cursor()
        query = f"SELECT * FROM Channels WHERE id = {id}"
        result = self.db.run_query(query)
        # cursor.execute('SELECT * FROM Channels WHERE id = "%d"' % id)
        # result = cursor.fetchall()
        # cursor.close()
        if not result:
            return None
        return result[0]

    def getChannelByName(self, name):
        # cursor = self.db.con.cursor()
        query = f"SELECT * FROM Channels WHERE name = {name}"
        result = self.db.run_query(query)
        # cursor.execute('SELECT * FROM Channels WHERE id = "%d"' % id)
        # result = cursor.fetchall()
        # cursor.close()
        if not result:
            return None
        return result[0]

    
    def getAllChannels(self, limit, offset):
        # cursor = self.db.con.cursor()
        query = f'SELECT * FROM Channels LIMIT {limit} OFFSET {offset}'
        # cursor.execute(f'SELECT * FROM Channels LIMIT {limit} OFFSET {offset}')
        # result = cursor.fetchall()
        # cursor.close()
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

        # cursor = self.db.con.cursor()
        query = f'INSERT INTO Channels(name, description, colour) VALUES ("{channelName}", "{channelDescription}", "{colour}")'
        # cursor.execute('INSERT INTO Channels(name, description, colour) VALUES ("%s", "%s", "%s")' % (channelName, channelDescription, colour))
        # self.db.con.commit()
        # insertId = cursor.lastrowid
        insertId = self.db.run_query(query)[0]
        query = f'INSERT INTO ChannelUsers(user_id, channel_id, role) VALUES ({userId}, {insertId}, "owner")'
        # cursor.execute('INSERT INTO ChannelUsers(user_id, channel_id, role) VALUES (%d, %d, "owner")' % (userId, insertId))
        # self.db.con.commit()
        # cursor.close()
        self.db.run_query(query)
        return self.getChannelById(insertId)

    def getChannelColour(self, channelId):
        # cursor = self.db.con.cursor()
        query = f"SELECT colour FROM Channels WHERE id = {channelId}"
        # cursor.execute('SELECT colour FROM Channels WHERE id = %d' % (channelId))
        # result = cursor.fetchall()
        # cursor.close()
        result = self.db.run_query(query)
        return result[0]["colour"]

    def updateChannelColour(self, channelId, newColour):
        # cursor = self.db.con.cursor()
        query = f'UPDATE Channels SET colour = "{newColour}" WHERE id = {channelId}'
        # cursor.execute('UPDATE Channels SET colour = "%s" WHERE id = %d' % (newColor, channelId))
        # self.db.con.commit()
        # cursor.close()
        self.db.run_query(query)
        return "ok"

    def updateChannelDescription(self, channelId, newDescription):
        # cursor = self.db.con.cursor()
        query = f'UPDATE Channels SET description = "{newDescription}" WHERE id = {channelId}'
        # cursor.execute('UPDATE Channels SET colour = "%s" WHERE id = %d' % (newColor, channelId))
        # self.db.con.commit()
        # cursor.close()
        self.db.run_query(query)
        return "ok"

    def getChannelsForUser(self, userId, roles):
        # cursor = self.db.con.cursor()
        query = f'SELECT Channels.id, Channels.name, Channels.description, Channels.colour FROM Channels INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id WHERE ChannelUsers.user_id = {userId} AND ChannelUsers.role IN {tuple(roles)}'.replace(",)", ")")
        # cursor.execute(query)
        # result = cursor.fetchall()
        # cursor.close()
        result = self.db.run_query(query)
        return result

    def addUserToChannel(self, userId, channelId, role):
        # try updating the user's role in the channel (user may already be associated with channel in a different role)
        # cursor = self.db.con.cursor()
        query = f'UPDATE ChannelUsers SET role="{role}" WHERE user_id={userId} AND channel_id={channelId}'
        rowcount = self.db.run_query(query)[1]
        # cursor.execute(f'UPDATE ChannelUsers SET role="{role}" WHERE user_id={userId} AND channel_id={channelId}')
        if rowcount != 0:
            # self.db.con.commit()
            # cursor.close()
            return

        # if user has no current role wrt channel, create new link between user and channel    
        query = f'INSERT INTO ChannelUsers(user_id, channel_id, role) VALUES ({userId}, {channelId}, "{role}")'
        # cursor.execute(f'INSERT INTO ChannelUsers(user_id, channel_id, role) VALUES ({userId}, {channelId}, "{role}")')
        # self.db.con.commit()
        # cursor.close()
        self.db.run_query(query)

    def removeUserFromChannel(self, userId, channelId):
        # cursor = self.db.con.cursor()
        query = f'DELETE FROM ChannelUsers WHERE user_id = {userId} AND channel_id = {channelId}'
        # cursor.execute(f'DELETE FROM ChannelUsers WHERE user_id = {userId} AND channel_id = {channelId}')
        # self.db.con.commit()
        # cursor.close()
        self.db.run_query(query)
    
    def getUsersForChannel(self, channelId, roles):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'SELECT Users.id, Users.username FROM Users INNER JOIN ChannelUsers ON Users.id = ChannelUsers.user_id WHERE ChannelUsers.channel_id = {channelId} AND ChannelUsers.role IN {tuple(roles)}'.replace(",)", ")"))
        # result = cursor.fetchall()
        # cursor.close()
        # return result
        query = f'SELECT Users.id, Users.username FROM Users INNER JOIN ChannelUsers ON Users.id = ChannelUsers.user_id WHERE ChannelUsers.channel_id = {channelId} AND ChannelUsers.role IN {tuple(roles)}'.replace(",)", ")")
        result = self.db.run_query(query)
        return result

    def getViewsForChannel(self, channelId):
        # cursor = self.db.con.cursor()
        # cursor.execute('SELECT views FROM Videos where channel_id = %d' % channelId)
        # result = cursor.fetchall()
        # cursor.close()
        # return sum([x["views"] for x in result])
        query = f'SELECT views FROM Videos where channel_id = {channelId}'
        result = self.db.run_query(query)
        return sum([x["views"] for x in result])