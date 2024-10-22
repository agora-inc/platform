import React, { Component } from "react";
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
import TagSelector from "../Core/TagSelector";
import TopicSelector from "../Talks/TopicSelector";
import { Topic } from "../../Services/TopicService";
import "../../Styles/edit-talk-modal.css";
import { textToLatex } from "../Core/LatexRendering";
import Switch from "../Core/Switch";
import { InlineMath } from "react-katex";
import { StatusInfo, Close, LinkNext, LinkPrevious, Configure} from "grommet-icons";
import ReactTooltip from "react-tooltip";
import ShareButtons from "../Core/ShareButtons";
import PricingPlans from "../../Views/PricingPlans";
import { UrlEncryption } from "../Core/Encryption/UrlEncryption";
import { thisExpression } from "@babel/types";


export type Reminder = {
  exist: boolean;
  days: number;
  hours: number; 
}

interface Props {
  channel: Channel | null;
  channelId?: number;
  user?: User | null;
  visible: boolean;
  onFinishedCallback: any;
  onCanceledCallback: any;
  onDeletedCallback?: any;
  talk?: Talk;
  onFinishedAdvertisementCallback?: any;
  onCanceledAdvertisementCallback?: any;
}

interface State {
  title: string;
  description: string;
  tags: Tag[];
  loading: boolean;
  date: string;
  startTime: string;
  endTime: string;
  linkAvailable: boolean | undefined;
  link: string;
  releaseLinkOffset: number;
  linkVisibility: string;
  cardVisibility: string;
  topics: Topic[];
  talkSpeaker: string;
  talkSpeakerURL: string;
  latex: boolean;
  published: number,
  showCardVisibilityInfo: boolean,
  isPrevTopics: boolean[];
  audienceLevel: string;
  showAdvertisementOverlay: boolean;
  talkToAdvertise: Talk | null,
  sendEmail: boolean;
  talkId: number | null;
  activeSection: number;
  onRegistration: boolean;
  onClickDelete: boolean;

  // reminders  
  reminders: Reminder[];
  reminderEmailGroup: string[];
  
  // automatic acceptance
  autoAcceptEnabled: boolean,
  autoAcceptGroup: "Everybody" | "Academics" | "None";
  autoAcceptCustomInstitutions: boolean, 

  showModalPricing: boolean,
  allPlansId: number[];
  subscriptionPlans: string[];
  
  // acceptedDomains: string[];
  //(below will be added when we will allow addition of extra institutions)
  // autoAcceptVerifiedAcademics: boolean, 
  // customInstitutionsIds: number | number[]
}

export default class EditTalkModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      title: this.props.talk ? this.props.talk.name : "",
      description: this.props.talk ? this.props.talk.description.replace("''", "'") : "", //replace is escapeDoubleQuotes
      tags: this.props.talk ? this.props.talk.tags : [],
      loading: false,
      date: this.props.talk
        ? new Date(this.props.talk.date).toISOString()
        : new Date().toISOString(),
      startTime: this.props.talk
        ? new Date(this.props.talk.date).toTimeString().slice(0, 5)
        : "",
      endTime: this.props.talk
        ? new Date(this.props.talk.end_date).toTimeString().slice(0, 5)
        : "",
      link: this.props.talk ? this.props.talk.link : "",
      linkAvailable: this.props.talk ? this.props.talk.link_available : false,
      releaseLinkOffset: this.props.talk ? this.props.talk.show_link_offset : 15,
      linkVisibility: this.props.talk
        ? this.props.talk.visibility
        : "Everybody",
      cardVisibility: this.props.talk
        ? this.props.talk.card_visibility
        : "Everybody",
      topics: this.props.talk ? this.props.talk.topics : [],
      talkSpeaker: this.props.talk ? this.props.talk.talk_speaker : "",
      talkSpeakerURL: this.props.talk ? this.props.talk.talk_speaker_url : "",
      latex: false,
      published: this.props.talk ? this.props.talk.published : 0,
      showCardVisibilityInfo: false,
      isPrevTopics: this.props.talk ? this.topicExists(this.props.talk.topics) : [false, false, false],
      audienceLevel: this.props.talk?.audience_level || "General audience",
      showAdvertisementOverlay: false,
      talkToAdvertise: this.props.talk ? this.props.talk : null,
      sendEmail: false,
      talkId: null,
      activeSection: 1,
      onRegistration: false,
      onClickDelete: false,

      // email reminders
      reminders: [
        {exist: false, days: 0, hours: 0},
        {exist: false, days: 0, hours: 0}
      ],
      reminderEmailGroup: [],
      // automatic acceptance
      autoAcceptEnabled: false,
      autoAcceptGroup: "Everybody",
      autoAcceptCustomInstitutions: false,

      showModalPricing: false, 
      allPlansId: [],
      subscriptionPlans: [],
    };
    this.getReminders();
    this.getChannelSubscriptions();
  }

  getReminders = () => {
    if (this.props.talk) {
      TalkService.getReminderTime(
        this.props.talk.id, 
        (reminders: Reminder[]) => {
          this.setState({ reminders })
        }
      )
      TalkService.getReminderGroup(
        this.props.talk.id, 
        (reminderEmailGroup: string[]) => {
          this.setState({ reminderEmailGroup })
        }
      )
    }
  }

  getChannelSubscriptions = () => {
    if (this.props.channel || this.props.channelId) {
      let id = this.props.channel 
        ? this.props.channel.id 
        : (this.props.channelId ? this.props.channelId : -1)

      ChannelSubscriptionService.getAllActiveSubscriptionsForChannel(
        id, 
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

  onFinishClicked = () => {
    this.setState(
      {
        published: 1,
        loading: true,
        showAdvertisementOverlay: true
      },
      () => {
        this.onFinish();
      }
    );
  };

  combineDateAndTimeStrings = () => {
    const startDate = new Date(
      `${this.state.date.slice(0, 10)} ${this.state.startTime}`
    )
      .toISOString()
      .slice(0, 16)
      .replace("T", " ");
    const endDate = new Date(
      `${this.state.date.slice(0, 10)} ${this.state.endTime}`
    )
      .toISOString()
      .slice(0, 16)
      .replace("T", " ");
    return [startDate, endDate];
  };

  makeLinkDateOption = (offset: number) => {
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

  makeLinkDateOptions = () => {
    const offsets = [0, 15, 60, 1440];
    return offsets.map(this.makeLinkDateOption);
  };

  validLink = (link: string) => {
    if (link.startsWith('https://') || link.startsWith('http://')) {
      return link
    } else {
      return 'https://'.concat(link)
    }
  }

  escapeSingleQuotes = (text: string) => {
    // We want to store backslash with \\
    // We want to store apostrophe '
    return text.replace(/"/g, "'").replace(/\\/g, "\\\\") //.replace(/'/g, "''")
  }

  onFinish = () => {
    const dateTimeStrs = this.combineDateAndTimeStrings();
    if (this.props.talk) {
      TalkService.editTalk(
        this.props.talk.channel_id,
        this.props.talk.id,
        this.escapeSingleQuotes(this.state.title),
        this.escapeSingleQuotes(this.state.description),
        dateTimeStrs[0],
        dateTimeStrs[1],
        (this.state.link == '_mora.stream_tech') ? UrlEncryption.encryptIdAndRoleInUrl("livestream", this.props.talk!.id) : this.validLink(this.state.link),
        this.state.tags,
        this.state.releaseLinkOffset,
        // this.state.linkVisibility,
        this.state.onRegistration ? "Members only" : "Everybody",
        this.state.cardVisibility,
        this.state.topics,
        this.escapeSingleQuotes(this.state.talkSpeaker),
        this.state.talkSpeakerURL,
        this.state.published,
        this.state.audienceLevel,
        this.state.autoAcceptGroup,
        // this.state.autoAcceptCustomInstitutions,
        // this.state.customInstitutionsIds,
        false, 
        [],
        this.state.reminders,
        this.state.reminderEmailGroup, 
        (talk: Talk) => {
          if (this.state.talkToAdvertise !== undefined){
            this.setState({
              talkToAdvertise: talk
            }
            )
          }
          this.setState(
            {
              loading: false,
            },
            () => {
              this.props.onFinishedCallback();
            }
          );
        }
      );
    } else {
      TalkService.scheduleTalk(
        this.props.channel!.id,
        this.props.channel!.name,
        this.escapeSingleQuotes(this.state.title),
        this.escapeSingleQuotes(this.state.description),
        dateTimeStrs[0],
        dateTimeStrs[1],
        this.validLink(this.state.link),
        this.state.tags,
        this.state.releaseLinkOffset,
        // this.state.linkVisibility,
        this.state.onRegistration ? "Members only" : "Everybody",
        this.state.cardVisibility,
        this.state.topics.length == 0 ? [] : this.state.topics, // Hack
        this.escapeSingleQuotes(this.state.talkSpeaker),
        this.state.talkSpeakerURL,
        this.state.published,
        this.state.audienceLevel,
        this.state.autoAcceptGroup,
        // this.state.autoAcceptCustomInstitutions,
        // this.state.customInstitutionsIds,
        false, 
        [],
        this.state.reminders,
        this.state.reminderEmailGroup, 
        (talk: Talk) => {
          this.setState({ talkId: talk.id })
          if (this.state.talkToAdvertise !== undefined){
            this.setState({
              talkToAdvertise: talk
            }
            )
          }
          this.setState(
            {
              loading: false,
            },
            () => {
              this.onEditStreamingLinkCallback(talk);
              this.props.onFinishedCallback();
              this.setState({
                title: "",
                description: "",
                tags: [],
                date: new Date().toISOString(),
                startTime: "",
                endTime: "",
              });
            }
          );
        }
      );
    }
  };

  onEditStreamingLinkCallback = (talk: Talk) => {
    // Edits talk URL if user uses mora.stream streaming tech.
    // NOTE: As talk_id not available at creation, we add callback
    if (talk.link == 'https://_mora.stream_tech'){
      const dateTimeStrs = this.combineDateAndTimeStrings();
      var encryptedUrl = UrlEncryption.encryptIdAndRoleInUrl("livestream", talk.id)
      TalkService.editTalk(
        talk.channel_id,
        talk.id,
        this.escapeSingleQuotes(this.state.title),
        this.escapeSingleQuotes(this.state.description),
        dateTimeStrs[0],
        dateTimeStrs[1],
        this.validLink(encryptedUrl),
        this.state.tags,
        this.state.releaseLinkOffset,
        this.state.linkVisibility,
        this.state.cardVisibility,
        this.state.topics,
        this.escapeSingleQuotes(this.state.talkSpeaker),
        this.state.talkSpeakerURL,
        this.state.published,
        this.state.audienceLevel,
        this.state.autoAcceptGroup,
        // this.state.autoAcceptCustomInstitutions,
        // this.state.customInstitutionsIds,
        false, 
        [],
        this.state.reminders,
        this.state.reminderEmailGroup, 
        (talk: Talk) => {
          if (this.state.talkToAdvertise !== undefined){
            this.setState({
              talkToAdvertise: talk
            }
            )
          }
          this.setState(
            {
              loading: false,
            },
            () => {
              this.props.onFinishedCallback();
            }
          );
        }
      );
    }
  }

  onFinishAdvertisement = () => {
    this.hideAdvertisementOverlay()
    if (this.state.sendEmail && !this.props.talk && this.state.talkId) {
      TalkService.sendEmailonTalkScheduling(
        this.state.talkId,
        () => {}
      );
    }
    if (this.state.sendEmail && this.props.talk) {
      TalkService.sendEmailonTalkModification(
        this.props.talk.id,
        () => {}
      );
    }
    this.setState({ sendEmail: false })
    if (this.props.onCanceledAdvertisementCallback) {
      this.props.onFinishedAdvertisementCallback()
    }
  };

  onDeleteClicked = () => {
    if (!this.props.talk) {
      return;
    }
    TalkService.deleteTalk(this.props.talk.id, () => {
      this.props.onDeletedCallback();
    });
  };

  onSaveDraft = () => {
    this.setState(
      {
        published: 0,
        loading: true,
      },
      () => {
        this.onFinish();
      }
    );
  }

  selectTag = (tag: Tag) => {
    this.setState({ tags: [...this.state.tags, tag] });
  };

  deselectTag = (tag: Tag) => {
    this.setState({
      tags: this.state.tags.filter(function (t) {
        return t !== tag;
      }),
    });
  };

  selectTopic = (topic: Topic, num: number, depth: number) => {
    if (topic.id > 0) {
      let tempTopics = this.state.topics;
      tempTopics[num] = topic;
      this.setState({ topics: tempTopics });
    }
    let tempIsPrevTopics = this.state.isPrevTopics
    if (depth > 2) {
      tempIsPrevTopics[num] = true
      this.setState({ isPrevTopics: tempIsPrevTopics })
    }
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

  getDateBounds = () => {
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

  isComplete = () => {
    let validDates: boolean = true; 
    if (this.state.startTime !== "" && this.state.endTime !== "") {
      const dateTimeStrs = this.combineDateAndTimeStrings();
      if (dateTimeStrs[0] > dateTimeStrs[1]) {
        validDates = false
      }
    }
    return (
      this.state.startTime !== "" &&
      this.state.endTime !== "" &&
      validDates &&
      this.state.title !== "" &&
      this.state.description !== "" &&
      this.state.link !== "" &&
      this.state.topics.length > 0
    );

  };

  isMissing = () => {
    let res: string[] = []
    if (this.state.startTime === "") {
      res.push("Start time")
    }
    if (this.state.endTime === "") {
      res.push("End time")
    }
    if (this.state.startTime !== "" && this.state.endTime !== "") {
      const dateTimeStrs = this.combineDateAndTimeStrings();
      if (dateTimeStrs[0] > dateTimeStrs[1]) {
        res.push("End is before start date")
      }
    }
    if (this.state.title === "") {
      res.push("Title")
    }
    if (this.state.description === "") {
      res.push("Description")
    }
    if (this.state.link === "") {
      res.push("Link to talk")
    }
    if (this.state.topics.length === 0) {
      res.push("At least 1 topic")
    }
    return res;
  }

  isInThePast = () => {
    if (this.props.talk?.date){
      let now = new Date;
      var talk_date = new Date(this.props.talk.end_date);
      return (talk_date < now)
    }
    else {
      return false
    }
  }

  handleCheckBox = (name: "Everybody" | "Academics" | "None") => {
    this.setState({
      autoAcceptGroup: name
    });
  };

  // parseList = (e: any) => {
  //   this.setState({
  //     acceptedDomains: e.target.value.split(',')
  //   });
  // }

  pushDays = (i: number, n_days: string) => {
    this.setState(prevState => {
      let reminders = prevState.reminders;
      reminders[i].days = Number(n_days);
      return {...prevState, reminders}
    })
  }

  pushHours = (i: number, n_hours: string) => {
    this.setState(prevState => {
      let reminders = prevState.reminders;
      reminders[i].hours = Number(n_hours);
      return {...prevState, reminders}
    })
  }

  hideAdvertisementOverlay = () => {
    this.setState({
      showAdvertisementOverlay: false}
    )
  }

  isPaying = () => {
    return this.state.subscriptionPlans.includes("tier1") || 
      this.state.subscriptionPlans.includes("tier2");
  }

  toggleReminder = (i: number) => {
    if (this.isPaying()) {
      return (
        () => {
          this.setState(prevState => {
            let reminders = prevState.reminders;
            reminders[i].exist = !reminders[i].exist;
            return {...prevState, reminders}
          })
        }
      );
    } else {
      return ;
    }
  }

  renderReminder = (j: number) => {
    return (
      <Box direction="row" gap="5px" align="center">
        <Text size="14x" color="grey" margin={{right: "20px"}} > 
          Reminder {j+1}
        </Text>
        {!this.state.reminders[j].exist && (
          <Box
            focusIndicator={false}
            background={this.isPaying() ? "white" : "#BAD6DB"}
            round="xsmall"
            pad={{ vertical: "2px", horizontal: "xsmall" }}
            onClick={this.toggleReminder(j)}
            style={{
              width: "60px", height: "26px",
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
        {this.state.reminders[j].exist && (
          <Box direction="row" gap="6px" align="center" justify="center">
            <input
              value={this.state.reminders[j].days}
              onChange={(e) => this.pushDays(j, e.target.value)}
              style={{
                width: "30px", height: "20px", padding: "2px",
                border: "1px solid #C2C2C2", borderRadius: "5px", 
              }}
            />
            <Text size="14px" color="grey" margin={{right: "15px"}}> day(s) </Text>
            <input
              value={this.state.reminders[j].hours}
              onChange={(e) => this.pushHours(j, e.target.value)}
              style={{
                width: "30px", height: "20px", padding: "2px",
                border: "1px solid #C2C2C2", borderRadius: "5px", 
              }}
            />
            <Text size="14px" color="grey" margin={{right: "20px"}}> hour(s) before </Text>
            <Close size="20px" onClick={this.toggleReminder(j)} />
          </Box>
        )}
      </Box>
    ); 
  }

  toggleReminderEmailGroup = (group: string) => {
    if (this.isPaying()) {
      if (this.state.reminderEmailGroup.includes(group)) {
        this.setState(prevState => ({
          reminderEmailGroup: prevState.reminderEmailGroup.filter(e => e != group)
        }))
      } else {
        this.setState(prevState => ({
          reminderEmailGroup: [group, ...prevState.reminderEmailGroup]
        }))
      }
    }
  }

  toggleModalPricing = () => {
    this.setState({ showModalPricing: !this.state.showModalPricing });
  };

  renderArrowButton = (prev: boolean) => {
    let incr = prev ? -1 : 1;
    return (
      <Box
        round="xsmall"
        pad={{ vertical: "4px", horizontal: "4px" }}
        style={{
          width: "36px",
          border: "1px solid #BBBBBB",
        }}
        margin={{left: prev ? "36px" : "0px", right: prev ? "0px" : "36px"}}
        onClick={() => this.setState((prevState: any) => ({activeSection: prevState.activeSection+incr}))}
        hoverIndicator="#DDDDDD" 
      >
      {prev && <LinkPrevious color="#BBBBBB" size="26px" />}
      {!prev && <LinkNext color="#BBBBBB" size="26px" />}
    </Box>
    );
  }


  render() {
    // var auto_accept = "Select the default option for automatically accepting people to your seminars </br></br>" +
    // "The accepted people will receive two emails: <br/>" + 
    // "- One <b> straight after acceptation </b> with all the event details except the link <br/>" +
    // "- One <b>24 hours before the event</b> to share the streaming URL. <br/><br/>" +
    // "If URL not available, the email is sent as soon as URL is added to event. ";
    var auto_accept = "'Automatically accepting a registration' means that the person registering to your event will automatically receive its details by email if they belong to one of the below group.";
    var domains_list = "Enter the name of the domains you want to automatically accept, separated by commas. <br/>" + 
    "Example: ox.ac.uk, cam.ac.uk"
    const numbers = [1, 2, 3, 4, 5];

    console.log("topics", this.state.topics)

    return (
      <>
      {this.props.visible && (
        <Layer
          onEsc={this.props.onCanceledCallback}
          onClickOutside={this.props.onCanceledCallback}
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
                <Text size="16px" color="black" weight="bold" margin={{left: "10px"}}  >
                  {this.props.talk ? "Edit talk" : "New talk"}
                </Text>
              </Box>
              {this.props.talk && (
                <Box width="71%" direction="row" align="center" justify="start" gap="30px">
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
                    onClick={() => this.setState((prevState: any) => ({onClickDelete: !prevState.onClickDelete}))} 
                  >
                    <Configure size="18px"/>
                  </Box>
                  {this.state.onClickDelete && (
                    <Box
                      background="#DDDDDD"
                      hoverIndicator="#CCCCCC"
                      justify="center"
                      round="xsmall"
                      align="center"
                      width="90px"
                      height="35px"
                      onClick={this.onDeleteClicked}
                    >
                      <Text size="13px" weight="bold" color="grey"> Delete talk </Text>
                    </Box>
                  )} 
                </Box>
              )}

              {!this.props.talk && <Box width="71%" />}
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
                onClick={this.props.onCanceledCallback}
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

        <Box direction="row" justify="center" align="center" gap="60px" style={{minHeight: "30px"}}>
          <Text weight="bold" color="grey" size="13px"> Information </Text>
          <Text weight="bold" color="grey" size="13px"> Time </Text>
          <Text weight="bold" color="grey" size="13px"> Participants </Text>
          <Text weight="bold" color="grey" size="13px"> Filters </Text>
          <Text weight="bold" color="grey" size="13px"> Reminders </Text>
        </Box>
        <Box direction="row" align="center" margin={{bottom: "20px"}} style={{minHeight: "30px"}}>
          {numbers.map( (i: number) => (
            <>
            <Box 
              width="32px" 
              height="32px"
              round="16px" 
              onClick={() => this.setState({activeSection: i})} 
              background={this.state.activeSection === i ? "#BAD6DB" : "white"}
              justify="center"
              align="center"
              border={{color: "#BAD6DB"}}
              hoverIndicator="#BAD6DB"
              focusIndicator={false}
            >
              <Text color="black" size="14px"> {i} </Text> 
            </Box> 
            {i !== numbers[numbers.length-1] && <hr style={{width: "80px", height: "0.1px", backgroundColor: "black", borderColor: "black" }} />}
            </>
          ))}
        </Box>

        {this.state.activeSection === 1 && (
          <Box direction="column" width="70%" gap="10px" 
            margin={{bottom: "10px"}} style={{minHeight: "350px"}}
          >
            <Box width="100%">
              <TextInput
                placeholder="Title"
                value={this.state.title}
                onChange={(e) => this.setState({ title: e.target.value })}
              />
            </Box>
            <Box direction="row" gap="10px">
              <Box width="50%">
                <TextInput
                  placeholder="Speaker name"
                  value={this.state.talkSpeaker}
                  onChange={(e) => this.setState({ talkSpeaker: e.target.value })}
                />
              </Box>
              <Box width="50%">
                <TextInput
                  placeholder="Speaker homepage"
                  value={this.state.talkSpeakerURL}
                  onChange={(e) => this.setState({ talkSpeakerURL: e.target.value })}
                />
              </Box>
              
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
                  height={15}
                  checked={this.state.latex}
                  callback={(checked: boolean) => {
                    this.setState({ latex: checked });
                  }}
                  width={30}
                />
                Preview <InlineMath math={"{\\small \\LaTeX}"} />
              </Box>

              {!this.state.latex && (
                <TextArea
                  style={{height: "210px"}}
                  value={this.state.description}
                  placeholder=""
                  onChange={(e) => this.setState({ description: e.target.value })}
                />
              )}
              {this.state.latex && (
                <Box height="210px" overflow="auto">
                  {this.state.description.split('\n').map(
                    (item, i) => textToLatex(item)
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )}
        {this.state.activeSection === 2 && (
          <Box direction="column" width="55%" gap="10px"
            margin={{bottom: "10px"}} style={{minHeight: "350px"}}
          >
            <Calendar
              date={this.state.date}
              bounds={this.getDateBounds()}
              size="small"
              onSelect={(date: any) => {
                this.setState({ date });
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
                  value={this.state.startTime}
                  onChange={(event: any) => {
                    this.setState({ startTime: event.target.value });
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
                  value={this.state.endTime}
                  onChange={(event: any) => {
                    this.setState({ endTime: event.target.value });
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}

        {this.state.activeSection === 3 && (
          <Box direction="column" width="70%" gap="10px"
            margin={{bottom: "10px"}} style={{minHeight: "350px"}}
          >
            <Box direction="row" gap="5px" > 
              <Text size="13px" weight="bold"> Link to event </Text>
              <StatusInfo size="small" data-tip data-for='link_to_talk_info'/>
              <ReactTooltip id='link_to_talk_info' place="right" effect="solid">
                <p> Zoom, Teams, Hangout, etc.</p>
              </ReactTooltip> 
            </Box>

            {this.state.link !== '_mora.stream_tech' && ( 
              <TextInput
                value={this.state.link}
                placeholder="https://zoom.us/1234"
                onChange={(e) => this.setState({ link: e.target.value })}
              />
            )}
            {this.state.link === '_mora.stream_tech' && ( 
              <Box
                height="40px"
                round="3px"
                pad="small"
                justify="center"
                style={{border: "1px solid #BBBBBB"}}
              >

              <Text size="13px" weight="bold" color="#CCCCCC">
                The link will be sent to you via email.
              </Text>
              
              </Box>
            )}

            <Box background={this.state.subscriptionPlans.includes("tier2") ? "white" : "#BAD6DB"}
              pad="15px" round="6px" gap="10px"
            >
              {!this.state.subscriptionPlans.includes("tier2") && (
                <Text size="14px" color="black" style={{fontStyle: "italic"}} margin={{bottom: "10px"}}>
                  Unlock our streaming technology sculpted for academic seminars
                </Text> 
              )}
              <Box direction="row" gap="45px"> 
                <CheckBox 
                  checked={this.state.link == '_mora.stream_tech'} 
                  label={`${this.state.link == '_mora.stream_tech'?"Hosting":"Host"} on mora.stream`} 
                  onChange={(e) => {
                    if (this.state.subscriptionPlans.includes("tier2")) {
                      this.setState({ link: e.target.checked ?'_mora.stream_tech':'' })
                    }
                  }}
                />
                {!this.state.subscriptionPlans.includes("tier2") && (
                  <Box
                    onClick={this.toggleModalPricing}
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
                    <Text size="14px" weight="bold"> Unlock streaming </Text>
                  </Box>
                )}
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
                      channelId={this.props.channel ? this.props.channel.id 
                        : (this.props.channelId ? this.props.channelId : null)}
                      userId={this.props.user ? this.props.user.id : null}
                      showDemo={false}
                      headerTitle={false}
                    />

                  </Layer>
                )}

              </Box> 
            </Box>

            <Box direction="row" gap="10px"  align="center" margin={{top: "30px", bottom: "10px"}}>
              <Text size="13px" weight="bold"> Registration required? </Text>
              <Switch
                width={60}
                height={24}
                checked={this.state.onRegistration}
                textOn="Yes" 
                textOff="No"
                callback={(checked: boolean) => {
                  this.setState({ 
                    onRegistration: checked,
                    autoAcceptGroup: "None"
                  });
                  // close sub-switch
                  if (!checked){
                    this.setState({ autoAcceptEnabled: checked });
                  }
                }}
              />
            </Box>

            {this.state.onRegistration && (
              <Box margin={{bottom: "20px"}} gap="15px">
                <Box direction="row" gap="small" margin={{ bottom: "0px" }} align="center">
                  <Text size="13px" weight="bold"> 
                    Automatically accept some users?
                  </Text>
                  <Switch
                      width={60}
                      height={24}
                      checked={this.state.autoAcceptEnabled}
                      textOn="Yes" 
                      textOff="No"
                      callback={(checked: boolean) => {
                        this.setState({ 
                          autoAcceptEnabled: checked,
                         });
                         if (!checked){
                           this.setState({
                             autoAcceptGroup: "None"
                           })
                         }
                      }}
                  />
                  <StatusInfo style={{marginTop: "3px"}} size="small" data-tip={auto_accept} data-for='automatic-registration'/>
                  <ReactTooltip id='automatic-registration' place="right" effect="solid" html={true}/>
                </Box>
      
                {this.state.autoAcceptEnabled && (
                  <>
                  <CheckBox
                    name="feature"
                    label="Everyone"
                    checked={this.state.autoAcceptGroup == "Everybody"}
                    onChange={() => this.handleCheckBox("Everybody")}
                  />
                  <CheckBox
                    name="bug"
                    label="Verified academics"
                    checked={this.state.autoAcceptGroup == "Academics"}
                    onChange={() => this.handleCheckBox("Academics")}
                  />
                  <Text size="13px" margin={{top: "20px"}}><i>Everybody else will need to be manually approved.</i></Text>
                
                  {/* NOTE: Later, people will be able to pick institutions from list. 
                  
                  <Box direction="row" gap="0px"> 
                    <CheckBox
                      id="checkbox-domains"
                      name="bug"
                      label="Only emails ending by: "
                      checked={this.state.autoAcceptGroup == "domains"}
                      onChange={() => this.handleCheckBox("domains")}
                    />
                    <StatusInfo style={{marginTop: "14px", marginRight: "10px"}} size="small" data-tip={domains_list} data-for='domains_list'/>
                    <ReactTooltip id='domains_list' place="bottom" effect="solid" html={true} />
                    <TextInput
                      placeholder="List of domains"
                      value={this.state.acceptedDomains.join(',')}
                      onChange={(e: any) => e ? this.parseList(e) : ""}
                      style={{width: "200px"}}
                    />
                  </Box> */}
                  {/* <CheckBox
                    name="bug"
                    label="Manually accept participants"
                    checked={this.state.autoAcceptGroup == "None"}
                    onChange={() => this.handleCheckBox("None")}
                  /> */}
                </>
                )}
              </Box>
            )}
            {!this.state.onRegistration && (
              <Text size="13px"> Your event is public, and the link to your talk will be shown on mora.stream 15 minutes before the start. </Text>
            )}
          </Box>
        )}
        
        {this.state.activeSection === 4 && (
          <Box direction="column" width="70%" gap="10px"
            margin={{bottom: "10px"}} style={{minHeight: "350px"}}
          >
            <Text size="13px" weight="bold" color="black">
              Topics
            </Text>
            <TopicSelector 
              onSelectedCallback={this.selectTopic}
              onCanceledCallback={this.cancelTopic}
              isPrevTopics={this.state.isPrevTopics}
              prevTopics={this.state.topics}  // {this.props.talk ? this.props.talk.topics : []} 
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
              value={this.state.audienceLevel}
              onChange={({ option }) =>
                this.setState({ audienceLevel: option })
              }
            />
          </Box>
        )}

        {this.state.activeSection === 5 && (
          <Box width="75%" margin={{bottom: "10px"}} style={{minHeight: "350px" }} align="start">
            <Box 
              direction="column" gap="10px" 
              background={this.isPaying() ? "white" : "#BAD6DB"}
              pad="25px" round="6px" 
            >
              {!this.isPaying() && (
                <Text size="14px" color="black" style={{fontStyle: "italic"}} margin={{bottom: "20px"}}>
                  Feature not available under your current plan. Unlock it below
                </Text>
              )}
              <Text size="13px" weight="bold" color="black" margin={{ bottom: "6px" }}> 
                Email reminders
              </Text>
              {this.renderReminder(0)}
              {this.renderReminder(1)}

              <Text size="13px" weight="bold" color="black" margin={{ top: "24px" }}> 
                To whom?
              </Text>
              <CheckBox
                label="Talk participants"
                checked={this.state.reminderEmailGroup.includes("Participants")}
                onChange={() => this.toggleReminderEmailGroup("Participants")}
              />
              <Box direction="row" gap="10px" margin={{bottom: "10px"}}>
                <CheckBox
                  label="Your mailing list"
                  checked={this.state.reminderEmailGroup.includes("MailingList")}
                  onChange={() => this.toggleReminderEmailGroup("MailingList")}
                />
                <StatusInfo size="small" data-tip data-for='mailing-list-reminder'/>
                <ReactTooltip id='mailing-list-reminder' place="right" effect="solid">
                  <Text size="12px"> Securely upload your mailing list in the tab 'Mailing List' in your agora. </Text>
                </ReactTooltip>
              </Box>
              {/* <CheckBox
                label="Your followers"
                checked={this.state.reminderEmailGroup.includes("Followers")}
                onChange={() => this.toggleReminderEmailGroup("Followers")}
              /> */}
            
            <Box margin={{top: "20px"}} gap="15px">
              {!this.isPaying() && ( 
                <Box
                  onClick={this.toggleModalPricing}
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
                  <Text size="14px" weight="bold"> Unlock email reminders </Text>
                </Box>
              )}
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
                    channelId={this.props.channel ? this.props.channel.id 
                      : (this.props.channelId ? this.props.channelId : null)}
                    userId={this.props.user ? this.props.user.id : null}
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
              {this.state.activeSection === 1 && (
                <>
                <Box width="90%" />                
                {this.renderArrowButton(false)}
                </>
              )}

              {this.state.activeSection > 1 && this.state.activeSection < 5 && (
                <>
                  {this.renderArrowButton(true)}
                  <Box width="80%" />
                  {this.renderArrowButton(false)}
                  </>
              )}

              {this.state.activeSection === 5 && (
                <>
                {this.renderArrowButton(true)}
                <Box width="50%" />
                <Box
                  width="140px"
                  height="35px"
                  align="center"
                  justify="center"
                  round="xsmall"
                  background="#BAD6DB"
                  hoverIndicator="#6DA3C7"
                  onClick={this.onSaveDraft}
                >
                  <Text size="14px" weight="bold"> Save as draft </Text>
                </Box>
                <Box data-tip data-for='submitbutton' margin={{left: "24px", right: "32px"}}> 
                  <Button
                    fill={this.isComplete() ? "#025377" : "#CCCCCC"}
                    disabled={!this.isComplete()}
                    height="35px"
                    width="140px"
                    text="Publish"
                    textColor="white"
                    onClick={this.onFinishClicked}
                    hoverIndicator="#6DA3C7"
                    onMouseEnter={this.isMissing}
                  />
                  {!this.isComplete() && this.isMissing() && (
                    <ReactTooltip id='submitbutton' place="top" effect="solid">
                      The following fields are missing
                      {this.isMissing().map((item, index) => (
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
                  value={this.state.title}
                  onChange={(e) => this.setState({ title: e.target.value })}
                />
              </Box>
              <Box width="100%" gap="5px">
                <TextInput
                  placeholder="Speaker name"
                  value={this.state.talkSpeaker}
                  onChange={(e) => this.setState({ talkSpeaker: e.target.value })}
                />
              </Box>
              <Box width="100%" gap="5px">
                <TextInput
                  placeholder="Speaker homepage"
                  value={this.state.talkSpeakerURL}
                  onChange={(e) => this.setState({ talkSpeakerURL: e.target.value })}
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
                    checked={this.state.latex}
                    onChange={(checked: boolean) => {
                      this.setState({ latex: checked });
                    }}
                    size="small"
                  />
                  Preview <InlineMath math={"{\\small \\LaTeX}"} />
                </Box>
                {!this.state.latex && (
                  <TextArea
                    style={{height: "240px"}}
                    value={this.state.description}
                    placeholder=""
                    onChange={(e) => this.setState({ description: e.target.value })}
                  />
                )}
                {this.state.latex && (
                  this.state.description.split('\n').map(
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
                      value={this.state.audienceLevel}
                      onChange={({ option }) =>
                        this.setState({ audienceLevel: option })
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
                    date={this.state.date}
                    bounds={this.getDateBounds()}
                    size="small"
                    onSelect={(date: any) => {
                      this.setState({ date });
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
                        value={this.state.startTime}
                        onChange={(event: any) => {
                          this.setState({ startTime: event.target.value });
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
                        value={this.state.endTime}
                        onChange={(event: any) => {
                          this.setState({ endTime: event.target.value });
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
                    value={this.state.link}
                    placeholder="https://zoom.us/1234"
                    onChange={(e) => this.setState({ link: e.target.value })}
                  />
                <CheckBox 
                  checked={this.state.link == '_mora.stream_tech'} 
                  label={`${this.state.link == '_mora.stream_tech'?"Hosting":"Host"} on mora.stream`} 
                onChange={(e) => this.setState({ link: e.target.checked ?'_mora.stream_tech':'' })}/> 

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
                      value={this.state.linkVisibility}
                      onChange={({ option }) =>
                        this.setState({ linkVisibility: option })
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
                  value={this.state.cardVisibility}
                  onChange={({ option }) =>
                    this.setState({ cardVisibility: option })
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
                  onSelectedCallback={this.selectTopic}
                  onCanceledCallback={this.cancelTopic}
                  isPrevTopics={this.state.isPrevTopics}
                  prevTopics={this.props.talk ? this.props.talk.topics : []} 
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
                      options={this.makeLinkDateOptions()}
                      labelKey="label"
                      value={this.makeLinkDateOption(this.state.releaseLinkOffset)}
                      valueLabel={
                        <Text
                          weight="bold"
                          margin={{ horizontal: "small", vertical: "10px" }}
                        >
                          {this.makeLinkDateOption(this.state.releaseLinkOffset).label}
                        </Text>
                      }
                      onChange={({ option }) => {
                        console.log("OPTION: ", option);
                        this.setState({ releaseLinkOffset: option.value });
                      }}
                    />
                  </Box> */}
                    {/*<OverlaySection heading="Add a few relevant tags">
              <TagSelector
                selected={this.props.talk?.tags}
                onSelectedCallback={this.selectTag}
                onDeselectedCallback={this.deselectTag}
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
                    checked={this.state.linkAvailable}
                    label="interested?"
                    onChange={(event) => this.setState({linkAvailable: !(this.state.linkAvailable)})}
                  /> */}
      
      { /* Overlay when creating a new talk */
        this.state.talkToAdvertise !== null && !this.isInThePast() && !this.props.talk && (
          <Overlay
            width={450}
            height={330}
            visible={this.state.showAdvertisementOverlay}
            title={"Your event was successfully published"}
            submitButtonText="Ok"
            onSubmitClick={this.onFinishAdvertisement}
            contentHeight="180px"
            canProceed={true}
            onCancelClick={this.hideAdvertisementOverlay}
            // onClickOutside={this.hideAdvertisementOverlay}
            onEsc={this.hideAdvertisementOverlay}
          > 
            <Box margin={{top: "10px", bottom: "20px"}}>
              <CheckBox
                label="Check the box to send an email to your agora members about the incoming event"
                onChange={() => this.setState(prevState => ({sendEmail: !prevState.sendEmail}))}
              />
            </Box>
            
            <ShareButtons
              talk={this.state.talkToAdvertise}
              channel={this.props.channel}
              useReducedHorizontalVersion={true}
              width="180px"
            />
          </Overlay>
        )
      }
      { /* Overlay when editing an existing talk */
        this.state.talkToAdvertise !== null && !this.isInThePast() && this.props.talk && (
          <Overlay
            width={450}
            height={330}
            visible={this.state.showAdvertisementOverlay}
            title={"Your event was successfully modified"}
            submitButtonText="Ok"
            onSubmitClick={this.onFinishAdvertisement}
            contentHeight="180px"
            canProceed={true}
            onCancelClick={this.hideAdvertisementOverlay}
            // onClickOutside={this.hideAdvertisementOverlay}
            onEsc={this.hideAdvertisementOverlay}
          >
            <Box margin={{top: "10px", bottom: "20px"}}>
              <CheckBox
                label="Check the box to send an email to your agora members about the changes to your event"
                onChange={() => this.setState(prevState => ({sendEmail: !prevState.sendEmail}))}
              />
            </Box>

            <ShareButtons
              talk={this.state.talkToAdvertise}
              channel={this.props.channel}
              useReducedHorizontalVersion={true}
              width="180px"
            />
          </Overlay>
        )
      }
      </>
    );
  }
}