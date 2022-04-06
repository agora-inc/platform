import React, { Component, useEffect, useState } from "react";
import {
  Box,
  CheckBox,
  Text,
  TextInput,
  TextArea,
  Calendar,
  MaskedInput,
  Select,
  Layer,
} from "grommet";
import { Overlay, OverlaySection } from "../Core/Overlay";
import Button from "../Core/Button";
import { Channel } from "../../Services/ChannelService";
import { Tag } from "../../Services/TagService";
import { Talk, TalkService } from "../../Services/TalkService";
import { User } from "../../Services/UserService";
import { ChannelSubscriptionService } from "../../Services/ChannelSubscriptionService";
import { StreamingProductService } from "../../Services/StreamingProductService";
import TopicSelector from "../Talks/TopicSelector";
import { Topic } from "../../Services/TopicService";
import "../../Styles/edit-talk-modal.css";
import { textToLatex } from "../Core/LatexRendering";
import Switch from "../Core/Switch";
import { InlineMath } from "react-katex";
import {
  StatusInfo,
  Close,
  LinkNext,
  LinkPrevious,
  Configure,
} from "grommet-icons";
import ReactTooltip from "react-tooltip";
import ShareButtons from "../Core/ShareButtons";
import PricingPlans from "../../Views/PricingPlans";
import { UrlEncryption } from "../Core/Encryption/UrlEncryption";
import { thisExpression } from "@babel/types";
import { useStore } from "../../store";
import { useAuth0 } from "@auth0/auth0-react";

const auto_accept =
  "'Automatically accepting a registration' means that the person registering to your event will automatically receive its details by email if they belong to one of the below group.";
const domains_list =
  "Enter the name of the domains you want to automatically accept, separated by commas. <br/>" +
  "Example: ox.ac.uk, cam.ac.uk";
const numbers = [1, 2, 3, 4, 5];

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

export type Reminder = {
  exist: boolean;
  days: number;
  hours: number;
};

interface Props {
  channel: Channel | null;
  channelId?: number;
  visible: boolean;
  onFinishedCallback: any;
  onCanceledCallback: any;
  onDeletedCallback?: any;
  talk?: Talk;
  onFinishedAdvertisementCallback?: any;
  onCanceledAdvertisementCallback?: any;
}

export const EditTalkModal = (props: Props) => {
  const [title, setTitle] = useState(props.talk ? props.talk.name : "");
  const [description, setDescription] = useState(
    props.talk ? props.talk.description.replace("''", "'") : ""
  );
  const [tags, setTags] = useState(props.talk ? props.talk.tags : []);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(
    props.talk
      ? new Date(props.talk.date).toISOString()
      : new Date().toISOString()
  );
  const [startTime, setStartTime] = useState(
    props.talk ? new Date(props.talk.date).toTimeString().slice(0, 5) : ""
  );
  const [endTime, setEndTime] = useState(
    props.talk ? new Date(props.talk.end_date).toTimeString().slice(0, 5) : ""
  );
  const [link, setLink] = useState(props.talk ? props.talk.link : "");
  const [linkAvailable, setLinkAvailable] = useState(
    props.talk ? props.talk.link_available : false
  );
  const [releaseLinkOffset, setReleaseLinkOffset] = useState(
    props.talk ? props.talk.show_link_offset : 15
  );
  const [linkVisibility, setLinkVisibility] = useState(
    props.talk ? props.talk.visibility : "Everybody"
  );
  const [cardVisibility, setCardVisibility] = useState(
    props.talk ? props.talk.card_visibility : "Everybody"
  );
  const [topics, setTopics] = useState(props.talk ? props.talk.topics : []);
  const [talkSpeaker, setTalkSpeaker] = useState(
    props.talk ? props.talk.talk_speaker : ""
  );
  const [talkSpeakerURL, setTalkSpeakerURL] = useState(
    props.talk ? props.talk.talk_speaker_url : ""
  );
  const [latex, setLatex] = useState(false);
  const [published, setPublished] = useState(
    props.talk ? props.talk.published : 0
  );
  const [showCardVisibilityInfo, setShowCardVisibilityInfo] = useState(false);
  const [isPrevTopics, setIsPrevTopics] = useState(
    props.talk ? topicExists(props.talk.topics) : [false, false, false]
  );
  const [audienceLevel, setAudienceLevel] = useState(
    props.talk ? props.talk.audience_level : "General audience"
  );
  const [showAdvertisementOverlay, setShowAdvertisementOverlay] =
    useState(false);
  const [talkToAdvertise, setTalkToAdvertise] = useState(
    props.talk ? props.talk : null
  );
  const [sendEmail, setSendEmail] = useState(false);
  const [talkId, setTalkId] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState(1);
  const [onRegistration, setOnRegistration] = useState(false);
  const [onClickDelete, setOnClickDelete] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([
    { exist: false, days: 0, hours: 0 },
    { exist: false, days: 0, hours: 0 },
  ]);
  const [reminderEmailGroup, setReminderEmailGroup] = useState<string[]>([]);
  const [autoAcceptEnabled, setAutoAcceptEnabled] = useState(false);
  const [autoAcceptGroup, setAutoAcceptGroup] = useState<
    "Everybody" | "Academics" | "None"
  >("Everybody");
  const [autoAcceptCustomInstitutions, setAutoAcceptCustomInstitutions] =
    useState(false);
  const [showModalPricing, setShowModalPricing] = useState(false);
  const [allPlansId, setAllPlansId] = useState<number[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<string[]>([]);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getReminders();
    getChannelSubscriptions();
  }, []);

  const getReminders = async () => {
    if (props.talk) {
      const token = await getAccessTokenSilently();
      TalkService.getReminderTime(
        props.talk.id,
        (reminders: Reminder[]) => {
          setReminders(reminders);
        },
        token
      );
      TalkService.getReminderGroup(
        props.talk.id,
        (reminderEmailGroup: string[]) => {
          setReminderEmailGroup(reminderEmailGroup);
        },
        token
      );
    }
  };

  const getChannelSubscriptions = () => {
    if (props.channel || props.channelId) {
      let id = props.channel
        ? props.channel.id
        : props.channelId
        ? props.channelId
        : -1;

      ChannelSubscriptionService.getAllActiveSubscriptionsForChannel(
        id,
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

  const onFinishClicked = () => {
    setLoading(true);
    setPublished(1);
    setShowAdvertisementOverlay(true);
    onFinish();
  };

  const combineDateAndTimeStrings = () => {
    const startDate = new Date(`${date.slice(0, 10)} ${startTime}`)
      .toISOString()
      .slice(0, 16)
      .replace("T", " ");
    const endDate = new Date(`${date.slice(0, 10)} ${endTime}`)
      .toISOString()
      .slice(0, 16)
      .replace("T", " ");
    return [startDate, endDate];
  };

  const makeLinkDateOption = (offset: number) => {
    let label;
    switch (offset) {
      case 0:
        label = "Now";
        break;
      case 15:
        label = "15 minutes before talk";
        break;
      case 60:
        label = "1 hour before talk";
        break;
      case 1440:
        label = "24 hours before talk";
        break;
    }
    // console.log(label);
    return {
      label: label,
      value: offset,
    };
  };

  const makeLinkDateOptions = () => {
    const offsets = [0, 15, 60, 1440];
    return offsets.map(makeLinkDateOption);
  };

  const validLink = (link: string) => {
    if (link.startsWith("https://") || link.startsWith("http://")) {
      return link;
    } else {
      return "https://".concat(link);
    }
  };

  const escapeSingleQuotes = (text: string) => {
    // We want to store backslash with \\
    // We want to store apostrophe '
    return text.replace(/"/g, "'").replace(/\\/g, "\\\\"); //.replace(/'/g, "''")
  };

  const onFinish = async () => {
    const dateTimeStrs = combineDateAndTimeStrings();
    const token = await getAccessTokenSilently();
    if (props.talk) {
      TalkService.editTalk(
        props.talk.channel_id,
        props.talk.id,
        escapeSingleQuotes(title),
        escapeSingleQuotes(description),
        dateTimeStrs[0],
        dateTimeStrs[1],
        link == "_mora.stream_tech"
          ? UrlEncryption.encryptIdAndRoleInUrl("livestream", props.talk!.id)
          : validLink(link),
        tags,
        releaseLinkOffset,
        // linkVisibility,
        onRegistration ? "Members only" : "Everybody",
        cardVisibility,
        topics,
        escapeSingleQuotes(talkSpeaker),
        talkSpeakerURL,
        published,
        audienceLevel,
        autoAcceptGroup,
        // autoAcceptCustomInstitutions,
        // customInstitutionsIds,
        false,
        [],
        reminders,
        reminderEmailGroup,
        (talk: Talk) => {
          if (talkToAdvertise !== undefined) {
            setTalkToAdvertise(talk);
          }
          setLoading(false);
          props.onFinishedCallback();
        },
        token
      );
    } else {
      TalkService.scheduleTalk(
        props.channel!.id,
        props.channel!.name,
        escapeSingleQuotes(title),
        escapeSingleQuotes(description),
        dateTimeStrs[0],
        dateTimeStrs[1],
        validLink(link),
        tags,
        releaseLinkOffset,
        // linkVisibility,
        onRegistration ? "Members only" : "Everybody",
        cardVisibility,
        topics.length == 0 ? [] : topics, // Hack
        escapeSingleQuotes(talkSpeaker),
        talkSpeakerURL,
        published,
        audienceLevel,
        autoAcceptGroup,
        // autoAcceptCustomInstitutions,
        // customInstitutionsIds,
        false,
        [],
        reminders,
        reminderEmailGroup,
        (talk: Talk) => {
          setTalkId(talk.id);
          if (talkToAdvertise !== undefined) {
            setTalkToAdvertise(talk);
          }
          setLoading(false);
          onEditStreamingLinkCallback(talk);
          props.onFinishedCallback();
          setTitle("");
          setDescription("");
          setTags([]);
          setDate(new Date().toISOString());
          setStartTime("");
          setEndTime("");
        },
        token
      );
    }
  };

  const onEditStreamingLinkCallback = async (talk: Talk) => {
    // Edits talk URL if user uses mora.stream streaming tech.
    // NOTE: As talk_id not available at creation, we add callback
    if (talk.link == "https://_mora.stream_tech") {
      const token = await getAccessTokenSilently();
      const dateTimeStrs = combineDateAndTimeStrings();
      const encryptedUrl = UrlEncryption.encryptIdAndRoleInUrl(
        "livestream",
        talk.id
      );
      TalkService.editTalk(
        talk.channel_id,
        talk.id,
        escapeSingleQuotes(title),
        escapeSingleQuotes(description),
        dateTimeStrs[0],
        dateTimeStrs[1],
        validLink(encryptedUrl),
        tags,
        releaseLinkOffset,
        linkVisibility,
        cardVisibility,
        topics,
        escapeSingleQuotes(talkSpeaker),
        talkSpeakerURL,
        published,
        audienceLevel,
        autoAcceptGroup,
        // autoAcceptCustomInstitutions,
        // customInstitutionsIds,
        false,
        [],
        reminders,
        reminderEmailGroup,
        (talk: Talk) => {
          if (talkToAdvertise !== undefined) {
            setTalkToAdvertise(talk);
          }
          setLoading(false);
          props.onFinishedCallback();
        },
        token
      );
    }
  };

  const onFinishAdvertisement = async () => {
    const token = await getAccessTokenSilently();
    hideAdvertisementOverlay();
    if (sendEmail && !props.talk && talkId) {
      TalkService.sendEmailonTalkScheduling(talkId, () => {}, token);
    }
    if (sendEmail && props.talk) {
      TalkService.sendEmailonTalkModification(props.talk.id, () => {}, token);
    }
    setSendEmail(false);
    if (props.onCanceledAdvertisementCallback) {
      props.onFinishedAdvertisementCallback();
    }
  };

  const onDeleteClicked = async () => {
    if (!props.talk) {
      return;
    }
    const token = await getAccessTokenSilently();
    TalkService.deleteTalk(
      props.talk.id,
      () => {
        props.onDeletedCallback();
      },
      token
    );
  };

  const onSaveDraft = () => {
    setPublished(0);
    setLoading(true);
    onFinish();
  };

  const selectTag = (tag: Tag) => {
    setTags([...tags, tag]);
  };

  const deselectTag = (tag: Tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const selectTopic = (topic: Topic, num: number, depth: number) => {
    if (topic.id > 0) {
      let tempTopics = topics;
      tempTopics[num] = topic;
      setTopics(tempTopics);
    }
    let tempIsPrevTopics = isPrevTopics;
    if (depth > 2) {
      tempIsPrevTopics[num] = true;
      setIsPrevTopics(tempIsPrevTopics);
    }
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

  const getDateBounds = () => {
    const oneYearAgo = new Date(
      new Date().setFullYear(new Date().getFullYear() - 1)
    );
    const inOneYear = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    );
    const oneYearAgoStr = oneYearAgo.toISOString().slice(0, 10);
    const inOneYearStr = inOneYear.toISOString().slice(0, 10);
    return [oneYearAgoStr, inOneYearStr];
  };

  const isComplete = () => {
    let validDates: boolean = true;
    if (startTime !== "" && endTime !== "") {
      const dateTimeStrs = combineDateAndTimeStrings();
      if (dateTimeStrs[0] > dateTimeStrs[1]) {
        validDates = false;
      }
    }
    return (
      startTime !== "" &&
      endTime !== "" &&
      validDates &&
      title !== "" &&
      description !== "" &&
      link !== "" &&
      topics.length > 0
    );
  };

  const isMissing = () => {
    let res: string[] = [];
    if (startTime === "") {
      res.push("Start time");
    }
    if (endTime === "") {
      res.push("End time");
    }
    if (startTime !== "" && endTime !== "") {
      const dateTimeStrs = combineDateAndTimeStrings();
      if (dateTimeStrs[0] > dateTimeStrs[1]) {
        res.push("End is before start date");
      }
    }
    if (title === "") {
      res.push("Title");
    }
    if (description === "") {
      res.push("Description");
    }
    if (link === "") {
      res.push("Link to talk");
    }
    if (topics.length === 0) {
      res.push("At least 1 topic");
    }
    return res;
  };

  const isInThePast = () => {
    if (props.talk?.date) {
      let now = new Date();
      var talk_date = new Date(props.talk.end_date);
      return talk_date < now;
    } else {
      return false;
    }
  };

  const handleCheckBox = (name: "Everybody" | "Academics" | "None") => {
    setAutoAcceptGroup(name);
  };

  const pushDays = (i: number, n_days: string) => {
    let r = reminders;
    r[i].days = Number(n_days);
    setReminders(r);
  };

  const pushHours = (i: number, n_hours: string) => {
    let r = reminders;
    r[i].hours = Number(n_hours);
    setReminders(r);
  };

  const hideAdvertisementOverlay = () => {
    setShowAdvertisementOverlay(false);
  };

  const isPaying = () => {
    return (
      subscriptionPlans.includes("tier1") || subscriptionPlans.includes("tier2")
    );
  };

  const toggleReminder = (i: number) => {
    if (isPaying()) {
      return () => {
        let r = reminders;
        r[i].exist = !r[i].exist;
        setReminders(r);
      };
    }
  };

  const renderReminder = (j: number) => {
    return (
      <Box direction="row" gap="5px" align="center">
        <Text size="14x" color="grey" margin={{ right: "20px" }}>
          Reminder {j + 1}
        </Text>
        {!reminders[j].exist && (
          <Box
            focusIndicator={false}
            background={isPaying() ? "white" : "#BAD6DB"}
            round="xsmall"
            pad={{ vertical: "2px", horizontal: "xsmall" }}
            onClick={toggleReminder(j)}
            style={{
              width: "60px",
              height: "26px",
              border: "1px solid #C2C2C2",
            }}
            hoverIndicator={true}
            align="center"
          >
            <Text color="grey" size="small">
              + Add
            </Text>
          </Box>
        )}
        {reminders[j].exist && (
          <Box direction="row" gap="6px" align="center" justify="center">
            <input
              value={reminders[j].days}
              onChange={(e) => pushDays(j, e.target.value)}
              style={{
                width: "30px",
                height: "20px",
                padding: "2px",
                border: "1px solid #C2C2C2",
                borderRadius: "5px",
              }}
            />
            <Text size="14px" color="grey" margin={{ right: "15px" }}>
              {" "}
              day(s){" "}
            </Text>
            <input
              value={reminders[j].hours}
              onChange={(e) => pushHours(j, e.target.value)}
              style={{
                width: "30px",
                height: "20px",
                padding: "2px",
                border: "1px solid #C2C2C2",
                borderRadius: "5px",
              }}
            />
            <Text size="14px" color="grey" margin={{ right: "20px" }}>
              {" "}
              hour(s) before{" "}
            </Text>
            <Close size="20px" onClick={toggleReminder(j)} />
          </Box>
        )}
      </Box>
    );
  };

  const toggleReminderEmailGroup = (group: string) => {
    if (isPaying()) {
      if (reminderEmailGroup.includes(group)) {
        setReminderEmailGroup(reminderEmailGroup.filter((e) => e != group));
      } else {
        setReminderEmailGroup([...reminderEmailGroup, group]);
      }
    }
  };

  const toggleModalPricing = () => {
    setShowModalPricing(!showModalPricing);
  };

  const renderArrowButton = (prev: boolean) => {
    let incr = prev ? -1 : 1;
    return (
      <Box
        round="xsmall"
        pad={{ vertical: "4px", horizontal: "4px" }}
        style={{
          width: "36px",
          border: "1px solid #BBBBBB",
        }}
        margin={{ left: prev ? "36px" : "0px", right: prev ? "0px" : "36px" }}
        onClick={() => setActiveSection(activeSection + incr)}
        hoverIndicator="#DDDDDD"
      >
        {prev && <LinkPrevious color="#BBBBBB" size="26px" />}
        {!prev && <LinkNext color="#BBBBBB" size="26px" />}
      </Box>
    );
  };

  return (
    <>
      {props.visible && (
        <Layer
          onEsc={props.onCanceledCallback}
          onClickOutside={props.onCanceledCallback}
          modal
          responsive
          animation="fadeIn"
          style={{
            width: 650,
            maxHeight: "80%",
            borderRadius: 15,
            // border: "3.5px solid black",
            padding: 0,
          }}
        >
          <Box align="center" width="100%">
            <Box
              justify="start"
              width="99.7%"
              background="#eaf1f1"
              direction="row"
              align="center"
              style={{
                minHeight: "50px",
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
              }}
            >
              <Box pad="20px" alignSelf="center">
                <Text
                  size="16px"
                  color="black"
                  weight="bold"
                  margin={{ left: "10px" }}
                >
                  {props.talk ? "Edit talk" : "New talk"}
                </Text>
              </Box>
              {props.talk && (
                <Box
                  width="71%"
                  direction="row"
                  align="center"
                  justify="start"
                  gap="30px"
                >
                  <Box
                    round="xsmall"
                    pad={{ vertical: "4px", horizontal: "4px" }}
                    style={{
                      width: "36px",
                      border: "1px solid #BBBBBB",
                    }}
                    align="center"
                    focusIndicator={false}
                    hoverIndicator="#dddddd"
                    onClick={() => setOnClickDelete(!onClickDelete)}
                  >
                    <Configure size="18px" />
                  </Box>
                  {onClickDelete && (
                    <Box
                      background="#DDDDDD"
                      hoverIndicator="#CCCCCC"
                      justify="center"
                      round="xsmall"
                      align="center"
                      width="90px"
                      height="35px"
                      onClick={onDeleteClicked}
                    >
                      <Text size="13px" weight="bold" color="grey">
                        {" "}
                        Delete talk{" "}
                      </Text>
                    </Box>
                  )}
                </Box>
              )}

              {!props.talk && <Box width="71%" />}
              <Box
                pad="4px"
                style={{
                  height: "36px",
                  width: "36px",
                  border: "1px solid #BBBBBB",
                }}
                justify="center"
                round="xsmall"
                align="center"
                onClick={props.onCanceledCallback}
                hoverIndicator="#DDDDDD"
              >
                <Close color="#BBBBBB" size="26px" />
              </Box>
            </Box>

            <Box
              width="100%"
              align="center"
              pad={{ horizontal: "30px" }}
              gap="5px"
              margin={{ top: "20px", bottom: "20px" }}
              overflow="auto"
            >
              <Box
                direction="row"
                justify="center"
                align="center"
                gap="60px"
                style={{ minHeight: "30px" }}
              >
                <Text weight="bold" color="grey" size="13px">
                  {" "}
                  Information{" "}
                </Text>
                <Text weight="bold" color="grey" size="13px">
                  {" "}
                  Time{" "}
                </Text>
                <Text weight="bold" color="grey" size="13px">
                  {" "}
                  Participants{" "}
                </Text>
                <Text weight="bold" color="grey" size="13px">
                  {" "}
                  Filters{" "}
                </Text>
                <Text weight="bold" color="grey" size="13px">
                  {" "}
                  Reminders{" "}
                </Text>
              </Box>
              <Box
                direction="row"
                align="center"
                margin={{ bottom: "20px" }}
                style={{ minHeight: "30px" }}
              >
                {numbers.map((i: number) => (
                  <>
                    <Box
                      width="32px"
                      height="32px"
                      round="16px"
                      onClick={() => setActiveSection(i)}
                      background={activeSection === i ? "#BAD6DB" : "white"}
                      justify="center"
                      align="center"
                      border={{ color: "#BAD6DB" }}
                      hoverIndicator="#BAD6DB"
                      focusIndicator={false}
                    >
                      <Text color="black" size="14px">
                        {" "}
                        {i}{" "}
                      </Text>
                    </Box>
                    {i !== numbers[numbers.length - 1] && (
                      <hr
                        style={{
                          width: "80px",
                          height: "0.1px",
                          backgroundColor: "black",
                          borderColor: "black",
                        }}
                      />
                    )}
                  </>
                ))}
              </Box>

              {activeSection === 1 && (
                <Box
                  direction="column"
                  width="70%"
                  gap="10px"
                  margin={{ bottom: "10px" }}
                  style={{ minHeight: "350px" }}
                >
                  <Box width="100%">
                    <TextInput
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Box>
                  <Box direction="row" gap="10px">
                    <Box width="50%">
                      <TextInput
                        placeholder="Speaker name"
                        value={talkSpeaker}
                        onChange={(e) => setTalkSpeaker(e.target.value)}
                      />
                    </Box>
                    <Box width="50%">
                      <TextInput
                        placeholder="Speaker homepage"
                        value={talkSpeakerURL}
                        onChange={(e) => setTalkSpeakerURL(e.target.value)}
                      />
                    </Box>
                  </Box>

                  <Box width="100%" gap="5px" margin={{ top: "15px" }}>
                    <Box direction="row" gap="small">
                      <Box margin={{ right: "70px" }}>
                        <Text size="14px" weight="bold" color="black">
                          Description
                          <StatusInfo
                            size="small"
                            data-tip
                            data-for="description_latex_info"
                          />
                          <ReactTooltip
                            id="description_latex_info"
                            place="right"
                            effect="solid"
                          >
                            <InlineMath math={"{\\small \\LaTeX}"} /> supported
                            (e.g. $\log(a)+\log(b)=\log(ab)$).
                          </ReactTooltip>
                        </Text>
                      </Box>
                      <Switch
                        height={15}
                        checked={latex}
                        callback={(checked: boolean) => {
                          setLatex(checked);
                        }}
                        width={30}
                      />
                      Preview <InlineMath math={"{\\small \\LaTeX}"} />
                    </Box>

                    {!latex && (
                      <TextArea
                        style={{ height: "210px" }}
                        value={description}
                        placeholder=""
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    )}
                    {latex && (
                      <Box height="210px" overflow="auto">
                        {description
                          .split("\n")
                          .map((item, i) => textToLatex(item))}
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
              {activeSection === 2 && (
                <Box
                  direction="column"
                  width="55%"
                  gap="10px"
                  margin={{ bottom: "10px" }}
                  style={{ minHeight: "350px" }}
                >
                  <Calendar
                    date={date}
                    bounds={getDateBounds()}
                    size="small"
                    onSelect={(date: any) => {
                      setDate(date);
                    }}
                    daysOfWeek
                    style={{ width: "100%" }}
                  />
                  <Box direction="row" gap="medium" margin={{ top: "medium" }}>
                    <Box direction="column" width="100%" gap="5px">
                      <Text size="14px" weight="bold" color="black">
                        Start
                      </Text>
                      <MaskedInput
                        mask={[
                          {
                            length: 2,
                            regexp: /^[01][0-9]$|^2[0-3]|^[0-9]$/,
                            placeholder: "hh",
                          },
                          { fixed: ":" },
                          {
                            length: 2,
                            regexp: /^[0-5][0-9]$|^[0-5]$/,
                            placeholder: "mm",
                          },
                        ]}
                        value={startTime}
                        onChange={(event: any) => {
                          setStartTime(event.target.value);
                        }}
                      />
                    </Box>
                    <Box direction="column" width="100%" gap="5px">
                      <Text size="14px" weight="bold" color="black">
                        Finish
                      </Text>
                      <MaskedInput
                        mask={[
                          {
                            length: 2,
                            regexp: /^[01][0-9]$|^2[0-3]|^[0-9]$/,
                            placeholder: "hh",
                          },
                          { fixed: ":" },
                          {
                            length: 2,
                            regexp: /^[0-5][0-9]$|^[0-5]$/,
                            placeholder: "mm",
                          },
                        ]}
                        value={endTime}
                        onChange={(event: any) => {
                          setEndTime(event.target.value);
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}

              {activeSection === 3 && (
                <Box
                  direction="column"
                  width="70%"
                  gap="10px"
                  margin={{ bottom: "10px" }}
                  style={{ minHeight: "350px" }}
                >
                  <Box direction="row" gap="5px">
                    <Text size="13px" weight="bold">
                      {" "}
                      Link to event{" "}
                    </Text>
                    <StatusInfo
                      size="small"
                      data-tip
                      data-for="link_to_talk_info"
                    />
                    <ReactTooltip
                      id="link_to_talk_info"
                      place="right"
                      effect="solid"
                    >
                      <p> Zoom, Teams, Hangout, etc.</p>
                    </ReactTooltip>
                  </Box>

                  {link !== "_mora.stream_tech" && (
                    <TextInput
                      value={link}
                      placeholder="https://zoom.us/1234"
                      onChange={(e) => setLink(e.target.value)}
                    />
                  )}
                  {link === "_mora.stream_tech" && (
                    <Box
                      height="40px"
                      round="3px"
                      pad="small"
                      justify="center"
                      style={{ border: "1px solid #BBBBBB" }}
                    >
                      <Text size="13px" weight="bold" color="#CCCCCC">
                        The link will be sent to you via email.
                      </Text>
                    </Box>
                  )}

                  <Box
                    background={
                      subscriptionPlans.includes("tier2") ? "white" : "#BAD6DB"
                    }
                    pad="15px"
                    round="6px"
                    gap="10px"
                  >
                    {!subscriptionPlans.includes("tier2") && (
                      <Text
                        size="14px"
                        color="black"
                        style={{ fontStyle: "italic" }}
                        margin={{ bottom: "10px" }}
                      >
                        Unlock our streaming technology sculpted for academic
                        seminars
                      </Text>
                    )}
                    <Box direction="row" gap="45px">
                      <CheckBox
                        checked={link == "_mora.stream_tech"}
                        label={`${
                          link == "_mora.stream_tech" ? "Hosting" : "Host"
                        } on mora.stream`}
                        onChange={(e) => {
                          if (subscriptionPlans.includes("tier2")) {
                            setLink(
                              e.target.checked ? "_mora.stream_tech" : ""
                            );
                          }
                        }}
                      />
                      {!subscriptionPlans.includes("tier2") && (
                        <Box
                          onClick={toggleModalPricing}
                          background="#D3F930"
                          hoverIndicator="#7BA59E"
                          round="xsmall"
                          pad="xsmall"
                          width="160px"
                          height="40px"
                          justify="center"
                          align="center"
                          focusIndicator={false}
                        >
                          <Text size="14px" weight="bold">
                            {" "}
                            Unlock streaming{" "}
                          </Text>
                        </Box>
                      )}
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
                            channelId={
                              props.channel
                                ? props.channel.id
                                : props.channelId
                                ? props.channelId
                                : null
                            }
                            showDemo={false}
                            headerTitle={false}
                          />
                        </Layer>
                      )}
                    </Box>
                  </Box>

                  <Box
                    direction="row"
                    gap="10px"
                    align="center"
                    margin={{ top: "30px", bottom: "10px" }}
                  >
                    <Text size="13px" weight="bold">
                      {" "}
                      Registration required?{" "}
                    </Text>
                    <Switch
                      width={60}
                      height={24}
                      checked={onRegistration}
                      textOn="Yes"
                      textOff="No"
                      callback={(checked: boolean) => {
                        setOnRegistration(checked);
                        setAutoAcceptGroup("None");
                        // close sub-switch
                        if (!checked) {
                          setAutoAcceptEnabled(checked);
                        }
                      }}
                    />
                  </Box>

                  {onRegistration && (
                    <Box margin={{ bottom: "20px" }} gap="15px">
                      <Box
                        direction="row"
                        gap="small"
                        margin={{ bottom: "0px" }}
                        align="center"
                      >
                        <Text size="13px" weight="bold">
                          Automatically accept some users?
                        </Text>
                        <Switch
                          width={60}
                          height={24}
                          checked={autoAcceptEnabled}
                          textOn="Yes"
                          textOff="No"
                          callback={(checked: boolean) => {
                            setAutoAcceptEnabled(checked);
                            if (!checked) {
                              setAutoAcceptGroup("None");
                            }
                          }}
                        />
                        <StatusInfo
                          style={{ marginTop: "3px" }}
                          size="small"
                          data-tip={auto_accept}
                          data-for="automatic-registration"
                        />
                        <ReactTooltip
                          id="automatic-registration"
                          place="right"
                          effect="solid"
                          html={true}
                        />
                      </Box>

                      {autoAcceptEnabled && (
                        <>
                          <CheckBox
                            name="feature"
                            label="Everyone"
                            checked={autoAcceptGroup == "Everybody"}
                            onChange={() => handleCheckBox("Everybody")}
                          />
                          <CheckBox
                            name="bug"
                            label="Verified academics"
                            checked={autoAcceptGroup == "Academics"}
                            onChange={() => handleCheckBox("Academics")}
                          />
                          <Text size="13px" margin={{ top: "20px" }}>
                            <i>
                              Everybody else will need to be manually approved.
                            </i>
                          </Text>

                          {/* NOTE: Later, people will be able to pick institutions from list. 
                
                <Box direction="row" gap="0px"> 
                  <CheckBox
                    id="checkbox-domains"
                    name="bug"
                    label="Only emails ending by: "
                    checked={autoAcceptGroup == "domains"}
                    onChange={() => handleCheckBox("domains")}
                  />
                  <StatusInfo style={{marginTop: "14px", marginRight: "10px"}} size="small" data-tip={domains_list} data-for='domains_list'/>
                  <ReactTooltip id='domains_list' place="bottom" effect="solid" html={true} />
                  <TextInput
                    placeholder="List of domains"
                    value={acceptedDomains.join(',')}
                    onChange={(e: any) => e ? parseList(e) : ""}
                    style={{width: "200px"}}
                  />
                </Box> */}
                          {/* <CheckBox
                  name="bug"
                  label="Manually accept participants"
                  checked={autoAcceptGroup == "None"}
                  onChange={() => handleCheckBox("None")}
                /> */}
                        </>
                      )}
                    </Box>
                  )}
                  {!onRegistration && (
                    <Text size="13px">
                      {" "}
                      Your event is public, and the link to your talk will be
                      shown on mora.stream 15 minutes before the start.{" "}
                    </Text>
                  )}
                </Box>
              )}

              {activeSection === 4 && (
                <Box
                  direction="column"
                  width="70%"
                  gap="10px"
                  margin={{ bottom: "10px" }}
                  style={{ minHeight: "350px" }}
                >
                  <Text size="13px" weight="bold" color="black">
                    Topics
                  </Text>
                  <TopicSelector
                    onSelectedCallback={selectTopic}
                    onCanceledCallback={cancelTopic}
                    isPrevTopics={isPrevTopics}
                    prevTopics={topics} // {props.talk ? props.talk.topics : []}
                    size="small"
                  />

                  <Text size="13px" weight="bold" color="black">
                    Target audience
                  </Text>
                  <Select
                    dropAlign={{ bottom: "top" }}
                    focusIndicator={false}
                    id="link-visibility-select"
                    options={["General audience", "Bachelor/Master", "PhD+"]}
                    value={audienceLevel}
                    onChange={({ option }) => setAudienceLevel(option)}
                  />
                </Box>
              )}

              {activeSection === 5 && (
                <Box
                  width="75%"
                  margin={{ bottom: "10px" }}
                  style={{ minHeight: "350px" }}
                  align="start"
                >
                  <Box
                    direction="column"
                    gap="10px"
                    background={isPaying() ? "white" : "#BAD6DB"}
                    pad="25px"
                    round="6px"
                  >
                    {!isPaying() && (
                      <Text
                        size="14px"
                        color="black"
                        style={{ fontStyle: "italic" }}
                        margin={{ bottom: "20px" }}
                      >
                        Feature not available under your current plan. Unlock it
                        below
                      </Text>
                    )}
                    <Text
                      size="13px"
                      weight="bold"
                      color="black"
                      margin={{ bottom: "6px" }}
                    >
                      Email reminders
                    </Text>
                    {renderReminder(0)}
                    {renderReminder(1)}

                    <Text
                      size="13px"
                      weight="bold"
                      color="black"
                      margin={{ top: "24px" }}
                    >
                      To whom?
                    </Text>
                    <CheckBox
                      label="Talk participants"
                      checked={reminderEmailGroup.includes("Participants")}
                      onChange={() => toggleReminderEmailGroup("Participants")}
                    />
                    <Box direction="row" gap="10px" margin={{ bottom: "10px" }}>
                      <CheckBox
                        label="Your mailing list"
                        checked={reminderEmailGroup.includes("MailingList")}
                        onChange={() => toggleReminderEmailGroup("MailingList")}
                      />
                      <StatusInfo
                        size="small"
                        data-tip
                        data-for="mailing-list-reminder"
                      />
                      <ReactTooltip
                        id="mailing-list-reminder"
                        place="right"
                        effect="solid"
                      >
                        <Text size="12px">
                          {" "}
                          Securely upload your mailing list in the tab 'Mailing
                          List' in your agora.{" "}
                        </Text>
                      </ReactTooltip>
                    </Box>
                    {/* <CheckBox
              label="Your followers"
              checked={reminderEmailGroup.includes("Followers")}
              onChange={() => toggleReminderEmailGroup("Followers")}
            /> */}

                    <Box margin={{ top: "20px" }} gap="15px">
                      {!isPaying() && (
                        <Box
                          onClick={toggleModalPricing}
                          background="#D3F930"
                          hoverIndicator="#7BA59E"
                          round="xsmall"
                          pad="xsmall"
                          width="200px"
                          height="40px"
                          justify="center"
                          align="center"
                          focusIndicator={false}
                        >
                          <Text size="14px" weight="bold">
                            {" "}
                            Unlock email reminders{" "}
                          </Text>
                        </Box>
                      )}
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
                            channelId={
                              props.channel
                                ? props.channel.id
                                : props.channelId
                                ? props.channelId
                                : null
                            }
                            showDemo={false}
                            headerTitle={false}
                          />
                        </Layer>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            <Box
              direction="row"
              justify="start"
              align="center"
              gap="xsmall"
              width="99.7%"
              background="#eaf1f1"
              style={{
                minHeight: "60px",
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
              }}
            >
              {activeSection === 1 && (
                <>
                  <Box width="90%" />
                  {renderArrowButton(false)}
                </>
              )}

              {activeSection > 1 && activeSection < 5 && (
                <>
                  {renderArrowButton(true)}
                  <Box width="80%" />
                  {renderArrowButton(false)}
                </>
              )}

              {activeSection === 5 && (
                <>
                  {renderArrowButton(true)}
                  <Box width="50%" />
                  <Box
                    width="140px"
                    height="35px"
                    align="center"
                    justify="center"
                    round="xsmall"
                    background="#BAD6DB"
                    hoverIndicator="#6DA3C7"
                    onClick={onSaveDraft}
                  >
                    <Text size="14px" weight="bold">
                      {" "}
                      Save as draft{" "}
                    </Text>
                  </Box>
                  <Box
                    data-tip
                    data-for="submitbutton"
                    margin={{ left: "24px", right: "32px" }}
                  >
                    <Button
                      fill={isComplete() ? "#025377" : "#CCCCCC"}
                      disabled={!isComplete()}
                      height="35px"
                      width="140px"
                      text="Publish"
                      textColor="white"
                      onClick={onFinishClicked}
                      hoverIndicator="#6DA3C7"
                      onMouseEnter={isMissing}
                    />
                    {!isComplete() && isMissing() && (
                      <ReactTooltip
                        id="submitbutton"
                        place="top"
                        effect="solid"
                      >
                        The following fields are missing
                        {isMissing().map((item, index) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ReactTooltip>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Layer>
      )}

      {/* <Box direction="row"> 
        <Box 
          direction="column" 
          width="33%"
          margin={{right: "12px"}}
        > 
          <OverlaySection> 
            <Box width="100%" gap="5px">
              <TextInput
                placeholder="Title"
                value={title}
                onChange={(e) => setState({ title: e.target.value })}
              />
            </Box>
            <Box width="100%" gap="5px">
              <TextInput
                placeholder="Speaker name"
                value={talkSpeaker}
                onChange={(e) => setState({ talkSpeaker: e.target.value })}
              />
            </Box>
            <Box width="100%" gap="5px">
              <TextInput
                placeholder="Speaker homepage"
                value={talkSpeakerURL}
                onChange={(e) => setState({ talkSpeakerURL: e.target.value })}
              />
            </Box>
            <Box width="100%" gap="5px" margin={{top: "15px"}}>
              <Box direction="row" gap="small">
                <Box margin={{"right": "70px"}}>
                  <Text size="14px" weight="bold" color="black">
                    Description
                    <StatusInfo size="small" data-tip data-for='description_latex_info'/>
                      <ReactTooltip id='description_latex_info' place="right" effect="solid">
                      <InlineMath math={"{\\small \\LaTeX}"} /> supported (e.g. $\log(a)+\log(b)=\log(ab)$).
                      </ReactTooltip>
                  </Text>
                </Box>
                <Switch
                  checked={latex}
                  onChange={(checked: boolean) => {
                    setState({ latex: checked });
                  }}
                  size="small"
                />
                Preview <InlineMath math={"{\\small \\LaTeX}"} />
              </Box>
              {!latex && (
                <TextArea
                  style={{height: "240px"}}
                  value={description}
                  placeholder=""
                  onChange={(e) => setState({ description: e.target.value })}
                />
              )}
              {latex && (
                description.split('\n').map(
                  (item, i) => textToLatex(item)
                )
              )}
            </Box>
            <Box width="100%" gap="5px">
              <Text size="14px" weight="bold" color="black">
                  Target audience
                </Text>
            <Select
                    dropAlign={{ bottom: "top" }}
                    focusIndicator={false}
                    id="link-visibility-select"
                    options={["General audience", "Bachelor/Master", "PhD+"]}
                    value={audienceLevel}
                    onChange={({ option }) =>
                      setState({ audienceLevel: option })
                    }
                  />
            </Box>
          </OverlaySection>
          
        </Box>
        <Box width="66%" direction="column">
          <Box width="100%" direction="row">
            <Box 
              direction="column" 
              width="50%"
              margin={{left: "large", right: "xsmall"}}
            > 
              <OverlaySection> 
                <Calendar
                  date={date}
                  bounds={getDateBounds()}
                  size="small"
                  onSelect={(date: any) => {
                    setState({ date });
                  }}
                  daysOfWeek
                  style={{ width: "100%" }}
                />
                <Box direction="row" gap="medium" margin={{top: "medium"}}>
                  <Box direction="column" width="100%" gap="5px">
                    <Text size="14px" weight="bold" color="black">
                      Start
                    </Text>
                    <MaskedInput
                      mask={[
                        {
                          length: 2,
                          regexp: /^[01][0-9]$|^2[0-3]|^[0-9]$/,
                          placeholder: "hh",
                        },
                        { fixed: ":" },
                        {
                          length: 2,
                          regexp: /^[0-5][0-9]$|^[0-5]$/,
                          placeholder: "mm",
                        },
                      ]}
                      value={startTime}
                      onChange={(event: any) => {
                        setState({ startTime: event.target.value });
                      }}
                    />
                  </Box>
                  <Box direction="column" width="100%" gap="5px">
                    <Text size="14px" weight="bold" color="black">
                      Finish
                    </Text>
                    <MaskedInput
                      mask={[
                        {
                          length: 2,
                          regexp: /^[01][0-9]$|^2[0-3]|^[0-9]$/,
                          placeholder: "hh",
                        },
                        { fixed: ":" },
                        {
                          length: 2,
                          regexp: /^[0-5][0-9]$|^[0-5]$/,
                          placeholder: "mm",
                        },
                      ]}
                      value={endTime}
                      onChange={(event: any) => {
                        setState({ endTime: event.target.value });
                      }}
                    />
                  </Box>
                </Box>
              </OverlaySection>
            </Box>
            <Box 
              direction="column" 
              width="50%"
              margin={{left: "large", right: "xsmall", top:"6px", bottom: "10px"}}
            > 
              <OverlaySection heading="Link to event">
              <TextInput
                  value={link}
                  placeholder="https://zoom.us/1234"
                  onChange={(e) => setState({ link: e.target.value })}
                />
              <CheckBox 
                checked={link == '_mora.stream_tech'} 
                label={`${link == '_mora.stream_tech'?"Hosting":"Host"} on mora.stream`} 
              onChange={(e) => setState({ link: e.target.checked ?'_mora.stream_tech':'' })}/> 

                <Text
                  size="14px" 
                  weight="bold" 
                  color="grey" 
                  alignSelf="start"
                  margin={{top: "10px", bottom: "10px"}}
                >
                  No need to put a password, link visibility is handled below. 
                  <StatusInfo size="small" data-tip data-for='link_to_talk_info'/>
                    <ReactTooltip id='link_to_talk_info' place="right" effect="solid">
                     <p>Your selected audience will be able to see the link 30 minutes before the start of your event.</p>
                    </ReactTooltip>
                </Text>
              </OverlaySection>
              <OverlaySection heading="Access and visibility">
                <Box width="100%" gap="5px" margin={{top: "10px"}}>
                  <Box direction="row" gap="small">
                    <Text size="14px" weight="bold" color="black">
                      URL visible without registration by...
                    </Text>
                    <StatusInfo size="small" data-tip data-for='linkinfo'/>
                    <ReactTooltip id='linkinfo' place="right" effect="solid">
                      Decide who does not need to manually fill the registration request form to attend the talk. The same people will also automatically have access to the recording if there is one.
                    </ReactTooltip>
                  </Box>
                  <Select
                    dropAlign={{ bottom: "top" }}
                    focusIndicator={false}
                    id="link-visibility-select"
                    // options={["Everybody", "Followers and members", "Members only"]} // NOTE: WE STOPPED USING FOLLOWERS ATM
                    options={["Everybody", "Members only"]}
                    value={linkVisibility}
                    onChange={({ option }) =>
                      setState({ linkVisibility: option })
                    }
                  />
                </Box>
            <Box width="100%" gap="5px" margin={{top: "5px"}}>
              <Box direction="row" gap="small">
                <Text size="14px" weight="bold" color="black">
                  Talk card visible by...
                </Text>
                <StatusInfo size="small" data-tip data-for='talkcardinfo'/>
                <ReactTooltip id='talkcardinfo' place="right" effect="solid">
                  Decide who is able to see the talk information. It will be hidden to everyone else.
                </ReactTooltip>
              </Box>
              <Select
                dropAlign={{ bottom: "top" }}
                focusIndicator={false}
                id="card-visibility-select"
                // options={["Everybody", "Followers and members", "Members only"]} // NOTE: WE STOPPED USING FOLLOWERS ATM
                options={["Everybody", "Members only"]}
                value={cardVisibility}
                onChange={({ option }) =>
                  setState({ cardVisibility: option })
                }
              />
            </Box>
              </OverlaySection>
            </Box>
          </Box>
          <Box 
            // width="100%" 
            direction="row" 
            margin={{top: "5px", left: "47px"}}
          >
            <OverlaySection heading="Topics">
              <TopicSelector 
                onSelectedCallback={selectTopic}
                onCanceledCallback={cancelTopic}
                isPrevTopics={isPrevTopics}
                prevTopics={props.talk ? props.talk.topics : []} 
                size="medium" 
              />
            </OverlaySection>  
          </Box>
        </Box>
      </Box> */}
      {/* NOTE: This is the selector to set release time of the link.
                <Box width="100%" gap="5px" margin={{top: "13px"}}>
                  <Box width="100%" gap="5px" margin={{top: "10px"}}>
                  <Box direction="row" gap="small"> */}
      {/* <StatusInfo size="small" data-tip data-for='linkinfo'/>
                    <ReactTooltip id='linkinfo' place="right" effect="solid">
                      Decide who has access to the link. The same people will also have access to the recording if there is one.
                    </ReactTooltip> */}
      {/* </Box>
                </Box>
                  <Select
                    dropAlign={{ bottom: "top" }}
                    focusIndicator={false}
                    id="link-release-select"
                    options={makeLinkDateOptions()}
                    labelKey="label"
                    value={makeLinkDateOption(releaseLinkOffset)}
                    valueLabel={
                      <Text
                        weight="bold"
                        margin={{ horizontal: "small", vertical: "10px" }}
                      >
                        {makeLinkDateOption(releaseLinkOffset).label}
                      </Text>
                    }
                    onChange={({ option }) => {
                      console.log("OPTION: ", option);
                      setState({ releaseLinkOffset: option.value });
                    }}
                  />
                </Box> */}
      {/*<OverlaySection heading="Add a few relevant tags">
            <TagSelector
              selected={props.talk?.tags}
              onSelectedCallback={selectTag}
              onDeselectedCallback={deselectTag}
              width="100%"
              height="200px"
            />
              </OverlaySection>*/}
      {/* PLACEHOLDER 
                FOR A MULTI BOX TICKER 
                TWO OPTIONS: ONE FOR "LINK WILL BE SHARED LATER" AND OTHER "URL LINK FOR TALK"
                Remy
                */}

      {/* <CheckBox
                  checked={linkAvailable}
                  label="interested?"
                  onChange={(event) => setState({linkAvailable: !(linkAvailable)})}
                /> */}

      {
        /* Overlay when creating a new talk */
        talkToAdvertise !== null && !isInThePast() && !props.talk && (
          <Overlay
            width={450}
            height={330}
            visible={showAdvertisementOverlay}
            title={"Your event was successfully published"}
            submitButtonText="Ok"
            onSubmitClick={onFinishAdvertisement}
            contentHeight="180px"
            canProceed={true}
            onCancelClick={hideAdvertisementOverlay}
            // onClickOutside={hideAdvertisementOverlay}
            onEsc={hideAdvertisementOverlay}
          >
            <Box margin={{ top: "10px", bottom: "20px" }}>
              <CheckBox
                label="Check the box to send an email to your agora members about the incoming event"
                onChange={() => setSendEmail(!sendEmail)}
              />
            </Box>

            <ShareButtons
              talk={talkToAdvertise}
              channel={props.channel}
              useReducedHorizontalVersion={true}
              width="180px"
            />
          </Overlay>
        )
      }
      {
        /* Overlay when editing an existing talk */
        talkToAdvertise !== null && !isInThePast() && props.talk && (
          <Overlay
            width={450}
            height={330}
            visible={showAdvertisementOverlay}
            title={"Your event was successfully modified"}
            submitButtonText="Ok"
            onSubmitClick={onFinishAdvertisement}
            contentHeight="180px"
            canProceed={true}
            onCancelClick={hideAdvertisementOverlay}
            // onClickOutside={hideAdvertisementOverlay}
            onEsc={hideAdvertisementOverlay}
          >
            <Box margin={{ top: "10px", bottom: "20px" }}>
              <CheckBox
                label="Check the box to send an email to your agora members about the changes to your event"
                onChange={() => setSendEmail(!sendEmail)}
              />
            </Box>

            <ShareButtons
              talk={talkToAdvertise}
              channel={props.channel}
              useReducedHorizontalVersion={true}
              width="180px"
            />
          </Overlay>
        )
      }
    </>
  );
};
