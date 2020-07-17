import React, { Component } from "react";
import { Box, Text, Button, Layer } from "grommet";
import Identicon from "react-identicons";
import { Calendar, Workshop, UserExpert } from "grommet-icons";
import { User } from "../../Services/UserService";
import { Tag } from "../../Services/TagService";
import { Link } from "react-router-dom";
import { Talk, TalkService } from "../../Services/TalkService";
import EditTalkModal from "../Talks/EditTalkModal";
import AddToCalendarButtons from "../Talks/AddToCalendarButtons";
import { default as TagComponent } from "../Core/Tag";
import { ChannelService } from "../../Services/ChannelService";
import CountdownAndCalendarButtons from "../Talks/CountdownAndCalendarButtons";
import AsyncButton from "../Core/AsyncButton";
import TalkCard from "../Talks/TalkCard";
import LoginModal from "../Account/LoginModal";
import SignUpButton from "../Account/SignUpButton";
import { thisExpression } from "@babel/types";



interface Props {
  talk: Talk;
  user: User | null;
  admin: boolean;
  onEditCallback?: any;
  width?: any;
  margin?: any;
}

interface State {
  showModal: boolean;
  showEdit: boolean;
  registered: boolean;
  showShadow: boolean;
  available: boolean;
}

export default class ChannelPageTalkCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      showEdit: false,
      registered: false,
      showShadow: false,
      available: true,
    };
  }

  checkIfRegistered = () => {
    this.props.user &&
      !this.props.admin &&
      TalkService.isRegisteredForTalk(
        this.props.talk.id,
        this.props.user.id,
        (registered: boolean) => {
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
          this.checkIfRegistered();
        }
      );
  };

  unregister = () => {
    this.props.user &&
      TalkService.unRegisterForTalk(
        this.props.talk.id,
        this.props.user.id,
        () => {
          this.checkIfRegistered();
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

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  toggleEdit = () => { 
    this.setState({ showEdit: !this.state.showEdit})
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
              margin={{bottom: "10px"}}
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
              <Text
                weight="bold"
                size="16px"
                color="grey"
              >
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
                style={{ height: "30px", overflow: "auto", fontStyle: "italic" }}
                margin={{bottom: "10px"}}
              >
                {this.props.talk.talk_speaker ? this.props.talk.talk_speaker : "TBA" }
              </Text>
            </Box>
            <Box direction="row" gap="small">
              <Calendar size="18px" />
              <Text 
                size="18px" 
                color="black"
                style={{ height: "30px", fontStyle: "normal" }}
              >
                {this.formatDate(this.props.talk.date)}
              </Text>
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
            onClick={() => {this.toggleEdit()}}
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
            <Text size="18px"> 
              Edit
            </Text>
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
              height="100%"
              justify="between"
              gap="xsmall"
            >
              <Box style={{ minHeight: "200px", maxHeight: "540px" }} direction="column">
                <Box 
                  direction="row" 
                  gap="xsmall" 
                  style={{ minHeight: "30px" }} 
                >
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
                        <Text
                          weight="bold"
                          size="18px"
                          color="grey"
                        >
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
                  style={{ minHeight: "50px", maxHeight: "120px", overflowY: "auto" }}
                  margin={{bottom: "20px", top: "10px"}}
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
                      pad={{left: "6px", top:"4px"}}
                    >
                      <UserExpert size="18px" />
                      <Text
                        size="18px"
                        color="black"
                        style={{ height: "24px", overflow: "auto", fontStyle: "italic" }}
                      >
                        {this.props.talk.talk_speaker ? this.props.talk.talk_speaker : "TBA" }
                      </Text>
                    </Box>
                  </a>
                )}

                {!this.props.talk.talk_speaker_url && (
                  <Box 
                    direction="row" 
                    gap="small"
                  >
                    <UserExpert size="18px" />
                    <Text
                      size="18px"
                      color="black"
                      style={{ height: "30px", overflow: "auto", fontStyle: "italic" }}
                      margin={{bottom: "10px"}}
                    >
                      {this.props.talk.talk_speaker ? this.props.talk.talk_speaker : "TBA" }
                    </Text>
                  </Box>
                )}
                <Text 
                  size="16px" 
                  color="black" 
                  style={{ minHeight: "50px", maxHeight: "200px", overflowY: "auto" }}
                  margin={{top: "10px", bottom: "10px"}}
                >
                  {this.props.talk.description}
                </Text>
              </Box>
              <Box direction="column" gap="small">
                <Box direction="row" gap="small">
                  <Calendar size="18px" />
                  <Text 
                    size="18px" 
                    color="black"
                    style={{ height: "20px", fontStyle: "normal" }}
                  >
                    {this.formatDateFull(this.props.talk.date, this.props.talk.end_date)}
                  </Text>
                </Box>
                {this.state.available && (this.props.user !== null || this.props.admin) && this.state.registered && (
                  <Box margin={{top: "10px", bottom: "20px"}}>
                    <CountdownAndCalendarButtons
                      talkStart={this.props.talk.date}
                      showLinkOffset={this.props.talk.show_link_offset}
                      link={this.props.talk.link}
                      color={this.props.talk.channel_colour}
                      startTime={this.props.talk.date}
                      endTime={this.props.talk.end_date}
                      name={this.props.talk.name}
                      description={this.props.talk.description}
                    />
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
                {this.state.available && (this.props.user !== null || this.props.admin) && !this.state.registered && (
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
                    <Text size="18px"> 
                      Register
                    </Text>
                  </Box>
                )}
                {this.state.available && this.props.user === null && !this.props.admin && (
                  <Box 
                    direction="row" 
                    align="center"
                    gap="10px"
                  >
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
