from repository import TagRepository

class VideoRepository:
    def __init__(self, db):
        self.db = db
        self.tags = TagRepository.TagRepository(db=self.db)

    def getVideoById(self, videoId):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Videos WHERE id = %d' % videoId)
        result = cursor.fetchall()
        cursor.close()

        if not result:
            return None

        video = result[0]
        video["tags"] = self.tags.getTagsOnVideo(video["id"])
        
        return video

    def getRecentVideos(self):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Videos ORDER BY date DESC LIMIT 8')
        videos = cursor.fetchall()
        cursor.close()

        for video in videos:
            video["tags"] = self.tags.getTagsOnVideo(video["id"])

        return video

    def getAllVideos(self):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Videos ORDER BY date DESC')
        videos = cursor.fetchall()
        cursor.close()

        for video in videos:
            video["tags"] = self.tags.getTagsOnVideo(video["id"])

        return videos

    def getAllVideosForChannel(self, channelId):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT * FROM Videos WHERE channel_id = %d' % channelId)
        videos = cursor.fetchall()
        cursor.close()

        for video in videos:
            video["tags"] = self.tags.getTagsOnVideo(video["id"])
        
        return videos

    def getAllVideosWithTag(self, tagName):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT id FROM Tags WHERE name = "%s"' % tagName)
        result = cursor.fetchall()

        if not result:
            return []
         
        tagId = result[0]["id"]
        cursor.execute('SELECT Videos.id, Videos.channel_id, Videos.name, Videos.description, Videos.date, Videos.views FROM Videos INNER JOIN VideoTags ON Videos.id = VideoTags.video_id WHERE VideoTags.tag_id = %d ORDER BY Videos.date DESC' % tagId)
        result = cursor.fetchall()
        return result