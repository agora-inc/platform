
import React from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { PaymentForm } from "./PaymentForm";
import { stripePublicKey } from "../../../config";

const stripeTestPromise = loadStripe(stripePublicKey)

export function StripeContainer() {
	return (
		<Elements stripe={stripeTestPromise}>
			{/* <PaymentForm 
			plan={"tier1"} mode={"sub"} audSize={"small"} quantity={1} channelId={132}
			/> */}
		</Elements>
	)
}