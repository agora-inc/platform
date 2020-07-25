from repository.ChannelRepository import ChannelRepository
from repository.TagRepository import TagRepository
from repository.TopicRepository import TopicRepository


# from ChannelRepository import ChannelRepository
# from TagRepository import TagRepository
# from TopicRepository import TopicRepository


class TalkRepository:
    def __init__(self, db):
        self.db = db
        self.channels = ChannelRepository(db=db)
        self.tags = TagRepository(db=self.db)
        self.topics = TopicRepository(db=self.db) 

    def getNumberOfCurrentTalks(self):
        query = 'SELECT COUNT(*) FROM Talks WHERE date < CURRENT_TIMESTAMP AND end_date > CURRENT_TIMESTAMP'
        result = self.db.run_query(query)
        return result[0]["COUNT(*)"]

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

    def getNumberOfPastTalksForTopic(self, TopicId):
        query = f'SELECT COUNT(*) FROM Talks WHERE (topic_1_id = {TopicId} OR topic_2_id = {TopicId} OR topic_3_id = {TopicId}) AND end_date < CURRENT_TIMESTAMP'
        result = self.db.run_query(query)
        if not result:
            return 0
        return result[0]["COUNT(*)"]

    def getAllPastTalksForTopic(self, TopicId, limit, offset):
        query = f'SELECT * FROM Talks WHERE (topic_1_id = {TopicId} OR topic_2_id = {TopicId} OR topic_3_id = {TopicId}) AND end_date < CURRENT_TIMESTAMP ORDER BY date ASC LIMIT {limit} OFFSET {offset}'
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return (talks, self.getNumberOfPastTalks())
    
    def getAllFutureTalksForTopic(self, TopicId, limit, offset):
        query = f'SELECT * FROM Talks WHERE (topic_1_id = {TopicId} OR topic_2_id = {TopicId} OR topic_3_id = {TopicId}) AND end_date > CURRENT_TIMESTAMP ORDER BY date DESC LIMIT {limit} OFFSET {offset}'
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return (talks, self.getNumberOfPastTalks())

    def getAllFutureTalksForTopicWithChildren(self, topic_id, limit, offset):

        # get id of all childs
        children_ids = self.topics.getAllChildrenIdRecursive(topic_id=topic_id)

        mysql_cond_string = str(children_ids).replace("[", "(").replace("]", ")")
        talk_query = f'SELECT * FROM Talks WHERE (topic_1_id in {mysql_cond_string} OR topic_2_id in {mysql_cond_string} OR topic_3_id in {mysql_cond_string}) AND end_date > CURRENT_TIMESTAMP ORDER BY date ASC LIMIT {limit} OFFSET {offset}'
        talks = self.db.run_query(talk_query)

        # setup local data for topics
        query_all_topics = "SELECT * FROM ClassificationGraphNodes"
        all_topics_info = self.db.run_query(query_all_topics)

        topics_dic = {}
        for topic_dic in all_topics_info:
            topics_dic[topic_dic["id"]] = topic_dic 

        def _get_topic_info_for_talk(talk_sql_dic):
            talk_topics_info = []
            for topic_key in ["topic_1_id", "topic_2_id", "topic_3_id"]:
                topic_id = talk_sql_dic[topic_key]
                if topic_id != None:
                    talk_topics_info.append(topics_dic[topic_id]) 

            return talk_topics_info

        if isinstance(talks, list):
            if len(talks) != 0:
                for talk in talks:
                    channel = self.channels.getChannelById(talk["channel_id"])
                    talk["channel_colour"] = channel["colour"]
                    talk["has_avatar"] = channel["has_avatar"]
                    # talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
                    talk["topics"] = _get_topic_info_for_talk(talk)
            
            return talks
            
        else:
            return []

    def getAllFutureTalks(self, limit, offset):
        query = f'SELECT * FROM Talks WHERE date > CURRENT_TIMESTAMP ORDER BY date ASC LIMIT {limit} OFFSET {offset}'
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return talks

    def getAllCurrentTalks(self, limit, offset):
        query = f'SELECT * FROM Talks WHERE date < CURRENT_TIMESTAMP AND end_date > CURRENT_TIMESTAMP ORDER BY date DESC LIMIT {limit} OFFSET {offset}'
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
        return (talks, self.getNumberOfCurrentTalks())

    def getAllPastTalks(self, limit, offset):
        query = f'SELECT * FROM Talks WHERE end_date < CURRENT_TIMESTAMP AND recording_link IS NOT NULL ORDER BY date DESC LIMIT {limit} OFFSET {offset}'
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return (talks, self.getNumberOfPastTalks())

    def getAllFutureTalksForChannel(self, channelId):
        query = f'SELECT * FROM Talks WHERE channel_id = {channelId} AND date > CURRENT_TIMESTAMP'
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return talks

    def getAllPastTalksForChannel(self, channelId):
        query = f'SELECT * FROM Talks WHERE channel_id = {channelId} AND end_date < CURRENT_TIMESTAMP'
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return (talks, self.getNumberOfPastTalksForChannel(channelId))

    def getTalkById(self, talkId):
        query = f'SELECT * FROM Talks WHERE id = {talkId}'
        talk = self.db.run_query(query)[0]

        talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
        talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return talk

    def scheduleTalk(self, channelId, channelName, talkName, startDate, endDate, talkDescription, talkLink, talkTags, showLinkOffset, visibility, topic_1_id, topic_2_id, topic_3_id, talk_speaker, talk_speaker_url):
        query = f"INSERT INTO Talks (channel_id, channel_name, name, date, end_date, description, link, show_link_offset, visibility, topic_1_id, topic_2_id, topic_3_id, talk_speaker, talk_speaker_url) VALUES ({channelId}, '{channelName}', '{talkName}', '{startDate}', '{endDate}', '{talkDescription}', '{talkLink}', '{showLinkOffset}', '{visibility}', '{topic_1_id}', '{topic_2_id}', '{topic_3_id}', '{talk_speaker}', '{talk_speaker_url}');"
        insertId = self.db.run_query(query)[0]

        if not isinstance(insertId, int):
            raise AssertionError("scheduleTalk: insertion failed, didnt return an id.")

        tagIds = [t["id"] for t in talkTags]
        self.tags.tagTalk(insertId, tagIds)

        return self.getTalkById(insertId)

    def editTalk(self, talkId, talkName, startDate, endDate, talkDescription, talkLink, talkTags, showLinkOffset, visibility, topic_1_id, topic_2_id, topic_3_id, talk_speaker, talk_speaker_url):
        query = f'UPDATE Talks SET name="{talkName}", description="{talkDescription}", date="{startDate}", end_date="{endDate}", link="{talkLink}", show_link_offset="{showLinkOffset}", visibility="{visibility}", topic_1_id={topic_1_id}, topic_2_id={topic_2_id}, topic_3_id={topic_3_id}, talk_speaker="{talk_speaker}", talk_speaker_url="{talk_speaker_url}" WHERE id = {talkId};'
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
        query = f'SELECT Talks.id, Talks.channel_id, Talks.channel_name, Talks.name, Talks.description, Talks.date, Talks.end_date, Talks.link, Talks.show_link_offset, Talks.visibility FROM Talks INNER JOIN TalkRegistrations ON Talks.id = TalkRegistrations.talk_id WHERE TalkRegistrations.user_id = {userId} AND Talks.date > CURRENT_TIMESTAMP'
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

    def isTalkAvailableToUser(self, talkId, userId):
        query = f'SELECT visibility, channel_id FROM Talks WHERE id={talkId}'
        result = self.db.run_query(query)

        if len(result) == 0:
            return False

        visibility  = result[0]["visibility"]
        if visibility == "Everybody":
            return True
        
        if visibility == "Followers and members":
            return self.channels.isUserInChannel(result[0]["channel_id"], userId, ["follower", "member", "owner"])
        if visibility == "Members only":
            return self.channels.isUserInChannel(result[0]["channel_id"], userId, ["member", "owner"])
        
        return True
