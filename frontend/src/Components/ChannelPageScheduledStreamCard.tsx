import React, { Component } from "react";
import { Box, Text, Button } from "grommet";
import { User } from "../Services/UserService";
import { Tag } from "../Services/TagService";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../Services/ScheduledStreamService";
import EditTalkModal from "./EditTalkModal";
import AddToCalendarButtons from "./AddToCalendarButtons";
import { default as TagComponent } from "./Tag";

interface Props {
  stream: ScheduledStream;
  user: User | null;
  admin: boolean;
  onEditCallback?: any;
}

interface State {
  showModal: boolean;
  registered: boolean;
}

export default class ChannelPageScheduledStreamCard extends Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      registered: false,
    };
  }

  checkIfRegistered = () => {
    this.props.user &&
      !this.props.admin &&
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
          this.checkIfRegistered();
        }
      );
  };

  unregister = () => {
    this.props.user &&
      ScheduledStreamService.unRegisterForScheduledStream(
        this.props.stream.id,
        this.props.user.id,
        () => {
          this.checkIfRegistered();
        }
      );
  };

  onClick = () => {
    if (this.props.admin) {
      this.toggleModal();
    } else if (this.state.registered) {
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

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  render() {
    let label = "Log in to register";
    if (this.props.admin) {
      label = "Edit";
    } else if (this.props.user && !this.state.registered) {
      label = "Register";
    } else if (this.props.user && this.state.registered) {
      label = "Unregister";
    }
    return (
      <Box width="31.5%">
        <Box
          background="white"
          round="10px"
          // align="center"
          pad="15px"
          width="100%"
          height="325px"
          justify="between"
          gap="small"
        >
          <Text weight="bold" size="20px" color="black">
            {this.props.stream.name}
          </Text>
          <Box gap="small">
            <Text
              size="18px"
              color="black"
              style={{ maxHeight: 150, overflow: "scroll" }}
            >
              {this.props.stream.description}
            </Text>
            <Box direction="row" gap="xsmall" wrap>
              {this.props.stream.tags.map((tag: Tag) => (
                <TagComponent
                  tagName={tag.name}
                  width="80px"
                  colour="#f3f3f3"
                />
              ))}
            </Box>
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
              onClick={this.onClick}
              primary
              color="black"
              disabled={!this.props.admin && this.props.user === null}
              label={label}
              size="large"
            ></Button>
          </Box>
        </Box>
        <EditTalkModal
          visible={this.state.showModal}
          channel={null}
          stream={this.props.stream}
          onFinishedCallback={() => {
            this.toggleModal();
            this.props.onEditCallback();
          }}
          onCanceledCallback={this.toggleModal}
        />
      </Box>
    );
  }
}
