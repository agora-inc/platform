# import hack (Remy); TODO: make import directly from repository folder.
from app.routes import TalkRepository, authenticate
from app.routes import TweetsRepository
from app.databases import agora_db
import tweepy
import json
import random

MINIMUM_CLICKCOUNT = 4
MAX_DAYS_IN_ADVANCE = 5
TWITT_API_KEY = "bPddsEy034JlKrHHzJCSGj3lf"
TWITT_API_KEY_SEC = "bPddsEy034JlKrHHzJCSGj3lf"
TWITT_ACCESS_TOKEN = "1367790358659272704-FvOHuZRFvwkZRXxkft02QioEDPK9LR"
TWITT_ACCESS_TOKEN_SEC = "NFMXeCpBI7MyGJCpqtRSiUNEoZJ8rAE3LsNwvM3iVi4mv"

TWITTER_HASHTAGS_JSON_PATH = "/home/cloud-user/plateform/agora/backend/twitter_bot/hashtags_per_id.json"



class TwitterBot:
    def __init__(self, db=agora_db):
        self.db = db
        self.tweets = TweetsRepository.TweetsRepository()
        self.talks = TalkRepository.TalkRepository(db=db)
        self.hashtags_per_id = {}

        self._load_mapping()
        self._authenticate_twitter()

    def _authenticate_twitter(self):
        # Authenticate to Twitter
        auth = tweepy.OAuthHandler(TWITT_API_KEY, TWITT_API_KEY_SEC)
        auth.set_access_token(TWITT_ACCESS_TOKEN, TWITT_ACCESS_TOKEN_SEC)

        # Create API object
        self.twitter_api = tweepy.API(auth)
        try:
            self.twitter_api.verify_credentials()
            print("Authentication OK")
        except Exception as e:
            raise ConnectionError(f"Error during authentication {e}")

    def _load_mapping(self):
        with open(TWITTER_HASHTAGS_JSON_PATH, "r") as twitter_hashtags:
            self.hashtags_per_id = json.load(twitter_hashtags)

    def run(self):
        # A. Post talks
        self.post_tweets()

        # B. Unfollow / Follow
        # self.follow_in_mass()

    def post_tweets(self):
        talks = self.tweets.getIncomingTalksToTweet(MINIMUM_CLICKCOUNT, MAX_DAYS_IN_ADVANCE)
        print(talks)
        for talk in talks:
            try:
                talk_id = talk["id"]
                talk_name = talk["talk_name"]
                channel_name = talk["channel_name"]
                speaker_name = talk["talk_speaker"]
                date = talk["date"]
                talk_topics = []
                for key in ["topic_1_id", "topic_2_id", "topic_3_id"]:
                    topic_id = talk[key]
                    if topic_id != 0:
                        talk_topics.append(topic_id)
                text = self.get_twitter_message(talk_id, talk_name, channel_name, speaker_name, date, talk_topics)

                # self.twitter_api.send(FILL THIS UP)
                self.tweets.updateTweetSendingStatus(talk_id, successful=True)
            except Exception as e:
                self.tweets.updateTweetSendingStatus(talk_id, successful=False, error_message=e)

    def get_twitter_message(self, talk_id: int, talk_name: str, channel_name: str, speaker_name: str, date: str, topic_ids: list):
        # human_readable_date (TODO)
        event_url = f"https://mora.stream/event/{talk_id}"
        hashtags_string = [f"#{self.hashtags_per_id[topic_id]}" for topic_id in topic_ids] + "#academicTwitter"
        
        message = random.choice([
            "Popular event incoming!",
            "The {channel_name} agora is hosting a talk on '{talk_name}' and it is currently trending! Have a look",
            "Something big seems to be happening soon: this seminar has ",
            "The most trending talk of the moment is {talk_name} organised by the {channel_name}",
            "Among the mass of incoming seminars, this one has been experiencing a huge number of clicks. Check it out!",
            "What do researchers",
            "To not miss out this week:",
            "Here's a seminar that hundreds of academics have ",
            "Wondering what"
        ])

        return message

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
    print("Init")
    obj = TwitterBot()
    print("running")
    obj.run()
