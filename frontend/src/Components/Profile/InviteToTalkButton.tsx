import React, { Component } from "react";
import {
  Box,
  TextInput,
  TextArea,
} from "grommet";
import { Overlay, OverlaySection } from "../Core/Overlay";
import ReactTooltip from "react-tooltip";
import { Profile } from "../../Services/ProfileService"
import { ProfileService } from "../../Services/ProfileService";
import { Workshop } from "grommet-icons";

interface Props {
  invitingUserId: number;
  profile: Profile;
  widthButton?: string;
  textButton?: string;
}

interface State {
    content: {
        contactEmail: string,
        date: string,
        message: string,
        channelId: number
    },
    showForm: boolean;
}

export default class InviteToTalkButton extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
        content: {
            contactEmail: "",
            date: "",
            message: "",
            channelId: -1
        },
        showForm: false,
    };
  }

  handleInput = (e: any, key: string) => {
    let value = e.target.value;
    this.setState((prevState: any) => ({
      content: { ...prevState.content, [key]: value }
    }));
  };

  handleFormSubmit = (e: any) => {
    // prevents the page from bein
    e.preventDefault();
    this.contactSpeaker();
    this.setState({ showForm: false });
  };

  contactSpeaker = () => {
    ProfileService.sendTalkInvitation(
      this.props.invitingUserId,
      this.props.profile.user.id,
      this.state.content.channelId,
      this.state.content.date,
      this.state.content.message,
      this.state.content.contactEmail,
      //TODO: Error handling
      (answer: any) => {
        console.log("Successful application!")
      }
     );


    // TODO: add error handling if email is not succesffully sent.
    this.handleClearForm();
    };

  handleClearForm = () => {
    // prevents the page from being refreshed on form submission
    this.setState({
      content: {
          contactEmail: "",
          message: "",
          date: "",
          channelId: -1
      },
      }
    );
  };

  toggleModal = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  isComplete = () => {
    return (
      this.state.content.message !== "" &&
      this.state.content.contactEmail !== "" &&
      this.state.content.channelId !== -1
    );
  };

  isMissing = () => {
    let res: string[] = []
    if (this.state.content.channelId === -1) {
      res.push("Channel name")
    }
    if (this.state.content.message === "") {
      res.push("content")
    }
    if (this.state.content.contactEmail === "") {
      res.push("Contact email")
    }
    return res;
  }

  render() {
    return (
      <Box>
        <Box
          width={this.props.widthButton ? this.props.widthButton : "15vw"}
          data-tip data-for='invite_speaker'
          margin={{ top: "20px", bottom: "40px", left: "10px" }}
          onClick={() => this.setState({ showForm: true })}
          background="#0C385B"
          round="xsmall"
          pad={{bottom: "3px", top: "6px", left: "3px", right: "3px"}}
          height="40px"
          justify="center"
          align="center"
          focusIndicator={false}
          // hoverIndicator="#2433b5"
          hoverIndicator="#BAD6DB"
          direction="row"
        >
          <Workshop style={{marginRight:"5px"}} />
            {this.props.textButton ? this.props.textButton : "Invite to speak"}
            <ReactTooltip id="invite_speaker" effect="solid">
              {this.props.profile.full_name} is looking to give talks: invite him!
            </ReactTooltip>
        </Box>
        <Overlay
          visible={this.state.showForm}
          onEsc={this.toggleModal}
          onCancelClick={this.toggleModal}
          onClickOutside={this.toggleModal}
          onSubmitClick={this.handleFormSubmit}
          submitButtonText="Send"
          canProceed={this.isComplete()}
          isMissing={this.isMissing()}
          width={900}
          height={500}
          contentHeight="400px"
          title={"Inviting " + this.props.profile.full_name + " to give a talk"}
        >

        <OverlaySection>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Your channel name"
              value={this.state.content.channelId}
              onChange={(e: any) => this.handleInput(e, "channelId")}
              />
            </Box>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Prefered dates (if any)"
              value={this.state.content.date}
              onChange={(e: any) => this.handleInput(e, "date")}
              />
          </Box>
          <Box width="100%" gap="2px">
            <TextArea
              placeholder={"Your message"}
              value={this.state.content.message}
              onChange={(e: any) => this.handleInput(e, "message")}
              rows={8}
              />
          </Box>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Contact email"
              value={this.state.content.contactEmail}
              onChange={(e: any) => this.handleInput(e, "contactEmail")}
              />
          </Box>
          </OverlaySection>
        </Overlay>
      </Box>
    );
  }
}
