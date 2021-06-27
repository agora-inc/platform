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
        stripe.api_key = self.secret_api_key
        self.products = ProductRepository.ProductRepository()

    ###################
    # EVENT HANDLING
    ###################
    def _construct_event(self, payload, sig_header):
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, self.secret_api_key)
        except ValueError as e:
            # Invalid payload
            print('INVALID PAYLOAD')
            return {}, 400
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            print('INVALID SIGNATURE')
            return {}, 400

    def handle_completed_checkout():
        # A. Handle successfull checkout sessions
        session = event['data']['object']
        print(session)
        line_items = stripe.checkout.Session.list_line_items(session['id'], limit=1)
        print(line_items['data'][0]['description'])
        # get payment_intent and store in DB

    def handle_failed_checkout():
        raise NotImplementedError

    def handle_successful_subscription_renewal():
        raise NotImplementedError


    def handle_failed_subscription_renewal():
        raise NotImplementedError


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

        with open("/home/cloud-user/test/thierryenri.txt", "w") as file:
            file.write(str(res))
            #
            #
            # WIP
            #
            #
            #

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

    # def get_session_tier1_sub(self, aud_size=str, url_success="", url_cancel=""):
    #     if aud_size == "small":
    #         price_id = "price_1J4uivLrLOIeFgs2B0dhssIO"
    #     elif aud_size == "big":
    #         price_id = "price_1J6NdvLrLOIeFgs2SDdOo8Qk"
    #     else:
    #         raise Exception("subscribe_doctoral_subscription (StripeApi): aud_size must be 'big' or 'small'.")
        
    #     return self._create_checkout_session(price_id, 'subscription', url_success, url_cancel)

    # def get_session_tier2_sub(self, aud_size=str, url_success="", url_cancel=""):
    #     if aud_size == "small":
    #         price_id = "price_1J6NeWLrLOIeFgs2GGFTN1Ua"
    #     elif aud_size == "big":
    #         price_id = "price_1J6NfNLrLOIeFgs2uLY37fUq"
    #     else:
    #         raise Exception("subscribe_doctoral_subscription (StripeApi): aud_size must be 'big' or 'small'.")
        
    #     return self._create_checkout_session(price_id, 'subscription', url_success, url_cancel)

    # def get_session_tier1_credits(self, aud_size: str, url_success="", url_cancel="", n_credits=1):
    #     if aud_size == "small":
    #         price_id = "price_1J6NW3LrLOIeFgs2bjQ3RqvD"
    #     elif aud_size == "big":
    #         price_id = "price_1J6NbILrLOIeFgs2QK8rlqEk"
    #     else:
    #         raise Exception("subscribe_doctoral_subscription (StripeApi): aud_size must be 'big' or 'small'.")
        
    #     return self._create_checkout_session(price_id, 'payment', url_success, url_cancel, n_credits)

    # def get_session_tier2_credits(self, aud_size: str, url_success="", url_cancel="", n_credits=1):
    #     if aud_size == "small":
    #         price_id = "price_1J6NYDLrLOIeFgs2YXXiiX0v"
    #     elif aud_size == "big":
    #         price_id = "price_1J6NadLrLOIeFgs2R6QS2BKS"
    #     else:
    #         raise Exception("subscribe_doctoral_subscription (StripeApi): aud_size must be 'big' or 'small'.")

    #     return self._create_checkout_session(price_id, 'payment', url_success, url_cancel, n_credits)
