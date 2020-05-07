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

    
    def getAllChannels(self):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Channels')
        result = cursor.fetchall()
        cursor.close()
        return result

    def createChannel(self, channelName):
        cursor = self.db.con.cursor()
        cursor.execute('INSERT INTO Channels(name) VALUES ("%s")' % (channelName))
        self.db.con.commit()
        insertId = cursor.lastrowid
        cursor.close()
        return self.getChannelById(insertId)