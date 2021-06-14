import stripe


# https://stripe.com/docs/api/connected_accounts?lang=python


class StripeApi:
    def __init__(self):
        self.api = "pk_test_51Iw99yLrLOIeFgs2F3sI5NMIe1kBXsF77aYrMCR3TuYhISPeVsZhTNDA1XM6BPOU3twkiVzOS7VaYLeYHnxlPdyo00ffb4tyAZ"
        raise NotImplementedError

    def requestPayment(self):
        raise NotImplementedError

    def startSubscription(self):
        raise NotImplementedError

    def stopSubscription(self):
        raise NotImplementedError