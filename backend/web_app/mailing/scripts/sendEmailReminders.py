import sys
# insert at 1, 0 is the script path (or '' in REPL)
sys.path.insert(1, '/home/cloud-user/plateform/agora/backend/web_app/app')
sys.path.insert(1, '/home/cloud-user/plateform/agora/backend/web_app')


try:
    from databases import agora_db
except Exception as e:
    with open("/home/cloud-user/test/crontab/huhuerr.txt", "w") as file:
        file.write(str(e) + "\n" + str(sys.path))

try:
    from repository.EmailRemindersRepository import EmailRemindersRepository
    emailReminders = EmailRemindersRepository(db=agora_db)
except Exception as e:
    with open("/home/cloud-user/test/crontab/hohoerr.txt", "w") as file:
        file.write(str(e) + "\n" + str(sys.path))



if __name__ == "__main__":
    
#     reminderIds = emailReminders.getReminderIdsToBeSent()
#     for reminderId in reminderIds:
#         emailReminders.sendEmailsForReminder(reminderId)


    import time

    now = time.time()
    with open(f"/home/cloud-user/test/crontab/{str(now)}.txt", "w") as file:
        file.write(str(now))