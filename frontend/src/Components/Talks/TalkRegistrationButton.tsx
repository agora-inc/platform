import React, { Component } from "react";
import {
  Box,
  Button,
  Text,
  TextInput,
  Layer,
} from "grommet";
import { Overlay, OverlaySection } from "../Core/Overlay";
import { Talk } from "../../Services/TalkService";


// NOTE: most of this code has been copy/pasted from another overlay.  To be cleaned.

interface Props {
  talk: Talk
}

interface State {
    user: {
      full_name : string;
      institution: string;
      email: string;
    },
    talk: {
      talk_title: string;
      abstract: string;
      // topics: Topic[],
      // date: string;
    }
    showForm: boolean;
    thankModal: boolean;
    contactAddresses: string
}

export default class TalkRegistrationButton extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: {
        full_name: "",
        institution: "",
        email: "",
      },
      talk: {
        talk_title: "",
        abstract: "",
      },
      showForm: false,
      thankModal: false,
      contactAddresses: ""
    };
    // this.fetchContactAddresses()
  }

  handleInput = (e: any) => {
    let value = e.target.value;
    let key = e.target.name;
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
    e.preventDefault();
    // prevents the page from bein
    // this.fetchContactAddresses();
    // let userData = this.state.user;
    // this.sendApplication();
    // this.setState({ showForm: false });
    this.setState({thankModal: true});
  };

  toggleModal = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  toggleThankModal = () => {
    this.setState({ thankModal: !this.state.thankModal });
    this.setState({ showForm: false });
  };

  isComplete = () => {
    return ( true
    );
  };

  isMissing = () => {
    let res: string[] = []
    if (this.state.user.full_name === "") {
      res.push("Name")
    }
    if (this.state.user.email === "") {
      res.push("Email address")
    }
    if (this.state.user.institution === "") {
      res.push("Institution")
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
          height={300}
          contentHeight="200px"
          title={"Registration"}
        >

        <OverlaySection>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Full name"
              value={this.state.user.full_name}
              onChange={this.handleInput}
              />
            </Box>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Current institution"
              value={this.state.user.institution}
              onChange={this.handleInput}
              />
          </Box>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Email address"
              value={this.state.user.email}
              onChange={this.handleInput}
              />
          </Box>
          </OverlaySection>
        </Overlay>
        {this.state.thankModal && (
          <Layer
            onEsc={this.toggleThankModal}
            onClickOutside={this.toggleThankModal}
            style={{
              width: 300,
              height: 200,
              borderRadius: 15,
              border: "3.5px solid black",
              padding: 10,
            }}
          >
            <Box>
              <Text margin="20px">
                Thank you for registering! If accepted, you will receive an email by 
                the organisers with a link to attend.
              </Text>
            </Box>
            <Button label="Ok" onClick={this.toggleThankModal} />
          </Layer>
        )}
      </Box>
    );
  }
}
