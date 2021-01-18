import hmac
from hashlib import sha256
import ctypes
import base64
import struct
from zlib import crc32
import random
import re
import time
from collections import OrderedDict

kJoinChannel = 1
kPublishAudioStream = 2
kPublishVideoStream = 3
kPublishDataStream = 4
kPublishAudiocdn = 5
kPublishVideoCdn = 6
kRequestPublishAudioStream = 7
kRequestPublishVideoStream = 8
kRequestPublishDataStream = 9
kInvitePublishAudioStream = 10
kInvitePublishVideoStream = 11
kInvitePublishDataStream = 12
kAdministrateChannel = 101
kRtmLogin = 1000

VERSION_LENGTH = 3
APP_ID_LENGTH = 32


def getVersion():
    return '006'


def packUint16(x):
    return struct.pack('<H', int(x))


def packUint32(x):
    return struct.pack('<I', int(x))


def packInt32(x):
    return struct.pack('<i', int(x))


def packString(string):
    return packUint16(len(string)) + string


def packMap(m):
    ret = packUint16(len(m.items()))
    for k, v in m.items():
        ret += packUint16(k) + packString(v)
    return ret


def packMapUint32(m):
    ret = packUint16(len(m.items()))
    for k, v in m.items():
        ret += packUint16(k) + packUint32(v)
    return ret


class ReadByteBuffer:

    def __init__(self, bytes):
        self.buffer = bytes
        self.position = 0

    def unPackUint16(self):
        len = struct.calcsize('H')
        buff = self.buffer[self.position: self.position + len]
        ret = struct.unpack('<H', buff)[0]
        self.position += len
        return ret

    def unPackUint32(self):
        len = struct.calcsize('I')
        buff = self.buffer[self.position: self.position + len]
        ret = struct.unpack('<I', buff)[0]
        self.position += len
        return ret

    def unPackString(self):
        strlen = self.unPackUint16()
        buff = self.buffer[self.position: self.position + strlen]
        ret = struct.unpack('<' + str(strlen) + 's', buff)[0]
        self.position += strlen
        return ret

    def unPackMapUint32(self):
        messages = {}
        maplen = self.unPackUint16()

        for index in range(maplen):
            key = self.unPackUint16()
            value = self.unPackUint32()
            messages[key] = value
        return messages


def unPackContent(buff):
    readbuf = ReadByteBuffer(buff)
    signature = readbuf.unPackString()
    crc_channel_name = readbuf.unPackUint32()
    crc_uid = readbuf.unPackUint32()
    m = readbuf.unPackString()

    return signature, crc_channel_name, crc_uid, m


def unPackMessages(buff):
    readbuf = ReadByteBuffer(buff)
    salt = readbuf.unPackUint32()
    ts = readbuf.unPackUint32()
    messages = readbuf.unPackMapUint32()

    return salt, ts, messages


def decode_base64(data, altchars=b'+/'):
    """Decode base64, padding being optional.

    :param data: Base64 data as an ASCII byte string
    :returns: The decoded byte string.

    """
    data = re.sub(rb'[^a-zA-Z0-9%s]+' % altchars, b'', data)  # normalize
    missing_padding = len(data) % 4
    if missing_padding:
        data += b'='* (4 - missing_padding)
    return base64.b64decode(data, altchars)

class AccessToken:
    def __init__(self, appID="", appCertificate="", channelName="", uid=""):
        random.seed(time.time())
        self.appID = appID
        self.appCertificate = appCertificate
        self.channelName = channelName
        self.ts = int(time.time()) + 24 * 3600
        self.salt = random.randint(1, 99999999)
        self.messages = {}
        if (uid == 0):
            self.uidStr = ""
        else:
            self.uidStr = str(uid)

    def addPrivilege(self, privilege, expireTimestamp):
        self.messages[privilege] = expireTimestamp

    def fromString(self, originToken):
        try:
            dk6version = getVersion()
            originVersion = originToken[:VERSION_LENGTH]
            if (originVersion != dk6version):
                return False

            originAppID = originToken[VERSION_LENGTH:(VERSION_LENGTH + APP_ID_LENGTH)]
            originContent = originToken[(VERSION_LENGTH + APP_ID_LENGTH):]
            originContentDecoded = base64.b64decode(originContent)

            signature, crc_channel_name, crc_uid, m = unPackContent(originContentDecoded)
            self.salt, self.ts, self.messages = unPackMessages(m)

        except Exception as e:
            print(f"error: {e}")
            return False

        return True

    def build(self):
        # with open("/home/cloud-user/test/messi1.txt", "w") as file:
        #     file.write("ok")

        self.messages = OrderedDict(sorted(self.messages.items(), key=lambda x: int(x[0])))

        # with open("/home/cloud-user/test/messi2.txt", "w") as file:
        #     file.write("ok")

        try:
            m = packUint32(self.salt) + packUint32(self.ts) \
                + packMapUint32(self.messages)

        except Exception as e:
            # pass
            with open("/home/cloud-user/test/messi3.txt", "w") as file:
                file.write(str(e) + " " + str(type(self.appID)) + " " + str(type(self.channelName)) + " " + str(type(m)))

        try:
            test = str(m, "latin1")
            val = self.appID + self.channelName + self.uidStr + str(m, "latin1")
            val = bytes(val, "latin1")
        except Exception as e:
            with open("/home/cloud-user/test/messi4.txt", "w") as file:
                file.write(str(e))
                #  + " " + str(type(test)) + " " + str(test))

        # with open("/home/cloud-user/test/messi5.txt", "w") as file:
        #     file.write("ok")

        try:
            signature = hmac.new(bytes(self.appCertificate, "latin1"), val, sha256).digest()
        except Exception as e:
            with open("/home/cloud-user/test/messi5.txt", "w") as file:
                file.write(str(type(self.appCertificate)) + " " + str(type(val)) + " " + str(type(hmac.new(self.appCertificate, val, sha256))))


        try:
            crc_channel_name = crc32(self.channelName.encode("latin1")) & 0xffffffff
            crc_uid = crc32(self.uidStr.encode("latin1")) & 0xffffffff
            content = packString(signature) \
                    + packUint32(crc_channel_name) \
                    + packUint32(crc_uid) \
                    + packString(m)
        except Exception as e:  
            with open("/home/cloud-user/test/messi6.txt", "w") as file:
                file.write(str(packString(m)))

        
        # with open("/home/cloud-user/test/messi7.txt", "w") as file:
        #     file.write("ok")

        # with open("/home/cloud-user/test/messi8.txt", "w") as file:
        #     file.write("ok")

        version = getVersion()

        # with open("/home/cloud-user/test/messi9.txt", "w") as file:
        #     file.write(str(type(version)))

        try:
            bytes_string = decode_base64(content)
            ret = version + self.appID + str(bytes_string, 'latin1')

        except Exception as e:
            with open("/home/cloud-user/test/messi91.txt", "w") as file:
                file.write(str(e))

        # with open("/home/cloud-user/test/messi92.txt", "w") as file:
        #     file.write(ret)

        return ret
