import React, { Component } from "react";
import {
  Box,
  TextInput,
  TextArea,
  Layer,
  Text,
  Calendar,
  MaskedInput,
} from "grommet";
import "../Styles/manage-channel.css";
import TagSelector from "./TagSelector";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../Services/ScheduledStreamService";
import { Tag } from "../Services/TagService";
import { Channel } from "../Services/ChannelService";
import Loading from "./Loading";
import { Overlay, OverlaySection } from "./Core/Overlay";

interface Props {
  margin: string;
  channel: Channel | null;
}

interface State {
  showModal: boolean;
  title: string;
  description: string;
  tags: Tag[];
  loading: boolean;
  date: string;
  startTime: string;
  endTime: string;
  link: string;
}

export default class NewScheduleStreamButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      title: "",
      description: "",
      tags: [],
      loading: false,
      date: new Date().toISOString(),
      startTime: "",
      endTime: "",
      link: "",
    };
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
      startTime: "",
      endTime: "",
      title: "",
      description: "",
      link: "",
      tags: [],
    });
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
    ScheduledStreamService.scheduleStream(
      this.props.channel!.id,
      this.props.channel!.name,
      this.state.title,
      this.state.description,
      dateTimeStrs[0],
      dateTimeStrs[1],
      this.state.link,
      (stream: ScheduledStream) => {
        console.log("SCHEDULED STREAM:", stream);
        this.setState(
          {
            loading: false,
          },
          () => {
            this.toggleModal();
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
    return (
      <Box margin={this.props.margin} pad="none">
        <Box
          className="gradient-border"
          round="8px"
          align="center"
          justify="center"
          onClick={this.toggleModal}
          focusIndicator={false}
        >
          <Text color="black" size="16.5px" style={{ fontWeight: 500 }}>
            Schedule talk
          </Text>
        </Box>
        <Overlay
          width={500}
          height={650}
          visible={this.state.showModal}
          title="New talk"
          submitButtonText="Save"
          onSubmitClick={this.onFinishClicked}
          contentHeight="147vh"
          canProceed={this.isComplete()}
          onCancelClick={this.toggleModal}
          onClickOutside={this.toggleModal}
          onEsc={this.toggleModal}
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
                onChange={(event) => {
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
                onChange={(event) => {
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
                onChange={(e) => this.setState({ title: e.target.value })}
              />
            </Box>
            <Box width="100%" gap="2px">
              <Text size="14px" weight="bold" color="black">
                Description
              </Text>
              <TextArea
                placeholder="type something"
                onChange={(e) => this.setState({ description: e.target.value })}
              />
            </Box>
          </OverlaySection>
          <OverlaySection heading="Add a few relevant tags">
            <TagSelector
              onSelectedCallback={this.selectTag}
              onDeselectedCallback={this.deselectTag}
              width="100%"
              height="200px"
            />
          </OverlaySection>
          <OverlaySection heading="Finally, add a link so people can watch your talk">
            <TextInput
              placeholder="type something"
              onChange={(e) => this.setState({ link: e.target.value })}
            />
          </OverlaySection>
        </Overlay>
      </Box>
    );
  }
}
