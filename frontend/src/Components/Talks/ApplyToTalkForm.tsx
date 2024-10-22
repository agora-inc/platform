import React, { Component } from "react";
import {
  Box,
  Select,
  Text,
  TextInput,
  TextArea,
} from "grommet";
import { Overlay, OverlaySection } from "../Core/Overlay";
import { Topic } from "../../Services/TopicService";
import TopicSelector from "../Talks/TopicSelector";
import { ChannelService } from "../../Services/ChannelService";
import ReactTooltip from "react-tooltip";
import { Info, Workshop } from "grommet-icons";


interface Props {
  channelId: number;
  channelName: string;
  widthButton?: string
}

interface State {
    user: {
      speaker_title: string;
      speaker_name : string;
      email: string;
      personal_website: string;
      personal_message: string;
      affiliation: string;
    },
    talk: {
      talk_title: string;
      abstract: string;
      topics: Topic[],
      // date: string;
    }
    showForm: boolean;
}

export default class ApplyToTalkForm extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: {
        speaker_title: "",
        speaker_name: "",
        email: "",
        personal_website: "",
        personal_message: "",
        affiliation: ""
      },
      talk: {
        talk_title: "",
        abstract: "",
        topics: [],
        // date: "",
        },
      showForm: false,
    };
  }

  handleInput = (e: any, key: string) => {
    let value = e.target.value;
    this.setState((prevState: any) => ({
      user: { ...prevState.user, [key]: value },
      talk: { ...prevState.talk, [key]: value },
    }));
  };

  setValueAcademicTitle = (e: any) => {
    this.setState((prevState: any) => ({
      user: {...prevState.user, speaker_title: e}
    }));
  };

  handleFormSubmit = (e: any) => {
    // prevents the page from bein
    e.preventDefault();
    let userData = this.state.user;
    this.sendApplication();
    this.setState({ showForm: false });
  };

  sendApplication = () => {
    let email_topics_string = "";
    let raw_topics;
    let topic_str;
    raw_topics = this.state.talk.topics;
    for (let i = 0; i < raw_topics.length; i++) {
      if (raw_topics[i] != null){
        topic_str = raw_topics[i]["field"].toString();
        if (email_topics_string != ""){
          email_topics_string = email_topics_string.concat(", ", topic_str)}
        else {
          email_topics_string = email_topics_string.concat(topic_str)
        }
      };
    }
    ChannelService.sendTalkApplicationEmail(
      this.props.channelId,
      this.props.channelName,
      this.state.user.speaker_name,
      this.state.user.speaker_title,
      this.state.user.affiliation,
      this.state.user.personal_website,
      this.state.user.email,
      this.state.talk.talk_title,
      this.state.talk.abstract,
      email_topics_string,
      this.state.user.personal_message,
      //TODO: Error handling
      (answer: any) => {
        console.log("Status: ", answer)
      }
     );
    // TODO: add error handling if email is not succesffully sent.
    this.handleClearForm();
  };

  handleClearForm = () => {
    // prevents the page from being refreshed on form submission
    this.setState({
      user:{
        speaker_title: "",
        speaker_name: "",
        // speaker_position : "",
        email: "",
        personal_website: "",
        personal_message: "",
        affiliation: ""
        },
      talk: {
        talk_title: "",
        abstract: "",
        topics: [],
        // date: ""
        }
      }
    );
  };

  toggleModal = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  isComplete = () => {
    return (
      this.state.user.speaker_title !== "" &&
      this.state.user.speaker_name !== "" &&
      // this.state.user.speaker_position !== "" &&
      // this.state.user.personal_website !== "" &&
      // this.state.user.personal_message !== "" &&
      this.state.user.email !== "" &&
      this.state.user.affiliation !== "" &&
      this.state.talk.talk_title !== "" &&
      this.state.talk.abstract !== "" &&
      this.state.talk.topics.length !== 0 
    );
  };

  selectTopic = (topic: Topic, num: number) => {
    let tempTopics = this.state.talk.topics;
    tempTopics[num] = topic;
    this.setState((prevState: any) => ({
      talk: {
        ...prevState.talk,
        topics: tempTopics
      },
    }));
  }

  cancelTopic = (num: number) => {
    let tempTopics = this.state.talk.topics;
    tempTopics[num] = {
      field: "",
      id: 0,
      is_primitive_node: false,
      parent_1_id: -1,
      parent_2_id: -1, 
      parent_3_id: -1,
    }
    this.setState((prevState: any) => ({
      talk: {
        ...prevState.talk,
        topics: tempTopics
      },
    }));
  }

  isMissing = () => {
    let res: string[] = []
    if (this.state.user.speaker_title === "") {
      res.push("Speaker's title")
    }
    if (this.state.user.speaker_name === "") {
      res.push("Name")
    }
    if (this.state.user.email === "") {
      res.push("Email address")
    }
    if (this.state.user.affiliation === "") {
      res.push("Affiliation")
    }
    if (this.state.talk.talk_title === "") {
      res.push("Talk's title")
    }
    if (this.state.talk.abstract === "") {
      res.push("Abstract")
    }
    if (this.state.talk.topics.length === 0 ) {
      res.push("At least one topic")
    }
    return res;
  }

  render() {
    return (
      <Box>
        <Box
          direction="row"
          focusIndicator={false}
          data-tip data-for='apply_give_talk'
          width={this.props.widthButton ? this.props.widthButton : "185px"}
          height="35px"
          background="color1"
          round="xsmall"
          onClick={() => this.setState({ showForm: true })}
          hoverIndicator="color5"
          justify="center"  
          align="center" 
        >
          <Workshop size="18px" />
          <Text
            margin={{left: "10px"}}
            size="14px"
            alignSelf="center"
          >
            Apply to give a talk
          </Text>
            <ReactTooltip id="apply_give_talk" effect="solid">
              Want to give a seminar within '{this.props.channelName}'? Apply!
            </ReactTooltip>
        </Box>
        <Overlay
          visible={this.state.showForm}
          onEsc={this.toggleModal}
          onCancelClick={this.toggleModal}
          onClickOutside={this.toggleModal}
          onSubmitClick={this.handleFormSubmit}
          submitButtonText="Apply"
          canProceed={this.isComplete()}
          isMissing={this.isMissing()}
          width={600}
          height={750}
          contentHeight="1000px"
          title="Talk application"
        >

        <OverlaySection>
          <Box width="100%" gap="2px">
            <Box direction="row" gap="10px" justify="center" margin={{bottom: "20px"}}>
              <Info size="20px" />
              <Text size="12px"> To speed up the application, create an account and upload your presentation on your profile. That way, you can apply to any agora in 2 clicks!</Text>
            </Box>
            
            <TextInput
              placeholder="Full name"
              value={this.state.user.speaker_name}
              onChange={(e: any) => this.handleInput(e, "speaker_name")}
              />
            </Box>
          <Box width="100%" gap="2px">
            <Select
              placeholder="Education level"
              options={['Bachelor', 'Master', 'PhD Candidate', 'Postdoc+', 'Prof', 'Else']}
              value={this.state.user.speaker_title}
              onChange={({option}) => this.setValueAcademicTitle(option)}
            />
          </Box>
          {/* <Box width="100%" gap="2px">
            <TextInput
              placeholder="Position / level of education"
              value={this.state.user.speaker_position}
              onChange={(e: any) => this.handleInput(e, "speaker_position")}
              />
          </Box> */}
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Current affiliation"
              value={this.state.user.affiliation}
              onChange={(e: any) => this.handleInput(e, "affiliation")}
              />
          </Box>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Email address"
              value={this.state.user.email}
              onChange={(e: any) => this.handleInput(e, "email")}
              />
          </Box>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="(Personal website)"
              value={this.state.user.personal_website}
              onChange={(e: any) => this.handleInput(e, "personal_website")}
              />
          </Box>
          <Box width="100%" gap="2px">
              <TextInput
                placeholder="Talk title"
                value={this.state.talk.talk_title}
                onChange={(e: any) => this.handleInput(e, "talk_title")}
              />
            </Box>

            <Box width="100%" gap="2px">
              <TextArea
                placeholder="Talk Abstract"
                value={this.state.talk.abstract}
                onChange={(e: any) => this.handleInput(e, "abstract")}
                rows={8}
              />
            </Box>

            <Box width="100%" align="center" gap="xsmall">
            <Box
              width="100%"
              round="xsmall"
              pad="small"
              justify="center"
            >
              <Text size="16px" color="black">
              <b>Categorise your talk:</b>
              </Text>
            </Box>
          
          <TopicSelector 
            onSelectedCallback={this.selectTopic}
            onCanceledCallback={this.cancelTopic}
            isPrevTopics={[false, false, false]} 
            prevTopics={[]} 
          />
        </Box>

          <Box width="100%" gap="2px" margin={{bottom: "20px"}}>
            <TextArea
              placeholder="(Message to the organizer)"
              value={this.state.user.personal_message}
              onChange={(e: any) => this.handleInput(e, "personal_message")}
              rows={8}
            />
          </Box>
          </OverlaySection>
        </Overlay>
      </Box>
    );
  }
}
