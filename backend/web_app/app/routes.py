"""
    TODO: 
        - Make "removeContactAddress" into a delete endpoint instead of a GET
""" 

from app import app, db, mail
from repository import UserRepository, QandARepository, TagRepository, StreamRepository, VideoRepository, TalkRepository, ChannelRepository, SearchRepository, TopicRepository
from flask import jsonify, request, send_file
from flask_mail import Message
from werkzeug import exceptions
import os

users = UserRepository.UserRepository(db=db)
tags = TagRepository.TagRepository(db=db)
topics = TopicRepository.TopicRepository(db=db)
questions = QandARepository.QandARepository(db=db)
streams = StreamRepository.StreamRepository(db=db)
talks = TalkRepository.TalkRepository(db=db)
videos = VideoRepository.VideoRepository(db=db)
channels = ChannelRepository.ChannelRepository(db=db)
search = SearchRepository.SearchRepository(db=db)

# --------------------------------------------
# HELPER FUNCTIONS
# --------------------------------------------
def checkAuth(authHeader):
    if not authHeader:
        return False
    authToken = authHeader.split(" ")[1]
    result = users.decodeAuthToken(authToken)
    return not isinstance(result, str)



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
    params = request.json
    username = params['username']
    password = params['password']
    email = params['email']
    user = users.addUser(username, password, email)

    if not user:
        app.logger.error(f"Attempted registration of new user with existing username {username}")
        return "username is taken", 400

    app.logger.error(f"Successful registration of new user with username {username} and email {email}")

    accessToken = users.encodeAuthToken(user["id"], "access")
    refreshToken = users.encodeAuthToken(user["id"], "refresh")

    return jsonify({"id": user["id"], "username": user["username"], "accessToken": accessToken.decode(), "refreshToken": refreshToken.decode()})

@app.route('/users/authenticate', methods=["POST", "OPTIONS"])
def authenticate():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json

    username = params['username']
    password = params['password']
    user = users.authenticate(username, password)

    if not user:
        app.logger.error(f"Unsuccessful login for user {username} (incorrect username or password)")
        return exceptions.Unauthorized("Incorrect username or password")

    app.logger.info(f"Successful login for user {username}")

    accessToken = users.encodeAuthToken(user["id"], "access")
    refreshToken = users.encodeAuthToken(user["id"], "refresh")

    return jsonify({"id": user["id"], "username": user["username"], "accessToken": accessToken.decode(), "refreshToken": refreshToken.decode()})

@app.route('/refreshtoken', methods=["POST"])
def refreshAccessToken():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    if "userId" not in params:
        return exceptions.BadRequest("userId must be present in request")

    accessToken = users.encodeAuthToken(request.json["userId"], "access")
    return jsonify({"accessToken": accessToken.decode()})

@app.route('/users/email_change_password_link', methods=["POST"])
def generateChangePasswordLink():
    # generate link
    params = request.json
    user = users.getUser(params["username"])
    code = users.encodeAuthToken(user["id"], "changePassword")
    link = f'http://localhost:3000/changepassword?code={code.decode()}'
    
    # email link
    msg = Message('Hello', sender = 'team@agora.stream', recipients = [user["email"]])
    msg.body = f'Link to reset your password: {link}'
    msg.subject = "Reset password"
    mail.send(msg)
    return "ok"

@app.route('/users/change_password', methods=["POST"])
def changePassword():
    authToken = request.headers.get('Authorization').split(" ")[1]
    userId = users.decodeAuthToken(authToken)
    params = request.json
    users.changePassword(userId, params["password"])
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
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    name = params["name"]
    description = params["description"]
    userId = params["userId"]
    return jsonify(channels.createChannel(name, description, userId))

@app.route('/channels/users/add', methods=["POST", "OPTIONS"])
def addUserToChannel():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    channels.addUserToChannel(params["userId"], params["channelId"], params["role"])
    return jsonify("Success")

@app.route('/channels/users/remove', methods=["POST", "OPTIONS"])
def removeUserForChannel():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    channels.removeUserFromChannel(params["userId"], params["channelId"])
    return jsonify("Success")

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

@app.route('/channels/viewcount', methods=["GET"])
def getViewCountForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(channels.getViewsForChannel(channelId))

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
        if not checkAuth(request.headers.get('Authorization')):
            return exceptions.Unauthorized("Authorization header invalid or not present")

        channelId = request.form["channelId"]
        file = request.files["image"]
        print(file)
        fn = f"{channelId}.jpg"
        file.save(f"/home/cloud-user/plateform/agora/images/avatars/{fn}")
        channels.addAvatar(channelId)
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
        if not checkAuth(request.headers.get('Authorization')):
            return exceptions.Unauthorized("Authorization header invalid or not present")

        channelId = request.form["channelId"]
        file = request.files["image"]
        print(file)
        fn = f"{channelId}.jpg"
        file.save(f"/home/cloud-user/plateform/agora/images/covers/{fn}")
        channels.addCover(channelId)
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


    with open("/home/cloud-user/weshmaggle2.txt", "w") as file:
        file.write(str(params))

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
@app.route('/talks/all/future', methods=["GET"])
def getAllFutureTalks():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
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

@app.route('/talks/channel/drafted', methods=["GET"])
def getAllDraftedTalksForChannel():
    ############################
    #                          #
    # TODO: Test this works    #
    #                          #
    ############################
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

@app.route('/talks/create', methods=["POST", "OPTIONS"])
def scheduleTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json

    for topic_key in ["topic1Id", "topic2Id", "topic3Id"]:
        if topic_key not in params:
            params[topic_key] = "NULL" 

    return jsonify(talks.scheduleTalk(params["channelId"], params["channelName"], params["talkName"], params["startDate"], params["endDate"], params["talkDescription"], params["talkLink"], params["talkTags"], params["showLinkOffset"], params["visibility"], params["topic1Id"], params["topic2Id"], params["topic3Id"], params["talkSpeaker"], params["talkSpeakerURL"], params["published"]))

@app.route('/talks/edit', methods=["POST", "OPTIONS"])
def editTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    return jsonify(talks.editTalk(params["talkId"], params["talkName"], params["startDate"], params["endDate"], params["talkDescription"], params["talkLink"], params["talkTags"], params["showLinkOffset"], params["visibility"], params["topic1Id"], params["topic2Id"], params["topic3Id"], params["talkSpeaker"], params["talkSpeakerURL"], params["published"]))

@app.route('/talks/delete', methods=["OPTIONS", "POST"])
def deleteTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    return jsonify(talks.deleteTalk(params["id"]))

@app.route('/talks/add-recording', methods=["OPTIONS", "POST"])
def addRecordingLink():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    return jsonify(talks.addRecordingLink(params["talkId"], params["link"]))

@app.route('/talks/isregistered', methods=["GET"])
def isRegisteredForTalk():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    talkId = int(request.args.get("talkId"))
    userId = int(request.args.get("userId"))
        
    return jsonify(talks.isUserRegisteredForTalk(talkId, userId))

@app.route('/talks/register', methods=["POST", "OPTIONS"])
def registerForTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    talks.registerForTalk(params["talkId"], params["userId"])
    return jsonify("success")

@app.route('/talks/unregister', methods=["POST", "OPTIONS"])
def unRegisterForTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    talks.unRegisterForTalk(params["talkId"], params["userId"])
    return jsonify("success")

@app.route('/talks/registered', methods=["GET"])
def getTalksForUser():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    userId = int(request.args.get("userId"))
    return jsonify(talks.getFutureTalksForUser(userId))

@app.route('/talks/saved', methods=["GET"])
def getSavedTalks():
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    userId = int(request.args.get("userId"))
    return jsonify(talks.getSavedTalksForUser(userId))

@app.route('/talks/save', methods=["POST", "OPTIONS"])
def saveTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    talks.saveTalk(params["talkId"], params["userId"])
    return jsonify("ok")

@app.route('/talks/unsave', methods=["POST", "OPTIONS"])
def unsaveTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")
        
    if not checkAuth(request.headers.get('Authorization')):
        return exceptions.Unauthorized("Authorization header invalid or not present")

    params = request.json
    talks.unsaveTalk(params["talkId"], params["userId"])
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
