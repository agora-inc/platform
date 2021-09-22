import React, { Component } from "react";
import { Redirect } from "react-router";
import { Box, Text, TextArea, Image, Grid, Layer } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import { Talk, TalkService } from "../Services/TalkService";
import { ChannelSubscriptionService } from "../Services/ChannelSubscriptionService";
import { StreamingProductService, StreamingProduct } from "../Services/StreamingProductService";
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
import PricingPlans from "../Views/PricingPlans";
import { baseApiUrl } from "../config";
import { CSSProperties } from "styled-components";
import { FormDown, FormUp, UserAdmin, Workshop, StatusInfo, Checkmark, 
  MailOption, SettingsOption, Group, DocumentText, Resources, Configure } from "grommet-icons";
import EnrichedTextEditor from "../Components/Channel/EnrichedTextEditor";
import EmailContactManagement from "../Components/Channel/EmailContactManagement";
import DeleteAgoraButton from "../Components/Channel/DeleteAgoraButton";
import RequestsTab from "./ManageChannelPage/RequestsTab";
import "../Styles/react-tabs.css";
import RegistrationsTab from "./ManageChannelPage/RegistrationsTab";
import EmailsTab from "./ManageChannelPage/EmailsTab";
import ShareButtons from "../Components/Core/ShareButtons";
import ChannelTopicSelector from "../Components/Channel/ChannelTopicSelector";
import { Topic, TopicService } from "../Services/TopicService";
import agoraLogo from "../assets/general/agora_logo_v2.1.svg";


interface Props {
  location: any;
  match: any;
  channel?: Channel;
}

interface State {
  channel: Channel | null;
  channelId: number;
  loading: boolean;
  user: User | null;
  role: "none" | "owner" | "member" | "follower";
  followerCount: number;
  viewerCount: number;
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
  topics: Topic[];
  isPrevTopics: boolean[];
  topicSaved: boolean;
  saveButtonFade: boolean;
  topicId: number;
  field: string;
  showModalPricing: boolean;
  allPlansId: number[];
  subscriptionPlans: string[];
}

export default class ManageChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channel: null,
      channelId: 0,
      loading: true,
      user: null,
      role: "none",
      followerCount: 1,
      viewerCount: NaN,
      colour: "blue",
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
      topics: this.props.channel ? this.props.channel.topics : [],
      isPrevTopics: this.props.channel ? this.topicExists(this.props.channel.topics) : [false, false, false],
      topicSaved: false,
      saveButtonFade: false,
      topicId: this.props.channel?.topics[0].id ? this.props.channel?.topics[0].id : 0,
      field: "",
      showModalPricing: false,
      allPlansId: [],
      subscriptionPlans: ["free"],
    };
  }

  componentWillMount() {
    window.addEventListener("scroll", this.handleScroll, true);
    this.getChannelAndCheckAccess();
    ChannelService.getChannelByName(
      this.props.location.pathname.split("/")[1],
      (channel: Channel) => {
        this.setState({channelId: channel.id})
      }
    );
    ChannelService.getChannelTopic(
      this.state.channelId,
      (currentTopicId: number) => {
        this.setState({ topicId:currentTopicId });
      }
    );
    TopicService.getFieldFromId(
      this.state.topicId,
      (topicName: string) => {
        this.setState({field: topicName})
      }
    )
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

  getChannelSubscriptions = () => {
    if (this.props.channel) {
      ChannelSubscriptionService.getAllActiveSubscriptionsForChannel(
        this.props.channel.id, 
        (allPlansId: number[]) => {
          this.setState({ allPlansId })
          this.setState({
            subscriptionPlans: this.getChannelSubscriptionTiers(allPlansId)
          })
        }
      );
    }
  }

  getChannelSubscriptionTiers = (allPlansId: number[]) => {
    let tiers: string[] = []
    allPlansId.map((id: number) => {
      StreamingProductService.getStreamingProductById(
        id, 
        (product: any) => {
          tiers.push(product.tier)
        }
      )
    })
    return tiers
  }

  storeUserData = () => {
    ChannelService.increaseViewCountForChannel(
      this.state.channel!.id,
      () => {});
  };

  fetchData = () => {
    this.fetchChannelViewCount();
    this.fetchFollowerCount();
    this.fetchOwners();
    this.fetchMembers();
    this.fetchFollowers();
    this.fetchInvitedMembers();
    this.fetchPastTalks();
    this.fetchCurrentTalks();
    this.fetchTalks();
    this.fetchDrafts();
    this.storeUserData();
  };

  fetchChannelViewCount = () => {
    ChannelService.getViewCountForChannel(
      this.state.channel!.id,
      (viewerCount: number) => {
        this.setState({ viewerCount });
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
    ChannelService.addFollowingMembersToChannel(    
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

  getImageUrl = (): string | undefined => {
    let current_time = Math.floor(new Date().getTime() / 5000);
    let imageUrl = this.state.channel?.id
      ? `${baseApiUrl}/channels/cover?channelId=${this.state.channel.id}&ts=` + current_time
      // HACK: we add the new time at the end of the URL to avoid caching; 
      // we divide time by value such that all block of requested image have 
      // the same name (important for the name to be the same for the styling).
      : undefined;
    return imageUrl;
  }

  getCoverBoxStyle = (): CSSProperties => {
    let background = this.state.channel ?.colour;
    let border = "none";

    return {
      width: "100%",
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      background: background,
      backgroundSize: "100vw 33vw",
      border: border,
    };
  };

  toggleBanner = () => {
    this.setState({ bannerExtended: !this.state.bannerExtended });
  };

  toggleModalPricing = () => {
    this.setState({ showModalPricing: !this.state.showModalPricing });
  };

  SavedButtonClicked = () => {
    this.setState({ topicSaved: true });
    this.setState({ saveButtonFade: true});
    ChannelService.editChannelTopic(
      this.state.channel!.id,
      this.state.topics,
      () => {
        // console.log("channel topic saved");
      }
    );
    return (
      <Box></Box>
    );
  };

  endOfAnimation = () => {
    this.setState({ saveButtonFade: false});
    return (
      <Box></Box>
    );
  }

  topicExists = (topics: Topic[]) => {
    let res = [];
    for (let topic in topics) {
      if (topic) {
        res.push(true)
      } else {
        res.push(false)
      }
    }
    return res;
  }

  selectTopic = (topic: Topic, num: number) => {
    let tempTopics = this.state.topics;
    tempTopics[num] = topic;
    this.setState({
      topics: tempTopics
    });
  }

  cancelTopic = (num: number) => {
    let tempTopics = this.state.topics;
    tempTopics[num] = {
      field: "",
      id: 0,
      is_primitive_node: false,
      parent_1_id: -1,
      parent_2_id: -1, 
      parent_3_id: -1,
    }
    this.setState({
      topics: tempTopics
    });
  }

  banner = () => {
    return (
      <Box
        // width="75vw"
        background="white"
        round="10px"
        margin={{ bottom: "60px" }}
      >
        <Box
          direction="row"
          justify="between"
          style={{position: 'relative'}}
          height="25vw"
        >
          <Image src={this.getImageUrl()} style={this.getCoverBoxStyle()} />
          <div style={{position: 'absolute', top: 10, right: 10}}>
            <ColorPicker
              selected={this.state.colour}
              callback={this.updateColour}
              channelId={this.state.channel?.id}
              hasCover={
                this.state.channel ? this.state.channel.has_cover : false
              }
            />
          </div>
        </Box>
        <Box
          direction="row"
          height="133px"
          align="center"
          justify="between"
          pad={{ top: "16px", right: "16px", left: "16px" }}
        >
          <Box direction="row" align="center" gap="small" width="75vw">
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




            <Box direction="column" gap="xsmall" align="start" width="70%vw">
              <Text 
                  size="26px"
                  color="black"
                  weight="bold"
                >
                  {this.state.channel ?.name}
                </Text>
              {(typeof(this.state.viewerCount) == "number") &&
                <Text 
                  size="16px"
                  color="#999999"
                  weight="bold"
                  margin={{bottom: "6px", right: "20px"}}
                >
                  {this.state.viewerCount} visits
                </Text>
              }

            <Box 
              direction="row"
              align="end"
              gap="5px"
            >
            <Box data-tip data-for="avatar_info">
                <ImageUploader
                  text="Upload avatar"
                  onUpload={this.onFileChosen}
                  />
                    <ReactTooltip id='avatar_info' place="top" effect="solid">
                      <p>Recommended avatar dim: 400x400px</p>
                    </ReactTooltip>
              </Box>
            </Box>
            </Box>
          </Box>

          

          <Box direction="row" gap="xsmall" align="end" width="30%">
              <ShareButtons
                channel={this.state.channel}
              />
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
    const { channel } = this.state;

    if (this.state.loading) {
      return (
        <Box width="100%" height="100%" justify="center" align="center">
          <Loading color="black" size={50} />
        </Box>
      );
    } else {
      return this.isAllowed() ? (
        <>
        <img style={{ height: "auto", width: "auto", minWidth: "100%", minHeight: "100%" }} id="background-landing"
          // src={BackgroundImage}
          src="https://i.postimg.cc/RhmJmzM3/mora-social-media-cover-bad6db.jpg"
        />
        
        <Box 
          align="center"
          style={{
            position: "absolute",
            top: "5vw",
          }}

        >        
          <Box
             width="75%"
            height="100%"
            align="center"

          >
            <Box align="start">
              {this.state.role === "owner" && (
                <Box direction="row" align="center" alignContent="end" gap="17vw">
                  <ScheduleTalkButton
                    margin={{ bottom: "10px" }}
                    channel={this.state.channel}
                    user={this.state.user}
                    onCreatedCallback={this.fetchAllTalks}
                  />
                  <Box direction="row" alignContent="end">
                    <Text size="14px" weight="bold" color="grey">
                      You are an administrator
                    </Text>
                  </Box>
                </Box>
              )}
              {this.banner()}

              <Box direction="row" align="start"  margin={{ top: "10px", bottom: "10px" }}>
                <Text
                  size="24px"
                  weight="bold"
                  color="black"
                  style={{width: "69vw"}}
                >
                  {<UserAdmin />} {`Administrator panel`}{" "}
                </Text>

                <Box
                  onClick={this.toggleModalPricing}
                  background="#0C385B"
                  round="xsmall"
                  pad="xsmall"
                  width="160px"
                  height="40px"
                  justify="center"
                  align="center"
                  focusIndicator={false}
                  hoverIndicator="#BAD6DB"
                >
                  <Text size="14px" weight="bold"> Pricing options </Text>
                </Box>
              </Box>

              
              { /* this.state.user && 
              (
                <>
                  <StreamingCheckoutPaymentButton
                    channelId={this.state.channelId}
                    user={this.state.user}
                    audienceSize={"big"}
                    tier={"tier1"}
                    productType={"subscription"}
                    quantity={1}
                    text={"vasy subscribe mec"}
                  />
                  <CancelSubscriptionsButton
                  channelId={this.state.channelId}
                  
                  />
              </>
              ) */}

              {this.state.showModalPricing && (
                <Layer
                  onEsc={this.toggleModalPricing}
                  onClickOutside={this.toggleModalPricing}
                  modal
                  responsive
                  animation="fadeIn"
                  style={{
                    width: "1000px",
                    height: "65%",
                    borderRadius: 15,
                    padding: 0,
                  }}
                >
                  <PricingPlans 
                    callback={this.toggleModalPricing}
                    disabled={false}
                    channelId={this.state.channelId}
                    userId={this.state.user ? this.state.user.id : null}
                    showDemo={false}
                    headerTitle={false} 
                  />

                </Layer>
              )}
              


              <Text size="14" margin={{ bottom: "20px" }}>
                For more detailed information about what you can do, visit our <Link to={"/info/getting-started"} color="color1">
                  <Text color="color1" weight="bold" size="14px">
                  getting-started page.
                  </Text>
                </Link>
              </Text>
              


              <Tabs>
                <TabList>
                  <Tab>
                    <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                      <Workshop />
                      <Text size="14px"> 
                        Talks 
                      </Text>
                    </Box>
                  </Tab>
                  <Tab>
                  <Text textAlign="end" color="red" weight="bold" size="14px" margin={{left: "6px"}}> New! </Text>
                    <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                      <MailOption />
                      <Text size="14px"> 
                        Mailing list 
                      </Text>
                    </Box>
                    
                  </Tab>
                  <Tab>
                    <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                      <Group />
                      <Text size="14px"> 
                        Community 
                      </Text>
                    </Box>
                  </Tab>

                  <Tab>
                    <Text textAlign="end" color="red" weight="bold" size="14px" margin={{left: "6px"}}> New! </Text>
                    <Box direction="row" justify="center" pad="6px" gap="15px" margin={{left: "6px", right: "6px"}}>
                      <DocumentText />
                      <Text size="14px"> 
                        Registrations 
                      </Text>
                    </Box>
                  </Tab>

                  <Tab>
                    <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                      <Configure />
                      <Text size="14px"> 
                        Settings 
                      </Text>
                    </Box>
                  </Tab>
                  {/* 
                    TAB FOR MEMBERSHIP APPLICATION:
                  
                  <Tab>
                    <Box direction="row" justify="center" pad="6px" gap="15px" margin={{left: "6px", right: "6px"}}>
                      <Resources />
                      <Text size="14px"> 
                        Memberships
                      </Text>
                    </Box>
                  </Tab> */}

                  {/* <Tab>
                    <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                      <SettingsOption />
                      <Text size="14px"> 
                        Details 
                      </Text>
                    </Box>
                  </Tab> */}
                </TabList>
                

                <TabPanel style={{width: "78vw", minHeight: "800px"}}>
                  <ScheduleTalkButton
                    margin={{ top: "20px", bottom: "40px" }}
                    channel={this.state.channel}
                    user={this.state.user}
                    onCreatedCallback={this.fetchAllTalks}
                  />
                  <Box
                    width="100%"
                    direction="row"
                    gap="small"
                    margin={{ bottom: "24px" }}
                  >
                    <Text size="20px" weight="bold" color="black">
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
                        These drafts are only visible to you.
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
                      <Text size="14px" weight="bold" color="grey">
                        Future drafts will saved here
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
                        size="26px"
                        weight="bold"
                        color="color1"
                        margin={{ top: "40px", bottom: "24px" }}
                      >
                        {`Happening now 🔴`}
                      </Text>
                      {this.state.currentTalks.map((talk: Talk) => (
                        <ChannelPageTalkCard 
                          talk={talk} 
                          user={null}
                          admin
                          width="31.5%" 
                          isCurrent={true}
                          onEditCallback={this.fetchAllTalks}
                          following={false}
                        />
                      ))}
                    </Box>
                  )}
                  <Box
                    width="100%"
                    margin={{top: "12px", bottom: "12px" }}
                  >
                    <Text
                      size="20px"
                      weight="bold"
                      color="color1"
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
                      <Text size="14px" weight="bold" color="grey">
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
                        size="20px"
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

                <TabPanel style={{width: "78vw", minHeight: "800px"}}>
                  <EmailsTab channelId={channel!.id} />
                </TabPanel>

                <TabPanel style={{width: "78vw", minHeight: "800px"}}>
                  <Box direction="column">
                    <Box 
                      direction="row" 
                      width="100%" 
                      justify="between" 
                      margin={{bottom: "30px"}}>
                      <Box
                        width="40%"
                        height="180px"
                        background="#e5e5e5"
                        round="7.5px"
                        pad="10px"
                      >
                        <Box direction="row" justify="between">
                          <Text weight="bold" size="14px" color="black">
                          <img src={agoraLogo} style={{ height: "14px"}}/> admins
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

                      {/* <Box
                        width="58%"
                        height="180px"
                        background="#e5e5e5"
                        round="7.5px"
                        pad="10px"
                      >
                        <Box direction="row" justify="between">
                          <Text weight="bold" size="14px" color="black">
                          <img src={agoraLogo} style={{ height: "14px"}}/> members
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
                              channelId={this.state.channel?.id}
                              onRemovedCallback={this.fetchMembers}
                              showRemoveButton={this.state.role === "owner"}
                            />
                          ))}
                        </Box>
                      </Box> */}


                      <Box
                        width="58.5%"
                        height="180px"
                        background="#e5e5e5"
                        round="7.5px"
                        pad="10px"
                        >
                        <Text weight="bold" size="14px" color="black">
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
                      direction="column"
                      margin={{bottom: "60px"}}
                    >
                      <Box 
                        direction="row"
                        gap="small"
                        margin={{ bottom: "24px" }}
                      >
                        <Text size="14px" weight="bold" color="black">
                          Invite to follow
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
                          <ReactTooltip id='mailingListInfo' place="right" effect="solid" multiline={true}>
                            Enter the emails of the people you want to invite to follow {" "}
                            {this.state.channel ? this.state.channel.name : "your agora"}. <br />
                            Example: joe@uni.ac.uk, jack@company.com
                          </ReactTooltip>
                        )}
                      </Box>
                      
                      <TextArea
                        placeholder="joe@uni.ac.uk, jack@company.com"
                        value={this.state.mailingList}
                        onChange={(e: any) => this.handleMailingList(e)}
                        rows={4}
                        style={{border: this.state.strEmailWrong.length === 0 ? "2px solid black" : "2px solid red"}}
                        data-tip data-for='email'
                      />
                      <Box direction="row" width="100%" margin={{top: "20px"}}>
                        <Box width="100%"> 
                          {this.state.listEmailCorrect.length > 0 && (
                            <Text color="green" size="14px">
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
                          background="#0C385B"
                          round="xsmall"
                          // pad="xsmall"
                          height="30px"
                          width="18%"
                          justify="center"
                          align="center"
                          focusIndicator={false}
                          hoverIndicator="#BAD6DB"
                        >
                          <Text size="14px"> Add </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </TabPanel>



                <TabPanel style={{width: "78vw", minHeight: "800px"}}>
                  <Box direction="row" margin={{bottom: "60px"}}>
                    <RegistrationsTab channelId={channel!.id} />
                  </Box>
                </TabPanel>


                <TabPanel style={{width: "78vw", minHeight: "800px"}}>
                  <Box direction="row" margin={{top: "40px", bottom: "60px"}}>
                    <DeleteAgoraButton
                      name={this.state.channel!.name}
                      id={this.state.channel!.id}
                    />
                  </Box>
                </TabPanel>

                {/* 
                  TAB FOR MEMBERSHIP APPLICATION:
                  
                <TabPanel style={{width: "78vw", minHeight: "800px"}}>
                  <Box direction="row" margin={{bottom: "60px"}}>
                    <RequestsTab channelId={this.state.channel!.id}/>
                  </Box>
                </TabPanel> */}
                
              {/*   DETAIL SECTION: COMMENTED OUT
                <TabPanel style={{width: "78vw", minHeight: "800px"}}>             
                  <Grid
                    rows={['xxsmall', 'xxsmall']}
                    columns={['medium', 'xxsmall']}
                    gap="small"
                    areas={[
                      { name: 'email', start: [0, 0], end: [1, 0]},
                      { name: 'topic_change', start: [0, 1], end: [0, 1] },
                      { name: 'topic_button', start: [1, 1], end: [1, 1]},
                    ]}
                  >
                    <Box gridArea="email">
                      <EmailContactManagement
                        channelId={this.state.channel!.id}
                        currentAddress={this.state.contactAddresses}
                        onAddAddress={this.onAddContactAddress}
                        onDeleteAddress={this.onDeleteContactAddress}
                      />
                    </Box>
                    <Box gridArea="topic_change">
                      <ChannelTopicSelector 
                        onSelectedCallback={this.selectTopic}
                        onCanceledCallback={this.cancelTopic}
                        isPrevTopics={this.state.isPrevTopics}
                        prevTopics={this.props.channel ? this.props.channel.topics : []} 
                        textSize="small"
                      />
                    </Box>
                    <Box gridArea="topic_button">
                      <Box
                        className={"save_Button"}
                        focusIndicator={false}
                        width={"10vw"}
                        background="white"
                        round="xsmall"
                        height={"30px"}
                        pad={{bottom: "6px", top: "6px", left: "3px", right: "3px"}}
                        onClick={this.SavedButtonClicked}
                        onAnimationEnd={this.endOfAnimation}
                        style={{
                          border: "1px solid #C2C2C2",
                          minWidth: "25px"
                        }}
                        hoverIndicator={true}
                        justify="center"
                      >
                        <Text 
                          size="14px" 
                          color="grey"
                          alignSelf="center"
                        >

                      {this.state.topicSaved == false && (
                          "Save"
                      )}
                      {this.state.topicSaved == true && (
                          "Saved"
                      )}
                      </Text>
                      </Box>
                    </Box>
                  </Grid>
                </TabPanel> */}
              </Tabs>
            </Box>
          </Box>
        </Box>
      </>
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
