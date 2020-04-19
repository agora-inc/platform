class ScheduledStreamRepository:
    def __init__(self, db):
        self.db = db

    def getAllScheduledStreams(self):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM ScheduledStreams')
        result = cursor.fetchall()
        cursor.close()
        return result

    def getAllScheduledStreamsForChannel(self, channelId):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM ScheduledStreams WHERE channel_id = %d' % channelId)
        result = cursor.fetchall()
        cursor.close()
        return result

    def getScheduledStreamById(self, streamId):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM ScheduledStreams WHERE id = %d' % streamId)
        result = cursor.fetchall()
        cursor.close()
        return result

    def scheduleStream(self, channelId, channelName, streamName, streamDate, streamDescription):
        cursor = self.db.con.cursor()
        cursor.execute('INSERT INTO ScheduledStreams(channel_id, channel_name, name, date, description) VALUES (%d, "%s", "%s", "%s", "%s")' % (channelId, channelName, streamName, streamDate, streamDescription))
        self.db.con.commit()
        insertId = cursor.lastrowid
        cursor.close()
        return self.getScheduledStreamById(insertId)

    def deleteScheduledStream(self, streamId):
        cursor = self.db.con.cursor()
        cursor.execute('DELETE FROM ScheduledStreams where id = %d' % streamId)
        self.db.con.commit()
        cursor.close()