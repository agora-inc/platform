
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import { PaymentForm } from "../PaymentForm/PaymentForm";
import { stripePublicKey } from "../../../config";

const stripeTestPromise = loadStripe(stripePublicKey)

export default function StripeContainer() {
	return (
		<Elements stripe={stripeTestPromise}>
			<PaymentForm />
		</Elements>
	)
}