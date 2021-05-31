from repository import TagRepository, ChannelRepository
from datetime import datetime

class CreditRepository:
    def __init__(self, db):
        self.db = db
        self.tags = TagRepository.TagRepository(db=self.db)
        self.channels = ChannelRepository.ChannelRepository(db=self.db)

    def getAvailableStreamCreditForChannel(self):
        pass

    def getUsedStreamCreditForTalk(self):
        pass

    def getAvailableStreamCreditForTalk(self):
        pass

    def addStreamCreditForTalk(self):
        pass

    def addStreamCreditForChannel(self):
        pass

    def getMaxAudienceForCreditForTalk(self):
        pass
