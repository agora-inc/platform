import React, { Component } from "react";
import {
  Box,
  Select,
  Button,
  Text,
  TextInput,
  TextArea,
} from "grommet";
import { Overlay, OverlaySection } from "../Core/Overlay";
import emailjs from "emailjs-com";
import { Topic } from "../../Services/TopicService";
import TopicSelector from "../Talks/TopicSelector";
import { ChannelService } from "../../Services/ChannelService";
import {Talk, TalkService} from "../../Services/TalkService";


// NOTE: most of this code has been copy/pasted from another overlay.  To be cleaned.



interface Props {
  talk: Talk
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

export default class TalkRegistrationButton extends Component<Props, State> {
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
    // this.fetchContactAddresses()
  }

  // fetchContactAddresses = () => {
  //   ChannelService.getContactAddresses(
  //     this.props.channelId,
  //     (contactAddresses: string) => {
  //       this.setState({ contactAddresses: contactAddresses });
  //     }
  //   );
  // };

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
    // this.fetchContactAddresses();
    // e.preventDefault();
    // let userData = this.state.user;
    // this.sendApplication();
    // this.setState({ showForm: false });
  };

  // sendApplication = () => {
  //   let email_topics_string = "";
  //   let raw_topics;
  //   let topic_str;
  //   raw_topics = this.state.talk.topics;
  //   for (let i = 0; i < raw_topics.length; i++) {
  //     if (raw_topics[i] != null){
  //       topic_str = raw_topics[i]["field"].toString();
  //       if (email_topics_string != ""){
  //         email_topics_string = email_topics_string.concat(", ", topic_str)}
  //       else {
  //         email_topics_string = email_topics_string.concat(topic_str)
  //       }
  //     };
  //   }
  //   ChannelService.sendTalkApplicationEmail(
  //     // "agora_administrators_contact_email": this.state.contactAddresses,
  //     this.props.channelId,
  //     this.props.channelName,
  //     this.state.user.speaker_name,
  //     this.state.user.speaker_title,
  //     this.state.user.affiliation,
  //     this.state.user.personal_website,
  //     this.state.user.email,
  //     this.state.talk.talk_title,
  //     this.state.talk.abstract,
  //     email_topics_string,
  //     this.state.user.personal_message,
  //     //TODO: Error handling
  //     (answer: any) => {
  //       console.log("Successful application!")
  //     }
  //    );
  //   // TODO: add error handling if email is not succesffully sent.
  //   this.handleClearForm();
  //   };

  // handleClearForm = () => {
  //   // prevents the page from being refreshed on form submission
  //   this.setState({
  //     user:{
  //       speaker_title: "",
  //       speaker_name: "",
  //       // speaker_position : "",
  //       email: "",
  //       personal_website: "",
  //       personal_message: "",
  //       affiliation: ""
  //       },
  //     talk: {
  //       talk_title: "",
  //       abstract: "",
  //       topics: [],
  //       // date: ""
  //       }
  //     }
  //   );
  // };

  toggleModal = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  isComplete = () => {
    return ( true
      // this.state.user.speaker_title !== "" &&
      // this.state.user.speaker_name !== "" &&
      // // this.state.user.speaker_position !== "" &&
      // // this.state.user.personal_website !== "" &&
      // // this.state.user.personal_message !== "" &&
      // this.state.user.email !== "" &&
      // this.state.user.affiliation !== "" &&
      // this.state.talk.talk_title !== "" &&
      // this.state.talk.abstract !== "" &&
      // this.state.talk.topics.length !== 0 
    );
  };

  // selectTopic = (topic: Topic, num: number) => {
  //   let tempTopics = this.state.talk.topics;
  //   tempTopics[num] = topic;
  //   this.setState((prevState: any) => ({
  //     talk: {
  //       ...prevState.talk,
  //       topics: tempTopics
  //     },
  //   }));
  // }

  // cancelTopic = (num: number) => {
  //   let tempTopics = this.state.talk.topics;
  //   tempTopics[num] = {
  //     field: "",
  //     id: 0,
  //     is_primitive_node: false,
  //     parent_1_id: -1,
  //     parent_2_id: -1, 
  //     parent_3_id: -1,
  //   }
  //   this.setState((prevState: any) => ({
  //     talk: {
  //       ...prevState.talk,
  //       topics: tempTopics
  //     },
  //   }));
  // }

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
        <Button
          label="Register"
          onClick={this.toggleModal}
          style={{
            width: 90,
            height: 35,
            fontSize: 15,
            fontWeight: "bold",
            padding: 0,
            // margin: 6,
            backgroundColor: "#F2F2F2",
            border: "none",
            borderRadius: 7,
          }}
        />
        {/* <Button
          label="Sign up"
          onClick={this.toggleModal}
          hoverIndicator={false}
          style={{
            width: 90,
            height: 35,
            fontSize: 16,
            fontWeight: "bold",
            color: "white",
            padding: 0,
            backgroundColor: "#7E1115",
            border: "none",
            borderRadius: 5,
          }}
        /> */}
        <Overlay
          visible={this.state.showForm}
          onEsc={this.toggleModal}
          onCancelClick={this.toggleModal}
          onClickOutside={this.toggleModal}
          onSubmitClick={this.handleFormSubmit}
          submitButtonText="Register"
          canProceed={this.isComplete()}
          isMissing={this.isMissing()}
          width={500}
          height={350}
          contentHeight="200px"
          title={"Talk Registration"}
        >

        <OverlaySection>
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
              placeholder="(Webpage)"
              value={this.state.user.email}
              onChange={(e: any) => this.handleInput(e, "homepage")}
              />
          </Box>
          {/* <Box width="100%" gap="2px">
            <Select
              placeholder="Education level"
              options={['Bachelor/Master', 'PhD+', 'Else']}
              value={this.state.user.speaker_title}
              onChange={({option}) => this.setValueAcademicTitle(option)}
            />
          </Box> */}
          {/* <Box width="100%" gap="2px">
            <TextInput
              placeholder="Position / level of education"
              value={this.state.user.speaker_position}
              onChange={(e: any) => this.handleInput(e, "speaker_position")}
              />
            </Box> */}
          {/* <Box width="100%" gap="2px" margin={{bottom: "20px"}}>
            <TextArea
              placeholder="(Message to us)"
              value={this.state.user.personal_message}
              onChange={(e: any) => this.handleInput(e, "personal_message")}
              rows={8}
            />
          </Box> */}
          </OverlaySection>
        </Overlay>
      </Box>
    );
  }
}
