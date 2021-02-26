import requests
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
# https://sendgrid.com/docs/API_Reference/api_getting_started.html


# NOTE:
#   Free email HTML templates: https://www.campaignmonitor.com/email-templates/




##########################################
# Dynamic template methods:
#   - method name convention: "send_DYNAMIC_TEMPLATE_NAME")
##########################################

class sendgridApi:
    def __init__(self):
        self.endpoint = "https://api.sendgrid.com/v3/mail/send"
        self.name_app = "agora.stream_logistic_mails"
        self.api_key = "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"
        self.sendgrid_api_client = SendGridAPIClient(api_key=self.api_key)

    def _post_sendgrid_request(self, target_email: str, dynamic_template_data: dict, template_id: str):
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

    #################################
    # A. User account notifications #
    #################################
    def send_confirmation_account_creation(self, target_email, recipient_name):
        template_id = "d-0b07e11a59f34e5c8d2429c6991b2287"
        response = self._post_sendgrid_request(
            target_email=target_email,
            dynamic_template_data={
                    "recipient_name": recipient_name,
                },
            template_id=template_id
        )
        return response

    def send_confirmation_password_change(self):
        raise NotImplementedError

    def send_invitation_join_agora_as_member(self):
        raise NotImplementedError
        
    ########################
    # B. Talk registration #
    ########################
    def send_confirmation_talk_registration_request(self, target_email, talk_name, recipient_name, talk_id, agora_name, date_str, conference_url=None):
        template_id = "d-7778766bf8764d379f19bf2822aa38c2"

        dynamic_template_data={
                            "talk_name": talk_name,
                            "recipient_name": recipient_name,
                            "talk_id": talk_id,
                            "agora_name": agora_name,
                            "date": date_str
                        }

        if conference_url is None or conference_url == "":
            dynamic_template_data["conference_url"] = "Shared later."
        else:
            dynamic_template_data["conference_url"] = conference_url

        response = self._post_sendgrid_request(
            target_email=target_email,
            dynamic_template_data=dynamic_template_data,
            template_id=template_id
        )
        return response

    def send_confirmation_talk_registration_acceptance(self, target_email, talk_name, recipient_name, talk_id, agora_name, date_str, conference_url=None):
        template_id = "d-e2791dbf94084474b5dd50b15a8ea372"

        dynamic_template_data={
                            "talk_name": talk_name,
                            "recipient_name": recipient_name,
                            "talk_id": talk_id,
                            "agora_name": agora_name,
                            "date": date_str
                        }

        if conference_url is None or conference_url == "":
            dynamic_template_data["conference_url"] = "To be shared."
        else:
            dynamic_template_data["conference_url"] = conference_url

        response = self._post_sendgrid_request(
            target_email=target_email,
            dynamic_template_data=dynamic_template_data,
            template_id=template_id
        )
        return response

    def send_talk_details_full(self, target_email, talk_name, recipient_name, talk_id, agora_name, date_str, conference_url):
        template_id = "d-d789a156a6f94442851b056ca5d7b620"
        response = self._post_sendgrid_request(
            target_email=target_email,
            dynamic_template_data={
                    "talk_name": talk_name,
                    "recipient_name": recipient_name,
                    "talk_id": talk_id,
                    "agora_name": agora_name,
                    "conference_url": conference_url
                },
            template_id=template_id
        )
        return response

    ###########################################
    # C. Notifying modification event details #
    ###########################################
    def send_cancellation_event(self, target_email, talk_name, recipient_name, agora_name, date_str):
        template_id = "d-835271951aad41e5b2ffa514f30f619c"
        response = self._post_sendgrid_request(
            target_email=target_email,
            dynamic_template_data={
                    "talk_name": talk_name,
                    "recipient_name": recipient_name,
                    "agora_name": agora_name,
                    "date_str": date_str
                },
            template_id=template_id
        )
        return response
        
    def send_talk_details_modification_update(self, target_email, talk_name, recipient_name, talk_id, agora_name, date_str, conference_url):
        template_id = "d-712e04b993df4855ab7903bd35600f4b"
        response = self._post_sendgrid_request(
            target_email=target_email,
            dynamic_template_data={
                    "talk_name": talk_name,
                    "recipient_name": recipient_name,
                    "talk_id": talk_id,
                    "agora_name": agora_name,
                    "conference_url": conference_url
                },
            template_id=template_id
        )
        return response

    ####################
    # D. Advertisement #
    ####################
    def send_advertise_new_incoming_talk_for_channel(self):
        raise NotImplementedError



#################
# TESTING CELL: #
#################
if __name__ == "__main__":

    target_test_email = "agoratest_hihi@mailinator.com"

    client = sendgridApi()
    dynamic_template_data = {
            "talk_name": "Quantum fluids on manifolds",
            "recipient_name": "Mike Tyson",
            "talk_id": "123",
            "agora_name": "Malliavin calculus",
            "conference_url": "google.com"
    }

    # Methods
    # client.send_confirmation_account_creation(
    #     "sandwich@mailinator.com",
    #     "username_test!")

    # client.send_confirmation_talk_registration_request(
    #     target_test_email,
    #     "talk_name123", 
    #     "recipient_name123", 
    #     "talk_id123", 
    #     "agora_name123", 
    #     "date_str", 
    #     "conference_url123")

    # client.send_confirmation_talk_registration_acceptance(
    #     target_test_email, 
    #     "talk_name123", 
    #     "recipient_name123", 
    #     "talk_id123", 
    #     "agora_name123", 
    #     "date_str123", 
    #     "conference_url123")
    
    # client.send_talk_details_full(
        # target_test_email, 
        # "talk_name123", 
        # "recipient_name123", 
        # "talk_id123", 
        # "agora_name123", 
        # "date_str123", 
        # "conference_url123")

    # client.send_cancellation_event(    
    #     target_test_email, 
    #     "talk_name123", 
    #     "recipient_name123", 
    #     "agora_name123", 
    #     "date_str123")

    # client.send_talk_details_modification_update(
    #     target_test_email, 
    #     "talk_name123", 
    #     "recipient_name123", 
    #     "talk_id123", 
    #     "agora_name123", 
    #     "date_str123", 
    #     "conference_url123")