from repository import TagRepository, ChannelRepository

class SearchRepository:
    def __init__(self, db):
        self.db = db
        self.tags = TagRepository.TagRepository(db=db)
        self.channels = ChannelRepository.ChannelRepository(db=db)
    
    def searchTable(self, objectType, searchString):
        if objectType == "user":
            return self.searchUsers(searchString)
        elif objectType == "channel":
            return self.searchChannels(searchString)
        elif objectType == "stream":
            return self.searchStreams(searchString)
        elif objectType == "video":
            return self.searchVideos(searchString)
        elif objectType == "scheduledStream":
            return self.searchScheduledStreams(searchString)
        elif objectType == "tag":
            return self.searchTags(searchString)
        else:
            return []

    def searchUsers(self, searchString):
        cursor = self.db.con.cursor()
        cursor.execute(f'SELECT * FROM Users WHERE username LIKE "%{searchString}%"')
        result = cursor.fetchall()
        cursor.close()
        return result

    def searchChannels(self, searchString):
        cursor = self.db.con.cursor()
        cursor.execute(f'SELECT * FROM Channels WHERE name LIKE "%{searchString}%" OR description LIKE "%{searchString}%"')
        result = cursor.fetchall()
        cursor.close()
        return result

    def searchStreams(self, searchString):
        cursor = self.db.con.cursor()
        cursor.execute(f'SELECT * FROM Streams WHERE name LIKE "%{searchString}%" OR description LIKE "%{searchString}%"')
        result = cursor.fetchall()
        cursor.close()
        return result

    def searchVideos(self, searchString):
        cursor = self.db.con.cursor()
        cursor.execute(f'SELECT * FROM Videos WHERE name LIKE "%{searchString}%" OR description LIKE "%{searchString}%"')
        videos = cursor.fetchall()
        cursor.close()

        for video in videos:
            video["tags"] = self.tags.getTagsOnVideo(video["id"])
            video["channel_colour"] = self.channels.getChannelColour(video["channel_id"])

        return videos

    def searchScheduledStreams(self, searchString):
        cursor = self.db.con.cursor()
        cursor.execute(f'SELECT * FROM ScheduledStreams WHERE name LIKE "%{searchString}%" OR description LIKE "%{searchString}%"')
        scheduledStreams = cursor.fetchall()
        cursor.close()

        for stream in scheduledStreams:
            stream["channel_colour"] = self.channels.getChannelColour(stream["channel_id"])

        return scheduledStreams

    def searchTags(self, searchString):
        cursor = self.db.con.cursor()
        cursor.execute(f'SELECT * FROM Tags WHERE name LIKE "%{searchString}%"')
        result = cursor.fetchall()
        cursor.close()
        return result