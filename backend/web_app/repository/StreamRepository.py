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

    def createStream(self, channelId, channelName, streamName, streamDescription, streamTags, imageUrl):
        cursor = self.db.con.cursor()
        cursor.execute('INSERT INTO Streams(channel_id, channel_name, name, description, image_url) VALUES (%d, "%s", "%s", "%s", "%s")' % (channelId, channelName, streamName, streamDescription, imageUrl))
        self.db.con.commit()
        insertId = cursor.lastrowid

        tagIds = [t["id"] for t in streamTags]
        self.tags.tagStream(insertId, tagIds)

        ## Create the main chat node + special group for bans
        cursor.execute(f'INSERT INTO Chats(name, chat_type, channel_id) values ("main_chat_node_channel", "public", {channelId})')
        self.db.con.commit()

        chat_id = cursor.lastrowid

        cursor.execute(f'INSERT INTO ChatParticipantGroups(chat_id, group_type, chat_type, channel_id) VALUES ({chat_id}, "subscribed", "community", {channelId})')
        self.db.con.commit()
        cursor.execute(f"UPDATE Chats set subscribers_group_id={cursor.lastrowid} where channel_id={channelId}")
        
        cursor.execute(f'INSERT INTO ChatParticipantGroups(chat_id, group_type, chat_type, channel_id) VALUES ({chat_id}, "silenced", "community", {channelId})')
        self.db.con.commit()
        cursor.execute(f"UPDATE Chats set silenced_group_id={cursor.lastrowid} where channel_id={channelId}")

        cursor.close()
        return self.getStreamById(insertId)

    def archiveStream(self, streamId):
        cursor = self.db.con.cursor()
        stream = self.getStreamById(streamId)

        cursor.execute('INSERT INTO Videos(channel_id, channel_name, name, description, image_url) VALUES (%d, "%s", "%s", "%s", "%s")' % (stream["channel_id"], stream["channel_name"], stream["name"], stream["description"], stream["image_url"]))
        insertId = cursor.lastrowid

        tagIds = [tag["id"] for tag in stream["tags"]]
        self.tags.tagVideo(insertId, tagIds)

        cursor.execute('UPDATE Questions SET video_id = %d, stream_id = null WHERE stream_id = %d' % (insertId, streamId))
        cursor.execute('DELETE FROM Streams WHERE id = %d' % streamId)
        self.db.con.commit()
        cursor.close()
        return insertId
