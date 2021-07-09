import stripe
from repository import ProductRepository
# https://www.youtube.com/watch?v=XKWJFpZYVAQ
# https://www.youtube.com/watch?v=cC9jK3WntR8


# https://stripe.com/docs/api/connected_accounts?lang=python
# https://stripe.com/docs/checkout/integration-builder


class StripeApi:
    def __init__(self):
        self.public_api_key = "pk_test_51Iw99yLrLOIeFgs2F3sI5NMIe1kBXsF77aYrMCR3TuYhISPeVsZhTNDA1XM6BPOU3twkiVzOS7VaYLeYHnxlPdyo00ffb4tyAZ"
        self.secret_api_key = "sk_test_51Iw99yLrLOIeFgs2pUoBjwUWPlbIB5mon6FkAMf1Dyf0SOyzARZ0vuqUcNvlOAQubBrXhcXH2fDG5X56erlyCWvQ00JsRaRN9Y"
        self.endpoint_secret = "whsec_E2qdIOIiKLZd8GjTAiMpdBmBl7yhDh8b"
        
        # init objects
        stripe.api_key = self.secret_api_key
        self.products = ProductRepository.ProductRepository()

    ###################
    # SUBSCRIPTION HANDLING
    ###################
    def stopSubscriptionRenewal(self, subscription_id):
        try:
            stripe.Subscription.modify(
                subscription_id,
                cancel_at_period_end=True
            )
            return "ok"
        except Exception as e:
            return str(e)

    ###################
    # EVENT HANDLING
    ###################
    def _construct_stripe_event_from_raw(self, payload, sig_header):
        try:
            return stripe.Webhook.construct_event(payload, sig_header, self.endpoint_secret)
        except ValueError as e:
            # Invalid payload
            return {'INVALID PAYLOAD'}, 400
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return {'INVALID SIGNATURE'}, 400

    ###################
    # CHECKOUT PAGE
    ###################
    def _create_checkout_session(self, pricing_id: str, pricing_mode: str, quantity=1, url_success="", url_cancel=""):
        """Stripe create session wrapper

        Args:
            pricing_id (str): Stripe pricing id of the product
            mode (str): either 'payment', 'subscription' or 'setup'

        Returns:
            {id: checkout_session_id}: dictionary for checkout_session_id
        """
        session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price': pricing_id,
                    'quantity': quantity,
                }],
                mode=pricing_mode,
                # success_url=url_for('thanks', _external=True) + '?session_id={CHECKOUT_SESSION_ID}',
                # cancel_url=url_for('index', _external=True),
                success_url=url_success,
                cancel_url=url_cancel
            )

        return {
            'checkout_session_id': session['id'], 
        }

    def get_session_for_streaming_products(self, product_id, url_success="", url_cancel="", quantity=1):
        res = self.products.getStreamingProductById(product_id)

        try:
            if res["product_type"] == "subscription":
                product_type = 'subscription'
            elif res["product_type"] == "credit":
                product_type = 'payment'
            else:
                return Exception("get_session_for_streaming_products: no valid payment_type found.")

            return self._create_checkout_session(
                res["stripe_product_id"], 
                product_type,
                quantity,
                url_success, 
                url_cancel)
        except Exception as e:
            return f"(get_session_for_streaming_products) Error: {str(e)}"
