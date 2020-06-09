class TagRepository:
    def __init__(self, db):
        self.db = db

    def getTagById(self, id):
        # cursor = self.db.con.cursor()
        query = f'SELECT * FROM Tags WHERE id = {id}'
        result = self.db.run_query(query)
        # cursor.execute('SELECT * FROM Tags WHERE id = "%d"' % id)
        # result = cursor.fetchall()
        # cursor.close()
        if not result:
            return None
        else:
            return result[0]

    def getAllTags(self):
        # cursor = self.db.con.cursor()
        # cursor.execute("SELECT * FROM Tags ORDER BY id DESC")
        # result = cursor.fetchall()
        # cursor.close()
        query = "SELECT * FROM Tags ORDER BY id DESC"
        result = self.db.run_query(query)
        return result

    def getPopularTags(self, n):
        query = "SELECT tag_id FROM ScheduledStreamTags"
        result = self.db.run_query(query)

        # sort the tag ids according to how many talks each is associated with
        tagIds = [x["tag_id"] for x in result]
        sortedTagIds = sorted(list(set(tagIds)), key=lambda x: -tagIds.count(x))

        # return the 5 most popular tag ids
        return [self.getTagById(id) for id in sortedTagIds] if len(sortedTagIds) <= n else [self.getTagById(id) for id in sortedTagIds[:n]]

    # def getPopularTags(self, n):
    #     # get all tag ids associated with video objects
    #     # cursor = self.db.con.cursor()
    #     query = "SELECT tag_id FROM VideoTags"
    #     result = self.db.run_query(query)
    #     # cursor.execute("SELECT tag_id FROM VideoTags")
    #     # result = cursor.fetchall()
    #     # cursor.close()

    #     # sort the tag ids according to how many videos each is associated with
    #     videoTagIds = [x["tag_id"] for x in result]
    #     sortedTagIds = sorted(list(set(videoTagIds)), key=lambda x: -videoTagIds.count(x))

    #     # return the 5 most popular tag ids
    #     return [self.getTagById(id) for id in sortedTagIds] if len(sortedTagIds) <= n else [self.getTagById(id) for id in sortedTagIds[:n]]


    def addTag(self, name):
        # cursor = self.db.con.cursor()
        # cursor.execute('INSERT INTO Tags(name) VALUES ("%s")' % name)
        # self.db.con.commit()
        # cursor.close()
        query = f'INSERT INTO Tags(name) VALUES ("{name}")'
        self.db.run_query(query) 
        return self.getAllTags()

    def tagStream(self, streamId, tagIds):
        valueStr = ''
        for tagId in tagIds:
            valueStr += f' ({streamId}, {tagId}),'

        # cursor = self.db.con.cursor()
        query = 'INSERT INTO StreamTags(stream_id, tag_id) VALUES'+valueStr[:-1]
        self.db.run_query(query)
        # cursor.execute('INSERT INTO StreamTags(stream_id, tag_id) VALUES'+valueStr[:-1])
        # self.db.con.commit()
        # cursor.close()

    def tagScheduledStream(self, streamId, tagIds):
        existingTagIds = [t["id"] for t in self.getTagsOnScheduledStream(streamId)]
        newTagIds = [i for i in tagIds if i not in existingTagIds]

        valueStr = ''
        for tagId in newTagIds:
            valueStr += f' ({streamId}, {tagId}),'

        query = 'INSERT INTO ScheduledStreamTags(stream_id, tag_id) VALUES'+valueStr[:-1]
        self.db.run_query(query)

    def tagVideo(self, videoId, tagIds):
        valueStr = ''
        for tagId in tagIds:
            valueStr += ' (%d, %d),' % (videoId, tagId)

        query = 'INSERT INTO VideoTags(video_id, tag_id) VALUES'+valueStr[:-1]
        self.db.run_query(query)
        # cursor = self.db.con.cursor()
        # cursor.execute('INSERT INTO VideoTags(video_id, tag_id) VALUES'+valueStr[:-1])
        # self.db.con.commit()
        # cursor.close()

    def getTagsOnStream(self, streamId):
        # cursor = self.db.con.cursor()
        # cursor.execute('SELECT Tags.id, Tags.name FROM Tags INNER JOIN StreamTags ON Tags.id = StreamTags.tag_id WHERE StreamTags.stream_id = %d' % streamId)
        # result = cursor.fetchall()
        # cursor.close()
        query = f'SELECT Tags.id, Tags.name FROM Tags INNER JOIN StreamTags ON Tags.id = StreamTags.tag_id WHERE StreamTags.stream_id = {streamId}'
        result = self.db.run_query(query)
        return result

    def getTagsOnScheduledStream(self, streamId):
        query = f'SELECT Tags.id, Tags.name FROM Tags INNER JOIN ScheduledStreamTags ON Tags.id = ScheduledStreamTags.tag_id WHERE ScheduledStreamTags.stream_id = {streamId}'
        result = self.db.run_query(query)
        return result

    def getTagsOnVideo(self, videoId):
        # cursor = self.db.con.cursor()
        # cursor.execute('SELECT Tags.id, Tags.name FROM Tags INNER JOIN VideoTags ON Tags.id = VideoTags.tag_id WHERE VideoTags.video_id = %d' % videoId)
        # result = cursor.fetchall()
        # cursor.close()
        query = f'SELECT Tags.id, Tags.name FROM Tags INNER JOIN VideoTags ON Tags.id = VideoTags.tag_id WHERE VideoTags.video_id = {videoId}'
        result = self.db.run_query(query)
        return result