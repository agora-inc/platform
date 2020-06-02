from repository.ChannelRepository import ChannelRepository

class ScheduledStreamRepository:
    def __init__(self, db):
        self.db = db
        self.channels = ChannelRepository(db=db)

    def getAllScheduledStreams(self, limit, offset):
        # cursor = self.db.con.cursor()
        query = f'SELECT * FROM ScheduledStreams WHERE date > CURRENT_TIMESTAMP LIMIT {limit} OFFSET {offset}'
        streams = self.db.run_query(query)
        # cursor.execute(f'SELECT * FROM ScheduledStreams WHERE date > CURRENT_TIMESTAMP LIMIT {limit} OFFSET {offset}')
        # streams = cursor.fetchall()
        for stream in streams:
            stream["channel_colour"] = self.channels.getChannelColour(stream["channel_id"])
        # cursor.close()
        return streams

    def getAllScheduledStreamsForChannel(self, channelId):
        # cursor = self.db.con.cursor()
        query = f'SELECT * FROM ScheduledStreams WHERE channel_id = {channelId} AND date > CURRENT_TIMESTAMP'
        # cursor.execute(f'SELECT * FROM ScheduledStreams WHERE channel_id = {channelId} AND date > CURRENT_TIMESTAMP')
        # result = cursor.fetchall()
        # cursor.close()
        result = self.db.run_query(query)
        return result

    def getScheduledStreamById(self, streamId):
        # cursor = self.db.con.cursor()
        query = f'SELECT * FROM ScheduledStreams WHERE id = {streamId}'
        # cursor.execute(f'SELECT * FROM ScheduledStreams WHERE id = {streamId}')
        # result = cursor.fetchall()
        # cursor.close()
        result = self.db.run_query(query)
        return result

    def scheduleStream(self, channelId, channelName, streamName, streamDate, streamDescription):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'INSERT INTO ScheduledStreams(channel_id, channel_name, name, date, description) VALUES ({channelId}, "{channelName}", "{streamName}", "{streamDate}", "{streamDescription}")')
        # self.db.con.commit()
        # insertId = cursor.lastrowid
        # cursor.close()
        query = f'INSERT INTO ScheduledStreams(channel_id, channel_name, name, date, description) VALUES ({channelId}, "{channelName}", "{streamName}", "{streamDate}", "{streamDescription}")'
        insertId = self.db.run_query(query)[0]
        return self.getScheduledStreamById(insertId)

    def deleteScheduledStream(self, streamId):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'DELETE FROM ScheduledStreams where id = {streamId}')
        # self.db.con.commit()
        # cursor.close()
        query = f'DELETE FROM ScheduledStreams where id = {streamId}'
        self.db.run_query(query)

    def isUserRegisteredForScheduledStream(self, streamId, userId):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'SELECT COUNT(*) FROM ScheduledStreamRegistrations WHERE user_id={userId} AND stream_id={streamId}')
        # result = cursor.fetchall()
        # cursor.close()
        query = f'SELECT COUNT(*) FROM ScheduledStreamRegistrations WHERE user_id={userId} AND stream_id={streamId}'
        result = self.db.run_query(query)
        return result[0]["COUNT(*)"] != 0

    def registerForScheduledStream(self, streamId, userId):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'INSERT INTO ScheduledStreamRegistrations(stream_id, user_id) VALUES ({streamId}, {userId})')
        # self.db.con.commit()
        # cursor.close()
        query = f'INSERT INTO ScheduledStreamRegistrations(stream_id, user_id) VALUES ({streamId}, {userId})'
        self.db.run_query(query)

    def unRegisterForScheduledStream(self, streamId, userId):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'DELETE FROM ScheduledStreamRegistrations WHERE stream_id={streamId} AND user_id={userId}')
        # self.db.con.commit()
        # cursor.close()
        query = f'DELETE FROM ScheduledStreamRegistrations WHERE stream_id={streamId} AND user_id={userId}'
        self.db.run_query(query)

    def getScheduledStreamsForUser(self, userId):
        # cursor = self.db.con.cursor()
        query = f'SELECT ScheduledStreams.id, ScheduledStreams.channel_id, ScheduledStreams.channel_name, ScheduledStreams.name, ScheduledStreams.description, ScheduledStreams.date FROM ScheduledStreams INNER JOIN ScheduledStreamRegistrations ON ScheduledStreams.id = ScheduledStreamRegistrations.stream_id WHERE ScheduledStreamRegistrations.user_id = {userId}'
        # cursor.execute(query)
        # streams = cursor.fetchall()
        # cursor.close()
        streams = self.db.run_query(query)

        for stream in streams:
            stream["channel_colour"] = self.channels.getChannelColour(stream["channel_id"])

        return streams