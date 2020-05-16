from app import app, db
from repository import UserRepository, QandARepository, TagRepository, StreamRepository, VideoRepository, ScheduledStreamRepository, ChannelRepository
from flask import jsonify, request, send_file
from werkzeug import exceptions

users = UserRepository.UserRepository(db=db)
tags = TagRepository.TagRepository(db=db)
questions = QandARepository.QandARepository(db=db)
streams = StreamRepository.StreamRepository(db=db)
scheduledStreams = ScheduledStreamRepository.ScheduledStreamRepository(db=db)
videos = VideoRepository.VideoRepository(db=db)
channels = ChannelRepository.ChannelRepository(db=db)

# --------------------------------------------
# USER ROUTES
# --------------------------------------------
@app.route('/users/all')
def getAllUsers():
    return jsonify(users.getAllUsers())

@app.route('/users/user')
def getUser():
    username = request.args.get('username')
    return jsonify(users.getUser(username))

@app.route('/users/add', methods=["POST"])
def addUser():
    params = request.json
    username = params['username']
    password = params['password']
    users.addUser(username, password)
    return jsonify("Success")

@app.route('/users/authenticate', methods=["POST", "OPTIONS"])
def authenticate():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json

    username = params['username']
    password = params['password']
    user = users.authenticate(username, password)

    if not user:
        return exceptions.Unauthorized("Incorrect username or password")
    
    return jsonify({"id": user["id"], "username": user["username"]})

@app.route('/users/live')
def getLiveUsers():
    return jsonify(users.getCurrentlyLiveUsers())

@app.route('/users/user/golive', methods=["POST", "OPTIONS"])
def goLive():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    username = params['username']
    users.goLive(username)
    return jsonify("Success")

@app.route('/users/user/stoplive', methods=["POST", "OPTIONS"])
def stopLive():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    username = params['username']
    users.stopLive(username)
    return jsonify("Success")

# --------------------------------------------
# CHANNEL ROUTES
# --------------------------------------------
@app.route('/channels/channel', methods=["GET"])
def getChannelByName():
    name = request.args.get("name")
    return jsonify(channels.getChannelByName(name))

@app.route('/channels/all', methods=["GET"])
def getAllChannels():
    return jsonify(channels.getAllChannels())

@app.route('/channels/foruser', methods=["GET"])
def getChannelsForUser():
    userId = int(request.args.get("userId"))
    roles = request.args.getlist("role")
    return jsonify(channels.getChannelsForUser(userId, roles))

@app.route('/channels/create', methods=["POST", "OPTIONS"])
def createChannel():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    name = params["name"]
    description = params["description"]
    return jsonify(channels.createChannel(name, description))

@app.route('/channels/users/add', methods=["POST", "OPTIONS"])
def addUserToChannel():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    channels.addUserToChannel(params["userId"], params["channelId"], params["role"])
    return jsonify("Success")

@app.route('/channels/users/remove', methods=["POST", "OPTIONS"])
def removeUserForChannel():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    channels.removeUserFromChannel(params["userId"], params["channelId"])
    return jsonify("Success")

@app.route('/channels/users', methods=["GET"])
def getUsersForChannel():
    channelId = int(request.args.get("channelId"))
    roles = request.args.getlist("role")
    print(roles)
    return jsonify(channels.getUsersForChannel(channelId, roles))

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
    params = request.json 
    channelId = params["channelId"]
    newColour = params["newColour"]
    return jsonify(channels.updateChannelColour(channelId, newColour))

@app.route('/channels/updatedescription', methods=["POST", "OPTIONS"])
def updateChannelDescription():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json 
    channelId = params["channelId"]
    newDescription = params["newDescription"]
    return jsonify(channels.updateChannelDescription(channelId, newDescription))

# --------------------------------------------
# STREAM ROUTES
# --------------------------------------------
@app.route('/streams/all', methods=["GET"])
def getAllStreams():
    return jsonify(streams.getAllStreams())

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
    params = request.json
    stream = streams.createStream(params["channelId"], params["channelName"], params["streamName"], params["streamDescription"], params["streamTags"], params["imageUrl"])
    return jsonify(stream)

@app.route('/streams/archive', methods=["POST", "OPTIONS"])
def archiveStream():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    videoId = streams.archiveStream(params["streamId"], params["delete"])
    return jsonify({"videoId": videoId})

@app.route('/streams/stream/thumbnail', methods=["GET"])
def serveThumbnail():
    streamId = int(request.args.get("streamId"))
    fn = f"/usr/local/antmedia/webapps/WebRTCAppEE/previews{streamId}.png"
    return send_file(fn, mimetype="image/png")

# --------------------------------------------
# SCHEDULED STREAM ROUTES
# -------------------------------------------- 
@app.route('/streams/scheduled/all', methods=["GET"])
def getAllScheduledStreams():
    return jsonify(scheduledStreams.getAllScheduledStreams())

@app.route('/streams/scheduled/channel', methods=["GET"])
def getAllScheduledStreamsForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(scheduledStreams.getAllScheduledStreamsForChannel(channelId))

@app.route('/streams/scheduled/create', methods=["POST", "OPTIONS"])
def scheduleStream():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    return jsonify(scheduledStreams.scheduleStream(params["channelId"], params["channelName"], params["streamName"], params["streamDate"], params["streamDescription"]))

# --------------------------------------------
# VOD ROUTES
# --------------------------------------------
@app.route('/videos/all', methods=["GET"])
def getAllVideos():
    return jsonify(videos.getAllVideos())

@app.route('/videos/recent', methods=["GET"])
def getRecentVideos():
    return jsonify(videos.getRecentVideos())

@app.route('/videos/channel', methods=["GET"])
def getAllVideosForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(videos.getAllVideosForChannel(channelId))

@app.route('/videos/video', methods=["GET"])
def getVideoById():
    id = int(request.args.get("id"))
    return jsonify(videos.getVideoById(id))

@app.route('/videos/tag', methods=["GET"])
def getVideosWithTag():
    tagName = request.args.get("tagName")
    return jsonify(videos.getAllVideosWithTag(tagName))

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
    params = request.json
    userId = params["userId"]
    questionId = params["questionId"]
    content = params["content"]
    return jsonify(questions.answerQuestion(userId, questionId, content))

@app.route('/questions/upvote', methods=["POST", "OPTIONS"])
def upvoteQuestion():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    questionId = params["questionId"]
    userId = params["userId"]
    return jsonify(questions.upvoteQuestion(questionId, userId))

@app.route('/questions/downvote', methods=["POST", "OPTIONS"])
def downvoteQuestion():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    questionId = params["questionId"]
    userId = params["userId"]
    return jsonify(questions.downvoteQuestion(questionId, userId))

@app.route('/questions/answer/upvote', methods=["POST", "OPTIONS"])
def upvoteAnswer():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    answerId = params["answerId"]
    userId = params["userId"]
    return jsonify(questions.upvoteAnswer(answerId, userId))

@app.route('/questions/answer/downvote', methods=["POST", "OPTIONS"])
def downvoteAnswer():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    answerId = params["answerId"]
    userId = params["userId"]
    return jsonify(questions.downvoteAnswer(answerId, userId))

@app.route('/questions/upvote/remove', methods=["POST", "OPTIONS"])
def removeQuestionUpvote():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    questionId = params["questionId"]
    userId = params["userId"]
    return jsonify(questions.removeQuestionUpvote(questionId, userId))

@app.route('/questions/downvote/remove', methods=["POST", "OPTIONS"])
def removeQuestionDownvote():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    questionId = params["questionId"]
    userId = params["userId"]
    return jsonify(questions.removeQuestionDownvote(questionId, userId))

@app.route('/questions/answer/upvote/remove', methods=["POST", "OPTIONS"])
def removeAnswerUpvote():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    answerId = params["answerId"]
    userId = params["userId"]
    return jsonify(questions.removeAnswerUpvote(answerId, userId))

@app.route('/questions/answer/downvote/remove', methods=["POST", "OPTIONS"])
def removeAnswerDownvote():
    if request.method == "OPTIONS":
        return jsonify("ok")
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
    params = request.json
    name = params["name"]
    return jsonify(tags.addTag(name))

@app.route('/tags/tagstream', methods=["POST", "OPTIONS"])
def tagStream():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    return jsonify(tags.tagStream(params["streamId"], params["tagIds"]))

@app.route('/tags/stream', methods=["GET"])
def getTagsOnStream():
    streamId = int(request.args.get("streamId"))
    return jsonify(tags.getTagsOnStream(streamId))