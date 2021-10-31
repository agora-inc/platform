from backend.web_app.repository.TalkRepository import TalkRepository
import tweety
from repository.TweetsRepository import TweetsRepository
from mailing.sendgridApi import sendgridApi

from app.databases import agora_db


MAIL_SYS = sendgridApi()
MINIMUM_CLICKCOUNT = 20
MAX_DAYS_IN_ADVANCE = 5
TWITT_API_KEY = "bPddsEy034JlKrHHzJCSGj3lf"
TWITT_API_KEY_SEC = "bPddsEy034JlKrHHzJCSGj3lf"
TWITT_ACCESS_TOKEN = "1367790358659272704-FvOHuZRFvwkZRXxkft02QioEDPK9LR"
TWITT_ACCESS_TOKEN_SEC = "NFMXeCpBI7MyGJCpqtRSiUNEoZJ8rAE3LsNwvM3iVi4mv"


class TwitterBot:
    def __init__(self, db=agora_db, mail_sys=MAIL_SYS):
        self.db = db
        self.mail_sys = mail_sys
        
        self.tweets = TweetsRepository()
        self.talks = TalkRepository(db=db)

        self._authenticate_twitter()

    def _authenticate_twitter(self):
        # Authenticate to Twitter
        auth = tweepy.OAuthHandler(TWITT_API_KEY, TWITT_API_KEY_SEC)
        auth.set_access_token(TWITT_ACCESS_TOKEN, TWITT_ACCESS_TOKEN_SEC)

        # Create API object
        self.twitter_api = tweepy.API(auth)

    def run(self):
        # A. Post talks
        self.post_tweets()

        # B. Unfollow / Follow
        # self.follow_in_mass()

    def post_tweets(self):
        talks = self.TweetsRepository.getIncomingTalksToTweet(MINIMUM_CLICKCOUNT, MAX_DAYS_IN_ADVANCE)
        for talk in talks:
            try:
                talkId = talk["id"]
                talkTopics = []
                text = self.get_twitter_message(talkTopics)
                self.post_tweet(talk)
                self.TweetsRepository.updateTweetSendingStatus(talkId, sent=False)
            except Exception as e:
                self.TweetsRepository.updateTweetSendingStatus(talkId, sent=True, error_message=e)

    def get_twitter_message(talkIdList: list):
        # READ json of hashtags
        raise NotImplementedError

    def _track_status_tweet(self, sent: str, error_message: str):
        raise NotImplementedError

    def _notify_error(self, error):
        raise NotImplementedError()

    def follow_in_mass(self):
        # get ids of people who dont follow us (ids_to_follow)
        # get ids of all people hwo follow us (ids_followers)
        # unfollow all people who follow us but a small set
        # follow ids_to_follow - ids_followers

        # Caution: if we unfollow and refollow a few people in a row, Twitter bans us for 3 days
        raise NotImplementedError()


if __name__ == "__main__":
    obj = TwitterBot()
    obj.run()