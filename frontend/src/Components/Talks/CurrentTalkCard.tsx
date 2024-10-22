import React, { Component } from "react";
import { Box, Text, Button, Layer, Image } from "grommet";
import { Talk, TalkService } from "../../Services/TalkService";
import { ChannelService } from "../../Services/ChannelService";
import { User } from "../../Services/UserService";
import { Calendar, Workshop, UserExpert } from "grommet-icons";
import { Link } from "react-router-dom";
import Identicon from "react-identicons";
import Countdown from "./Countdown";
import LoginModal from "../Account/LoginModal";
import SignUpButton from "../Account/SignUpButton";
import { textToLatex } from "../Core/LatexRendering";
import "../Styles/all-agoras-page.css";

interface Props {
  talk: Talk;
  user: User | null;
  width?: string;
}

interface State {
  showModal: boolean;
  showShadow: boolean;
  registered: boolean;
  registrationStatus: string;
  available: boolean;
}

export default class CurrentTalkCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      showShadow: false,
      registered: false,
      registrationStatus: "",
      available: true,
    };
  }

  componentWillMount() {
    this.checkIfAvailableAndRegistered();
  }

  getTimeRemaining = (): string => {
    const end = new Date(this.props.talk.end_date);
    const now = new Date();
    let deltaMin = Math.floor((end.valueOf() - now.valueOf()) / (60*1000));
    let message = deltaMin < 0 ? "Finished " : "Finishing in ";
    const suffix = deltaMin < 0 ? " ago" : "";
    deltaMin = Math.abs(deltaMin)
    
    let hours =  Math.floor(deltaMin / 60);
    let minutes =  Math.floor(deltaMin % 60);
    if (hours > 0) {
      message += `${hours}h `
    }  
    if (minutes > 0) {
      message += `${minutes}m `
    }  
    return message + suffix
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal, showShadow: true });
  };

  checkIfAvailableAndRegistered = () => {
    if (this.props.user) {
      TalkService.isAvailableToUser(
        this.props.user.id,
        this.props.talk.id,
        (available: boolean) => {
          this.setState({ available }, () => {
            if (available) {
              this.checkIfRegistered();
            }
          });
        }
      );
    } else {
      this.setState({
        available:
          this.props.talk.visibility === "Everybody" ||
          this.props.talk.visibility === null,
      });
    }
  };

  checkIfRegistered = () => {
    this.props.user &&
      TalkService.registrationStatusForTalk(
        this.props.talk.id,
        this.props.user.id,
        (status: string) => {
          this.setState({ 
            registered: (status === "accepted"), 
            registrationStatus: status 
        });
        }
      );
  };

  register = () => {
    // this.props.user &&
    //   TalkService.registerForTalk(
    //     this.props.talk.id,
    //     this.props.user.id,
    //     () => {
    //       // this.toggleModal();
    //       this.checkIfRegistered();
    //       this.setState({
    //         showShadow: false,
    //       });
    //     }
    //   );
  };

  unregister = () => {
    // this.props.user &&
    //   TalkService.unRegisterForTalk(
    //     this.props.talk.id,
    //     this.props.user.id,
    //     () => {
    //       // this.toggleModal();
    //       this.checkIfRegistered();
    //       this.setState({
    //         showShadow: false,
    //       });
    //     }
    //   );
  };

  getSpeakerPhotoUrl = (): string | undefined => {
    return TalkService.getSpeakerPhoto(this.props.talk.id)
  }

  onClick = () => {
    if (this.state.registered) {
      this.unregister();
    } else {
      this.register();
    }
  };

  render() {
    return (
      <Box
        width={this.props.width ? this.props.width : "32%"}
        height="180px"
        onClick={() => {
          !this.state.showModal && this.toggleModal();
        }}
        focusIndicator={false}
        style={{ position: "relative" }}
        margin={{ bottom: "small" }}
      >
        <Box
          onMouseEnter={() => this.setState({ showShadow: true })}
          onMouseLeave={() => {
            if (!this.state.showModal) {
              this.setState({ showShadow: false });
            }
          }}
          height="100%"
          width="100%"
          background="white"
          round="xsmall"
          justify="between"
          gap="small"
          overflow="hidden"
        >
          <Box height="100%" pad="10px">



            <Box direction="column" width={this.props.talk.has_speaker_photo === 1 ? "65%" : "80%"} margin={{bottom: "10px"}}> 
              <Box
                direction="row"
                gap="xsmall"
                align="center"
                style={{ height: "45px" }}
                margin={{ bottom: "15px" }}
              >
                <Box
                  height="30px"
                  width="30px"
                  round="15px"
                  justify="center"
                  align="center"
                  background="#efeff1"
                  overflow="hidden"
                >
                  {!this.props.talk.has_avatar && (
                    <Identicon string={this.props.talk.channel_name} size={15} />
                  )}
                  {!!this.props.talk.has_avatar && (
                    <img
                      src={ChannelService.getAvatar(this.props.talk.channel_id)}
                      height={30}
                      width={30}
                    />
                  )}
                </Box>
                <Text weight="bold" size="14px" color="grey">
                  {this.props.talk.channel_name}
                </Text>
              </Box> 

              <Text
                size="14px"
                color="black"
                weight="bold"
                style={{ minHeight: "60px", overflow: "auto" }}
              >
                {this.props.talk.name}
              </Text>
            </Box> 

            {this.props.talk.has_speaker_photo && (
              <Box width="40%">
                <Image 
                  style={{position: 'absolute', top: 10, right: 10, aspectRatio: "3/2"}}
                  src={this.getSpeakerPhotoUrl()}
                  width="30%"
                />
              </Box>
            )}
            <Box direction="row" gap="small">
              <UserExpert size="18px" />
              <Text
                size="14px"
                color="black"
                style={{
                  height: "30px",
                  overflow: "auto",
                  fontStyle: "italic",
                }}
                margin={{ bottom: "10px" }}
              >
                {this.props.talk.talk_speaker
                  ? this.props.talk.talk_speaker
                  : "TBA"}
              </Text>
            </Box>
            <Box direction="row" gap="small">
              <Calendar size="14px" />
              <Box direction="row" width="100%">
                <Text
                  size="18px"
                  color="#5454A0"
                  weight="bold"
                  style={{ height: "20px", fontStyle: "normal" }}
                >
                  {this.getTimeRemaining()}
                </Text>
              </Box>
              {this.props.talk.card_visibility === "Members only" &&
                <Box
                  round="xsmall"
                  background="#EAF1F1"
                  pad="xsmall"
                  justify="center"
                  align="center"
                  width="160px"
                >
                  <Text size="12px">
                    member-only
                  </Text>
                </Box>
              }
            </Box>
          </Box>
        </Box>
        {this.state.showShadow && (
          <Box
            height="100%"
            width="100%"
            round="xsmall"
            style={{
              zIndex: -1,
              position: "absolute",
              top: 8,
              left: 8,
              opacity: 0.5,
            }}
            background="#BAD6DB"
          ></Box>
        )}
        {this.state.showModal && (
          <Layer
            onEsc={() => {
              this.toggleModal();
              this.setState({ showShadow: false });
            }}
            onClickOutside={() => {
              this.toggleModal();
              this.setState({ showShadow: false });
            }}
            modal
            responsive
            animation="fadeIn"
            style={{
              width: 640,
              height: this.state.registered ? 640 : 540,
              borderRadius: 15,
              overflow: "hidden",
            }}
          >
            <Box
              //align="center"
              pad="25px"
              // width="100%"
              height="100%"
              justify="between"
              gap="xsmall"
            >
              <Box
                style={{ minHeight: "200px", maxHeight: "540px" }}
                direction="column"
              >
                <Box direction="row" gap="xsmall" style={{ minHeight: "30px" }}>
                  <Link
                    className="channel"
                    to={`/${this.props.talk.channel_name}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      direction="row"
                      gap="xsmall"
                      align="center"
                      round="xsmall"
                      pad={{ vertical: "6px", horizontal: "6px" }}
                    >
                      <Box
                        justify="center"
                        align="center"
                        background="#efeff1"
                        overflow="hidden"
                        style={{
                          minHeight: 30,
                          minWidth: 30,
                          borderRadius: 15,
                        }}
                      >
                        {!this.props.talk.has_avatar && (
                          <Identicon
                            string={this.props.talk.channel_name}
                            size={30}
                          />
                        )}
                        {!!this.props.talk.has_avatar && (
                          <img
                            src={ChannelService.getAvatar(
                              this.props.talk.channel_id
                            )}
                            height={30}
                            width={30}
                          />
                        )}
                      </Box>
                      <Box justify="between">
                        <Text weight="bold" size="18px" color="grey">
                          {this.props.talk.channel_name}
                        </Text>
                      </Box>
                    </Box>
                  </Link>
                </Box>
                <Text
                  weight="bold"
                  size="21px"
                  color="black"
                  style={{
                    minHeight: "50px",
                    maxHeight: "120px",
                    overflowY: "auto",
                  }}
                  margin={{ bottom: "20px", top: "10px" }}
                >
                  {this.props.talk.name}
                </Text>

                {this.props.talk.talk_speaker_url && (
                  <a href={this.props.talk.talk_speaker_url} target="_blank">
                    <Box
                      direction="row"
                      gap="small"
                      onClick={() => {}}
                      hoverIndicator={true}
                      pad={{ left: "6px", top: "4px" }}
                    >
                      <UserExpert size="18px" />
                      <Text
                        size="18px"
                        color="black"
                        style={{
                          height: "24px",
                          overflow: "auto",
                          fontStyle: "italic",
                        }}
                      >
                        {this.props.talk.talk_speaker
                          ? this.props.talk.talk_speaker
                          : "TBA"}
                      </Text>
                    </Box>
                  </a>
                )}

                {!this.props.talk.talk_speaker_url && (
                  <Box direction="row" gap="small">
                    <UserExpert size="18px" />
                    <Text
                      size="18px"
                      color="black"
                      style={{
                        height: "30px",
                        overflow: "auto",
                        fontStyle: "italic",
                      }}
                      margin={{ bottom: "10px" }}
                    >
                      {this.props.talk.talk_speaker
                        ? this.props.talk.talk_speaker
                        : "TBA"}
                    </Text>
                  </Box>
                )}
                <Box
                  style={{
                    minHeight: "50px",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                  margin={{ top: "10px", bottom: "10px" }}
                >
                  {this.props.talk.description.split('\n').map(
                    (item, i) => textToLatex(item)
                  )}
                </Box>
              </Box>
              <Box direction="column" gap="small">
                <Box direction="row" gap="small">
                  <Calendar size="18px" />
                  <Text
                    size="18px"
                    color="#5454A0"
                    weight="bold"
                    style={{ height: "20px", fontStyle: "normal" }}
                  >
                    {this.getTimeRemaining()}
                  </Text>
                </Box>
                {this.state.registered && (
                  <Box margin={{ top: "10px", bottom: "20px" }}>
                    <Countdown talk={this.props.talk} />
                    <Box
                      focusIndicator={false}
                      background="#FF4040"
                      round="xsmall"
                      pad="xsmall"
                      justify="center"
                      align="center"
                      width="20%"
                      height="35px"
                      onClick={this.onClick}
                      margin={{ top: "-35px" }}
                      alignSelf="end"
                      hoverIndicator={true}
                    >
                      <Text size="14px" weight="bold">
                        Unregister
                      </Text>
                    </Box>
                  </Box>
                )}
                {this.state.available &&
                  this.props.user !== null &&
                  !this.state.registered && (
                    <Box
                      onClick={this.onClick}
                      background="#0C385B"
                      round="xsmall"
                      pad="xsmall"
                      height="40px"
                      justify="center"
                      align="center"
                      focusIndicator={false}
                      hoverIndicator="#BAD6DB"
                    >
                      <Text size="18px">Register</Text>
                    </Box>
                  )}
                {this.state.available && this.props.user === null && (
                  <Box direction="row" align="center" gap="10px">
                    <LoginModal callback={() => {}} />
                    <Text size="18px"> or </Text>
                    <SignUpButton callback={() => {}} />
                    <Text size="18px"> to register </Text>
                  </Box>
                )}
              </Box>
            </Box>
            {!this.state.available && (
              <Box
                background="#d5d5d5"
                pad="small"
                align="center"
                justify="center"
              >
                <Text textAlign="center" weight="bold">
                  {`Sorry, this talk is only available to ${
                    this.props.talk.visibility === "Followers and members"
                      ? "followers and members"
                      : "members"
                  }
                  of ${this.props.talk.channel_name}`}
                </Text>
              </Box>
            )}
          </Layer>
        )}
      </Box>
    );
  }
}
