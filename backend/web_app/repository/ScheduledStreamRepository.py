from repository import ChannelRepository

class ScheduledStreamRepository:
    def __init__(self, db):
        self.db = db
        self.channels = ChannelRepository(db=db)

    def getAllScheduledStreams(self, limit, offset):
        cursor = self.db.con.cursor()
        cursor.execute(f'SELECT * FROM ScheduledStreams WHERE date > CURRENT_TIMESTAMP LIMIT {limit} OFFSET {offset}')
        streams = cursor.fetchall()
        for stream in streams:
            stream["channel_colour"] = self.channels.getChannelColour(stream["channelId"])
        cursor.close()
        return streams

    def getAllScheduledStreamsForChannel(self, channelId):
        cursor = self.db.con.cursor()
        cursor.execute(f'SELECT * FROM ScheduledStreams WHERE channel_id = {channelId} AND date > CURRENT_TIMESTAMP')
        result = cursor.fetchall()
        cursor.close()
        return result

    def getScheduledStreamById(self, streamId):
        cursor = self.db.con.cursor()
        cursor.execute(f'SELECT * FROM ScheduledStreams WHERE id = {streamId}')
        result = cursor.fetchall()
        cursor.close()
        return result

    def scheduleStream(self, channelId, channelName, channelColour, streamName, streamDate, streamDescription):
        cursor = self.db.con.cursor()
        cursor.execute(f'INSERT INTO ScheduledStreams(channel_id, channel_name, channel_colour, name, date, description) VALUES ({channelId}, "{channelName}", "{channelColour}", "{streamName}", "{streamDate}", "{streamDescription}")')
        self.db.con.commit()
        insertId = cursor.lastrowid
        cursor.close()
        return self.getScheduledStreamById(insertId)

    def deleteScheduledStream(self, streamId):
        cursor = self.db.con.cursor()
        cursor.execute(f'DELETE FROM ScheduledStreams where id = {streamId}')
        self.db.con.commit()
        cursor.close()