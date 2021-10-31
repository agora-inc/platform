MINIMUM_CLICKCOUNT = 20
MAX_DAYS_IN_ADVANCE = 5
TWITT_API_KEY = ""

class TwitterPostBot:
    def __init__(self):
        self.twitterApiKey = TWITT_API_KEY
        self.twitterApi = None

    def run(self):
        talks = self.get_talks_to_tweet(MINIMUM_CLICKCOUNT, MAX_DAYS_IN_ADVANCE)

        for talk in talks:
            try:
                self.post_tweet(talk)
                self.track_status_tweet(talk, sent=False)
            except Exception as e:
                self.track_status_tweet(talk, sent=True, error_message=e)


    def post_tweet(self):
        text = self.get_twitter_message()
        self.twitterApi.send(text)

    def send_error_message(self):
        pass

    @staticmethod
    def get_twitter_message():
        # READ json of hashtags
        pass

    def get_talks_to_tweet(self, minimum_clickcount, max_days_in_advance):
        # Twitting talks 
        pass

    def track_status_tweet(self, sent, error_message):
        pass

    def notify_error(self, error):
        raise NotImplementedError()


if __name__ == "__main__":
    obj = TwitterPostBot()
    obj.run()