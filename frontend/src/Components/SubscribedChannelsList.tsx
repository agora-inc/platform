import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import Loading from "./Core/Loading";
import { Channel, ChannelService } from "../Services/ChannelService";
import Identicon from "react-identicons";
import "../Styles/trending-channels-box.css";
import { User } from "../Services/UserService";
import SignUpButton from "./Account/SignUpButton";

interface Props {
  user: User | null;
}

interface State {
  memberChannels: Channel[];
  followerChannels: Channel[];
  loading: boolean;
}

export default class SubscribedChannelsList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      memberChannels: [],
      followerChannels: [],
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
          followerChannels: channels,
          loading: false,
        });
      }
    );
    ChannelService.getChannelsForUser(
      this.props.user.id,
      ["member"],
      (channels: Channel[]) => {
        this.setState({
          memberChannels: channels,
          loading: false,
        });
      }
    );
  }

  render() {
    if (this.props.user) {
      if (this.state.memberChannels.length === 0 && this.state.followerChannels.length === 0) {
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
            <Text size="1.4rem" weight="bold" style={{"font": "italic"}}>
              Agoras you follow or are a member of will appear here
            </Text>
            {/* <Text size="16px" color="grey">
              Use the search bar to find channels that interest you
            </Text> */}
          </Box>
        )
      } else {
        return (
          <Box direction="column" gap="50px" margin={{top: "15px"}}>
            {this.state.memberChannels.length !== 0 && (
              <Box>
                <Text
                  size="14px"
                  weight="bold"
                  color="grey"
                  margin={{ left: "small", top: "xsmall" }}
                >
                  Your Agoras
                </Text>
                {this.state.loading && (
                  <Box width="100%" height="80%" justify="center" align="center">
                    <Loading color="black" size={50} />
                  </Box>
                )}
                <Box margin={{ top: "2px" }}>
                  {this.state.memberChannels.map((channel: Channel) => (
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
                          style = {{ minWidth: "30px", minHeight: "30px" }}
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
            {this.state.followerChannels.length !== 0 && (
              <Box>
                <Text
                  size="14px"
                  weight="bold"
                  color="grey"
                  margin={{ left: "small", top: "xsmall" }}
                >
                  Following
                </Text>
                {this.state.loading && (
                  <Box width="100%" height="80%" justify="center" align="center">
                    <Loading color="black" size={50} />
                  </Box>
                )}
                <Box margin={{ top: "2px" }}>
                  {this.state.followerChannels.map((channel: Channel) => (
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
                          style = {{ minWidth: "30px", minHeight: "30px" }}
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
        )
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
            <Text size="1.2rem" weight="bold" margin={{bottom: "5px"}}>
              Join your{" "}
              {
                <Text size="1.2rem" weight="bold" color="brand">
                  Agora
                </Text>
              }{" "}
              Community
            </Text>
            <Text size="14px" color="grey" weight="bold">
              Access private events, talk recordings and many more!
            </Text>
          </Box>
          <SignUpButton callback={() => {}} />
        </Box>
      )
    }
  }
}
