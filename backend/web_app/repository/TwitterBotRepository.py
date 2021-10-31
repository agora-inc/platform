import random
import logging
from repository.TalkRepository import TalkRepository
from mailing.sendgridApi import sendgridApi
from app.databases import agora_db
import json


MAIL_SYS = sendgridApi()


class TwitterBotRepository:
    def __init__(self, db=agora_db, mail_sys=MAIL_SYS):
        self.db = db
        self.mail_sys = mail_sys
        self.talks = TalkRepository(db=agora_db)
        
    def getIncomingTalksToTweet(self, minimum_clickcount, max_day_in_advance):
        # Check public events with number views above threshold + events that haven't been advertised yet!
        select_future_talks =  f'''
            SELECT Talks.id, Talks.talk_speaker, Talks.date, Talks.topic_1_id, Talks.topic_2_id, Talks.topic_3_id, Talks.channel_name, Talks.name FROM Talks
            INNER JOIN TalkViewCounts
            ON Talks.id = TalkViewCounts.talk_id
                WHERE 
                    Talks.published = 1 
                    AND Talks.date < DATE_ADD(now(), INTERVAL {max_day_in_advance} DAY)
                    AND Talks.date > CURRENT_TIMESTAMP
                    AND Talks.card_visibility = "Everybody"
                    AND Talks.visibility = "Everybody"
                    AND TalkViewCounts.total_views > {minimum_clickcount}
            ORDER BY date DESC;
            '''
        talks_res = self.db.run_query(select_future_talks)

        # filter to prevent reposting
        select_successful_tweets_id = f'''
            SELECT talk_id FROM TwitterBot 
            WHERE talk_id IS NOT NULL AND action = 'post' AND status = 'success';
        '''
        #
        #
        # TO TEST
        #
        #
        #
        list_ids = self.db.run_query(select_successful_tweets_id)

        return [i for i in res if i["id"] not in select_successful_tweets_id]

    def updateTweetSendingStatus(self, action, talk_id, successful, error_message=""):
       # Add
        try:
            insert_query = f'''
                INSERT (action, talk_id, successful, error_message) INTO TwitterBot VALUES ('post',{talk_id},{successful},{error_message})
            '''
            self.db.run_query(insert_query)
        except Exception as e:
            insert_query = f'''
                INSERT (action, talk_id, successful, error_message) INTO TwitterBot VALUES ('post',{talk_id},0,{e})
            '''

        # If addition successful, remove unsuccessful entries
        if successful:
            removal_query = f'''
                DELETE * from TwitterBot WHERE talk_id = {talk_id} AND action = '{action}';
            '''
            self.db.run_query(removal_query)
