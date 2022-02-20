from flask import jsonify, request, send_file

from app import app
from app.auth import requires_auth
from .helpers import log_request
from connectivity.streaming.agora_io.tokengenerators import generate_rtc_token


@app.route("/tokens/streaming", methods=["GET", "OPTIONS"])
def generateStreamingToken():
    if request.method == "OPTIONS":
        return jsonify("ok")

    try:
        channel_name = request.args.get("channel_name")
        role_attendee = request.args.get(
            "role_attendee"
        )  # Either 1) speaker, 2) host, 3) audience
        expire_time_in_sec = request.args.get("expire_time_in_sec")
        try:
            user_account = request.args.get("user_account")
        except:
            user_account = None
        try:
            uid = request.args.get("uid")
        except:
            uid = None
    except Exception as e:
        return jsonify(str(e))

    token = generate_rtc_token(
        channel_name, role_attendee, expire_time_in_sec, user_account, uid
    )

    return jsonify(token)


@app.route("/streams/all", methods=["GET"])
def getAllStreams():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    return jsonify(app.stream_repo.getAllStreams(limit, offset))


@app.route("/streams/channel", methods=["GET"])
def getStreamsForChannel():
    channelId = int(request.args.get("channelId"))
    return jsonify(app.stream_repo.getStreamsForChannel(channelId))


@app.route("/streams/stream", methods=["GET"])
def getStreamById():
    id = int(request.args.get("id"))
    return jsonify(app.stream_repo.getStreamById(id))


@app.route("/streams/create", methods=["POST", "OPTIONS"])
@requires_auth
def createStream():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    stream = app.stream_repo.createStream(
        params["channelId"],
        params["channelName"],
        params["streamName"],
        params["streamDescription"],
        params["streamTags"],
        params["imageUrl"],
    )
    return jsonify(stream)


@app.route("/streams/archive", methods=["POST", "OPTIONS"])
@requires_auth
def archiveStream():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    videoId = app.stream_repo.archiveStream(params["streamId"], params["delete"])
    return jsonify({"videoId": videoId})


@app.route("/streams/stream/thumbnail", methods=["GET"])
def serveThumbnail():
    streamId = int(request.args.get("streamId"))
    fn = f"/usr/local/antmedia/webapps/WebRTCAppEE/previews{streamId}.png"
    return send_file(fn, mimetype="image/png")
