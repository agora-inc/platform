from mailing.sendgridApi import sendgridApi
from datetime import datetime, timedelta
from app.databases import agora_db

mail_sys = sendgridApi()

class PaymentHistoryRepository:
    def __init__(self, db=agora_db, mail_sys=mail_sys):
        self.db = db
        self.mail_sys = mail_sys

        # self.channels = ChannelRepository(db=db)
        # self.tags = TagRepository(db=self.db)
        # self.topics = TopicRepository(db=self.db)
        # self.institutions = InstitutionRepository(db=self.db)
        # self.email_reminders = EmailRemindersRepository(db=self.db)

    def addPayment(self, user_id, status, stripe_payment_id):
        # get productId associated with the stripe_product_id





        #
        add_query = f'''
            INSERT INTO PaymentHistory(
                stripe_id,
                user_id,
                status,
                stripe_payment_id
            )
            VALUES (
                stripe_id,
                {user_id},
                {channel_id},
                "active",
                {stripe_payment_id}
            )
            ;
        '''
        try: 
            self.db.run_query(extension_query)
            return "ok"
        except Exception as e:
            return str(e)


    def getPaymentsForChannelWithin(self):
        pass
