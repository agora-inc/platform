import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import { useAuth0 } from "@auth0/auth0-react";
import Identicon from "react-identicons";

import { useStore } from "../../store";
import Loading from "../Core/Loading";
import { Channel, ChannelService } from "../../Services/ChannelService";
import SignUpButton from "./SignUpButton";
import AgoraLogo from "../assets/general/agora_logo_v2.png";
import "../Styles/trending-channels-box.css";

export const SubscribedChannelsList = () => {
  const { getAccessTokenSilently } = useAuth0();

  const user = useStore((state) => state.loggedInUser);

  const [memberChannels, setMemberChannels] = useState<Channel[]>([]);
  const [followerChannels, setFollowerChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    if (!user) {
      return;
    }
    const token = await getAccessTokenSilently();
    ChannelService.getChannelsForUser(
      user.id,
      ["follower"],
      (channels: Channel[]) => {
        setFollowerChannels(channels);
        setLoading(false);
      },
      token
    );
    ChannelService.getChannelsForUser(
      user.id,
      ["member"],
      (channels: Channel[]) => {
        setMemberChannels(channels);
        setLoading(false);
      },
      token
    );
  };

  if (user) {
    if (memberChannels.length === 0 && followerChannels.length === 0) {
      return (
        <Box
          background="white"
          round="xsmall"
          height="12.4rem"
          margin={{ horizontal: "small", bottom: "10px" }}
          pad="medium"
          gap="small"
          justify="between"
        >
          <Text size="1.4rem" weight="bold" style={{ font: "italic" }}>
            <img src={AgoraLogo} height="19px" />s you are a member of will
            appear here
          </Text>
          {/* <Text size="16px" color="grey">
            Use the search bar to find channels that interest you
          </Text> */}
        </Box>
      );
    } else {
      return (
        <Box direction="column" gap="50px" margin={{ top: "15px" }}>
          {memberChannels.length !== 0 && (
            <Box>
              <Text
                size="14px"
                weight="bold"
                color="grey"
                margin={{ left: "small", top: "xsmall" }}
              >
                Your <img src={AgoraLogo} height="13px" />s
              </Text>
              {loading && (
                <Box width="100%" height="80%" justify="center" align="center">
                  <Loading color="black" size={50} />
                </Box>
              )}
              <Box margin={{ top: "2px" }}>
                {memberChannels.map((channel: Channel) => (
                  <Link
                    className="channel"
                    to={`/${channel.name}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      direction="row"
                      gap="xsmall"
                      align="center"
                      pad={{ vertical: "3.5px", horizontal: "small" }}
                    >
                      <Box
                        background="white"
                        height="30px"
                        width="30px"
                        round="15px"
                        justify="center"
                        align="center"
                        overflow="hidden"
                        style={{ minWidth: "30px", minHeight: "30px" }}
                      >
                        {!channel.has_avatar && (
                          <Identicon string={channel.name} size={30} />
                        )}
                        {!!channel.has_avatar && (
                          <img
                            src={ChannelService.getAvatar(channel.id)}
                            height={30}
                            width={30}
                          />
                        )}
                      </Box>
                      <Box justify="between">
                        <Text size="14px" weight="bold" color="black">
                          {channel.name}
                        </Text>
                        {/* <Text size="12px" weight="bold" color="#6B6A6A">
                          Last live 3 days ago
                        </Text> */}
                      </Box>
                    </Box>
                  </Link>
                ))}
              </Box>
            </Box>
          )}
          {followerChannels.length !== 0 && (
            // NOTE: following feature has been globally disabled for now
            <Box>
              <Text
                size="14px"
                weight="bold"
                color="grey"
                margin={{ left: "small", top: "xsmall" }}
              >
                Following
              </Text>
              {loading && (
                <Box width="100%" height="80%" justify="center" align="center">
                  <Loading color="black" size={50} />
                </Box>
              )}
              <Box margin={{ top: "2px" }}>
                {followerChannels.map((channel: Channel) => (
                  <Link
                    className="channel"
                    to={`/${channel.name}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      direction="row"
                      gap="xsmall"
                      align="center"
                      pad={{ vertical: "3.5px", horizontal: "small" }}
                    >
                      <Box
                        background="white"
                        height="30px"
                        width="30px"
                        round="15px"
                        justify="center"
                        align="center"
                        overflow="hidden"
                        style={{ minWidth: "30px", minHeight: "30px" }}
                      >
                        {!channel.has_avatar && (
                          <Identicon string={channel.name} size={30} />
                        )}
                        {!!channel.has_avatar && (
                          <img
                            src={ChannelService.getAvatar(channel.id)}
                            height={30}
                            width={30}
                          />
                        )}
                      </Box>
                      <Box justify="between">
                        <Text size="14px" weight="bold" color="black">
                          {channel.name}
                        </Text>
                        {/* <Text size="12px" weight="bold" color="#6B6A6A">
                          Last live 3 days ago
                        </Text> */}
                      </Box>
                    </Box>
                  </Link>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      );
    }
  } else {
    return (
      <Box
        background="white"
        round="xsmall"
        height="225px"
        margin={{ horizontal: "small", bottom: "10px" }}
        pad="medium"
        gap="small"
        justify="between"
      >
        <Box gap="xsmall">
          <Text size="1.2rem" weight="bold" margin={{ bottom: "5px" }}>
            Join your{" "}
            {
              <Text size="1.2rem" weight="bold" color="color1">
                Agora
              </Text>
            }{" "}
            Community
          </Text>
          <Text size="14px" color="grey" weight="bold">
            Get access to member-only events, talk recordings and many more!
          </Text>
        </Box>
        <SignUpButton callback={() => {}} />
      </Box>
    );
  }
};
