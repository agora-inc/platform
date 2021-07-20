from mailing.sendgridApi import sendgridApi
from datetime import datetime, timedelta
from app.databases import agora_db

mail_sys = sendgridApi()

class ProductRepository:
    def __init__(self, db=agora_db, mail_sys=mail_sys):
        self.db = db
        self.mail_sys = mail_sys

        # self.channels = ChannelRepository(db=db)
        # self.tags = TagRepository(db=self.db)
        # self.topics = TopicRepository(db=self.db)
        # self.institutions = InstitutionRepository(db=self.db)
        # self.email_reminders = EmailRemindersRepository(db=self.db)

    def getStreamingProductById(self, product_id):
        get_query = f'''
            SELECT * FROM StreamingProducts
            WHERE id = {product_id};
        '''
        res = self.db.run_query(get_query)
        return res[0] if len(res) > 0 else []

    def getStreamingProductByFeatures(self, tier, product_type, aud_size):
        try:
            get_query = f'''
                SELECT * FROM StreamingProducts
                WHERE (
                    tier = "{tier}"
                    AND product_type = "{product_type}"
                    AND audience_size = "{aud_size}");
            '''

            res = self.db.run_query(get_query)
            with open("/home/cloud-user/test/query-stream-prod-id.txt", "w") as file:
                file.write(str(get_query))
            with open("/home/cloud-user/test/stream-prod-id.txt", "w") as file:
                file.write(str(res))

            return res[0] if len(res) > 0 else []
        except Exception as e:
            return str(e)

    def getAllStreamingProducts(self):
        try:
            get_query = f'''
                SELECT * FROM StreamingProducts;
            '''
            return self.db.run_query(get_query)

        except Exception as e:
            return str(e)
        