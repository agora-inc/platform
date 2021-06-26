# from repository.ChannelRepository import ChannelRepository
# from repository.TagRepository import TagRepository
# from repository.TopicRepository import TopicRepository
# from repository.InstitutionRepository import InstitutionRepository
# from repository.EmailRemindersRepository import EmailRemindersRepository
from repository.PaymentRepository import PaymentRepository

from mailing.sendgridApi import sendgridApi
from datetime import datetime, timedelta
from app.databases import agora_db

mail_sys = sendgridApi()

class SubscriptionRepository:
    def __init__(self, db=agora_db, mail_sys=mail_sys):
        self.db = db
        self.mail_sys = mail_sys

        # self.channels = ChannelRepository(db=db)
        # self.tags = TagRepository(db=self.db)
        # self.topics = TopicRepository(db=self.db)
        # self.institutions = InstitutionRepository(db=self.db)
        # self.email_reminders = EmailRemindersRepository(db=self.db)

    def addSubscription(self, channel_id, plan, aud_size, payment_id):

        pass

    def removeSubscription(self):
        pass

    def checkIfSubscriptionHasBeenPaid(self, channel_id):
        # query stripe to check that
        pass
