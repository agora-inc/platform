import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import Loading from "../Core/Loading";
import { Channel, ChannelService } from "../../Services/ChannelService";
import Identicon from "react-identicons";
import "../../Styles/trending-channels-box.css";
import { FormNextLink } from "grommet-icons";
import AgorasLogo from "../../assets/general/agoras_logo_v2.png";

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
    ChannelService.getTrendingChannels((channels: Channel[]) => {
      this.setState({
        channels: channels,
        loading: false,
      });
    });
  }
  render() {
    return (
      <Box height="240px">
        <Box direction="row" justify="center" style={{minWidth: "50%"}} margin={{bottom: "21px"}}>
          <Text
            size="21px"
            margin={{ left: "small" }}
            alignSelf="center"
            weight="bold"
          >
            Trending <img src={AgorasLogo} height="19px"/>
          </Text>
          {/* <Link to="/agoras" style={{ fontSize: 12, marginLeft: 15 }}>
            <Box
              className="see-more-button"
              pad={{ vertical: "2px", horizontal: "xsmall" }}
              round="xsmall"
              style={{
                border: "2px solid #C2C2C2",
              }}
              direction="row"
              align="end"
            >
              <Text color="grey" size="12px"> See all </Text>
            </Box>
          </Link> */}

        </Box>
        {this.state.loading && (
          <Box width="100%" height="80%" justify="center" align="center">
            <Loading color="color1" size={50} />
          </Box>
        )}
        <Box margin={{ top: "2px" }} overflow="auto">
          {this.state.channels.map((channel: Channel) => (
            <Link
              className="channel"
              to={`/${channel.name}`}
              style={{ textDecoration: "none" }}
            >
              <Box
                direction="row"
                gap="xsmall"
                // align="center"
                pad={{ vertical: "3.5px", horizontal: "small" }}
              >
                <Box
                  background="white"
                  justify="center"
                  align="center"
                  overflow="hidden"
                  style={{
                    minHeight: 30,
                    minWidth: 30,
                    maxHeight: 30,
                    maxWidth: 30,
                    borderRadius: 15,
                  }}
                >
                  {!channel.has_avatar && (
                    <Identicon string={channel.name} size={25} />
                  )}
                  {!!channel.has_avatar && (
                    <img
                      src={ChannelService.getAvatar(channel.id)}
                      height={30}
                      width={30}
                    />
                  )}
                </Box>
                <Box justify="center">
                  <Text size="14px" color="color1" weight="bold">
                    {channel.name}
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
