from flask import jsonify, request

from app import app
from app.auth import requires_auth
from .helpers import log_request


@app.route("/tags/all", methods=["GET", "OPTIONS"])
def getAllTags():
    return jsonify(app.tag_repo.getAllTags())


@app.route("/tags/popular", methods=["GET"])
def getPopularTags():
    n = int(request.args.get("n"))
    return jsonify(app.tag_repo.getPopularTags(n))


@app.route("/tags/add", methods=["POST", "OPTIONS"])
@requires_auth
def addTag():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    name = params["name"]
    return jsonify(app.tag_repo.addTag(name))


@app.route("/tags/tagstream", methods=["POST", "OPTIONS"])
@requires_auth
def tagStream():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    return jsonify(app.tag_repo.tagStream(params["streamId"], params["tagIds"]))


@app.route("/tags/stream", methods=["GET"])
def getTagsOnStream():
    streamId = int(request.args.get("streamId"))
    return jsonify(app.tag_repo.getTagsOnStream(streamId))
