from repository import TagRepository

class StreamRepository:
    def __init__(self, db):
        self.db = db
        self.tags = TagRepository.TagRepository(db=self.db)

    def getAllStreams(self):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Streams')
        streams = cursor.fetchall()
        cursor.close()

        for stream in streams:
            stream["tags"] = self.tags.getTagsOnStream(stream["id"])

        return streams

    def getStreamById(self, streamId):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Streams WHERE id = %d' % streamId)
        result = cursor.fetchall()
        cursor.close()

        if not result:
            return None

        stream = result[0]
        stream["tags"] = self.tags.getTagsOnStream(stream["id"])
        return stream

    def createStream(self, channelId, channelName, streamName, streamDescription, streamTags, imageUrl):
        cursor = self.db.con.cursor()
        cursor.execute('INSERT INTO Streams(channel_id, channel_name, name, description, image_url) VALUES (%d, "%s", "%s", "%s", "%s")' % (channelId, channelName, streamName, streamDescription, imageUrl))
        self.db.con.commit()
        insertId = cursor.lastrowid

        streamUrl = "http://www.agora.stream:5080/WebRTCAppEE/streams/%d.m3u8" % insertId
        cursor.execute('UPDATE Streams SET from_url = "%s" WHERE id = %d' % (streamUrl, insertId))
        self.db.con.commit()

        tagIds = [t["id"] for t in streamTags]
        self.tags.tagStream(insertId, tagIds)

        cursor.close()
        return self.getStreamById(insertId)

    def archiveStream(self, streamId):
        cursor = self.db.con.cursor()
        stream = self.getStreamById(streamId)

        url = "http://www.agora.stream:5080/WebRTCAppEE/streams/%d.mp4" % streamId

        cursor.execute('INSERT INTO Videos(channel_id, channel_name, name, description, image_url, url, chat_id) VALUES (%d, "%s", "%s", "%s", "%s", "%s", "%d")' % (stream["channel_id"], stream["channel_name"], stream["name"], stream["description"], stream["image_url"], url, streamId))
        insertId = cursor.lastrowid

        tagIds = [tag["id"] for tag in stream["tags"]]
        self.tags.tagVideo(insertId, tagIds)

        cursor.execute('UPDATE Questions SET video_id = %d, stream_id = null WHERE stream_id = %d' % (insertId, streamId))
        cursor.execute('DELETE FROM Streams WHERE id = %d' % streamId)
        self.db.con.commit()
        cursor.close()
        return insertId

