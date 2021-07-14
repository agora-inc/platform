import React, { useState, FunctionComponent } from "react"
import { User } from "../../../Services/UserService";
import {CardElement, useStripe, useElements, ElementsConsumer} from '@stripe/react-stripe-js';
import { PaymentService, PaymentData } from "../../../Services/PaymentService";
import { Select } from "grommet";


/////////////////////////////
// Does not work (WIP).
/////////////////////////////
// Skeletton of our homemade payment UI form (this one won't redirect to stripe). 
// This will be integrated later (Remy).
/////////////////////////////
const CARD_OPTIONS = {
    "hidePostalCode": true,
	style: {
		base: {
			iconColor: "#c4f0ff",
			color: "black",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "#fce883" },
			"::placeholder": { color: "#87bbfd" }
		},
		invalid: {
			iconColor: "red",
			color: "red"
		}
	}
}

interface Props {
    user: User
}



export const PaymentForm:FunctionComponent<Props> = (props) => {    
    const [productId, setProductId] = useState<PaymentData["productId"]>(1);
    const [quantity, setQuantity] = useState<PaymentData["quantity"]>(1);
    const [channelId, setChannelId] = useState<PaymentData["channelId"]>(123);


    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const cardElement = elements.getElement(CardElement);

        // Use your card Element with other Stripe.js APIs
        const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement!,
        });

        if (error) {
        console.log('[error]', error);
        } else {
        console.log('[PaymentMethod]', paymentMethod);
        PaymentService.createCheckoutSessionFromId(
            productId,
            props.user.id,
            quantity,
            channelId!,
            () => {}
        )
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <CardElement options={CARD_OPTIONS}/>
                <button type="submit" disabled={!stripe}>
                Pay
                </button>
            </form>
        </>
    );
}