import React, { useState, FunctionComponent } from "react";
import { Text, Box } from "grommet";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth0 } from "@auth0/auth0-react";

import { PaymentService, PaymentData } from "../../../Services/PaymentService";
import { stripePublicKey } from "../../../config";
import { useStore } from "../../../store";

interface Props extends PaymentData {
  text?: string;
  channelId?: number;
}

export const CheckoutPaymentButton = (props: Props) => {
  const stripePromise = loadStripe(stripePublicKey);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  const onClick = async () => {
    const token = await getAccessTokenSilently();

    // create checkout
    user &&
      PaymentService.createCheckoutSessionFromId(
        props.productId,
        user.id,
        props.quantity,
        props.channelId!,
        async (data: {
          checkout_public_key: string;
          checkout_session_id: string;
        }) => {
          const stripe = await stripePromise;
          if (!stripe) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
          } else {
            console.log(data.checkout_session_id);
            // report "initiated" transaction
            stripe.redirectToCheckout({
              // Make the id field from the Checkout Session creation API response
              // available to this file, so you can provide it as parameter here
              // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
              sessionId: data.checkout_session_id,
            });
            // .then(function (result) {
            //     // If `redirectToCheckout` fails due to a browser or network
            //     // error, display the localized error message to your customer
            //     // using `result.error.message`.
            //     if (result.error){
            //     }
            //     else {
            //     };
            // }
          }
        },
        token
      );
  };

  return (
    <Box
      onClick={onClick}
      background="#D3F930"
      hoverIndicator="#7BA59E"
      round="xsmall"
      pad="xsmall"
      width="160px"
      height="40px"
      justify="center"
      align="center"
      focusIndicator={false}
      alignSelf="center"
    >
      <Text size="14px" weight="bold">
        {props.text}
      </Text>
    </Box>
  );
};
