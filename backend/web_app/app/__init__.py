import datetime
import logging

from flask import Flask
from flask_mail import Mail
from flask_cors import CORS

from repository import (
    ChannelRepository,
    ChannelSubscriptionRepository,
    CreditRepository,
    EmailRemindersRepository,
    InvitedUsersRepository,
    MailingListRepository,
    PaymentHistoryRepository,
    ProductRepository,
    ProfileRepository,
    QandARepository,
    UserRepository,
    RSScraperRepository,
    SearchRepository,
    StreamRepository,
    TagRepository,
    TalkRepository,
    TwitterBotRepository,
    TopicRepository,
    VideoRepository,
)


class MoraApp(Flask):
    def __init__(self, import_name):
        Flask.__init__(self, import_name)

        # initialise repository objects
        self.channel_repo = ChannelRepository.ChannelRepository()
        self.channel_sub_repo = (
            ChannelSubscriptionRepository.ChannelSubscriptionRepository()
        )
        self.credit_repo = CreditRepository.CreditRepository()
        self.email_reminders_repo = EmailRemindersRepository.EmailRemindersRepository()
        self.invited_users_repo = InvitedUsersRepository.InvitedUsersRepository()
        self.mailing_repo = MailingListRepository.MailingListRepository()
        self.payments_repo = PaymentHistoryRepository.PaymentHistoryRepository()
        self.products_repo = ProductRepository.ProductRepository()
        self.profile_repo = ProfileRepository.ProfileRepository()
        self.questions_repo = QandARepository.QandARepository()
        self.user_repo = UserRepository.UserRepository()
        self.scraper_repo = RSScraperRepository.RSScraperRepository()
        self.search_repo = SearchRepository.SearchRepository()
        self.stream_repo = StreamRepository.StreamRepository()
        self.tag_repo = TagRepository.TagRepository()
        self.talk_repo = TalkRepository.TalkRepository()
        self.twitter_bot_repo = TwitterBotRepository.TwitterBotRepository()
        self.topic_repo = TopicRepository.TopicRepository()
        self.video_repo = VideoRepository.VideoRepository()

        # initialise mail config
        self.config["MAIL_SERVER"] = "smtp.office365.com"
        self.config["MAIL_PORT"] = 587
        self.config["MAIL_USERNAME"] = "team@agora.stream"
        self.config["MAIL_PASSWORD"] = "123.qwe.asd"
        self.config["MAIL_USE_TLS"] = True
        self.config["MAIL_USE_SSL"] = False


# create app object
app = MoraApp(__name__)
CORS(app)

# create mail object
mail = Mail(app)

# logging.basicConfig(
#     filename="agora.log",
#     level=logging.DEBUG,
#     format="%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s",
# )
logging.basicConfig(
    filename=f"/home/cloud-user/logs/{datetime.datetime.utcnow().isoformat()[:10]}.log",
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s",
)

from routes import *
