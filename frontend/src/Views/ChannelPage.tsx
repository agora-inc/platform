import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Box, Text } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import { Video, VideoService } from "../Services/VideoService";
import { Stream, StreamService } from "../Services/StreamService";
import Identicon from "react-identicons";
import Loading from "../Components/Loading";
import ChannelPageScheduledStreamList from "../Components/ChannelPageScheduledStreamList";
import VideoCard from "../Components/VideoCard";
import ChannelLiveNowCard from "../Components/ChannelLiveNowCard";
import "../Styles/channel-page.css";

interface Props {
  location: { pathname: string };
  streamId: number;
}

interface State {
  channel: Channel | null;
  admin: boolean;
  loading: boolean;
  streams: Stream[];
  videos: Video[];
  followerCount: number;
  viewCount: number;
  following: boolean;
  user: User | null;
}

export default class ChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channel: null,
      admin: false,
      loading: true,
      streams: [],
      videos: [],
      followerCount: 0,
      viewCount: 0,
      following: false,
      user: UserService.getCurrentUser(),
    };
  }

  componentWillMount() {
    this.fetchChannel();
  }

  fetchChannel = () => {
    ChannelService.getChannelByName(
      this.props.location.pathname.split("/")[2],
      (channel: Channel) => {
        let user = UserService.getCurrentUser();
        if (user === null) {
          this.setState(
            { channel: channel, admin: false, loading: false },
            () => {
              this.fetchStreams();
              this.fetchVideos();
              this.fetchFollowerCount();
              this.fetchViewCount();
            }
          );
          return;
        }
        ChannelService.isUserInChannel(
          user.id,
          channel.id,
          ["owner", "member"],
          (res: boolean) => {
            this.setState(
              { channel: channel, admin: res, loading: false },
              () => {
                this.fetchStreams();
                this.fetchVideos();
                this.fetchFollowerCount();
                this.fetchViewCount();
                this.checkIfFollowing();
              }
            );
          }
        );
      }
    );
  };

  fetchStreams = () => {
    StreamService.getStreamsForChannel(
      this.state.channel!.id,
      (streams: Stream[]) => {
        this.setState({ streams });
      }
    );
  };

  fetchVideos = () => {
    VideoService.getAllVideosForChannel(
      this.state.channel!.id,
      (videos: Video[]) => {
        this.setState({ videos });
      }
    );
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

  checkIfFollowing = () => {
    ChannelService.isUserInChannel(
      this.state.user!.id,
      this.state.channel!.id,
      ["follower"],
      (following: boolean) => {
        this.setState({ following });
      }
    );
  };

  onFollowClicked = () => {
    if (!this.state.following) {
      ChannelService.addUserToChannel(
        this.state.user!.id,
        this.state.channel!.id,
        "follower",
        () => {
          this.fetchFollowerCount();
        }
      );
    } else {
      ChannelService.removeUserFromChannel(
        this.state.user!.id,
        this.state.channel!.id,
        () => {
          this.fetchFollowerCount();
        }
      );
    }
    this.setState({ following: !this.state.following });
  };

  render() {
    if (this.state.loading) {
      return (
        <Box width="100~%" height="100%" justify="center" align="center">
          <Loading color="black" size={50} />
        </Box>
      );
    } else {
      return (
        <Box>
          {this.state.admin ? (
            <Redirect
              to={{
                pathname: this.props.location.pathname + "/manage",
                state: { channel: this.state.channel },
              }}
            />
          ) : (
            <Box
              width="100%"
              height="100%"
              align="center"
              margin={{ top: "100px" }}
            >
              {this.state.streams.length !== 0 && (
                <ChannelLiveNowCard
                  stream={this.state.streams[0]}
                  colour={this.state.channel!.colour}
                />
              )}
              <Box width="75%" align="start">
                <Box
                  height="225px"
                  width="100%"
                  round="10px"
                  background={this.state.channel?.colour}
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
                      style={{ minWidth: 120, minHeight: 120 }}
                    >
                      <Identicon string={this.state.channel?.name} size={60} />
                    </Box>
                    <Box gap="small">
                      <Text weight="bold" size="30px">
                        {this.state.channel?.name}
                      </Text>
                      <Text size="22px">{this.state.channel?.description}</Text>
                    </Box>
                  </Box>
                  <Box justify="between" align="end">
                    {this.state.user && (
                      <Box
                        className="follow-button"
                        background="white"
                        height="45px"
                        width="100px"
                        pad="small"
                        round="small"
                        style={{ border: "2px solid black" }}
                        align="center"
                        justify="center"
                        onClick={this.onFollowClicked}
                        focusIndicator={false}
                      >
                        <Text weight="bold" color="black">
                          {this.state.following ? "Unfollow" : "Follow"}
                        </Text>
                      </Box>
                    )}
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
                <Text
                  size="28px"
                  weight="bold"
                  color="black"
                  margin={{ bottom: "10px" }}
                >{`${this.state.channel?.name}'s upcoming streams`}</Text>
                <ChannelPageScheduledStreamList
                  channelId={this.state.channel!.id}
                  loggedIn={this.state.user !== null}
                />
                <Text
                  size="28px"
                  weight="bold"
                  color="black"
                  margin={{ top: "40px" }}
                >{`${this.state.channel?.name}'s past streams`}</Text>
                <Box
                  direction="row"
                  width="100%"
                  wrap
                  justify="between"
                  margin={{ top: "10px" }}
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
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      );
    }
  }
}
