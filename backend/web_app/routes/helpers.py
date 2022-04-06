from app import app


def log_request(request):
    try:
        authToken = request.headers.get("Authorization").split(" ")[1]
        userId = app.user_repo.decodeAuthToken(authToken)
    except:
        userId = None
    if request.method == "GET":
        app.logger.debug(
            f"request made to {request.path} with args {request.args} {f'by user with id {userId}' if userId else ''}"
        )
    elif request.method == "POST":
        app.logger.debug(
            f"request made to {request.path} with body {request.data} {f'by user with id {userId}' if userId else ''}"
        )

