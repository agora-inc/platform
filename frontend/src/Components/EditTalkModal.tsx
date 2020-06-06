import React, { Component } from "react";
import { Box, Text, TextInput, TextArea, Calendar, MaskedInput } from "grommet";
import { Overlay, OverlaySection } from "./Core/Overlay";
import Button from "./Core/Button";
import { Channel } from "../Services/ChannelService";
import { Tag } from "../Services/TagService";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../Services/ScheduledStreamService";
import TagSelector from "./TagSelector";

interface Props {
  channel: Channel | null;
  visible: boolean;
  onFinishedCallback: any;
  onCanceledCallback: any;
  onDeletedCallback?: any;
  stream?: ScheduledStream;
}

interface State {
  title: string;
  description: string;
  tags: Tag[];
  loading: boolean;
  date: string;
  startTime: string;
  endTime: string;
  link: string;
}

export default class EditTalkModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      title: this.props.stream ? this.props.stream.name : "",
      description: this.props.stream ? this.props.stream.description : "",
      tags: this.props.stream ? this.props.stream.tags : [],
      loading: false,
      date: this.props.stream
        ? new Date(this.props.stream.date).toISOString()
        : new Date().toISOString(),
      startTime: this.props.stream
        ? new Date(this.props.stream.date).toTimeString().slice(0, 5)
        : "",
      endTime: this.props.stream
        ? new Date(this.props.stream.end_date).toTimeString().slice(0, 5)
        : "",
      link: this.props.stream ? this.props.stream.link : "",
    };
  }

  parseDate = () => {
    if (this.props.stream) {
      let d = new Date(this.props.stream.date);
      console.log(d.toTimeString().slice(0, 5));
    }
  };

  onFinishClicked = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        this.onFinish();
      }
    );
  };

  combineDateAndTimeStrings = () => {
    return [
      `${this.state.date.slice(0, 10)} ${this.state.startTime}`,
      `${this.state.date.slice(0, 10)} ${this.state.endTime}`,
    ];
  };

  onFinish = () => {
    const dateTimeStrs = this.combineDateAndTimeStrings();
    if (this.props.stream) {
      ScheduledStreamService.editScheduledStream(
        this.props.stream.id,
        this.state.title,
        this.state.description,
        dateTimeStrs[0],
        dateTimeStrs[1],
        this.state.link,
        this.state.tags,
        (stream: ScheduledStream) => {
          this.setState(
            {
              loading: false,
            },
            () => {
              this.props.onFinishedCallback();
            }
          );
        }
      );
    } else {
      ScheduledStreamService.scheduleStream(
        this.props.channel!.id,
        this.props.channel!.name,
        this.state.title,
        this.state.description,
        dateTimeStrs[0],
        dateTimeStrs[1],
        this.state.link,
        this.state.tags,
        (stream: ScheduledStream) => {
          console.log("SCHEDULED STREAM:", stream);
          this.setState(
            {
              loading: false,
            },
            () => {
              this.props.onFinishedCallback();
              this.setState({
                title: "",
                description: "",
                tags: [],
                date: new Date().toISOString(),
                startTime: "",
                endTime: "",
              });
            }
          );
        }
      );
    }
  };

  onDeleteClicked = () => {
    if (!this.props.stream) {
      return;
    }
    ScheduledStreamService.deleteScheduledStream(this.props.stream.id, () => {
      this.props.onDeletedCallback();
    });
  };

  selectTag = (tag: Tag) => {
    this.setState({ tags: [...this.state.tags, tag] });
  };

  deselectTag = (tag: Tag) => {
    this.setState({
      tags: this.state.tags.filter(function (t) {
        return t !== tag;
      }),
    });
  };

  getDateBounds = () => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const inOneYear = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    );
    const inOneYearStr = inOneYear.toISOString().slice(0, 10);
    return [todayStr, inOneYearStr];
  };

  isComplete = () => {
    return (
      this.state.startTime !== "" &&
      this.state.endTime !== "" &&
      this.state.title !== "" &&
      this.state.description !== "" &&
      this.state.link !== ""
    );
  };

  render() {
    console.log(this.props.stream);
    return (
      <Overlay
        width={500}
        height={650}
        visible={this.props.visible}
        title={this.props.stream ? "Edit talk" : "New talk"}
        submitButtonText="Save"
        onSubmitClick={this.onFinishClicked}
        contentHeight="147vh"
        canProceed={this.isComplete()}
        onCancelClick={this.props.onCanceledCallback}
        onClickOutside={this.props.onCanceledCallback}
        onEsc={this.props.onCanceledCallback}
        extraButton={
          this.props.stream ? (
            <Button
              fill="#FF4040"
              width="90px"
              height="35px"
              text="delete"
              onClick={this.onDeleteClicked}
            />
          ) : null
        }
      >
        <OverlaySection heading="When is your talk going to be held?">
          <Calendar
            date={this.state.date}
            bounds={this.getDateBounds()}
            size="medium"
            onSelect={(date: any) => {
              this.setState({ date });
            }}
            daysOfWeek
            style={{ width: "100%" }}
          />
          <Box width="100%" gap="2px">
            <Text size="14px" weight="bold" color="black">
              Starts
            </Text>
            <MaskedInput
              mask={[
                {
                  length: 2,
                  regexp: /^[01][0-9]$|^2[0-3]|^[0-9]$/,
                  placeholder: "hh",
                },
                { fixed: ":" },
                {
                  length: 2,
                  regexp: /^[0-5][0-9]$|^[0-5]$/,
                  placeholder: "mm",
                },
              ]}
              value={this.state.startTime}
              onChange={(event: any) => {
                this.setState({ startTime: event.target.value });
              }}
            />
          </Box>
          <Box width="100%" gap="2px">
            <Text size="14px" weight="bold" color="black">
              Finishes
            </Text>
            <MaskedInput
              mask={[
                {
                  length: 2,
                  regexp: /^[01][0-9]$|^2[0-3]|^[0-9]$/,
                  placeholder: "hh",
                },
                { fixed: ":" },
                {
                  length: 2,
                  regexp: /^[0-5][0-9]$|^[0-5]$/,
                  placeholder: "mm",
                },
              ]}
              value={this.state.endTime}
              onChange={(event: any) => {
                this.setState({ endTime: event.target.value });
              }}
            />
          </Box>
        </OverlaySection>
        <OverlaySection heading="Add a title and a short description">
          <Box width="100%" gap="2px">
            <Text size="14px" weight="bold" color="black">
              Title
            </Text>
            <TextInput
              placeholder="type something"
              value={this.state.title}
              onChange={(e) => this.setState({ title: e.target.value })}
            />
          </Box>
          <Box width="100%" gap="2px">
            <Text size="14px" weight="bold" color="black">
              Description
            </Text>
            <TextArea
              value={this.state.description}
              placeholder="type something"
              onChange={(e) => this.setState({ description: e.target.value })}
            />
          </Box>
        </OverlaySection>
        <OverlaySection heading="Add a few relevant tags">
          <TagSelector
            selected={this.props.stream?.tags}
            onSelectedCallback={this.selectTag}
            onDeselectedCallback={this.deselectTag}
            width="100%"
            height="200px"
          />
        </OverlaySection>
        <OverlaySection heading="Finally, add a link so people can watch your talk">
          <TextInput
            value={this.state.link}
            placeholder="type something"
            onChange={(e) => this.setState({ link: e.target.value })}
          />
        </OverlaySection>
      </Overlay>
    );
  }
}
