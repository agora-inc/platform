import React, { Component } from "react";
import { Box, Text, Button, Layer } from "grommet";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../../Services/ScheduledStreamService";
import { User } from "../../Services/UserService";
import { Tag } from "../../Services/TagService";
import { default as TagComponent } from "../Core/Tag";
import Identicon from "react-identicons";
import AddToCalendarButtons from "./AddToCalendarButtons";

interface Props {
  stream: ScheduledStream;
  user: User | null;
}

interface State {
  showModal: boolean;
  showShadow: boolean;
  registered: boolean;
}

export default class ScheduledStreamCard extends Component<Props, State> {
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
      ScheduledStreamService.isRegisteredForScheduledStream(
        this.props.stream.id,
        this.props.user.id,
        (registered: boolean) => {
          this.setState({ registered });
        }
      );
  };

  register = () => {
    this.props.user &&
      ScheduledStreamService.registerForScheduledStream(
        this.props.stream.id,
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
      ScheduledStreamService.unRegisterForScheduledStream(
        this.props.stream.id,
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
    console.log(this.props.stream);
    return (
      <Box
        width="32%"
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
                {!this.props.stream.has_avatar && (
                  <Identicon
                    string={this.props.stream.channel_name}
                    size={15}
                  />
                )}
                {!!this.props.stream.has_avatar && (
                  <img
                    src={`/images/channel-icons/${this.props.stream.channel_id}.jpg`}
                  />
                )}
              </Box>
              <Text
                weight="bold"
                size="18px"
                color={this.props.stream.channel_colour}
              >
                {this.props.stream.channel_name}
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
              {this.props.stream.name}
            </Text>
          </Box>
          <Box gap="xsmall">
            <Text
              size="18px"
              color="black"
              style={{ maxHeight: 150, overflow: "scroll" }}
            >
              {this.props.stream.description}
            </Text>
            <Text size="18px" color="black" weight="bold">
              {this.formatDate(this.props.stream.date)}
            </Text>
          </Box>
        </Box>
        {this.state.showShadow && (
          <Box
            height="100%"
            width="100%"
            round="xsmall"
            style={{ zIndex: -1, position: "absolute", top: 8, left: 8 }}
            background={this.props.stream.channel_colour}
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
                    {!this.props.stream.has_avatar && (
                      <Identicon
                        string={this.props.stream.channel_name}
                        size={15}
                      />
                    )}
                    {!!this.props.stream.has_avatar && (
                      <img
                        src={`/images/channel-icons/${this.props.stream.channel_id}.jpg`}
                      />
                    )}
                  </Box>
                  <Text
                    weight="bold"
                    size="22px"
                    color={this.props.stream.channel_colour}
                  >
                    {this.props.stream.channel_name}
                  </Text>
                </Box>
                <Text
                  weight="bold"
                  size="24px"
                  color="black"
                  style={{ overflowY: "scroll" }}
                >
                  {this.props.stream.name}
                </Text>
              </Box>
              <Box
                gap="xsmall"
                justify="end"
                style={{ minHeight: "40%", maxHeight: "60%" }}
              >
                <Text size="22px" color="black" style={{ overflowY: "scroll" }}>
                  {this.props.stream.description}
                </Text>
                {this.props.stream.tags.length !== 0 && (
                  <Box direction="row" gap="xsmall" wrap>
                    {this.props.stream.tags.map((tag: Tag) => (
                      <TagComponent
                        tagName={tag.name}
                        width="80px"
                        colour="#f3f3f3"
                      />
                    ))}
                  </Box>
                )}
                <Text size="18px" color="black" weight="bold">
                  {this.formatDate(this.props.stream.date)}
                </Text>
                {this.state.registered && (
                  <AddToCalendarButtons
                    startTime={this.props.stream.date}
                    endTime={this.props.stream.end_date}
                    name={this.props.stream.name}
                    description={this.props.stream.description}
                    link={this.props.stream.link}
                  />
                )}
                <Button
                  onClick={
                    this.state.registered ? this.unregister : this.register
                  }
                  primary
                  color={this.props.stream.channel_colour}
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
