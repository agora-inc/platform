import stripe


# https://www.youtube.com/watch?v=XKWJFpZYVAQ
# https://www.youtube.com/watch?v=cC9jK3WntR8


# https://stripe.com/docs/api/connected_accounts?lang=python
# https://stripe.com/docs/checkout/integration-builder


class StripeApi:
    def __init__(self):
        self.public_api_key = "pk_test_51Iw99yLrLOIeFgs2F3sI5NMIe1kBXsF77aYrMCR3TuYhISPeVsZhTNDA1XM6BPOU3twkiVzOS7VaYLeYHnxlPdyo00ffb4tyAZ"
        self.secret_api_key = "sk_test_51Iw99yLrLOIeFgs2pUoBjwUWPlbIB5mon6FkAMf1Dyf0SOyzARZ0vuqUcNvlOAQubBrXhcXH2fDG5X56erlyCWvQ00JsRaRN9Y"
        
        raise NotImplementedError

    def _create_checkout_session(self, pricing_id: str, mode: str):
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
                    'quantity': 1,
                }],
                mode=mode,
                # success_url=url_for('thanks', _external=True) + '?session_id={CHECKOUT_SESSION_ID}',
                # cancel_url=url_for('index', _external=True),
                success_url="https://agora.stream/thanks",
                cancel_url="https://agora.stream/failed"
            )
        return {
            'checkout_session_id': session['id'], 
            'checkout_public_key': self.public_api_key
        }


    def start_professor_subscription(self):
        price_id = "price_1J4uivLrLOIeFgs2g6LbpI4O"
        return self._create_checkout_session(price_id, 'payment')



    def requestPayment(self):
        raise NotImplementedError

    def startSubscription(self):
        raise NotImplementedError

    def stopSubscription(self):
        raise NotImplementedError