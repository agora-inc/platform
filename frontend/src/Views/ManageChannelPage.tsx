import React, { Component } from "react";
import { Redirect } from "react-router";
import { Box, Text } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Video, VideoService } from "../Services/VideoService";
import { Channel, ChannelService } from "../Services/ChannelService";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../Services/ScheduledStreamService";
import Loading from "../Components/Loading";
import StreamNowButton from "../Components/StreamNowButton";
import ScheduleStreamButton from "../Components/ScheduleStreamButton";
import Identicon from "react-identicons";
import ColorPicker from "../Components/ColorPicker";
import ChannelPageScheduledStreamList from "../Components/ChannelPageScheduledStreamList";
import AddUsersButton from "../Components/AddUsersButton";
import VideoCard from "../Components/VideoCard";
import "../Styles/manage-channel.css";

interface Props {
  location: any;
  match: any;
}

interface State {
  channel: Channel | null;
  loading: boolean;
  allowed: boolean;
  followerCount: number;
  viewCount: number;
  colour: string;
  editingDescription: boolean;
  channelOwners: User[];
  channelMembers: User[];
  followers: User[];
  videos: Video[];
  totalNumberOfVideos: number;
  scheduledStreams: ScheduledStream[];
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
      colour: "pink",
      editingDescription: false,
      channelOwners: [],
      channelMembers: [],
      followers: [],
      videos: [],
      totalNumberOfVideos: 0,
      scheduledStreams: [],
    };
  }

  componentWillMount() {
    window.addEventListener("scroll", this.handleScroll, true);
    this.getChannelAndCheckAccess();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.match.params.name !== prevProps.match.params.name) {
      this.getChannelAndCheckAccess();
    }
  }

  handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && this.state.videos.length !== this.state.totalNumberOfVideos) {
      this.fetchVideos();
    }
  };

  getChannelAndCheckAccess = () => {
    if (this.props.location.state) {
      this.setState(
        {
          channel: this.props.location.state.channel,
          colour: this.props.location.state.channel.colour,
          allowed: true,
          loading: false,
        },
        () => {
          this.fetchFollowerCount();
          this.fetchViewCount();
          this.fetchOwners();
          this.fetchMembers();
          this.fetchFollowers();
          this.fetchVideos();
          this.fetchScheduledStreams();
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
            ["owner", "member"],
            (res: boolean) => {
              this.setState(
                {
                  channel: channel,
                  colour: channel.colour,
                  allowed: res,
                  loading: false,
                },
                () => {
                  this.fetchFollowerCount();
                  this.fetchViewCount();
                  this.fetchOwners();
                  this.fetchMembers();
                  this.fetchFollowers();
                  this.fetchVideos();
                  this.fetchScheduledStreams();
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

  fetchOwners = () => {
    ChannelService.getUsersForChannel(
      this.state.channel!.id,
      ["owner"],
      (owners: User[]) => {
        this.setState({ channelOwners: owners });
      }
    );
  };

  fetchMembers = () => {
    ChannelService.getUsersForChannel(
      this.state.channel!.id,
      ["member"],
      (members: User[]) => {
        this.setState({ channelMembers: members });
      }
    );
  };

  fetchFollowers = () => {
    ChannelService.getUsersForChannel(
      this.state.channel!.id,
      ["follower"],
      (followers: User[]) => {
        this.setState({ followers });
      }
    );
  };

  fetchVideos = () => {
    VideoService.getAllVideosForChannel(
      this.state.channel!.id,
      6,
      this.state.videos.length,
      (data: { count: number; videos: Video[] }) => {
        this.setState({
          videos: this.state.videos.concat(data.videos),
          totalNumberOfVideos: data.count,
        });
      }
    );
  };

  fetchScheduledStreams = () => {
    ScheduledStreamService.getScheduledStreamsForChannel(
      this.state.channel!.id,
      (scheduledStreams: ScheduledStream[]) => {
        this.setState({ scheduledStreams });
      }
    );
  };

  updateColour = (colour: string) => {
    this.setState({ colour });
    ChannelService.updateChannelColour(
      this.state.channel!.id,
      colour,
      () => {}
    );
  };

  onEditDescriptionClicked = () => {
    if (this.state.editingDescription) {
      ChannelService.updateChannelDescription(
        this.state.channel!.id,
        document.getElementById("description")!.textContent as string,
        () => {}
      );
    }
    this.setState({ editingDescription: !this.state.editingDescription });
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
          <Box
            width="100%"
            height="100%"
            align="center"
            margin={{ top: "140px" }}
          >
            <Box width="75%" align="start">
              <Box direction="row" gap="small">
                <StreamNowButton margin="none" channel={this.state.channel} />
                <ScheduleStreamButton
                  margin="none"
                  channel={this.state.channel}
                />
              </Box>
              <Box
                height="225px"
                width="100%"
                round="10px"
                background={this.state.colour}
                pad="20px"
                margin={{ top: "10px", bottom: "30px" }}
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
                    <Text
                      id="description"
                      className="channel-description"
                      size="22px"
                      margin="none"
                      contentEditable={this.state.editingDescription}
                      style={
                        this.state.editingDescription
                          ? {
                              border: `2px solid ${this.state.colour}`,
                              borderRadius: 7,
                              padding: 5,
                              overflow: "scroll",
                              height: 90,
                              maxHeight: 90,
                            }
                          : {}
                      }
                    >
                      {this.state.channel?.description}
                    </Text>
                    <Box
                      focusIndicator={false}
                      margin={{ top: "-10px" }}
                      pad="none"
                      onClick={this.onEditDescriptionClicked}
                    >
                      <Text style={{ textDecoration: "underline" }} size="16px">
                        {this.state.editingDescription ? "save" : "edit"}
                      </Text>
                    </Box>
                  </Box>
                </Box>
                <Box justify="between" align="end">
                  <ColorPicker
                    selected={this.state.colour}
                    callback={this.updateColour}
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
              <Box direction="row" width="100%" justify="between">
                <Box
                  width="31.5%"
                  height="300px"
                  background="#e5e5e5"
                  round="7.5px"
                  pad="10px"
                >
                  <Box direction="row" justify="between">
                    <Text weight="bold" size="20px" color="black">
                      Channel owners
                    </Text>
                    <AddUsersButton
                      role="owner"
                      existingUsers={this.state.channelOwners}
                      channelId={this.state.channel!.id}
                      onUserAddedCallback={() => {
                        this.fetchMembers();
                        this.fetchOwners();
                        this.fetchFollowers();
                      }}
                    />
                  </Box>
                  <Box
                    direction="row"
                    wrap
                    margin={{ top: "5px" }}
                    gap="xsmall"
                  >
                    {this.state.channelOwners.map((owner: User) => (
                      <Box
                        background="white"
                        height="50px"
                        width="50px"
                        round="25px"
                        justify="center"
                        align="center"
                      >
                        <Identicon string={owner.username} size={30} />
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box
                  width="31.5%"
                  height="300px"
                  background="#e5e5e5"
                  round="7.5px"
                  pad="10px"
                >
                  <Box direction="row" justify="between">
                    <Text weight="bold" size="20px" color="black">
                      Channel members
                    </Text>
                    <AddUsersButton
                      role="member"
                      existingUsers={this.state.channelMembers}
                      channelId={this.state.channel!.id}
                      onUserAddedCallback={() => {
                        this.fetchMembers();
                        this.fetchOwners();
                        this.fetchFollowers();
                      }}
                    />
                  </Box>
                  <Box direction="row" wrap margin={{ top: "5px" }}>
                    {this.state.channelMembers.map((member: User) => (
                      <Box
                        background="white"
                        height="50px"
                        width="50px"
                        round="25px"
                        justify="center"
                        align="center"
                      >
                        <Identicon string={member.username} size={30} />
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box
                  width="31.5%"
                  height="300px"
                  background="#e5e5e5"
                  round="7.5px"
                  pad="10px"
                >
                  <Text
                    weight="bold"
                    size="20px"
                    color="black"
                    style={{ height: "34px" }}
                  >
                    Followers
                  </Text>
                  <Box direction="row" wrap margin={{ top: "5px" }}>
                    {this.state.followers.map((follower: User) => (
                      <Box
                        background="white"
                        height="50px"
                        width="50px"
                        round="25px"
                        justify="center"
                        align="center"
                      >
                        <Identicon string={follower.username} size={30} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
              <Text
                size="28px"
                weight="bold"
                color="black"
                margin={{ top: "40px", bottom: "10px" }}
              >{`Your upcoming streams`}</Text>
              <ChannelPageScheduledStreamList
                scheduledStreams={this.state.scheduledStreams}
                channelId={this.state.channel!.id}
                loggedIn
                admin
              />
              <Text
                size="28px"
                weight="bold"
                color="black"
                margin={{ top: "40px" }}
              >{`Your past streams`}</Text>
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
