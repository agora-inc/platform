class ChatParticipant:
    """
    Represents a person, holds name, socket client and IP address
    """
    def __init__(self, addr, client, chat_group_id_subscription, chat_group_id_blocked):
        self.addr = addr
        self.client = client
        self.name = None
        self.chat_group_id_subscription = chat_group_id_subscription
        self.chat_group_id_blocked = chat_group_id_blocked

    def set_name(self, name):
        """
        sets the persons name
        :param name: str
        :return: None
        """
        self.name = name

    def __repr__(self):
        return f"Person({self.addr}, {self.name})"