import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import Loading from "../Core/Loading";
import { Channel, ChannelService } from "../../Services/ChannelService";
import Identicon from "react-identicons";
import "../../Styles/trending-channels-box.css";

interface State {
  channels: Channel[];
  loading: boolean;
}

export default class TrendingChannelsList extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      channels: [],
      loading: true,
    };
  }

  componentWillMount() {
    ChannelService.getAllChannels(6, 0, (channels: Channel[]) => {
      this.setState({
        channels: channels,
        loading: false,
      });
    });
  }
  render() {
    return (
      <Box height="263px">
        <Text
          size="16px"
          weight="bold"
          color="black"
          margin={{ left: "small" }}
        >
          TRENDING CHANNELS
        </Text>
        {this.state.loading && (
          <Box width="100%" height="80%" justify="center" align="center">
            <Loading color="black" size={50} />
          </Box>
        )}
        <Box margin={{ top: "2px" }} overflow="scroll">
          {this.state.channels.map((channel: Channel) => (
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
                  height="40px"
                  width="40px"
                  round="20px"
                  justify="center"
                  align="center"
                  overflow="hidden"
                >
                  {!channel.has_avatar && (
                    <Identicon string={channel.name} size={25} />
                  )}
                  {!!channel.has_avatar && (
                    <img src={`/images/channel-icons/${channel.id}.jpg`} />
                  )}
                </Box>
                <Box justify="between">
                  <Text size="16px" weight="bold" color="black">
                    {channel.name}
                  </Text>
                  <Text size="12px" weight="bold" color="#6B6A6A">
                    Last live 3 days ago
                  </Text>
                </Box>
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    );
  }
}
