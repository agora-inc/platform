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
        result = cursor.fetchall()
        cursor.close()
        return result

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