import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import Loading from "./Loading";
import { Channel, ChannelService } from "../Services/ChannelService";
import Identicon from "react-identicons";
import "../Styles/trending-channels-box.css";
import { User } from "../Services/UserService";

interface Props {
  user: User | null;
}

interface State {
  channels: Channel[];
  loading: boolean;
}

export default class SubscribedChannelsList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channels: [],
      loading: true,
    };
  }

  componentWillMount() {
    if (!this.props.user) {
      return;
    }
    ChannelService.getChannelsForUser(
      this.props.user.id,
      ["follower"],
      (channels: Channel[]) => {
        this.setState({
          channels: channels,
          loading: false,
        });
      }
    );
  }

  render() {
    return (
      <Box>
        <Text
          size="16px"
          weight="bold"
          color="black"
          margin={{ left: "small" }}
        >
          FOLLOWING
        </Text>
        {this.state.loading && (
          <Box width="100%" height="80%" justify="center" align="center">
            <Loading color="black" size={50} />
          </Box>
        )}
        <Box margin={{ top: "2px" }}>
          {this.state.channels.map((channel: Channel) => (
            <Link
              className="channel"
              to={`/channel/${channel.name}`}
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
                  // margin={{ bottom: "20px" }}
                >
                  <Identicon string={channel.name} size={25} />
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
