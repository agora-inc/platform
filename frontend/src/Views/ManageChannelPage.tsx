import React, { Component, useEffect, useState } from "react";
import { Redirect } from "react-router";
import { Box, Text, TextArea, Image, Grid, Layer } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import { Talk, TalkService } from "../Services/TalkService";
import { ChannelSubscriptionService } from "../Services/ChannelSubscriptionService";
import {
  StreamingProductService,
  StreamingProduct,
} from "../Services/StreamingProductService";
import { Link } from "react-router-dom";
import Loading from "../Components/Core/Loading";
import ScheduleTalkButton from "../Components/Talks/ScheduleTalkButton";
import Identicon from "react-identicons";
import { ColorPicker } from "../Components/Channel/ColorPicker";
import ChannelPageTalkList from "../Components/Channel/ChannelPageTalkList";
import { AddUsersButton } from "../Components/Channel/AddUsersButton";
import "../Styles/manage-channel.css";
import ReactTooltip from "react-tooltip";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { ChannelPageUserCircle } from "../Components/Channel/ChannelPageUserCircle";
import { ChannelPageTalkCard } from "../Components/Channel/ChannelPageTalkCard";
import { PastTalkCard } from "../Components/Talks/PastTalkCard";
import ImageUploader from "../Components/Core/ImageUploader";
import PricingPlans from "../Views/PricingPlans";
import { baseApiUrl, basePoint } from "../config";
import { CSSProperties } from "styled-components";
import {
  FormDown,
  FormUp,
  UserAdmin,
  Workshop,
  StatusInfo,
  Checkmark,
  DocumentTime,
  MailOption,
  SettingsOption,
  Group,
  DocumentText,
  Resources,
  Configure,
} from "grommet-icons";
import EnrichedTextEditor from "../Components/Channel/EnrichedTextEditor";
import EmailContactManagement from "../Components/Channel/EmailContactManagement";
import DeleteAgoraButton from "../Components/Channel/DeleteAgoraButton";
import { RequestsTab } from "./ManageChannelPage/RequestsTab";
import "../Styles/react-tabs.css";
import { RegistrationsTab } from "./ManageChannelPage/RegistrationsTab";
import { EmailsTab } from "./ManageChannelPage/EmailsTab";
import ShareButtons from "../Components/Core/ShareButtons";
import ChannelTopicSelector from "../Components/Channel/ChannelTopicSelector";
import { Topic, TopicService } from "../Services/TopicService";
import agoraLogo from "../assets/general/agora_logo_v2.1.svg";
import { useStore } from "../store";
import { useAuth0 } from "@auth0/auth0-react";

const topicExists = (topics: Topic[]) => {
  let res = [];
  for (let topic in topics) {
    if (topic) {
      res.push(true);
    } else {
      res.push(false);
    }
  }
  return res;
};

type Role = "none" | "owner" | "member" | "follower";

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
  role: Role;
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

export const ManageChannelPage = (props: Props) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role>("none");
  const [followerCount, setFollowerCount] = useState(1);
  const [viewerCount, setViewerCount] = useState(NaN);
  const [colour, setColour] = useState("blue");
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingLongDescription, setEditingLongDescription] = useState(false);
  const [channelOwners, setChannelOwners] = useState<User[]>([]);
  const [channelMembers, setChannelMembers] = useState<User[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [mailingList, setMailingList] = useState("");
  const [listInvitedMembers, setListInvitedMembers] = useState<string[]>([]);
  const [listEmailCorrect, setListEmailCorrect] = useState<string[]>([]);
  const [strEmailWrong, setStrEmailWrong] = useState("");
  const [talks, setTalks] = useState<Talk[]>([]);
  const [drafts, setDrafts] = useState<Talk[]>([]);
  const [currentTalks, setCurrentTalks] = useState<Talk[]>([]);
  const [pastStreams, setPastStreams] = useState<Talk[]>([]);
  const [totalNumberOfTalks, setTotalNumberOfTalks] = useState(0);
  const [bannerExtended, setBannerExtended] = useState(true);
  const [longDescription, setLongDescription] = useState("");
  const [contactAddresses, setContactAddresses] = useState("");
  const [showDraftInfo, setShowDraftInfo] = useState(false);
  const [showMemberEmailInfo, setShowMemberEmailInfo] = useState(false);
  const [topics, setTopics] = useState(
    props.channel ? props.channel.topics : []
  );
  const [isPrevTopics, setIsPrevTopics] = useState(
    props.channel ? topicExists(props.channel.topics) : [false, false, false]
  );
  const [topicSaved, setTopicSaved] = useState(false);
  const [saveButtonFade, setSaveButtonFade] = useState(false);
  const [topicId, setTopicId] = useState(
    props.channel?.topics[0].id ? props.channel?.topics[0].id : 0
  );
  const [field, setField] = useState("");
  const [showModalPricing, setShowModalPricing] = useState(false);
  const [allPlansId, setAllPlansId] = useState<number[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState(["free"]);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, true);
    getChannelAndCheckAccess();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    getChannelAndCheckAccess();
  }, [props.match.params.name]);

  useEffect(() => {
    channel && fetchData();
    channel && ChannelService.getChannelTopic(channel.id, setTopicId);
    TopicService.getFieldFromId(topicId, setField);
  }, [channel]);

  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && pastStreams.length !== totalNumberOfTalks) {
      fetchPastTalks();
    }
  };

  const fetchData = () => {
    fetchChannelViewCount();
    fetchFollowerCount();
    fetchOwners();
    fetchMembers();
    fetchFollowers();
    fetchInvitedMembers();
    fetchPastTalks();
    fetchCurrentTalks();
    fetchTalks();
    fetchDrafts();
    storeUserData();
  };

  const getChannelAndCheckAccess = async () => {
    const token = await getAccessTokenSilently();
    ChannelService.getChannelByName(
      props.location.pathname.split("/")[1],
      (channel: Channel) => {
        setChannel(channel);
        setColour(channel.colour);
        if (user) {
          ChannelService.getRoleInChannel(
            user.id,
            channel.id,
            (role: Role) => {
              setRole(role);
              setLoading(false);
            },
            token
          );
        } else {
          setLoading(false);
        }
      }
    );
  };

  const fetchChannelViewCount = () => {
    channel &&
      ChannelService.getViewCountForChannel(channel.id, setViewerCount);
  };

  const fetchFollowerCount = () => {
    channel &&
      ChannelService.getFollowerCountForChannel(channel.id, setFollowerCount);
  };

  const fetchOwners = async () => {
    const token = await getAccessTokenSilently();
    channel &&
      ChannelService.getUsersForChannel(
        channel.id,
        ["owner"],
        setChannelOwners,
        token
      );
  };

  const fetchMembers = async () => {
    const token = await getAccessTokenSilently();
    channel &&
      ChannelService.getUsersForChannel(
        channel.id,
        ["member"],
        setChannelMembers,
        token
      );
  };

  const fetchFollowers = async () => {
    const token = await getAccessTokenSilently();
    channel &&
      ChannelService.getUsersForChannel(
        channel.id,
        ["follower"],
        setFollowers,
        token
      );
  };

  const fetchInvitedMembers = async () => {
    const token = await getAccessTokenSilently();
    channel &&
      ChannelService.getInvitedMembersForChannel(
        channel.id,
        setListInvitedMembers,
        token
      );
  };

  const fetchTalks = () => {
    channel && TalkService.getFutureTalksForChannel(channel.id, setTalks);
  };

  const fetchDrafts = () => {
    channel && TalkService.getDraftedTalksForChannel(channel.id, setDrafts);
  };

  const fetchPastTalks = () => {
    channel &&
      TalkService.getPastTalksForChannel(
        channel.id,
        (data: { talks: Talk[]; count: number }) => {
          setPastStreams(data.talks);
          setTotalNumberOfTalks(data.count);
        }
      );
  };

  const fetchCurrentTalks = () => {
    channel &&
      TalkService.getCurrentTalksForChannel(channel.id, setCurrentTalks);
  };

  const storeUserData = () => {
    channel && ChannelService.increaseViewCountForChannel(channel.id, () => {});
  };

  const getChannelSubscriptions = () => {
    if (props.channel) {
      ChannelSubscriptionService.getAllActiveSubscriptionsForChannel(
        props.channel.id,
        (allPlansId: number[]) => {
          setAllPlansId(allPlansId);
          setSubscriptionPlans(getChannelSubscriptionTiers(allPlansId));
        }
      );
    }
  };

  const getChannelSubscriptionTiers = (allPlansId: number[]) => {
    let tiers: string[] = [];
    allPlansId.map((id: number) => {
      StreamingProductService.getStreamingProductById(id, (product: any) => {
        tiers.push(product.tier);
      });
    });
    return tiers;
  };

  const fetchTalksDrafts = () => {
    fetchDrafts();
    fetchTalks();
  };

  const fetchAllTalks = () => {
    fetchDrafts();
    fetchTalks();
    fetchCurrentTalks();
    fetchPastTalks();
  };

  const updateColour = async (colour: string) => {
    const token = await getAccessTokenSilently();
    channel &&
      ChannelService.updateChannelColour(
        channel.id,
        colour,
        () => {
          setColour(colour);
        },
        token
      );
  };

  const onEditDescriptionClicked = async () => {
    const token = await getAccessTokenSilently();
    if (channel && editingDescription) {
      ChannelService.updateChannelDescription(
        channel.id,
        document.getElementById("description")!.textContent as string,
        () => {},
        token
      );
    }
    setEditingDescription(!editingDescription);
  };

  const handleMailingList = (e: any) => {
    setMailingList(e.target.value);
  };

  const parseMailingList = async () => {
    let _listEmailCorrect: string[] = [];
    // get all emails constructed using non-alphanumerical characters except "@", ".", "_", and "-"
    let regExtraction = mailingList.match(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
    );
    if (regExtraction === null) {
      regExtraction = [];
    }

    // filtering new admissibles emails from badly formatted ones
    let _strEmailWrong = mailingList;
    for (var email of regExtraction) {
      if (!listInvitedMembers.includes(email)) {
        _listEmailCorrect.push(email.toLowerCase());
      }
      _strEmailWrong = strEmailWrong.replace(email, "");
    }

    // clean box if empty
    _strEmailWrong = strEmailWrong.replace(/[/\n\;\,]/g, " ");
    if (strEmailWrong.replace(/[\s]/g, "") === "") {
      _strEmailWrong = "";
    }

    // send invitations for admissible emails
    const token = await getAccessTokenSilently();
    channel &&
      ChannelService.addFollowingMembersToChannel(
        channel.id,
        _listEmailCorrect,
        () => {
          setListEmailCorrect(_listEmailCorrect);
          setListInvitedMembers(listInvitedMembers.concat(_listEmailCorrect));
          setStrEmailWrong(_strEmailWrong);
          setMailingList(_strEmailWrong);
          fetchMembers();
          fetchOwners();
        },
        token
      );
  };

  const onSaveLongDescriptionClicked = async (newDescription: string) => {
    const token = await getAccessTokenSilently();
    channel &&
      ChannelService.updateLongChannelDescription(
        channel.id,
        newDescription,
        () => {
          setEditingLongDescription(!editingLongDescription);
        },
        token
      );
  };

  const onModifyLongDescription = (value: any) => {
    setLongDescription(value);
  };

  const onAddContactAddress = async (newAddress: any) => {
    const token = await getAccessTokenSilently();
    channel &&
      user &&
      ChannelService.addContactAddress(
        channel.id,
        newAddress,
        user.id,
        () => {},
        token
      );
  };

  const onDeleteContactAddress = async (oldAddress: any) => {
    const token = await getAccessTokenSilently();
    channel &&
      user &&
      ChannelService.removeContactAddress(
        channel.id,
        oldAddress,
        user.id,
        () => {},
        token
      );
  };

  const onFileChosen = async (e: any) => {
    const token = await getAccessTokenSilently();
    ChannelService.uploadAvatar(
      channel!.id,
      e.target.files[0],
      () => {
        window.location.reload();
      },
      token
    );
  };

  const getImageUrl = (): string | undefined => {
    let current_time = Math.floor(new Date().getTime() / 5000);
    let imageUrl = channel?.id
      ? `${baseApiUrl}/channels/cover?channelId=${channel.id}&ts=` +
        current_time
      : // HACK: we add the new time at the end of the URL to avoid caching;
        // we divide time by value such that all block of requested image have
        // the same name (important for the name to be the same for the styling).
        undefined;
    return imageUrl;
  };

  const getCoverBoxStyle = (): CSSProperties => {
    let background = channel?.colour;
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

  const toggleBanner = () => {
    setBannerExtended(!bannerExtended);
  };

  const toggleModalPricing = () => {
    setShowModalPricing(!showModalPricing);
  };

  const SavedButtonClicked = async () => {
    const token = await getAccessTokenSilently();
    setTopicSaved(true);
    setSaveButtonFade(true);
    channel &&
      ChannelService.editChannelTopic(
        channel.id,
        topics,
        () => {
          // console.log("channel topic saved");
        },
        token
      );
    return <Box></Box>;
  };

  const endOfAnimation = () => {
    setSaveButtonFade(false);
    return <Box></Box>;
  };

  const selectTopic = (topic: Topic, num: number) => {
    let tempTopics = topics;
    tempTopics[num] = topic;
    setTopics(tempTopics);
  };

  const cancelTopic = (num: number) => {
    let tempTopics = topics;
    tempTopics[num] = {
      field: "",
      id: 0,
      is_primitive_node: false,
      parent_1_id: -1,
      parent_2_id: -1,
      parent_3_id: -1,
    };
    setTopics(tempTopics);
  };

  const banner = () => {
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
          style={{ position: "relative" }}
          height="25vw"
        >
          <Image src={getImageUrl()} style={getCoverBoxStyle()} />
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <ColorPicker
              selected={colour}
              callback={updateColour}
              channelId={channel?.id}
              hasCover={channel ? channel.has_cover : false}
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
                  src={ChannelService.getAvatar(channel!.id, 1)}
                  height={100}
                  width={100}
                />
              }
            </Box>

            <Box direction="column" gap="xsmall" align="start" width="70%vw">
              <Text size="26px" color="black" weight="bold">
                {channel?.name}
              </Text>
              {typeof viewerCount == "number" && (
                <Text
                  size="16px"
                  color="#999999"
                  weight="bold"
                  margin={{ bottom: "6px", right: "20px" }}
                >
                  {viewerCount} visits
                </Text>
              )}

              <Box direction="row" align="end" gap="5px">
                <Box data-tip data-for="avatar_info">
                  <ImageUploader text="Upload avatar" onUpload={onFileChosen} />
                  <ReactTooltip id="avatar_info" place="top" effect="solid">
                    <p>Recommended avatar dim: 400x400px</p>
                  </ReactTooltip>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box direction="row" gap="xsmall" align="end" width="30%">
            <ShareButtons channel={channel} />
          </Box>

          {bannerExtended ? (
            <FormUp
              onClick={toggleBanner}
              size="50px"
              color="black"
              style={{ cursor: "pointer" }}
            />
          ) : (
            <FormDown
              onClick={toggleBanner}
              size="50px"
              color="black"
              style={{ cursor: "pointer" }}
            />
          )}
        </Box>
        {bannerExtended && (
          <>
            <EnrichedTextEditor
              text={channel?.long_description ? channel?.long_description : ""}
              onModify={onModifyLongDescription}
              onSave={onSaveLongDescriptionClicked}
            />
          </>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box width="100%" height="100%" justify="center" align="center">
        <Loading color="black" size={50} />
      </Box>
    );
  }

  if (role !== "owner") {
    return (
      <Redirect
        to={{
          pathname: `/${channel!.name}`,
        }}
      />
    );
  }

  return (
    <>
      <img
        style={{
          height: "auto",
          width: "auto",
          minWidth: "100%",
          minHeight: "100%",
        }}
        id="background-landing"
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
        <Box width="75%" height="100%" align="center">
          <Box align="start">
            {role === "owner" && (
              <Box direction="row" align="center" alignContent="end" gap="17vw">
                <ScheduleTalkButton
                  margin={{ bottom: "10px" }}
                  channel={channel}
                  onCreatedCallback={fetchAllTalks}
                />
                <Box direction="row" alignContent="end">
                  <Text size="14px" weight="bold" color="grey">
                    You are an administrator
                  </Text>
                </Box>
              </Box>
            )}
            {banner()}

            <Box
              direction="row"
              justify="center"
              margin={{ top: "10px", bottom: "10px" }}
              width="100%"
            >
              <Box justify="start" width="50%">
                <Text size="24px" weight="bold" color="color1">
                  {<UserAdmin />} {`Administrator panel`}{" "}
                </Text>
              </Box>
              <Box justify="end" width="50%" direction="row">
                <Box
                  onClick={toggleModalPricing}
                  background="color1"
                  round="xsmall"
                  pad="xsmall"
                  width="200px"
                  height="40px"
                  justify="center"
                  align="center"
                  focusIndicator={false}
                  hoverIndicator="color3"
                >
                  <Text size="14px" weight="bold">
                    {" "}
                    Your subscription{" "}
                  </Text>
                </Box>
                {/* 
          REFERAL BUTTON: TO UNCOMMENT SOON
          
          <a href={basePoint + "/referral/channel/" + channelId + "?referee=true"} style={{textDecoration: 0}}>
            <Box
              onClick={() => {setState({loading: false})}}
              background="color7"
              round="xsmall"
              pad="xsmall"
              width="200px"
              height="40px"
              justify="center"
              align="center"
              focusIndicator={false}
              hoverIndicator="#BAD6DB"
            >
              <Text size="14px" weight="bold"> Upgrade for free </Text>
            </Box>
          </a> */}
              </Box>
            </Box>

            {/* user && 
      (
        <>
          <StreamingCheckoutPaymentButton
            channelId={channelId}
            user={user}
            audienceSize={"big"}
            tier={"tier1"}
            productType={"subscription"}
            quantity={1}
            text={"vasy subscribe mec"}
          />
          <CancelSubscriptionsButton
          channelId={channelId}
          
          />
      </>
      ) */}

            {showModalPricing && (
              <Layer
                onEsc={toggleModalPricing}
                onClickOutside={toggleModalPricing}
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
                  callback={toggleModalPricing}
                  disabled={false}
                  channelId={channel?.id || -1}
                  showDemo={false}
                  headerTitle={false}
                />
              </Layer>
            )}

            <Tabs>
              <TabList>
                <Tab>
                  <Box
                    direction="row"
                    justify="center"
                    pad="6px"
                    gap="18px"
                    margin={{ left: "6px", right: "6px" }}
                  >
                    <DocumentTime />
                    <Text size="14px">Talks</Text>
                  </Box>
                </Tab>
                <Tab>
                  <Text
                    textAlign="end"
                    color="red"
                    weight="bold"
                    size="14px"
                    margin={{ left: "6px" }}
                  >
                    {" "}
                    New!{" "}
                  </Text>
                  <Box
                    direction="row"
                    justify="center"
                    pad="6px"
                    gap="18px"
                    margin={{ left: "6px", right: "6px" }}
                  >
                    <MailOption />
                    <Text size="14px">Mailing list</Text>
                  </Box>
                </Tab>
                <Tab>
                  <Box
                    direction="row"
                    justify="center"
                    pad="6px"
                    gap="18px"
                    margin={{ left: "6px", right: "6px" }}
                  >
                    <Group />
                    <Text size="14px">Community</Text>
                  </Box>
                </Tab>

                <Tab>
                  <Text
                    textAlign="end"
                    color="red"
                    weight="bold"
                    size="14px"
                    margin={{ left: "6px" }}
                  >
                    {" "}
                    New!{" "}
                  </Text>
                  <Box
                    direction="row"
                    justify="center"
                    pad="6px"
                    gap="15px"
                    margin={{ left: "6px", right: "6px" }}
                  >
                    <DocumentText />
                    <Text size="14px">Registrations</Text>
                  </Box>
                </Tab>

                <Tab>
                  <Box
                    direction="row"
                    justify="center"
                    pad="6px"
                    gap="18px"
                    margin={{ left: "6px", right: "6px" }}
                  >
                    <Configure />
                    <Text size="14px">Settings</Text>
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

              <TabPanel style={{ width: "78vw", minHeight: "800px" }}>
                <Box direction="row">
                  <ScheduleTalkButton
                    margin={{ top: "20px", bottom: "40px" }}
                    channel={channel}
                    onCreatedCallback={fetchAllTalks}
                  />
                  <Link to="/speakers">
                    <Box
                      margin={{ top: "20px", bottom: "40px", left: "10px" }}
                      onClick={() => {}}
                      background="#0C385B"
                      round="xsmall"
                      pad={{
                        bottom: "small",
                        top: "small",
                        left: "small",
                        right: "small",
                      }}
                      height="40px"
                      width="15vw"
                      justify="center"
                      align="center"
                      focusIndicator={false}
                      // hoverIndicator="#2433b5"
                      hoverIndicator="#BAD6DB"
                      direction="row"
                    >
                      <Workshop style={{ marginRight: "5px" }} />
                      Find a speaker
                    </Box>
                  </Link>
                </Box>

                <Box
                  width="100%"
                  direction="row"
                  gap="small"
                  margin={{ bottom: "24px" }}
                >
                  <Text size="20px" weight="bold" color="color1">
                    {`Drafts`}
                  </Text>
                  <StatusInfo
                    data-tip
                    data-for="draftInfo"
                    onMouseEnter={() => {
                      setShowDraftInfo(true);
                    }}
                    onMouseLeave={() => {
                      setShowDraftInfo(false);
                    }}
                  />
                  {showDraftInfo && (
                    <ReactTooltip id="draftInfo" place="right" effect="solid">
                      These drafts are only visible to you.
                    </ReactTooltip>
                  )}
                </Box>
                {drafts.length === 0 && (
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
                  talks={drafts}
                  channelId={channel!.id}
                  admin
                  onEditCallback={fetchAllTalks}
                />
                {currentTalks.length > 0 && (
                  <Box width="100%">
                    <Text
                      size="26px"
                      weight="bold"
                      color="color1"
                      margin={{ top: "40px", bottom: "24px" }}
                    >
                      {`Happening now`}
                    </Text>
                    {currentTalks.map((talk: Talk) => (
                      <ChannelPageTalkCard
                        talk={talk}
                        admin
                        width="31.5%"
                        isCurrent={true}
                        onEditCallback={fetchAllTalks}
                        following={false}
                      />
                    ))}
                  </Box>
                )}
                <Box width="100%" margin={{ top: "12px", bottom: "12px" }}>
                  <Text size="20px" weight="bold" color="color1">
                    {`Upcoming talks`}
                  </Text>
                </Box>
                {talks.length === 0 && (
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
                      {channel ? channel.name : "this channel"}
                    </Text>
                  </Box>
                )}
                <ChannelPageTalkList
                  talks={talks}
                  channelId={channel!.id}
                  admin
                  onEditCallback={fetchAllTalks}
                />
                {pastStreams.length !== 0 && (
                  <Box width="100%" margin={{ top: "12px", bottom: "24px" }}>
                    <Text
                      size="20px"
                      weight="bold"
                      color="color1"
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
                  {pastStreams.map((talk: Talk) => (
                    <PastTalkCard
                      width="31.5%"
                      talk={talk}
                      admin
                      margin={{ bottom: "medium" }}
                      onDelete={() => fetchPastTalks()}
                      onEditCallback={fetchAllTalks}
                    />
                  ))}
                </Box>
              </TabPanel>

              <TabPanel style={{ width: "78vw", minHeight: "800px" }}>
                <EmailsTab channelId={channel!.id} />
              </TabPanel>

              <TabPanel style={{ width: "78vw", minHeight: "800px" }}>
                <Box direction="column">
                  <Box
                    direction="row"
                    width="100%"
                    justify="between"
                    margin={{ bottom: "30px" }}
                  >
                    <Box
                      width="40%"
                      height="180px"
                      background="#e5e5e5"
                      round="7.5px"
                      pad="10px"
                    >
                      <Box direction="row" justify="between">
                        <Text weight="bold" size="14px" color="black">
                          <img src={agoraLogo} style={{ height: "14px" }} />{" "}
                          admins
                        </Text>
                        {/* {role === "owner" && (
                    <AddUsersButton
                      role="owner"
                      existingUsers={channelOwners}
                      channelId={channel!.id}
                      onUserAddedCallback={() => {
                        fetchMembers();
                        fetchOwners();
                        fetchFollowers();
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
                        {channelOwners.map((owner: User) => (
                          <ChannelPageUserCircle
                            user={owner}
                            channelId={channel?.id}
                            onRemovedCallback={fetchOwners}
                            showRemoveButton={role === "owner"}
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
                  {role === "owner" && (
                    <AddUsersButton
                      role="member"
                      existingUsers={channelMembers}
                      channelId={channel!.id}
                      onUserAddedCallback={() => {
                        fetchMembers();
                        fetchOwners();
                        fetchFollowers();
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
                  {channelMembers.map((member: User) => (
                    <ChannelPageUserCircle
                      user={member}
                      channelId={channel?.id}
                      onRemovedCallback={fetchMembers}
                      showRemoveButton={role === "owner"}
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
                        {followers.map((follower: User) => (
                          <ChannelPageUserCircle
                            user={follower}
                            showRemoveButton={false}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  <Box direction="column" margin={{ bottom: "60px" }}>
                    <Box
                      direction="row"
                      gap="small"
                      margin={{ bottom: "24px" }}
                    >
                      <Text size="14px" weight="bold" color="black">
                        Invite to follow
                      </Text>
                      <StatusInfo
                        data-tip
                        data-for="mailingListInfo"
                        onMouseEnter={() => {
                          setShowMemberEmailInfo(true);
                        }}
                        onMouseLeave={() => {
                          setShowMemberEmailInfo(false);
                        }}
                      />
                      {showMemberEmailInfo && (
                        <ReactTooltip
                          id="mailingListInfo"
                          place="right"
                          effect="solid"
                          multiline={true}
                        >
                          Enter the emails of the people you want to invite to
                          follow {channel ? channel.name : "your agora"}
                          . <br />
                          Example: joe@uni.ac.uk, jack@company.com
                        </ReactTooltip>
                      )}
                    </Box>

                    <TextArea
                      placeholder="joe@uni.ac.uk, jack@company.com"
                      value={mailingList}
                      onChange={(e: any) => handleMailingList(e)}
                      rows={4}
                      style={{
                        border:
                          strEmailWrong.length === 0
                            ? "2px solid black"
                            : "2px solid red",
                      }}
                      data-tip
                      data-for="email"
                    />
                    <Box direction="row" width="100%" margin={{ top: "20px" }}>
                      <Box width="100%">
                        {listEmailCorrect.length > 0 && (
                          <Text color="green" size="14px">
                            Emails successfully extracted from text.
                          </Text>
                        )}
                        {/* {strEmailWrong.length > 0 && (
                    <Text color="red">
                      No emails detected.
                    </Text>
                  )} */}
                      </Box>
                      <Box
                        onClick={parseMailingList}
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

              <TabPanel style={{ width: "78vw", minHeight: "800px" }}>
                <Box direction="row" margin={{ bottom: "60px" }}>
                  <RegistrationsTab channelId={channel!.id} />
                </Box>
              </TabPanel>

              <TabPanel style={{ width: "78vw", minHeight: "800px" }}>
                <Box direction="row" margin={{ top: "40px", bottom: "60px" }}>
                  <DeleteAgoraButton name={channel!.name} id={channel!.id} />
                </Box>
              </TabPanel>

              {/* 
          TAB FOR MEMBERSHIP APPLICATION:
          
        <TabPanel style={{width: "78vw", minHeight: "800px"}}>
          <Box direction="row" margin={{bottom: "60px"}}>
            <RequestsTab channelId={channel!.id}/>
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
                channelId={channel!.id}
                currentAddress={contactAddresses}
                onAddAddress={onAddContactAddress}
                onDeleteAddress={onDeleteContactAddress}
              />
            </Box>
            <Box gridArea="topic_change">
              <ChannelTopicSelector 
                onSelectedCallback={selectTopic}
                onCanceledCallback={cancelTopic}
                isPrevTopics={isPrevTopics}
                prevTopics={props.channel ? props.channel.topics : []} 
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
                onClick={SavedButtonClicked}
                onAnimationEnd={endOfAnimation}
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

              {topicSaved == false && (
                  "Save"
              )}
              {topicSaved == true && (
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
  );
};
