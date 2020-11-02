import React, { Component } from "react";
import { Box, Text, Button, Layer, Image} from "grommet";
import { Talk, TalkService } from "../../Services/TalkService";
import { ChannelService } from "../../Services/ChannelService";
import { User } from "../../Services/UserService";
import { Link } from "react-router-dom";
import { Tag } from "../../Services/TagService";
import AsyncButton from "../Core/AsyncButton";
import { Calendar, Workshop, UserExpert } from "grommet-icons";
import { default as TagComponent } from "../Core/Tag";
import AddToCalendarButtons from "./AddToCalendarButtons";
import CountdownAndCalendarButtons from "./CountdownAndCalendarButtons";
import LoginModal from "../Account/LoginModal";
import SignUpButton from "../Account/SignUpButton";
import "../../Styles/talk-card.css"; 
import MediaQuery from "react-responsive";


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
  available: boolean;
}

export default class TalkCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      showShadow: false,
      registered: false,
      available: true,
    };
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

  escapeDoubleQuotes = (text: string) => {
    return text.replace("''", "'")
  }

  getTimeRemaining = (): string => {
    const end = new Date(this.props.talk.end_date);
    const now = new Date();
    const deltaSec = Math.floor((end.valueOf() - now.valueOf()) / 1000);
    if (deltaSec < 60) {
      return `Finishing in ${deltaSec}s`;
    }
    if (deltaSec < 3600) {
      let deltaMin = Math.floor(deltaSec / 60);
      return `Finishing in ${deltaMin}m`;
    }
    let deltaHour = Math.floor(deltaSec / 3600);
    let remainderMin = Math.floor((deltaSec % 3600) / 60);
    return `Finishing in ${deltaHour}h ${remainderMin}m`;
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  componentWillMount() {
    this.checkIfAvailableAndRegistered();
  }

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
      TalkService.isRegisteredForTalk(
        this.props.talk.id,
        this.props.user.id,
        (registered: any) => {
          this.setState({ registered });
        }
      );
  };

  register = () => {
    this.props.user &&
      TalkService.registerForTalk(
        this.props.talk.id,
        this.props.user.id,
        () => {
          // this.toggleModal();
          this.checkIfRegistered();
          this.setState({
            showShadow: false,
          });
        }
      );
  };

  unregister = () => {
    this.props.user &&
      TalkService.unRegisterForTalk(
        this.props.talk.id,
        this.props.user.id,
        () => {
          // this.toggleModal();
          this.checkIfRegistered();
          this.setState({
            showShadow: false,
          });
        }
      );
  };

  onClick = () => {
    if (this.state.registered) {
      this.unregister();
    } else {
      this.register();
    }
  };

  render() {
    var breakpoint_width = 992;
    return (
      <div className="talk_card_box_1" style={{"width": this.props.width ? this.props.width : "32%"}} onClick={() => {
            !this.state.showModal && this.toggleModal();
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
          height="100%"
          width="100%"
          background="white"
          round="xsmall"
          justify="between"
          gap="100px"
          overflow="hidden"
        >
          <Box height="100%" pad="10px">
            <Box
              direction="row"
              gap="xsmall"
              align="center"
              style={{ height: "40px" }}
              margin={{ bottom: "10px" }}
            >
              <Box
                round="15px"
                justify="center"
                align="center"
                background="#efeff1"
                overflow="hidden"
                style = {{ minWidth: "30px", minHeight: "30px" }}
              >
                  <Image
                    src={ChannelService.getAvatar(this.props.talk.channel_id)}
                    height={30}
                    width={30}
                    fit="contain"
                  />
              </Box>
              <Text weight="bold" size="16px" color="grey">
                {this.props.talk.channel_name}
              </Text>
            </Box>
            <Text
              size="18px"
              color="black"
              weight="bold"
              style={{ minHeight: "75px", overflow: "auto" }}
            >
              {this.props.talk.name}
            </Text>
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
            <Box direction="row" gap="small">
              <Calendar size="18px" />
              <Box direction="row" width="100%">
                {this.props.isCurrent && (
                  <Text
                    size="18px"
                    color="#5454A0"
                    weight="bold"
                    style={{ height: "20px", fontStyle: "normal" }}
                  >
                    {this.getTimeRemaining()}
                  </Text>
                )}
                {!this.props.isCurrent && (
                  <Text
                    size="18px"
                    color="black"
                    style={{ height: "30px", fontStyle: "normal" }}
                  >
                    {this.formatDate(this.props.talk.date)}
                  </Text>
                )}
              </Box>
              {this.props.talk.card_visibility === "Members only" && 
                <Box
                  round="xsmall"
                  background="#C2C2C2"
                  pad="xsmall"
                  justify="center"
                  align="center"
                  width="160px"                
                >
                  <Text size="14px">
                    Members only
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
            background={this.props.talk.channel_colour}
          ></Box>
        )}
        {this.state.showModal && 
          <>
          {/* //
          // A. DESKTOP OVERLAY (HACK)
          // */}
          <MediaQuery minDeviceWidth={breakpoint_width}>
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
                            <img
                              src={ChannelService.getAvatar(
                                this.props.talk.channel_id
                              )}
                              height={30}
                              width={30}
                            />
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

                  <Text
                    size="16px"
                    color="black"
                    style={{
                      minHeight: "50px",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                    margin={{ top: "10px", bottom: "10px" }}
                  >
                    {this.escapeDoubleQuotes(this.props.talk.description)}
                  </Text>
                </Box>
                <Box direction="column" gap="small">
                  <Box direction="row" gap="small" height="30px">
                    <Box 
                      direction="row" 
                      gap="small" 
                      alignSelf="center"
                      width="100%"
                    >
                      <Calendar size="18px"  />
                      <Text
                        size="18px"
                        color="black"
                      >
                        {this.formatDateFull(
                          this.props.talk.date,
                          this.props.talk.end_date
                        )}
                      </Text>
                    </Box>
                    {/*this.props.talk.card_visibility === "Members only" && 
                      <Box
                        round="xsmall"
                        background="#C2C2C2"
                        pad="small"
                        justify="center"
                        align="center"
                        width="33%"                
                      >
                        <Text size="14px">
                          Members only
                        </Text>
                      </Box>
                        */}
                  </Box>
                  {this.state.available && (
                    <Box margin={{ top: "10px", bottom: "20px" }}>
                      <CountdownAndCalendarButtons talk={this.props.talk} />
                      {this.props.user !== null && this.state.registered && (
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
                      )}
                    </Box>
                  )}
                  {this.state.available &&
                    this.props.user !== null &&
                    !this.state.registered && (
                      <Box
                        onClick={this.onClick}
                        background="#7E1115"
                        round="xsmall"
                        pad="xsmall"
                        height="40px"
                        justify="center"
                        align="center"
                        focusIndicator={false}
                        hoverIndicator="#5A0C0F"
                      >
                        <Text size="18px">Register</Text>
                      </Box>
                    )}
                  {!this.state.available && this.props.user === null && (
                    <Box direction="row" align="center" gap="10px">
                      <LoginModal callback={() => {}} />
                      <Text size="18px"> or </Text>
                      <SignUpButton callback={() => {}} />
                      <Text size="18px"> to register </Text>
                    </Box>
                  )}

                  {/*
                    <Box
                      direction="row"
                      width="100%"
                      margin="none"
                      pad="small"
                      justify="center"
                      round="xsmall"
                      align="center"
                      alignSelf="center"
                      background="#F3EACE"
                  >
                    <Text size="18px" weight="bold" color="grey">
                      Log in to register
                    </Text>
                  </Box>
                    */}
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
                    {`Sorry, the link to talk is only available to ${
                      this.props.talk.visibility === "Followers and members"
                        ? "followers and members"
                        : "members"
                    }
                    of ${this.props.talk.channel_name}`}
                  </Text>
                </Box>
              )}
            </Layer>
          </MediaQuery>




          
          {/* //
          // B. MOBILE OVERLAY (HACK; copy-pasting code is ugly (R))
          // */}
         <MediaQuery maxDeviceWidth={breakpoint_width}>
            <Layer
              onClick={() => {
                this.toggleModal();
                this.setState({ showShadow: false });
              }}
              modal
              responsive
              animation="fadeIn"
              style={{
                width: "100%",
                height: "100%",
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
                gap="small"
              >
                <Box
                  style={{ minHeight: "200px", maxHeight: "400px", marginTop:"50px"}}
                  direction="column"
                >
                  <Box direction="row" gap="xsmall" style={{ minHeight: "30px", marginTop:"10px"}}>
                    {/* <Link
                      className="channel"
                      to={`/${this.props.talk.channel_name}`}
                      style={{ textDecoration: "none" }}
                    > */}
                      <Box
                        direction="row"
                        gap="small"
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
                          <Text weight="bold" size="18px" color="grey">
                            {this.props.talk.channel_name}
                          </Text>
                        </Box>
                      </Box>
                    {/* </Link> */}
                  </Box>
                  <Text
                    weight="bold"
                    size="21px"
                    color="black"
                    style={{
                      minHeight: "50px",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                    margin={{ bottom: "20px", top: "30px" }}
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

                  <Text
                    size="16px"
                    color="black"
                    style={{
                      minHeight: "50px",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                    margin={{ top: "10px", bottom: "10px" }}
                  >
                    {this.escapeDoubleQuotes(this.props.talk.description)}
                  </Text>
                </Box>
                <Box direction="column" gap="small">
                  <Box direction="row" gap="small" height="30px">
                    <Box 
                      direction="row" 
                      gap="small" 
                      alignSelf="center"
                      width="100%"
                    >
                      <Calendar size="18px"  />
                      <Text
                        size="18px"
                        color="black"
                      >
                        {this.formatDateFull(
                          this.props.talk.date,
                          this.props.talk.end_date
                        )}
                      </Text>
                    </Box>
                    {/*this.props.talk.card_visibility === "Members only" && 
                      <Box
                        round="xsmall"
                        background="#C2C2C2"
                        pad="small"
                        justify="center"
                        align="center"
                        width="33%"                
                      >
                        <Text size="14px">
                          Members only
                        </Text>
                      </Box>
                        */}
                  </Box>
                  {this.state.available && (
                    <Box margin={{ top: "10px", bottom: "20px" }}>
                      <CountdownAndCalendarButtons talk={this.props.talk} />
                      {/* {this.props.user !== null && this.state.registered && (
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
                      )
                      } */}
                    </Box>
                  )}
                  {/* {this.state.available &&
                    this.props.user !== null &&
                    !this.state.registered && (
                      <Box
                        onClick={this.onClick}
                        background="#7E1115"
                        round="xsmall"
                        pad="xsmall"
                        height="40px"
                        justify="center"
                        align="center"
                        focusIndicator={false}
                        hoverIndicator="#5A0C0F"
                      >
                        <Text size="18px">Register</Text>
                      </Box>
                    )} */}
                  {!this.state.available && this.props.user === null && (
                    <Text>Link available to members  followers only.</Text>
                    // <Box direction="row" align="center" gap="10px">
                    //   <LoginModal callback={() => {}} />
                    //   <Text size="18px"> or </Text>
                    //   <SignUpButton callback={() => {}} />
                    //   <Text size="18px"> to register </Text>
                    // </Box>
                  )}

                  {/*
                    <Box
                      direction="row"
                      width="100%"
                      margin="none"
                      pad="small"
                      justify="center"
                      round="xsmall"
                      align="center"
                      alignSelf="center"
                      background="#F3EACE"
                  >
                    <Text size="18px" weight="bold" color="grey">
                      Log in to register
                    </Text>
                  </Box>
                    */}
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
                    {`Sorry, the link to talk is only available to ${
                      this.props.talk.visibility === "Followers and members"
                        ? "followers and members"
                        : "members"
                    }
                    of ${this.props.talk.channel_name}`}
                  </Text>
                </Box>
              )}
            </Layer>
          </MediaQuery>
          </>
        }
      {/* </Box> */}
      </div>
    );
  }
}
