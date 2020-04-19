from repository import TagRepository

class StreamRepository:
    def __init__(self, db):
        self.db = db
        self.tags = TagRepository.TagRepository(db=self.db)

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

    def createStream(self, channelId, channelName, streamName, streamDescription, streamTags):
        cursor = self.db.con.cursor()
        cursor.execute('INSERT INTO Streams(channel_id, channel_name, name, description) VALUES (%d, "%s", "%s", "%s")' % (channelId, channelName, streamName, streamDescription))
        self.db.con.commit()
        insertId = cursor.lastrowid

        tagIds = [t["id"] for t in streamTags]
        self.tags.tagStream(insertId, tagIds)

        cursor.close()
        return self.getStreamById(insertId)

    def archiveStream(self, streamId):
        cursor = self.db.con.cursor()
        stream = self.getStreamById(streamId)

        cursor.execute('INSERT INTO Videos(channel_id, channel_name, name, description) VALUES (%d, "%s", "%s", "%s")' % (stream["channel_id"], stream["channel_name"], stream["name"], stream["description"]))
        insertId = cursor.lastrowid

        tagIds = [tag["id"] for tag in stream["tags"]]
        self.tags.tagVideo(insertId, tagIds)

        cursor.execute('UPDATE Questions SET video_id = %d, stream_id = null WHERE stream_id = %d' % (insertId, streamId))
        cursor.execute('DELETE FROM Streams WHERE id = %d' % streamId)
        self.db.con.commit()
        cursor.close()
        return insertId
