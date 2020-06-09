import React, { Component } from "react";
import { Box, Text, Button, Layer, TextInput } from "grommet";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../../Services/ScheduledStreamService";
import { Tag } from "../../Services/TagService";
import { default as TagComponent } from "../Core/Tag";
import { default as CoreButton } from "../Core/Button";
import Identicon from "react-identicons";
import "../../Styles/past-talk-card.css";

interface Props {
  stream: ScheduledStream;
  admin?: boolean;
  height?: any;
  width?: any;
  margin?: any;
  onDelete?: any;
}

interface State {
  showModal: boolean;
  showShadow: boolean;
  registered: boolean;
  showLinkInput: boolean;
  recordingLink: string;
}

export default class PastScheduledStreamCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      showShadow: false,
      registered: false,
      showLinkInput: false,
      recordingLink: this.props.stream.recording_link
        ? this.props.stream.recording_link
        : "",
    };
  }
  formatDate = (d: string) => {
    const date = new Date(d);
    const dateStr = date.toDateString().slice(0, -4);
    const timeStr = date.toTimeString().slice(0, 5);
    return [dateStr, timeStr];
  };

  toggleModal = () => {
    this.setState({
      showModal: this.state.showLinkInput ? true : !this.state.showModal,
      showShadow: true,
    });
  };

  onDeleteClicked = () => {
    ScheduledStreamService.deleteScheduledStream(this.props.stream.id, () => {
      this.props.onDelete();
    });
  };

  onSaveRecordingUrlClicked = () => {
    ScheduledStreamService.addRecordingLink(
      this.props.stream.id,
      this.state.recordingLink,
      () => {
        this.setState({ showLinkInput: false });
      }
    );
  };

  getButtons = () => {
    if (this.props.admin) {
      return (
        <Box gap="xsmall">
          <Button
            size="large"
            label="Link recording"
            color={this.props.stream.channel_colour}
            primary
            onClick={() =>
              this.setState({
                showLinkInput: !this.state.showLinkInput,
                showModal: true,
              })
            }
          />
          <Button
            size="large"
            label="Delete"
            primary
            color="#FF4040"
            onClick={this.onDeleteClicked}
          />
        </Box>
      );
    } else if (this.props.stream.recording_link) {
      return (
        <a
          href={this.props.stream.recording_link}
          target="_blank"
          style={{ width: "100%" }}
        >
          <Button
            primary
            color={this.props.stream.channel_colour}
            label="Watch talk"
            size="large"
            style={{ width: "100%" }}
          ></Button>
        </a>
      );
    } else {
      return;
    }
  };

  render() {
    let [dateStr, timeStr] = this.formatDate(this.props.stream.date);
    return (
      <Box
        width={this.props.width ? this.props.width : "32%"}
        height={this.props.height ? this.props.height : "300px"}
        onClick={this.toggleModal}
        focusIndicator={false}
        style={{ position: "relative" }}
        margin={this.props.margin ? this.props.margin : { bottom: "small" }}
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
          overflow="hidden"
          justify="between"
          gap="small"
          style={{ position: "relative" }}
        >
          {this.props.stream.recording_link && (
            <img
              src={ScheduledStreamService.getYoutubeThumbnail(
                this.props.stream.recording_link,
                this.props.stream.id
              )}
              style={{ height: "50%" }}
            />
          )}
          {!this.props.stream.recording_link && (
            <Box
              height="50%"
              background={this.props.stream.channel_colour}
            ></Box>
          )}
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
              className={this.props.stream.name.length > 40 ? "fade" : "nvm"}
              weight="bold"
              size="20px"
              color="black"
              style={{
                // whiteSpace: "nowrap",
                overflow: "hidden",
                // textOverflow: "ellipsis",
                lineHeight: "23px",
                // maxHeight: "63px",
              }}
            >
              {this.props.stream.name}
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
            onClick={(e) => e.stopPropagation()}
            modal
            responsive
            animation="fadeIn"
            style={{
              width: 400,
              height: 500,
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
                style={{ height: "40%", position: "relative" }}
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
                <Text size="18px" color="black">
                  Held on{" "}
                  <Text size="18px" color="black" weight="bold">
                    {dateStr}
                  </Text>{" "}
                  at{" "}
                  <Text size="18px" color="black" weight="bold">
                    {timeStr}
                  </Text>
                </Text>
                {this.state.showLinkInput && (
                  <Box
                    direction="row"
                    width="100%"
                    height="45px"
                    background="#f5f5f5"
                    round="xsmall"
                    pad="xsmall"
                    justify="center"
                    align="center"
                    gap="xsmall"
                    style={{
                      position: "absolute",
                      bottom: 0,
                    }}
                  >
                    <TextInput
                      style={{ height: 32 }}
                      value={this.state.recordingLink}
                      onChange={(e) => {
                        this.setState({ recordingLink: e.target.value });
                      }}
                    />
                    <CoreButton
                      width="25%"
                      height="32px"
                      text="save"
                      onClick={this.onSaveRecordingUrlClicked}
                    />
                  </Box>
                )}
              </Box>
              {this.getButtons()}
            </Box>
            {!this.props.stream.recording_link && !this.props.admin && (
              <Box
                background="#d5d5d5"
                pad="small"
                align="center"
                justify="center"
              >
                <Text textAlign="center" weight="bold">
                  Sorry, there is currently no recording available for this talk
                  :(
                </Text>
              </Box>
            )}
          </Layer>
        )}
      </Box>
    );
  }
}
