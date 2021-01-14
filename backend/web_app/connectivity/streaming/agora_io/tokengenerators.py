#! /usr/bin/python
# ! -*- coding: utf-8 -*-

import sys
import unittest
import os
import time
from random import randint
from streaming.agora_io.src.RtcTokenBuilder import RtcTokenBuilder

# for import
# sys.path.append(os.path.join(os.path.dirname(__file__), '../src'))


# import AccessToken

appID = "f68f8f99e18d4c76b7e03b2505f08ee3"
appCertificate = "6fa04d10a03442f09b859f6d91bbea58"

class agoraIOtokenGenerators:
    def __init__(self):
        self.app_id = appID
        self.app_certificate = appCertificate

    def generate_rtc_token(self, channel_name, role_attendee, expire_time_in_sec, user_account=None, uid=None):
        """generate RTC token. Must use either uid OR user_account.

        Args:
            channel_name ([type]): [description]
            role_attendee ([type]): [description]
            expire_time_in_sec ([type]): [description]
            user_account ([type], optional): [description]. Defaults to None.
            uid ([type], optional): [description]. Defaults to None.

        Returns:
            [type]: [description]
        """
        current_timestamp = int(time.time())
        privilege_expired_ts = current_timestamp + expire_time_in_sec
        
        if channel_name == None and uid == None:
            return Exception("'channel_name' and 'uid' cannot be None at the same time.")
        elif channel_name is not None:
            token = RtcTokenBuilder.buildTokenWithAccount(
                self.app_id, 
                self.app_certificate, 
                channel_name, 
                uid, 
                role_attendee, 
                privilege_expired_ts)
        elif uid is not None:
            token = RtcTokenBuilder.buildTokenWithUid(
                self.app_id, 
                self.app_certificate, 
                channel_name, 
                user_account, 
                role_attendee, 
                privilege_expired_ts)

        return token

# Below parameters can be changed
# channelName = "7d72365eb983485397e3e3f9d460bdda"
# uid = 2882341273
# userAccount = "2882341273"
# expireTimeInSeconds = 3600
# # currentTimestamp = int(time.time())
# privilegeExpiredTs = currentTimestamp + expireTimeInSeconds


# def main():
#     token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, Role_Attendee, privilegeExpiredTs)
#     print("Token with int uid: {}".format(token))
#     token = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, userAccount, Role_Attendee, privilegeExpiredTs)
#     print("Token with user account: {}".format(token))

# if __name__ == "__main__":
#     main()
