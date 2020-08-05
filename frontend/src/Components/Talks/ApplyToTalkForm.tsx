import React, { Component } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  TextInput,
  TextArea,
  Layer,
  Form,
  CheckBox,
} from "grommet";
import { Overlay, OverlaySection } from "../Core/Overlay";
import emailjs from "emailjs-com";
import { Topic } from "../../Services/TopicService";
import TopicSelector from "../Talks/TopicSelector";

interface State {
    user: {
        name: string;
        email: string;
        personal_website: string;
        personal_message: string;
      },
      talk: {
        title: string;
        abstract: string;
        topics: Topic[],
        date: string;
      },
  showForm: boolean;
}

export default class ApplyToTalkForm extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: {
        name: "",
        email: "",
        personal_website: "",
        personal_message: "",
      },
      talk: {
        title: "",
        abstract: "",
        topics: [],
        date: ""
      },
      showForm: false,
    };
  }

  handleCheckBox = (name: string) => {
    this.setState((prevState: any) => ({
      user: {
        ...prevState.user,
        about: { ...prevState.user.about, [name]: !prevState.user.about[name] },
      },
    }));
  };

  handleInput = (e: any, key: string) => {
    let value = e.target.value;
    this.setState((prevState: any) => ({
      user: { ...prevState.user, [key]: value },
    }));
  };

  handleFormSubmit = (e: any) => {
    // prevents the page from being refreshed on form submission
    e.preventDefault();
    let userData = this.state.user;

    // Send it via email to revolutionising.research@gmail.com
    // console.log(userData);
    const templateId = "feedback_form";
    this.sendFeedback(templateId, {
      message_html: JSON.stringify(this.state.user),
      from_name: this.state.user.name,
      reply_to: this.state.user.name,
    });
    this.setState({ showForm: false });
  };

  sendFeedback = (templateId: string, variables: any) => {
    emailjs

      .send("gmail", templateId, variables, "user_ERRg2QIuCtD8bEjlX1qRw")
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
    user: {
        name: "",
        email: "",
        personal_website: "",
        personal_message: "",
        },
        talk: {
        title: "",
        abstract: "",
        topics: [],
        date: ""
        },
    });
  };

  toggleModal = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  selectTopic = (topic: Topic, num: number) => {
    console.log(num, topic)
    let tempTopics = this.state.talk.topics;
    tempTopics[num] = topic;
    this.setState({
      talk: tempTopics
    });
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
          submitButtonText="Submit"
          canProceed={true}
          width={500}
          height={640}
          contentHeight="500px"
          title="Talk Application"
        >
        <Text size="16px" weight="bold" color="black">
              Tell us about you!
            </Text>

          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Name"
              value={this.state.user.name}
              onChange={(e: any) => this.handleInput(e, "name")}
            />
          </Box>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Position / level of education"
              value={this.state.user.position}
              onChange={(e: any) => this.handleInput(e, "position")}
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
              placeholder="Personal website"
              value={this.state.user.personal_website}
              onChange={(e: any) => this.handleInput(e, "personal_website")}
            />
          </Box>

          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Affiliation"
              value={this.state.user.affiliation}
              onChange={(e: any) => this.handleInput(e, "affiliation")}
            />
          </Box>
        
          <br></br>

          <Text size="16px" weight="bold" color="black">
              Tell us about your talk!
            </Text>


          {/* user: {
        name: "",
        email: "",
        personal_website: "",
        personal_message: "",
      },
      talk: {
        title: "",
        abstract: "",
        topics: "",
        date: ""
      }, */}

        <Box width="100%" gap="2px">
            <TextInput
              placeholder="Title"
              value={this.state.talk.title}
              onChange={(e: any) => this.handleInput(e, "title")}
            />
          </Box>

          <Box width="100%" gap="2px">
            <TextArea
              placeholder="Advertised abstract"
              value={this.state.talk.abstract}
              onChange={(e: any) => this.handleInput(e, "abstract")}
              rows={8}
            />
          </Box>

          <OverlaySection heading="Related topics">
          <TopicSelector onSelectedCallback={this.selectTopic} />
        </OverlaySection>







        </Overlay>
      </Box>
    );
  }
}
