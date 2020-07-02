import React, { Component, ChangeEvent } from "react";
import { Redirect } from "react-router";
import { Box, Text } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import { Talk, TalkService } from "../Services/TalkService";
import Loading from "../Components/Core/Loading";
import ScheduleTalkButton from "../Components/Talks/ScheduleTalkButton";
import Identicon from "react-identicons";
import ColorPicker from "../Components/Channel/ColorPicker";
import ChannelPageTalkList from "../Components/Channel/ChannelPageTalkList";
import AddUsersButton from "../Components/Channel/AddUsersButton";
import "../Styles/manage-channel.css";
import ReactTooltip from "react-tooltip";
import ChannelPageUserCircle from "../Components/Channel/ChannelPageUserCircle";
import PastTalkCard from "../Components/Talks/PastTalkCard";
import ImageUploader from "../Components/Core/ImageUploader";
import { baseApiUrl } from "../config";
import { CSSProperties } from "styled-components";
import { FormDown, FormUp } from "grommet-icons";

interface Props {
  location: any;
  match: any;
}

interface State {
  channel: Channel | null;
  loading: boolean;
  allowed: boolean;
  followerCount: number;
  colour: string;
  editingDescription: boolean;
  editingLongDescription: boolean;
  channelOwners: User[];
  channelMembers: User[];
  followers: User[];
  talks: Talk[];
  pastStreams: Talk[];
  totalNumberOfTalks: number;
  bannerExtended: boolean;
}

export default class ManageChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channel: null,
      loading: true,
      allowed: false,
      followerCount: 0,
      colour: "pink",
      editingDescription: false,
      editingLongDescription: false,
      channelOwners: [],
      channelMembers: [],
      followers: [],
      talks: [],
      pastStreams: [],
      totalNumberOfTalks: 0,
      bannerExtended: true,
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
    if (
      bottom &&
      this.state.pastStreams.length !== this.state.totalNumberOfTalks
    ) {
      this.fetchPastTalks();
    }
  };

  getChannelAndCheckAccess = () => {
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
    this.fetchOwners();
    this.fetchMembers();
    this.fetchFollowers();
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
      () => {
        window.location.reload();
      }
    );
  };

  getCoverBoxStyle = (): CSSProperties => {
    let background = this.state.channel?.has_cover
      ? `url(${baseApiUrl}/channels/cover?channelId=${this.state.channel.id})`
      : this.state.colour;

    let border = this.state.channel?.has_cover
      ? `8px solid ${this.state.channel.colour}`
      : "none";

    return {
      width: "100%",
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      background: background,
      padding: 20,
      border: border,
    };
  };

  toggleBanner = () => {
    this.setState({ bannerExtended: !this.state.bannerExtended });
  };

  banner = () => {
    return (
      <Box
        width="100%"
        background="white"
        round="10px"
        margin={{ bottom: "30px" }}
      >
        <Box
          direction="row"
          justify="between"
          style={this.getCoverBoxStyle()}
          height="312px"
        >
          <Box width="100%" direction="row" justify="end" height="50px">
            <ColorPicker
              selected={this.state.colour}
              callback={this.updateColour}
              channelId={this.state.channel?.id}
            />
          </Box>
        </Box>
        <Box
          direction="row"
          height="133px"
          align="center"
          justify="between"
          pad="16px"
        >
          <Box direction="row" align="center" gap="small">
            <Box>
              <Box
                width="100px"
                height="100px"
                round="50px"
                background="white"
                justify="center"
                align="center"
                style={{ minWidth: 100, minHeight: 100 }}
                overflow="hidden"
              >
                {!this.state.channel!.has_avatar && (
                  <Identicon string={this.state.channel!.name} size={50} />
                )}
                {!!this.state.channel!.has_avatar && (
                  <img
                    src={ChannelService.getAvatar(this.state.channel!.id)}
                    height={100}
                    width={100}
                  />
                )}
              </Box>
            </Box>
            <Box>
              <Text size="30px" color="black" weight="bold">
                {this.state.channel?.name}
              </Text>
              <Text size="24px" color="#999999" weight="bold">
                {this.state.followerCount} followers
              </Text>
              <ImageUploader
                text="upload avatar"
                onUpload={this.onFileChosen}
              />
            </Box>
          </Box>
          {this.state.bannerExtended ? (
            <FormUp
              onClick={this.toggleBanner}
              size="50px"
              color="black"
              style={{ cursor: "pointer" }}
            />
          ) : (
            <FormDown
              onClick={this.toggleBanner}
              size="50px"
              color="black"
              style={{ cursor: "pointer" }}
            />
          )}
        </Box>
        {this.state.bannerExtended && (
          <Text
            size="20px"
            style={{ textAlign: "justify", fontWeight: 450 }}
            margin={{ horizontal: "16px", bottom: "16px" }}
          >
            {this.state.channel?.long_description}
          </Text>
        )}
      </Box>
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
            margin={{ top: "100px" }}
          >
            <Box width="75%" align="start">
              <ScheduleTalkButton
                margin={{ bottom: "10px" }}
                channel={this.state.channel}
                onCreatedCallback={this.fetchTalks}
              />
              {this.banner()}
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

              {/* <Box
                height="100%"
                width="100%"
                style={{ maxHeight: "100%", minHeight: "50%" }}
              >
                <Text
                  size="28px"
                  weight="bold"
                  color="black"
                  margin={{ top: "40px", bottom: "10px" }}
                >{`About us`}</Text>
                <Box
                  style={{ minHeight: "50%" }}
                  height="50%"
                  width="100%"
                  pad="20px"
                >
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
                            maxHeight: 500,
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
              </Box> */}

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
