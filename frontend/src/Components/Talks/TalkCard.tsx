import React, { Component } from "react";
import { Box, Text, Button, Layer, TextArea } from "grommet";
import { Talk, TalkService } from "../../Services/TalkService";
import { ChannelService } from "../../Services/ChannelService";
import { User } from "../../Services/UserService";
import { Link } from "react-router-dom";
import { Tag } from "../../Services/TagService";
import AsyncButton from "../Core/AsyncButton";
import { Calendar, Workshop, UserExpert } from "grommet-icons";
import { default as TagComponent } from "../Core/Tag";
import Identicon from "react-identicons";
import AddToCalendarButtons from "./AddToCalendarButtons";
import CountdownAndCalendarButtons from "./CountdownAndCalendarButtons";


interface Props {
  talk: Talk;
  user: User | null;
  width?: string;
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

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal, showShadow: true });
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
        (registered: boolean) => {
          this.setState({ registered });
        }
      );
  };

  register = () => {
    console.log("Is there?")
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
    console.log("Is there not?")
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

/*
  render() {
    // console.log(this.props.talk);
    return (
      <Box
        width={this.props.width ? this.props.width : "32%"}
        height="300px"
        onClick={this.toggleModal}
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
          <Box
            height="50%"
            background={this.props.talk.channel_colour}
            style={{ opacity: 0.75 }}
          ></Box>
          <Box height="50%" pad="15px" justify="end">
            <Box
              direction="row"
              gap="xsmall"
              align="center"
              style={{ minHeight: "30px" }}
            >
              <Box
                height="25px"
                width="25px"
                round="12.5px"
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
                    height={25}
                    width={25}
                  />
                )}
              </Box>
              <Text
                weight="bold"
                size="18px"
                color={this.props.talk.channel_colour}
              >
                {this.props.talk.channel_name}
              </Text>
            </Box>
            <Text
              size="18px"
              color="black"
              style={{ maxHeight: 150, overflow: "scroll" }}
            >
              {this.props.talk.name}
            </Text>
            <Text size="18px" color="black" weight="bold">
              {this.formatDate(this.props.talk.date)}
            </Text>
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
              width: 400,
              height: this.state.registered ? 540 : 500,
              borderRadius: 15,
              overflow: "hidden",
            }}
          >
            <Box
              // align="center"
              pad="25px"
              // width="100%"
              height="100%"
              justify="between"
              gap="xsmall"
            >
              <Box style={{ minHeight: "25%", maxHeight: "60%" }}>
                <Box direction="row" gap="xsmall" style={{ minHeight: "30px" }}>
                  <Box
                    justify="center"
                    align="center"
                    background="#efeff1"
                    overflow="hidden"
                    style={{
                      minHeight: 25,
                      minWidth: 25,
                      maxHeight: 25,
                      maxWidth: 25,
                      borderRadius: 12.5,
                    }}
                  >
                    {!this.props.talk.has_avatar && (
                      <Identicon
                        string={this.props.talk.channel_name}
                        size={15}
                      />
                    )}
                    {!!this.props.talk.has_avatar && (
                      <img
                        src={ChannelService.getAvatar(
                          this.props.talk.channel_id
                        )}
                        height={25}
                        width={25}
                      />
                    )}
                  </Box>
                  <Text
                    weight="bold"
                    size="22px"
                    color={this.props.talk.channel_colour}
                  >
                    {this.props.talk.channel_name}
                  </Text>
                </Box>
                <Text
                  weight="bold"
                  size="24px"
                  color="black"
                  style={{ overflowY: "scroll" }}
                >
                  {this.props.talk.name}
                </Text>
              </Box>
              <Box
                gap="xsmall"
                justify="end"
                style={{ minHeight: "40%", maxHeight: "75%" }}
              >
                <Text size="22px" color="black" style={{ overflowY: "scroll" }}>
                  {this.props.talk.description}
                </Text>
                {this.props.talk.tags.length !== 0 && (
                  <Box
                    direction="row"
                    gap="xsmall"
                    wrap
                    style={{ minHeight: "35px", marginTop: "5px" }}
                  >
                    {this.props.talk.tags.map((tag: Tag) => (
                      <TagComponent
                        tagName={tag.name}
                        width="80px"
                        height="35px"
                        colour="#f3f3f3"
                        marginTop={8}
                      />
                    ))}
                  </Box>
                )}
                <Text size="18px" color="black" weight="bold">
                  {this.formatDate(this.props.talk.date)}
                </Text>
                {this.state.registered && (
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
                )}
                {this.state.available && (
                  <Button
                    onClick={
                      this.state.registered ? this.unregister : this.register
                    }
                    primary
                    color={this.props.talk.channel_colour}
                    disabled={this.props.user === null}
                    label={
                      this.props.user !== null
                        ? this.state.registered
                          ? "Unregister"
                          : "Register"
                        : "Log in to register"
                    }
                    size="large"
                  ></Button>
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
*/

  render() {  
    return (
      <Box
        width={this.props.width ? this.props.width : "32%"}
        height="180px"
        onClick={this.toggleModal}
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
              width: 500,
              height: this.state.registered ? 640 : 540,
              borderRadius: 15,
              overflow: "hidden",
            }}
          >
            <Box
              // align="center"
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
                <Text 
                  size="16px" 
                  color="black" 
                  style={{ minHeight: "50px", maxHeight: "200px", overflowY: "auto" }}
                  margin={{bottom: "10px"}}
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
                {this.state.registered && (
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
                  </Box>
                )}
                {this.state.available && (
                  <Button
                    label={
                      this.props.user !== null
                        ? this.state.registered
                          ? "Unregister"
                          : "Register"
                        : "Log in to register"
                    }
                    disabled={this.props.user === null}
                    onClick={
                      this.state.registered ? this.unregister : this.register
                    }
                    style={{
                      width: "",
                      height: "40px",
                      borderRadius: 7,
                      backgroundColor: "#7E1115",
                      color: "white",
                    }}
                  />
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
