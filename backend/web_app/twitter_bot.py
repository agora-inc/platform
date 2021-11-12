# import hack (Remy); TODO: make import directly from repository folder.
from logging import exception
from app.routes import TalkRepository
from app.routes import TwitterBotRepository
from app.databases import agora_db
import tweepy
import json
import random

# HYPERPARAMS FOR TWEETING
MINIMUM_CLICKCOUNT = 3
MAX_DAYS_IN_ADVANCE = 5
REMINDER_MINUTES_BEFORE = 15

# NOTE: 100 API calls PER HOUR in total regardless of which Twitter applications you use.
API_CALLS_FOR_TWEETS = 10
API_CALLS_FOR_FOLLOW = 50
API_CALLS_FOR_UNFOLLOW = 50

TWITT_CONS_KEY = "D4zmrvANW7FnvBMrtPfWgeUXR"
TWITT_CONS_KEY_SEC = "kdc38sf10nZOEPNhELZqPAVwThaD0V0uxTauo4zGtzNv8dvcj8"
TWITT_ACCESS_TOKEN = "1367790358659272704-okNKmUOJ9ACco8AedEkq7ZsgkDpAYF"
TWITT_ACCESS_TOKEN_SEC = "6TjP6BjBF79oYQQIHGHZZoqkDnpTdIde6l9kt7hzan2l9"
TWITT_BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAP48VQEAAAAAv5HzJKbUiH8tUZEvLhUmUVvjO9g%3D9lHuVJgqrKbHK2TGiR3cwXbTKAwA6iK912gd0x5s1N080sMFXX"
TWITTER_HASHTAGS_JSON_PATH = "/home/cloud-user/plateform/agora/backend/twitter_bot/hashtags_per_id.json"


class TwitterBot:
    def __init__(self, db=agora_db):
        self.db = db
        self.tweets = TwitterBotRepository.TwitterBotRepository()
        self.talks = TalkRepository.TalkRepository(db=db)
        self.hashtags_per_id = {}
        self.api_call = 0

        self._load_mapping()
        self.twitter_api = self._create_api()
        self.twitter_client = tweepy.Client(
            bearer_token=TWITT_BEARER_TOKEN, 
            consumer_key=TWITT_CONS_KEY, 
            consumer_secret=TWITT_CONS_KEY_SEC, 
            access_token=TWITT_ACCESS_TOKEN, 
            access_token_secret=TWITT_ACCESS_TOKEN_SEC
        )

    def _create_api(self):
        # Authenticate to Twitter
        auth = tweepy.OAuthHandler(TWITT_CONS_KEY, TWITT_CONS_KEY_SEC)
        auth.set_access_token(TWITT_ACCESS_TOKEN, TWITT_ACCESS_TOKEN_SEC)

        # Create API object
        api = tweepy.API(
            auth,
            # wait_on_rate_limit=True
            )
        try:
            api.verify_credentials()
            print("Authentication OK")
        except Exception as e:
            raise ConnectionError(f"Error during authentication {e}")
        return api

    def _load_mapping(self):
        with open(TWITTER_HASHTAGS_JSON_PATH, "r") as twitter_hashtags:
            self.hashtags_per_id = json.load(twitter_hashtags)

    def run(self):
        try:
            # rates = self.twitter_api.rate_limit_status()["resources"]
            # print("yes:", rates)
            # A. Post talks
            # self.post_tweets()
            
            # # B. Unfollow / Follow
            self.follow_in_mass()
            self.mass_unfollow()

        except Exception as e:
            print(e)


    def post_tweets(self):
        talks = self.tweets.getIncomingTalksToTweet(MINIMUM_CLICKCOUNT, MAX_DAYS_IN_ADVANCE)

        n_calls = 0 
        for talk in talks:
            if n_calls < API_CALLS_FOR_TWEETS:
                n_calls += 1
                talk_id = talk["id"]
                talk_name = talk["name"]
                channel_name = talk["channel_name"]
                speaker_name = talk["talk_speaker"]
                date = talk["date"]
                talk_topics_list = []
                for key in ["topic_1_id", "topic_2_id", "topic_3_id"]:
                    topic_id = talk[key]
                    if topic_id != 0:
                        talk_topics_list.append(topic_id)
                text = self.get_twitter_message(talk_id, talk_name, channel_name, speaker_name, date, talk_topics_list)
                # 1. Advertise
                try:
                    # self.twitter_api.send(FILL THIS UP)
                    # self.tweets.updateTweetSendingStatus("advertise", talk_id, True)
                    pass
            
                except Exception as e:
                    print(f"exception yo: {e}")
                    self.tweets.updateTweetSendingStatus("advertise", talk_id, success=False, error_message=e)

                # 2. Remind N minutes before the start
                try:
                    exec_time = talk["date"]
                    print("date") 
                    print(exec_time) 
                    # self.twitter_api.send(FILL THIS UP)
                    self.tweets.updateTweetSendingStatus("remind", talk_id, True, params={"exec_time": exec_time})
            
                except Exception as e:
                    print(f"exception yo: {e}")
                    self.tweets.updateTweetSendingStatus("remind", talk_id, success=False, error_message=e)

    def get_twitter_message(self, talk_id: int, talk_name: str, channel_name: str, speaker_name: str, date: str, topic_ids: list):
        # human_readable_date (TODO)
        event_url = f"https://mora.stream/event/{talk_id}"
        hashtags_string = " "
        for topic_id in topic_ids:
            if topic_id in self.hashtags_per_id:
                hashtags_string += f"#{self.hashtags_per_id[topic_id]} "
        hashtags_string += " #academicTwitter"
        
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

        # Check Twitter char limit.
        #
        #
        #
        return message

    def _track_status_tweet(self, sent: str, error_message: str):
        raise NotImplementedError

    def _notify_error(self, error):
        raise NotImplementedError()

    def follow_in_mass(self):
        # Follow the followers of our followers that do not follow us
        try:
            print("Retrieving and following followers")
            n_calls = 0
            for follower_id in tweepy.Cursor(self.twitter_api.get_follower_ids).items():
                for sub_follower in self.twitter_api.get_followers(user_id=follower_id, count=5):
                    print("in")
                    if n_calls < API_CALLS_FOR_TWEETS:
                        n_calls += 1
                        if not sub_follower.following:
                            self.twitter_api.create_friendship(id=sub_follower.id)
                            print("Followed ", sub_follower.name)
                    else:
                        break
        except Exception as e:
            print("(follow_in_mass). Error:", e)

        print(f"Followed {n_calls} users.")


    def mass_unfollow(self):
        # Unfollow everybody following us
        try:
            print("Retrieving and unfollowing followers")
            n_calls = 0

            # get list inversed (oldest following to new)
            for follower in tweepy.Cursor(self.twitter_api.get_followers(cursor=2)).items():
                if n_calls < API_CALLS_FOR_TWEETS:
                    n_calls += 1
                    self.twitter_api.destroy_friendship(screen_name=follower.screen_name, id=follower.id)
                    print("Unfollowed ", follower.name)

        except Exception as e:
            print("(Unfollow_in_mass). Error:", e)
        print(f"Unfollowed {n_calls} users.")



if __name__ == "__main__":
    print("Init")
    obj = TwitterBot()
    print("running")
    obj.run()
