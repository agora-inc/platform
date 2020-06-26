import React, { Component, ChangeEvent } from "react";
import { Redirect } from "react-router";
import { Box, Text } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Video, VideoService } from "../Services/VideoService";
import { Channel, ChannelService } from "../Services/ChannelService";
import { Talk, TalkService } from "../Services/TalkService";
import Loading from "../Components/Core/Loading";
import StreamNowButton from "../Components/Streaming/StreamNowButton";
import ScheduleTalkButton from "../Components/Talks/ScheduleTalkButton";
import Identicon from "react-identicons";
import ColorPicker from "../Components/Channel/ColorPicker";
import ChannelPageTalkList from "../Components/Channel/ChannelPageTalkList";
import AddUsersButton from "../Components/Channel/AddUsersButton";
import VideoCard from "../Components/Streaming/VideoCard";
import "../Styles/manage-channel.css";
import ReactTooltip from "react-tooltip";
import ChannelPageUserCircle from "../Components/Channel/ChannelPageUserCircle";
import { StreamService } from "../Services/StreamService";
import PastTalkCard from "../Components/Talks/PastTalkCard";

interface Props {
  location: any;
  match: any;
}

interface State {
  channel: Channel | null;
  loading: boolean;
  allowed: boolean;
  followerCount: number;
  // viewCount: number;
  colour: string;
  editingDescription: boolean;
  editingLongDescription: boolean;
  channelOwners: User[];
  channelMembers: User[];
  followers: User[];
  // videos: Video[];
  // totalNumberOfVideos: number;
  talks: Talk[];
  pastStreams: Talk[];
  totalNumberOfTalks: number;
}

export default class ManageChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channel: null,
      loading: true,
      allowed: false,
      followerCount: 0,
      // viewCount: 0,
      colour: "pink",
      editingDescription: false,
      editingLongDescription: false,
      channelOwners: [],
      channelMembers: [],
      followers: [],
      // videos: [],
      // totalNumberOfVideos: 0,
      talks: [],
      pastStreams: [],
      totalNumberOfTalks: 0,
    };
  }

  componentWillMount() {
    window.addEventListener("scroll", this.handleScroll, true);
    // window.addEventListener("beforeunload", this.getChannelAndCheckAccess);
    this.getChannelAndCheckAccess();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    // window.removeEventListener("beforeunload", this.getChannelAndCheckAccess);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.match.params.name !== prevProps.match.params.name) {
      this.getChannelAndCheckAccess();
    }
  }

  handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (
      bottom &&
      this.state.pastStreams.length !== this.state.totalNumberOfTalks
    ) {
      this.fetchPastTalks();
    }
  };

  getChannelAndCheckAccess = () => {
    // if (this.props.location.state) {

    // } else {
    ChannelService.getChannelByName(
      this.props.location.pathname.split("/")[1],
      (channel: Channel) => {
        let user = UserService.getCurrentUser();
        if (user === null) {
          this.setState(
            {
              channel: channel,
              colour: channel.colour,
              loading: false,
              allowed: false,
            },
            () => {
              this.fetchData();
            }
          );
        } else {
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
                  this.fetchData();
                }
              );
            }
          );
        }
      }
    );
  };

  fetchData = () => {
    this.fetchFollowerCount();
    // this.fetchViewCount();
    this.fetchOwners();
    this.fetchMembers();
    this.fetchFollowers();
    // this.fetchVideos();
    this.fetchPastTalks();
    this.fetchTalks();
  };

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

  fetchTalks = () => {
    TalkService.getFutureTalksForChannel(
      this.state.channel!.id,
      (talks: Talk[]) => {
        this.setState({ talks });
      }
    );
  };

  fetchPastTalks = () => {
    TalkService.getPastTalksForChannel(
      this.state.channel!.id,
      (data: { talks: Talk[]; count: number }) => {
        this.setState({
          pastStreams: data.talks,
          totalNumberOfTalks: data.count,
        });
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

  onEditLongDescriptionClicked = () => {
    if (this.state.editingLongDescription) {
      ChannelService.updateLongChannelDescription(
        this.state.channel!.id,
        document.getElementById("long-description")!.textContent as string,
        () => {}
      );
    }
    this.setState({
      editingLongDescription: !this.state.editingLongDescription,
    });
  };

  onFileChosen = (e: any) => {
    console.log(e.target.files[0]);
    ChannelService.uploadAvatar(
      this.state.channel!.id,
      e.target.files[0],
      () => {}
    );
  };

  render() {
    console.log(this.state.channel);
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
                {/* <StreamNowButton margin="none" channel={this.state.channel} /> */}
                <ScheduleTalkButton
                  margin="none"
                  channel={this.state.channel}
                  onCreatedCallback={this.fetchTalks}
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
                    style={{
                      minWidth: 120,
                      minHeight: 120,
                    }}
                    align="center"
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
                          string={this.state.channel?.name}
                          size={60}
                        />
                      )}
                      {!!this.state.channel!.has_avatar && (
                        <img
                          src={`/images/channel-icons/${
                            this.state.channel!.id
                          }.jpg`}
                          height={120}
                          width={120}
                        />
                      )}
                    </Box>
                    <Box
                      style={{ position: "relative" }}
                      margin={{ top: "xsmall" }}
                    >
                      <input
                        type="file"
                        className="input-hidden"
                        onChange={this.onFileChosen}
                      ></input>
                      <Box
                        width="100px"
                        height="25px"
                        background="white"
                        round="xsmall"
                        style={{ border: "solid black 2px", cursor: "pointer" }}
                        align="center"
                        justify="center"
                      >
                        <Text size="13px" weight="bold" color="black">
                          Upload avatar
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                  <Box gap="small">
                    <Text weight="bold" size="30px">
                      {this.state.channel?.name}
                    </Text>
                    <Box style={{ maxHeight: "80%", overflowY: "scroll" }}>
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
                    </Box>
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
                    {/* <Text
                      weight="bold"
                      size="22px"
                    >{`${this.state.viewCount} views`}</Text> */}
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
                      Agora administrators
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
                      <ChannelPageUserCircle user={owner} />
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
                      Agora members
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
                  <Box
                    direction="row"
                    wrap
                    margin={{ top: "5px" }}
                    gap="xsmall"
                  >
                    {this.state.channelMembers.map((member: User) => (
                      <ChannelPageUserCircle user={member} />
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
                  <Box
                    direction="row"
                    wrap
                    margin={{ top: "5px" }}
                    gap="xsmall"
                  >
                    {this.state.followers.map((follower: User) => (
                      <ChannelPageUserCircle user={follower} />
                    ))}
                  </Box>
                </Box>
              </Box>

              <Box gap="small">
                <Text
                  size="28px"
                  weight="bold"
                  color="black"
                  margin={{ top: "40px", bottom: "10px" }}
                >{`About us`}</Text>
                <Box style={{ maxHeight: "100%", overflowY: "scroll" }}>
                  <Text
                    id="long-description"
                    className="channel-description"
                    size="22px"
                    margin="10px"
                    color="black"
                    contentEditable={this.state.editingLongDescription}
                    style={
                      this.state.editingLongDescription
                        ? {
                            border: `2px solid ${this.state.colour}`,
                            borderRadius: 7,
                            padding: 5,
                            overflow: "scroll",
                            height: 900,
                            maxHeight: 50,
                          }
                        : {}
                    }
                  >
                    {this.state.channel?.long_description}
                  </Text>
                </Box>
                <Box
                  focusIndicator={false}
                  margin={{ top: "-10px" }}
                  pad="none"
                  onClick={this.onEditLongDescriptionClicked}
                >
                  <Text style={{ textDecoration: "underline" }} size="16px">
                    {this.state.editingLongDescription ? "save" : "edit"}
                  </Text>
                </Box>
              </Box>

              {this.state.talks.length !== 0 && (
                <Text
                  size="28px"
                  weight="bold"
                  color="black"
                  margin={{ top: "40px", bottom: "10px" }}
                >{`Your upcoming talks`}</Text>
              )}
              <ChannelPageTalkList
                talks={this.state.talks}
                channelId={this.state.channel!.id}
                user={null}
                admin
                onEditCallback={this.fetchTalks}
              />
              {this.state.pastStreams.length !== 0 && (
                <Text
                  size="28px"
                  weight="bold"
                  color="black"
                  margin={{ top: "40px" }}
                >{`Your past talks`}</Text>
              )}
              <Box
                direction="row"
                width="100%"
                wrap
                // justify="between"
                gap="1.5%"
                margin={{ top: "10px" }}
              >
                {this.state.pastStreams.map((talk: Talk) => (
                  <PastTalkCard
                    width="31.5%"
                    talk={talk}
                    admin
                    margin={{ bottom: "medium" }}
                    onDelete={() => this.fetchPastTalks()}
                    user={null}
                  />
                ))}
              </Box>
            </Box>
          </Box>
          <ReactTooltip />
        </Box>
      ) : (
        <Redirect
          to={{
            pathname: `/${this.state.channel!.name}`,
          }}
        />
      );
    }
  }
}
