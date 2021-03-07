"""
    TODO: 
        - Make "removeContactAddress" into a delete endpoint instead of a GET
""" 
from app import app, mail
from app.databases import agora_db
from repository import UserRepository, QandARepository, TagRepository, StreamRepository, VideoRepository, TalkRepository, ChannelRepository, SearchRepository, TopicRepository, InvitedUsersRepository
from mailing import sendgridApi
from flask import jsonify, request, send_file
from connectivity.streaming.agora_io.tokengenerators import generate_rtc_token


from flask import jsonify, request, send_file, render_template
from flask_mail import Message
from werkzeug import exceptions
import os

mail_sys = sendgridApi.sendgridApi()

users = UserRepository.UserRepository(db=agora_db, mail_sys=mail_sys)
tags = TagRepository.TagRepository(db=agora_db)
topics = TopicRepository.TopicRepository(db=agora_db)
questions = QandARepository.QandARepository(db=agora_db)
streams = StreamRepository.StreamRepository(db=agora_db)
talks = TalkRepository.TalkRepository(db=agora_db, mail_sys=mail_sys)
videos = VideoRepository.VideoRepository(db=agora_db)
channels = ChannelRepository.ChannelRepository(db=agora_db, mail_sys=mail_sys)
search = SearchRepository.SearchRepository(db=agora_db)
invitations = InvitedUsersRepository.InvitedUsersRepository(db=agora_db, mail_sys=mail_sys)
sendgridApi = sendgridApi.sendgridApi()


# BASE_API_URL = "http://localhost:8000"
BASE_API_URL = "https://agora.stream/api"


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
    username = params['username']
    password = params['password']
    user = users.authenticate(username, password)

    if not user:
        app.logger.debug(f"Unsuccessful login for user {username} (incorrect username or password)")
        return exceptions.Unauthorized("Incorrect username or password")

    app.logger.debug(f"Successful login for user {username}")

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
    link = f'https://agora.stream:3000/changepassword?code={code.decode()}'
    
    # email link
    msg = Message('Agora.stream: password reset', sender = 'team@agora.stream', recipients = [user["email"]])
    msg.body = f'Password reset link: {link}'
    msg.subject = "Agora.stream: password reset"
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
    name = request.args.get("name")
    return jsonify(channels.getChannelByName(name))

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
    print(roles)
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

@app.route('/channels/invite/add', methods=["POST", "OPTIONS"])
def addInvitedMembersToChannel():
    logRequest(request)
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    #if not checkAuth(request.headers.get('Authorization')):
    #    return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json

    invitations.addInvitedMemberToChannel(params['emails'], params['channelId'], 'member')
    for email in params['emails']:
        app.logger.debug(f"User with email {email} invited to agora with id {params['channelId']}")

    return jsonify("ok")

@app.route('/channels/invite', methods=["GET"])
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
    print(roles)
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
        file.save(f"/home/cloud-user/plateform/agora/images/avatars/{fn}")
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
        file.save(f"/home/cloud-user/plateform/agora/images/covers/{fn}")
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
        res = channels.getContactAddresses(channel_id)
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

    # query email address from administrators 
    # NOTE: we receive a list of all of admins but we only send to 1 for now; to be extended later
    administrator_emails = channels.getContactAddresses(params['channel_id'])[0]

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
    email_subject = f"New speaker application: agora.stream ({params['agora_name']})"
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
                    <p>The agora.stream Team</p>
                """

    msg = Message(body_msg, sender = 'team@agora.stream', recipients = [administrator_emails])
    msg.html = body_msg
    msg.subject = email_subject
    mail.send(msg)
    return "ok"

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
            params[topic_key] = "NULL" 

    app.logger.debug(f"New talk with title {params['talkName']} created by agora {params['channelName']}")
    return jsonify(talks.scheduleTalk(params["channelId"], params["channelName"], params["talkName"], params["startDate"], params["endDate"], params["talkDescription"], params["talkLink"], params["talkTags"], params["showLinkOffset"], params["visibility"], params["cardVisibility"], params["topic1Id"], params["topic2Id"], params["topic3Id"], params["talkSpeaker"], params["talkSpeakerURL"], params["published"], params["audienceLevel"]))

@app.route('/talks/edit', methods=["POST", "OPTIONS"])
def editTalk():
    logRequest(request)
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json

    app.logger.debug(f"Talk with id {params['talkId']} edited")
    return jsonify(talks.editTalk(params["talkId"], params["talkName"], params["startDate"], params["endDate"], params["talkDescription"], params["talkLink"], params["talkTags"], params["showLinkOffset"], params["visibility"], params["cardVisibility"], params["topic1Id"], params["topic2Id"], params["topic3Id"], params["talkSpeaker"], params["talkSpeakerURL"], params["published"], params["audienceLevel"]))

@app.route('/talks/delete', methods=["OPTIONS", "POST"])
def deleteTalk():
    logRequest(request)
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
# METATAG ROUTES (this is a hack)
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

        real_url = f"https://agora.stream/event/{eventId}"
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
        real_url = f"https://agora.stream/{name}"
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