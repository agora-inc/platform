import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import Loading from "./Loading";
import { Channel, ChannelService } from "../Services/ChannelService";
import Identicon from "react-identicons";
import "../Styles/trending-channels-box.css";

interface Props {
  gridArea: string;
}

interface State {
  channels: Channel[];
  loading: boolean;
  focusedChannelName: string;
}

export default class TrendingChannelsBox extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channels: [],
      loading: true,
      focusedChannelName: "",
    };
  }

  componentWillMount() {
    ChannelService.getAllChannels(15, 0, (channels: Channel[]) => {
      this.setState({
        channels: channels,
        loading: false,
      });
    });
  }

  onChannelFocused = (focusedChannelName: string) => {
    this.setState({ focusedChannelName });
  };

  render() {
    return (
      <Box
        pad={{ horizontal: "20px", vertical: "20px" }}
        // width="100%"
        // height="100%"
        round="10px"
        className="trending-channels-box"
        gridArea={this.props.gridArea}
      >
        <Text size="32px" weight="bold" color="black">
          {this.state.focusedChannelName
            ? this.state.focusedChannelName
            : "Trending Channels"}
        </Text>
        {this.state.loading && (
          <Box width="100%" height="80%" justify="center" align="center">
            <Loading color="black" size={50} />
          </Box>
        )}
        <Box direction="row" wrap justify="between" margin={{ top: "20px" }}>
          {this.state.channels.map((channel: Channel) => (
            <Link
              to={`/channel/${channel.name}`}
              style={{ textDecoration: "none" }}
            >
              <Box
                onMouseEnter={() => this.onChannelFocused(channel.name)}
                onMouseLeave={() => this.setState({ focusedChannelName: "" })}
                background="white"
                height="64px"
                width="64px"
                round="32px"
                justify="center"
                align="center"
                margin={{ bottom: "20px" }}
              >
                <Identicon string={channel.name} size={36} />
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    );
  }
}
