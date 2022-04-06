from flask import jsonify, request, send_file

from app import app
from app.auth import requires_auth
from .helpers import log_request


@app.route("/profiles/nonempty")
def getNonEmptyProfiles():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    return jsonify(app.profile_repo.getAllNonEmptyProfiles(limit, offset))


@app.route("/profiles/public/topic")
def getAllProfilesByTopicRecursive():
    topic_id = int(request.args.get("topicId"))
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    return jsonify(
        app.profile_repo.getAllProfilesByTopicRecursive(topic_id, limit, offset)
    )


@app.route("/profiles/profile", methods=["GET"])
def getProfile():
    id = int(request.args.get("id"))
    return jsonify(app.profile_repo.getProfile(id))


@app.route("/profiles/invitation/speaker", methods=["POST", "OPTIONS"])
@requires_auth
def inviteToTalk():
    if request.method == "OPTIONS":
        return jsonify("ok")
    else:
        try:
            params = request.json
            inviting_user_id = params["inviting_user_id"]
            invited_user_id = params["invited_user_id"]
            channel_id = params["channel_id"]
            date = params["date"]
            message = params["message"]
            contact_email = params["contact_email"]
            presentation_name = params["presentation_name"]

            # SEND EMAIL SENDGRID
            res = app.profile_repo.inviteToTalk(
                inviting_user_id,
                invited_user_id,
                channel_id,
                date,
                message,
                contact_email,
                presentation_name,
            )
            return res
        except Exception as e:
            return 404, "Error: " + str(e)


@app.route("/profiles/create", methods=["POST"])
@requires_auth
def createProfile():
    params = request.json
    return jsonify(
        app.profile_repo.createProfile(params["user_id"], params["full_name"])
    )


@app.route("/profiles/details/update", methods=["POST"])
@requires_auth
def updateDetails():
    params = request.json
    return jsonify(
        app.profile_repo.updateDetails(
            params["user_id"], params["dbKey"], params["value"]
        )
    )


@app.route("/profiles/topics/update", methods=["POST", "OPTIONS"])
@requires_auth
def updateProfileTopics():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    return jsonify(app.profile_repo.updateTopics(params["user_id"], params["topicsId"]))


@app.route("/profiles/bio/update", methods=["POST"])
@requires_auth
def updateProfileBio():
    params = request.json
    return jsonify(app.profile_repo.updateBio(params["user_id"], params["bio"]))


@app.route("/profiles/papers/update", methods=["POST"])
@requires_auth
def updatePaper():
    params = request.json
    return jsonify(app.profile_repo.updatePaper(params["user_id"], params["paper"]))


@app.route("/profiles/presentations/update", methods=["POST"])
@requires_auth
def updatePresentation():
    params = request.json
    return jsonify(
        app.profile_repo.updatePresentation(
            params["user_id"], params["presentation"], params["now"]
        )
    )


@app.route("/profiles/photo", methods=["GET"])
def getProfilePhoto():
    if "defaultPic" in request.args:
        defaultPicLocation = (
            "/home/cloud-user/plateform/agora/storage/images/profiles/default.jpg"
        )
        return (
            send_file(defaultPicLocation, mimetype="image/jpg")
            if defaultPicLocation != ""
            else jsonify("None")
        )
    else:
        if "userId" in request.args:
            userId = int(request.args.get("userId"))

            fn = app.profile_repo.getProfilePhotoLocation(userId)
            with open("/home/cloud-user/test/wesh2.txt", "w") as file:
                file.write(str(fn))

            return send_file(fn, mimetype="image/jpg") if fn != "" else jsonify("None")


@app.route("/profiles/photo", methods=["POST", "DELETE"])
@requires_auth
def updateProfilePhoto():
    if request.method == "OPTIONS":
        return jsonify("ok")

    if request.method == "POST":
        log_request(request)
        userId = request.form["userId"]
        file = request.files["image"]
        fn = f"{userId}.jpg"
        file.save(f"/home/cloud-user/plateform/agora/storage/images/profiles/{fn}")
        app.profile_repo.addProfilePhoto(userId)

        app.logger.debug(f"User with id {userId} updated profile photo")

        return jsonify({"filename": fn})

    if request.method == "DELETE":
        params = request.json
        userId = params["userId"]
        app.profile_repo.removeProfilePhoto(userId)

        app.logger.debug(f"User with id {userId} remove profile photo")

        return jsonify("ok")


@app.route("/profiles/papers/delete", methods=["OPTIONS", "POST"])
@requires_auth
def deletePaper():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    return jsonify(app.profile_repo.deletePaper(params["paper_id"]))


@app.route("/profiles/presentations/delete", methods=["OPTIONS", "POST"])
@requires_auth
def deletePresentation():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    return jsonify(app.profile_repo.deletePresentation(params["presentation_id"]))


@app.route("/profiles/tags/update", methods=["POST"])
@requires_auth
def updateTags():
    params = request.json
    return jsonify(app.profile_repo.updateTags(params["user_id"], params["tags"]))

