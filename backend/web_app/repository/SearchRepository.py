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
            # return self.searchStreams(searchString)
            pass
        elif objectType == "upcoming":
            return self.searchUpcoming(searchString)
        elif objectType == "past":
            return self.searchPast(searchString)
        # elif objectType == "video":
        #     return self.searchVideos(searchString)
        # elif objectType == "talk":
        #     return self.searchTalks(searchString)
        elif objectType == "tag":
            return self.searchTags(searchString)
        else:
            return []

    def searchUsers(self, searchString):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'SELECT * FROM Users WHERE username LIKE "%{searchString}%"')
        # result = cursor.fetchall()
        # cursor.close()
        query = f'SELECT * FROM Users WHERE username LIKE "%{searchString}%"'
        result = self.db.run_query(query)
        return result

    def searchChannels(self, searchString):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'SELECT * FROM Channels WHERE name LIKE "%{searchString}%" OR description LIKE "%{searchString}%"')
        # result = cursor.fetchall()
        # cursor.close()
        query = f'SELECT * FROM Channels WHERE name LIKE "%{searchString}%" OR description LIKE "%{searchString}%"'
        result = self.db.run_query(query)
        return result

    def searchStreams(self, searchString):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'SELECT * FROM Streams WHERE name LIKE "%{searchString}%" OR description LIKE "%{searchString}%"')
        # result = cursor.fetchall()
        # cursor.close()
        query = f'SELECT * FROM Streams WHERE name LIKE "%{searchString}%" OR description LIKE "%{searchString}%"'
        result = self.db.run_query(query)
        return result

    def searchVideos(self, searchString):
        # cursor = self.db.con.cursor()
        # cursor.execute(f'SELECT * FROM Videos WHERE name LIKE "%{searchString}%" OR description LIKE "%{searchString}%"')
        # videos = cursor.fetchall()
        # cursor.close()
        query = f'SELECT * FROM Videos WHERE name LIKE "%{searchString}%" OR description LIKE "%{searchString}%"'
        videos = self.db.run_query(query)

        for video in videos:
            video["tags"] = self.tags.getTagsOnVideo(video["id"])
            video["channel_colour"] = self.channels.getChannelColour(video["channel_id"])

        return videos

    # def searchTalks(self, searchString):
    #     # cursor = self.db.con.cursor()
    #     # cursor.execute(f'SELECT * FROM Talks WHERE name LIKE "%{searchString}%" OR description LIKE "%{searchString}%"')
    #     # talks = cursor.fetchall()
    #     # cursor.close()
    #     query = f'SELECT * FROM Talks WHERE name LIKE "%{searchString}%" OR description LIKE "%{searchString}%"'
    #     talks = self.db.run_query(query)

    #     for talk in talks:
    #         stream["channel_colour"] = self.channels.getChannelColour(stream["channel_id"])

    #     return talks

    def searchUpcoming(self, searchString):
        query = f'SELECT * FROM Talks WHERE (name LIKE "%{searchString}%" OR description LIKE "%{searchString}%") AND date > CURRENT_TIMESTAMP;'
        talks = self.db.run_query(query)

        for talk in talks:
            talk["channel_colour"] = self.channels.getChannelColour(talk["channel_id"])

        return talks

    def searchPast(self, searchString):
        query = f'SELECT * FROM Talks WHERE (name LIKE "%{searchString}%" OR description LIKE "%{searchString}%") AND end_date < CURRENT_TIMESTAMP;'
        talks = self.db.run_query(query)

        for talk in talks:
            talk["channel_colour"] = self.channels.getChannelColour(talk["channel_id"])

        return talks

    def searchTags(self, searchString):
        query = f'SELECT * FROM Tags WHERE name LIKE "%{searchString}%"'
        result = self.db.run_query(query)
        return result
