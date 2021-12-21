from __future__ import annotations
from repository.ChannelRepository import ChannelRepository


class AgoraClaimRepository():
    def __init__(self, db):
		self.db = db
		self.channelRepo = ChannelRepository(db=db)

    def getUnclaimedChannels(self: AgoraClaimRepository):
        channel_query = '''SELECT Channels.*
                        FROM Channels
                        INNER JOIN ChannelUsers
                        ON Channels.id = ChannelUsers.channel_id 
                        WHERE ChannelUsers.user_id = 360 and ChannelUsers.`role` = 'owner';'''
        unacquired_channels = self.db.run_query(channel_query)
        return unacquired_channels

    # Placeholder for pseudocode
    def send_email(channel):
        # Get channel name and mailing address and do magic
        pass
    
    def sendUnclaimedEmails(self):
        unclaimed_channels = self.getUnclaimedChannels()
        for channel in unclaimed_channels:
            self.send_email(channel)
            # Run a query to update the claim_email_sent field in TABLE Channels
            # It should update it by one everytime until a certain limit
            # After the limit has been reached and the user doesn't claim within x days we delete the agora
    
    def assignClaimEmail(self):
        pass



    
        

