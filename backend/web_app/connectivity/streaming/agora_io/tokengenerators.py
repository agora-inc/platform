#! /usr/bin/python
# ! -*- coding: utf-8 -*-

import sys
import unittest
import os
import time
from random import randint
from connectivity.streaming.agora_io.src.RtcTokenBuilder import RtcTokenBuilder

# for import
# sys.path.append(os.path.join(os.path.dirname(__file__), '../src'))


# import AccessToken
appID = "f68f8f99e18d4c76b7e03b2505f08ee3"
appCertificate = "6fa04d10a03442f09b859f6d91bbea58"


def generate_rtc_token(channel_name, role_attendee, expire_time_in_sec, user_account=None, uid=None):
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
    # try:
    current_timestamp = int(time.time())
    privilege_expired_ts = int(current_timestamp) + int(expire_time_in_sec)
    
    # with open("/home/cloud-user/test/shaq111.txt", "w") as file:
    #     file.write(str(channel_name) + " " + str(user_account) + " " + str(uid))

    try:
        if user_account is None and uid is None:
            return Exception("'channel_name' and 'uid' cannot be None at the same time.")
        elif user_account is not None:
            token = RtcTokenBuilder.buildTokenWithAccount(
                appID, 
                appCertificate,
                channel_name, 
                uid, 
                role_attendee, 
                privilege_expired_ts)
        elif uid is not None:
            token = RtcTokenBuilder.buildTokenWithUid(
                appID,
                appCertificate,
                channel_name,
                user_account, 
                role_attendee, 
                privilege_expired_ts)

        with open("/home/cloud-user/test/token_test.txt", "w") as file:
            file.write(str(token))

        return token

    except Exception as e:
        with open("/home/cloud-user/test/shaqERRROR3.txt", "w") as file:
            file.write(str(e))
