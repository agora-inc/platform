from flask import jsonify, request, send_file

from app import app


@app.route("/videos/all", methods=["GET"])
def getAllVideos():
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    data = app.video_repo.getAllVideos(limit, offset)
    return jsonify({"videos": data[0], "count": data[1]})
    # return jsonify({ videos.getAllVideos(limit, offset)})


@app.route("/videos/recent", methods=["GET"])
def getRecentVideos():
    return jsonify(app.video_repo.getRecentVideos())


@app.route("/videos/channel", methods=["GET"])
def getAllVideosForChannel():
    channelId = int(request.args.get("channelId"))
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    data = app.video_repo.getAllVideosForChannel(channelId, limit, offset)
    return jsonify({"videos": data[0], "count": data[1]})


@app.route("/videos/video", methods=["GET"])
def getVideoById():
    id = int(request.args.get("id"))
    return jsonify(app.video_repo.getVideoById(id))


@app.route("/videos/tag", methods=["GET"])
def getVideosWithTag():
    tagName = request.args.get("tagName")
    limit = int(request.args.get("limit"))
    offset = int(request.args.get("offset"))
    data = app.video_repo.getAllVideosWithTag(tagName, limit, offset)
    return jsonify({"videos": data[0], "count": data[1]})


@app.route("/videos/topic", methods=["GET"])
def getVideosByTag():
    raise NotImplementedError
