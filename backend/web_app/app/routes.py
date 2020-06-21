from app import app, db
from repository import UserRepository, QandARepository, TagRepository, StreamRepository, VideoRepository, TalkRepository, ChannelRepository, SearchRepository, TopicRepository
from flask import jsonify, request, send_file
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
    return jsonify(users.addUser(username, password))

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

@app.route('/channels/foruser', methods=["GET"])
def getChannelsForUser():
    userId = int(request.args.get("userId"))
    roles = request.args.getlist("role")
    print(roles)
    return jsonify(channels.getChannelsForUser(userId, roles))

@app.route('/channels/create', methods=["POST", "OPTIONS"])
def createChannel():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    name = params["name"]
    description = params["description"]
    userId = params["userId"]
    return jsonify(channels.createChannel(name, description, userId))

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

@app.route('/channels/uploadavatar', methods=["POST", "OPTIONS"])
def uploadAvatar():
    if request.method == "OPTIONS":
        return jsonify("ok")
    channelId = request.form["channelId"]
    file = request.files["image"]
    # fn = f"{channelId}.{file.filename.split('.')[-1]}"
    fn = f"{channelId}.jpg"
    file.save(f"../../frontend/public/images/channel-icons/{fn}")

    channels.addAvatar(channelId)
    return jsonify({"filename": fn})

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
# TALK ROUTES
# -------------------------------------------- 
@app.route('/talks/all/future', methods=["GET"])
def getAllFutureTalks():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    return jsonify(talks.getAllFutureTalks(limit, offset))

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

    params = request.json

    for topic_key in ["topic1Id", "topic2Id", "topic3Id"]:
        if params[topic_key] == None:
            params[topic_key] = "NULL" 

    return jsonify(talks.scheduleTalk(params["channelId"], params["channelName"], params["talkName"], params["startDate"], params["endDate"], params["talkDescription"], params["talkLink"], params["talkTags"], params["showLinkOffset"], params["visibility"], params["topic1Id"], params["topic2Id"], params["topic3Id"]))

@app.route('/talks/edit', methods=["POST", "OPTIONS"])
def editTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    return jsonify(talks.editTalk(params["talkId"], params["talkName"], params["startDate"], params["endDate"], params["talkDescription"], params["talkLink"], params["talkTags"], params["showLinkOffset"], params["visibility"], params["topic1Id"], params["topic2Id"], params["topic3Id"]))

@app.route('/talks/delete', methods=["OPTIONS", "POST"])
def deleteTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    return jsonify(talks.deleteTalk(params["id"]))

@app.route('/talks/add-recording', methods=["OPTIONS", "POST"])
def addRecordingLink():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    return jsonify(talks.addRecordingLink(params["talkId"], params["link"]))

@app.route('/talks/isregistered', methods=["GET"])
def isRegisteredForTalk():
    talkId = int(request.args.get("talkId"))
    userId = int(request.args.get("userId"))
    return jsonify({"is_registered": talks.isUserRegisteredForTalk(talkId, userId)})

@app.route('/talks/register', methods=["POST", "OPTIONS"])
def registerForTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    talks.registerForTalk(params["talkId"], params["userId"])
    return jsonify("success")

@app.route('/talks/unregister', methods=["POST", "OPTIONS"])
def unRegisterForTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    talks.unRegisterForTalk(params["talkId"], params["userId"])
    return jsonify("success")

@app.route('/talks/registered', methods=["GET"])
def getTalksForUser():
    userId = int(request.args.get("userId"))
    return jsonify(talks.getFutureTalksForUser(userId))

@app.route('/talks/saved', methods=["GET"])
def getSavedTalks():
    userId = int(request.args.get("userId"))
    return jsonify(talks.getSavedTalksForUser(userId))

@app.route('/talks/save', methods=["POST", "OPTIONS"])
def saveTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    talks.saveTalk(params["talkId"], params["userId"])
    return jsonify("ok")

@app.route('/talks/unsave', methods=["POST", "OPTIONS"])
def unsaveTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    talks.unsaveTalk(params["talkId"], params["userId"])
    return jsonify("ok")

@app.route('/talks/issaved', methods=["GET"])
def isSaved():
    userId = int(request.args.get("userId"))
    talkId = int(request.args.get("talkId"))
    return jsonify({"is_saved": talks.hasUserSavedTalk(talkId, userId)})

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
