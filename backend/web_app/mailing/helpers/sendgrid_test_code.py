import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

message = Mail(
    from_email="team@mora.stream",
    to_emails=['revolutionising.research@gmail.com', 'alain6rossier@gmail.com'],
    subject="Champions' club: party event",
    html_content="<strong>Welcome to the Champions' club! Free biscuits</strong>"
)


SENDGRID_API_KEY = "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"

try:
    sg = SendGridAPIClient(SENDGRID_API_KEY)
    # os.environ.get('SENDGRID_API_KEY'))
    response = sg.send(message)
    print(response.status_code)
    print(response.body)
    print(response.headers)
except Exception as e:
    print(str(e))