from repository.ChannelRepository import ChannelRepository
from repository.TagRepository import TagRepository
from app.databases import agora_db

class ScheduledStreamRepository:
    def __init__(self, db=agora_db):
        self.db = db
        self.channels = ChannelRepository(db=db)
        self.tags = TagRepository(db=self.db)

    def getAllScheduledStreams(self, limit, offset):
        query = f'SELECT * FROM ScheduledStreams WHERE date > CURRENT_TIMESTAMP LIMIT {limit} OFFSET {offset}'
        streams = self.db.run_query(query)
        for stream in streams:
            channel = self.channels.getChannelById(stream["channel_id"])
            stream["channel_colour"] = channel["colour"]
            stream["has_avatar"] = channel["has_avatar"]
            stream["tags"] = self.tags.getTagsOnScheduledStream(stream["id"])
        return streams

    def getAllScheduledStreamsForChannel(self, channelId):
        query = f'SELECT * FROM ScheduledStreams WHERE channel_id = {channelId} AND date > CURRENT_TIMESTAMP'
        streams = self.db.run_query(query)
        for stream in streams:
            channel = self.channels.getChannelById(stream["channel_id"])
            stream["channel_colour"] = channel["colour"]
            stream["has_avatar"] = channel["has_avatar"]
            stream["tags"] = self.tags.getTagsOnScheduledStream(stream["id"])
        return streams

    def getScheduledStreamById(self, streamId):
        query = f'SELECT * FROM ScheduledStreams WHERE id = {streamId}'
        stream = self.db.run_query(query)[0]
        stream["tags"] = self.tags.getTagsOnScheduledStream(stream["id"])
        return stream

    def scheduleStream(self, channelId, channelName, streamName, startDate, endDate, streamDescription, streamLink, streamTags):
        query = f'INSERT INTO ScheduledStreams(channel_id, channel_name, name, date, end_date, description, link) VALUES ({channelId}, "{channelName}", "{streamName}", "{startDate}", "{endDate}", "{streamDescription}", "{streamLink}")'
        insertId = self.db.run_query(query)[0]

        tagIds = [t["id"] for t in streamTags]
        self.tags.tagScheduledStream(insertId, tagIds)

        return self.getScheduledStreamById(insertId)

    def editScheduledStream(self, streamId, streamName, startDate, endDate, streamDescription, streamLink, streamTags):
        query = f'UPDATE ScheduledStreams SET name="{streamName}", description="{streamDescription}", date="{startDate}", end_date="{endDate}", link="{streamLink}" WHERE id = {streamId}'

        tagIds = [t["id"] for t in streamTags]
        self.tags.tagScheduledStream(streamId, tagIds)

        return self.getScheduledStreamById(streamId)

    def deleteScheduledStream(self, streamId):
        query = f'DELETE FROM ScheduledStreams where id = {streamId}'
        self.db.run_query(query)

    def isUserRegisteredForScheduledStream(self, streamId, userId):
        query = f'SELECT COUNT(*) FROM ScheduledStreamRegistrations WHERE user_id={userId} AND stream_id={streamId}'
        result = self.db.run_query(query)
        return result[0]["COUNT(*)"] != 0

    def registerForScheduledStream(self, streamId, userId):
        query = f'INSERT INTO ScheduledStreamRegistrations(stream_id, user_id) VALUES ({streamId}, {userId})'
        self.db.run_query(query)

    def unRegisterForScheduledStream(self, streamId, userId):
        query = f'DELETE FROM ScheduledStreamRegistrations WHERE stream_id={streamId} AND user_id={userId}'
        self.db.run_query(query)

    def getScheduledStreamsForUser(self, userId):
        query = f'SELECT ScheduledStreams.id, ScheduledStreams.channel_id, ScheduledStreams.channel_name, ScheduledStreams.name, ScheduledStreams.description, ScheduledStreams.date, ScheduledStreams.end_date, ScheduledStreams.link FROM ScheduledStreams INNER JOIN ScheduledStreamRegistrations ON ScheduledStreams.id = ScheduledStreamRegistrations.stream_id WHERE ScheduledStreamRegistrations.user_id = {userId}'
        streams = self.db.run_query(query)

        for stream in streams:
            channel = self.channels.getChannelById(stream["channel_id"])
            stream["channel_colour"] = channel["colour"]
            stream["has_avatar"] = channel["has_avatar"]
            stream["tags"] = self.tags.getTagsOnScheduledStream(stream["id"])
        return streams