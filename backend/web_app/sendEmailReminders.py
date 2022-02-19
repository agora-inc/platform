# import hack (Remy); TODO: rework code architecture
from repository import EmailRemindersRepository 
from app.databases import agora_db

DELTA_TIME_WINDOW = 2  # Reminders are sent with an imprecision of 2 hours

assert DELTA_TIME_WINDOW == 2 , 'Imprecision is more than 2 hours'

emailReminders = EmailRemindersRepository.EmailRemindersRepository()


def sendAllEmailReminders(db = agora_db) -> None:
    # query all reminders 
    reminderIds = emailReminders.getReminderIdsToBeSent(DELTA_TIME_WINDOW)

    # send
    for reminderId in reminderIds:
        emailReminders.sendEmailsForReminder(reminderId)

if __name__ == "__main__":
    sendAllEmailReminders()
