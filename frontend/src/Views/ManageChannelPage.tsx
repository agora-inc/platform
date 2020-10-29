import React, { Component } from "react";
import { Redirect } from "react-router";
import { Box, Text, TextArea} from "grommet";
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
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ChannelPageUserCircle from "../Components/Channel/ChannelPageUserCircle";
import ChannelPageTalkCard from "../Components/Channel/ChannelPageTalkCard";
import PastTalkCard from "../Components/Talks/PastTalkCard";
import ImageUploader from "../Components/Core/ImageUploader";
import { baseApiUrl } from "../config";
import { CSSProperties } from "styled-components";
import { FormDown, FormUp, UserAdmin, Workshop, StatusInfo, ContactInfo, Group, MailOption } from "grommet-icons";
import EnrichedTextEditor from "../Components/Channel/EnrichedTextEditor";
import EmailContactManagement from "../Components/Channel/EmailContactManagement";
import DeleteAgoraButton from "../Components/Channel/DeleteAgoraButton";
import RequestsTab from "./ManageChannelPage/RequestsTab";
import "../Styles/react-tabs.css";

interface Props {
  location: any;
  match: any;
}

interface State {
  channel: Channel | null;
  loading: boolean;
  user: User | null;
  role: "none" | "owner" | "member" | "follower";
  followerCount: number;
  colour: string;
  editingDescription: boolean;
  editingLongDescription: boolean;
  channelOwners: User[];
  channelMembers: User[];
  followers: User[];
  mailingList: string;
  listInvitedMembers: string[];
  listEmailCorrect: string[];
  strEmailWrong: string;
  talks: Talk[];
  drafts: Talk[];
  currentTalks: Talk[];
  pastStreams: Talk[];
  totalNumberOfTalks: number;
  bannerExtended: boolean;
  longDescription: string;
  contactAddresses: string;
  showDraftInfo: boolean;
  showMemberEmailInfo: boolean;
}

export default class ManageChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channel: null,
      loading: true,
      user: null,
      role: "none",
      followerCount: 0,
      colour: "pink",
      editingDescription: false,
      editingLongDescription: false,
      channelOwners: [],
      channelMembers: [],
      followers: [],
      mailingList: "",
      listInvitedMembers: [],
      listEmailCorrect: [],
      strEmailWrong: "",
      talks: [],
      drafts: [],
      currentTalks: [],
      pastStreams: [],
      totalNumberOfTalks: 0,
      bannerExtended: true,
      longDescription: "",
      contactAddresses: "",
      showDraftInfo: false,
      showMemberEmailInfo: false,
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
                  user: user,
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
    this.fetchInvitedMembers();
    this.fetchPastTalks();
    this.fetchCurrentTalks();
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

  fetchInvitedMembers = () => {
    ChannelService.getInvitedMembersForChannel(
      this.state.channel!.id,
      (listInvitedMembers: string[]) => {
        this.setState({ listInvitedMembers });
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
    this.fetchDrafts();
    this.fetchTalks();
  };

  fetchAllTalks = () => {
    this.fetchDrafts()
    this.fetchTalks()
    this.fetchCurrentTalks()
    this.fetchPastTalks()
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

  fetchCurrentTalks = () => {
    TalkService.getCurrentTalksForChannel(
      this.state.channel!.id,
      (talks: Talk[]) => {
        this.setState({
          currentTalks: talks
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

  handleMailingList = (e: any) => {
    let value = e.target.value;
    this.setState({"mailingList": value});
  };

  parseMailingList = () => {
    let listEmailCorrect = [];

    // get all emails constructed using non-alphanumerical characters except "@", ".", "_", and "-"
    let regExtraction = this.state.mailingList.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
    if (regExtraction === null){
      regExtraction = []
    }

    // filtering new admissibles emails from badly formatted ones
    let strEmailWrong = this.state.mailingList;
    for (var email of regExtraction){
      if (!(this.state.listInvitedMembers.includes(email))){
      listEmailCorrect.push(email.toLowerCase())};
      strEmailWrong = strEmailWrong.replace(email, "");
    }
    
    // clean box if empty
    strEmailWrong = strEmailWrong.replace(/[/\n\;\,]/g, " ")
    if (strEmailWrong.replace(/[\s]/g, "") === ""){
      strEmailWrong = "";
    }

    // send invitations for admissible emails
    ChannelService.addInvitedMembersToChannel(
      this.state.channel!.id,
      listEmailCorrect,
      () => {},
    );
    this.setState({ listEmailCorrect });
    this.setState({ listInvitedMembers : this.state.listInvitedMembers.concat(listEmailCorrect) });
    this.setState({ strEmailWrong });
    this.setState({ mailingList: strEmailWrong})
    this.fetchMembers();
    this.fetchOwners();
  };

  onSaveLongDescriptionClicked = (newDescription: string) => {
    ChannelService.updateLongChannelDescription(
      this.state.channel!.id,
      newDescription,

      () => {}
    );
    this.setState({
      editingLongDescription: !this.state.editingLongDescription,
    });
  };

  onModifyLongDescription = (value: any) => {
    this.setState({ longDescription: value });
  };

  onAddContactAddress = (newAddress: any) => {
    let user = UserService.getCurrentUser();
    ChannelService.addContactAddress(
      this.state.channel!.id,
      newAddress,
      user.id,
      () => {}
    );
  };

  onDeleteContactAddress = (oldAddress: any) => {
    let user = UserService.getCurrentUser();
    ChannelService.removeContactAddress(
      this.state.channel!.id,
      oldAddress,
      user.id,
      () => {}
    );
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
    let current_time = Math.floor(new Date().getTime() / 5000);
    let background = this.state.channel?.id
      ? `url(${baseApiUrl}/channels/cover?channelId=${this.state.channel.id}&ts=` +
        current_time +
        `)`
      : // HACK: we add the new time at the end of the URL to avoid caching;
        // we divide time by value such that all block of requested image have
        // the same name (important for the name to be the same for the styling).
        this.state.channel?.colour;

    let border = "none";

    return {
      width: "75vw",
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      background: background,
      backgroundSize: "75vw 25vw",
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
        width="75vw"
        background="white"
        round="10px"
        margin={{ bottom: "60px" }}
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
              channelId={this.state.channel?.id}
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
                {
                  <img
                    src={
                      ChannelService.getAvatar(this.state.channel!.id, 1)
                    }
                    height={100}
                    width={100}
                  />
                }
              </Box>
            </Box>
            <Box>
              <Text size="30px" color="black" weight="bold" margin={{bottom: "6px"}}>
                {this.state.channel?.name}
              </Text>
              <Text size="24px" color="#999999" weight="bold" margin={{bottom: "6px"}}>
                {this.state.followerCount} followers
              </Text>
              <Box direction="row" align="center">
                <ImageUploader
                  text="Upload avatar"
                  onUpload={this.onFileChosen}
                />
                <DeleteAgoraButton
                  name={this.state.channel!.name}
                  id={this.state.channel!.id}
                />
              </Box>
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
                this.state.channel?.long_description
                  ? this.state.channel?.long_description
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
    // console.log(this.state.listEmailCorrect)
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
                <Box direction="row" gap="40vw">
                  <ScheduleTalkButton
                    margin={{ bottom: "10px" }}
                    channel={this.state.channel}
                    onCreatedCallback={this.fetchAllTalks}
                  />
                  <Box
                    width="20vw"
                    height="40px"
                    justify="center"
                    align="center"
                    pad="small"
                    round="xsmall"
                    background="#F3EACE"
                  >
                    <Text size="18px" weight="bold" color="grey">
                      You are an administrator
                    </Text>
                  </Box>
                </Box>
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
                  <p>
                    {<UserAdmin />}
                    <big>
                      <b> Agora administrator page </b>
                    </big>
                  </p>
                  <p>As an administrator, you can:</p>
                  <ul>
                    <li>
                      <b>Create and edit events</b>
                    </li>
                    <li>
                      <b>Customize header</b>{" "}
                      <i>(recommended dim: 1500x500px)</i>
                    </li>
                    <li>
                      <b>Customize avatar </b>
                      <i>(recommended dim: 400x400px)</i>
                    </li>
                    <li>
                      <b>Edit Agora description</b>{" "}
                    </li>
                    <li>
                      <b>Promote users</b> to administrator/member.
                    </li>
                    <li>
                      <b>Link recordings</b> to your previous Agora events.
                    </li>
                  </ul>
                  <p>
                    For more general information, visit our
                    <Link to={"/info/getting-started"}>
                      <Text weight="bold" color="brand">
                        {" "}
                        getting-started{" "}
                      </Text>
                    </Link>
                    page.
                  </p>
                  <i>
                    <b>NB:</b> This help box and customisation options are only
                    visible to admins.
                  </i>
                </Text>
              </Box>

              {this.banner()}

              <Tabs>
                <TabList>
                  <Tab>
                    <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                      <Workshop />
                      <Text size="24px"> 
                        Talks 
                      </Text>
                    </Box>
                  </Tab>
                  <Tab>
                    <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                      <Group />
                      <Text size="24px"> 
                        Community 
                      </Text>
                    </Box>
                  </Tab>
                  {/*<Tab>
                    <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                      <MailOption />
                      <Text size="24px"> 
                        Mailing list 
                      </Text>
                    </Box>
                  </Tab>*/}
                  <Tab>
                    <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                      <ContactInfo />
                      <Text size="24px"> 
                        Contact 
                      </Text>
                    </Box>
                  </Tab>
                  <Tab>
                    <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                      <ContactInfo />
                      <Text size="24px"> 
                        Requests 
                      </Text>
                    </Box>
                  </Tab>
                </TabList>
                
                <TabPanel style={{width: "74.35vw"}}>
                  <Box
                    width="100%"
                    direction="row"
                    gap="small"
                    margin={{ top: "40px", bottom: "24px" }}
                  >
                    <Text size="24px" weight="bold" color="black">
                      {`Drafts`}
                    </Text>
                    <StatusInfo
                      data-tip data-for='draftInfo'
                      onMouseEnter={() => {
                        this.setState({ showDraftInfo: true });
                      }}
                      onMouseLeave={() => {
                        this.setState({ showDraftInfo: false });
                      }}
                    />
                    {this.state.showDraftInfo && (
                      <ReactTooltip id='draftInfo' place="right" effect="solid">
                        These talks are only visible to you.
                      </ReactTooltip>
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
                    user={this.state.user}
                    admin
                    onEditCallback={this.fetchAllTalks}
                  />
                  {this.state.currentTalks.length > 0 && (
                    <Box width="100%">
                      <Text
                        size="28px"
                        weight="bold"
                        color="black"
                        margin={{ top: "40px", bottom: "24px" }}
                      >
                        {`Happening now`}
                      </Text>
                      {this.state.currentTalks.map((talk: Talk) => (
                        <ChannelPageTalkCard 
                          talk={talk} 
                          user={null}
                          admin
                          width="31.5%" 
                          isCurrent={true}
                          onEditCallback={this.fetchAllTalks}
                        />
                      ))}
                    </Box>
                  )}
                  <Box
                    width="100%"
                    margin={{top: "12px", bottom: "24px" }}
                  >
                    <Text
                      size="24px"
                      weight="bold"
                      color="black"
                    >
                      {`Upcoming talks`}
                    </Text>
                  </Box>
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
                    user={this.state.user}
                    admin
                    onEditCallback={this.fetchAllTalks}
                  />
                  {this.state.pastStreams.length !== 0 && (
                    <Box
                      width="100%"
                      margin={{top: "12px", bottom: "24px" }}
                    >
                      <Text
                        size="24px"
                        weight="bold"
                        color="black"
                        margin={{ top: "40px" }}
                      >
                        {`Past talks`}
                      </Text>
                    </Box>
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
                        onEditCallback={this.fetchAllTalks}
                      />
                    ))}
                  </Box>
                </TabPanel>
                <TabPanel style={{width: "74.35vw"}}>
                  <Box direction="column">
                    <Box 
                      direction="row" 
                      width="100%" 
                      justify="between" 
                      margin={{bottom: "30px"}}>
                      <Box
                        width="31.5%"
                        height="250px"
                        background="#e5e5e5"
                        round="7.5px"
                        pad="10px"
                      >
                        <Box direction="row" justify="between">
                          <Text weight="bold" size="20px" color="black">
                            Agora admin
                          </Text>
                          {/* {this.state.role === "owner" && (
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
                          )} */}
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
                              channelId={this.state.channel?.id}
                              onRemovedCallback={this.fetchOwners}
                              showRemoveButton={this.state.role === "owner"}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box
                        width="31.5%"
                        height="250px"
                        background="#e5e5e5"
                        round="7.5px"
                        pad="10px"
                      >
                        <Box direction="row" justify="between">
                          <Text weight="bold" size="20px" color="black">
                            Agora members
                          </Text>
                          {/* {this.state.role === "owner" && (
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
                          )} */}
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
                              channelId={this.state.channel?.id}
                              onRemovedCallback={this.fetchMembers}
                              showRemoveButton={this.state.role === "owner"}
                            />
                          ))}
                        </Box>
                      </Box>
                      <Box
                        width="31.5%"
                        height="250px"
                        round="7.5px"
                        pad="10px"
                      >
                        <Text weight="bold" size="20px" color="black" margin={{bottom: "10px"}}>
                          Invited members
                        </Text>
                        {this.state.listInvitedMembers && (
                          <Box
                            direction="column"
                            width="100%"
                            height="100%"
                            overflow={{"vertical": "scroll", "horizontal": "auto"}} 
                            margin={{ top: "5px" }}
                            gap="xsmall"
                          >
                            {this.state.listInvitedMembers.map((item) =>
                              <Text> {item} </Text>
                            )}
                          </Box>
                        )}                        
                      </Box>
                      {/*       
                      <Box
                        width="31.5%"
                        height="250px"
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
                      */}
                    </Box>
                    <Box 
                      direction="column"
                      margin={{bottom: "60px"}}
                    >
                      <Box 
                        direction="row"
                        gap="small"
                        margin={{ top: "40px", bottom: "24px" }}
                      >
                        <Text size="24px" weight="bold" color="black">
                          Invite members
                        </Text>
                        <StatusInfo
                          data-tip data-for='mailingListInfo'
                          onMouseEnter={() => {
                            this.setState({ showMemberEmailInfo: true });
                          }}
                          onMouseLeave={() => {
                            this.setState({ showMemberEmailInfo: false });
                          }}
                        />
                        {this.state.showMemberEmailInfo && (
                          <ReactTooltip id='mailingListInfo' place="right" effect="solid">
                            Enter the emails of the people you want to invite as member of{" "}
                            {this.state.channel ? this.state.channel.name : "your agora"}.
                          </ReactTooltip>
                        )}
                      </Box>
                      
                      <TextArea
                        placeholder="Enter your list of emails"
                        value={this.state.mailingList}
                        onChange={(e: any) => this.handleMailingList(e)}
                        rows={4}
                        style={{border: this.state.strEmailWrong.length === 0 ? "2px solid black" : "2px solid red"}}
                        data-tip data-for='email'
                      />
                      <Box direction="row" width="100%" margin={{top: "20px"}}>
                        <Box width="100%"> 
                          {this.state.listEmailCorrect.length > 0 && (
                            <Text color="green">
                              Emails successfully extracted from text.
                            </Text>
                          )}
                          {/* {this.state.strEmailWrong.length > 0 && (
                            <Text color="red">
                              No emails detected.
                            </Text>
                          )} */}
                        </Box>
                        <Box
                          onClick={this.parseMailingList}
                          background="#7E1115"
                          round="xsmall"
                          pad="xsmall"
                          height="40px"
                          width="18%"
                          justify="center"
                          align="center"
                          focusIndicator={false}
                          hoverIndicator="#5A0C0F"
                        >
                          <Text size="18px"> Add </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </TabPanel>
                <TabPanel style={{width: "74.35vw"}}>
                  {/*
                  <Text
                    size="28px"
                    weight="bold"
                    color="black"
                    margin={{ top: "10px" }}
                  >
                    {<UserAdmin />} {`Administrator panel`}{" "}
                  </Text>
                  */}

                  <Box
                    direction="row"
                    width="100%"
                    wrap
                    // justify="between"
                    gap="20px"
                    margin={{ top: "10px", bottom: "60px" }}
                  >
                    <EmailContactManagement
                      channelId={this.state.channel!.id}
                      currentAddress={this.state.contactAddresses}
                      onAddAddress={this.onAddContactAddress}
                      onDeleteAddress={this.onDeleteContactAddress}
                    />
                  </Box>
                </TabPanel>
                <TabPanel style={{width: "74.35vw"}}>
                  <Box direction="row" margin={{bottom: "60px"}}>
                    <RequestsTab />
                  </Box>
                </TabPanel>
              </Tabs>
            </Box>
          </Box>
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
