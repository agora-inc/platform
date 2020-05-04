import time

class ChatParticipant:
    """
    Represents a person, holds name, socket client and IP address chat_group_id_blocked
    """
    def __init__(self, addr, client, chat_participant_id_subscribed, chat_participant_id_blocked, user_id=None):
        self.addr = addr
        self.client = client
        self.user_id = user_id
        self.chat_participant_id_subscribed = chat_participant_id_subscribed
        self.chat_participant_id_blocked = chat_participant_id_blocked

        self.clap_id = None

        self.name = None
        self.flag_connection = True
        self.creation_time = time.time()
        self.last_ping = time.time()

    def set_name(self, name):
        """
        sets the persons name
        :param name: str
        :return: None
        """
        self.name = name

    def __repr__(self):
        return f"Person({self.addr}, {self.chat_participant_id_subscribed}, {self.user_id})"