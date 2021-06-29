from mailing.sendgridApi import sendgridApi
from datetime import datetime, timedelta
from app.databases import agora_db

mail_sys = sendgridApi()

class PaymentHistoryRepository:
    def __init__(self, db=agora_db, mail_sys=mail_sys):
        self.db = db
        self.mail_sys = mail_sys

    def addPendingPayment(self, channel_subscription_id, stripe_customer_id, hosted_invoice_url, customer_email, user_id, status):
        # get productId associated with the stripe_product_id
        add_query = f'''
            INSERT INTO PaymentHistory(
                user_id
                stripe_customer_id, 
                customer_email,
                hosted_invoice_url, 
                invoice_date,
                status,
                product_class
                channel_subscription_id
            )
            VALUES (
                {user_id}
                "{stripe_customer_id}"",
                "{customer_email}",
                "{hosted_invoice_url}"",
                NOW(),
                "{payment_status}"
                "channel_subscription",
                "{channel_subscription_id}",

            )
            ;
        '''
        try: 
            self.db.run_query(extension_query)
            return "ok"
        except Exception as e:
            return str(e)

    def updateSuccessfulPayment(self):
        # if first payment, update status of previous pending payment into active

        # if new payment for a new invoice, add a new line
        raise NotImplementedError

    

    def updateTransactionIntoPaid(self, product_id, productId, checkout_session, channel_id):
        # check if user

    def getPaymentsForChannelWithin(self):
        pass
