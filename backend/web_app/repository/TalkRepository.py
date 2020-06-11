from repository.ChannelRepository import ChannelRepository
from repository.TagRepository import TagRepository

class TalkRepository:
    def __init__(self, db):
        self.db = db
        self.channels = ChannelRepository(db=db)
        self.tags = TagRepository(db=self.db)

    def getNumberOfPastTalks(self):
        query = 'SELECT COUNT(*) FROM Talks WHERE end_date < CURRENT_TIMESTAMP'
        result = self.db.run_query(query)
        return result[0]["COUNT(*)"]

    def getNumberOfPastTalksForChannel(self, channelId):
        query = f'SELECT COUNT(*) FROM Talks WHERE channel_id = {channelId} AND end_date < CURRENT_TIMESTAMP'
        result = self.db.run_query(query)
        if not result:
            return 0
        return result[0]["COUNT(*)"]

    def getNumberOfPastTalksForTag(self, tagId):
        query = f'SELECT COUNT(*) FROM Talks INNER JOIN TalkTags ON Talks.id = TalkTags.talk_id WHERE TalkTags.tag_id = {tagId} AND Talks.end_date < CURRENT_TIMESTAMP'
        result = self.db.run_query(query)
        if not result:
            return 0
        return result[0]["COUNT(*)"]

    def getAllFutureTalks(self, limit, offset):
        query = f'SELECT * FROM Talks WHERE date > CURRENT_TIMESTAMP ORDER BY date ASC LIMIT {limit} OFFSET {offset}'
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
        return talks

    def getAllPastTalks(self, limit, offset):
        query = f'SELECT * FROM Talks WHERE end_date < CURRENT_TIMESTAMP ORDER BY date DESC LIMIT {limit} OFFSET {offset}'
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
        return (talks, self.getNumberOfPastTalks())

    def getAllFutureTalksForChannel(self, channelId):
        query = f'SELECT * FROM Talks WHERE channel_id = {channelId} AND date > CURRENT_TIMESTAMP'
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
        return talks

    def getAllPastTalksForChannel(self, channelId):
        query = f'SELECT * FROM Talks WHERE channel_id = {channelId} AND end_date < CURRENT_TIMESTAMP'
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
        return (talks, self.getNumberOfPastTalksForChannel(channelId))

    def getTalkById(self, talkId):
        query = f'SELECT * FROM Talks WHERE id = {talkId}'
        talk = self.db.run_query(query)[0]
        talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
        return talk

    def scheduleTalk(self, channelId, channelName, talkName, startDate, endDate, talkDescription, talkLink, talkTags):
        print("start date: ", startDate)
        print("end date: ", endDate)
        query = f'INSERT INTO Talks(channel_id, channel_name, name, date, end_date, description, link) VALUES ({channelId}, "{channelName}", "{talkName}", "{startDate}", "{endDate}", "{talkDescription}", "{talkLink}")'
        insertId = self.db.run_query(query)[0]

        tagIds = [t["id"] for t in talkTags]
        self.tags.tagTalk(insertId, tagIds)

        return self.getTalkById(insertId)

    def editTalk(self, talkId, talkName, startDate, endDate, talkDescription, talkLink, talkTags):
        print(startDate)
        print(endDate)
        query = f'UPDATE Talks SET name="{talkName}", description="{talkDescription}", date="{startDate}", end_date="{endDate}", link="{talkLink}" WHERE id = {talkId}'
        print(query)
        self.db.run_query(query)

        tagIds = [t["id"] for t in talkTags]
        self.tags.tagTalk(talkId, tagIds)

        return self.getTalkById(talkId)

    def addRecordingLink(self, talkId, link):
        query = f'UPDATE Talks SET recording_link="{link}" WHERE id = {talkId}'
        self.db.run_query(query)
        return self.getTalkById(talkId)

    def deleteTalk(self, talkId):
        query = f'DELETE FROM Talks where id = {talkId}'
        self.db.run_query(query)

    def isUserRegisteredForTalk(self, talkId, userId):
        query = f'SELECT COUNT(*) FROM TalkRegistrations WHERE user_id={userId} AND talk_id={talkId}'
        result = self.db.run_query(query)
        return result[0]["COUNT(*)"] != 0

    def registerForTalk(self, talkId, userId):
        query = f'INSERT INTO TalkRegistrations(talk_id, user_id) VALUES ({talkId}, {userId})'
        self.db.run_query(query)

    def unRegisterForTalk(self, talkId, userId):
        query = f'DELETE FROM TalkRegistrations WHERE talk_id={talkId} AND user_id={userId}'
        self.db.run_query(query)

    def getFutureTalksForUser(self, userId):
        query = f'SELECT Talks.id, Talks.channel_id, Talks.channel_name, Talks.name, Talks.description, Talks.date, Talks.end_date, Talks.link FROM Talks INNER JOIN TalkRegistrations ON Talks.id = TalkRegistrations.talk_id WHERE TalkRegistrations.user_id = {userId} AND Talks.date > CURRENT_TIMESTAMP'
        talks = self.db.run_query(query)

        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
        return talks

    def getPastTalksForUser(self, userId):
        query = f'SELECT Talks.id, Talks.channel_id, Talks.channel_name, Talks.name, Talks.description, Talks.date, Talks.end_date, Talks.recording_link FROM Talks INNER JOIN TalkRegistrations ON Talks.id = TalkRegistrations.talk_id WHERE TalkRegistrations.user_id = {userId} AND Talks.end_date < CURRENT_TIMESTAMP'
        talks = self.db.run_query(query)

        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
        return talks

    def getPastTalksForTag(self, tagName):
        query = f'SELECT id FROM Tags WHERE name = "{tagName}"'
        result = self.db.run_query(query)
        if not result:
            return []
        tagId = result[0]["id"]

        query = f'SELECT Talks.id, Talks.channel_id, Talks.channel_name, Talks.name, Talks.description, Talks.date, Talks.end_date, Talks.recording_link FROM Talks INNER JOIN TalkTags ON Talks.id = TalkTags.talk_id WHERE TalkTags.tag_id = {tagId} AND Talks.end_date < CURRENT_TIMESTAMP'
        talks = self.db.run_query(query)

        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
        return (talks, self.getNumberOfPastTalksForTag(tagId))

    def saveTalk(self, talkId, userId):
        query = f'INSERT INTO TalkSaves(talk_id, user_id) VALUES ({talkId}, {userId})'
        self.db.run_query(query)

    def unsaveTalk(self, talkId, userId):
        query = f'DELETE FROM TalkSaves WHERE talk_id = {talkId} AND user_id = {userId}'
        self.db.run_query(query)

    def getSavedTalksForUser(self, userId):
        query = f'SELECT Talks.id, Talks.channel_id, Talks.channel_name, Talks.name, Talks.description, Talks.date, Talks.end_date, Talks.recording_link FROM Talks INNER JOIN TalkSaves ON Talks.id = TalkSaves.talk_id WHERE TalkSaves.user_id = {userId}'
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
        return talks

    def hasUserSavedTalk(self, talkId, userId):
        query = f'SELECT COUNT(*) FROM TalkSaves WHERE user_id={userId} AND talk_id={talkId}'
        result = self.db.run_query(query)
        return result[0]["COUNT(*)"] != 0