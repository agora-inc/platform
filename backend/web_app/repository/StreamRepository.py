from repository import TagRepository, ChannelRepository
from datetime import datetime

class StreamRepository:
    def __init__(self, db):
        self.db = db
        self.tags = TagRepository.TagRepository(db=self.db)
        self.channels = ChannelRepository.ChannelRepository(db=self.db)

    def getAllStreams(self, limit, offset):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'SELECT * FROM Streams ORDER BY id DESC LIMIT {limit} OFFSET {offset}')
        # streams = cursor.fetchall()
        # cursor.close()
        query = f'SELECT * FROM Streams ORDER BY id DESC LIMIT {limit} OFFSET {offset}'
        streams = self.db.run_query(query)
        for stream in streams:
            channel = self.channels.getChannelById(stream["channel_id"])
            stream["channel_colour"] = channel["colour"]
            stream["has_avatar"] = channel["has_avatar"]
            stream["tags"] = self.tags.getTagsOnStream(stream["id"])
        return streams

    def getStreamsForChannel(self, channelId):
        # cursor = self.db.con.cursor()
        # cursor.execute('SELECT * FROM Streams WHERE channel_id = %d' % channelId)
        # streams = cursor.fetchall()
        # cursor.close()
        query = f'SELECT * FROM Streams WHERE channel_id = {channelId}'
        streams = self.db.run_query(query)
        for stream in streams:
            channel = self.channels.getChannelById(channelId)
            stream["channel_colour"] = channel["colour"]
            stream["has_avatar"] = channel["has_avatar"]
            stream["tags"] = self.tags.getTagsOnStream(stream["id"])
        return streams


    def getStreamById(self, streamId):
        # cursor = self.db.con.cursor()
        # cursor.execute('SELECT * FROM Streams WHERE id = %d' % streamId)
        # result = cursor.fetchall()
        # cursor.close()
        query = f'SELECT * FROM Streams WHERE id = {streamId}'
        result = self.db.run_query(query)
        if not result:
            return None

        stream = result[0]
        channel = self.channels.getChannelById(stream["channel_id"])
        stream["channel_colour"] = channel["colour"]
        stream["has_avatar"] = channel["has_avatar"]
        stream["tags"] = self.tags.getTagsOnStream(stream["id"])
        return stream

    def createStream(self, channelId, channelName, streamName, streamDescription, streamTags, imageUrl):
        # cursor = self.db.con.cursor()
        # cursor.execute('INSERT INTO Streams(channel_id, channel_name, name, description, image_url) VALUES (%d, "%s", "%s", "%s", "%s")' % (channelId, channelName, streamName, streamDescription, imageUrl))
        # self.db.con.commit()
        query = f'INSERT INTO Streams(channel_id, channel_name, name, description, image_url) VALUES ({channelId}, "{channelName}", "{streamName}", "{streamDescription}", "{imageUrl}")'
        insertId = self.db.run_query(query)[0]
        streamUrl = "http://www.agora.stream:5080/WebRTCAppEE/streams/%d_720p.m3u8" % insertId

        query = f'UPDATE Streams SET from_url = "{streamUrl}" WHERE id = {insertId}'
        # cursor.execute('UPDATE Streams SET from_url = "%s" WHERE id = %d' % (streamUrl, insertId))
        # self.db.con.commit()
        self.db.run_query(query)
        tagIds = [t["id"] for t in streamTags]
        self.tags.tagStream(insertId, tagIds)
        # cursor.close()
        return self.getStreamById(insertId)

    def archiveStream(self, streamId, delete):
        now = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        # cursor = self.db.con.cursor()
        stream = self.getStreamById(streamId)

        if not stream:
            return -1

        url = f"http://www.agora.stream:5080/WebRTCAppEE/streams/{streamId}_720p.mp4"

        if not delete:
            query = f'INSERT INTO Videos(channel_id, channel_name, name, description, image_url, url, chat_id, views, date) VALUES ({stream["channelId"]}, "{stream["channelName"]}", "{stream["name"]}", "{stream["description"]}", "{stream["image_url"]}", "{url}", "{streamId}", "{stream["views"]}", "{now}")'
            insertId = self.db.run_query(query)[0]
            # cursor.execute('INSERT INTO Videos(channel_id, channel_name, name, description, image_url, url, chat_id, views, date) VALUES (%d, "%s", "%s", "%s", "%s", "%s", "%d", "%d", "%s")' % (stream["channel_id"], stream["channel_name"], stream["name"], stream["description"], stream["image_url"], url, streamId, stream["views"], now))
            # insertId = cursor.lastrowid

            tagIds = [tag["id"] for tag in stream["tags"]]
            self.tags.tagVideo(insertId, tagIds)
            query = f'UPDATE Questions SET video_id = {insertId}, stream_id = null WHERE stream_id = {streamId}'
            # cursor.execute('UPDATE Questions SET video_id = %d, stream_id = null WHERE stream_id = %d' % (insertId, streamId))
            self.db.run_query(query)

        query = f'DELETE FROM Streams WHERE id = {streamId}'
        # cursor.execute('DELETE FROM Streams WHERE id = %d' % streamId)
        # self.db.con.commit()
        # cursor.close()
        self.db.run_query(query)
        return insertId if not delete else -1

