import React, { Component } from "react";
import { Box, Text, Button, Layer } from "grommet";
import { Talk, TalkService } from "../../Services/TalkService";
import { User } from "../../Services/UserService";
import { Tag } from "../../Services/TagService";
import { default as TagComponent } from "../Core/Tag";
import Identicon from "react-identicons";
import AddToCalendarButtons from "./AddToCalendarButtons";
import Countdown from "./Countdown";

interface Props {
  talk: Talk;
  user: User | null;
  width?: string;
}

interface State {
  showModal: boolean;
  showShadow: boolean;
  registered: boolean;
}

export default class TalkCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      showShadow: false,
      registered: false,
    };
  }
  formatDate = (d: string) => {
    const date = new Date(d);
    const dateStr = date.toDateString().slice(0, -4);
    const timeStr = date.toTimeString().slice(0, 5);
    return `${dateStr} ${timeStr}`;
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal, showShadow: true });
  };

  componentWillMount() {
    this.checkIfRegistered();
  }

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

  render() {
    console.log(this.props.talk);
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
          // align="center"
          pad="15px"
          justify="between"
          gap="small"
        >
          <Box style={{ minHeight: "35%", maxHeight: "50%" }}>
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
                    src={`/images/channel-icons/${this.props.talk.channel_id}.jpg`}
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
              weight="bold"
              size="20px"
              color="black"
              style={{
                // whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {this.props.talk.name}
            </Text>
          </Box>
          <Box gap="xsmall">
            <Text
              size="18px"
              color="black"
              style={{ maxHeight: 150, overflow: "scroll" }}
            >
              {this.props.talk.description}
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
            style={{ zIndex: -1, position: "absolute", top: 8, left: 8 }}
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
            style={{ width: 400, height: 500, borderRadius: 15 }}
          >
            <Box
              // align="center"
              pad="25px"
              // width="100%"
              height="100%"
              justify="between"
              gap="xsmall"
            >
              <Box style={{ minHeight: "40%", maxHeight: "60%" }}>
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
                      <Identicon
                        string={this.props.talk.channel_name}
                        size={15}
                      />
                    )}
                    {!!this.props.talk.has_avatar && (
                      <img
                        src={`/images/channel-icons/${this.props.talk.channel_id}.jpg`}
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
                style={{ minHeight: "40%", maxHeight: "60%" }}
              >
                <Text size="22px" color="black" style={{ overflowY: "scroll" }}>
                  {this.props.talk.description}
                </Text>
                {this.props.talk.tags.length !== 0 && (
                  <Box direction="row" gap="xsmall" wrap>
                    {this.props.talk.tags.map((tag: Tag) => (
                      <TagComponent
                        tagName={tag.name}
                        width="80px"
                        colour="#f3f3f3"
                      />
                    ))}
                  </Box>
                )}
                <Text size="18px" color="black" weight="bold">
                  {this.formatDate(this.props.talk.date)}
                </Text>
                <Countdown
                  targetTime={this.props.talk.date}
                  link={"https://duckduckgo.com"}
                />
                {this.state.registered && (
                  <AddToCalendarButtons
                    startTime={this.props.talk.date}
                    endTime={this.props.talk.end_date}
                    name={this.props.talk.name}
                    description={this.props.talk.description}
                    link={this.props.talk.link}
                  />
                )}
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
              </Box>
            </Box>
          </Layer>
        )}
      </Box>
    );
  }
}
