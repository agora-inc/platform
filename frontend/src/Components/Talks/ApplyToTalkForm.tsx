import React, { Component } from "react";
import {
  Box,
  Select,
  Text,
  TextInput,
  TextArea,
} from "grommet";
import { Overlay, OverlaySection } from "../Core/Overlay";
import emailjs from "emailjs-com";
import { Topic } from "../../Services/TopicService";
import TopicSelector from "../Talks/TopicSelector";
import { ChannelService } from "../../Services/ChannelService";



interface Props {
  channelId: number,
  channelName: string
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
    contactAddresses: string
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
      contactAddresses: ""
    };
    this.fetchContactAddresses()
  }

  fetchContactAddresses = () => {
    ChannelService.getContactAddresses(
      this.props.channelId,
      (contactAddresses: string) => {
        this.setState({ contactAddresses: contactAddresses });
      }
    );
  };


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
    }))
  };

  handleFormSubmit = (e: any) => {
    // prevents the page from bein
    this.fetchContactAddresses();
    e.preventDefault();
    let userData = this.state.user;

    // Send it via email to revolutionising.research@gmail.com
    // console.log(userData);
    this.sendApplication();
    //   message_html: JSON.stringisdffy(this.state.user.speaker_name),
    //   from_name: this.state.user.speaker_name,
    //   reply_to: this.state.user.speaker_name,
    // });
    this.setState({ showForm: false });
  };

  sendApplication = () => {
    let email_topics = [];
    let raw_topics;
    raw_topics = this.state.talk.topics;
    for (let i = 0; i < raw_topics.length; i++) {
      email_topics.push(raw_topics[i]["field"])
    };
    let email_topics_string = email_topics.toString();

    emailjs.send("gmail", "template_pP8phl4n", 
    {
      "agora_administrators_contact_email": this.state.contactAddresses,
      "agora_name": this.props.channelName,
      "speaker_name": this.state.user.speaker_name,
      "speaker_title": this.state.user.speaker_title,
      "speaker_affiliation": this.state.user.affiliation,
      "personal_website": this.state.user.affiliation,
      "speaker_email": this.state.user.email,
      "talk_title": this.state.talk.talk_title,
      "talk_abstract": this.state.talk.abstract,
      "talk_topics": email_topics_string,
      "personal_message": this.state.user.personal_message
    },
    "user_ERRg2QIuCtD8bEjlX1qRw")
      .then(() => {
        // console.log("Email successfully sent!");
      })
      // Handle errors here however you like, or use a React error boundary
      .catch((err: any) =>
        console.error(
          "Oh well, you failed. Here some thoughts on the error that occured:",
          err
        )
      );
  };

  handleClearForm = (e: any) => {
    // prevents the page from being refreshed on form submission
    e.preventDefault();
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
      this.state.user.personal_message !== "" &&
      this.state.user.email !== "" &&
      this.state.user.affiliation !== "" &&
      this.state.talk.talk_title !== "" &&
      this.state.talk.abstract !== "" &&
      this.state.talk.topics.length !== 0 
    );
  };

  selectTopic = (topic: Topic, num: number) => {
    // console.log(num, topic)
    let tempTopics = this.state.talk.topics;
    tempTopics[num] = topic;
    this.setState((prevState: any) => ({
      talk: {
        ...prevState.talk,
        topics: tempTopics
    },
  }));
  }
  render() {
    return (
      <Box>
        <Box
          focusIndicator={false}
          background="white"
          round="xsmall"
          pad={{bottom: "6px", top: "6px", left: "18px", right: "18px"}}
          onClick={() => this.setState({ showForm: true })}
          style={{
            border: "1px solid #C2C2C2",
          }}
          hoverIndicator={true}   
        >
          <Text 
            size="16px" 
            color="grey" 
          >
            Give a talk!
          </Text>
        </Box>
        <Overlay
          visible={this.state.showForm}
          onEsc={this.toggleModal}
          onCancelClick={this.toggleModal}
          onClickOutside={this.toggleModal}
          onSubmitClick={this.handleFormSubmit}
          submitButtonText="Apply"
          canProceed={this.isComplete()}
          width={900}
          height={540}
          contentHeight="1000px"
          title="Talk Application"
        >

        <OverlaySection heading="1. Tell us about you!">
          <Box width="100%" gap="2px">
            {/* <TextInput
              placeholder="Academic title"
              value={this.state.user.speaker_title}
              onChange={(e: any) => this.handleInput(e, "speaker_title")}
              /> */}
            <TextInput
              placeholder="Full name"
              value={this.state.user.speaker_name}
              onChange={(e: any) => this.handleInput(e, "speaker_name")}
              />
            </Box>
          <Box width="100%" gap="2px">
            <Select
              placeholder="Academic title"
              options={['Mr', 'Ms', 'Bachelor', 'Master', 'Dr', 'Prof']}
              value={this.state.user.speaker_title}
              onChange={({options}) => this.setValueAcademicTitle(options)}
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
              </OverlaySection>
        
          <OverlaySection heading="2. Tell us about your talk!"/>
          <Box width="100%" gap="2px">
              <TextInput
                placeholder="Title"
                value={this.state.talk.talk_title}
                onChange={(e: any) => this.handleInput(e, "talk_title")}
              />
            </Box>

            <Box width="100%" gap="2px">
              <TextArea
                placeholder="Abstract"
                value={this.state.talk.abstract}
                onChange={(e: any) => this.handleInput(e, "abstract")}
                rows={8}
              />
            </Box>

            <Box width="100%" align="center" gap="xsmall">
            <Box
              height="30px"
              width="100%"
              // background="#F3EACE"
              round="xsmall"
              pad="small"
              justify="center"
            >
              <Text size="16px" color="black">
              <i>Categorise your talk:</i>
              </Text>
            </Box>
          
          <TopicSelector onSelectedCallback={this.selectTopic} />
        </Box>

        <OverlaySection heading="3. Personal message to us!">
          <Box width="100%" gap="2px" margin={{bottom: "20px"}}>
            <TextArea
              placeholder="Personal message to us!"
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
