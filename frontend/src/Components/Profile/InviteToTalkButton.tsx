import React, { Component } from "react";
import {
  Box,
  TextInput,
  TextArea,
  Text
} from "grommet";
import { Overlay, OverlaySection } from "../Core/Overlay";
import ReactTooltip from "react-tooltip";
import { Channel, ChannelService } from "../../Services/ChannelService"
import { User } from "../../Services/UserService"
import { UserService } from "../../Services/UserService"
import { Profile, ProfileService } from "../../Services/ProfileService";
import { Workshop } from "grommet-icons";
import CreateChannelButton from "../Channel/CreateChannelButton";
import CreateChannelOverlay from "../Channel/CreateChannelButton/CreateChannelOverlay";

interface Props {
  profile: Profile;
  presentationName: string;
  widthButton?: string;
  textButton?: string;
}

interface State {
    content: {
        contactEmail: string,
        date: string,
        message: string,
        hostingChannel: Channel | null,
      },
    ownedChannels: Channel[]
    showForm: boolean;
    showCreateChannelOverlay: boolean;
    invitingUser: User | null;
}

export default class InviteToTalkButton extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
        content: {
            contactEmail: "",
            date: "",
            message: "",
            hostingChannel: null
        },
        showForm: false,
        ownedChannels: [],
        showCreateChannelOverlay: false,
        invitingUser: UserService.getCurrentUser()
    };
    if(this.state.invitingUser){
      ChannelService.getChannelsForUser(this.state.invitingUser.id, ["owner"], 
      (res: Channel[]) =>{
        this.setState({ownedChannels: res})
        }
      )
    }
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
    if (this.state.content.hostingChannel && this.state.invitingUser){
      ProfileService.sendTalkInvitation(
        this.state.invitingUser.id,
        this.props.profile.user.id,
        this.state.content.hostingChannel.id,
        this.state.content.date,
        this.state.content.message,
        this.state.content.contactEmail,
        this.props.presentationName,
        (answer: any) => {
          console.log("Successful application!" + answer)
        }
      );
    }

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
          hostingChannel: null
      },
      }
    );
  };

  toggleModal = () => {
    this.setState({ showForm: !this.state.showForm });
    this.handleClearForm()
  };

  isComplete = () => {
    return (
      this.state.content.message !== "" &&
      this.state.content.contactEmail !== "" &&
      this.state.content.hostingChannel !== null
    );
  };

  isMissing = () => {
    let res: string[] = []
    if (!this.state.content.hostingChannel) {
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

  toggleCreateChannelOverlay = () => {
    this.setState({
      showCreateChannelOverlay: !this.state.showCreateChannelOverlay,
    });
  };

  render() {
    return (
      <Box>
        <Box
          width={this.props.widthButton ? this.props.widthButton : "15vw"}
          data-tip data-for='invite_speaker'
          margin={{ top: "20px", bottom: "20px" }}
          onClick={() => this.setState({ showForm: true })}
          background="#0C385B"
          round="xsmall"
          // pad={{bottom: "3px", top: "6px", left: "3px", right: "3px"}}
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
          contentHeight="350px"
          title={this.state.content.hostingChannel 
            ? "Invite " + this.props.profile.full_name + " to talk within " + "'" + this.state.content.hostingChannel.name + "'"
            : "Invite " + this.props.profile.full_name + " to give a talk"}
        >

          {/* IF ADMIN HASN'T SELECTED AN AGORA + ADMIN DOES NOT HAVE AN AGORA */}
          {((!(this.state.content.hostingChannel)) && this.state.ownedChannels.length == 0) && (
            <OverlaySection>
                You must first create your community page before inviting speakers.
                <CreateChannelButton
                    // height="50px"
                  onClick={this.toggleCreateChannelOverlay}
                />
              </OverlaySection>
            )}

            {this.state.showCreateChannelOverlay && (
              <CreateChannelOverlay
                onBackClicked={this.toggleCreateChannelOverlay}
                onComplete={() => {
                  this.toggleCreateChannelOverlay();
                }}
                visible={true}
                user={this.state.invitingUser}
                />
              )}


          {/* IF ADMIN HASN'T SELECTED AN AGORA + HAS AGORAS */}
          {(!(this.state.content.hostingChannel) && this.state.ownedChannels.length > 0) && (
            <OverlaySection>
                {/* select an agora */}
                Select your hosting channel.

                <Box height="80%" margin={{ bottom: "15px", left:"8px", top: "8px" }} overflow="scroll">
                        {this.state.ownedChannels.map((channel: Channel) => (
                            <Box
                              direction="row"
                              gap="xsmall"
                              // align="center"
                              pad="small"
                              justify="start"
                              onClick={()=>{this.setState(
                                (prevState: any) => ({
                                  content: { ...prevState.content, hostingChannel: channel }
                                }))}}
                              hoverIndicator={true}
                            >
                              <Box
                                background="white"
                                justify="center"
                                align="center"
                                overflow="hidden"
                                style={{
                                  minHeight: 30,
                                  minWidth: 30,
                                  maxHeight: 30,
                                  maxWidth: 30,
                                  borderRadius: 15,
                                }}
                              >
                              <img
                                  src={ChannelService.getAvatar(channel.id)}
                                  height={30}
                                  width={30}
                              />
                              </Box>
                              <Text size="14px" style={{justifyContent:"center"}}> 
                                  {channel.name}
                              </Text>
                            </Box>
                        ))}
                      </Box>
              </OverlaySection>
            )}

          {/* AFTER ADMIN SELECTED AGORA */}
          {(this.state.content.hostingChannel) && (
            <OverlaySection>
              <Box width="100%" gap="2px">
                <TextArea
                  placeholder={"Your message to " + this.props.profile.full_name}
                  value={this.state.content.message}
                  onChange={(e: any) => this.handleInput(e, "message")}
                  rows={8}
                  />
              </Box>
              <Box width="100%" gap="2px">
                <TextInput
                  placeholder="Talk dates (if any)"
                  value={this.state.content.date}
                  onChange={(e: any) => this.handleInput(e, "date")}
                  />
              </Box>
              <Box width="100%" gap="2px">
                <TextInput
                  placeholder={"Contact email to which " + this.props.profile.full_name + " will answer"}
                  value={this.state.content.contactEmail}
                  onChange={(e: any) => this.handleInput(e, "contactEmail")}
                  />
              </Box>
              </OverlaySection>
            )}

        </Overlay>
      </Box>
    );
  }
}
