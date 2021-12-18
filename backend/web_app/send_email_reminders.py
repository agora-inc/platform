# import hack (Remy); TODO: rework code architecture
from repository.EmailRemindersRepository import EmailRemindersRepository 

DELTA_TIME_WINDOW = 2  # Reminders are sent with an imprecision of 2 hours

assert DELTA_TIME_WINDOW == 2 , 'Imprecision is more than 2 hours'

emailReminders = EmailRemindersRepository()


def sendAllEmailReminders() -> None:
    # query all reminders 
    reminderIds = emailReminders.getReminderIdsToBeSent(DELTA_TIME_WINDOW)

    # send
    for reminderId in reminderIds:
        emailReminders.sendEmailsForReminder(reminderId)

if __name__ == "__main__":
    sendAllEmailReminders()
