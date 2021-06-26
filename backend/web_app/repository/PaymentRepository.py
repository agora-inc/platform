from mailing.sendgridApi import sendgridApi
from datetime import datetime, timedelta
from app.databases import agora_db

mail_sys = sendgridApi()

class PaymentRepository:
    def __init__(self, db=agora_db, mail_sys=mail_sys):
        self.db = db
        self.mail_sys = mail_sys

        # self.channels = ChannelRepository(db=db)
        # self.tags = TagRepository(db=self.db)
        # self.topics = TopicRepository(db=self.db)
        # self.institutions = InstitutionRepository(db=self.db)
        # self.email_reminders = EmailRemindersRepository(db=self.db)

    def addPayment(self, channel_id, plan, mode, aud_size, payment_id):
        pass

    def getPaymentsForChannel(self):
        pass
