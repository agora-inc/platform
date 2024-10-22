import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def send_error_email(error_source, short_description, error_msg):
    assert(isinstance(error_source, str))
    assert(isinstance(short_description, str))
    assert(isinstance(error_msg, str))

    #The mail addresses and password
    sender_address = 'revolutionising.research.errors@gmail.com'
    sender_pass = '123.error.123'
    receiver_address = 'revolutionising.research.errors@gmail.com'

    #Setup the MIME
    message = MIMEMultipart()
    message['From'] = sender_address
    message['To'] = receiver_address
    message['Subject'] = error_source

    #The body and the attachments for the mail
    if error_msg != "":
        message.attach(MIMEText(error_msg, 'plain'))

    #Create SMTP session for sending the mail
    session = smtplib.SMTP('smtp.gmail.com', 587) #use gmail with port
    session.starttls() #enable security
    session.login(sender_address, sender_pass) #login with mail_id and password
    text = message.as_string()
    session.sendmail(sender_address, receiver_address, text)
    session.quit()
