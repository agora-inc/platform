from flask import jsonify, request, render_template

from app import app
from app.auth import requires_auth
from .helpers import log_request

BASE_API_URL = "https://mora.stream/api"
# BASE_API_URL = "http://localhost:8000/api"


# --------------------------------------------
# SEARCH ROUTES
# --------------------------------------------
@app.route("/search", methods=["POST", "OPTION"])
def fullTextSearch():
    if request.method == "OPTIONS":
        return jsonify("ok")
    params = request.json
    objectTypes = params["objectTypes"]
    searchString = params["searchString"]
    results = {
        objectType: app.search_repo.searchTable(objectType, searchString)
        for objectType in objectTypes
    }
    return jsonify(results)


# --------------------------------------------
# METATAG ROUTES (this is a hack for link sharing on social media)
# --------------------------------------------
@app.route("/event-link", methods=["GET"])
def eventLinkRedirect():
    try:
        eventId = request.args.get("eventId")
        talk_info = app.talk_repo.getTalkById(eventId)
        title = talk_info["name"]
        description = talk_info["description"]
        channel_name = talk_info["channel_name"]
        channel_id = app.channel_repo.getChannelByName(channel_name)["id"]

        real_url = f"https://mora.stream/event/{eventId}"
        hack_url = f"{BASE_API_URL}/event-link?eventId={eventId}"
        image = f"{BASE_API_URL}/channels/avatar?channelId={channel_id}"

        res_string = f"""
            <html>
                <head>
                    <title>{title}</title>
                    <meta property="title" content="{title}" />
                    <meta name="description" content="{description}" />
                    <meta property="og:title" content="{title}" />
                    <meta property="og:description" content="{description}" />
                    <meta property="og:url" content="{hack_url}" />
                    <meta property="og:image" content="{image}" />
                    <meta property="og:type" content="article" />
                    <meta http-equiv="refresh" content="1; URL='{real_url}'" />
                </head>
            </html>
        """
        return render_template(res_string)
    except Exception as e:
        return str(e)


@app.route("/channel-link", methods=["GET"])
def channelLinkRedirect():
    try:
        channel_id = request.args.get("channelId")
        channel_info = app.channel_repo.getChannelById(channel_id)
        name = channel_info["name"]
        long_description = channel_info["long_description"]
        real_url = f"https://mora.stream/{name}"
        hack_url = f"{BASE_API_URL}/channel-link?channelId={channel_id}"
        image = f"{BASE_API_URL}/api/channels/avatar?channelId={channel_id}"

        res_string = f"""
            <html>
                <head>
                    <title>{name}</title>
                    <meta property="title" content="{name}" />
                    <meta name="description" content="{long_description}" />
                    <meta property="og:title" content="{name}" />
                    <meta property="og:description" content="{long_description}" />
                    <meta property="og:url" content="{hack_url}" />
                    <meta property="og:image" content="{image}" />
                    <meta property="og:type" content="article" />
                    <meta http-equiv="refresh" content="1; URL='{real_url}'" />
                </head>
            </html>
        """
        return render_template(res_string)
    except Exception as e:
        return jsonify(str(e))


# --------------------------------------------
# Research seminars scraping
# --------------------------------------------
@app.route("/rsscraping/createAgora", methods=["POST", "OPTIONS"])
@requires_auth
def createAgoraGetTalkIds():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    (
        is_valid,
        talk_ids,
        channel_id,
        channel_name,
        link,
    ) = app.scraper_repo.create_agora_and_get_talk_ids(
        params["url"], params["user_id"], params["topic_1_id"]
    )
    response = jsonify(
        {
            "isValidSeries": is_valid,
            "allTalkIds": talk_ids,
            "channelId": channel_id,
            "channelName": channel_name,
            "talkLink": link,
        }
    )
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route("/rsscraping/talks", methods=["POST", "OPTIONS"])
@requires_auth
def publishAllTalks():
    if request.method == "OPTIONS":
        return jsonify("ok")

    params = request.json
    talk_ids = params["idx"]

    talks = app.scraper_repo.parse_create_talks(
        params["url"],
        talk_ids,
        params["channel_id"],
        params["channel_name"],
        params["talk_link"],
        params["topic_1_id"],
        params["audience_level"],
        params["visibility"],
        params["auto_accept_group"],
    )

    response = jsonify(talks)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
