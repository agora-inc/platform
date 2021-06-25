import React, { useState } from "react"
import {CardElement, useStripe, useElements, ElementsConsumer} from '@stripe/react-stripe-js';
import { PaymentService, PaymentData } from "../../../Services/PaymentService";
import { Select } from "grommet";


// NOTE: in-house payment UI. Will be integrated later (Remy).

export const CheckoutButton = () => {    
    const [plan, setPlan] = useState<PaymentData["plan"]>("tier1");
    const [mode, setMode] = useState<PaymentData["mode"]>("sub");
    const [audSize, setAudSize] = useState<PaymentData["audSize"]>("small");
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
        PaymentService.getCheckoutSession(
            plan,
            mode,
            audSize,
            quantity,
            channelId,
            () => {}
        )
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <button type="submit" disabled={!stripe}>
                Checkout
                </button>
            </form>
        </>
    );
}