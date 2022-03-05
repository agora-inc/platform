import React, { useState } from "react";
import { Text, Box } from "grommet";
import { useAuth0 } from "@auth0/auth0-react";

import { ChannelSubscriptionService } from "../../../Services/ChannelSubscriptionService";

interface Props {
  channelId: number;
}

export const CancelSubscriptionsButton = ({ channelId }: Props) => {
  const [text, setText] = useState("Unsubscribe");

  const { getAccessTokenSilently } = useAuth0();

  const onClick = async () => {
    const token = await getAccessTokenSilently();
    ChannelSubscriptionService.cancelAllSubscriptionsForChannel(
      channelId,
      (data: any) => {
        if (data == "ok") {
          setText("Successfully unsubscribed");
        } else {
          setText(data);
        }
      },
      token
    );
  };

  return (
    <Box
      onClick={onClick}
      background="#FF4040"
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
      <Text size="14px" weight="bold">
        {text}
      </Text>
    </Box>
  );
};
