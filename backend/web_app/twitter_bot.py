# import hack (Remy); TODO: make import directly from repository folder.
from logging import exception
from os import name
from app.routes import TalkRepository, TwitterBotRepository, TopicRepository
import tweepy
import json
import random
import datetime

# HYPERPARAMS FOR TWEETING
MINIMUM_CLICKCOUNT = 3
MAX_DAYS_IN_ADVANCE = 5
MAX_REMINDER_MINUTES_BEFORE = 180

# NOTE: 100 API calls PER 15 minutes in total regardless of which Twitter applications you use.
# https://developer.twitter.com/en/docs/twitter-api/rate-limits

# POSTS limit:
# - every 15 minutes: 50
# - every 3 hours: 300
# FOLLOWS limit: 
# - every 15 minutes: 30
# - every 24 hours: 100
# UNFOLLOW limit: 
# - every 15 minutes: 50
# - every 24 hours: 500
# RETWEET limit:
# - every 15 minutes: 50
# - everyt 3 hours: 300


TWITT_CONS_KEY = "D4zmrvANW7FnvBMrtPfWgeUXR"
TWITT_CONS_KEY_SEC = "kdc38sf10nZOEPNhELZqPAVwThaD0V0uxTauo4zGtzNv8dvcj8"
TWITT_ACCESS_TOKEN = "1367790358659272704-okNKmUOJ9ACco8AedEkq7ZsgkDpAYF"
TWITT_ACCESS_TOKEN_SEC = "6TjP6BjBF79oYQQIHGHZZoqkDnpTdIde6l9kt7hzan2l9"
TWITT_BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAP48VQEAAAAAv5HzJKbUiH8tUZEvLhUmUVvjO9g%3D9lHuVJgqrKbHK2TGiR3cwXbTKAwA6iK912gd0x5s1N080sMFXX"
TWITTER_HASHTAGS_JSON_PATH = "/home/cloud-user/plateform/agora/backend/twitter_bot/hashtags_per_id.json"



class TwitterBot:
    def __init__(self):
        self.tweets = TwitterBotRepository.TwitterBotRepository()
        self.talks = TalkRepository.TalkRepository()
        self.topics = TopicRepository.TopicRepository()
        self.hashtags_per_id = {}
        self.api_call_post = 0
        self.api_call_follow = 0
        self.api_call_unfollow = 0

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
            wait_on_rate_limit=False
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
            # self._rebalance_remaining_api_calls()
            self.post_tweets()
            self.follow_in_mass()
            self.mass_unfollow()

        except Exception as e:
            print(e)

    def _rebalance_remaining_api_calls(self):
        # https://developer.twitter.com/en/docs/twitter-api/rate-limits
        # self.api_call_post = 0
        # self.api_call_follow = 0
        # self.api_call_unfollow = 0
        pass

    def post_tweets(self):
        talks = self.tweets.getIncomingTalksToTweet(MINIMUM_CLICKCOUNT, MAX_DAYS_IN_ADVANCE)

        print(f"List of talks to tweet: {talks}")
        n_calls = 0 
        for talk in talks:
            if n_calls < 50:
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

                # check if happening within the next MAX_REMINDER_MINUTES_BEFORE minutes
                start_time = talk["date"] # format: 2021-11-23 15:00:00
                minutes_until_it_starts = (start_time - datetime.datetime.now()).total_seconds() // 60
                talk_happens_soon = (minutes_until_it_starts < MAX_REMINDER_MINUTES_BEFORE) and (0 < minutes_until_it_starts)

                # Send reminder if happens soon
                if talk_happens_soon:
                    try:
                        reminder_already_sent = self.tweets.hasReminderAlreadyBeenSent(talk_id)
                        if not reminder_already_sent:
                            message = self.get_twitter_message("reminder", talk_id, talk_name, channel_name, speaker_name, date, talk_topics_list, speaker_university=None, speaker_hashtag=None)
                            print(f"reminder nr {n_calls}")
                            self.twitter_api.update_status(message)
                            self.tweets.updateTweetSendingStatus("remind", success=True, talk_id=talk_id, params={"exec_time": datetime.datetime.now()})
                            print("Posted")
                    except Exception as e:
                        print(f"Exception: {e}")
                        self.tweets.updateTweetSendingStatus("remind", success=False, talk_id=talk_id, error_msg=e)
                # General advertisement if far
                else:
                    try:
                        message = self.get_twitter_message("advertisement", talk_id, talk_name, channel_name, speaker_name, date, talk_topics_list, speaker_university=None, speaker_hashtag=None)
                        print(f"advertisement nr {n_calls}")
                        print(message)
                        self.twitter_api.update_status(message)
                        self.tweets.updateTweetSendingStatus("advertise", True, talk_id=talk_id)
                
                    except Exception as e:
                        print(f"exception yo: {e}")
                        self.tweets.updateTweetSendingStatus("advertise", success=False, talk_id=talk_id, error_msg=e)

                print(message)
            
            else:
                break


    def get_twitter_message(self, event_type, talk_id: int, talk_name: str, channel_name: str, speaker_name: str, date: datetime, topic_ids: list, speaker_university=None, speaker_hashtag=None):
        # human_readable_date (TODO)
        event_url = f"https://mora.stream/event/{talk_id}"
        hashtags_string = " "
        for topic_id in topic_ids:
            if topic_id in self.hashtags_per_id:
                hashtags_string += f"#{self.hashtags_per_id[topic_id]} "
        
        # fetch topic_id (first one only)
        if len(topic_ids) != 0:
            topic_string = self.topics.getFieldFromId(topic_ids[-1])[0]["field"]


        hashtags_string += "#academicTwitter #seminars"
        
        # Enforce hashtag instead of name if given
        if speaker_hashtag is not None:
            speaker_name = speaker_hashtag


        # Human readable date
        minutes_before_start = (datetime.datetime.now() - date).seconds // 60
        hour_plus_timezone = datetime.datetime.strftime(date, "%H:%M GMT")
        talk_day = datetime.datetime.strftime(date, "%A, %d %B")

        got_a_admissible_message = False
        trial = 0
        MAX_NUMBER_TRIAL = 20
        while not got_a_admissible_message:
            try:
                if trial > MAX_NUMBER_TRIAL:
                    return ""

                if event_type == "advertisement":
                    message = random.choice([
                        f"Don’t miss out on your chance to listen to {speaker_name} as part of the {channel_name}. Registrations are free and open!",
                        # f"{speaker_name} is giving a talk on '{talk_name}' as part of {channel_name}. Add this event to your calendar",
                        # f"{speaker_name} is giving a talk entitled '{talk_name}' as part of the {channel_name}. Register now!",
                        f"Check out {speaker_name}’s talk hosted by the '{channel_name}' and happening soon!",
                        f"{speaker_name} will discuss '{talk_name}' at {channel_name} on {talk_day} at {hour_plus_timezone}.",
                        f"Don't miss out on {speaker_name}’s talk!",
                        f"Check out {speaker_name}'s talk as part of {channel_name} on {talk_day} at {hour_plus_timezone}!",
                        f"One of the most trending seminars on @morastream this week has been the one by {speaker_name} on '{talk_name}': don't miss out!",
                        f"The most trending talk on @morastream at the moment is '{talk_name}' organised by the {channel_name}. Be sure to check it out! 👥",
                        f"Among the mass of incoming seminars, this one by {speaker_name} on '{talk_name}' has been experiencing a huge number of clicks! Join the mass by adding this event in your calendar! 👥",
                        f"Hot this week 🔥🔥: '{talk_name}' given by {speaker_name} within the '{channel_name}' agora!",
                        f"The '{channel_name}' is hosting a talk on '{talk_name}' which has been recently trending! Have a look!",
                        f"Don't miss out on {speaker_name}’s talk on {talk_day}!",
                        f"On {talk_day}, {speaker_name} will discuss '{talk_name}' at agora_name on {talk_day} at {hour_plus_timezone} 🚀!",
                        f"Don't miss out on {speaker_name}’s talk!",
                        f"Many people have already signed up for {speaker_name}’s talk on '{talk_name}' happening on {talk_day}. Don't miss out!",
                        f"Don't miss out on {speaker_name}’s talk eyes_emoji!",
                        f"Don’t miss out on your chance to listen to {speaker_name} 🚀!",
                        f"Don’t miss out on your chance to listen to {speaker_name} from speaker_university!",
                        f"Don’t miss out on your chance to listen to {speaker_name} at speaker_university 🚀!",
                        f"Looking to hear out about some of the latest advancements in {topic_string}? Come listen to {speaker_name}'s talk on {talk_day} at {hour_plus_timezone}!",
                        f"Save the date for {speaker_name}'s talk on {talk_day}! Calendar_emoji",
                        f"Trending seminar of the week: '{talk_name}' given by {speaker_name} within the '{channel_name}' series: have a look!",
                        f"Trending seminar of the week: '{talk_name}' given by {speaker_name} within the '{channel_name}' series: feel free to join!",
                        f"Trending seminar of the week: '{talk_name}' given by {speaker_name} within the '{channel_name}' series: do not miss it out!",
                        f"Trending seminar of the week: '{talk_name}' given by {speaker_name} within the '{channel_name}' series: register with the link down below!",
                        f"One of the most trending talk on mora this week is happening on {talk_day} at {hour_plus_timezone}! Check it out 🚀!",
                        f"One of the most trending talk on mora this week is happening on {talk_day} at {hour_plus_timezone}, thanks to '{channel_name}'! Check it out 🚀!",

                        # OLD SENTENCES:
                        # f"The '{channel_name}' seminar serie has a great line up for the next few weeks! {speaker_name} will discuss talk_subtopic on talk_date!",
                        # f"Want to learn more about talk_topic? speaker_name will be giving a talk on talk_subtopic talk_date as part of {channel_name}.",
                        # f"{speaker_name}, who spoke speaker_last_talk_date on mora, is back for a new talk!",
                        # f"Learn more about talk_subtopic on {date}! speaker_name is giving a seminar as part of {channel_name}.",
                        # f"Learn more about talk_subtopic on {date} with speaker_name.",
                        # f"Learn more about talk_subtopic on {date}! speaker_name is giving a seminar as part of {channel_name}.",
                        # f"Check out {speaker_name}’s talk as part of agora_name on talk_date!",
                        # f"Check out {speaker_name}'s' talk as part of {channel_name} on {talk_day} 🚀!",
                        # f"{channel_name} has a great line up for the next few weeks! {speaker_name} will discuss talk_subtopic on talk_date!",
                        # f"Save the date for {speaker_name}'s talk on talk_date!",
                    ])

                elif event_type == "reminder":
                    # Time remaining before it starts
                    if (datetime.datetime.now() - date).seconds // 60 > 59:
                        n_hours = (datetime.datetime.now() - date).seconds // 3600
                        time_before_it_starts = str(n_hours) + " hour"
                        if n_hours > 1:
                            time_before_it_starts += "s"

                    else:
                        time_before_it_starts = str((datetime.datetime.now() - date).seconds // 60) + " minutes"
 
                    message = random.choice([
                        f"Don't miss out on your chance to listen to {speaker_name}: it's happening in {time_before_it_starts}!",
                        f"Grab yourself a tea or coffee ☕☕ and come listen to {speaker_name} who is about to start talking about '{talk_name}'!",
                        f"{speaker_name} is giving a talk starting in {time_before_it_starts} on '{talk_name}'!"
                        f"Check out {speaker_name}'s talk as part of {channel_name}! Starting very soon!",
                        f"{speaker_name} is discussing '{talk_name}' in {time_before_it_starts}!",
                        f"Happening in {time_before_it_starts}: {speaker_name} talking about '{talk_name}'. Don't miss that out!",
                        f"Want to hear about the lattest trends in {topic_string}? Join us to hear {speaker_name} talk on '{talk_name}' in {time_before_it_starts}!"
                    ])

                if len(message) < 140: # Twitter limit
                    got_a_admissible_message = True

                print(message)
                
            except Exception as e:
                print(f"Error in finding message: {e}")

        return message + f" https://mora.stream/event/{talk_id}" + hashtags_string

    def _track_status_tweet(self, sent: str, error_message: str):
        raise NotImplementedError

    def _notify_error(self, error):
        raise NotImplementedError()

    def follow_in_mass(self, mode="selected_follower_base"):
        assert(mode in ["followers_of_followers", "selected_follower_base"])
        bot_will_follow = True

        # Follow the followers of our followers that do not follow us
        n_follows = 0
        if mode == "followers_of_followers":
            try:
                print("Retrieving and following followers")
                for follower_id in tweepy.Cursor(self.twitter_api.get_follower_ids).items():
                    sub_followers = list(self.twitter_api.get_followers(user_id=follower_id))
                    sub_followers.reverse()
                    for sub_follower in sub_followers:
                        # NB: 136779035865927270 is the id of mora.stream account
                        if not sub_follower.following and sub_follower.id != 1367790358659272704 and bot_will_follow:
                            self.twitter_api.create_friendship(id=sub_follower.id)
                            print("Following: ", sub_follower.name)
                            n_follows += 1
                        elif sub_follower.id != 1367790358659272704 and bot_will_follow:
                            print("Already following: ", sub_follower.name)
        
            except Exception as e:
                print("(follow_in_mass). Error:", e)
                print(f"Followed {n_follows} users.")

        # Follow the followers of hardcoded users
        elif mode == "selected_follower_base":
            profile_username = random.choice([
                # AI people
                "gabrielpeyre",
                "PetarV_93",
                "ylecun",
                "mmbronstein",
                "hugo_larochelle",
                "thomaskipf",#

                # MISCELLANEOUS
                "cassyniapp",
            ])

            follower_ids = self.twitter_api.get_follower_ids(screen_name=profile_username)
            our_follower_ids = self.twitter_api.get_follower_ids(screen_name="morastream")

            for follower_id in follower_ids:
                # NB: 136779035865927270 is the id of morastream account
                if follower_id != 1367790358659272704 and follower_id not in our_follower_ids and bot_will_follow:
                    try:
                        self.twitter_api.create_friendship(id=follower_id)
                        print("Following: ", follower_id)
                        n_follows += 1

                    except Exception as e:
                        if e == '''403 Forbidden
                            161 - You are unable to follow more people at this time. Learn more <a href='http://support.twitter.com/articles/66885-i-can-t-follow-people-follow-limits'>here</a>.''':
                            print("Stop following due to rates reached: ", e)
                            bot_will_follow = False

        if n_follows != 0:
            self.tweets.updateTweetSendingStatus("follow", True, params={"count": n_follows})


    def get_followers(self, username):
        users = []
        for i, user in enumerate(tweepy.Cursor(self.twitter_api.get_followers, username=username, count=200).pages()):
            print(f'Getting page {i} for followers')
            users += user
        return users

    def mass_unfollow(self):
        # Unfollow everybody following us
        try:
            print("Retrieving and unfollowing followers")
            n_unfollow = 0

            # get list inversed (oldest following to new)
            followers = list(tweepy.Cursor(self.twitter_api.get_followers).items())
            followers.reverse()
            for follower in followers:
                self.twitter_api.destroy_friendship(screen_name=follower.screen_name, id=follower.id)
                print("Unfollowed ", follower.name)
                n_unfollow += 1

        except Exception as e:
            print("(Unfollow_in_mass). Error:", e)
        print(f"Unfollowed {n_unfollow} users.")

        # Logs
        if n_unfollow != 0:
            self.tweets.updateTweetSendingStatus("unfollow", True, params={"count": n_unfollow})

    def retweet(self):
        raise NotImplementedError

    def thankNewFollowers(self):
        raise NotImplementedError


if __name__ == "__main__":
    print("Init")
    obj = TwitterBot()
    print("running")
    obj.run()
