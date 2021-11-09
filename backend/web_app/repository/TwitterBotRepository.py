import random
import logging
from mailing.sendgridApi import sendgridApi
from app.databases import agora_db
import json


# DELETE BELOW LINE IN PRODUCTION
# from TalkRepository import TalkRepository
# UNCOMMENT BELOW LINE IN PRODUCTION
# from repository.TalkRepository import TalkRepository


MAIL_SYS = sendgridApi()


class TwitterBotRepository:
    def __init__(self, db=agora_db, mail_sys=MAIL_SYS):
        self.db = db
        self.mail_sys = mail_sys
        # self.talks = TalkRepository(db=agora_db)
        
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
                    AND Talks.name <> 'TBA'
                    AND Talks.name <> 'TBD'
                    AND TalkViewCounts.total_views > {minimum_clickcount}
            ORDER BY date DESC;
            '''
        talks_res = self.db.run_query(select_future_talks)

        # filter to prevent reposting
        select_successful_tweets_id = f'''
            SELECT DISTINCT talk_id FROM TwitterBot 
            WHERE talk_id IS NOT NULL AND (action = 'advertise' OR action = 'remind') AND success = 1;
        '''
        list_ids_res = self.db.run_query(select_successful_tweets_id)
        list_ids = [i["talk_id"] for i in list_ids_res]

        if list_ids == []:
            return talks_res
        else:
            talks_to_tweet = []
            for i in talks_res:
                if i["id"] not in list_ids:
                    talks_to_tweet.append(i)
            return talks_to_tweet

    def updateTweetSendingStatus(self, action, talk_id, success, params={}, error_msg=""):
        print("he1")
        assert(action in ["advertise", "remind", "retweet", "follow"])
        print("he2")
        
        try:
            if "exec_time" in params:
                exec_time = params["exec_time"]
                insert_query = f'''
                    INSERT INTO TwitterBot (action, talk_id, success, error_msg, exec_time) VALUES ('{action}',{talk_id},{success},'{error_msg}', '{exec_time}');
                '''
            else:
                insert_query = f'''
                    INSERT INTO TwitterBot (action, talk_id, success, error_msg) VALUES ('{action}',{talk_id},{success},'{error_msg}');
                '''
            self.db.run_query(insert_query)
        except Exception as e:
            print("heyo", e)
            insert_query = f'''
                INSERT INTO TwitterBot (action, talk_id, success, error_msg) VALUES ('{action}',{talk_id},0,'{e}');
                '''
            self.db.run_query(insert_query)

        # # If addition successful, remove past unsuccessful entries
        # if success:
        #     removal_query = f'''
        #         DELETE * from TwitterBot WHERE talk_id = {talk_id} AND action = '{action}';
        #     '''
        #     self.db.run_query(removal_query)
