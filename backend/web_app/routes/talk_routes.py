from flask import jsonify, request, send_file

from app import app
from app.auth import requires_auth
from .helpers import log_request


@app.route("/talk/info", methods=["GET"])
def getTalkById():
    # TODO: Fix bug with "getAllFutureTalks" that does not exist for in TalkRepository.
    # Q from Remy: when do we use this actually? I think it has been replaced by getAllFutureTalksForTopicWithChildren
    talkId = int(request.args.get("id"))
    try:
        return jsonify(app.talk_repo.getTalkById(talkId))
    except Exception as e:
        return jsonify(str(e))


@app.route("/talks/all/future", methods=["GET"])
def getAllFutureTalks():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    return jsonify(app.talk_repo.getAllFutureTalks(limit, offset))


@app.route("/talks/all/current", methods=["GET"])
def getAllCurrentTalks():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    data = app.talk_repo.getAllCurrentTalks(limit, offset)
    return jsonify({"talks": data[0], "count": data[1]})


@app.route("/talks/all/past", methods=["GET"])
def getAllPastTalks():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    data = app.talk_repo.getAllPastTalks(limit, offset)
    return jsonify({"talks": data[0], "count": data[1]})


@app.route("/talks/channel/future", methods=["GET"])
def getAllFutureTalksForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(app.talk_repo.getAllFutureTalksForChannel(channelId))


@app.route("/talks/channel/current", methods=["GET"])
def getAllCurrentTalksForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(app.talk_repo.getAllCurrentTalksForChannel(channelId))


@app.route("/talks/channel/drafted", methods=["GET"])
def getAllDraftedTalksForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(app.talk_repo.getAllDraftedTalksForChannel(channelId))


@app.route("/talks/channel/past", methods=["GET"])
def getAllPastTalksForChannel():
    channelId = int(request.args.get("channelId"))
    data = app.talk_repo.getAllPastTalksForChannel(channelId)
    return jsonify({"talks": data[0], "count": data[1]})


@app.route("/talks/tag/past", methods=["GET"])
def getAllPastTalksForTag():
    tagName = request.args.get("tagName")
    data = app.talk_repo.getPastTalksForTag(tagName)
    return jsonify({"talks": data[0], "count": data[1]})


@app.route("/talks/topic/future", methods=["GET"])
def getAllFutureTalksForTopic():
    topicId = int(request.args.get("topicId"))
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    return jsonify(app.talk_repo.getAllFutureTalksForTopic(topicId, limit, offset))


@app.route("/talks/topic/children/future", methods=["GET"])
def getAllFutureTalksForTopicWithChildren():
    topicId = int(request.args.get("topicId"))
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    return jsonify(
        app.talk_repo.getAllTalksForTopicWithChildren(topicId, limit, offset, "future")
    )


@app.route("/talks/topic/children/past", methods=["GET"])
def getAllPastTalksForTopicWithChildren():
    topicId = int(request.args.get("topicId"))
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    return jsonify(
        app.talk_repo.getAllTalksForTopicWithChildren(topicId, limit, offset, "past")
    )


@app.route("/talks/topic/past", methods=["GET"])
def getAllPastTalksForTopic():
    topicId = int(request.args.get("topicId"))
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    return jsonify(app.talk_repo.getAllPastTalksForTopic(topicId, limit, offset))


@app.route("/talks/available/future", methods=["GET"])
def getAvailableFutureTalks():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    user_id = request.args.get("userId")
    user_id = int(user_id) if user_id != "null" else None
    return jsonify(app.talk_repo.getAvailableFutureTalks(limit, offset, user_id))


@app.route("/talks/available/current", methods=["GET"])
def getAvailableCurrentTalks():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    user_id = request.args.get("userId")
    user_id = int(user_id) if user_id != "null" else None
    data = app.talk_repo.getAvailableCurrentTalks(limit, offset, user_id)
    return jsonify({"talks": data[0], "count": data[1]})


@app.route("/talks/available/past", methods=["GET"])
def getAvailablePastTalks():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    user_id = request.args.get("userId")
    user_id = int(user_id) if user_id != "null" else None
    return jsonify(app.talk_repo.getAvailablePastTalks(limit, offset, user_id))


@app.route("/talks/channel/available/future", methods=["GET"])
def getAvailableFutureTalksForChannel():
    channel_id = int(request.args.get("channelId"))
    user_id = request.args.get("userId")
    user_id = int(user_id) if user_id != "null" else None
    return jsonify(app.talk_repo.getAvailableFutureTalksForChannel(channel_id, user_id))


@app.route("/talks/channel/available/current", methods=["GET"])
def getAvailableCurrentTalksForChannel():
    channel_id = int(request.args.get("channelId"))
    user_id = request.args.get("userId")
    user_id = int(user_id) if user_id != "null" else None
    return jsonify(
        app.talk_repo.getAvailableCurrentTalksForChannel(channel_id, user_id)
    )


@app.route("/talks/channel/available/past", methods=["GET"])
def getAvailablePastTalksForChannel():
    channel_id = int(request.args.get("channelId"))
    user_id = request.args.get("userId")

    try:
        user_id = int(user_id)
    except:
        user_id = None

    return jsonify(app.talk_repo.getAvailablePastTalksForChannel(channel_id, user_id))


@app.route("/talks/create", methods=["POST", "OPTIONS"])
@requires_auth
def scheduleTalk():
    log_request(request)
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json

    for topic_key in ["topic1Id", "topic2Id", "topic3Id"]:
        if topic_key not in params:
            params[topic_key] = 0

    app.logger.debug(
        f"New talk with title {params['talkName']} created by agora {params['channelName']}"
    )
    return jsonify(
        app.talk_repo.scheduleTalk(
            params["channelId"],
            params["channelName"],
            params["talkName"],
            params["startDate"],
            params["endDate"],
            params["talkDescription"],
            params["talkLink"],
            params["talkTags"],
            params["showLinkOffset"],
            params["visibility"],
            params["cardVisibility"],
            params["topic1Id"],
            params["topic2Id"],
            params["topic3Id"],
            params["talkSpeaker"],
            params["talkSpeakerURL"],
            params["published"],
            params["audienceLevel"],
            params["autoAcceptGroup"],
            params["autoAcceptCustomInstitutions"],
            params["customInstitutionsIds"],
            params["reminder1"],
            params["reminder2"],
            params["reminderEmailGroup"],
        )
    )


@app.route("/talks/sendemailedit", methods=["GET", "OPTIONS"])
@requires_auth
def sendEmailonTalkModification():
    if request.method == "OPTIONS":
        return jsonify("ok")

    talk_id = int(request.args.get("talkId"))
    return jsonify(app.talk_repo.sendEmailonTalkModification(talk_id))


@app.route("/talks/sendemailschedule", methods=["GET", "OPTIONS"])
@requires_auth
def sendEmailonTalkScheduling():
    if request.method == "OPTIONS":
        return jsonify("ok")

    talk_id = int(request.args.get("talkId"))
    return jsonify(app.talk_repo.sendEmailonTalkScheduling(talk_id))


@app.route("/talks/edit", methods=["POST", "OPTIONS"])
@requires_auth
def editTalk():
    log_request(request)
    if request.method == "OPTIONS":
        return jsonify("ok")

    try:
        params = request.json

        for topic_key in ["topic1Id", "topic2Id", "topic3Id"]:
            if topic_key not in params:
                params[topic_key] = 0

        app.logger.debug(f"Talk with id {params['talkId']} edited")
        return jsonify(
            app.talk_repo.editTalk(
                params["channelId"],
                params["talkId"],
                params["talkName"],
                params["startDate"],
                params["endDate"],
                params["talkDescription"],
                params["talkLink"],
                params["talkTags"],
                params["showLinkOffset"],
                params["visibility"],
                params["cardVisibility"],
                params["topic1Id"],
                params["topic2Id"],
                params["topic3Id"],
                params["talkSpeaker"],
                params["talkSpeakerURL"],
                params["published"],
                params["audienceLevel"],
                params["autoAcceptGroup"],
                params["autoAcceptCustomInstitutions"],
                params["reminder1"],
                params["reminder2"],
                params["reminderEmailGroup"],
            )
        )

    except Exception as e:
        return str(e)


@app.route("/talks/speakerphoto", methods=["GET"])
def getSpeakerPhoto():
    if "talkId" in request.args:
        talkId = int(request.args.get("talkId"))
        fn = app.talk_repo.getSpeakerPhotoLocation(talkId)
        return send_file(fn, mimetype="image/jpg") if fn != "" else jsonify("None")


@app.route("/talks/speakerphoto", methods=["POST", "DELETE"])
@requires_auth
def speakerPhoto():
    if request.method == "OPTIONS":
        return jsonify("ok")

    if request.method == "POST":
        log_request(request)

        talkId = request.form["talkId"]
        file = request.files["image"]
        fn = f"{talkId}.jpg"
        file.save(f"/home/cloud-user/plateform/agora/storage/images/speakers/{fn}")
        app.talk_repo.addSpeakerPhoto(talkId)

        app.logger.debug(f"Talk with id {talkId} updated speaker photo")

        return jsonify({"filename": fn})

    if request.method == "DELETE":
        params = request.json
        print(params)
        talkId = params["talkId"]
        app.talk_repo.removeSpeakerPhoto(talkId)

        app.logger.debug(f"Talk with id {talkId} remove speaker speaker photo")

        return jsonify("ok")


@app.route("/talks/editCustomInstitutions", methods=["POST", "OPTIONS"])
@requires_auth
def editAutoAcceptanceCustomInstitutions():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json

    return jsonify(
        app.talk_repo.editAutoAcceptanceCustomInstitutions(
            params["talkId"], params["institutionIds"]
        )
    )


@app.route("/talks/delete", methods=["OPTIONS", "POST"])
@requires_auth
def deleteTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    app.logger.debug(f"Talk with id {params['id']} deleted")
    return jsonify(app.talk_repo.deleteTalk(params["id"]))


@app.route("/talks/add-recording", methods=["OPTIONS", "POST"])
@requires_auth
def addRecordingLink():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    return jsonify(app.talk_repo.addRecordingLink(params["talkId"], params["link"]))


@app.route("/talks/saved", methods=["GET"])
@requires_auth
def getSavedTalks():
    userId = int(request.args.get("userId"))
    return jsonify(app.talk_repo.getSavedTalksForUser(userId))


@app.route("/talks/save", methods=["POST", "OPTIONS"])
def saveTalk():
    log_request(request)
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    app.talk_repo.saveTalk(params["talkId"], params["userId"])
    app.logger.debug(
        f"User with id {params['userId']} saved talk with id {params['talkId']}"
    )
    return jsonify("ok")


@app.route("/talks/unsave", methods=["POST", "OPTIONS"])
@requires_auth
def unsaveTalk():
    log_request(request)
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    app.talk_repo.unsaveTalk(params["talkId"], params["userId"])
    app.logger.debug(
        f"User with id {params['userId']} unsaved talk with id {params['talkId']}"
    )
    return jsonify("ok")


@app.route("/talks/issaved", methods=["GET"])
@requires_auth
def isSaved():
    userId = int(request.args.get("userId"))
    talkId = int(request.args.get("talkId"))
    return jsonify({"is_saved": app.talk_repo.hasUserSavedTalk(talkId, userId)})


@app.route("/talks/isavailable", methods=["GET"])
@requires_auth
def isAvailable():
    userId = int(request.args.get("userId"))
    talkId = int(request.args.get("talkId"))
    return jsonify(app.talk_repo.isTalkAvailableToUser(talkId, userId))


@app.route("/talks/trending", methods=["GET"])
def getTrendingTalks():
    return jsonify(app.talk_repo.getTrendingTalks())


@app.route("/talks/reminders/time", methods=["GET"])
@requires_auth
def getReminderTime():
    talkId = int(request.args.get("talkId"))
    return jsonify(app.email_reminders_repo.getReminderTime(talkId))


@app.route("/talks/reminders/group", methods=["GET"])
@requires_auth
def getReminderGroup():
    talkId = int(request.args.get("talkId"))
    return jsonify(app.email_reminders_repo.getReminderGroup(talkId))


@app.route("/talks/viewcount/get", methods=["GET"])
def getViewCountForTalk():
    channelId = int(request.args.get("channelId"))
    return jsonify(app.talk_repo.getTalkViewCount(channelId))


@app.route("/talks/viewcount/add", methods=["POST"])
def increaseViewCountForTalk():
    params = request.json
    channelId = params["channelId"]
    return jsonify(app.talk_repo.increaseTalkViewCount(channelId))


@app.route("/talks/requestaccess/register", methods=["POST"])
@requires_auth
def registerTalk():
    params = request.json
    try:
        talkId = params["talkId"]
        userId = params["userId"] if "userId" in params else ""
        name = params["name"]
        email = params["email"]
        website = params["website"] if "website" in params else ""
        institution = params["institution"] if "institution" in params else ""
        user_hour_offset = params["userHourOffset"]

        res = app.talk_repo.registerTalk(
            talkId, userId, name, email, website, institution, user_hour_offset
        )
        return jsonify(str(res))

    except Exception as e:
        return jsonify(str(e))


@app.route("/talks/requestaccess/unregister", methods=["POST", "OPTIONS"])
@requires_auth
def unregisterTalk():
    log_request(request)
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    try:
        requestRegistrationId = params["requestRegistrationId"]
        userId = params["userId"] if "userId" in params else None
        app.talk_repo.unregisterTalk(requestRegistrationId, userId)
        return jsonify("ok")

    except Exception as e:
        return jsonify(400, str(e))


@app.route("/talks/requestaccess/refuse", methods=["POST", "OPTIONS"])
@requires_auth
def refuseTalkRegistration():
    # TODO: test
    log_request(request)
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    try:
        requestRegistrationId = params["requestRegistrationId"]
        res = app.talk_repo.refuseTalkRegistration(requestRegistrationId)
        if res == "ok":
            return jsonify("ok")
        else:
            return jsonify(500, str(res))

    except Exception as e:
        return jsonify(400, str(e))


@app.route("/talks/requestaccess/accept", methods=["POST", "OPTIONS"])
@requires_auth
def acceptTalkRegistration():
    # TODO: test
    log_request(request)
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    try:
        requestRegistrationId = params["requestRegistrationId"]
        res = app.talk_repo.acceptTalkRegistration(requestRegistrationId)
        return jsonify(str(res))

    except Exception as e:
        return jsonify(400, str(e))


@app.route("/talks/requestaccess/all", methods=["GET", "OPTIONS"])
@requires_auth
def getTalkRegistrations():
    if request.method == "OPTIONS":
        return jsonify("ok")

    channelId = request.args.get("channelId") if "channelId" in request.args else None
    talkId = request.args.get("talkId") if "talkId" in request.args else None
    userId = request.args.get("userId") if "userId" in request.args else None
    try:
        if channelId != None:
            res = app.talk_repo.getTalkRegistrationsForChannel(channelId)
            return jsonify(res)
        elif talkId != None:
            res = app.talk_repo.getTalkRegistrationsForTalk(talkId)
            return jsonify(res)
        elif userId != None:
            res = app.talk_repo.getTalkRegistrationsForUser(userId)
            return jsonify(res)

    except Exception as e:
        return jsonify(400, str(e))


@app.route("/talks/registrationstatus", methods=["GET"])
@requires_auth
def registrationStatusForTalk():
    talkId = int(request.args.get("talkId"))
    userId = int(request.args.get("userId"))

    return jsonify(app.talk_repo.registrationStatusForTalk(talkId, userId))


@app.route("/talks/slides", methods=["POST", "GET", "DELETE"])
def presentationSlides():
    # NOTE: pdf only atm.
    try:
        if request.method == "OPTIONS":
            return jsonify("ok")

        if request.method == "POST":
            log_request(request)
            talkId = request.form["talkId"]
            file = request.files["slides"]
            print(file)
            fn = f"{talkId}.pdf"
            file.save(f"/home/cloud-user/plateform/agora/storage/slides/{fn}")
            app.talk_repo.addSlides(talkId)

            return jsonify({"filename": fn})

        if request.method == "GET":
            if "talkId" in request.args:
                talkId = int(request.args.get("talkId"))
                fn = app.talk_repo.getSlidesLocation(talkId)
                if fn is not None:
                    return send_file(fn, mimetype="application/pdf")
                else:
                    return jsonify({"hasSlides": False})

        if request.method == "DELETE":
            params = request.json
            talkId = params["talkId"]
            app.talk_repo.deleteSlides(talkId)

            app.logger.debug(f"talk with id {talkId} removed slides")

            return jsonify("ok")
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/talks/hasslides", methods=["GET"])
def hasSlides():
    # NOTE: pdf only atm.
    if request.method == "GET":
        try:
            if "talkId" in request.args:
                talkId = int(request.args.get("talkId"))
                fn = app.talk_repo.getSlidesLocation(talkId)
                if fn is not None:
                    return jsonify({"hasSlides": True})
                else:
                    return jsonify({"hasSlides": False})
        except Exception as e:
            return jsonify({"error": str(e)})
