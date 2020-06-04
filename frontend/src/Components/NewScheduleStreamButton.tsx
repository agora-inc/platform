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

  renderModalContent = () => {
    return (
      <Box align="center" width="100%" overflow="scroll">
        <Box
          justify="center"
          width="100%"
          background="#F5F5F5"
          pad={{ left: "24px" }}
          style={{
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
            position: "sticky",
            top: 0,
            minHeight: "60px",
            zIndex: 10,
          }}
        >
          <Text size="24px" color="black" weight="bold">
            New talk
          </Text>
        </Box>
        <Box
          width="100%"
          align="center"
          pad={{ horizontal: "30px" }}
          gap="30px"
          margin={{ top: "20px" }}
          overflow="scroll"
          style={{ minHeight: "147vh" }}
        >
          <Box width="100%" align="center" gap="xsmall">
            <Box
              height="30px"
              width="100%"
              background="#FFD1C7"
              pad="small"
              justify="center"
            >
              <Text size="16px" weight="bold" color="black">
                When is your talk going to be held?
              </Text>
            </Box>
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
            <Box width="100%">
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
            <Box width="100%">
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
          </Box>
          <Box width="100%" align="center" gap="xsmall">
            <Box
              height="30px"
              width="100%"
              background="#FFD1C7"
              pad="small"
              justify="center"
            >
              <Text size="16px" weight="bold" color="black">
                Add a title and a short description
              </Text>
            </Box>
            <Box width="100%">
              <Text size="14px" weight="bold" color="black">
                Title
              </Text>
              <TextInput
                placeholder="type something"
                onChange={(e) => this.setState({ title: e.target.value })}
              />
            </Box>
            <Box width="100%">
              <Text size="14px" weight="bold" color="black">
                Description
              </Text>
              <TextArea
                placeholder="type something"
                onChange={(e) => this.setState({ description: e.target.value })}
              />
            </Box>
          </Box>
          <Box width="100%" align="center" gap="xsmall">
            <Box
              height="30px"
              width="100%"
              background="#FFD1C7"
              pad="small"
              justify="center"
            >
              <Text size="16px" weight="bold" color="black">
                Add a few relevant tags
              </Text>
            </Box>
            <TagSelector
              onSelectedCallback={this.selectTag}
              onDeselectedCallback={this.deselectTag}
              width="100%"
              height="200px"
            />
          </Box>
          <Box width="100%" align="center" gap="xsmall">
            <Box
              height="30px"
              width="100%"
              background="#FFD1C7"
              pad="small"
              justify="center"
            >
              <Text size="16px" weight="bold" color="black">
                Finally, add a link so people can watch your talk
              </Text>
            </Box>
            <TextInput
              placeholder="type something"
              onChange={(e) => this.setState({ link: e.target.value })}
            />
          </Box>
        </Box>
        <Box
          direction="row"
          justify="end"
          align="center"
          gap="xsmall"
          width="100%"
          background="#F5F5F5"
          pad={{ right: "24px" }}
          style={{
            borderBottomLeftRadius: "15px",
            borderBottomRightRadius: "15px",
            position: "sticky",
            bottom: 0,
            minHeight: "45px",
            zIndex: 10,
          }}
        >
          <Box
            background="white"
            round="xsmall"
            height="35px"
            style={{ border: "2px solid black" }}
            align="center"
            justify="center"
            width="90px"
            onClick={this.toggleModal}
            focusIndicator={false}
            hoverIndicator={true}
          >
            <Text weight="bold" color="black" size="16px">
              Cancel
            </Text>
          </Box>
          <Box
            height="35px"
            background="white"
            round="xsmall"
            style={
              this.isComplete()
                ? { border: "2px solid black" }
                : {
                    border: "2px solid black",
                    opacity: 0.4,
                    pointerEvents: "none",
                  }
            }
            align="center"
            justify="center"
            width="90px"
            onClick={this.onFinishClicked}
            focusIndicator={false}
            hoverIndicator={true}
          >
            <Text weight="bold" color="black" size="16px">
              Save
            </Text>
          </Box>
        </Box>
      </Box>
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
            Schedule stream
          </Text>
        </Box>
        {this.state.showModal && (
          <Layer
            onEsc={this.toggleModal}
            onClickOutside={this.toggleModal}
            modal
            responsive
            animation="fadeIn"
            style={{
              width: 500,
              height: 650,
              borderRadius: 15,
              border: "3.5px solid black",
              padding: 0,
            }}
          >
            {this.renderModalContent()}
          </Layer>
        )}
      </Box>
    );
  }
}
