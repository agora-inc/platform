# import hack (Remy); TODO: rework code architecture
from app.routes import EmailRemindersRepository 

DELTA_TIME_WINDOW = 900  # Reminders are sent with an imprecision of 2 hours

emailReminders = EmailRemindersRepository.EmailRemindersRepository()


def sendAllEmailReminders():
    # query all reminders
    reminderIds = emailReminders.getReminderIdsToBeSent(DELTA_TIME_WINDOW)

    # send
    for reminderId in reminderIds:
        emailReminders.sendEmailsForReminder(reminderId)

if __name__ == "__main__":
    sendAllEmailReminders()
