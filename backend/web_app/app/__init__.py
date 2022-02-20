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


# initialise app object
app = Flask(__name__)
CORS(app)

# initialise repository objects and add to app
app.channel_repo = ChannelRepository.ChannelRepository()
app.channel_sub_repo = ChannelSubscriptionRepository.ChannelSubscriptionRepository()
app.credit_repo = CreditRepository.CreditRepository()
app.email_reminders_repo = EmailRemindersRepository.EmailRemindersRepository()
app.invited_users_repo = InvitedUsersRepository.InvitedUsersRepository()
app.mailing_repo = MailingListRepository.MailingListRepository()
app.payments_repo = PaymentHistoryRepository.PaymentHistoryRepository()
app.products_repo = ProductRepository.ProductRepository()
app.profile_repo = ProfileRepository.ProfileRepository()
app.questions_repo = QandARepository.QandARepository()
app.user_repo = UserRepository.UserRepository()
app.scraper_repo = RSScraperRepository.RSScraperRepository()
app.search_repo = SearchRepository.SearchRepository()
app.stream_repo = StreamRepository.StreamRepository()
app.tag_repo = TagRepository.TagRepository()
app.talk_repo = TalkRepository.TalkRepository()
app.twitter_bot_repo = TwitterBotRepository.TwitterBotRepository()
app.topic_repo = TopicRepository.TopicRepository()
app.video_repo = VideoRepository.VideoRepository()

# initialise mail
app.config["MAIL_SERVER"] = "smtp.office365.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USERNAME"] = "team@agora.stream"
app.config["MAIL_PASSWORD"] = "123.qwe.asd"
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USE_SSL"] = False
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
