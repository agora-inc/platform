import React, { Component } from "react";
import {
  Box,
  Select,
  Text,
  TextInput,
} from "grommet";
import { Overlay, OverlaySection } from "../Core/Overlay";
import { ChannelService } from "../../Services/ChannelService";
import LoginModal from "../Account/LoginModal";
import SignUpButton from "../Account/SignUpButton";
import { UserService, User } from "../../Services/UserService";
import ReactTooltip from "react-tooltip";

const titleOptions = ["Undergraduate", "Postgraduate", "PhD Candidate", "Dr", "Prof"];

interface Props {
  channelId: number,
  channelName: string,
  user: any,
  height?: string,
  widthButton?: string,
}

interface State {
    form: {
      fullName : string;
      email: string;
      title: string;
      personalWebsite: string;
      personalMessage: string;
      affiliation: string;
    },
    showForm: boolean;
    contactAddresses: string
}

export default class RequestMembershipButton extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      form: {
        fullName: "",
        email: "",
        title: "",
        personalMessage: "",
        personalWebsite: "",
        affiliation: ""
      },
      showForm: false,
      contactAddresses: "",
    };
    // this.fetchUserDetails()
  }

  fetchUserDetails = () => {
    // TODO: rework UserService.getCurrentUser() to give us all the data of the user 
    //(GOAL: prevent the user to write multiple times the same details for appilcation)
    // var userData = UserService.getCurrentUser();
    // console.log("hihi");
    // console.log(userData);
    // this.setState({user: userData})
  };

  handleInput = (e: any, key: string) => {
    let value = e.target.value;
    this.setState((prevState: any) => ({
      form: { ...prevState.form, [key]: value },
    }));
  };

  setValueAcademicTitle = (e: any) => {
    this.setState((prevState: any) => ({
      form: {...prevState.form, title: e}
    }));
  };

  handleFormSubmit = (e: any) => {
    // prevents the page from bein
    e.preventDefault();
    let userData = this.state.form;
    this.sendApplication();
    this.setState({ showForm: false });
  };

  sendApplication = () => {
    ChannelService.applyMembership(
      this.props.channelId,
      this.props.user.id,
      this.state.form.fullName,
      this.state.form.title,
      this.state.form.affiliation,
      this.state.form.email,
      this.state.form.personalWebsite,
      //TODO: Error handling
      () => {}
     );
    // TODO: add error handling if email is not succesffully sent.
    this.handleClearForm();
    };

  handleClearForm = () => {
    // prevents the page from being refreshed on form submission
    // this.setState({
    //   user:{
    //     speaker_title: "",
    //     speaker_name: "",
    //     // speaker_position : "",
    //     email: "",
    //     personalWebsite: "",
    //     personalMessage: "",
    //     affiliation: ""
    //     },
    //   talk: {
    //     talk_title: "",
    //     abstract: "",
    //     topics: [],
    //     // date: ""
    //     }
    //   }
    // );
  };

  toggleModal = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  isComplete = () => {
    return (
      this.state.form.fullName !== "" &&
      this.state.form.title !== "" &&
      // this.state.user.speaker_position !== "" &&
      // this.state.user.personalWebsite !== "" &&
      // this.state.user.personalMessage !== "" &&
      this.state.form.email !== "" &&
      this.state.form.affiliation !== ""
    );
  };

  isMissing = () => {
    let res: string[] = []
    if (this.state.form.fullName === "") {
      res.push("Full name")
    }
    if (this.state.form.title === "") {
      res.push("Title/position")
    }
    if (this.state.form.email === "") {
      res.push("Email address")
    }
    if (this.state.form.affiliation === "") {
      res.push("Affiliation")
    }
    return res;
  }

  render() {
    return (
      <Box>
        <Box
          data-tip data-for='membership_application_button'
          focusIndicator={false}
          width={this.props.widthButton ? this.props.widthButton : "12vw"}
          background="white"
          round="xsmall"
          height={this.props.height ? this.props.height : "30px"}
          pad={{bottom: "6px", top: "6px", left: "3px", right: "3px"}}
          onClick={() => this.setState({ showForm: true })}
          style={{
            border: "1px solid #C2C2C2",
            minWidth: "25px"
          }}
          hoverIndicator={true}
          justify="center"   
        >
          <Text 
            size="14px" 
            color="grey"
            alignSelf="center"
          >
            Become a member
          </Text>
          <ReactTooltip id="membership_application_button" effect="solid">
              Get the instant access to all future seminars and past event recordings
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
          width={900}
          height={400}
          contentHeight="350px"
          title={"Membership application"}
        >
  

      {this.props.user === null && (
        <>
          <Box style={{minHeight: "40%"}} />
          <Box direction="row" align="center" gap="10px">
            <LoginModal callback={() => {}} />
            <Text size="14px"> or </Text>
            <SignUpButton callback={() => {}} />
            <Text size="14px"> to apply </Text>
          </Box>
        </>
        )}  



      {!(this.props.user === null) && (
        <OverlaySection>
          <Box width="100%" gap="1px">
            <TextInput
              placeholder="Full name"
              value={this.state.form.fullName}
              onChange={(e: any) => this.handleInput(e, "fullName")}
              />
            </Box>
          <Box width="100%" gap="1px">
            <Select
              placeholder="Education"
              options={titleOptions}
              value={this.state.form.title}
              onChange={({option}) => this.setValueAcademicTitle(option)}
            />
          </Box>
          <Box width="100%" gap="1px">
            <TextInput
              placeholder="Current affiliation"
              value={this.state.form.affiliation}
              onChange={(e: any) => this.handleInput(e, "affiliation")}
              />
          </Box>
          <Box width="100%" gap="1px">
            <TextInput
              placeholder="Email address"
              value={this.state.form.email}
              onChange={(e: any) => this.handleInput(e, "email")}
              />
          </Box>
          <Box width="100%" gap="1px">
            <TextInput
              placeholder="(Personal website)"
              value={this.state.form.personalWebsite}
              onChange={(e: any) => this.handleInput(e, "personalWebsite")}
              />
          </Box>
              </OverlaySection>
        )}
        </Overlay>
      </Box>
    );
  }
}
