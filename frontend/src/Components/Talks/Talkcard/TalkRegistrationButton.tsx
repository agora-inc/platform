import React, { Component } from "react";
import {
  Box,
  Button,
  Text,
  TextInput,
  Layer,
} from "grommet";
import { Overlay, OverlaySection } from "../../Core/Overlay";
import { Talk, TalkService } from "../../../Services/TalkService";
import { User } from "../../../Services/UserService";


interface Props {
  talk: Talk,
  user?: User
}

interface State {
    form: {
      fullName : string;
      institution: string;
      email: string;
      homepage: string
    },
    feedbackMsg: {
      confirmationMsg: string;
      errorMsg: string
    }
    showForm: boolean;
    feedbackModal: boolean;
}

export default class TalkRegistrationButton extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      form: {
        fullName: "",
        institution: "",
        email: "",
        homepage: ""
      },
      feedbackMsg: {
        confirmationMsg: "Successful registration. You will automatically receive the information regarding that event by email as soon as an administrator treated your request.",
        errorMsg: ""
      },
      showForm: false,
      feedbackModal: false,
    };
  }

  handleInput = (e: any, key: string) => {
    let value = e.target.value;
    this.setState((prevState: any) => ({
      form: { ...prevState.form, [key]: value },
    }));
  };

  handleFormSubmit = (e: any) => {
    e.preventDefault();
    TalkService.registerForTalk(
      this.props.talk.id,
      this.props.user?.id,
      this.state.form.fullName,
      this.state.form.email,
      this.state.form.homepage, 
      this.state.form.institution,
      (res: any) => {
        // display error received from method
        if (res !== "ok"){
          this.setState((prevState: any) => ({
          feedbackMsg: {...prevState.feedbackMsg, errorMsg: res}
          }));
        };
      }
    );
    this.toggleFeedbackModal();
  };
  
  toggleModal = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  toggleFeedbackModal = () => {
    this.setState({ feedbackModal: !this.state.feedbackModal });
    this.setState({ showForm: false });
  };

  isComplete = () => {
    return (
      this.state.form.fullName !== "" &&
      this.state.form.email !== "" &&
      this.state.form.institution !== ""
    );
  };

  isMissing = () => {
    let res: string[] = []
    if (this.state.form.fullName !== "") {
      res.push("Name")
    }
    if (this.state.form.email !== "") {
      res.push("Email address")
    }
    if (this.state.form.institution !== "") {
      res.push("Institution")
    }
    return res;
  }

  render() {
    return (
      <Box style={{maxHeight: "30px"}}>
        <Button
          label="Attend"
          onClick={this.toggleModal}
          style={{
            width: 140,
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
          title={"Registration"}
        >
        <OverlaySection>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Full name"
              value={this.state.form.fullName}
              onChange={(e: any) => this.handleInput(e, "fullName")}
              />
            </Box>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Current institution"
              value={this.state.form.institution}
              onChange={(e: any) => this.handleInput(e, "institution")}
              />
          </Box>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Email address"
              value={this.state.form.email}
              onChange={(e: any) => this.handleInput(e, "email")}
              />
          </Box>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="(Homepage)"
              value={this.state.form.homepage}
              onChange={(e: any) => this.handleInput(e, "homepage")}
              />
          </Box>
          </OverlaySection>
        </Overlay>
        {this.state.feedbackModal && (
          <Layer
            onEsc={this.toggleFeedbackModal}
            onClickOutside={this.toggleFeedbackModal}
            style={{
              width: 350,
              height: 200,
              borderRadius: 15,
              border: "3.5px solid black",
              padding: 10,
            }}
          >
            <Box height="200px"
            >
              {(this.state.feedbackMsg.errorMsg == "") && (
              <Text margin="20px">
                <p><b>Thank you for registering!</b></p> 
                <p>You will receive a conference URL by email after review by the organisers.</p>
              </Text>
              )}
              {(this.state.feedbackMsg.errorMsg !== "") && (
                <>
                  <Text margin={{left: "15px", right: "15px"}}>
                    Something went wrong. Please signal issue using the "Feedback/bug" button.
                  </Text>
                  <Text margin={{left: "15px", right: "15px", top: "5px"}} color="red">
                    Error: {this.state.feedbackMsg.errorMsg}
                    </Text>
                </>
              )}

            </Box>
            <Button label="Ok" onClick={this.toggleFeedbackModal} alignSelf="center"/>
          </Layer>
        )}
      </Box>
    );
  }
}
