import React, { Component } from "react";
import { Redirect } from "react-router";
import { Box, Text } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import Loading from "../Components/Loading";
import Identicon from "react-identicons";
import ColorPicker from "../Components/ColorPicker";

interface Props {
  location: any;
}

interface State {
  channel: Channel | null;
  loading: boolean;
  allowed: boolean;
  followerCount: number;
  viewCount: number;
  color: string;
}

export default class ManageChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channel: null,
      loading: true,
      allowed: false,
      followerCount: 0,
      viewCount: 0,
      color: "pink",
    };
  }

  componentWillMount() {
    this.getChannelAndCheckAccess();
  }

  getChannelAndCheckAccess = () => {
    if (this.props.location.state) {
      this.setState(
        {
          channel: this.props.location.state.channel,
          allowed: true,
          loading: false,
        },
        () => {
          this.fetchFollowerCount();
          this.fetchViewCount();
        }
      );
    } else {
      ChannelService.getChannelByName(
        this.props.location.pathname.split("/")[2],
        (channel: Channel) => {
          let user = UserService.getCurrentUser();
          ChannelService.isUserInChannel(
            user.id,
            channel.id,
            (res: boolean) => {
              this.setState(
                { channel: channel, allowed: res, loading: false },
                () => {
                  this.fetchFollowerCount();
                  this.fetchViewCount();
                }
              );
            }
          );
        }
      );
    }
  };

  fetchFollowerCount = () => {
    ChannelService.getFollowerCountForChannel(
      this.state.channel!.id,
      (followerCount: number) => {
        this.setState({ followerCount });
      }
    );
  };

  fetchViewCount = () => {
    ChannelService.getViewsForChannel(
      this.state.channel!.id,
      (viewCount: number) => {
        this.setState({ viewCount });
      }
    );
  };

  updateColor = (color: string) => {
    this.setState({ color });
  };

  render() {
    if (this.state.loading) {
      return (
        <Box width="100%" height="100%" justify="center" align="center">
          <Loading color="black" size={50} />
        </Box>
      );
    } else {
      return this.state.allowed ? (
        <Box>
          {" "}
          <Box
            width="100%"
            height="100%"
            align="center"
            margin={{ top: "100px" }}
          >
            <Box width="75%" align="start">
              <Box
                height="225px"
                width="100%"
                round="10px"
                background={this.state.color}
                pad="20px"
                margin={{ vertical: "40px" }}
                direction="row"
                justify="between"
              >
                <Box
                  width="50%"
                  height="100%"
                  round="10px"
                  background="#e5e5e5"
                  direction="row"
                  // align="center"
                  // justify="between"
                  gap="small"
                  pad="15px"
                >
                  <Box
                    width="120px"
                    height="120px"
                    round="60px"
                    background="white"
                    justify="center"
                    align="center"
                  >
                    <Identicon string={this.state.channel?.name} size={60} />
                  </Box>
                  <Box gap="small">
                    <Text weight="bold" size="30px">
                      {this.state.channel?.name}
                    </Text>
                    <Text size="22px">
                      We work on really deep minds and stuff
                    </Text>
                  </Box>
                </Box>
                <Box justify="between" align="end">
                  <ColorPicker
                    selected={this.state.color}
                    callback={this.updateColor}
                  />
                  <Box direction="row" gap="medium">
                    <Text
                      weight="bold"
                      size="22px"
                    >{`${this.state.followerCount} followers`}</Text>
                    <Text
                      weight="bold"
                      size="22px"
                    >{`${this.state.viewCount} views`}</Text>
                  </Box>
                </Box>
              </Box>
              {/* <Text
                size="36px"
                weight="bold"
                color="black"
              >{`${this.state.channel?.name}'s upcoming streams`}</Text> */}
              {/* <ScheduledStreamList title={false} seeMore={false} /> */}
              {/* <Text
                size="36px"
                weight="bold"
                color="black"
                margin={{ top: "40px" }}
              >{`${this.state.channel?.name}'s past streams`}</Text> */}
              {/* <Box
                direction="row"
                width="100%"
                wrap
                justify="between"
                margin={{ top: "20px" }}
                // gap="5%"
              >
                {this.state.videos.map((video: Video) => (
                  <VideoCard
                    width="31.5%"
                    height="192px"
                    color="#f2f2f2"
                    video={video}
                    // margin="none"
                  />
                ))}
              </Box> */}
            </Box>
          </Box>
        </Box>
      ) : (
        <Redirect
          to={{
            pathname: "/",
          }}
        />
      );
    }
  }
}
