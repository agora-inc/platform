import React, { Component, useState } from "react";
import { Box, Text } from "grommet";
import { User } from "../../Services/UserService";
import { ChannelService } from "../../Services/ChannelService";
import Identicon from "react-identicons";
import Avatar from "react-avatar";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  user: User;
  channelId?: number;
  onRemovedCallback?: any;
  showRemoveButton: boolean;
}

export const ChannelPageUserCircle = (props: Props) => {
  const [hover, setHover] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const onRemoveClicked = async () => {
    const token = await getAccessTokenSilently();
    props.channelId &&
      ChannelService.removeUserFromChannel(
        props.user.id,
        props.channelId,
        () => {
          props.onRemovedCallback();
        },
        token
      );
  };

  return (
    <Box style={{ position: "relative" }}>
      {hover && (
        <Box
          direction="row"
          style={{
            zIndex: 10,
            border: "2px solid black",
            width: "fit-content",
          }}
          height="35px"
          background="white"
          round="xsmall"
          pad={{ horizontal: "3px" }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          align="center"
          gap="xsmall"
        >
          <Text size="14px" weight="bold" color="black">
            {props.user.username}
          </Text>
          {props.showRemoveButton && (
            <Box
              background="#FF4040"
              round="4px"
              pad="2.5px"
              align="center"
              justify="center"
              onClick={onRemoveClicked}
            >
              <Text color="white" size="14px" style={{ fontWeight: 500 }}>
                remove
              </Text>
            </Box>
          )}
        </Box>
      )}
      <Box
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        // background="white"
        height="40px"
        width="40px"
        // round="25px"
        justify="center"
        align="center"
        margin={{ top: hover ? "-23px" : "none" }}
      >
        <Avatar name={props.user.username} size="33" round={true} />
      </Box>
    </Box>
  );
};
