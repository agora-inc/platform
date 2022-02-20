from flask import jsonify, request

from app import app
from app.auth import requires_auth
from .helpers import log_request


@app.route("/users/all")
@requires_auth
def getAllUsers():
    return jsonify(app.user_repo.getAllUsers())


@app.route("/users/public")
def getPublicUsers():
    return jsonify(app.user_repo.getAllPublicUsers())


@app.route("/users/user")
@requires_auth
def getUser():
    username = request.args.get("username")
    return jsonify(app.user_repo.getUser(username))


@app.route("/users/add", methods=["POST"])
def addUser():
    if request.method == "OPTIONS":
        return jsonify("ok")

    log_request(request)
    params = request.json
    username = params["username"]
    password = params["password"]
    email = params["email"]
    position = params["position"]
    institution = params["institution"]
    refChannel = params["refChannel"]
    user = app.user_repo.addUser(
        username, password, email, position, institution, refChannel
    )

    if type(user) == list and len(user) > 1 and user[1] == 400:
        app.logger.error(
            f"Attempted registration of new user with existing email {email}"
        )
        return user

    try:
        app.invited_users_repo.transfertInvitedMembershipsToUser(user["id"], email)
    except:
        # We need to keep trace if an error happens.
        # TODO: add this into logs in a file called "issue to fix manually"
        pass

    app.logger.error(
        f"Successful registration of new user with username {username} and email {email}"
    )

    accessToken = app.user_repo.encodeAuthToken(user["id"], "access")
    refreshToken = app.user_repo.encodeAuthToken(user["id"], "refresh")

    return jsonify(
        {
            "id": user["id"],
            "username": user["username"],
            "accessToken": accessToken.decode(),
            "refreshToken": refreshToken.decode(),
        }
    )


@app.route("/users/update_bio", methods=["POST"])
def updateBio():
    authToken = request.headers.get("Authorization").split(" ")[1]
    userId = app.user_repo.decodeAuthToken(authToken)
    params = request.json
    updatedUser = app.user_repo.updateBio(userId, params["newBio"])
    return jsonify(updatedUser)


@app.route("/users/update_public", methods=["POST"])
def updatePublic():
    authToken = request.headers.get("Authorization").split(" ")[1]
    userId = app.user_repo.decodeAuthToken(authToken)
    params = request.json
    updatedUser = app.user_repo.updatePublic(userId, params["public"])
    return jsonify(updatedUser)