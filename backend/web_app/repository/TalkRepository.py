from repository.ChannelRepository import ChannelRepository
from repository.TagRepository import TagRepository
from repository.TopicRepository import TopicRepository
from repository.InstitutionRepository import InstitutionRepository
from repository.EmailRemindersRepository import EmailRemindersRepository

from mailing.sendgridApi import sendgridApi
from datetime import datetime, timedelta
from app.databases import agora_db
import os 

# NOTE: times are in the format: "2020-12-31 23:59"
"""
    TODO: All methods involving the "state" field must be tested.
"""
mail_sys = sendgridApi()

class TalkRepository:
    def __init__(self, db=agora_db, mail_sys=mail_sys):
        self.db = db
        self.channels = ChannelRepository(db=db)
        self.tags = TagRepository(db=self.db)
        self.topics = TopicRepository(db=self.db)
        self.institutions = InstitutionRepository(db=self.db)
        self.email_reminders = EmailRemindersRepository(db=self.db)
        self.mail_sys = mail_sys

    def getNumberOfCurrentTalks(self):
        query = "SELECT COUNT(*) FROM Talks WHERE published = 1 AND date < CURRENT_TIMESTAMP AND end_date > CURRENT_TIMESTAMP"
        result = self.db.run_query(query)
        return result[0]["COUNT(*)"]

    def getNumberOfPastTalks(self):
        query = "SELECT COUNT(*) FROM Talks WHERE published = 1 AND end_date < CURRENT_TIMESTAMP"
        result = self.db.run_query(query)
        return result[0]["COUNT(*)"]

    def getNumberOfPastTalksForChannel(self, channelId):
        query = f"SELECT COUNT(*) FROM Talks WHERE channel_id = {channelId} AND published = 1 AND end_date < CURRENT_TIMESTAMP"
        result = self.db.run_query(query)
        if not result:
            return 0
        return result[0]["COUNT(*)"]

    def getNumberOfPastTalksForTag(self, tagId):
        query = f"SELECT COUNT(*) FROM Talks INNER JOIN TalkTags ON Talks.id = TalkTags.talk_id WHERE TalkTags.tag_id = {tagId} AND published = 1 AND Talks.end_date < CURRENT_TIMESTAMP"
        result = self.db.run_query(query)
        if not result:
            return 0
        return result[0]["COUNT(*)"]

    def getNumberOfPastTalksForTopic(self, TopicId):
        query = f"SELECT COUNT(*) FROM Talks WHERE (topic_1_id = {TopicId} OR topic_2_id = {TopicId} OR topic_3_id = {TopicId}) AND published = 1 AND end_date < CURRENT_TIMESTAMP"
        result = self.db.run_query(query)
        if not result:
            return 0
        return result[0]["COUNT(*)"]

    def getAllPastTalksForTopic(self, TopicId, limit, offset):
        query = f"SELECT * FROM Talks WHERE (topic_1_id = {TopicId} OR topic_2_id = {TopicId} OR topic_3_id = {TopicId}) AND published = 1 AND end_date < CURRENT_TIMESTAMP ORDER BY date ASC LIMIT {limit} OFFSET {offset}"
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return (talks, self.getNumberOfPastTalks())
    
    def getAllFutureTalksForTopic(self, TopicId, limit, offset):
        query = f"SELECT * FROM Talks WHERE (topic_1_id = {TopicId} OR topic_2_id = {TopicId} OR topic_3_id = {TopicId}) AND published = 1 AND end_date > CURRENT_TIMESTAMP ORDER BY date DESC LIMIT {limit} OFFSET {offset}"
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
        talk_query = f"SELECT * FROM Talks WHERE (topic_1_id in {mysql_cond_string} OR topic_2_id in {mysql_cond_string} OR topic_3_id in {mysql_cond_string}) AND published = 1 AND end_date > CURRENT_TIMESTAMP ORDER BY date ASC LIMIT {limit} OFFSET {offset}"
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

    def getAvailableFutureTalks(self, limit, offset, user_id):
        if user_id is None:
            query = f"SELECT * FROM Talks WHERE published = 1 AND card_visibility = 'Everybody' AND date > CURRENT_TIMESTAMP ORDER BY date ASC LIMIT {limit} OFFSET {offset}"
        else:
            query = f'''SELECT DISTINCT * FROM Talks 
                    WHERE Talks.published = 1 
                        AND (Talks.card_visibility = 'Everybody' 
                                OR (Talks.card_visibility = 'Followers and members' 
                                    AND Talks.channel_id in (
                                        SELECT Channels.id FROM Channels 
                                        INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id 
                                        WHERE (ChannelUsers.role = 'member' OR ChannelUsers.role = 'follower' OR ChannelUsers.role = 'owner')
                                            AND ChannelUsers.user_id = {user_id}
                                        )
                                    )
                                OR (Talks.card_visibility = 'Members only' 
                                    AND Talks.channel_id in (
                                        SELECT Channels.id FROM Channels 
                                        INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id 
                                        WHERE (ChannelUsers.role = 'member' OR ChannelUsers.role = 'owner')
                                            AND ChannelUsers.user_id = {user_id}
                                        )
                                    )
                            )
                        AND Talks.date > CURRENT_TIMESTAMP 
                    ORDER BY Talks.date ASC LIMIT {limit}
                    OFFSET {offset}
                    '''

        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return talks

    def getAvailableCurrentTalks(self, limit, offset, user_id):
        if user_id is None:
            query = f"SELECT * FROM Talks WHERE published = 1 AND card_visibility = 'Everybody' AND date < CURRENT_TIMESTAMP AND end_date > CURRENT_TIMESTAMP ORDER BY date ASC LIMIT {limit} OFFSET {offset}"
        else:
            query = f'''SELECT DISTINCT * FROM Talks 
                    WHERE Talks.published = 1 
                        AND (Talks.card_visibility = 'Everybody' 
                                OR (Talks.card_visibility = 'Followers and members' 
                                    AND Talks.channel_id in (
                                        SELECT Channels.id FROM Channels 
                                        INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id 
                                        WHERE (ChannelUsers.role = 'member' OR ChannelUsers.role = 'follower' OR ChannelUsers.role = 'owner')
                                            AND ChannelUsers.user_id = {user_id}
                                        )
                                    )
                                OR (Talks.card_visibility = 'Members only' 
                                    AND Talks.channel_id in (
                                        SELECT Channels.id FROM Channels 
                                        INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id 
                                        WHERE (ChannelUsers.role = 'member' OR ChannelUsers.role = 'owner')
                                            AND ChannelUsers.user_id = {user_id}
                                        )
                                    )
                            )
                        AND Talks.date < CURRENT_TIMESTAMP AND Talks.end_date > CURRENT_TIMESTAMP
                    ORDER BY Talks.date ASC LIMIT {limit}
                    OFFSET {offset}
                    '''

        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return (talks, len(talks))

    def getAvailablePastTalks(self, limit, offset, user_id):
        if user_id is None:
            query = f"SELECT * FROM Talks WHERE published = 1 AND card_visibility = 'Everybody' AND recording_link <> '' AND end_date < CURRENT_TIMESTAMP ORDER BY date DESC LIMIT {limit} OFFSET {offset}"
        else:
            query = f'''SELECT DISTINCT * FROM Talks 
                    WHERE Talks.published = 1 
                        AND (Talks.card_visibility = 'Everybody' AND recording_link <> ''
                                OR (Talks.card_visibility = 'Followers and members' 
                                    AND Talks.channel_id in (
                                        SELECT Channels.id FROM Channels 
                                        INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id 
                                        WHERE (ChannelUsers.role = 'member' OR ChannelUsers.role = 'follower' OR ChannelUsers.role = 'owner')
                                            AND ChannelUsers.user_id = {user_id}
                                        )
                                    )
                                OR (Talks.card_visibility = 'Members only' 
                                    AND Talks.channel_id in (
                                        SELECT Channels.id FROM Channels 
                                        INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id 
                                        WHERE (ChannelUsers.role = 'member' OR ChannelUsers.role = 'owner')
                                            AND ChannelUsers.user_id = {user_id}
                                        )
                                    )
                            )
                        AND Talks.end_date < CURRENT_TIMESTAMP 
                    ORDER BY Talks.date DESC LIMIT {limit}
                    OFFSET {offset}
                    '''

        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return (talks, len(talks))

    def getAvailableFutureTalksForChannel(self, channelId, user_id):
        if user_id is None:
            query = f"SELECT * FROM Talks WHERE channel_id = {channelId} AND published = 1 AND card_visibility = 'Everybody' AND date > CURRENT_TIMESTAMP ORDER BY date"
        else:
            query = f'''SELECT DISTINCT * FROM Talks 
                    WHERE channel_id = {channelId} AND Talks.published = 1 
                        AND (Talks.card_visibility = 'Everybody' 
                                OR (Talks.card_visibility = 'Followers and members' 
                                    AND Talks.channel_id in (
                                        SELECT Channels.id FROM Channels 
                                        INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id 
                                        WHERE (ChannelUsers.role = 'member' OR ChannelUsers.role = 'follower' OR ChannelUsers.role = 'owner')
                                            AND ChannelUsers.user_id = {user_id}
                                        )
                                    )
                                OR (Talks.card_visibility = 'Members only' 
                                    AND Talks.channel_id in (
                                        SELECT Channels.id FROM Channels 
                                        INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id 
                                        WHERE (ChannelUsers.role = 'member' OR ChannelUsers.role = 'owner')
                                            AND ChannelUsers.user_id = {user_id}
                                        )
                                    )
                            )
                        AND Talks.date > CURRENT_TIMESTAMP 
                    ORDER BY Talks.date
                    '''

        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return talks

    def getAvailableCurrentTalksForChannel(self, channelId, user_id):
        if user_id is None:
            query = f"SELECT * FROM Talks WHERE published = 1 AND channel_id = {channelId} AND card_visibility = 'Everybody' AND date < CURRENT_TIMESTAMP AND TIMESTAMPADD(MINUTE, 30, end_date) > CURRENT_TIMESTAMP ORDER BY date"
        else:
            query = f'''SELECT DISTINCT * FROM Talks 
                    WHERE Talks.published = 1 AND channel_id = {channelId}
                        AND (Talks.card_visibility = 'Everybody' 
                                OR (Talks.card_visibility = 'Followers and members' 
                                    AND Talks.channel_id in (
                                        SELECT Channels.id FROM Channels 
                                        INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id 
                                        WHERE (ChannelUsers.role = 'member' OR ChannelUsers.role = 'follower' OR ChannelUsers.role = 'owner')
                                            AND ChannelUsers.user_id = {user_id}
                                        )
                                    )
                                OR (Talks.card_visibility = 'Members only' 
                                    AND Talks.channel_id in (
                                        SELECT Channels.id FROM Channels 
                                        INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id 
                                        WHERE (ChannelUsers.role = 'member' OR ChannelUsers.role = 'owner')
                                            AND ChannelUsers.user_id = {user_id}
                                        )
                                    )
                            )
                        AND Talks.date < CURRENT_TIMESTAMP AND TIMESTAMPADD(MINUTE, 30, Talks.end_date) > CURRENT_TIMESTAMP
                    ORDER BY Talks.date
                    '''

        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return talks

    def getAvailablePastTalksForChannel(self, channelId, user_id):
        if user_id is None:
            query = f"SELECT * FROM Talks WHERE published = 1 AND channel_id = {channelId} AND card_visibility = 'Everybody' AND TIMESTAMPADD(MINUTE, 30, end_date) < CURRENT_TIMESTAMP ORDER BY date DESC;"
        else:
            query = f'''SELECT DISTINCT * FROM Talks 
                    WHERE Talks.published = 1 AND channel_id = {channelId}
                        AND (Talks.card_visibility = 'Everybody'
                                OR (Talks.card_visibility = 'Followers and members' 
                                    AND Talks.channel_id in (
                                        SELECT Channels.id FROM Channels 
                                        INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id 
                                        WHERE (ChannelUsers.role = 'member' OR ChannelUsers.role = 'follower' OR ChannelUsers.role = 'owner')
                                            AND ChannelUsers.user_id = {user_id}
                                        )
                                    )
                                OR (Talks.card_visibility = 'Members only' 
                                    AND Talks.channel_id in (
                                        SELECT Channels.id FROM Channels 
                                        INNER JOIN ChannelUsers ON Channels.id = ChannelUsers.channel_id 
                                        WHERE (ChannelUsers.role = 'member' OR ChannelUsers.role = 'owner')
                                            AND ChannelUsers.user_id = {user_id}
                                        )
                                    )
                            )
                        AND TIMESTAMPADD(MINUTE, 30, Talks.end_date) < CURRENT_TIMESTAMP
                    ORDER BY Talks.date DESC;
                    '''
        
        talks = self.db.run_query(query)

        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return talks


    def getAllCurrentTalks(self, limit, offset):
        query = f"SELECT * FROM Talks WHERE published = 1 AND date < CURRENT_TIMESTAMP AND TIMESTAMPADD(MINUTE, 30, end_date) > CURRENT_TIMESTAMP ORDER BY date DESC LIMIT {limit} OFFSET {offset};"
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
        return (talks, self.getNumberOfCurrentTalks())

    def getAllPastTalks(self, limit, offset):
        query = f"SELECT * FROM Talks WHERE published = 1 AND TIMESTAMPADD(MINUTE, 30, end_date) < CURRENT_TIMESTAMP AND recording_link IS NOT NULL ORDER BY date DESC LIMIT {limit} OFFSET {offset}"
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return (talks, self.getNumberOfPastTalks())

    def getAllFutureTalksForChannel(self, channelId):
        query = f"SELECT * FROM Talks WHERE channel_id = {channelId} AND date > CURRENT_TIMESTAMP AND published = 1 ORDER BY date ASC;"
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return talks

    def getAllCurrentTalksForChannel(self, channelId):
        query = f"SELECT * FROM Talks WHERE channel_id = {channelId} AND date < CURRENT_TIMESTAMP AND end_date > CURRENT_TIMESTAMP AND published = 1"
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return talks

    def getAllPastTalksForChannel(self, channelId):
        query = f"SELECT * FROM Talks WHERE channel_id = {channelId} AND end_date < CURRENT_TIMESTAMP AND published = 1 ORDER BY Talks.date DESC;"
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return (talks, self.getNumberOfPastTalksForChannel(channelId))

    def getAllDraftedTalksForChannel(self, channelId):
        query = f"SELECT * FROM Talks WHERE channel_id = {channelId} AND published = 0"
        talks = self.db.run_query(query)
        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
        return talks

    def getTalkById(self, talkId):
        query = f'SELECT * FROM Talks WHERE id = {talkId};'
        try:
            talk = self.db.run_query(query)[0]
            # talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
            # talk["topics"] = self.topics.getTopicsOnTalk(talk["id"])
            return talk
        except:
            return


    def scheduleTalk(self, channelId, channelName, talkName, startDate, endDate, talkDescription, talkLink, talkTags, showLinkOffset, visibility, cardVisibility, topic_1_id, topic_2_id, topic_3_id, talk_speaker, talk_speaker_url, published, audience_level, auto_accept_group, auto_accept_custom_institutions, customInstitutionsIds, reminder1, reminder2, reminderEmailGroup, email_on_creation=True):
        query = f'''
            INSERT INTO Talks (
                channel_id, 
                channel_name, 
                name, 
                date, 
                end_date, 
                description, 
                link, 
                show_link_offset, 
                visibility, 
                card_visibility, 
                topic_1_id, 
                topic_2_id, 
                topic_3_id, 
                talk_speaker, 
                talk_speaker_url, 
                published,
                audience_level,
                auto_accept_group, 
                auto_accept_custom_institutions
                ) 
            VALUES (
                {channelId}, 
                "{channelName}", 
                "{talkName}", 
                "{startDate}", 
                "{endDate}", 
                "{talkDescription}", 
                "{talkLink}", 
                {showLinkOffset}, 
                "{visibility}", 
                "{cardVisibility}", 
                "{topic_1_id}", 
                "{topic_2_id}", 
                "{topic_3_id}", 
                "{talk_speaker}", 
                "{talk_speaker_url}", 
                {published},
                "{audience_level}",
                "{auto_accept_group}", 
                {auto_accept_custom_institutions}
                );
            '''    
        try:
            self.db.open_connection()
            cursor = self.db.con.cursor()
            cursor.execute(query)
            self.db.con.commit()
            insertId = cursor.lastrowid

            if not isinstance(insertId, int):
                raise AssertionError("scheduleTalk: insertion failed, didnt return an id.")

            # tagIds = [t["id"] for t in talkTags]
            # self.tags.tagTalk(insertId, tagIds)

            # add customInstitutions for auto-acceptance
            self.editAutoAcceptanceCustomInstitutions(insertId, customInstitutionsIds)

            # notify members by email
            if email_on_creation:
                self.notifyCommunityAboutNewTalk(
                    channelId, 
                    channelName, 
                    startDate, 
                    talkName, 
                    insertId, 
                    talk_speaker, 
                    talk_speaker_url)

            # Email reminders
            self.email_reminders.addEmailReminders(insertId, startDate, reminderEmailGroup, reminder1, reminder2)

            return self.getTalkById(insertId)

        except Exception as e:
            return str(e)

    def editTalk(self, channelId, talkId, talkName, startDate, endDate, talkDescription, talkLink, talkTags, showLinkOffset, visibility, cardVisibility, topic_1_id, topic_2_id, topic_3_id, talk_speaker, talk_speaker_url, published, audience_level, auto_accept_group, auto_accept_custom_institutions, reminder1, reminder2, reminderEmailGroup):
        try:
            # query past talk information
            past_talk_query = f'''
                SELECT * FROM Talks
                WHERE id = {talkId};
            '''
            old_res = self.db.run_query(past_talk_query)[0]

            channel_id = old_res["channel_id"]
            # old_start_date = old_res["date"]
            # old_end_date = old_res["end_date"]
            # old_url = old_res["link"]
            # old_speaker = old_res["talk_speaker"]
            # auto_accept_group = old_res["auto_accept_group"]
            # old_auto_accept_custom_institutions = old_res["auto_accept_custom_institutions"]

            # check if date changed or if (URL changed AND talk is not public) ((because else, we dont care if URL changed as there are no registration))
            # critical_information_changed = False
            # critical_information_changed = (
            #     old_start_date != startDate or
            #     old_end_date != endDate or
            #     (old_url != talkLink and visibility != "Everybody") or
            #     old_speaker != talk_speaker
            # )

            # modify current information
            query = f'''
                UPDATE Talks 
                    SET name="{talkName}", 
                    description="{talkDescription}", 
                    date="{startDate}", 
                    end_date="{endDate}", 
                    link="{talkLink}", 
                    show_link_offset={showLinkOffset}, 
                    visibility="{visibility}", 
                    card_visibility="{cardVisibility}", 
                    topic_1_id="{topic_1_id}", 
                    topic_2_id="{topic_2_id}", 
                    topic_3_id="{topic_3_id}", 
                    talk_speaker="{talk_speaker}", 
                    talk_speaker_url="{talk_speaker_url}", 
                    published={published},
                    audience_level="{audience_level}",
                    auto_accept_group="{auto_accept_group}",
                    auto_accept_custom_institutions={auto_accept_custom_institutions}

                WHERE id = {talkId};'''

            self.db.run_query(query)

            # Update Email reminders
            self.email_reminders.updateEmailReminders(
                talkId, 
                startDate, 
                reminderEmailGroup, 
                reminder1, 
                reminder2)

            tagIds = [t["id"] for t in talkTags]
            self.tags.tagTalk(talkId, tagIds)

            # notify attendees
            """
            self.notifyParticipantAboutTalkModification(
                talkId,
                channel_id,
                talkName,
                talkLink,
                startDate,
                endDate
            )
            """

        except Exception as e:
            return str(e)
           
        return self.getTalkById(talkId) 

    def editAutoAcceptanceCustomInstitutions(self, talk_id, institution_ids):
        """Method to edit the custom institutions auto-accepted for a talk.

        Args:
            talkId ([type]): [description]
            institution_ids (int OR list): [description]

        Raises:
            Exception: [description]
        """
        if institution_ids is None:
            raise Exception("'institution_ids' a can't be None")
        else:
            # clean previous institutions
            del_prev_inst_query = f'''
                DELETE FROM CustomInstitutionsAutoAccept
                WHERE talk_id = {talk_id};
            '''
            try:
                self.db.run_query(del_prev_inst_query)
            except Exception as e:
                return str(e)

            # add new ones
            institution_list = [int(institution_ids)] if isinstance(institution_ids, int) else [int(i) for i in institution_ids]
            for instit_id in institution_list:
                add_query = f'''
                    INSERT INTO CustomInstitutionsAutoAccept (
                        institution_id, 
                        talk_id
                    )
                    VALUES (
                        {instit_id},
                        {talk_id}
                    );
                '''
                try:
                    self.db.run_query(add_query)
                except Exception as e:
                    return str(e)
            return "ok"

    def addRecordingLink(self, talkId, link):
        query = f'UPDATE Talks SET recording_link="{link}" WHERE id = {talkId}'
        self.db.run_query(query)
        return self.getTalkById(talkId)

    def deleteTalk(self, talkId):
        query = f'DELETE FROM Talks where id = {talkId}'
        self.db.run_query(query)

    def getFutureTalksForUser(self, userId):
        query = f"SELECT Talks.id, Talks.channel_id, Talks.channel_name, Talks.name, Talks.description, Talks.date, Talks.end_date, Talks.link, Talks.show_link_offset, Talks.visibility FROM Talks INNER JOIN TalkRegistrations ON Talks.id = TalkRegistrations.talk_id WHERE TalkRegistrations.user_id = {userId} AND Talks.date > CURRENT_TIMESTAMP AND Talks.published = 1"
        talks = self.db.run_query(query)

        for talk in talks:
            channel = self.channels.getChannelById(talk["channel_id"])
            talk["channel_colour"] = channel["colour"]
            talk["has_avatar"] = channel["has_avatar"]
            talk["tags"] = self.tags.getTagsOnTalk(talk["id"])
        return talks

    def getPastTalksForUser(self, userId):
        query = f"SELECT Talks.id, Talks.channel_id, Talks.channel_name, Talks.name, Talks.description, Talks.date, Talks.end_date, Talks.recording_link FROM Talks INNER JOIN TalkRegistrations ON Talks.id = TalkRegistrations.talk_id WHERE TalkRegistrations.user_id = {userId} AND Talks.end_date < CURRENT_TIMESTAMP AND Talks.published = 1"
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

        query = f"SELECT Talks.id, Talks.channel_id, Talks.channel_name, Talks.name, Talks.description, Talks.date, Talks.end_date, Talks.recording_link FROM Talks INNER JOIN TalkTags ON Talks.id = TalkTags.talk_id WHERE TalkTags.tag_id = {tagId} AND Talks.end_date < CURRENT_TIMESTAMP AND published=1"
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
        query = f"SELECT Talks.id, Talks.channel_id, Talks.channel_name, Talks.name, Talks.description, Talks.date, Talks.end_date, Talks.recording_link FROM Talks INNER JOIN TalkSaves ON Talks.id = TalkSaves.talk_id WHERE TalkSaves.user_id = {userId} AND Talks.published = 1"
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
        query = f"SELECT visibility, channel_id FROM Talks WHERE id={talkId} AND published=1"
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

    def isTalkCardAvailableToUser(self, talkId, userId):
        query = f"SELECT card_visibility, channel_id FROM Talks WHERE id={talkId} AND published=1"
        result = self.db.run_query(query)

        if len(result) == 0:
            return False

        card_visibility  = result[0]["card_visibility"]
        if card_visibility == "Everybody":
            return True
        if card_visibility == "Followers and members":
            return self.channels.isUserInChannel(result[0]["channel_id"], userId, ["follower", "member", "owner"])
        if card_visibility == "Members only":
            return self.channels.isUserInChannel(result[0]["channel_id"], userId, ["member", "owner"])
        
        return True

    ###############################
    # Talk views
    ###############################
    def getTrendingTalks(self):
        query = f'''
            SELECT 
                Talks.name,
                Talks.id,
                Channels.id,
                Channels.has_avatar,
                TalkViewCounts.total_views
            FROM Talks, Channels, TalkViewCounts
                    WHERE (Talks.channel_id = Channels.id 
                        AND Talks.id = TalkViewCounts.talk_id
                        AND Talks.date > now())
            ORDER by TalkViewCounts.total_views DESC
            LIMIT 20;
        '''
        res = self.db.run_query(query)

        # HACK: to prevent same agora having 5 talks, we query 20 future talks and limit to 2 max per agora.
        try:
            HARD_LIMIT_PER_AGORA = 3
            TOTAL_N_TALK = 5
            filtered_results = []
            counter_ag = {}
            for talk in res:
                agora_id = talk["Channels.id"]

                if len(filtered_results) >= TOTAL_N_TALK:
                    pass
                else:
                    if agora_id in counter_ag:
                        if counter_ag[agora_id] >= HARD_LIMIT_PER_AGORA:
                            pass
                        else:
                            filtered_results.append(talk)
                            counter_ag[agora_id] += 1
                    else:
                        filtered_results.append(talk)
                        counter_ag[agora_id] = 1

            return filtered_results

        except Exception as e:
            raise Exception(e)
        
        

    def increaseTalkViewCount(self, talkId):
        try:
            increase_counter_query = f'''
                UPDATE TalkViewCounts
                    SET total_views = total_views + 1
                    WHERE talk_id = {talkId};'''
            res = self.db.run_query(increase_counter_query)

            if type(res) == list:
                if res[0] == 0 and res[1] == 0:
                    initialise_counter_query = f'''
                        INSERT INTO TalkViewCounts (talk_id, total_views) 
                            VALUES ({talkId}, 4);
                    '''
                    res = self.db.run_query(initialise_counter_query)
                    return "ok" 

        except Exception as e:
            return str(e)

    def getTalkViewCount(self, talkId):
        get_counter_query = f'''
            SELECT * FROM TalkViewCounts 
                WHERE talk_id = {talkId};
            '''
        try:
            return self.db.run_query(get_counter_query)[0]["total_views"]
        except Exception as e:
            return str(e)

    ###############################
    # Talk registrations
    ###############################
    def acceptTalkRegistration(self, requestRegistrationId):
        try:
            # 1. get talk infos for email
            extra_email_info_query = f'''
                SELECT 
                    Talks.link,
                    Talks.id,
                    Talks.name,
                    Talks.channel_name,
                    Talks.channel_id,
                    Talks.date,
                    TalkRegistrations.applicant_name,
                    TalkRegistrations.email
                FROM Talks
                INNER JOIN TalkRegistrations
                    ON TalkRegistrations.id = {requestRegistrationId}
                WHERE TalkRegistrations.talk_id = Talks.id;
            '''
            extra_email_info = self.db.run_query(extra_email_info_query)[0]

            target_email = extra_email_info["email"]
            talk_name = extra_email_info["name"]
            recipient_name = extra_email_info["applicant_name"]
            talk_id = extra_email_info["id"]
            agora_name = extra_email_info["channel_name"]
            conference_url = extra_email_info["link"]
            start_time = extra_email_info["date"]

            # 2. Send email to applicant
            self.mail_sys.send_confirmation_talk_registration_acceptance(
                target_email,
                talk_name,
                recipient_name,
                talk_id,
                agora_name,
                start_time,
                conference_url
            )

            # 3. Flag user as registered in DB
            accept_query = f'''UPDATE TalkRegistrations SET status='accepted' WHERE id = {requestRegistrationId};'''
            self.db.run_query(accept_query)
            return "ok"
        except Exception as e:
            return str(e)

    def refuseTalkRegistration(self, requestRegistrationId):
        refuse_query = f'''
            UPDATE TalkRegistrations 
            SET status='refused' WHERE id = {requestRegistrationId};'''
        try:
            self.db.run_query(refuse_query)
            return "ok"
        except Exception as e:
            return str(e)

    def registerTalk(self, talkId, userId, applicant_name, email, website, institution, user_hour_offset):
        # get today's time GMT in format: "2020-12-31 23:59"
        dateTimeObj = datetime.now()
        timestampStr = dateTimeObj.strftime("%Y-%m-%d %H:%M:%S")

        userIsAutoAcceptedToTalk = self.isEmailAutoAcceptedToTalk(email, talkId)

        try:
            status = "accepted" if userIsAutoAcceptedToTalk else "pending"
            self.db.open_connection()
            with self.db.con.cursor() as cur:
                cur.execute(
                    'INSERT INTO TalkRegistrations(talk_id, user_id, applicant_name, email, website, institution, registration_date, status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)',
                    [str(talkId), str(userId), applicant_name, email, website, institution, timestampStr, status])
                self.db.con.commit()
                cur.close()

            # A. send confirmation email to user
            # 1) query talk info
            talk_info = self.getTalkById(talkId)
            talk_name = talk_info["name"]
            agora_name = talk_info["channel_name"]
            date_str = talk_info["date"]
            conference_url = talk_info["link"]
            channel_id = talk_info["channel_id"]

            # 2) send email applicant (either acknowledgment application OR confirmation attendence)
            if not userIsAutoAcceptedToTalk:
                self.mail_sys.send_confirmation_talk_registration_request(
                    email,
                    talk_name,
                    applicant_name,
                    talkId,
                    agora_name,
                    date_str,
                    conference_url,
                    user_hour_offset
                    )

            else:
                self.mail_sys.send_confirmation_talk_registration_acceptance(
                    email,
                    talk_name,
                    applicant_name,
                    talkId,
                    agora_name,
                    date_str,
                    conference_url,
                    user_hour_offset
                )

            # B. Send email to administrator (dont send email admin if auto accepted)
            if not userIsAutoAcceptedToTalk:
                if website == "":
                    website = "(Not provided)"
                admin_emails = self.channels.getEmailAddressesMembersAndAdmins(
                    channel_id, 
                    getMembersAddress=False, 
                    getAdminsAddress=True
                    )

                for email in admin_emails:
                    self.mail_sys.notify_admin_talk_registration(
                        email,
                        agora_name, 
                        talk_name,
                        applicant_name,
                        institution,
                        website)

            return "ok"     
        except Exception as e:
            return str(e)

    def unregisterTalk(self, requestRegistrationId, userId):
        #TODO: TO TEST
        self.db.open_connection()
        if userId == None:
            try:
                unregister_talk = f'''DELETE FROM TalkRegistrations WHERE id = {requestRegistrationId};'''
                self.db.run_query(unregister_talk)
            except Exception as e:
                return str(e)
        else:
            try:
                unregister_talk = f'''DELETE FROM TalkRegistrations WHERE id = {requestRegistrationId} AND user_id = {userId};'''
                self.db.run_query(unregister_talk)
            except Exception as e:
                return str(e)

    def getTalkRegistrationsForTalk(self, talk_id):
        get_query_talk = f'SELECT * FROM TalkRegistrations WHERE talk_id = {talk_id}'
        try:
            res = self.db.run_query(get_query_talk)
            return res
        except Exception as e:
            return str(e)

    def getTalkRegistrationsForChannel(self, channel_id):
        get_query_channel = f'''
            SELECT 
                TalkRegistrations.talk_id, 
                Talks.name,
                TalkRegistrations.applicant_name, 
                TalkRegistrations.email, 
                TalkRegistrations.website, 
                TalkRegistrations.id, 
                TalkRegistrations.status, 
                TalkRegistrations.institution, 
                TalkRegistrations.user_id,
                TalkRegistrations.status
            FROM TalkRegistrations
            INNER JOIN Talks
                ON Talks.channel_id = {channel_id}
            WHERE TalkRegistrations.talk_id = Talks.id;
            '''

        try:
            res = self.db.run_query(get_query_channel)
            return res
        except Exception as e:
            return str(e)

    def getTalkRegistrationsForUser(self, userId):
        raise NotImplementedError

    def registrationStatusForTalk(self, talkId, userId):
        query = f'SELECT status FROM TalkRegistrations WHERE user_id={userId} AND talk_id={talkId};'
        result = self.db.run_query(query)
        try:
            return result["status"]
        except:
            return {"status": "unregistered"}

    def sendEmailonTalkModification(self, talkId):
        talk = self.getTalkById(talkId)
        if talk:
            result = self.notifyParticipantAboutTalkModification(talkId, talk["channel_id"], talk["name"], talk["link"], talk["date"], talk["end_date"])
            return result
        else:
            return "fail"

    def sendEmailonTalkScheduling(self, talkId):
        talk = self.getTalkById(talkId)
        if talk:
            result = self.notifyCommunityAboutNewTalk(talk["channel_id"], talk["channel_name"], talk["date"], talk["name"], talkId, talk["talk_speaker"], talk["talk_speaker_url"])
            return result
        else:
            return "fail"

    def notifyParticipantAboutTalkModification(self, talkId, channelId, talkName, talkLink, startDate, endDate):
        try:
            # query emails
            community_emails = self.channels.getEmailAddressesMembersAndAdmins(
                channelId,
                getMembersAddress=True,
                getAdminsAddress=True
            )

            get_emails_all_registrations = f'''
                SELECT 
                    email
                FROM TalkRegistrations
                WHERE
                    talk_id = {talkId} AND
                    status = 'accepted';
            '''
            res = self.db.run_query(get_emails_all_registrations)

            participant_emails = [x["email"] for x in res]

            all_emails = community_emails + participant_emails
            
            # get missing channel_name
            get_agora_name_query = f'''
                SELECT name 
                FROM Channels
                WHERE 
                    id = {channelId};
            '''
            agora_name = self.db.run_query(get_agora_name_query)[0]["name"]

            for email in all_emails:
                self.mail_sys.send_talk_details_modification_update(
                    email,
                    talkName,
                    talkId,
                    agora_name,
                    startDate,
                    talkLink
                )
            return "ok"

        except Exception as e:
            return str(e)

    def notifyCommunityAboutNewTalk(self, channelId, channelName, startDate, talkName, talkId, SpeakerName, SpeakerHomepage=""):
        try:
            # query all emails
            emails = self.channels.getEmailAddressesMembersAndAdmins(channelId, getMembersAddress=True, getAdminsAddress=False)
            
            if isinstance(emails,list):
                for email in emails:
                    self.mail_sys.send_advertise_new_incoming_talk_for_channel(
                        email, 
                        channelName, 
                        startDate, 
                        talkName, 
                        talkId, 
                        SpeakerName, 
                        SpeakerHomepage
                    )
            return "ok"
        except Exception as e:
            raise Exception(f"notifyCommmunityAboutNewTalk: exception: {e}")

    # --------------------------------------------
    # Talks: presentation slides methods
    # --------------------------------------------
    def addSlides(self, talkId):
        query = f'UPDATE Talks SET has_slides=1 WHERE id = {talkId};'
        self.db.run_query(query)

    def getSlidesLocation(self, talkId):
        # NOTE: only supports .pdf for now
        query = f'SELECT has_slides FROM Talks WHERE id = {talkId};'
        res = self.db.run_query(query)
        try:
            if res[0]["has_slides"] == 1:
                return f"/home/cloud-user/plateform/agora/storage/slides/{talkId}.pdf"
        except:
            return ""

    def deleteSlides(self, talkId):
        query = f'UPDATE Talks SET has_slides=0 WHERE id = {talkId}'
        self.db.run_query(query)
        try:
            os.remove(f"/home/cloud-user/plateform/agora/storage/slides/{talkId}.pdf")
            return "ok"
        except Exception as e:
            return str(e)
    
    def isEmailAutoAcceptedToTalk(self, email, talk_id):
        auto_accept_config_request = f'''
                SELECT 
                    auto_accept_group, 
                    auto_accept_custom_institutions
                FROM Talks
                WHERE id = {talk_id};
            '''
        autoAccepted = False
        # check conditions
        try:
            auto_accept_config = self.db.run_query(auto_accept_config_request)[0]
            
            autoAcceptGroup = auto_accept_config["auto_accept_group"]
            autoAcceptCustom = auto_accept_config["auto_accept_custom_institutions"]

            if autoAcceptGroup == "Everybody":
                autoAccepted = True

            elif autoAcceptGroup == "Academics":
                if not autoAccepted:
                    autoAccepted = self.institutions.isEmailVerifiedAcademicEmail(email)

            if autoAcceptCustom:
                email_ending = email.split("@")[1]
                check_custom_query = f'''
                    SELECT 
                        domain
                    FROM CustomInstitutionsAutoAccept
                    WHERE 
                        domain = "{email_ending}"
                        AND talk_id = {talk_id}
                    ;
                '''
                res = self.db.run_query(check_custom_query)

                domain_list = [i["domain"] for i in res]
                if not autoAccepted:
                    autoAccepted = (email_ending in domain_list)
    
            return autoAccepted

        except Exception as e:

            return {"error": str(e)}
