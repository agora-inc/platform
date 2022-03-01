import os

from flask import jsonify, request

from app import app
from app.auth import requires_auth
from .helpers import log_request
from payment.apis.StripeApi import StripeApi

paymentsApi = StripeApi()

# BASE_URL = "http://localhost:3000"
BASE_URL = "https://mora.stream/"


# --------------------------------------------
# Products
# --------------------------------------------
@app.route("/products/streaming", methods=["GET"])
def getStreamingProductById():
    err = ""
    try:
        product_id = request.args.get("id")
        return jsonify(app.product_repo.getStreamingProductById(product_id))
    except Exception as e:
        err = str(e) + "; "

    try:
        tier = request.args.get("tier")  # = tier1 and tier2
        product_type = request.args.get("productType")  # = 'credits' or 'subscription'
        aud_size = request.args.get("audienceSize")  # = 'small' or 'big'

        return jsonify(
            app.product_repo.getStreamingProductByFeatures(tier, product_type, aud_size)
        )
    except Exception as e:
        err += str(e)

    return jsonify(e)


@app.route("/products/streaming/all", methods=["GET"])
def getAllStreamingProducts():
    try:
        return jsonify(app.product_repo.getAllStreamingProducts())
    except Exception as e:
        return jsonify(str(e))


# --------------------------------------------
# CREDITS
# --------------------------------------------
@app.route("/credits/talk/used", methods=["GET"])
def getUsedStreamCreditForTalk():
    try:
        talk_id = request.args.get("talkId")
        return jsonify(app.credit_repo.getUsedStreamCreditForTalk(talk_id))
    except Exception as e:
        return jsonify(str(e))


@app.route("/credits/channel/available", methods=["GET"])
def getAvailableStreamCreditForChannel():
    try:
        channel_id = request.args.get("channelId")
        return jsonify(app.credit_repo.getAvailableStreamCreditForChannel(channel_id))
    except Exception as e:
        return jsonify(str(e))


@app.route("/credits/talk/available", methods=["GET"])
def getAvailableStreamCreditForTalk():
    try:
        talk_id = request.args.get("talkId")
        return jsonify(app.credit_repo.getAvailableStreamCreditForTalk(talk_id))
    except Exception as e:
        return jsonify(str(e))


@app.route("/credits/talk/add", methods=["GET"])
@requires_auth
def addStreamCreditToTalk():
    try:
        talk_id = request.args.get("talkId")
        increment = request.args.get("increment")

        return jsonify(app.credit_repo.addStreamCreditToTalk(talk_id, increment))
    except Exception as e:
        return jsonify(str(e))


@app.route("/credits/channel/add", methods=["GET"])
@requires_auth
def addStreamingCreditToChannel():
    try:
        channel_id = request.args.get("channelId")
        increment = request.args.get("increment")

        return jsonify(
            app.credit_repo.addStreamingCreditToChannel(channel_id, increment)
        )
    except Exception as e:
        return jsonify(str(e))


@app.route("/credits/talk/increment", methods=["GET"])
@requires_auth
def upgradeStreamTalkByOne():
    try:
        talk_id = request.args.get("talkId")
        return jsonify(app.credit_repo.upgradeStreamTalkByOne(talk_id))
    except Exception as e:
        return jsonify(str(e))


@app.route("/credits/talk/max_audience", methods=["GET"])
def getMaxAudienceForCreditForTalk():
    try:
        talk_id = request.args.get("talkId")
        return jsonify(app.credit_repo.getMaxAudienceForCreditForTalk(talk_id))
    except Exception as e:
        return jsonify(str(e))


# --------------------------------------------
# SUBSCRIPTIONS
# --------------------------------------------
@app.route("/subscriptions/channel", methods=["GET"])
def getActiveSubscriptionForChannel():
    try:
        channel_id = request.args.get("channelId")
        product_id = request.args.get("productId")

        return jsonify(
            app.channel_sub_repo.getActiveSubscriptionId(channel_id, product_id)
        )
    except Exception as e:
        return jsonify(str(e))


@app.route("/subscriptions/channel/all", methods=["GET"])
def getAllActiveSubscriptionsForChannel():
    try:
        channel_id = request.args.get("channelId")
        active_subs = app.channel_sub_repo.getActiveSubscriptions(channel_id)
        return jsonify([sub["product_id"] for sub in active_subs])

    except Exception as e:
        return jsonify(str(e))


@app.route("/subscriptions/channel/cancel", methods=["GET"])
@requires_auth
def cancelSubscriptionForChannel():
    try:
        channel_id = request.args.get("channelId")
        product_id = request.args.get("productId")

        # get subscription_id
        subscription_id = app.channel_sub_repo.getActiveSubscriptionId(
            channel_id, product_id
        )

        # set stop subscription date in stripe
        paymentsApi.stopSubscriptionRenewal(subscription_id)

        # status to "interrupted" in DB
        app.channel_sub_repo.interruptSubscription(subscription_id)

        return "ok"
    except Exception as e:
        return jsonify(str(e))


@app.route("/subscriptions/channel/cancelall", methods=["GET"])
@requires_auth
def cancelAllSubscriptionsForChannel():
    try:
        channel_id = request.args.get("channelId")

        # A. get all active channel subscriptions and cancel all of them
        # get subscription_id
        subscriptions = app.channel_sub_repo.getActiveSubscriptions(channel_id)
        for subscription in subscriptions:
            sub_id = subscription["stripe_subscription_id"]

            # set stop subscription date in stripe
            paymentsApi.stopSubscriptionRenewal(sub_id)

            # status to "interrupted" in DB
            app.channel_sub_repo.interruptSubscription(sub_id)

        return "ok"
    except Exception as e:
        return jsonify(str(e))


# --------------------------------------------
# PAYMENTS
# --------------------------------------------
@app.route("/payment/create-checkout-session", methods=["GET"])
def getStripeSessionForProduct():
    product_id = request.args.get("productId")
    user_id = request.args.get("userId")
    quantity = request.args.get("quantity")

    try:
        # TODO: generalisation for later:
        # product_class = products.getProductlassFromId(product_id)
        product_class = "channel_subscription"

        if product_class == "channel_subscription":
            channel_id = request.args.get("channelId")

            success_url = os.path.join(BASE_URL, "thankyou", "success", channel_id)
            url_cancel = os.path.join(BASE_URL, "thankyou", "error", channel_id)

            # Create checkout session
            res = paymentsApi.get_session_for_streaming_products(
                product_id, success_url, url_cancel, quantity
            )

            # Store checkoutId in DB
            app.channel_sub_repo._addCheckoutSubscription(
                product_id, res["checkout_session_id"], channel_id, user_id
            )

            return jsonify(res)
    except Exception as e:
        return jsonify(str(e))


# NOTE: handling of responses Stripe after checkouts and invoices
@app.route("/payment/stripe_webhook", methods=["POST"])
def stripe_webhook():
    """
    Hack to handle events easily: https://codenebula.io/stripe/node.js/2019/05/02/using-stripe-webhooks-to-handle-failed-subscription-payments-node-js/
    Full doc: https://stripe.com/docs/billing/subscriptions/overview#subscription-events

    Tracked situations, associated stripe events, and summary logic:
        - 1. checkout to pay subscription:
            - 'checkout.session.completed'
            - logic: use "checkout_id" to add "subscription_id" to line in DB with "checkout" status

        - 2. payment first subscription: 
            - 'invoice.paid'
            - logic: grab "subscription_id" and update status in ChannelSubscription as "active"

        # Ignore 3; taken care in the Dashboard (email is sent to user with stripe retrial link. See: https://support.stripe.com/questions/handling-recurring-payments-that-require-customer-action)
        # - 3. failure payment first subscription: 
        #     -'invoice.payment_action_required' (= needs action from customer)
        #     - logic: send email 
        #     - invoice.payment_failed
        #     - logic: db 'status' in ChannelSubscription is "unpaid"

        - 4. successful renewal subscription: 
            - customer.subscription.updated (subscription status is "active")
            - logic: if status is "active", update line.

        - 5. failure renewal subscription: 
            - customer.subscription.updated (subscription status becomes "past_due". After 4 trials, it becomes "unpaid": this is set in dashboard https://dashboard.stripe.com/settings/billing/automatic)
            - logic:
                # - if past_due: change subscription status in DB as "pending_payment"  
                - if past_due: do nothing
                - after 4 trials: change subscription status into "unpaid"

        - 6. cancellation subscription or upgrade plans: 
            - customer.subscription.updated (subscription status becomes "cancelled")
            - logic: update subscription line into 'cancelled'

    Handling:
        - 'checkout.session.completed' (1)
        - 'invoice.paid' (2)
        - 'customer.subscription.updated' (4, 5)
        - 'customer.subscription.deleted' (6)
    
    NOTE: we do not track payments internally (see dashboard Stripe for that)
    """
    # Request too big (protection mechanism; Remy)
    if request.content_length > 1024 * 1024:
        return 400

    payload = request.get_data()
    sig_header = request.environ.get("HTTP_STRIPE_SIGNATURE")

    try:
        # Handling of all the responses
        event = paymentsApi._construct_stripe_event_from_raw(payload, sig_header)

        # A. Handle successful checkout sessions (Sent when a customer clicks the Pay or Subscribe button in Checkout, informing you of a new purchase.)
        if event["type"] == "checkout.session.completed":
            checkout_id = event["data"]["object"]["id"]

            # TODO: generalisation for later:
            # stripe_product_id = event["data"]["lines"]["data"][0]["price"]
            # product_class = products.getProductlassFromStripeId(stripe_product_id)
            product_class = "channel_subscription"

            # 1. If StreamingSubscription: add a line in DB and add customer in PaymentHistory
            if product_class == "channel_subscription":
                stripe_subscription_id = event["data"]["object"]["subscription"]
                app.channel_sub_repo._addStripeSubscriptionId(
                    checkout_id, stripe_subscription_id
                )
            # 2. If credits
            else:
                return NotImplementedError

        # B. Handle paid invoice
        elif event["type"] == "invoice.paid":
            # TODO: generalisation for later:
            # stripe_product_id = event["data"]["lines"]["data"][0]["price"]
            # product_class = products.getProductlassFromStripeId(stripe_product_id)
            product_class = "channel_subscription"

            #  Update subscription into active
            if product_class == "channel_subscription":
                stripe_subscription_id = event["data"]["object"]["subscription"]

                app.channel_sub_repo.updateSubscriptionStatus(
                    stripe_subscription_id=stripe_subscription_id, status="active"
                )

        # C. Changes of status of subscription
        # (Stripe: "Sent each billing interval if there is an issue with your customer’s payment method.")
        elif event["type"] == "customer.subscription.updated":
            stripe_subscription_id = event["data"]["object"]["id"]
            subscription_status = event["data"]["object"]["status"]

            if subscription_status == "active":
                app.channel_sub_repo.updateSubscriptionStatus(
                    stripe_subscription_id=stripe_subscription_id, status="active"
                )

            elif subscription_status == "past_due":
                # do nothing here
                pass

            elif subscription_status == "cancelled":
                app.channel_sub_repo.updateSubscriptionStatus(
                    stripe_subscription_id=stripe_subscription_id, status="cancelled"
                )

        # C. Subscriptions that are changed into cancelled (Stripe dashboard: after 30 days unpaid. https://dashboard.stripe.com/settings/billing/automatic)
        #  - Cancelled subscriptions
        elif event["type"] == "customer.subscription.deleted":
            stripe_subscription_id = event["data"]["object"]["id"]

            app.channel_sub_repo.updateSubscriptionStatus(
                stripe_subscription_id=stripe_subscription_id, status="cancelled"
            )

        return {}

    except Exception as e:
        return {}, 400
