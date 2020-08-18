import React, { Component } from "react";
import {
  Box,
  Text,
  TextInput,
  TextArea,
  Calendar,
  MaskedInput,
  Select,
} from "grommet";
import { Overlay, OverlaySection } from "../Core/Overlay";
import Button from "../Core/Button";
import { Channel } from "../../Services/ChannelService";
import { Tag } from "../../Services/TagService";
import { Talk, TalkService } from "../../Services/TalkService";
import TagSelector from "../Core/TagSelector";
import TopicSelector from "../Talks/TopicSelector";
import { Topic } from "../../Services/TopicService";
import "../../Styles/edit-talk-modal.css";

interface Props {
  channel: Channel | null;
  visible: boolean;
  onFinishedCallback: any;
  onCanceledCallback: any;
  onDeletedCallback?: any;
  talk?: Talk;
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
  releaseLinkOffset: number;
  linkVisibility: string;
  topics: Topic[];
  talkSpeaker: string;
  talkSpeakerURL: string;
  published: number,
}

export default class EditTalkModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      title: this.props.talk ? this.props.talk.name : "",
      description: this.props.talk ? this.props.talk.description : "",
      tags: this.props.talk ? this.props.talk.tags : [],
      loading: false,
      date: this.props.talk
        ? new Date(this.props.talk.date).toISOString()
        : new Date().toISOString(),
      startTime: this.props.talk
        ? new Date(this.props.talk.date).toTimeString().slice(0, 5)
        : "",
      endTime: this.props.talk
        ? new Date(this.props.talk.end_date).toTimeString().slice(0, 5)
        : "",
      link: this.props.talk ? this.props.talk.link : "",
      releaseLinkOffset: this.props.talk ? this.props.talk.show_link_offset : 0,
      linkVisibility: this.props.talk
        ? this.props.talk.visibility
        : "Everybody",
      topics: [],
      talkSpeaker: this.props.talk ? this.props.talk.talk_speaker : "",
      talkSpeakerURL: this.props.talk ? this.props.talk.talk_speaker_url : "",
      published: this.props.talk ? this.props.talk.published : 0,
    };
  }

  onFinishClicked = () => {
    this.setState(
      {
        published: 1,
        loading: true,
      },
      () => {
        this.onFinish();
      }
    );
  };

  combineDateAndTimeStrings = () => {
    const startDate = new Date(
      `${this.state.date.slice(0, 10)} ${this.state.startTime}`
    )
      .toISOString()
      .slice(0, 16)
      .replace("T", " ");
    const endDate = new Date(
      `${this.state.date.slice(0, 10)} ${this.state.endTime}`
    )
      .toISOString()
      .slice(0, 16)
      .replace("T", " ");
    return [startDate, endDate];
  };

  makeLinkDateOption = (offset: number) => {
    let label;
    switch (offset) {
      case 0:
        label = "Now";
        break;
      case 15:
        label = "15 minutes before talk";
        break;
      case 60:
        label = "1 hour before talk";
        break;
      case 1440:
        label = "24 hours before talk";
        break;
    }
    // console.log(label);
    return {
      label: label,
      value: offset,
    };
  };

  makeLinkDateOptions = () => {
    const offsets = [0, 15, 60, 1440];
    return offsets.map(this.makeLinkDateOption);
  };

  onFinish = () => {
    const dateTimeStrs = this.combineDateAndTimeStrings();
    console.log("NOW", this.state)
    console.log("NOW1", this.props.talk)
    if (this.props.talk) {
      TalkService.editTalk(
        this.props.talk.id,
        this.state.title,
        this.state.description,
        dateTimeStrs[0],
        dateTimeStrs[1],
        this.state.link,
        this.state.tags,
        this.state.releaseLinkOffset,
        this.state.linkVisibility,
        this.state.topics,
        this.state.talkSpeaker,
        this.state.talkSpeakerURL,
        this.state.published,
        (talk: Talk) => {
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
      TalkService.scheduleTalk(
        this.props.channel!.id,
        this.props.channel!.name,
        this.state.title,
        this.state.description,
        dateTimeStrs[0],
        dateTimeStrs[1],
        this.state.link,
        this.state.tags,
        this.state.releaseLinkOffset,
        this.state.linkVisibility,
        this.state.topics,
        this.state.talkSpeaker,
        this.state.talkSpeakerURL,
        this.state.published,
        (talk: Talk) => {
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
    if (!this.props.talk) {
      return;
    }
    TalkService.deleteTalk(this.props.talk.id, () => {
      this.props.onDeletedCallback();
    });
  };

  onSaveDraft = () => {
    if (!this.props.talk) {
      return;
    }
    this.setState({ published: 0 });
    this.setState(
      {
        loading: true,
      },
      () => {
        this.onFinish();
      }
    );
  }

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

  selectTopic = (topic: Topic, num: number) => {
    console.log(num, topic)
    let tempTopics = this.state.topics;
    tempTopics[num] = topic;
    this.setState({
      topics: tempTopics
    });
  }

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
      <Overlay
        width={1100}
        height={750}
        visible={this.props.visible}
        title={this.props.talk ? "Edit talk" : "New talk"}
        submitButtonText="Publish"
        onSubmitClick={this.onFinishClicked}
        contentHeight="600px"
        canProceed={this.isComplete()}
        onCancelClick={this.props.onCanceledCallback}
        onClickOutside={this.props.onCanceledCallback}
        onEsc={this.props.onCanceledCallback}
        deleteButton={
          this.props.talk ? (
            <Button
              fill="#FF4040"
              width="90px"
              height="35px"
              text="Delete"
              onClick={this.onDeleteClicked}
            />
          ) : null
        }
        saveDraftButton={
          this.props.talk ? (
            <Button
              width="170px"
              height="35px"
              text="Save as draft"
              onClick={this.onSaveDraft}
            />
          ) : null
        }
      >
        <Box direction="row">
          <Box
            direction="column"
            width="33%"
            margin={{ right: "12px" }}
          >
            <OverlaySection> {/* heading="Add a title and a short description"> */}
              <Box width="100%" gap="5px">
                <Text size="14px" weight="bold" color="black">
                  Title
                </Text>
                <TextInput
                  placeholder=""
                  value={this.state.title}
                  onChange={(e) => this.setState({ title: e.target.value })}
                />
              </Box>
              <Box width="100%" gap="5px">
                <Text size="14px" weight="bold" color="black">
                  Speaker
                </Text>
                <TextInput
                  placeholder=""
                  value={this.state.talkSpeaker}
                  onChange={(e) => this.setState({ talkSpeaker: e.target.value })}
                />
              </Box>
              <Box width="100%" gap="5px">
                <Text size="14px" weight="bold" color="black">
                  Speaker website
                </Text>
                <TextInput
                  placeholder="Enter a valid URL"
                  value={this.state.talkSpeakerURL}
                  onChange={(e) => this.setState({ talkSpeakerURL: e.target.value })}
                />
              </Box>
              <Box width="100%" gap="5px" margin={{ bottom: "0px" }}>
                <Text size="14px" weight="bold" color="black">
                  Description
                </Text>
                <TextArea
                  style={{ height: "102px" }}
                  value={this.state.description}
                  placeholder=""
                  onChange={(e) => this.setState({ description: e.target.value })}
                />
              </Box>
            </OverlaySection>
            {/*<OverlaySection heading="Add a few relevant tags">
              <TagSelector
                selected={this.props.talk?.tags}
                onSelectedCallback={this.selectTag}
                onDeselectedCallback={this.deselectTag}
                width="100%"
                height="200px"
              />
                </OverlaySection>*/}

          </Box>
          <Box
            direction="column"
            width="33%"
            margin={{ left: "large", right: "xsmall" }}
          >
            <OverlaySection> {/*heading="When is your talk going to be held?">*/}
              <Calendar
                date={this.state.date}
                bounds={this.getDateBounds()}
                size="small"
                onSelect={(date: any) => {
                  this.setState({ date });
                }}
                daysOfWeek
                style={{ width: "100%" }}
              />
              <Box direction="row" gap="medium" margin={{ top: "medium" }}>
                <Box direction="column" width="100%" gap="5px">
                  <Text size="14px" weight="bold" color="black">
                    Start
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
                <Box direction="column" width="100%" gap="5px">
                  <Text size="14px" weight="bold" color="black">
                    Finish
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
              </Box>
            </OverlaySection>
          </Box>

          <Box
            direction="column"
            width="33%"
            margin={{ left: "large", right: "xsmall", top: "6px" }}
          >
            <OverlaySection heading="Link to talk ">
              <Text
                size="14px"
                weight="bold"
                color="grey"
                alignSelf="start"
                margin={{ top: "10px", bottom: "21px" }}
              >
                Enter here a link towards a meeting room. No need to put a password, you choose the users you want to show the link to!
              </Text>
              <TextInput
                value={this.state.link}
                placeholder="e.g. https://zoom.us/"
                onChange={(e) => this.setState({ link: e.target.value })}
              />
              <Box width="100%" gap="5px" margin={{ top: "24px" }}>
                <Text size="14px" weight="bold" color="black">
                  Visible...
                </Text>
                <Select
                  dropAlign={{ bottom: "top" }}
                  focusIndicator={false}
                  id="link-release-select"
                  options={this.makeLinkDateOptions()}
                  labelKey="label"
                  value={this.makeLinkDateOption(this.state.releaseLinkOffset)}
                  valueLabel={
                    <Text
                      weight="bold"
                      margin={{ horizontal: "small", vertical: "10px" }}
                    >
                      {this.makeLinkDateOption(this.state.releaseLinkOffset).label}
                    </Text>
                  }
                  onChange={({ option }) => {
                    console.log("OPTION: ", option);
                    this.setState({ releaseLinkOffset: option.value });
                  }}
                />
              </Box>
              <Box width="100%" gap="5px">
                <Text size="14px" weight="bold" color="black">
                  By...
                </Text>
                <Select
                  dropAlign={{ bottom: "top" }}
                  focusIndicator={false}
                  id="link-visibility-select"
                  options={["Everybody", "Followers and members", "Members only"]}
                  value={this.state.linkVisibility}
                  onChange={({ option }) =>
                    this.setState({ linkVisibility: option })
                  }
                />
              </Box>
            </OverlaySection>
          </Box>
        </Box>
        <OverlaySection heading="Related topics">
          <TopicSelector onSelectedCallback={this.selectTopic} />
        </OverlaySection>
      </Overlay>
    );
  }
}
