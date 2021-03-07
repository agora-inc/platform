import React, { Component } from "react";
import {
  Box,
  Button,
  Text,
  TextInput,
  Layer,
  Grid,
} from "grommet";
import { FormNext } from "grommet-icons";
import { Overlay, OverlaySection } from "../../Core/Overlay";
import { Talk, TalkService } from "../../../Services/TalkService";
import { User } from "../../../Services/UserService";


interface Props {
  text?: string,
  talk: Talk,
  user: User | null;
  callback: any
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

export default class TalkRegistrationFormButton extends Component<Props, State> {
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

  toggleFeedbackAndRegistrationModal = () => {
    this.setState({ feedbackModal: !this.state.feedbackModal });
    this.props.callback();
  }

  isComplete = () => {
    return (
      this.state.form.fullName !== "" &&
      this.state.form.email !== "" &&
      this.state.form.institution !== ""
    );
  };

  isMissing = () => {
    let res: string[] = []
    if (this.state.form.fullName === "") {
      res.push("Name")
    }
    if (this.state.form.email === "") {
      res.push("Email address")
    }
    if (this.state.form.institution === "") {
      res.push("Institution")
    }
    return res;
  }

  render() {
    return (
      <Box style={{maxHeight: "35px"}}>
        {/*<Button
          label={this.props.text ? this.props.text : "Register"}
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
        />*/}
        <Box
          onClick={this.toggleModal}
          background="#F2F2F2"
          round="xsmall"
          width="140px" height="35px"
          justify="center"
          align="center"
          focusIndicator={true}
          hoverIndicator="#DDDDDD"
        >
          <Text weight="bold" size="15px">
            {this.props.text ? this.props.text : "Register"}
          </Text>
        </Box> 
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
              // border: "3.5px solid black",
              padding: 20,
            }}
          >
                <>
                <Grid
                  rows={['120px', "40px"]}
                  columns={['300px']}
                  // gap="small"
                  areas={[
                      { name: 'info', start: [0, 0], end: [0, 0] },
                      { name: 'ok', start: [0, 1], end: [0, 1] },
                  ]}
                >
                  <Box gridArea="info" direction="column" align="start" justify="start" gap="15px" >
                    <Text weight="bold" size="20px" textAlign="start"> 
                      {this.state.feedbackMsg.errorMsg === "" ? "Thank you for registering!" : "Something went wrong..."} 
                    </Text>
                    <Box direction="row" align="start" pad="1px" justify="start">
                      <Text size="14px"> 
                        {this.state.feedbackMsg.errorMsg === "" 
                          ? "You will receive a conference URL by email after review by the organisers" 
                          : "Please report the issue using `Feedback`. Error: " + this.state.feedbackMsg.errorMsg}
                      </Text>
                    </Box>
                  </Box>
                  <Box
                    gridArea="ok"
                    onClick={this.toggleFeedbackAndRegistrationModal}
                    background="#F2F2F2"
                    round="xsmall"
                    width="70px" height="35px"
                    justify="center"
                    align="center"
                    focusIndicator={true}
                    hoverIndicator="#DDDDDD"
                  >
                    <Text weight="bold" size="15px">
                      OK
                    </Text>
                  </Box> 
                        
                </Grid>  
                </>

          </Layer>
        )}
      </Box>
    );
  }
}
