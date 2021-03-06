import React, { Component } from "react";
import { Box, Text, Button, Layer } from "grommet";
import Identicon from "react-identicons";
import { Calendar, Workshop, UserExpert } from "grommet-icons";
import { User } from "../../Services/UserService";
import { Tag } from "../../Services/TagService";
import { Link } from "react-router-dom";
import { Talk, TalkService } from "../../Services/TalkService";
import EditTalkModal from "../Talks/EditTalkModal";
import { default as TagComponent } from "../Core/Tag";
import { ChannelService } from "../../Services/ChannelService";
import Countdown from "../Talks/Countdown";
import AsyncButton from "../Core/AsyncButton";
import TalkCard from "../Talks/TalkCard";
import LoginModal from "../Account/LoginModal";
import SignUpButton from "../Account/SignUpButton";
import RequestMembershipButton from "./ApplyMembershipButton";
import { thisExpression } from "@babel/types";
import { textToLatex } from "../Core/LatexRendering";
import FooterOverlay from "../Talks/Talkcard/FooterOverlay";

interface Props {
  talk: Talk;
  user: User | null;
  admin: boolean;
  role?: string;
  width?: any;
  margin?: any;
  isCurrent?: boolean;
  show?: boolean;
  following: boolean;
  onEditCallback?: any;
  callback?: any;
}

interface State {
  showModal: boolean;
  showEdit: boolean;
  available: boolean;
  registered: boolean;
  showShadow: boolean;
}

export default class ChannelPageTalkCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: this.props.show ? this.props.show && !this.props.admin : false,
      showEdit: false,
      available: false,
      registered: false,
      showShadow: false,
    };
  }

  componentDidMount = () => {
    this.checkIfUserCanAccessLink();
    this.checkIfUserCanViewCard();
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
      TalkService.isRegisteredForTalk(
        this.props.talk.id,
        this.props.user.id,
        (registered: boolean) => {
          this.setState({ registered });
        }
      );
  };


  checkIfUserCanAccessLink = () => {
    if (this.props.admin) {
      return true;
    }
    else
      if (this.props.talk.visibility == "Everybody") {
        return true;
      }
      else if (this.props.talk.visibility == "Followers and members") {
        if (this.props.following || this.props.role === "follower" || this.props.role === "member") {
          return true;
        }
        else {
          return false;
        }
      }
      else if (this.props.talk.visibility == "Members only") {
        if (this.props.role === "member"){
          return true;
        }
        else {
          return false;
        }
      }
  };

  checkIfUserCanViewCard = (): boolean => {
    if (this.props.admin) {
      return true;
    }
    else {
      if (this.props.talk.card_visibility == "Everybody") {
        return true;
      }
      else if (this.props.talk.card_visibility === "Followers and members") {
        if (this.props.role === "follower" || this.props.role === "member") {
          return true;
        }
        else {
          return false;
        };
      }
      else if (this.props.talk.card_visibility == "Members only") {
        if (this.props.role === "member") {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
  };

  register = () => {
    // this.props.user &&
    //   TalkService.registerForTalk(
    //     this.props.talk.id,
    //     this.props.user.id,
    //     () => {
    //       this.checkIfRegistered();
    //     }
    //   );
  };

  unregister = () => {
    // this.props.user &&
    //   TalkService.unRegisterForTalk(
    //     this.props.talk.id,
    //     this.props.user.id,
    //     () => {
    //       this.checkIfRegistered();
    //     }
    //   );
  };

  onClick = () => {
    if (this.state.registered) {
      this.unregister();
    } else {
      this.register();
    }
  };

  onFollowClicked = () => {
    if (!this.props.following) {
      ChannelService.addUserToChannel(
        this.props.user!.id,
        this.props.talk.channel_id,
        "follower",
        () => {}
      );
    } else {
      ChannelService.removeUserFromChannel(
        this.props.user!.id,
        this.props.talk.channel_id,
        () => {}
      );
    }
    this.props.callback()
  };

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

  toggleEdit = () => {
    this.setState({ showEdit: !this.state.showEdit });
  };

  render() {
    return (
      <Box
        width={this.props.width ? this.props.width : "32%"}
        height={this.props.admin ? "240px" : "180px"}
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
          onClick={this.toggleModal}
          height="180px"
          width="100%"
          background="white"
          round="xsmall"
          justify="between"
          gap="small"
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
              style={{ minHeight: "75px", overflow: "auto" }}
            >
              {this.props.talk.name}
            </Text>
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
                    size="14px"
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
                  opacity: 0.5,
                }}
                background={this.props.talk.channel_colour}
              ></Box>
            )}
          </Box>
        </Box>
        {this.props.admin && (
          <Box
            onClick={() => {
              this.toggleEdit();
            }}
            background="#7E1115"
            round="xsmall"
            pad="xsmall"
            height="40px"
            justify="center"
            align="center"
            focusIndicator={false}
            hoverIndicator="#5A0C0F"
            margin="10px"
          >
            <Text size="18px">Edit</Text>
          </Box>
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
              height="80%"
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
                  size="18px"
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
                      <UserExpert size="14px" />
                      <Text
                        size="14px"
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
                    <UserExpert size="14px" />
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
                )}
                <Box
                  style={{
                    minHeight: "50px",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                  margin={{ top: "10px", bottom: "10px" }}
                  direction="column"
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
                isSharingPage={false}
                admin={this.props.admin}
                registered={this.state.registered}
                role={this.props.role}
                available={this.state.available}
                width={this.props.width}
                // isCurrent?: boolean;
                // show?: boolean;
                following={this.props.following}
                onEditCallback={this.props.onEditCallback}
                callback={this.props.callback}
              />
          </Layer>
        )}
        {this.props.admin && this.state.showEdit && (
          <EditTalkModal
            visible={this.state.showEdit}
            channel={null}
            talk={this.props.talk}
            onFinishedCallback={() => {
              this.toggleEdit();
              this.props.onEditCallback();
            }}
            onDeletedCallback={() => {
              this.toggleEdit();
              this.props.onEditCallback();
            }}
            onCanceledCallback={this.toggleEdit}
          />
        )}
      </Box>
    );
  }
}
