import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Box, Text } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import { Video, VideoService } from "../Services/VideoService";
import { Stream, StreamService } from "../Services/StreamService";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../Services/ScheduledStreamService";
import Identicon from "react-identicons";
import Loading from "../Components/Core/Loading";
import ChannelPageScheduledStreamList from "../Components/Channel/ChannelPageScheduledStreamList";
import VideoCard from "../Components/Streaming/VideoCard";
import ChannelLiveNowCard from "../Components/Channel/ChannelLiveNowCard";
import "../Styles/channel-page.css";
import PastScheduledStreamCard from "../Components/ScheduledStreams/PastScheduledStreamCard";

interface Props {
  location: { pathname: string };
  streamId: number;
}

interface State {
  channel: Channel | null;
  admin: boolean;
  loading: boolean;
  streams: Stream[];
  // videos: Video[];
  // totalNumberOfVideos: number;
  scheduledStreams: ScheduledStream[];
  pastStreams: ScheduledStream[];
  totalNumberOfPastStreams: number;
  followerCount: number;
  // viewCount: number;
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
      // videos: [],
      // totalNumberOfVideos: 0,
      scheduledStreams: [],
      pastStreams: [],
      totalNumberOfPastStreams: 0,
      followerCount: 0,
      // viewCount: 0,
      following: false,
      user: UserService.getCurrentUser(),
    };
  }

  componentWillMount() {
    window.addEventListener("scroll", this.handleScroll, true);
    this.fetchChannel();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (
      bottom &&
      this.state.pastStreams.length !== this.state.totalNumberOfPastStreams
    ) {
      this.fetchPastStreams();
    }
  };

  fetchChannel = () => {
    console.log(this.props.location.pathname.split("/"));
    ChannelService.getChannelByName(
      this.props.location.pathname.split("/")[1],
      (channel: Channel) => {
        let user = UserService.getCurrentUser();
        if (user === null) {
          this.setState(
            { channel: channel, admin: false, loading: false },
            () => {
              this.fetchStreams();
              this.fetchPastStreams();
              // this.fetchVideos();
              this.fetchScheduledStreams();
              this.fetchFollowerCount();
              // this.fetchViewCount();
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
                this.fetchPastStreams();
                // this.fetchVideos();
                this.fetchScheduledStreams();
                this.fetchFollowerCount();
                // this.fetchViewCount();
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

  // fetchVideos = () => {
  //   VideoService.getAllVideosForChannel(
  //     this.state.channel!.id,
  //     6,
  //     this.state.videos.length,
  //     (data: { count: number; videos: Video[] }) => {
  //       this.setState({
  //         videos: this.state.videos.concat(data.videos),
  //         totalNumberOfVideos: data.count,
  //       });
  //     }
  //   );
  // };

  fetchFollowerCount = () => {
    ChannelService.getFollowerCountForChannel(
      this.state.channel!.id,
      (followerCount: number) => {
        this.setState({ followerCount });
      }
    );
  };

  // fetchViewCount = () => {
  //   ChannelService.getViewsForChannel(
  //     this.state.channel!.id,
  //     (viewCount: number) => {
  //       this.setState({ viewCount });
  //     }
  //   );
  // };

  fetchScheduledStreams = () => {
    ScheduledStreamService.getFutureScheduledStreamsForChannel(
      this.state.channel!.id,
      (scheduledStreams: ScheduledStream[]) => {
        this.setState({ scheduledStreams });
      }
    );
  };

  fetchPastStreams = () => {
    ScheduledStreamService.getPastScheduledStreamsForChannel(
      this.state.channel!.id,
      (data: { streams: ScheduledStream[]; count: number }) => {
        this.setState({
          pastStreams: data.streams,
          totalNumberOfPastStreams: data.count,
        });
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
                      overflow="hidden"
                    >
                      {!this.state.channel!.has_avatar && (
                        <Identicon
                          string={this.state.channel!.name}
                          size={60}
                        />
                      )}
                      {!!this.state.channel!.has_avatar && (
                        <img
                          src={`/images/channel-icons/${
                            this.state.channel!.id
                          }.jpg`}
                        />
                      )}
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
                      {/* <Text
                        weight="bold"
                        size="22px"
                      >{`${this.state.viewCount} views`}</Text> */}
                    </Box>
                  </Box>
                </Box>
                <Text
                  size="28px"
                  weight="bold"
                  color="black"
                  margin={{ bottom: "10px" }}
                >{`${this.state.channel?.name}'s upcoming talks`}</Text>
                <ChannelPageScheduledStreamList
                  scheduledStreams={this.state.scheduledStreams}
                  channelId={this.state.channel!.id}
                  user={this.state.user}
                  admin={false}
                />
                <Text
                  size="28px"
                  weight="bold"
                  color="black"
                  margin={{ top: "40px" }}
                >{`${this.state.channel?.name}'s past talks`}</Text>
                <Box
                  direction="row"
                  width="100%"
                  wrap
                  justify="between"
                  margin={{ top: "10px" }}
                  // gap="5%"
                >
                  {this.state.pastStreams.map((stream: ScheduledStream) => (
                    <PastScheduledStreamCard
                      width="31.5%"
                      // height="192px"
                      // color="#f2f2f2"
                      stream={stream}
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
