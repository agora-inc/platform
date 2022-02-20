from flask import jsonify, request

from app import app
from app.auth import requires_auth
from .helpers import log_request


@app.route("/questions", methods=["GET"])
def getAllQuestionsForStream():
    streamId = request.args.get("streamId")
    videoId = request.args.get("videoId")
    if streamId != None:
        res = app.questions_repo.getAllQuestionsForStream(streamId=int(streamId))
    else:
        res = app.questions_repo.getAllQuestionsForStream(videoId=int(videoId))
    return jsonify(res)


@app.route("/questions/ask", methods=["POST", "OPTIONS"])
@requires_auth
def askQuestion():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    userId = params["userId"]
    content = params["content"]

    if "streamId" in params:
        return jsonify(
            app.questions_repo.createQuestion(
                userId, content, streamId=params["streamId"]
            )
        )
    return jsonify(
        app.questions_repo.createQuestion(userId, content, videoId=params["videoId"])
    )


@app.route("/questions/answer", methods=["POST", "OPTIONS"])
@requires_auth
def answerQuestion():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    userId = params["userId"]
    questionId = params["questionId"]
    content = params["content"]
    return jsonify(app.questions_repo.answerQuestion(userId, questionId, content))


@app.route("/questions/upvote", methods=["POST", "OPTIONS"])
@requires_auth
def upvoteQuestion():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    questionId = params["questionId"]
    userId = params["userId"]
    return jsonify(app.questions_repo.upvoteQuestion(questionId, userId))


@app.route("/questions/downvote", methods=["POST", "OPTIONS"])
@requires_auth
def downvoteQuestion():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    questionId = params["questionId"]
    userId = params["userId"]
    return jsonify(app.questions_repo.downvoteQuestion(questionId, userId))


@app.route("/questions/answer/upvote", methods=["POST", "OPTIONS"])
@requires_auth
def upvoteAnswer():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    answerId = params["answerId"]
    userId = params["userId"]
    return jsonify(app.questions_repo.upvoteAnswer(answerId, userId))


@app.route("/questions/answer/downvote", methods=["POST", "OPTIONS"])
@requires_auth
def downvoteAnswer():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    answerId = params["answerId"]
    userId = params["userId"]
    return jsonify(app.questions_repo.downvoteAnswer(answerId, userId))


@app.route("/questions/upvote/remove", methods=["POST", "OPTIONS"])
@requires_auth
def removeQuestionUpvote():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    questionId = params["questionId"]
    userId = params["userId"]
    return jsonify(app.questions_repo.removeQuestionUpvote(questionId, userId))


@app.route("/questions/downvote/remove", methods=["POST", "OPTIONS"])
@requires_auth
def removeQuestionDownvote():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    questionId = params["questionId"]
    userId = params["userId"]
    return jsonify(app.questions_repo.removeQuestionDownvote(questionId, userId))


@app.route("/questions/answer/upvote/remove", methods=["POST", "OPTIONS"])
@requires_auth
def removeAnswerUpvote():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    answerId = params["answerId"]
    userId = params["userId"]
    return jsonify(app.questions_repo.removeAnswerUpvote(answerId, userId))


@app.route("/questions/answer/downvote/remove", methods=["POST", "OPTIONS"])
@requires_auth
def removeAnswerDownvote():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    answerId = params["answerId"]
    userId = params["userId"]
    return jsonify(app.questions_repo.removeAnswerDownvote(answerId, userId))
