import random
import logging
from repository.TalkRepository import TalkRepository
from mailing.sendgridApi import sendgridApi
from app.databases import agora_db
import json


MAIL_SYS = sendgridApi()


class TweetsRepository:
    def __init__(self, db=agora_db, mail_sys=MAIL_SYS):
        self.db = db
        self.mail_sys = mail_sys
        self.talks = TalkRepository(db=agora_db)
        
    def getIncomingTalksToTweet(self, minimum_clickcount, max_day_in_advance):
        select_query =  f'''
            SELECT Talks.id, Talks.topic_1_id, Talks.topic_2_id, Talks.topic_3_id FROM Talks
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
        res = self.db.run_query(select_query)

        return res


    def updateTweetSendingStatus(self, talk_id, successful, error_message=""):
       # check 
       # successful

       # error
        pass

if __name__ == "__main__":
    obj = TweetsRepository()
    obj.getIncomingTalksToTweet()