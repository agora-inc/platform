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
import { Overlay } from "../Core/Overlay";
import emailjs from "emailjs-com";

interface State {
  user: any;
  showForm: boolean;
}

export default class FormContainer extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: {
        name: "",
        email: "",
        about: { bug: false, feature: false },
        description: "",
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
        about: { bug: false, feature: false },
        description: "",
      },
    });
  };

  toggleModal = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  isMissing = () => {
    let res: string[] = []
    if (this.state.user.description === "") {
      res.push("Feedback / Suggestion / Bug")
    }
    return res;
  }

  render() {
    return (
      <Box>
          <Text 
            size="14px" 
            color="grey"
            onClick={() => this.setState({ showForm: true })}
          > 
            <u>Contact us</u>
          </Text>
        <Overlay
          visible={this.state.showForm}
          onEsc={this.toggleModal}
          onCancelClick={this.toggleModal}
          onClickOutside={this.toggleModal}
          onSubmitClick={this.handleFormSubmit}
          submitButtonText="Submit"
          canProceed={this.isMissing().length === 0}
          isMissing={this.isMissing()}
          width={500}
          height={650}
          contentHeight="500px"
          title="Contact us"
        >
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Name (optional)"
              value={this.state.user.name}
              onChange={(e: any) => this.handleInput(e, "name")}
            />
          </Box>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Email (optional)"
              value={this.state.user.email}
              onChange={(e: any) => this.handleInput(e, "email")}
            />
          </Box>
          <Box direction="row" justify="between" width="100%">
            <CheckBox
              name="feature"
              label="Suggest a feature"
              onChange={() => this.handleCheckBox("feature")}
            />
            <CheckBox
              name="bug"
              label="Report a bug"
              onChange={() => this.handleCheckBox("bug")}
            />
          </Box>
          <Box width="100%" gap="2px">
            <TextArea
              placeholder="Enter text here"
              value={this.state.user.description}
              onChange={(e: any) => this.handleInput(e, "description")}
              rows={8}
            />
          </Box>
        </Overlay>
        {/* {this.state.showForm && (
          <Layer
            onEsc={() => this.setState({ showForm: false })}
            onClickOutside={() => this.setState({ showForm: false })}
            modal={true}
            position="center"
            margin={{
              top: "100px",
              // bottom: "100px",
              left: "100px",
              right: "100px",
            }}
          >
            <Form
              style={{
                height: "100%",
              }}
            >
              <Box
                margin={{ bottom: "medium", top: "medium" }}
                align={"center"}
                background={{ color: "4F0112" }}
                width={"large"}
              >
                <Heading level={2}>Feedback form</Heading>
              </Box>

              <Box margin={{ top: "medium", left: "large", right: "large" }}>
                <Heading level={4}>Your name</Heading>
                <TextInput
                  placeholder=""
                  value={this.state.user.name}
                  onChange={(e: any) => this.handleInput(e, "name")}
                />
              </Box>

              <Box margin={{ top: "medium", left: "large", right: "large" }}>
                <Heading level={4}>Your email address</Heading>
                <TextInput
                  placeholder=""
                  value={this.state.user.email}
                  onChange={(e: any) => this.handleInput(e, "email")}
                />
              </Box>

              <Box
                direction="row"
                gap="large"
                margin={{ top: "medium", left: "large", right: "large" }}
              >
                <CheckBox
                  name="feature"
                  label="Suggest a feature"
                  onChange={() => this.handleCheckBox("feature")}
                />
                <CheckBox
                  name="bug"
                  label="Report a bug"
                  onChange={() => this.handleCheckBox("bug")}
                />
              </Box>

              <Box
                margin={{
                  top: "medium",
                  left: "large",
                  right: "large",
                  bottom: "medium",
                }}
              >
                <Heading level={4}>Description</Heading>
                <TextArea
                  placeholder="We are looking forward to hearing your feedback!"
                  value={this.state.user.description}
                  onChange={(e: any) => this.handleInput(e, "description")}
                  rows={8}
                />
              </Box>
              <Box width="100%" align="center" margin={{ bottom: "medium" }}>
                <Button
                  type="submit"
                  primary
                  label="Submit"
                  onClick={this.handleFormSubmit}
                  size="large"
                  style={{ fontWeight: "bold" }}
                />
              </Box>
            </Form>
          </Layer>
        )} */}
      </Box>
    );
  }
}

/*
<Button label="Close" onClick={() => this.setState({showForm: false})} alignSelf="end" />

                <Box margin={{"top": "medium"}} >
                  <Heading level={4}>
                  Your channel
                  </Heading>
                  <TextInput
                    placeholder=""
                    onChange={(e) => this.handleInput(e, "channel")}
                  />
                </Box>
*/
