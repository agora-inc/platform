from repository.ChannelRepository import ChannelRepository
from repository.TopicRepository import TopicRepository
from repository.InstitutionRepository import InstitutionRepository
from mailing.sendgridApi import sendgridApi
from datetime import datetime, timedelta

# NOTE: times are in the format: "2020-12-31 23:59"
"""
    TODO: All methods involving the "state" field must be tested.
"""
mail_sys = sendgridApi()

class EmailRemindersRepository:
    def __init__(self, db, mail_sys=mail_sys):
        self.db = db
        self.channels = ChannelRepository(db=db)
        self.topics = TopicRepository(db=self.db)
        self.institutions = InstitutionRepository(db=self.db)
        self.mail_sys = mail_sys

    def deleteEmailRemindersForTalk(self, talkId):
        try:
            query_delete = f'DELETE FROM EmailReminders WHERE talk_id={talkId};'
            self.db.run_query(query_delete)
            return "ok"
        except Exception as e:
            raise Exception(e)

    def addEmailReminders(self, talkId, startDate, reminderEmailGroup, reminder1, reminder2):
        # Email reminders
        try:
            to_talk_participants = int("Participants" in reminderEmailGroup)
            to_mailing_list = int("MailingList" in reminderEmailGroup)
            to_followers = int("Followers" in reminderEmailGroup)

            start_date_dt = datetime.strptime(startDate, "%Y-%m-%d %H:%M")

            if reminder1:
                reminder1_delta = timedelta(hours=reminder1)
                reminder1_time_raw = (start_date_dt - reminder1_delta)

                # check time not in past
                now = datetime.now()
                if now < reminder1_time_raw:
                    reminder1_time = reminder1_time_raw.strftime("%Y-%m-%d %H:%M")

                    query_reminder_1 = f'''
                        INSERT INTO EmailReminders (
                            talk_id,
                            time,
                            to_talk_participants,
                            to_mailing_list,
                            to_followers,
                            delta_time,
                            status
                        ) VALUES (
                            {talkId},
                            "{reminder1_time}",
                            {to_talk_participants},
                            {to_mailing_list},
                            {to_followers},
                            {reminder1},
                            "pending"
                        );
                    '''
                    self.db.run_query(query_reminder_1)
                
            if reminder2:
                reminder2_delta = timedelta(hours=reminder2) 
                reminder2_time_raw = (start_date_dt - reminder2_delta)

                # check time not in past
                now = datetime.now()
                if now < reminder2_time_raw:
                    reminder2_time = reminder2_time_raw.strftime("%Y-%m-%d %H:%M")

                    query_reminder_2 = f'''
                        INSERT INTO EmailReminders (
                            talk_id,
                            time,
                            to_talk_participants,
                            to_mailing_list,
                            to_followers,
                            delta_time,
                            status
                        ) VALUES (
                            "{reminder2_time}",
                            {talkId},
                            {to_talk_participants},
                            {to_mailing_list},
                            {to_followers},
                            {reminder2},
                            "pending"
                        );
                    '''

                    self.db.run_query(query_reminder_2)

            return "ok"

        except Exception as e:
            raise Exception(e)

    def updateEmailReminders(self, talkId, startDate, reminderEmailGroup, reminder1, reminder2):
        # Email reminders
        try:
            self.deleteEmailRemindersForTalk(talkId)
            self.addEmailReminders(talkId, startDate, reminderEmailGroup, reminder1, reminder2)
            return "ok"

        except Exception as e:
            raise Exception(e)

    def getReminderTime(self, talkId):
        try:
            query = f'SELECT delta_time FROM EmailReminders WHERE talk_id = {talkId};'  
            res = self.db.run_query(query)

            # Reminders
            reminders = [{"exist": False, "days": 0, "hours": 0}, {"exist": False, "days": 0, "hours": 0}]
            for i, e in enumerate(res):
                reminders[i]["exist"] = True
                reminders[i]["days"] = int(e["delta_time"]) // 24
                reminders[i]["hours"] = int(e["delta_time"]) % 24

            return reminders
        except Exception as e:
            return str(e)

    def getReminderGroup(self, talkId):
        query = f'SELECT EmailReminders.to_talk_participants, EmailReminders.to_mailing_list, EmailReminders.to_followers FROM EmailReminders WHERE talk_id = {talkId};'  
        res = self.db.run_query(query)

        # Groups
        groups = []
        if len(res) > 0:
            if res[0]["to_talk_participants"]: 
                groups.append("Participants")
            if res[0]["to_mailing_list"]:
                groups.append("MailingList")
            if res[0]["to_followers"]:
                groups.append("Followers")

        return groups

    def sendEmailReminders(self, talkId, delta_time_window):
        # get reminders whose time_sending are within [time_sending-delta_time_window; time_sending + delta_time_window]
        get_reminders_query = f'''
            SELECT id from EmailReminders
            WHERE (
                time < DATE(NOW() - INTERVAL {delta_time_window} HOURS)
             AND time > DATE(NOW() - INTERVAL {delta_time_window} HOURS)
             )
             AND status != "sent"
             AND talk_id = {talkId}
            ;
            '''
        reminderIds = self.db.run_query(get_reminders_query)
        
        if isinstance(reminderIds, list):
            for reminderId in reminderIds:
                try:
                    # Query audience emails
                    emails = self.getEmailsForReminders(reminderId)

                    # send
                    for email in emails:
                        # CHECK IF POSSIBLE TO SEND ALL EMAILS AT HE SAME TIME (better for error handling)
                        #
                        #
                        #
                        #
                        #
                        #
                        #  WIN
                        #
                        #
                        #
                        #
                        self.mail_sys.

                    # update status to sent
                    sent_update_query = f'''
                        UPDATE EmailReminders
                        SET 
                            status="sent",
                        WHERE id = {reminderId};
                        '''
                    self.db.run_query(sent_update_query)

                except Exception as e:
                    # update status to error
                    error_update_query = f'''
                    UPDATE EmailReminders
                    SET 
                        status="error",
                        error_msg={str(e)}
                    WHERE id = {reminderId};
                    '''
                    self.db.run_query(error_update_query)

        return "ok"

    def getEmailsForReminders(self, reminderId):
        # query reminder
        reminder_query = f'''
            SELECT t1.to_talk_participants, t1.to_mailing_list, t1.to_followers, t2.channel_id FROM EmailReminders t1
            INNER JOIN Talks t2
            WHERE t1.id = {reminderId}
                AND t1.talk_id = t2.id
            ;
        '''

        res = self.db.run_query(reminder_query)
        if res is not None:
            res = res[0]
            send_to_participants = res["to_talk_participants"]
            send_to_mailing_list = res["to_mailing_list"] 
            send_to_followers = res["to_followers"]

            talk_id = res["talk_id"]
            channel_id = res["channel_id"]
            
            emails = []

            if send_to_participants:
                get_participant_emails_query = f'''
                    SELECT email from TalkRegistrations
                    WHERE talk_id = {talk_id}
                    AND status in ("accepted","pending");
                '''
                res = self.db.run_query(get_participant_emails_query)

                with open("/home/cloud-user/getEmailsForReminders_participants.txt", "w") as file:
                    file.write(str(res))

                emails = emails + res

            if send_to_mailing_list:
                get_mailing_list_emails_query = f'''
                    SELECT email from ChannelMailingList
                    WHERE channel_id = {channel_id};
                '''
                res = self.db.run_query(get_mailing_list_emails_query)

                with open("/home/cloud-user/getEmailsForReminders_mailing_list.txt", "w") as file:
                    file.write(str(res))

                emails = emails + res


            if send_to_followers:
                get_followers_emails_query = f'''
                    SELECT email from 
                '''
                res = self.db.run_query(get_followers_emails_query)

                with open("/home/cloud-user/getEmailsForReminders_followers.txt", "w") as file:
                    file.write(str(res))

                emails = emails + res


        return emails

        