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
                            {talkId},
                            "{reminder2_time}",
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