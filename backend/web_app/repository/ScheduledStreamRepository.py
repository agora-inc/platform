from repository.ChannelRepository import ChannelRepository
from repository.TagRepository import TagRepository

class ScheduledStreamRepository:
    def __init__(self, db):
        self.db = db
        self.channels = ChannelRepository(db=db)
        self.tags = TagRepository(db=self.db)

    def getNumberOfPastScheduledStreams(self):
        query = 'SELECT COUNT(*) FROM ScheduledStreams WHERE end_date < CURRENT_TIMESTAMP'
        result = self.db.run_query(query)
        return result[0]["COUNT(*)"]

    def getNumberOfPastScheduledStreamsForChannel(self, channelId):
        query = f'SELECT COUNT(*) FROM ScheduledStreams WHERE channel_id = {channelId} AND end_date < CURRENT_TIMESTAMP'
        result = self.db.run_query(query)
        return result[0]["COUNT(*)"]

    # def getNumberOfPastScheduledStreamsForTag(self, tagId):
    #     query = f'SELECT COUNT(*) FROM VideoTags WHERE tag_id = {tagId} AND end_date < CURRENT_TIMESTAMP'
    #     result = self.db.run_query(query)
    #     return result[0]["COUNT(*)"]

    def getAllFutureScheduledStreams(self, limit, offset):
        query = f'SELECT * FROM ScheduledStreams WHERE date > CURRENT_TIMESTAMP ORDER BY date ASC LIMIT {limit} OFFSET {offset}'
        streams = self.db.run_query(query)
        for stream in streams:
            channel = self.channels.getChannelById(stream["channel_id"])
            stream["channel_colour"] = channel["colour"]
            stream["has_avatar"] = channel["has_avatar"]
            stream["tags"] = self.tags.getTagsOnScheduledStream(stream["id"])
        return streams

    def getAllPastScheduledStreams(self, limit, offset):
        query = f'SELECT * FROM ScheduledStreams WHERE end_date < CURRENT_TIMESTAMP ORDER BY date DESC LIMIT {limit} OFFSET {offset}'
        streams = self.db.run_query(query)
        for stream in streams:
            channel = self.channels.getChannelById(stream["channel_id"])
            stream["channel_colour"] = channel["colour"]
            stream["has_avatar"] = channel["has_avatar"]
            stream["tags"] = self.tags.getTagsOnScheduledStream(stream["id"])
        return (streams, self.getNumberOfPastScheduledStreams())

    def getAllFutureScheduledStreamsForChannel(self, channelId):
        query = f'SELECT * FROM ScheduledStreams WHERE channel_id = {channelId} AND date > CURRENT_TIMESTAMP'
        streams = self.db.run_query(query)
        for stream in streams:
            channel = self.channels.getChannelById(stream["channel_id"])
            stream["channel_colour"] = channel["colour"]
            stream["has_avatar"] = channel["has_avatar"]
            stream["tags"] = self.tags.getTagsOnScheduledStream(stream["id"])
        return streams

    def getAllPastScheduledStreamsForChannel(self, channelId):
        query = f'SELECT * FROM ScheduledStreams WHERE channel_id = {channelId} AND end_date < CURRENT_TIMESTAMP'
        streams = self.db.run_query(query)
        for stream in streams:
            channel = self.channels.getChannelById(stream["channel_id"])
            stream["channel_colour"] = channel["colour"]
            stream["has_avatar"] = channel["has_avatar"]
            stream["tags"] = self.tags.getTagsOnScheduledStream(stream["id"])
        return (streams, self.getNumberOfPastScheduledStreamsForChannel(channelId))

    def getScheduledStreamById(self, streamId):
        query = f'SELECT * FROM ScheduledStreams WHERE id = {streamId}'
        stream = self.db.run_query(query)[0]
        stream["tags"] = self.tags.getTagsOnScheduledStream(stream["id"])
        return stream

    def scheduleStream(self, channelId, channelName, streamName, startDate, endDate, streamDescription, streamLink, streamTags):
        print("start date: ", startDate)
        print("end date: ", endDate)
        query = f'INSERT INTO ScheduledStreams(channel_id, channel_name, name, date, end_date, description, link) VALUES ({channelId}, "{channelName}", "{streamName}", "{startDate}", "{endDate}", "{streamDescription}", "{streamLink}")'
        insertId = self.db.run_query(query)[0]

        tagIds = [t["id"] for t in streamTags]
        self.tags.tagScheduledStream(insertId, tagIds)

        return self.getScheduledStreamById(insertId)

    def editScheduledStream(self, streamId, streamName, startDate, endDate, streamDescription, streamLink, streamTags):
        print(startDate)
        print(endDate)
        query = f'UPDATE ScheduledStreams SET name="{streamName}", description="{streamDescription}", date="{startDate}", end_date="{endDate}", link="{streamLink}" WHERE id = {streamId}'
        print(query)
        self.db.run_query(query)

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

    def getFutureScheduledStreamsForUser(self, userId):
        query = f'SELECT ScheduledStreams.id, ScheduledStreams.channel_id, ScheduledStreams.channel_name, ScheduledStreams.name, ScheduledStreams.description, ScheduledStreams.date, ScheduledStreams.end_date, ScheduledStreams.link FROM ScheduledStreams INNER JOIN ScheduledStreamRegistrations ON ScheduledStreams.id = ScheduledStreamRegistrations.stream_id WHERE ScheduledStreamRegistrations.user_id = {userId} AND ScheduledStreams.date > CURRENT_TIMESTAMP'
        streams = self.db.run_query(query)

        for stream in streams:
            channel = self.channels.getChannelById(stream["channel_id"])
            stream["channel_colour"] = channel["colour"]
            stream["has_avatar"] = channel["has_avatar"]
            stream["tags"] = self.tags.getTagsOnScheduledStream(stream["id"])
        return streams

    def getPastScheduledStreamsForUser(self, userId):
        query = f'SELECT ScheduledStreams.id, ScheduledStreams.channel_id, ScheduledStreams.channel_name, ScheduledStreams.name, ScheduledStreams.description, ScheduledStreams.date, ScheduledStreams.end_date, ScheduledStreams.link FROM ScheduledStreams INNER JOIN ScheduledStreamRegistrations ON ScheduledStreams.id = ScheduledStreamRegistrations.stream_id WHERE ScheduledStreamRegistrations.user_id = {userId}AND ScheduledStreams.end_date < CURRENT_TIMESTAMP'
        streams = self.db.run_query(query)

        for stream in streams:
            channel = self.channels.getChannelById(stream["channel_id"])
            stream["channel_colour"] = channel["colour"]
            stream["has_avatar"] = channel["has_avatar"]
            stream["tags"] = self.tags.getTagsOnScheduledStream(stream["id"])
        return streams