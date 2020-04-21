class TagRepository:
    def __init__(self, db):
        self.db = db

    def getAllTags(self):
        cursor = self.db.con.cursor()
        cursor.execute("SELECT * FROM Tags ORDER BY id DESC")
        result = cursor.fetchall()
        cursor.close()
        return result

    def addTag(self, name):
        cursor = self.db.con.cursor()
        cursor.execute('INSERT INTO Tags(name) VALUES ("%s")' % name)
        self.db.con.commit()
        cursor.close()
        return self.getAllTags()

    def tagStream(self, streamId, tagIds):
        valueStr = ''
        for tagId in tagIds:
            valueStr += ' (%d, %d),' % (streamId, tagId)

        cursor = self.db.con.cursor()
        cursor.execute('INSERT INTO StreamTags(stream_id, tag_id) VALUES'+valueStr[:-1])
        self.db.con.commit()
        cursor.close()

    def tagVideo(self, videoId, tagIds):
        valueStr = ''
        for tagId in tagIds:
            valueStr += ' (%d, %d),' % (videoId, tagId)

        cursor = self.db.con.cursor()
        cursor.execute('INSERT INTO VideoTags(video_id, tag_id) VALUES'+valueStr[:-1])
        self.db.con.commit()
        cursor.close()

    def getTagsOnStream(self, streamId):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT Tags.id, Tags.name FROM Tags INNER JOIN StreamTags ON Tags.id = StreamTags.tag_id WHERE StreamTags.stream_id = %d' % streamId)
        result = cursor.fetchall()
        cursor.close()
        return result

    def getTagsOnVideo(self, videoId):
        cursor = self.db.con.cursor()
        cursor.execute('SELECT Tags.id, Tags.name FROM Tags INNER JOIN VideoTags ON Tags.id = VideoTags.tag_id WHERE VideoTags.video_id = %d' % videoId)
        result = cursor.fetchall()
        cursor.close()
        return result