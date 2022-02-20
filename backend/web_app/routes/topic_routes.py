from flask import jsonify, request

from app import app
from app.auth import requires_auth
from .helpers import log_request


@app.route("/topics/all", methods=["GET", "OPTIONS"])
def getAllTopics():
    if request.method == "OPTIONS":
        return jsonify("ok")
    return jsonify(app.topic_repo.getAllTopics())


@app.route("/topics/treestructure", methods=["GET", "OPTIONS"])
def getDataTreeStructure():
    if request.method == "OPTIONS":
        return jsonify("ok")
    return jsonify(app.topic_repo.getAllTags())
    # return jsonify(topics.getDataTreeStructure())


@app.route("/topics/popular", methods=["GET"])
def getPopularTopics():
    # n = int(request.args.get("n"))
    # return jsonify(topics.getPopularTopics(n))
    raise NotImplementedError("not implemented yet")


@app.route("/topics/addtopicstream", methods=["POST", "OPTIONS"])
@requires_auth
def addTopicOnStream():
    # if request.method == "OPTIONS":
    #     return jsonify("ok")
    # params = request.json
    # return jsonify(tags.tagStream(params["streamId"], params["tagIds"]))
    raise NotImplementedError


@app.route("/topics/stream", methods=["GET"])
def getTopicsOnStream():
    # streamId = int(request.args.get("streamId"))
    # return jsonify(tags.getTagsOnStream(streamId))
    raise NotImplementedError


@app.route("/topics/getField", methods=["GET"])
def getFieldFromId():
    if request.method == "OPTIONS":
        return jsonify("ok")

    topicId = request.args.get("topicId")
    return jsonify(app.topic_repo.getFieldFromId(topicId))
