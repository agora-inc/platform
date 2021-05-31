from repository import TalkRepository, ChannelRepository
from mailing.sendgridApi import sendgridApi

mail_sys = sendgridApi()


# TODO: to test all methods

class CreditRepository:
    def __init__(self, db, mail_sys=mail_sys):
        self.db = db
        self.mail_sys = mail_sys
        self.channels = ChannelRepository.ChannelRepository(db=self.db)
        self.talks = TalkRepository.TalkRepository(db=self.db)

    def getUsedStreamCreditForTalk(self, talk_id):
        try:
            query = f'''
                SELECT streaming_credit 
                FROM Talks
                WHERE id = {talk_id};
            '''
            res = self.db.run_query(query)

            return res

        except Exception as e:
            return e

    def getAvailableStreamCreditForChannel(self, channel_id):
        try:
            query = f'''
                SELECT available_credits 
                FROM ChannelStreamingCredits
                WHERE channel_id = {channel_id};
                '''
            res = self.db.run_query(query)

            return res

        except Exception as e:
            return str(e)

    def getAvailableStreamCreditForTalk(self, talk_id):
        try:
            query = f'''
                SELECT available_credits 
                FROM ChannelStreamingCredits
                INNER JOIN Talks
                WHERE Talks.channel_id = ChannelStreamingCredits.channel_id;
                AND Talks.id = {talk_id};
            '''
            res = self.db.run_query(query)

            return res
        except Exception as e:
            return str(e)

    def addStreamCreditToTalk(self, talk_id, increment):
        # NOTE: number can be negative.
        current_credits = self.getAvailableStreamCreditForTalk(talk_id)
        n_new_credit = increment + current_credits
        if n_new_credit < 0:
            n_new_credit = 0

        try:
            query = f'''
                UPDATE ChannelStreamingCredits 
                SET available_credits = {n_new_credit}
                INNER JOIN Talks
                WHERE Talks.channel_id = ChannelStreamingCredits.channel_id
                AND Talks.id = {talk_id};
            '''
            res = self.db.run_query(query)

            return res
        except Exception as e:
            return str(e)

    def addStreamingCreditToChannel(self, channel_id, increment):
        # NOTE: number can be negative.
        current_credits = self.getAvailableStreamCreditForChannel(channel_id)
        n_new_credit = increment + current_credits
        if n_new_credit < 0:
            n_new_credit = 0

        try:
            query = f'''
                UPDATE ChannelStreamingCredits 
                SET available_credits = {n_new_credit}
                WHERE channel_id = {channel_id};
            '''
            res = self.db.run_query(query)

            return res
        except Exception as e:
            return str(e)

    def upgradeStreamTalkByOne(self, talk_id):
        total_cred = self.getAvailableStreamCreditForTalk(talk_id)
        if total_cred > 1:
            try:
                self.addStreamCreditToTalk(1, talk_id)
                self.addStreamingCreditToChannel(-1, talk_id)
            except Exception as e:
                return f'''upgradeStreamTalkByOne; {str(e)}'''
        else:
            return "Insufficient credits."

    def getMaxAudienceForCreditForTalk(self, talk_id):
        n_used_credit = self.getUsedStreamCreditForTalk(talk_id)

        return 20 + n_used_credit * 200

