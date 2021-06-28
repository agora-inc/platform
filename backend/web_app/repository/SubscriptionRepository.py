# from repository.ChannelRepository import ChannelRepository
# from repository.TagRepository import TagRepository
# from repository.TopicRepository import TopicRepository
# from repository.InstitutionRepository import InstitutionRepository
# from repository.EmailRemindersRepository import EmailRemindersRepository
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

    def addStreamingSubscription(self, channel_id, payment_id):
        add_query = f'''
            INSERT INTO Subscriptions(
                start_time,
                end_time,
                channel_id,
                product_id,
                status
            )
            VALUES (
                NOW(),
                DATE_ADD(NOW(), INTERVAL 1 MONTH),
                {channel_id},
                product_id,
                "active"
            )
            ;
        '''
        try: 
            self.db.run_query(extension_query)
            return "ok"
        except Exception as e:
            return str(e)


    def extendStreamingSubscriptionByOneMonth(self, channel_id):
        extension_query = f'''
            UPDATE Subscriptions
            SET end_time = DATE_ADD(NOW(), INTERVAL 1 MONTH)
            WHERE (
                channel_id = {channel_id}
                )
            ;
        '''
        try: 
            self.db.run_query(extension_query)
            return "ok"
        except Exception as e:
            return str(e)

    def changeStreamingSubscription(self, channel_id, product_id):
        change_query = f'''
            UPDATE Subscriptions
            SET end_time = DATE_ADD(NOW(), INTERVAL 1 MONTH)
            AND product_id = {product_id}
            WHERE (
                channel_id = {channel_id}
                )
            ;
        '''
        try: 
            self.db.run_query(extension_query)
            return "ok"
        except Exception as e:
            return str(e)

    def stopSubscription(self, channel_id):
        stop_query = f'''
            UPDATE Subscriptions
            SET status = "interrupted"
            WHERE (
                channel_id = {channel_id}
                )
            ;
        '''
        try: 
            self.db.run_query(stop_query)
            return "ok"
        except Exception as e:
            return str(e)
