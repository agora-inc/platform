from repository import TagRepository, ChannelRepository

class VideoRepository:
    def __init__(self, db):
        self.db = db
        self.tags = TagRepository.TagRepository(db=self.db)
        self.channels = ChannelRepository.ChannelRepository(db=db)

    def getNumberOfVideos(self):
        # cursor = self.db.con.cursor()
        # cursor.execute('SELECT COUNT(*) FROM Videos')
        # result = cursor.fetchall()
        # cursor.close()
        query = 'SELECT COUNT(*) FROM Videos'
        result = self.db.run_query(query)
        return result[0]["COUNT(*)"]

    def getNumberOfVideosForChannel(self, channelId):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'SELECT COUNT(*) FROM Videos WHERE channel_id = {channelId}')
        # result = cursor.fetchall()
        # cursor.close()
        query = f'SELECT COUNT(*) FROM Videos WHERE channel_id = {channelId}'
        result = self.db.run_query(query)
        return result[0]["COUNT(*)"]

    def getNumberOfVideosForTag(self, tagId):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'SELECT COUNT(*) FROM VideoTags WHERE tag_id = {tagId}')
        # result = cursor.fetchall()
        # cursor.close()
        query = f'SELECT COUNT(*) FROM VideoTags WHERE tag_id = {tagId}'
        result = self.db.run_query(query)
        return result[0]["COUNT(*)"]

    def getVideoById(self, videoId):
        # cursor = self.db.con.cursor()
        # cursor.execute('SELECT * FROM Videos WHERE id = %d' % videoId)
        # result = cursor.fetchall()
        # cursor.close()
        query = f'SELECT * FROM Videos WHERE id = {videoId}'
        result = self.db.run_query(query)
        if not result:
            return None

        video = result[0]
        video["tags"] = self.tags.getTagsOnVideo(video["id"])
        video["channel_colour"] = self.channels.getChannelColour(video["channel_id"])
        
        return video

    def getRecentVideos(self):
        # cursor = self.db.con.cursor()
        # cursor.execute('SELECT * FROM Videos ORDER BY date DESC LIMIT 6')
        # videos = cursor.fetchall()
        # cursor.close()
        query = 'SELECT * FROM Videos ORDER BY date DESC LIMIT 6'
        videos = self.db.run_query(query)
        for video in videos:
            video["tags"] = self.tags.getTagsOnVideo(video["id"])
            video["channel_colour"] = self.channels.getChannelColour(video["channel_id"])
        return videos

    def getAllVideos(self, limit, offset):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'SELECT * FROM Videos ORDER BY date DESC LIMIT {limit} OFFSET {offset}')
        # videos = cursor.fetchall()
        # cursor.close()
        query = f'SELECT * FROM Videos ORDER BY date DESC LIMIT {limit} OFFSET {offset}'
        videos = self.db.run_query(query)
        for video in videos:
            video["tags"] = self.tags.getTagsOnVideo(video["id"])
            video["channel_colour"] = self.channels.getChannelColour(video["channel_id"])  
        return (videos, self.getNumberOfVideos())

    def getAllVideosForChannel(self, channelId, limit, offset):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'SELECT * FROM Videos WHERE channel_id = {channelId} ORDER BY date DESC LIMIT {limit} OFFSET {offset}')
        # videos = cursor.fetchall()
        # cursor.close()
        query = f'SELECT * FROM Videos WHERE channel_id = {channelId} ORDER BY date DESC LIMIT {limit} OFFSET {offset}'
        videos = self.db.run_query(query)
        for video in videos:
            video["tags"] = self.tags.getTagsOnVideo(video["id"])
            video["channel_colour"] = self.channels.getChannelColour(video["channel_id"])
        return (videos, self.getNumberOfVideosForChannel(channelId))

    def getAllVideosWithTag(self, tagName, limit, offset):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'SELECT id FROM Tags WHERE name = "{tagName}"')
        # result = cursor.fetchall()
        query = f'SELECT id FROM Tags WHERE name = "{tagName}"'
        result = self.db.run_query(query)
        if not result:
            return []
        tagId = result[0]["id"]
        # cursor.execute(f'SELECT Videos.id, Videos.channel_id, Videos.name, Videos.channel_name, Videos.description, Videos.date, Videos.views, Videos.url, Videos.chat_id FROM Videos INNER JOIN VideoTags ON Videos.id = VideoTags.video_id WHERE VideoTags.tag_id = {tagId} ORDER BY Videos.date DESC LIMIT {limit} OFFSET {offset}')
        # videos = cursor.fetchall()
        # cursor.close()
        query = f'SELECT Videos.id, Videos.channel_id, Videos.name, Videos.channel_name, Videos.description, Videos.date, Videos.views, Videos.url, Videos.chat_id FROM Videos INNER JOIN VideoTags ON Videos.id = VideoTags.video_id WHERE VideoTags.tag_id = {tagId} ORDER BY Videos.date DESC LIMIT {limit} OFFSET {offset}'
        videos = self.db.run_query(query)

        for video in videos:
            video["tags"] = self.tags.getTagsOnVideo(video["id"])
            video["channel_colour"] = self.channels.getChannelColour(video["channel_id"])

        return (videos, self.getNumberOfVideosForTag(tagId))