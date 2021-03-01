import requests
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import datetime
import math


# NOTE:
#   API URL: https://sendgrid.com/docs/API_Reference/api_getting_started.html
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
    
    @staticmethod
    def _convert_gmt_into_human_date_str(gmt_string:str, user_hour_offset:float):
        """Gets 2020-09-30 15:00:00.0 date format and convert it into "30th September 2020, 15:00GMT+1" 
        in the time zone of the user.
        
        (NOTE: user_hour_offset is 1 if we are in GMT+1 right now)
        """
        date_original_format = "%Y-%m-%d %H:%M:%S"
        final_date_format = '%A, %d %B %Y at %H:%M:%S'

        # Convert strings in datetime format
        date_original = datetime.datetime.strptime(gmt_string, date_original_format)

        # Add offset
        hours_to_add = datetime.timedelta(hours=user_hour_offset)
        updated_datetime = date_original + hours_to_add

        # Format string (+ add GMT at the end)
        gmt_sign = lambda x: "-" if x < 0 else "+"
        def gmt_hour(hour):
            hour = abs(hour)
            if math.floor(hour) == hour:
                return f"{hour}"
            else:
                return f"{math.floor(hour)}:30"

        gmt_str = f" GMT{gmt_sign(user_hour_offset)}{gmt_hour(user_hour_offset)}  "
        formatted_date = datetime.datetime.strftime(updated_datetime, final_date_format) + f"{gmt_str}"

        return formatted_date

    ###################
    # A. User account #
    ###################
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
        
    ##############################
    # B. User talk notifications #
    ##############################
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

    #################################
    # D. User channel registrations #
    #################################
    def send_confirmation_agora_membership_request(self, target_email, recipient_name, agora_name):
        template_id = "d-a17b20abbb12420a97ecab7bd324b9bb"
        response = self._post_sendgrid_request(
            target_email=target_email,
            dynamic_template_data={
                    "agora_name": agora_name,
                    "recipient_name": recipient_name
                },
            template_id=template_id
        )
        return response

    def send_confirmation_agora_membership_acceptance(self, target_email, agora_name, recipient_name):
        template_id = "d-5a9c28cdcc814ea589dcb503076e9877"
        response = self._post_sendgrid_request(
            target_email=target_email,
            dynamic_template_data={
                    "agora_name": agora_name,
                    "recipient_name": recipient_name
                },
            template_id=template_id
        )
        return response

    ########################################
    # E. Agora administrator notifications #
    ########################################
    def notify_admin_talk_registration(self, target_email, agora_name, talk_name, applicant_name, institution, website):
        template_id = "d-7744a8e5fe9141a1b0bd1eeb81bf3b55"
        response = self._post_sendgrid_request(
            target_email=target_email,
            dynamic_template_data={
                    "agora_name": agora_name,
                    "talk_name": talk_name,
                    "applicant_name": applicant_name,
                    "institution": institution,
                    "website": website
                },
            template_id=template_id
        )
        return response

    def notify_admin_membership_application(self, target_email, agora_name):
        template_id = "d-78a88eef9d9c46998c75ecbc01e43d4a"
        response = self._post_sendgrid_request(
            target_email=target_email,
            dynamic_template_data={
                    "agora_name": agora_name,
                },
            template_id=template_id
        )
        return response

    def notify_admin_speaker_application(self):
        raise NotImplementedError

    ####################
    # F. Advertisement #
    ####################
    def send_advertise_new_incoming_talk_for_channel(self):
        raise NotImplementedError


#################
# TESTING CELL: #
#################
if __name__ == "__main__":
    target_test_email = "testagora@mailinator.com"
    client = sendgridApi()

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
    #     target_test_email, 
    #     "talk_name123", 
    #     "recipient_name123", 
    #     "talk_id123", 
    #     "agora_name123", 
    #     "date_str123", 
    #     "conference_url123")

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

    # res = client._convert_gmt_into_human_date_str("2020-09-30 15:00:00.0", -1)
    # print(res)

    # client.notify_admin_talk_registration(
    #     target_test_email,
    #     "agora_name123", 
    #     "talk_name123",
    #     "applicant_name123",
    #     "institution123",
    #     "website123")