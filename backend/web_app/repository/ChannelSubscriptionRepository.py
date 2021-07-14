# from repository.ChannelRepository import ChannelRepository
# from repository.TagRepository import TagRepository
# from repository.TopicRepository import TopicRepository
# from repository.InstitutionRepository import InstitutionRepository
# from repository.EmailRemindersRepository import EmailRemindersRepository
from mailing.sendgridApi import sendgridApi
from datetime import datetime, timedelta
from app.databases import agora_db
from payment.apis.StripeApi import StripeApi 

stripeApi = StripeApi()
mail_sys = sendgridApi()

class ChannelSubscriptionRepository:
    def __init__(self, db=agora_db, mail_sys=mail_sys):
        self.db = db
        self.mail_sys = mail_sys

        # self.channels = ChannelRepository(db=db)
        # self.tags = TagRepository(db=self.db)
        # self.topics = TopicRepository(db=self.db)
        # self.institutions = InstitutionRepository(db=self.db)
        # self.email_reminders = EmailRemindersRepository(db=self.db)

    def getActiveSubscriptionId(self, channel_id, product_id):
        get_query = f'''SELECT * FROM ChannelSubscriptions
                    WHERE status="active"
                        AND channel_id = {channel_id}
                        AND product_id = {product_id};
        '''
        return self.db.run_query(get_query)

    def getActiveSubscriptions(self, channelId):
        get_query = f'''SELECT * FROM ChannelSubscriptions
                    WHERE status="active"
                    AND channel_id = {channelId};
        '''
        return self.db.run_query(get_query)
        
    def updateSubscriptionStatus(self, status, channel_subscription_id=None, stripe_subscription_id=None):
        try:
            if stripe_subscription_id is not None:
                update_query = f'''
                    UPDATE ChannelSubscriptions
                    SET status="{status}", last_change = NOW()
                    WHERE stripe_subscription_id = "{stripe_subscription_id}";                    ;
                '''
                self.db.run_query(update_query)
                return "ok"
            elif channel_subscription_id is not None:
                update_query = f'''
                    UPDATE ChannelSubscriptions
                    SET status="{status}", last_change = NOW()
                    WHERE id = {channel_subscription_id};
                '''
                self.db.run_query(update_query)
                return "ok"
        except Exception as e:
            return str(e)

    def interruptSubscription(self, subscription_id):
        try: 
            stop_query = f'''
                UPDATE ChannelSubscriptions
                SET status = "interrupted", last_change = NOW()
                WHERE stripe_subscription_id = "{subscription_id}";
            '''
            self.db.run_query(stop_query)
            return "ok"
        except Exception as e:
            return str(e)

    ################################
    # Backend Stripe only methods  #
    ################################
    def _addCheckoutSubscription(self, product_id, checkout_session, channel_id, user_id):
        '''
            Add subscription for channel_id in "checkout" status 
            (Necessary so that channel_id and user_id can retrieved later in the stripe webhook)
        '''
        # Adds line in DB (status will be updated on payment)
        add_query = f'''
            INSERT INTO ChannelSubscriptions(
                channel_id,
                product_id,
                status,
                stripe_checkout_id,
                user_id
            )
            VALUES (
                {channel_id},
                {product_id},
                "checkout",
                "{checkout_session}",
                {user_id}
            )
            ;
        '''
        try: 
            self.db.run_query(add_query)
            return "ok"
        except Exception as e:
            return str(e)

    def _addStripeSubscriptionId(self, checkout_id, stripe_subscription_id):
        '''
            Add stripe_subscription_id to the ChannelSubscription 
            to be handled later when payment arrives.
        '''
        update_query = f'''
            UPDATE ChannelSubscriptions
                SET stripe_subscription_id="{stripe_subscription_id}" AND last_change = NOW()
            WHERE stripe_checkout_id="{checkout_id}";'''

        self.db.run_query(update_query)
        
        return "ok"

    def _handleSuccessfulPayment(self, stripe_subscription_id, start_time, end_time):
        '''
            Extends duration of subscription
        '''
        update_query = f'''
            UPDATE ChannelSubscriptions
            SET end_time={end_time}
                AND start_time={start_time}
                AND status="active
            WHERE stripe_subscription_id="{stripe_subscription_id}";
        '''
        try:
            return self.db.run_query(query)
        except Exception as e:
            return "e"

    def _delete_checkout_entries(self):
        # check if 
        pass