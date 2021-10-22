"""
    TODO: 
        - Make "removeContactAddress" into a delete endpoint instead of a GET
""" 
from flask.globals import session
from app import app, mail
from app.databases import agora_db
from repository import UserRepository, QandARepository, TagRepository, StreamRepository, VideoRepository, TalkRepository, EmailRemindersRepository, ChannelSubscriptionRepository
from repository import ChannelRepository, SearchRepository, TopicRepository, InvitedUsersRepository, MailingListRepository, CreditRepository, ProductRepository, PaymentHistoryRepository, RSScraperRepository
from flask import jsonify, request, send_file
from connectivity.streaming.agora_io.tokengenerators import generate_rtc_token

from payment.apis.StripeApi import StripeApi
from flask import jsonify, request, send_file, render_template
from flask_mail import Message
from werkzeug import exceptions
import os
import time

import stripe

users = UserRepository.UserRepository()
tags = TagRepository.TagRepository()
topics = TopicRepository.TopicRepository()
questions = QandARepository.QandARepository()
streams = StreamRepository.StreamRepository()
talks = TalkRepository.TalkRepository()
emailReminders = EmailRemindersRepository.EmailRemindersRepository()
videos = VideoRepository.VideoRepository()
channels = ChannelRepository.ChannelRepository()
search = SearchRepository.SearchRepository()
invitations = InvitedUsersRepository.InvitedUsersRepository()
mailinglist = MailingListRepository.MailingListRepository()
credits = CreditRepository.CreditRepository()
products = ProductRepository.ProductRepository()
paymentsApi = StripeApi()
channelSubscriptions = ChannelSubscriptionRepository.ChannelSubscriptionRepository()
# paymentHistory = PaymentHistoryRepository.PaymentHistoryRepository()
RSScraper = RSScraperRepository.RSScraperRepository()

# BASE_URL = "http://localhost:3000"
BASE_URL = "https://mora.stream/"

BASE_API_URL = "https://mora.stream/api"
# BASE_API_URL = "http://localhost:8000/api"


# --------------------------------------------
# HELPER FUNCTIONS
# --------------------------------------------
def checkAuth(authHeader):
    if not authHeader:
        return False
    authToken = authHeader.split(" ")[1]
    result = users.decodeAuthToken(authToken)
    return not isinstance(result, str)

def logRequest(request):
    try:
        authToken = request.headers.get('Authorization').split(" ")[1]
        userId = users.decodeAuthToken(authToken)
    except:
        userId = None
    if request.method == "GET":
        app.logger.debug(f"request made to {request.path} with args {request.args} {f'by user with id {userId}' if userId else ''}")
    elif request.method == "POST":
        app.logger.debug(f"request made to {request.path} with body {request.data} {f'by user with id {userId}' if userId else ''}")

# --------------------------------------------
# TOKENS
# --------------------------------------------
@app.route('/tokens/streaming', methods=['GET', 'OPTIONS'])
def generateStreamingToken():
    if request.method == "OPTIONS":
        return jsonify("ok")

    # if not checkAuth(request.headers.get('Authorization')):
    #     return exceptions.Unauthorized("Authorization header invalid or not present")

    try:
        channel_name = request.args.get('channel_name')
        role_attendee = request.args.get('role_attendee') # Either 1) speaker, 2) host, 3) audience
        expire_time_in_sec = request.args.get('expire_time_in_sec')
        try:
            user_account = request.args.get('user_account')
        except:
            user_account = None
        try:
            uid = request.args.get('uid')
        except:
            uid = None
    except Exception as e:
        return jsonify(str(e))

    token = generate_rtc_token(
        channel_name,
        role_attendee,
        expire_time_in_sec,
        user_account,
        uid
    )

    return jsonify(token)

# --------------------------------------------
# USER ROUTES
# --------------------------------------------
@app.route('/users/all')
def getAllUsers():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    return jsonify(users.getAllUsers())

@app.route('/users/public')
def getPublicUsers():
    return jsonify(users.getAllPublicUsers())

@app.route('/users/user')
def getUser():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    username = request.args.get('username')
    return jsonify(users.getUser(username))

@app.route('/users/add', methods=["POST"])
def addUser():
    if request.method == "OPTIONS":
        return jsonify("ok")

    logRequest(request)

    params = request.json
    username = params['username']
    password = params['password']
    email = params['email']
    user = users.addUser(username, password, email)

    if type(user) == list and len(user) > 1 and user[1] == 400:
        app.logger.error(f"Attempted registration of new user with existing email {email}")
        return user

    try:
        invitations.transfertInvitedMembershipsToUser(user, email)
    except:
        # We need to keep trace if an error happens.
        # TODO: add this into logs in a file called "issue to fix manually"
        pass

    app.logger.error(f"Successful registration of new user with username {username} and email {email}")

    accessToken = users.encodeAuthToken(user["id"], "access")
    refreshToken = users.encodeAuthToken(user["id"], "refresh")

    return jsonify({"id": user["id"], "username": user["username"], "accessToken": accessToken.decode(), "refreshToken": refreshToken.decode()})

@app.route('/users/authenticate', methods=["POST", "OPTIONS"])
def authenticate():
    if request.method == "OPTIONS":
        return jsonify("ok")
    logRequest(request)
    params = request.json

    password = params['password']
    credential = params['credential']

    user = users.authenticate(credential, password)

    if user:
        app.logger.debug(f"Successful login for username: {credential}")
    else:
        app.logger.debug(f"Unsuccessful login for username {credential} (incorrect username or password)")
        return exceptions.Unauthorized("Incorrect username or password")


    accessToken = users.encodeAuthToken(user["id"], "access")
    refreshToken = users.encodeAuthToken(user["id"], "refresh")

    return jsonify({"id": user["id"], "username": user["username"], "accessToken": accessToken.decode(), "refreshToken": refreshToken.decode()})


@app.route('/refreshtoken', methods=["POST"])
def refreshAccessToken():
    # if not checkAuth(request.headers.get('Authorization')):
    #     return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    if "userId" not in params:
        return exceptions.BadRequest("userId must be present in request")

    accessToken = users.encodeAuthToken(request.json["userId"], "access")
    return jsonify({"accessToken": accessToken.decode()})

@app.route('/users/email_change_password_link', methods=["POST"])
def generateChangePasswordLink():
    logRequest(request)
    # generate link
    params = request.json
    username = params["username"]
    user = users.getUser(params["username"])
    code = users.encodeAuthToken(user["id"], "changePassword")
    link = f'https://mora.stream:3000/changepassword?code={code.decode()}'
    
    # email link
    msg = Message('mora.stream: password reset', sender = 'team@agora.stream', recipients = [user["email"]])
    msg.body = f'Password reset link: {link}'
    msg.subject = "mora.stream: password reset"
    mail.send(msg)

    app.logger.debug(f"User {username} requested link to change password")
    return "ok"

@app.route('/users/change_password', methods=["POST"])
def changePassword():
    logRequest(request)

    authToken = request.headers.get('Authorization').split(" ")[1]
    userId = users.decodeAuthToken(authToken)
    params = request.json
    users.changePassword(userId, params["password"])

    app.logger.debug(f"User {userId} changed password to {params['password']}")
    return "ok"

@app.route('/users/update_bio', methods=["POST"])
def updateBio():
   authToken = request.headers.get('Authorization').split(" ")[1]
   userId = users.decodeAuthToken(authToken)
   params = request.json
   updatedUser = users.updateBio(userId, params["newBio"])
   return jsonify(updatedUser)

@app.route('/users/update_public', methods=["POST"])
def updatePublic():
    authToken = request.headers.get('Authorization').split(" ")[1]
    userId = users.decodeAuthToken(authToken)
    params = request.json
    updatedUser = users.updatePublic(userId, params["public"])
    return jsonify(updatedUser)


# --------------------------------------------
# CHANNEL ROUTES
# --------------------------------------------
@app.route('/channels/channel', methods=["GET"])
def getChannelByName():
    if "name" in request.args:
        name = request.args.get("name")
        return jsonify(channels.getChannelByName(name))
    elif "id" in request.args:
        id = request.args.get("id")
        return jsonify(channels.getChannelById(id))

@app.route('/channels/all', methods=["GET"])
def getAllChannels():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    return jsonify(channels.getAllChannels(limit, offset))

@app.route('/channels/trending', methods=["GET"])
def getTrendingChannels():
    return jsonify(channels.getTrendingChannels())

@app.route('/channels/foruser', methods=["GET"])
def getChannelsForUser():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    userId = int(request.args.get("userId"))
    roles = request.args.getlist("role")
    return jsonify(channels.getChannelsForUser(userId, roles))

@app.route('/channels/create', methods=["POST", "OPTIONS"])
def createChannel():
    logRequest(request)
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    name = params["name"]
    description = params["description"]
    userId = params["userId"]
    topic1Id = params["topic1Id"]

    #app.logger.debug(f"New agora '{name}' created by user with id {userId}")

    return jsonify(channels.createChannel(name, description, userId, topic1Id))

@app.route('/channels/delete', methods=["POST"])
def deleteChannel():
    params = request.json
    channels.deleteChannel(params["id"])
    return jsonify("ok")

# TODO: merge "addInvitedMembersToChannel" and "addInvitedFollowerToChannel" into the same method.
@app.route('/channels/invite/add/member', methods=["POST", "OPTIONS"])
def addInvitedMembersToChannel():
    logRequest(request)
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    #if not checkAuth(request.headers.get('Authorization')):
    #    return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    
    # NOTE: Method addInvitedUserToChannel has not been implemented for "member".
    invitations.addInvitedUserToChannel(params['emails'], params['channelId'], 'member')
    
    for email in params['emails']:
        app.logger.debug(f"User with email {email} invited to agora with id {params['channelId']}")

    return jsonify("ok")

@app.route('/channels/invite/add/follower', methods=["POST", "OPTIONS"])
def addInvitedFollowerToChannel():
    logRequest(request)
    if request.method == "OPTIONS":
        return jsonify("ok")
    #if not checkAuth(request.headers.get('Authorization')):
    #    return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    invitations.addInvitedUserToChannel(params['emails'], params['channelId'], 'follower')
    for email in params['emails']:
        app.logger.debug(f"User with email {email} invited to agora with id {params['channelId']}")

    return jsonify("ok")

@app.route('/channels/invite/add/follower', methods=["GET"])
def getInvitedMembersForChannel():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    channelId = int(request.args.get("channelId"))
    return jsonify(invitations.getInvitedMembersEmails(channelId))

@app.route('/channels/users/add', methods=["POST", "OPTIONS"])
def addUserToChannel():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    channels.addUserToChannel(params["userId"], params["channelId"], params["role"])
    return jsonify("ok")


@app.route('/channels/users/remove', methods=["POST", "OPTIONS"])
def removeUserForChannel():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    channels.removeUserFromChannel(params["userId"], params["channelId"])
    return jsonify("ok")

@app.route('/channels/users', methods=["GET"])
def getUsersForChannel():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    channelId = int(request.args.get("channelId"))
    roles = request.args.getlist("role")
    return jsonify(channels.getUsersForChannel(channelId, roles))

@app.route('/channels/user/role', methods=["GET"])
def getRoleInChannel():
    channelId = int(request.args.get("channelId"))
    userId = int(request.args.get("userId"))
    return jsonify(channels.getRoleInChannel(channelId, userId))

@app.route('/channels/followercount', methods=["GET"])
def getFollowerCountForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(len(channels.getUsersForChannel(channelId, ["follower"])))

@app.route('/channels/viewcount/get', methods=["GET"])
def getViewCountForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(channels.getChannelViewCount(channelId))

@app.route('/channels/viewcount/add', methods=["POST"])
def increaseViewCountForChannel():
    params = request.json 
    channelId = params["channelId"]
    return jsonify(channels.increaseChannelViewCount(channelId))

@app.route('/channels/updatecolour', methods=["POST", "OPTIONS"])
def updateChannelColour():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")
    params = request.json 
    channelId = params["channelId"]
    newColour = params["newColour"]
    return jsonify(channels.updateChannelColour(channelId, newColour))

@app.route('/channels/updatedescription', methods=["POST", "OPTIONS"])
def updateChannelDescription():
    """TODO: refact this into updateshortdescription and propagate
    NOTE: OLD TECH.
    """
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json 
    channelId = params["channelId"]
    newDescription = params["newDescription"]

    return jsonify(channels.updateChannelDescription(channelId, newDescription))

@app.route('/channels/updatelongdescription', methods=["POST", "OPTIONS"])
def updateLongChannelDescription():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json 
    channelId = params["channelId"]
    newDescription = params["newDescription"]
    return jsonify(channels.updateLongChannelDescription(channelId, newDescription))

@app.route('/channels/avatar', methods=["POST", "GET"])
def avatar():
    if request.method == "OPTIONS":
        return jsonify("ok")

    if request.method == "POST":
        logRequest(request)
        # if not checkAuth(request.headers.get('Authorization')):
        #     return exceptions.Unauthorized("Authorization header invalid or not present")

        channelId = request.form["channelId"]
        file = request.files["image"]
        fn = f"{channelId}.jpg"
        file.save(f"/home/cloud-user/plateform/agora/storage/images/avatars/{fn}")
        channels.addAvatar(channelId)

        app.logger.debug(f"Agora with id {request.form['channelId']} updated avatar")

        return jsonify({"filename": fn})

    if request.method == "GET":
        if "channelId" in request.args:
            channelId = int(request.args.get("channelId"))
            fn = channels.getAvatarLocation(channelId)
            return send_file(fn, mimetype="image/jpg")

@app.route('/channels/cover', methods=["POST", "GET", "DELETE"])
def cover():
    if request.method == "OPTIONS":
        return jsonify("ok")

    if request.method == "POST":
        logRequest(request)
        # if not checkAuth(request.headers.get('Authorization')):
        #     return exceptions.Unauthorized("Authorization header invalid or not present")

        channelId = request.form["channelId"]
        file = request.files["image"]
        print(file)
        fn = f"{channelId}.jpg"
        file.save(f"/home/cloud-user/plateform/agora/storage/images/covers/{fn}")
        channels.addCover(channelId)
        
        app.logger.debug(f"Agora with id {request.form['channelId']} updated banner")

        return jsonify({"filename": fn})

    if request.method == "GET":
        if "channelId" in request.args:
            channelId = int(request.args.get("channelId"))
            fn = channels.getCoverLocation(channelId)
            return send_file(fn, mimetype="image/jpg")

    if request.method == "DELETE":
        params = request.json 
        print(params)
        channelId = params["channelId"]
        channels.removeCover(channelId)

        app.logger.debug(f"Agora with id {channelId} removed banner")

        return jsonify("ok")

@app.route('/channels/contacts', methods=["GET", "OPTIONS"])
def getContactAddresses():
    if "channelId" in request.args: 
        channel_id = request.args.get("channelId")
        res = channels.getEmailAddressesMembersAndAdmins(
            channel_id, 
            getMembersAddress=False, 
            getAdminsAddress=True)
        return jsonify(res)

@app.route('/channels/contact/add', methods=["POST", "OPTIONS"])
def addContactAddress():
    if request.method == "OPTIONS":
        return jsonify("ok")

    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")
    
    if "channelId" in request.args: 
        channelId = request.args.get("channelId")
    else:
        raise Exception("addContactAddress: missing channelId in URL")

    if "contactAddress" in request.args: 
        contactAddress = request.args.get("contactAddress")
    else:
        raise Exception("addContactAddress: missing contactAddress in URL")

    if "userId" in request.args: 
        userId = request.args.get("userId")
    else:
        raise Exception("addContactAddress: missing userId in URL")
    
    channels.addContactAddress(contactAddress, channelId, userId)
    return jsonify("ok")

@app.route('/channels/contact/delete', methods=["GET", "OPTIONS"])
def removeContactAddress():
    """
    TODO: Make this into a DELETE request
    """
    if request.method == "OPTIONS":
        return jsonify("ok")

    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    if "channelId" in request.args: 
        channelId = request.args.get("channelId")
    else:
        raise Exception("addContactAddress: missing channelId in URL")

    if "contactAddress" in request.args: 
        contactAddress = request.args.get("contactAddress")
    else:
        raise Exception("addContactAddress: missing contactAddress in URL")

    if "userId" in request.args: 
        userId = request.args.get("userId")
    else:
        raise Exception("addContactAddress: missing userId in URL")

    # NOTE: For now, we only add 1 email address per agora. 
    # Later, expand frontend to display more.
    # channels.removeContactAddress(contactAddress, channelId, userId)
    channels.removeAllContactAddresses(contactAddress, channelId, userId)
    return jsonify("ok")

@app.route('/channel/apply/talk', methods=["POST"])
def sendTalkApplicationEmail():
    # NOTE: used https://wordtohtml.net/ to easily create syntax for the body
    params = request.json
    try:
        # query email address from administrators 
        channel_id = params['channel_id']
        administrator_emails = channels.getEmailAddressesMembersAndAdmins(
            channel_id,
            getMembersAddress=False, 
            getAdminsAddress=True
        )

        # handling optional field
        if "speaker_personal_website" not in params:
            speaker_personal_website_section = ""
        else:
            if "." not in params['speaker_personal_website']:
                speaker_personal_website_section = ""
            else:
                speaker_personal_website_section =  f"""
                                    <tr>
                                        <td style="width: 45.2381%;">Personal homepage (optional)</td>
                                        <td style="width: 54.5635%;">{params['speaker_personal_website']}</td>
                                    </tr>"""
            
        if "personal_message" not in params:
            personal_message_section = ""
        else:
            personal_message_section = f"""<p><strong>3. Message from the applicant:</strong></p>
                        <p style="margin-left: 20px;">{params["personal_message"]}</p>"""

        # email link
        email_subject = f"New speaker application: mora.stream ({params['agora_name']})"
        body_msg = f"""<p>Dear Administrator,</p>
                        <p>{params['speaker_name']} wants to give a talk within your <b>{params['agora_name']}</b> agora community!</p>
                        <p> </p>
                        <p><strong>1. About the applicant:</strong></p>
                        <table style="width: 61%; margin-right: calc(39%);">
                            <tbody>
                                <tr>
                                    <td style="width: 45.2381%;">Name</td>
                                    <td style="width: 54.5635%;">{params['speaker_title']} {params["speaker_name"]}</td>
                                </tr>
                                <tr>
                                    <td style="width: 45.2381%;">Affiliation</td>
                                    <td style="width: 54.5635%;">{params["speaker_affiliation"]}</td>
                                </tr>
                                <tr>
                                    <td style="width: 45.2381%;">Email of contact</td>
                                    <td style="width: 54.5635%;"><a href="mailto:{params["speaker_email"]}">{params["speaker_email"]}</a></td>
                                </tr>
                                {speaker_personal_website_section}
                            </tbody>
                        </table>
                        <p><strong>2. About the talk:</strong></p>
                        <ul>
                            <li>Title:  <strong>{params['talk_title']}</strong></li>
                            <li>Abstract: <br>{params['talk_abstract']}</li>
                            <li>Topics: {params['talk_topics']}</li>
                        </ul>
                        {personal_message_section}
                        <br></br>
                        <p>Best wishes,</p>
                        <p>The mora.stream Team</p>
                    """
        for email in administrator_emails:
            msg = Message(body_msg, sender = 'team@agora.stream', recipients = [email])
            msg.html = body_msg
            msg.subject = email_subject
            mail.send(msg)
        return "ok"
    
    except Exception as e:
        return str(e)

@app.route('/channel/edit/topic', methods=["POST", "OPTIONS"])
def editChannelTopic():
    logRequest(request)
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json

    #app.logger.debug(f"channel with id {params['channelId']} edited")
    return jsonify(channels.editChannelTopic(params["channelId"], params["topic1Id"], params["topic2Id"], params["topic3Id"]))

@app.route('/channels/topics/fetch', methods=["GET", "OPTIONS"])
def getChannelTopic():
    if request.method == "OPTIONS":
        return jsonify("ok")

    channelId = int(request.args.get("channelId"))
    return jsonify(channels.getChannelTopic(channelId))

@app.route('/channels/topics/all', methods=["GET"])
def getChannelsWithTopic():
    limit = int(request.args.get("limit"))
    topicId = int(request.args.get("topicId"))
    offset = int(request.args.get("offset"))
    return jsonify(channels.getChannelsWithTopic(limit, topicId, offset))

# --------------------------------------------
# x mailing list methods
# --------------------------------------------
@app.route('/channels/mailinglist/add', methods=["POST", "OPTIONS"])
def addToMailingList():
    if request.method == "OPTIONS":
        return jsonify("ok")
    # if not checkAuth(request.headers.get('Authorization')):
    #     return exceptions.Unauthorized("Authorization header invalid or not present")
    params = request.json

    return jsonify(mailinglist.addToMailingList(params['channelId'], params['emails']))

@app.route('/channels/mailinglist', methods=["GET", "OPTIONS"])
def getMailingList():
    if request.method == "OPTIONS":
        return jsonify("ok")

    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    channelId = int(request.args.get("channelId"))
    return jsonify(mailinglist.getMailingList(channelId))

# --------------------------------------------
# x Membership ROUTES
# --------------------------------------------
@app.route('/channel/membership/apply', methods=["POST"])
def applyMembership():
    params = request.json

    # Compulsory details
    personal_homepage = params["personalHomepage"] if "personalHomepage" in params else None

    res = channels.applyMembership(
        params["id"], 
        params["userId"], 
        params["fullName"],  # this will be removed later when user will have a good profile
        params["position"],  # this will be removed later when user will have a good profile
        params["institution"],  # this will be removed later when user will have a good profile
        params["email"],  # this will be removed later when user will have a good profile
        personal_homepage)

    return res

@app.route('/channel/membership/cancel', methods=["POST"])
def cancelMembershipApplication():
    params = request.json

    res = channels.cancelMembershipApplication(
        params["id"], 
        params["userId"])

    return jsonify(res)

@app.route('/channel/membership/accept', methods=["POST"])
def acceptMembershipApplication():
    params = request.json

    res = channels.acceptMembershipApplication(
        params["id"], 
        params["userId"],
        )
    return jsonify(res)

@app.route('/channel/membership/list', methods=["GET"])
def getMembershipApplications():
    channelId = int(request.args.get("channelId"))
    userId = int(request.args.get("userId")) if "userId" in request.args else None

    res = channels.getMembershipApplications(
        channelId, 
        userId,
        )
    return jsonify(res)

# --------------------------------------------
# STREAM ROUTES
# --------------------------------------------
@app.route('/streams/all', methods=["GET"])
def getAllStreams():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    return jsonify(streams.getAllStreams(limit, offset))

@app.route('/streams/channel', methods=["GET"])
def getStreamsForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(streams.getStreamsForChannel(channelId))

@app.route('/streams/stream', methods=["GET"])
def getStreamById():
    id = int(request.args.get("id"))
    return jsonify(streams.getStreamById(id))

@app.route('/streams/create', methods=["POST", "OPTIONS"])
def createStream():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    stream = streams.createStream(params["channelId"], params["channelName"], params["streamName"], params["streamDescription"], params["streamTags"], params["imageUrl"])
    return jsonify(stream)

@app.route('/streams/archive', methods=["POST", "OPTIONS"])
def archiveStream():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    videoId = streams.archiveStream(params["streamId"], params["delete"])
    return jsonify({"videoId": videoId})

@app.route('/streams/stream/thumbnail', methods=["GET"])
def serveThumbnail():
    streamId = int(request.args.get("streamId"))
    fn = f"/usr/local/antmedia/webapps/WebRTCAppEE/previews{streamId}.png"
    return send_file(fn, mimetype="image/png")

# --------------------------------------------
# TALK ROUTES
# -------------------------------------------- 
@app.route('/talk/info', methods=["GET"])
def getTalkById():
    # TODO: Fix bug with "getAllFutureTalks" that does not exist for in TalkRepository.
    # Q from Remy: when do we use this actually? I think it has been replaced by getAllFutureTalksForTopicWithChildren
    talkId = int(request.args.get("id"))
    try:
        return jsonify(talks.getTalkById(talkId))
    except Exception as e:
        return jsonify(str(e))

@app.route('/talks/all/future', methods=["GET"])
def getAllFutureTalks():
    # TODO: Fix bug with "getAllFutureTalks" that does not exist for in TalkRepository.
    # Q from Remy: when do we use this actually? I think it has been replaced by getAllFutureTalksForTopicWithChildren
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))

    try:
        user_id = int(request.args.get("offset"))
        return jsonify(talks.getAllFutureTalks(limit, offset, user_id))
    except:
        return jsonify(talks.getAllFutureTalks(limit, offset))

@app.route('/talks/all/current', methods=["GET"])
def getAllCurrentTalks():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    data = talks.getAllCurrentTalks(limit, offset)
    return jsonify({"talks": data[0],"count": data[1]})

@app.route('/talks/all/past', methods=["GET"])
def getAllPastTalks():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    data = talks.getAllPastTalks(limit, offset)
    return jsonify({"talks": data[0],"count": data[1]})

@app.route('/talks/channel/future', methods=["GET"])
def getAllFutureTalksForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(talks.getAllFutureTalksForChannel(channelId))

@app.route('/talks/channel/current', methods=["GET"])
def getAllCurrentTalksForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(talks.getAllCurrentTalksForChannel(channelId))

@app.route('/talks/channel/drafted', methods=["GET"])
def getAllDraftedTalksForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(talks.getAllDraftedTalksForChannel(channelId))

@app.route('/talks/channel/past', methods=["GET"])
def getAllPastTalksForChannel():
    channelId = int(request.args.get("channelId"))
    data = talks.getAllPastTalksForChannel(channelId)
    return jsonify({"talks": data[0], "count": data[1]})

@app.route('/talks/tag/past', methods=["GET"])
def getAllPastTalksForTag():
    tagName = request.args.get("tagName")
    data = talks.getPastTalksForTag(tagName)
    return jsonify({"talks": data[0], "count": data[1]})

@app.route('/talks/topic/future', methods=["GET"])
def getAllFutureTalksForTopic():
    topicId = int(request.args.get("topicId"))
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    return jsonify(talks.getAllFutureTalksForTopic(topicId, limit, offset))

@app.route('/talks/topic/children/future', methods=["GET"])
def getAllFutureTalksForTopicWithChildren():
    topicId = int(request.args.get("topicId"))
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    return jsonify(talks.getAllFutureTalksForTopicWithChildren(topicId, limit, offset))

@app.route('/talks/topic/past', methods=["GET"])
def getAllPastTalksForTopic():
    topicId = int(request.args.get("topicId"))
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    return jsonify(talks.getAllPastTalksForTopic(topicId, limit, offset))

@app.route('/talks/available/future', methods=["GET"])
def getAvailableFutureTalks():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    user_id = request.args.get("userId")
    user_id = int(user_id) if user_id != 'null' else None
    return jsonify(talks.getAvailableFutureTalks(limit, offset, user_id))

@app.route('/talks/available/current', methods=["GET"])
def getAvailableCurrentTalks():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    user_id = request.args.get("userId")
    user_id = int(user_id) if user_id != 'null' else None
    data = talks.getAvailableCurrentTalks(limit, offset, user_id)
    return jsonify({"talks": data[0],"count": data[1]})

@app.route('/talks/available/past', methods=["GET"])
def getAvailablePastTalks():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    user_id = request.args.get("userId")
    user_id = int(user_id) if user_id != 'null' else None
    data = talks.getAvailablePastTalks(limit, offset, user_id)
    return jsonify({"talks": data[0],"count": data[1]})

@app.route('/talks/channel/available/future', methods=["GET"])
def getAvailableFutureTalksForChannel():
    channel_id = int(request.args.get("channelId"))
    user_id = request.args.get("userId")
    user_id = int(user_id) if user_id != 'null' else None
    return jsonify(talks.getAvailableFutureTalksForChannel(channel_id, user_id))

@app.route('/talks/channel/available/current', methods=["GET"])
def getAvailableCurrentTalksForChannel():
    channel_id = int(request.args.get("channelId"))
    user_id = request.args.get("userId")
    user_id = int(user_id) if user_id != 'null' else None
    return jsonify(talks.getAvailableCurrentTalksForChannel(channel_id, user_id))

@app.route('/talks/channel/available/past', methods=["GET"])
def getAvailablePastTalksForChannel():
    channel_id = int(request.args.get("channelId"))
    user_id = request.args.get("userId")

    try:
        user_id = int(user_id)
    except:
        user_id = None

    return jsonify(talks.getAvailablePastTalksForChannel(channel_id, user_id))

@app.route('/talks/create', methods=["POST", "OPTIONS"])
def scheduleTalk():
    logRequest(request)
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json

    for topic_key in ["topic1Id", "topic2Id", "topic3Id"]:
        if topic_key not in params:
            params[topic_key] = 0

    app.logger.debug(f"New talk with title {params['talkName']} created by agora {params['channelName']}")
    return jsonify(talks.scheduleTalk(params["channelId"], params["channelName"], params["talkName"], params["startDate"], params["endDate"], params["talkDescription"], params["talkLink"], params["talkTags"], params["showLinkOffset"], params["visibility"], params["cardVisibility"], params["topic1Id"], params["topic2Id"], params["topic3Id"], params["talkSpeaker"], params["talkSpeakerURL"], params["published"], params["audienceLevel"], params["autoAcceptGroup"], params["autoAcceptCustomInstitutions"], params["customInstitutionsIds"],  params["reminder1"], params["reminder2"], params["reminderEmailGroup"]))

@app.route('/talks/sendemailedit', methods=["GET", "OPTIONS"])
def sendEmailonTalkModification():
    if request.method == "OPTIONS":
        return jsonify("ok")
    
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")
        
    talk_id = int(request.args.get("talkId"))
    return jsonify(talks.sendEmailonTalkModification(talk_id))

@app.route('/talks/sendemailschedule', methods=["GET", "OPTIONS"])
def sendEmailonTalkScheduling():
    if request.method == "OPTIONS":
        return jsonify("ok")
    
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")
        
    talk_id = int(request.args.get("talkId"))
    return jsonify(talks.sendEmailonTalkScheduling(talk_id))

@app.route('/talks/edit', methods=["POST", "OPTIONS"])
def editTalk():
    logRequest(request)
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")
    try:
        params = request.json

        for topic_key in ["topic1Id", "topic2Id", "topic3Id"]:
            if topic_key not in params:
                params[topic_key] = 0

        app.logger.debug(f"Talk with id {params['talkId']} edited")
        return jsonify(talks.editTalk(params["channelId"], params["talkId"], params["talkName"], params["startDate"], params["endDate"], params["talkDescription"], params["talkLink"], params["talkTags"], params["showLinkOffset"], params["visibility"], params["cardVisibility"], params["topic1Id"], params["topic2Id"], params["topic3Id"], params["talkSpeaker"], params["talkSpeakerURL"], params["published"], params["audienceLevel"], params["autoAcceptGroup"], params["autoAcceptCustomInstitutions"], params["reminder1"], params["reminder2"], params["reminderEmailGroup"]))

    except Exception as e:
        return str(e)

@app.route('/talks/speakerphoto', methods=["POST", "GET", "DELETE"])
def speakerPhoto():
    if request.method == "OPTIONS":
        return jsonify("ok")

    if request.method == "POST":
        logRequest(request)
        # if not checkAuth(request.headers.get('Authorization')):
        #     return exceptions.Unauthorized("Authorization header invalid or not present")

        talkId = request.form["talkId"]
        file = request.files["image"]
        fn = f"{talkId}.jpg"
        file.save(f"/home/cloud-user/plateform/agora/storage/images/speakers/{fn}")
        talks.addSpeakerPhoto(talkId)
        
        app.logger.debug(f"Talk with id {talkId} updated speaker photo")

        return jsonify({"filename": fn})

    if request.method == "GET":
        if "talkId" in request.args:
            talkId = int(request.args.get("talkId"))
            fn = talks.getSpeakerPhotoLocation(talkId)
            return send_file(fn, mimetype="image/jpg") if fn != "" else jsonify("None")

    if request.method == "DELETE":
        params = request.json 
        print(params)
        talkId = params["talkId"]
        talks.removeSpeakerPhoto(talkId)

        app.logger.debug(f"Talk with id {talkId} remove speaker speaker photo")

        return jsonify("ok")

@app.route('/talks/editCustomInstitutions', methods=['POST', 'OPTIONS'])
def editAutoAcceptanceCustomInstitutions():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json

    return jsonify(talks.editAutoAcceptanceCustomInstitutions(params["talkId"], params["institutionIds"]))


@app.route('/talks/delete', methods=["OPTIONS", "POST"])
def deleteTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    app.logger.debug(f"Talk with id {params['id']} deleted")
    return jsonify(talks.deleteTalk(params['id']))

@app.route('/talks/add-recording', methods=["OPTIONS", "POST"])
def addRecordingLink():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    return jsonify(talks.addRecordingLink(params["talkId"], params["link"]))

@app.route('/talks/saved', methods=["GET"])
def getSavedTalks():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    userId = int(request.args.get("userId"))
    return jsonify(talks.getSavedTalksForUser(userId))

@app.route('/talks/save', methods=["POST", "OPTIONS"])
def saveTalk():
    logRequest(request)
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    talks.saveTalk(params["talkId"], params["userId"])
    app.logger.debug(f"User with id {params['userId']} saved talk with id {params['talkId']}")
    return jsonify("ok")

@app.route('/talks/unsave', methods=["POST", "OPTIONS"])
def unsaveTalk():
    logRequest(request)
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    talks.unsaveTalk(params["talkId"], params["userId"])
    app.logger.debug(f"User with id {params['userId']} unsaved talk with id {params['talkId']}")
    return jsonify("ok")

@app.route('/talks/issaved', methods=["GET"])
def isSaved():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    userId = int(request.args.get("userId"))
    talkId = int(request.args.get("talkId"))
    return jsonify({"is_saved": talks.hasUserSavedTalk(talkId, userId)})

@app.route('/talks/isavailable', methods=["GET"])
def isAvailable():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    userId = int(request.args.get("userId"))
    talkId = int(request.args.get("talkId"))
    return jsonify(talks.isTalkAvailableToUser(talkId, userId))

@app.route('/talks/trending', methods=["GET"])
def getTrendingTalks():
    return jsonify(talks.getTrendingTalks())


@app.route('/talks/reminders/time', methods=["GET"])
def getReminderTime():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    talkId = int(request.args.get("talkId"))
    return jsonify(emailReminders.getReminderTime(talkId))

@app.route('/talks/reminders/group', methods=["GET"])
def getReminderGroup():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    talkId = int(request.args.get("talkId"))
    return jsonify(emailReminders.getReminderGroup(talkId))


# --------------------------------------------
# TALK ANALYTICS
# --------------------------------------------
@app.route('/talks/viewcount/get', methods=["GET"])
def getViewCountForTalk():
    channelId = int(request.args.get("channelId"))
    return jsonify(talks.getTalkViewCount(channelId))

@app.route('/talks/viewcount/add', methods=["POST"])
def increaseViewCountForTalk():
    params = request.json 
    channelId = params["channelId"]
    return jsonify(talks.increaseTalkViewCount(channelId))


# --------------------------------------------
# TALK ACCESS REQUESTS ROUTES
# --------------------------------------------
@app.route('/talks/requestaccess/register', methods=["POST"])
def registerTalk():
    # if not checkAuth(request.headers.get('Authorization')):
    #     return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    try:
        talkId = params["talkId"]
        userId = params["userId"] if "userId" in params else ""
        name = params["name"]
        email = params["email"]
        website = params["website"] if "website" in params else ""
        institution = params["institution"] if "institution" in params else ""
        user_hour_offset = params["userHourOffset"]

        res = talks.registerTalk(talkId, userId, name, email, website, institution, user_hour_offset)
        return jsonify(str(res))

    except Exception as e:
        return jsonify(str(e))

@app.route('/talks/requestaccess/unregister', methods=["POST", "OPTIONS"])
def unregisterTalk():
    logRequest(request)
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    try:
        requestRegistrationId = params["requestRegistrationId"]
        userId = params["userId"] if "userId" in params else None 
        talks.unregisterTalk(requestRegistrationId, userId)
        return jsonify("ok")

    except Exception as e:
        return jsonify(400, str(e))

@app.route('/talks/requestaccess/refuse', methods=["POST", "OPTIONS"])
def refuseTalkRegistration():
    #TODO: test
    logRequest(request)
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    try:
        requestRegistrationId = params["requestRegistrationId"]
        res = talks.refuseTalkRegistration(requestRegistrationId)
        if res == "ok":
            return jsonify("ok")
        else:
            return jsonify(500, str(res))

    except Exception as e:
        return jsonify(400, str(e))

@app.route('/talks/requestaccess/accept', methods=["POST", "OPTIONS"])
def acceptTalkRegistration():
    #TODO: test
    logRequest(request)
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    try:
        requestRegistrationId = params["requestRegistrationId"]
        res = talks.acceptTalkRegistration(requestRegistrationId)
        return jsonify(str(res))

    except Exception as e:
        return jsonify(400, str(e))

@app.route('/talks/requestaccess/all', methods=["GET", "OPTIONS"])
def getTalkRegistrations():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    channelId = request.args.get("channelId") if "channelId" in request.args else None
    talkId = request.args.get("talkId") if "talkId" in request.args else None
    userId = request.args.get("userId") if "userId" in request.args else None
    try:
        if channelId != None:
            res = talks.getTalkRegistrationsForChannel(channelId)
            return jsonify(res)
        elif talkId != None:
            res = talks.getTalkRegistrationsForTalk(talkId)
            return jsonify(res)
        elif userId != None:
            res = talks.getTalkRegistrationsForUser(userId)
            return jsonify(res)

    except Exception as e:
        return jsonify(400, str(e))

@app.route('/talks/registrationstatus', methods=["GET"])
def registrationStatusForTalk():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    talkId = int(request.args.get("talkId"))
    userId = int(request.args.get("userId"))
        
    return jsonify(talks.registrationStatusForTalk(talkId, userId))

# --------------------------------------------
# Talks: presentation slides routes
# --------------------------------------------
@app.route('/talks/slides', methods=["POST", "GET", "DELETE"])
def presentationSlides():
    # NOTE: pdf only atm.
    try:
        if request.method == "OPTIONS":
            return jsonify("ok")

        if request.method == "POST":
            logRequest(request)
            # if not checkAuth(request.headers.get('Authorization')):
            #     return exceptions.Unauthorized("Authorization header invalid or not present")
            talkId = request.form["talkId"]
            file = request.files["slides"]
            print(file)
            fn = f"{talkId}.pdf"
            file.save(f"/home/cloud-user/plateform/agora/storage/slides/{fn}")
            talks.addSlides(talkId)
            
            return jsonify({"filename": fn})
            
        if request.method == "GET":
            if "talkId" in request.args:
                talkId = int(request.args.get("talkId"))
                fn = talks.getSlidesLocation(talkId)
                if fn is not None:
                    return send_file(fn, mimetype="application/pdf")
                else:
                    return jsonify({"hasSlides": False})


        if request.method == "DELETE":
            params = request.json 
            talkId = params["talkId"]
            talks.deleteSlides(talkId)

            app.logger.debug(f"talk with id {talkId} removed slides")

            return jsonify("ok")
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/talks/hasslides', methods=["GET"])
def hasSlides():
    # NOTE: pdf only atm.
    if request.method == "GET":
        try:
            if "talkId" in request.args:
                talkId = int(request.args.get("talkId"))
                fn = talks.getSlidesLocation(talkId)
                if fn is not None:
                    return jsonify({"hasSlides": True})
                else:
                    return jsonify({"hasSlides": False})
        except Exception as e:
            return jsonify({"error": str(e)})
# --------------------------------------------
# VOD ROUTES
# --------------------------------------------
@app.route('/videos/all', methods=["GET"])
def getAllVideos():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    data = videos.getAllVideos(limit, offset)
    return jsonify({"videos": data[0],"count": data[1]})
    # return jsonify({ videos.getAllVideos(limit, offset)})

@app.route('/videos/recent', methods=["GET"])
def getRecentVideos():
    return jsonify(videos.getRecentVideos())

@app.route('/videos/channel', methods=["GET"])
def getAllVideosForChannel():
    channelId = int(request.args.get("channelId"))
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    data = videos.getAllVideosForChannel(channelId, limit, offset)
    return jsonify({"videos": data[0],"count": data[1]})

@app.route('/videos/video', methods=["GET"])
def getVideoById():
    id = int(request.args.get("id"))
    return jsonify(videos.getVideoById(id))

@app.route('/videos/tag', methods=["GET"])
def getVideosWithTag():
    tagName = request.args.get("tagName")
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    data = videos.getAllVideosWithTag(tagName, limit, offset)
    return jsonify({"videos": data[0],"count": data[1]})

@app.route('/videos/topic', methods=["GET"])
def getVideosByTag():
    raise NotImplementedError

# --------------------------------------------
# Q+A ROUTES
# --------------------------------------------
@app.route('/questions', methods=["GET"])
def getAllQuestionsForStream():
    streamId = request.args.get("streamId")
    videoId = request.args.get("videoId")
    if streamId != None:
        res = questions.getAllQuestionsForStream(streamId=int(streamId))
    else:
        res = questions.getAllQuestionsForStream(videoId=int(videoId))
    return jsonify(res)

@app.route('/questions/ask', methods=["POST", "OPTIONS"])
def askQuestion():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    userId = params["userId"]
    content = params["content"]

    if "streamId" in params:
        return jsonify(questions.createQuestion(userId, content, streamId=params["streamId"]))
    return jsonify(questions.createQuestion(userId, content, videoId=params["videoId"]))

@app.route('/questions/answer', methods=["POST", "OPTIONS"])
def answerQuestion():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    userId = params["userId"]
    questionId = params["questionId"]
    content = params["content"]
    return jsonify(questions.answerQuestion(userId, questionId, content))

@app.route('/questions/upvote', methods=["POST", "OPTIONS"])
def upvoteQuestion():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    questionId = params["questionId"]
    userId = params["userId"]
    return jsonify(questions.upvoteQuestion(questionId, userId))

@app.route('/questions/downvote', methods=["POST", "OPTIONS"])
def downvoteQuestion():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    questionId = params["questionId"]
    userId = params["userId"]
    return jsonify(questions.downvoteQuestion(questionId, userId))

@app.route('/questions/answer/upvote', methods=["POST", "OPTIONS"])
def upvoteAnswer():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    answerId = params["answerId"]
    userId = params["userId"]
    return jsonify(questions.upvoteAnswer(answerId, userId))

@app.route('/questions/answer/downvote', methods=["POST", "OPTIONS"])
def downvoteAnswer():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    answerId = params["answerId"]
    userId = params["userId"]
    return jsonify(questions.downvoteAnswer(answerId, userId))

@app.route('/questions/upvote/remove', methods=["POST", "OPTIONS"])
def removeQuestionUpvote():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    questionId = params["questionId"]
    userId = params["userId"]
    return jsonify(questions.removeQuestionUpvote(questionId, userId))

@app.route('/questions/downvote/remove', methods=["POST", "OPTIONS"])
def removeQuestionDownvote():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    questionId = params["questionId"]
    userId = params["userId"]
    return jsonify(questions.removeQuestionDownvote(questionId, userId))

@app.route('/questions/answer/upvote/remove', methods=["POST", "OPTIONS"])
def removeAnswerUpvote():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    answerId = params["answerId"]
    userId = params["userId"]
    return jsonify(questions.removeAnswerUpvote(answerId, userId))

@app.route('/questions/answer/downvote/remove', methods=["POST", "OPTIONS"])
def removeAnswerDownvote():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    answerId = params["answerId"]
    userId = params["userId"]
    return jsonify(questions.removeAnswerDownvote(answerId, userId))

# --------------------------------------------
# TAG ROUTES
# --------------------------------------------
@app.route('/tags/all', methods=["GET", "OPTIONS"])
def getAllTags():
    return jsonify(tags.getAllTags())

@app.route('/tags/popular', methods=["GET"])
def getPopularTags():
    n = int(request.args.get("n"))
    return jsonify(tags.getPopularTags(n))

@app.route('/tags/add', methods=["POST", "OPTIONS"])
def addTag():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    name = params["name"]
    return jsonify(tags.addTag(name))

@app.route('/tags/tagstream', methods=["POST", "OPTIONS"])
def tagStream():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    return jsonify(tags.tagStream(params["streamId"], params["tagIds"]))

@app.route('/tags/stream', methods=["GET"])
def getTagsOnStream():
    streamId = int(request.args.get("streamId"))
    return jsonify(tags.getTagsOnStream(streamId))

# --------------------------------------------
# TOPICS ROUTES
# --------------------------------------------
@app.route('/topics/all', methods=["GET", "OPTIONS"])
def getAllTopics():
    if request.method == "OPTIONS":
        return jsonify("ok")
    return jsonify(topics.getAllTopics())

@app.route('/topics/treestructure', methods=["GET", "OPTIONS"])
def getDataTreeStructure():
    if request.method == "OPTIONS":
        return jsonify("ok")
    return jsonify(tags.getAllTags())
    # return jsonify(topics.getDataTreeStructure())

@app.route('/topics/popular', methods=["GET"])
def getPopularTopics():
    # n = int(request.args.get("n"))
    # return jsonify(topics.getPopularTopics(n))
    raise NotImplementedError("not implemented yet")

@app.route('/topics/addtopicstream', methods=["POST", "OPTIONS"])
def addTopicOnStream():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")
    # if request.method == "OPTIONS":
    #     return jsonify("ok")
    # params = request.json
    # return jsonify(tags.tagStream(params["streamId"], params["tagIds"]))
    raise NotImplementedError

@app.route('/topics/stream', methods=["GET"])
def getTopicsOnStream():
    # streamId = int(request.args.get("streamId"))
    # return jsonify(tags.getTagsOnStream(streamId))
    raise NotImplementedError

@app.route('/topics/getField', methods=["GET"])
def getFieldFromId():
    if request.method == "OPTIONS":
        return jsonify("ok")

    topicId = request.args.get("topicId")
    return jsonify(topics.getFieldFromId(topicId)) 

# --------------------------------------------
# SEARCH ROUTES
# --------------------------------------------
@app.route('/search', methods=["POST", "OPTION"])
def fullTextSearch():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    objectTypes = params["objectTypes"]
    searchString = params["searchString"]
    results = {objectType: search.searchTable(objectType, searchString) for objectType in objectTypes}
    return jsonify(results)

# --------------------------------------------
# METATAG ROUTES (this is a hack for link sharing on social media)
# --------------------------------------------
@app.route('/event-link', methods=["GET"])
def eventLinkRedirect():
    try:
        eventId = request.args.get("eventId")
        talk_info = talks.getTalkById(eventId)
        title = talk_info["name"]
        description = talk_info["description"]
        channel_name = talk_info["channel_name"]
        channel_id = channels.getChannelByName(channel_name)["id"]

        real_url = f"https://mora.stream/event/{eventId}"
        hack_url = f"{BASE_API_URL}/event-link?eventId={eventId}"
        image = f"{BASE_API_URL}/channels/avatar?channelId={channel_id}"

        res_string = f'''
            <html>
                <head>
                    <title>{title}</title>
                    <meta property="title" content="{title}" />
                    <meta name="description" content="{description}" />
                    <meta property="og:title" content="{title}" />
                    <meta property="og:description" content="{description}" />
                    <meta property="og:url" content="{hack_url}" />
                    <meta property="og:image" content="{image}" />
                    <meta property="og:type" content="article" />
                    <meta http-equiv="refresh" content="1; URL='{real_url}'" />
                </head>
            </html>
        '''
        return render_template(res_string)
    except Exception as e:
        return str(e)

@app.route('/channel-link', methods=["GET"])
def channelLinkRedirect():
    try:
        channel_id = request.args.get("channelId")
        channel_info = channels.getChannelById(channel_id)
        name = channel_info["name"]
        long_description = channel_info["long_description"]
        real_url = f"https://mora.stream/{name}"
        hack_url = f"{BASE_API_URL}/channel-link?channelId={channel_id}"
        image = f"{BASE_API_URL}/api/channels/avatar?channelId={channel_id}"

        res_string = f'''
            <html>
                <head>
                    <title>{name}</title>
                    <meta property="title" content="{name}" />
                    <meta name="description" content="{long_description}" />
                    <meta property="og:title" content="{name}" />
                    <meta property="og:description" content="{long_description}" />
                    <meta property="og:url" content="{hack_url}" />
                    <meta property="og:image" content="{image}" />
                    <meta property="og:type" content="article" />
                    <meta http-equiv="refresh" content="1; URL='{real_url}'" />
                </head>
            </html>
        '''
        return render_template(res_string)
    except Exception as e:
        return jsonify(str(e))

# --------------------------------------------
# Products
# --------------------------------------------
@app.route('/products/streaming', methods=["GET"])
def getStreamingProductById():
    err = ""
    try:
        product_id = request.args.get("id")
        return jsonify(
            products.getStreamingProductById(product_id)
            )
    except Exception as e:
        err = str(e) + "; "

    try:
        tier = request.args.get("tier") # = tier1 and tier2
        product_type = request.args.get("productType") # = 'credits' or 'subscription'
        aud_size = request.args.get("audienceSize") # = 'small' or 'big'
        
        return jsonify(
            products.getStreamingProductByFeatures(tier, product_type, aud_size)
            )
    except Exception as e:
        err += str(e)

    return jsonify(e)

@app.route('/products/streaming/all', methods=["GET"])
def getAllStreamingProducts():
    try:
        return jsonify(products.getAllStreamingProducts())
    except Exception as e:
        return jsonify(str(e))

# --------------------------------------------
# CREDITS
# --------------------------------------------
@app.route('/credits/talk/used', methods=["GET"])
def getUsedStreamCreditForTalk():
    try:
        talk_id = request.args.get("talkId")
        return jsonify(credits.getUsedStreamCreditForTalk(talk_id))
    except Exception as e:
        return jsonify(str(e))

@app.route('/credits/channel/available', methods=["GET"])
def getAvailableStreamCreditForChannel():
    try:
        channel_id = request.args.get("channelId")
        return jsonify(credits.getAvailableStreamCreditForChannel(channel_id))
    except Exception as e:
        return jsonify(str(e))

@app.route('/credits/talk/available', methods=["GET"])
def getAvailableStreamCreditForTalk():
    try:
        talk_id = request.args.get("talkId")
        return jsonify(credits.getAvailableStreamCreditForTalk(talk_id))
    except Exception as e:
        return jsonify(str(e))

@app.route('/credits/talk/add', methods=["GET"])
def addStreamCreditToTalk():
    try:
        talk_id = request.args.get("talkId")
        increment = request.args.get("increment")

        return jsonify(credits.addStreamCreditToTalk(talk_id, increment))
    except Exception as e:
        return jsonify(str(e))

@app.route('/credits/channel/add', methods=["GET"])
def addStreamingCreditToChannel():
    try:
        channel_id = request.args.get("channelId")
        increment = request.args.get("increment")

        return jsonify(credits.addStreamingCreditToChannel(channel_id, increment))
    except Exception as e:
        return jsonify(str(e))

@app.route('/credits/talk/increment', methods=["GET"])
def upgradeStreamTalkByOne():
    try:
        talk_id = request.args.get("talkId")
        return jsonify(credits.upgradeStreamTalkByOne(talk_id))
    except Exception as e:
        return jsonify(str(e))

@app.route('/credits/talk/max_audience', methods=["GET"])
def getMaxAudienceForCreditForTalk():
    try:
        talk_id = request.args.get("talkId")
        return jsonify(credits.getMaxAudienceForCreditForTalk(talk_id))
    except Exception as e:
        return jsonify(str(e))

# --------------------------------------------
# SUBSCRIPTIONS
# --------------------------------------------
@app.route('/subscriptions/channel', methods=["GET"])
def getActiveSubscriptionForChannel():
    try:
        channel_id = request.args.get("channelId")
        product_id = request.args.get("productId")

        return jsonify(channelSubscriptions.getActiveSubscriptionId(channel_id, product_id))
    except Exception as e:
        return jsonify(str(e))

@app.route('/subscriptions/channel/all', methods=["GET"])
def getAllActiveSubscriptionsForChannel():
    try:
        channel_id = request.args.get("channelId")
        active_subs = channelSubscriptions.getActiveSubscriptions(channel_id)
        return jsonify([sub['product_id'] for sub in active_subs])
        
    except Exception as e:
        return jsonify(str(e))

@app.route('/subscriptions/channel/cancel', methods=["GET"])
def cancelSubscriptionForChannel():
    try:
        channel_id = request.args.get("channelId")
        product_id = request.args.get("productId")

        # get subscription_id
        subscription_id = channelSubscriptions.getActiveSubscriptionId(channel_id, product_id)

        # set stop subscription date in stripe
        paymentsApi.stopSubscriptionRenewal(subscription_id)

        # status to "interrupted" in DB 
        channelSubscriptions.interruptSubscription(subscription_id)
        
        return "ok"
    except Exception as e:
        return jsonify(str(e))

@app.route('/subscriptions/channel/cancelall', methods=["GET"])
def cancelAllSubscriptionsForChannel():
    try:
        channel_id = request.args.get("channelId")

        # A. get all active channel subscriptions and cancel all of them
        # get subscription_id
        subscriptions = channelSubscriptions.getActiveSubscriptions(channel_id)
        for subscription in subscriptions:
            sub_id = subscription["stripe_subscription_id"]

            # set stop subscription date in stripe
            paymentsApi.stopSubscriptionRenewal(sub_id)

            # status to "interrupted" in DB 
            channelSubscriptions.interruptSubscription(sub_id)
        
        return "ok"
    except Exception as e:
        return jsonify(str(e))

# --------------------------------------------
# PAYMENTS
# --------------------------------------------
@app.route('/payment/create-checkout-session', methods=["GET"])
def getStripeSessionForProduct():
    product_id = request.args.get("productId")
    user_id = request.args.get("userId")
    quantity = request.args.get("quantity")

    try:
        # TODO: generalisation for later:
        # product_class = products.getProductlassFromId(product_id)
        product_class = "channel_subscription"

        if product_class == "channel_subscription":
            channel_id = request.args.get("channelId")
            
            success_url = os.path.join(BASE_URL, "thankyou", "success", channel_id)
            url_cancel = os.path.join(BASE_URL, "thankyou", "error", channel_id)
            
            # Create checkout session
            res = paymentsApi.get_session_for_streaming_products(
                product_id,
                success_url,
                url_cancel,
                quantity
            )

            # Store checkoutId in DB
            channelSubscriptions._addCheckoutSubscription(
                product_id,
                res["checkout_session_id"],
                channel_id,
                user_id
                )
            
            return jsonify(res)
    except Exception as e:
        return jsonify(str(e))

# NOTE: handling of responses Stripe after checkouts and invoices
@app.route('/payment/stripe_webhook', methods=['POST'])
def stripe_webhook():
    '''
    Hack to handle events easily: https://codenebula.io/stripe/node.js/2019/05/02/using-stripe-webhooks-to-handle-failed-subscription-payments-node-js/
    Full doc: https://stripe.com/docs/billing/subscriptions/overview#subscription-events

    Tracked situations, associated stripe events, and summary logic:
        - 1. checkout to pay subscription:
            - 'checkout.session.completed'
            - logic: use "checkout_id" to add "subscription_id" to line in DB with "checkout" status

        - 2. payment first subscription: 
            - 'invoice.paid'
            - logic: grab "subscription_id" and update status in ChannelSubscription as "active"

        # Ignore 3; taken care in the Dashboard (email is sent to user with stripe retrial link. See: https://support.stripe.com/questions/handling-recurring-payments-that-require-customer-action)
        # - 3. failure payment first subscription: 
        #     -'invoice.payment_action_required' (= needs action from customer)
        #     - logic: send email 
        #     - invoice.payment_failed
        #     - logic: db 'status' in ChannelSubscription is "unpaid"

        - 4. successful renewal subscription: 
            - customer.subscription.updated (subscription status is "active")
            - logic: if status is "active", update line.

        - 5. failure renewal subscription: 
            - customer.subscription.updated (subscription status becomes "past_due". After 4 trials, it becomes "unpaid": this is set in dashboard https://dashboard.stripe.com/settings/billing/automatic)
            - logic:
                # - if past_due: change subscription status in DB as "pending_payment"  
                - if past_due: do nothing
                - after 4 trials: change subscription status into "unpaid"

        - 6. cancellation subscription or upgrade plans: 
            - customer.subscription.updated (subscription status becomes "cancelled")
            - logic: update subscription line into 'cancelled'

    Handling:
        - 'checkout.session.completed' (1)
        - 'invoice.paid' (2)
        - 'customer.subscription.updated' (4, 5)
        - 'customer.subscription.deleted' (6)
    
    NOTE: we do not track payments internally (see dashboard Stripe for that)
    '''
    # Request too big (protection mechanism; Remy)
    if request.content_length > 1024 * 1024:
        return 400

    payload = request.get_data()
    sig_header = request.environ.get('HTTP_STRIPE_SIGNATURE')

    try:
        # Handling of all the responses
        event = paymentsApi._construct_stripe_event_from_raw(payload, sig_header)

        # A. Handle successful checkout sessions (Sent when a customer clicks the Pay or Subscribe button in Checkout, informing you of a new purchase.)
        if event['type'] == 'checkout.session.completed':
            checkout_id = event["data"]["object"]["id"]

            # TODO: generalisation for later:
            # stripe_product_id = event["data"]["lines"]["data"][0]["price"]
            # product_class = products.getProductlassFromStripeId(stripe_product_id)
            product_class = "channel_subscription"

            # 1. If StreamingSubscription: add a line in DB and add customer in PaymentHistory
            if product_class == "channel_subscription":
                stripe_subscription_id = event["data"]["object"]["subscription"]
                channelSubscriptions._addStripeSubscriptionId(
                    checkout_id,
                    stripe_subscription_id
                )
            # 2. If credits
            else:
                return NotImplementedError

        # B. Handle paid invoice 
        elif event['type'] == 'invoice.paid':
            # TODO: generalisation for later:
            # stripe_product_id = event["data"]["lines"]["data"][0]["price"]
            # product_class = products.getProductlassFromStripeId(stripe_product_id)
            product_class = "channel_subscription"

            #  Update subscription into active
            if product_class == "channel_subscription":
                stripe_subscription_id = event["data"]["object"]["subscription"]

                channelSubscriptions.updateSubscriptionStatus(
                    stripe_subscription_id=stripe_subscription_id, status="active"
                )

        # C. Changes of status of subscription
        # (Stripe: "Sent each billing interval if there is an issue with your customer’s payment method.")
        elif event['type'] == "customer.subscription.updated":
            stripe_subscription_id = event["data"]["object"]["id"]
            subscription_status = event["data"]["object"]["status"]

            if subscription_status == "active":
                channelSubscriptions.updateSubscriptionStatus(
                    stripe_subscription_id=stripe_subscription_id, status="active"
                )

            elif subscription_status == "past_due":
                # do nothing here 
                pass

            elif subscription_status == "cancelled":
                channelSubscriptions.updateSubscriptionStatus(
                    stripe_subscription_id=stripe_subscription_id, 
                    status="cancelled"
                    )

        # C. Subscriptions that are changed into cancelled (Stripe dashboard: after 30 days unpaid. https://dashboard.stripe.com/settings/billing/automatic)
        #  - Cancelled subscriptions
        elif event['type'] == "customer.subscription.deleted":
            stripe_subscription_id = event["data"]["object"]["id"]

            channelSubscriptions.updateSubscriptionStatus(
                stripe_subscription_id=stripe_subscription_id, status="cancelled"
            )

        return {}

    except Exception as e:
        return {}, 400


# --------------------------------------------
# Research seminars scraping
# --------------------------------------------
@app.route('/rsscraping/createAgora', methods=["POST", "OPTIONS"])
def createAgoraGetTalkIds():
    if request.method == "OPTIONS":
        return jsonify("ok")
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    is_valid, talk_ids, channel_id, channel_name, link = RSScraper.create_agora_and_get_talk_ids(
        params['url'], params['user_id'], params['topic_1_id']
    )
    response =  jsonify({
        "isValidSeries": is_valid, 
        "allTalkIds": talk_ids, 
        "channelId": channel_id, 
        "channelName": channel_name,
        "talkLink": link,
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/rsscraping/talks', methods=["POST", "OPTIONS"])
def publishAllTalks():
    if request.method == "OPTIONS":
        return jsonify("ok")
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    talk_ids = params['idx']

    talks = RSScraper.parse_create_talks(
        params['url'], talk_ids, params['channel_id'], params['channel_name'], params['talk_link'], params['audience_level'], params['visibility'], params['auto_accept_group']
    )

    response = jsonify(talks)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
