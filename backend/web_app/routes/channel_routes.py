from flask import jsonify, request, send_file
from flask_mail import Message
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from app import app, mail
from app.auth import requires_auth
from .helpers import log_request

SENDGRID_API_KEY = "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"
sg = SendGridAPIClient(SENDGRID_API_KEY)

@app.route("/channels/channel", methods=["GET"])
def getChannelByName():
    if "name" in request.args:
        name = request.args.get("name")
        return jsonify(app.channel_repo.getChannelByName(name))
    elif "id" in request.args:
        id = request.args.get("id")
        return jsonify(app.channel_repo.getChannelById(id))


@app.route("/channels/all", methods=["GET"])
def getAllChannels():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    return jsonify(app.channel_repo.getAllChannels(limit, offset))


@app.route("/channels/trending", methods=["GET"])
def getTrendingChannels():
    return jsonify(app.channel_repo.getTrendingChannels())


@app.route("/channels/foruser", methods=["GET"])
@requires_auth
def getChannelsForUser():
    userId = int(request.args.get("userId"))
    roles = request.args.getlist("role")
    return jsonify(app.channel_repo.getChannelsForUser(userId, roles))


@app.route("/channels/create", methods=["POST", "OPTIONS"])
@requires_auth
def createChannel():
    log_request(request)
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    name = params["name"]
    description = params["description"]
    userId = params["userId"]
    topic1Id = params["topic1Id"]

    # app.logger.debug(f"New agora '{name}' created by user with id {userId}")

    return jsonify(app.channel_repo.createChannel(name, description, userId, topic1Id))


@app.route("/channels/delete", methods=["POST"])
@requires_auth
def deleteChannel():
    params = request.json
    app.channel_repo.deleteChannel(params["id"])
    return jsonify("ok")


# TODO: merge "addInvitedMembersToChannel" and "addInvitedFollowerToChannel" into the same method.
@app.route("/channels/invite/add/member", methods=["POST", "OPTIONS"])
@requires_auth
def addInvitedMembersToChannel():
    log_request(request)
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json

    # NOTE: Method addInvitedUserToChannel has not been implemented for "member".
    app.invited_users_repo.addInvitedUserToChannel(
        params["emails"], params["channelId"], "member"
    )

    for email in params["emails"]:
        app.logger.debug(
            f"User with email {email} invited to agora with id {params['channelId']}"
        )

    return jsonify("ok")


@app.route("/channels/invite/add/follower", methods=["POST", "OPTIONS"])
@requires_auth
def addInvitedFollowerToChannel():
    log_request(request)
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    app.invited_users_repo.addInvitedUserToChannel(
        params["emails"], params["channelId"], "follower"
    )
    for email in params["emails"]:
        app.logger.debug(
            f"User with email {email} invited to agora with id {params['channelId']}"
        )

    return jsonify("ok")


@app.route("/channels/invite/add/follower", methods=["GET"])
@requires_auth
def getInvitedMembersForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(app.invited_users_repo.getInvitedMembersEmails(channelId))


@app.route("/channels/users/add", methods=["POST", "OPTIONS"])
@requires_auth
def addUserToChannel():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    app.channel_repo.addUserToChannel(
        params["userId"], params["channelId"], params["role"]
    )
    return jsonify("ok")


@app.route("/channels/users/remove", methods=["POST", "OPTIONS"])
@requires_auth
def removeUserForChannel():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    app.channel_repo.removeUserFromChannel(params["userId"], params["channelId"])
    return jsonify("ok")


@app.route("/channels/users", methods=["GET"])
@requires_auth
def getUsersForChannel():
    channelId = int(request.args.get("channelId"))
    roles = request.args.getlist("role")
    return jsonify(app.channel_repo.getUsersForChannel(channelId, roles))


@app.route("/channels/user/role", methods=["GET"])
@requires_auth
def getRoleInChannel():
    channelId = int(request.args.get("channelId"))
    userId = int(request.args.get("userId"))
    return jsonify(app.channel_repo.getRoleInChannel(channelId, userId))


@app.route("/channels/followercount", methods=["GET"])
def getFollowerCountForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(len(app.channel_repo.getUsersForChannel(channelId, ["follower"])))


@app.route("/channels/viewcount/get", methods=["GET"])
def getViewCountForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(app.channel_repo.getChannelViewCount(channelId))


@app.route("/channels/viewcount/add", methods=["POST"])
def increaseViewCountForChannel():
    params = request.json
    channelId = params["channelId"]
    return jsonify(app.channel_repo.increaseChannelViewCount(channelId))


@app.route("/channels/referralscount/get", methods=["GET"])
def getReferralsForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(app.channel_repo.getChannelReferralCount(channelId))


# don't really think this is needed , but adding this in a comment anyways
# @app.route('/channels/referrals/add', methods=["POST"])
# def increaseReferralsForChannel():
#     params = request.json
#     channelId = params["channelId"]
#     return jsonify(channels.increaseChannelReferralCount(channelId))


@app.route("/channels/updatecolour", methods=["POST", "OPTIONS"])
@requires_auth
def updateChannelColour():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    channelId = params["channelId"]
    newColour = params["newColour"]
    return jsonify(app.channel_repo.updateChannelColour(channelId, newColour))


@app.route("/channels/updatedescription", methods=["POST", "OPTIONS"])
@requires_auth
def updateChannelDescription():
    """TODO: refact this into updateshortdescription and propagate
    NOTE: OLD TECH.
    """
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    channelId = params["channelId"]
    newDescription = params["newDescription"]

    return jsonify(app.channel_repo.updateChannelDescription(channelId, newDescription))


@app.route("/channels/updatelongdescription", methods=["POST", "OPTIONS"])
@requires_auth
def updateLongChannelDescription():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    channelId = params["channelId"]
    newDescription = params["newDescription"]
    return jsonify(
        app.channel_repo.updateLongChannelDescription(channelId, newDescription)
    )


@app.route("/channels/avatar", methods=["GET"])
def getAvatar():
    if "channelId" in request.args:
        channelId = int(request.args.get("channelId"))
        fn = app.channel_repo.getAvatarLocation(channelId)
        return send_file(fn, mimetype="image/jpg")


@app.route("/channels/avatar", methods=["POST", "OPTIONS"])
@requires_auth
def updateAvatar():
    if request.method == "OPTIONS":
        return jsonify("ok")

    log_request(request)
    channelId = request.form["channelId"]
    file = request.files["image"]
    fn = f"{channelId}.jpg"
    file.save(f"/home/cloud-user/plateform/agora/storage/images/avatars/{fn}")
    app.channel_repo.addAvatar(channelId)

    app.logger.debug(f"Agora with id {request.form['channelId']} updated avatar")

    return jsonify({"filename": fn})


@app.route("/channels/cover", methods=["GET"])
def getCover():
    if "channelId" in request.args:
        channelId = int(request.args.get("channelId"))
        fn = app.channel_repo.getCoverLocation(channelId)
        return send_file(fn, mimetype="image/jpg")


@app.route("/channels/cover", methods=["POST", "DELETE", "OPTIONS"])
@requires_auth
def updateCover():
    if request.method == "OPTIONS":
        return jsonify("ok")

    if request.method == "POST":
        log_request(request)
        channelId = request.form["channelId"]
        file = request.files["image"]
        print(file)
        fn = f"{channelId}.jpg"
        file.save(f"/home/cloud-user/plateform/agora/storage/images/covers/{fn}")
        app.channel_repo.addCover(channelId)

        app.logger.debug(f"Agora with id {request.form['channelId']} updated banner")

        return jsonify({"filename": fn})

    if request.method == "DELETE":
        params = request.json
        print(params)
        channelId = params["channelId"]
        app.channel_repo.removeCover(channelId)

        app.logger.debug(f"Agora with id {channelId} removed banner")

        return jsonify("ok")


@app.route("/channels/contacts", methods=["GET", "OPTIONS"])
def getContactAddresses():
    if "channelId" in request.args:
        channel_id = request.args.get("channelId")
        res = app.channel_repo.getEmailAddressesMembersAndAdmins(
            channel_id, getMembersAddress=False, getAdminsAddress=True
        )
        return jsonify(res)


@app.route("/channels/contact/add", methods=["POST", "OPTIONS"])
@requires_auth
def addContactAddress():
    if request.method == "OPTIONS":
        return jsonify("ok")

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

    app.channel_repo.addContactAddress(contactAddress, channelId, userId)
    return jsonify("ok")


@app.route("/channels/contact/delete", methods=["GET", "OPTIONS"])
@requires_auth
def removeContactAddress():
    """
    TODO: Make this into a DELETE request
    """
    if request.method == "OPTIONS":
        return jsonify("ok")

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
    app.channel_repo.removeAllContactAddresses(contactAddress, channelId, userId)
    return jsonify("ok")


@app.route("/channel/apply/talk", methods=["POST"])
def sendTalkApplicationEmail():
    # NOTE: used https://wordtohtml.net/ to easily create syntax for the body
    params = request.json
    try:
        # query email address from administrators
        channel_id = params["channel_id"]
        administrator_emails = app.channel_repo.getEmailAddressesMembersAndAdmins(
            channel_id, getMembersAddress=False, getAdminsAddress=True
        )

        # handling optional field
        if "speaker_personal_website" not in params:
            speaker_personal_website_section = ""
        else:
            if "." not in params["speaker_personal_website"]:
                speaker_personal_website_section = ""
            else:
                speaker_personal_website_section = f"""
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
        message = Mail(
            from_email="team@mora.stream",
            to_emails=administrator_emails,
            subject=email_subject,
            html_content=body_msg
        )
        sg.send(message)
        return "ok"

    except Exception as e:
        return str(e)


@app.route("/channel/edit/topic", methods=["POST", "OPTIONS"])
@requires_auth
def editChannelTopic():
    log_request(request)
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json

    # app.logger.debug(f"channel with id {params['channelId']} edited")
    return jsonify(
        app.channel_repo.editChannelTopic(
            params["channelId"],
            params["topic1Id"],
            params["topic2Id"],
            params["topic3Id"],
        )
    )


@app.route("/channels/topics/fetch", methods=["GET", "OPTIONS"])
def getChannelTopic():
    if request.method == "OPTIONS":
        return jsonify("ok")

    channelId = int(request.args.get("channelId"))
    return jsonify(app.channel_repo.getChannelTopic(channelId))


@app.route("/channels/topics/all", methods=["GET"])
def getChannelsWithTopic():
    limit = int(request.args.get("limit"))
    topicId = int(request.args.get("topicId"))
    offset = int(request.args.get("offset"))
    return jsonify(app.channel_repo.getChannelsWithTopic(limit, topicId, offset))


@app.route("/channels/mailinglist/add", methods=["POST", "OPTIONS"])
def addToMailingList():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    return jsonify(
        app.mailing_repo.addToMailingList(params["channelId"], params["emails"])
    )


@app.route("/channels/mailinglist", methods=["GET", "OPTIONS"])
@requires_auth
def getMailingList():
    if request.method == "OPTIONS":
        return jsonify("ok")

    channelId = int(request.args.get("channelId"))
    return jsonify(app.mailing_repo.getMailingList(channelId))


@app.route("/channel/membership/apply", methods=["POST"])
@requires_auth
def applyMembership():
    params = request.json

    # Compulsory details
    personal_homepage = (
        params["personalHomepage"] if "personalHomepage" in params else None
    )

    res = app.channel_repo.applyMembership(
        params["id"],
        params["userId"],
        params[
            "fullName"
        ],  # this will be removed later when user will have a good profile
        params[
            "position"
        ],  # this will be removed later when user will have a good profile
        params[
            "institution"
        ],  # this will be removed later when user will have a good profile
        params[
            "email"
        ],  # this will be removed later when user will have a good profile
        personal_homepage,
    )

    return res


@app.route("/channel/membership/cancel", methods=["POST"])
@requires_auth
def cancelMembershipApplication():
    params = request.json

    res = app.channel_repo.cancelMembershipApplication(params["id"], params["userId"])

    return jsonify(res)


@app.route("/channel/membership/accept", methods=["POST"])
@requires_auth
def acceptMembershipApplication():
    params = request.json

    res = app.channel_repo.acceptMembershipApplication(params["id"], params["userId"],)
    return jsonify(res)


@app.route("/channel/membership/list", methods=["GET"])
@requires_auth
def getMembershipApplications():
    channelId = int(request.args.get("channelId"))
    userId = int(request.args.get("userId")) if "userId" in request.args else None

    res = app.channel_repo.getMembershipApplications(channelId, userId,)
    return jsonify(res)
