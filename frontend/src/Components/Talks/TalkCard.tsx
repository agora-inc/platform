import React, { Component } from "react";
import { Box, Text, Button, Layer, Image} from "grommet";
import Identicon from "react-identicons";
import { Talk, TalkService } from "../../Services/TalkService";
import { ChannelService } from "../../Services/ChannelService";
import { User } from "../../Services/UserService";
import { Link } from "react-router-dom";
import AsyncButton from "../Core/AsyncButton";
import { Calendar, Workshop, UserExpert, LinkNext, FormNextLink } from "grommet-icons";
import { default as TagComponent } from "../Core/Tag";
import Countdown from "./Countdown";
import "../../Styles/talk-card.css"; 
import MediaQuery from "react-responsive";
import { textToLatex } from "../Core/LatexRendering";
import MobileTalkCardOverlay from "../Talks/Talkcard/MobileTalkCardOverlay";
import FooterOverlay from "./Talkcard/FooterOverlay";
import { thisExpression } from "@babel/types";

import MoraStreamLogo from "../../assets/general/mora_simplified_logo.jpeg"

interface Props {
  talk: Talk;
  user: User | null;
  width?: string;
  isCurrent?: boolean;
}

interface State {
  showModal: boolean;
  showShadow: boolean;
  registered: boolean;
  registrationStatus: string;
  available: boolean;
  role: string
}

export default class TalkCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      showShadow: false,
      registered: false,
      registrationStatus: "",
      available: true,
      role: "none"
    };
  }

  componentWillMount() {
    this.fetchRoleInChannel();
    this.checkIfAvailableAndRegistered();
  }
  
  fetchRoleInChannel = () => {
    if (this.props.user !== null) {
      ChannelService.getRoleInChannel(
        this.props.user.id, 
        this.props.talk.channel_id, 
        (role: "none" | "owner" | "member" | "follower") => {
          this.setState(
            {role: role})
        })
      }
    }

  formatDate = (d: string) => {
    const date = new Date(d);
    const dateStr = date.toDateString().slice(0, -4);
    const timeStr = date.toTimeString().slice(0, 5);
    return `${dateStr} ${timeStr}`;
  };

  formatDateFull = (s: string, e: string) => {
    const start = new Date(s);
    const dateStartStr = start.toDateString().slice(0, -4);
    const timeStartStr = start.toTimeString().slice(0, 5);
    const end = new Date(e);
    const dateEndStr = end.toDateString().slice(0, -4);
    const timeEndStr = end.toTimeString().slice(0, 5);
    return `${dateStartStr} ${timeStartStr} - ${timeEndStr} `;
  };

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
    // track click of the event
    if (!(this.state.showModal)){
      TalkService.increaseViewCountForTalk(this.props.talk.id, () => {})
    }
    // toggle Modal
    this.setState({ showModal: !this.state.showModal });
  };

  // method here for mobile
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

  // method here for mobile
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

  // method here for mobile
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

  // method here for mobile
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

  // method here for mobile
  onClick = () => {
    if (this.state.registered) {
      this.unregister();
    } else {
      this.register();
    }
  };

  render() {
    var renderMobileView = (window.innerWidth < 800);
    return (
      <Box 
        className="talk_card_box_1"
        focusIndicator={false}
        height="100%"
        style={{
          maxHeight: renderMobileView && this.state.showModal ? "600px" : "180px",
          position: "relative",
          width: this.props.width ? this.props.width : "32%",
        }}
      >
        {/* <Box
      //   width={this.props.width ? this.props.width : "32%"}
      //   onClick={() => {
      //     !this.state.showModal && this.toggleModal();
      //   }}
      //   focusIndicator={false}
      //   style={{ position: "relative" }}
      // >  */}
        <Box
          onMouseEnter={() => this.setState({ showShadow: true })}
          onMouseLeave={() => {
            if (!this.state.showModal) {
              this.setState({ showShadow: false });
            }
          }}
          onClick={this.toggleModal}
          height="180px"
          width="100%"
          background="white"
          round="xsmall"
          justify="between"
          gap="10px"
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
                    <img
                      src={MoraStreamLogo}
                      height={40}
                      width={40}
                    />
                  )}
                  {!!this.props.talk.has_avatar && (
                    <img
                      src={ChannelService.getAvatar(this.props.talk.channel_id)}
                      height={30}
                      width={30}
                    />
                  )}
                </Box>
                <Text weight="bold" size="14px" color="color3">
                  {this.props.talk.channel_name}
                </Text>
              </Box> 

              <Text
                size="14px"
                color="color1"
                weight="bold"
                style={{ minHeight: "60px", overflow: "auto" }}
              >
                {this.props.talk.name}
              </Text>
            </Box> 
            {this.props.talk.has_speaker_photo === 1 && (
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
                {this.props.isCurrent && (
                  <Text
                    size="16px"
                    color="#5454A0"
                    weight="bold"
                    style={{ height: "20px", fontStyle: "normal" }}
                  >
                    {this.getTimeRemaining()}
                  </Text>
                )}
                {!this.props.isCurrent && (
                  <Text
                    size="14px"
                    color="black"
                    style={{ height: "20px", fontStyle: "normal" }}
                  >
                    {this.formatDate(this.props.talk.date)}
                  </Text>
                )}
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
              {/*this.props.talk.card_visibility !== "Members only" && this.props.talk.visibility === "Members only" && 
                <Box
                  round="xsmall"
                  background="#D3F930"
                  pad="small"
                  justify="center"
                  align="center"
                  width="170px"
                  height="30px"             
                >
                  <Text size="14px" style={{ fontStyle: "normal" }}>
                    on-registration
                  </Text>
                </Box>
            */}
            </Box>
          </Box>
        </Box>
        {this.state.showShadow && (
          <Box
            height="180px"
            width="100%"
            round="xsmall"
            style={{
              zIndex: -1,
              position: "absolute",
              top: 8,
              left: 8,
              opacity: 0.8,
            }}
            background="color1"
          ></Box>
        )}
        {this.state.showModal && 
          <>
          {/* //
          // A. DESKTOP OVERLAY (HACK)
          // */}
          <MediaQuery minDeviceWidth={800}>
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
                height="80%"
                justify="between"
                gap="xsmall"
              >
                <Box
                  style={{ minHeight: "200px", maxHeight: "540px" }}
                  direction="column"
                >
                  <Box direction="row" gap="xsmall" style={{ minHeight: "40px" }}>
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
                            <img
                              src={ChannelService.getAvatar(
                                this.props.talk.channel_id
                              )}
                              height={30}
                              width={30}
                            />
                        </Box>
                        <Box justify="between">
                          <Text weight="bold" size="16px" color="color3">
                            {this.props.talk.channel_name}
                          </Text>
                        </Box>
                      </Box>
                    </Link>
                  </Box>
                  <Text
                    weight="bold"
                    size="18px"
                    color="color1"
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
                        pad={{ left: "6px", top: "4px" }}
                      >
                        <UserExpert size="16px" />
                        <Text
                          size="16px"
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
                      <UserExpert size="16px" />
                      <Text
                        size="16px"
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

                </Box> 
                <FooterOverlay
                  talk={this.props.talk}
                  user={this.props.user}
                  role={this.state.role}
                  available={this.state.available}
                  registered={this.state.registered}
                  registrationStatus={this.state.registrationStatus}
                  isSharingPage={false}
                />
            </Layer>
          </MediaQuery>

          
          {/* //
          // B. MOBILE OVERLAY (HACK; copy-pasting code is ugly (R))
          // */}
          <MediaQuery maxDeviceWidth={800}>
            <MobileTalkCardOverlay
              talk={this.props.talk}
              pastOrFutureTalk="future"
              user={this.props.user}
              registered={this.state.registered}
              registrationStatus={this.state.registrationStatus}
            />
          </MediaQuery>

          </>
        }
      </Box>
    );
  }
}
