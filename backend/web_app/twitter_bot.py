# import hack (Remy); TODO: make import directly from repository folder.
from app.routes import TalkRepository, authenticate
from app.routes import TwitterBotRepository
from app.databases import agora_db
import tweepy
import json
import random

MINIMUM_CLICKCOUNT = 3
MAX_DAYS_IN_ADVANCE = 5
REMINDER_MINUTES_BEFORE = 15


TWITT_CONS_KEY = "vrlWLkldnc7vsbYLTgkBv6wHv"
TWITT_CONS_KEY_SEC = "WbaQERpKxVBCHdKxDepVxCYVQ8dnNoz58vbY4DEbl93WG4J9v0"
TWITT_ACCESS_TOKEN = "1367790358659272704-FvOHuZRFvwkZRXxkft02QioEDPK9LR"
TWITT_ACCESS_TOKEN_SEC = "NFMXeCpBI7MyGJCpqtRSiUNEoZJ8rAE3LsNwvM3iVi4mv"

TWITTER_HASHTAGS_JSON_PATH = "/home/cloud-user/plateform/agora/backend/twitter_bot/hashtags_per_id.json"



class TwitterBot:
    def __init__(self, db=agora_db):
        self.db = db
        self.tweets = TwitterBotRepository.TwitterBotRepository()
        self.talks = TalkRepository.TalkRepository(db=db)
        self.hashtags_per_id = {}

        self._load_mapping()
        self.twitter_api = self._create_api()

    def _create_api(self):
        # Authenticate to Twitter
        auth = tweepy.OAuthHandler(TWITT_CONS_KEY, TWITT_CONS_KEY_SEC)
        auth.set_access_token(TWITT_ACCESS_TOKEN, TWITT_ACCESS_TOKEN_SEC)

        # Create API object
        api = tweepy.API(
            auth)
            # wait_on_rate_limit=True)
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
        # A. Post talks
        # self.post_tweets()

        # # B. Unfollow / Follow
        self.follow_in_mass()
        # self.mass_unfollow()

    def post_tweets(self):
        talks = self.tweets.getIncomingTalksToTweet(MINIMUM_CLICKCOUNT, MAX_DAYS_IN_ADVANCE)
        print(talks)
        for talk in talks:
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
        print("Retrieving and following followers")
        for follower in tweepy.Cursor(self.twitter_api.get_followers).items():
            print("yes,letsgo")
            follower.follow()
            if not follower.following:
                print("followed ", follower.name)


    def mass_unfollow(self):
        raise NotImplementedError
        # # hits_left = self.twitter_api.rate_limit_status()
        # # print("yoyo")
        # # print(hits_left)['remaining_hits']
        # # print("You can unfollow " + str(hits_left) + " people this hour...\n")
        # print("Checking who doesn't follow you back. This will take a minute.\n")
        # # first, create some lists to hold the followers
        # followers = []
        # friends = []

        # # we have to use a Cursor for pagination purposes
        # for follower in tweepy.Cursor(self.twitter_api.followers).items():
        #     followers.append(follower)


        # for friend in tweepy.Cursor(self.twitter_api.friends).items():
        #     friends.append(friend)

        # # create a non_reciprocals list, these are non-followers (set - set)
        # non_reciprocal = list(set(friends) - set(followers))
        # print(str(len(non_reciprocal)) + " non-reciprocal followers.\n")

        # # count the number of people we unfollow, just for fun
        # counter = 0
        # for i in non_reciprocal:
        #     # if hits_left > 0:
        #     self.twitter_api.destroy_friendship(i.screen_name)
        #     print("Successfully unfollowed " + i.screen_name)
        #     hits_left -= 1
        #     # else:
        #     #     print("You ran out of hits! Try again in an hour!")

        #     counter += 1
        #     print("You unfollowed " + str(counter) + " people!\n")
        #     print("Now returning to the Main Menu.")
        # else:
        #     print("Returning to the Main Menu...\n")


if __name__ == "__main__":
    print("Init")
    obj = TwitterBot()
    print("running")
    obj.run()
