from mailing.sendgridApi import sendgridApi
from datetime import datetime, timedelta

mail_sys = sendgridApi()

class PaymentHistoryRepository:
    def __init__(self, db, mail_sys=mail_sys):
        self.db = db
        self.mail_sys = mail_sys

    def addPendingPayment(self, user_id,stripe_customer_id, customer_email,hosted_invoice_url, payment_status, channel_subscription_id):
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

    def updatePaymentStatus(self):
        raise NotImplementedError

    def updateTransactionIntoPaid(self, product_id, productId, checkout_session, channel_id):
        raise NotImplementedError

    def getPaymentsForChannel(self):
        raise NotImplementedError
