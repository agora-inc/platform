import requests
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
# https://sendgrid.com/docs/API_Reference/api_getting_started.html

class sendgridApi:
    def __init__(self):
        self.endpoint = "https://api.sendgrid.com/v3/mail/send"
        self.name_app = "agora.stream_logistic_mails"
        self.api_key = "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"
        self.sendgrid_api_client = SendGridAPIClient(api_key=self.api_key)

    def post_sendgrid_request(self, target_email: str, dynamic_template_data: dict, template_id: str):
        message = Mail(
            from_email="team@agora.stream",
            to_emails=f'{target_email}')
            # html_content='<strong>and easy to do anywhere, even with Python</strong>')
        message.dynamic_template_data = dynamic_template_data
        message.template_id = template_id

        try:
            # sendgrid_client = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            response = self.sendgrid_api_client.send(message)
            print(response.status_code)
            print(response.body)
            print(response.headers)
            return response
        except Exception as e:
            print(e)

    def send_confirmation_email_request(self, target_email, talk_name, username, talk_id, agora_name, conference_url):
        """Use sendgrid api

        Args:
            target_email (str): email
            dynamic_template_data (dictionary): Must have the form:
                {
                    "talk_name": "Lightspeed fluid",
                    "username": "Mike Tyson",
                    "talk_id": 123,
                    "agora_name": "Malliavin calculus",
                    "conference_url": "google.com"
                }
        """ 
        template_id = "d-e2791dbf94084474b5dd50b15a8ea372"

        response = self.post_sendgrid_request(
            target_email=target_email,
            dynamic_template_data={
                    "talk_name": talk_name,
                    "username": username,
                    "talk_id": talk_id,
                    "agora_name": agora_name,
                    "conference_url": conference_url
                },
            template_id=template_id
        )
        return response

    def send_access_information_future_talk(self, target_email, dynamic_template_data):
        pass

    def send_update_future_talk(self):
        pass

    def send_new_incoming_talk_advertisement(self):
        pass



if __name__ == "__main__":
    client = sendgridApi()
    dynamic_template_data = {
            "talk_name": "Quantum fluids on manifolds",
            "username": "Mike Tyson",
            "talk_id": "123",
            "agora_name": "Malliavin calculus",
            "conference_url": "google.com"
    }

    # client.send_confirmation_email_request("revolutionising.research@gmail.com", dynamic_template_data)