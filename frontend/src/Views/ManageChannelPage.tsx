import React, { Component } from "react";
import { Redirect } from "react-router";
import { Box, Text } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import { Talk, TalkService } from "../Services/TalkService";
import { Link } from "react-router-dom";
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
import EnrichedTextEditor from "../Components/Channel/EnrichedTextEditor";
import { StatusInfo } from "grommet-icons";

interface Props {
  location: any;
  match: any;
}

interface State {
  channel: Channel | null;
  loading: boolean;
  role: "none" | "owner" | "member" | "follower";
  followerCount: number;
  colour: string;
  editingDescription: boolean;
  editingLongDescription: boolean;
  channelOwners: User[];
  channelMembers: User[];
  followers: User[];
  talks: Talk[];
  drafts: Talk[];
  pastStreams: Talk[];
  totalNumberOfTalks: number;
  bannerExtended: boolean;
  longDescription: string;
  showDraftInfo: boolean;
}

export default class ManageChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channel: null,
      loading: true,
      role: "none",
      followerCount: 0,
      colour: "pink",
      editingDescription: false,
      editingLongDescription: false,
      channelOwners: [],
      channelMembers: [],
      followers: [],
      talks: [],
      drafts: [],
      pastStreams: [],
      totalNumberOfTalks: 0,
      bannerExtended: true,
      longDescription: "",
      showDraftInfo: false,
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

  isAllowed = (): boolean => {
    return this.state.role === "owner";
  };

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
            },
            () => {
              this.fetchData();
            }
          );
        } else {
          ChannelService.getRoleInChannel(
            user.id,
            channel.id,
            (role: "none" | "owner" | "member" | "follower") => {
              this.setState(
                {
                  channel: channel,
                  colour: channel.colour,
                  role: role,
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
    this.fetchDrafts();
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

  fetchDrafts = () => {
    TalkService.getDraftedTalksForChannel(
      this.state.channel!.id,
      (drafts: Talk[]) => {
        this.setState({ drafts });
      }
    );
  };

  fetchTalksDrafts = () => {
    this.fetchDrafts()
    this.fetchTalks()
  }

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
      () => { }
    );
  };

  onEditDescriptionClicked = () => {
    if (this.state.editingDescription) {
      ChannelService.updateChannelDescription(
        this.state.channel!.id,
        document.getElementById("description")!.textContent as string,
        () => { }
      );
    }
    this.setState({ editingDescription: !this.state.editingDescription });
  };

  onSaveLongDescriptionClicked = (newDescription: string) => {
    ChannelService.updateLongChannelDescription(
      this.state.channel!.id,
      newDescription,
      () => { }
    );
    this.setState({
      editingLongDescription: !this.state.editingLongDescription,
    });
  };

  onModifyLongDescription = (value: any) => {
    this.setState({ longDescription: value });
  };

  onFileChosen = (e: any) => {
    // console.log(e.target.files[0]);
    ChannelService.uploadAvatar(
      this.state.channel!.id,
      e.target.files[0],
      () => {
        window.location.reload();
      }
    );
  };

  getCoverBoxStyle = (): CSSProperties => {
    let current_time = Math.floor(new Date().getTime() / 200000);
    let background = this.state.channel ?.has_cover
      ? `url(${baseApiUrl}/channels/cover?channelId=${this.state.channel.id}&ts=` +
      current_time +
      `)`
      // HACK: we add the new time at the end of the URL to avoid caching; 
      // we divide time by value such that all block of requested image have 
      // the same name (important for the name to be the same for the styling).
      : this.state.colour;

    let border = this.state.channel ?.has_cover
      ? `8px solid ${this.state.channel.colour}`
      : "none";

    let color = this.state.channel ?.has_cover
      ? `${this.state.channel.colour}`
      : "none";

    if (color == "white") {
      return {
        width: "75vw",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        background: background,
        backgroundSize: "75vw 25vw",
        padding: 20,
      };
    }
    else {
      return {
        width: "75vw",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        background: background,
        backgroundSize: "75vw 25vw",
        padding: 20,
        border: border,
      };
    }
  };

  toggleBanner = () => {
    this.setState({ bannerExtended: !this.state.bannerExtended });
  };

  banner = () => {
    return (
      <Box
        width="75vw"
        background="white"
        round="10px"
        margin={{ bottom: "30px" }}
      >
        <Box
          direction="row"
          justify="between"
          style={this.getCoverBoxStyle()}
          height="25vw"
        >
          <Box width="100%" direction="row" justify="end" height="50px">
            <ColorPicker
              selected={this.state.colour}
              callback={this.updateColour}
              channelId={this.state.channel ?.id}
              hasCover={
                this.state.channel ? this.state.channel.has_cover : false
              }
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
                    src={
                      ChannelService.getAvatar(this.state.channel!.id) +
                      `&ts=` +
                      new Date().getTime()
                    }
                    // HACK: we had the ts argument to prevent from caching.
                    height={100}
                    width={100}
                  />
                )}
              </Box>
            </Box>
            <Box>
              <Text size="30px" color="black" weight="bold">
                {this.state.channel ?.name}
              </Text>
              <Text size="24px" color="#999999" weight="bold">
                {this.state.followerCount} followers
              </Text>
              <ImageUploader
                text="Upload avatar"
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
          <>
            <EnrichedTextEditor
              text={
                this.state.channel ?.long_description
                  ? this.state.channel ?.long_description
                    : ""
              }
              onModify={this.onModifyLongDescription}
              onSave={this.onSaveLongDescriptionClicked}
            />
          </>
        )}
      </Box>
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <Box width="100%" height="100%" justify="center" align="center">
          <Loading color="black" size={50} />
        </Box>
      );
    } else {
      return this.isAllowed() ? (
        <Box>
          <Box
            width="100%"
            height="100%"
            align="center"
            margin={{ top: "100px" }}
          >
            <Box width="75%" align="start">
              {this.state.role === "owner" && (
                <ScheduleTalkButton
                  margin={{ bottom: "10px" }}
                  channel={this.state.channel}
                  onCreatedCallback={this.fetchTalksDrafts}
                />
              )}

              <Box
                width="100%"
                height="100%"
                pad="10px"
                background="white"
                round="xsmall"
                justify="center"
                style={{
                  border: "1px solid #C2C2C2",
                }}
              >
                <Text color="#5A5A5A">
                  <p><big><b> Agora administrator page </b></big></p>
                  <p>As an administrator, you can:</p>
                  <ul>
                    <li><b>Create and edit events</b></li>
                    <li><b>Customize header</b> <i>(recommended dim: 1500x500px)</i></li>
                    <li><b>Customize avatar </b><i>(recommended dim: 400x400px)</i></li>
                    <li><b>Edit Agora description</b> </li>
                    <li><b>Promote users</b> to administrator/member.</li>
                    <li><b>Link recordings</b> to your previous Agora events.</li>

                  </ul>
                  <p>For more general information, visit our
                    <Link to={"/info/getting-started"}>
                      <Text weight="bold" color="brand">
                        {" "}getting-started{" "}
                      </Text>
                    </Link>
                    page.
                  </p>
                  <i><b>NB:</b> This help box and customisation options are only visible to admins.</i>
                </Text>
              </Box>

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
                    {this.state.role === "owner" && (
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
                    )}
                  </Box>
                  <Box
                    direction="row"
                    wrap
                    margin={{ top: "5px" }}
                    gap="xsmall"
                  >
                    {this.state.channelOwners.map((owner: User) => (
                      <ChannelPageUserCircle
                        user={owner}
                        channelId={this.state.channel ?.id}
                        onRemovedCallback={this.fetchOwners}
                        showRemoveButton={this.state.role === "owner"}
                      />
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
                    {this.state.role === "owner" && (
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
                    )}
                  </Box>
                  <Box
                    direction="row"
                    wrap
                    margin={{ top: "5px" }}
                    gap="xsmall"
                  >
                    {this.state.channelMembers.map((member: User) => (
                      <ChannelPageUserCircle
                        user={member}
                        channelId={this.state.channel ?.id}
                        onRemovedCallback={this.fetchMembers}
                        showRemoveButton={this.state.role === "owner"}
                      />
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
                  <Text weight="bold" size="20px" color="black">
                    Followers
                  </Text>
                  <Box
                    direction="row"
                    wrap
                    margin={{ top: "5px" }}
                    gap="xsmall"
                  >
                    {this.state.followers.map((follower: User) => (
                      <ChannelPageUserCircle
                        user={follower}
                        showRemoveButton={false}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
              <Box
                direction="row"
                gap="small"
                margin={{ top: "40px", bottom: "24px" }}
              >
                <Text
                  size="28px"
                  weight="bold"
                  color="black"

                >
                  {`Drafts`}
                </Text>
                <StatusInfo
                  onMouseEnter={() => { this.setState({ showDraftInfo: true }) }}
                  onMouseLeave={() => { this.setState({ showDraftInfo: false }) }}
                />
                {this.state.showDraftInfo && (
                  <Box
                    background="black"
                    round="xsmall"
                    pad="small"
                    //height="30px"
                    width="210px"
                    margin={{ top: "-6px" }}
                  >
                    <Text size="12px">
                      These talks are only visible to you.
                    </Text>
                  </Box>
                )}
              </Box>
              {this.state.drafts.length === 0 && (
                <Box
                  direction="row"
                  width="100%"
                  pad="small"
                  justify="between"
                  round="xsmall"
                  align="center"
                  alignSelf="center"
                  background="#F3EACE"
                  margin={{ bottom: "36px" }}
                >
                  <Text size="18px" weight="bold" color="grey">
                    No draft saved in{" "}
                    {this.state.channel
                      ? this.state.channel.name
                      : "this channel"}
                  </Text>
                </Box>
              )}
              <ChannelPageTalkList
                talks={this.state.drafts}
                channelId={this.state.channel!.id}
                user={null}
                admin
                onEditCallback={this.fetchTalksDrafts}
              />
              <Text
                size="28px"
                weight="bold"
                color="black"
                margin={{ top: "40px", bottom: "24px" }}
              >
                {`Upcoming talks`}
              </Text>
              {this.state.talks.length === 0 && (
                <Box
                  direction="row"
                  width="100%"
                  pad="small"
                  justify="between"
                  round="xsmall"
                  align="center"
                  alignSelf="center"
                  background="#F3EACE"
                  margin={{ bottom: "36px" }}
                >
                  <Text size="18px" weight="bold" color="grey">
                    There are no upcoming talks in{" "}
                    {this.state.channel
                      ? this.state.channel.name
                      : "this channel"}
                  </Text>
                </Box>
              )}
              <ChannelPageTalkList
                talks={this.state.talks}
                channelId={this.state.channel!.id}
                user={null}
                admin
                onEditCallback={this.fetchTalksDrafts}
              />
              {this.state.pastStreams.length !== 0 && (
                <Text
                  size="28px"
                  weight="bold"
                  color="black"
                  margin={{ top: "40px" }}
                >{`Past talks`}</Text>
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
                    onEditCallback={this.fetchTalks}
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