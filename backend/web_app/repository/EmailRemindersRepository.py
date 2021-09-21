from mailing.sendgridApi import sendgridApi
from datetime import datetime, timedelta
from app.databases import agora_db


# NOTE: times are in the format: "2020-12-31 23:59"
"""
    TODO: All methods involving the "state" field must be tested.
"""
mail_sys = sendgridApi()

class EmailRemindersRepository:
    def __init__(self, db=agora_db, mail_sys=mail_sys):
        self.db = db
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

    def sendEmailsForReminder(self, reminderId):
        # get talkId
        talk_id_query = f'SELECT talk_id FROM EmailReminders WHERE id = {reminderId};'
        res_talk_id_query = self.db.run_query(talk_id_query)

        if res_talk_id_query is None:
            raise Exception("sendEmailReminders: no talk ID with id={talkId}")
        else:
            talkId = res_talk_id_query[0]["talk_id"]

        # NOTE: Copied from getTalkById from backend/web_app/repository/TalkRepository.py)
        query = f'SELECT * FROM Talks WHERE id = {talkId};'
        talk_info_res = self.db.run_query(query)

        if talk_info_res is None:
            raise Exception("sendEmailReminders: no talk ID with id={talkId}")
        else:
            talk_info = talk_info_res[0]

        agora_name = talk_info["channel_name"]
        date_str = talk_info["date"]
        talk_name = talk_info["name"]
        speaker_name = talk_info["talk_speaker"] 

        try:
            # Query audience emails
            emails = self.getEmailsForReminder(reminderId)
            
            # send
            for email in emails:
                self.mail_sys.send_reminder_new_incoming_talk_for_channel(
                    email, 
                    agora_name, 
                    date_str, 
                    talk_name, 
                    talkId, 
                    speaker_name)

            # update status to sent
            sent_update_query = f'''
                UPDATE EmailReminders
                SET 
                    status="sent"
                WHERE id = {reminderId};
                '''
            self.db.run_query(sent_update_query)

            return "ok"

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

    def getEmailsForReminder(self, reminderId):
        # query reminder
        reminder_query = f'''
            SELECT t1.to_talk_participants, t1.to_mailing_list, t1.to_followers, t2.channel_id, t1.talk_id FROM EmailReminders t1
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
                emails = emails + [i["email"] for i in res]

            if send_to_mailing_list:
                get_mailing_list_emails_query = f'''
                    SELECT email from ChannelMailingList
                    WHERE channel_id = {channel_id};
                '''
                res = self.db.run_query(get_mailing_list_emails_query)
                emails = emails + [i["email"] for i in res]


            if send_to_followers:
                pass
                # get_followers_emails_query = f'''
                #     SELECT email from 
                # '''
                # res = self.db.run_query(get_followers_emails_query)
                # emails = emails + [i["email"] for i in res]

        return set(emails)

    def getReminderIdsToBeSent(self, delta_time_window):
        # get reminders whose time_sending are within [time_sending-delta_time_window; time_sending + delta_time_window]
        get_reminders_query = f'''
            SELECT id from EmailReminders
            WHERE (
                time > DATE_ADD(NOW(), INTERVAL - {delta_time_window} HOUR)
                AND time < DATE_ADD(NOW(), INTERVAL {delta_time_window} HOUR)
                )
                AND status != "sent"
            ;
        '''
        res = self.db.run_query(get_reminders_query)

        if res is None:
            return []
        else:
            return [i["id"] for i in res]
