import stripe


# https://www.youtube.com/watch?v=XKWJFpZYVAQ
# https://www.youtube.com/watch?v=cC9jK3WntR8


# https://stripe.com/docs/api/connected_accounts?lang=python
# https://stripe.com/docs/checkout/integration-builder


class StripeApi:
    def __init__(self):
        self.public_api_key = "pk_test_51Iw99yLrLOIeFgs2F3sI5NMIe1kBXsF77aYrMCR3TuYhISPeVsZhTNDA1XM6BPOU3twkiVzOS7VaYLeYHnxlPdyo00ffb4tyAZ"
        self.secret_api_key = "sk_test_51Iw99yLrLOIeFgs2pUoBjwUWPlbIB5mon6FkAMf1Dyf0SOyzARZ0vuqUcNvlOAQubBrXhcXH2fDG5X56erlyCWvQ00JsRaRN9Y"
        stripe.api_key = self.secret_api_key

    def _create_checkout_session(self, pricing_id: str, pricing_mode: str, url_success="", url_cancel="", quantity=1):
        """Stripe create session wrapper

        Args:
            pricing_id (str): pricing id of the product
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

    def get_session_tier1_sub(self, aud_size=str, url_success="", url_cancel=""):
        if aud_size == "small":
            price_id = "price_1J4uivLrLOIeFgs2B0dhssIO"
        elif aud_size == "big":
            price_id = "price_1J6NdvLrLOIeFgs2SDdOo8Qk"
        else:
            raise Exception("subscribe_doctoral_subscription (StripeApi): aud_size must be 'big' or 'small'.")
        
        return self._create_checkout_session(price_id, 'subscription', url_success, url_cancel)

    def get_session_tier2_sub(self, aud_size=str, url_success="", url_cancel=""):
        if aud_size == "small":
            price_id = "price_1J6NeWLrLOIeFgs2GGFTN1Ua"
        elif aud_size == "big":
            price_id = "price_1J6NfNLrLOIeFgs2uLY37fUq"
        else:
            raise Exception("subscribe_doctoral_subscription (StripeApi): aud_size must be 'big' or 'small'.")
        
        return self._create_checkout_session(price_id, 'subscription', url_success, url_cancel)

    def get_session_tier1_credits(self, aud_size: str, url_success="", url_cancel="", n_credits=1):
        if aud_size == "small":
            price_id = "price_1J6NW3LrLOIeFgs2bjQ3RqvD"
        elif aud_size == "big":
            price_id = "price_1J6NbILrLOIeFgs2QK8rlqEk"
        else:
            raise Exception("subscribe_doctoral_subscription (StripeApi): aud_size must be 'big' or 'small'.")
        
        return self._create_checkout_session(price_id, 'payment', url_success, url_cancel, n_credits)

    def get_session_tier2_credits(self, aud_size: str, url_success="", url_cancel="", n_credits=1):
        if aud_size == "small":
            price_id = "price_1J6NYDLrLOIeFgs2YXXiiX0v"
        elif aud_size == "big":
            price_id = "price_1J6NadLrLOIeFgs2R6QS2BKS"
        else:
            raise Exception("subscribe_doctoral_subscription (StripeApi): aud_size must be 'big' or 'small'.")

        return self._create_checkout_session(price_id, 'payment', url_success, url_cancel, n_credits)

    def checkSubscriptionStatus(self):
        raise NotImplementedError
