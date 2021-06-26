import React, { useEffect, useState, FunctionComponent } from "react"
import { loadStripe } from "@stripe/stripe-js";
import { PaymentService, PaymentData } from "../../../Services/PaymentService";
import { stripePublicKey } from "../../../config"
import { Text, Box } from "grommet";


interface Props extends PaymentData{
    text: string
}

// const CheckoutPaymentButton = () => {    
//     const [plan, setPlan] = useState<PaymentData["plan"]>("tier1");
//     const [mode, setMode] = useState<PaymentData["mode"]>("sub");
//     const [audSize, setAudSize] = useState<PaymentData["audSize"]>("small");
//     const [quantity, setQuantity] = useState<PaymentData["quantity"]>(1);
//     const [channelId, setChannelId] = useState<PaymentData["channelId"]>(123);

const CheckoutPaymentButton:FunctionComponent<Props> = (props) => {    
    const [plan, setPlan] = useState<PaymentData["plan"]>(props.plan);
    const [mode, setMode] = useState<PaymentData["mode"]>(props.mode);
    const [audSize, setAudSize] = useState<PaymentData["audSize"]>(props.audSize);
    const [quantity, setQuantity] = useState<PaymentData["quantity"]>(props.quantity);
    const [channelId, setChannelId] = useState<PaymentData["channelId"]>(props.channelId);
    
    const stripePromise = loadStripe(stripePublicKey);

    const button = document.querySelector("checkout_button")!

    // useEffect(() => {
    //     // Similar to componentDidMount and componentDidUpdate:
    //     button.addEventListener('click', event => onClick());

    //     // Similar to componentDidUnmount
    //     return () => {
    //         button.removeEventListener('click', event => onClick())}
    // });

    const onClick = async () => {
        PaymentService.createCheckoutSession(
            plan,
            mode,
            audSize,
            quantity,
            channelId,
            async (data: {
                checkout_public_key: string, 
                checkout_session_id: string
            }) => {
                const stripe = await stripePromise;
                if (!stripe) {
                    // Stripe.js has not loaded yet. Make sure to disable
                    // form submission until Stripe.js has loaded.
                    return;
                }
                else {
                    stripe.redirectToCheckout({
                        // Make the id field from the Checkout Session creation API response
                        // available to this file, so you can provide it as parameter here
                        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
                        sessionId: data.checkout_session_id
                    }).then(function (result) {
                        // If `redirectToCheckout` fails due to a browser or network
                        // error, display the localized error message to your customer
                        // using `result.error.message`.
                    });
                }
            }
        )
    }
    
    return (
        <Box
            onClick={onClick}
            background="#0C385B"
            round="xsmall"
            pad="xsmall"
            width="160px"
            height="40px"
            justify="center"
            align="center"
            focusIndicator={false}
            hoverIndicator="#6DA3C7"
            alignSelf="center"
        >
            <Text size="14px" weight="bold">{props.text}</Text>
        </Box>
    );
}

export default CheckoutPaymentButton