import React, { Component } from "react";
import { Box, Text, Button, Layer, TextInput } from "grommet";
import { Talk, TalkService } from "../../Services/TalkService";
import { ChannelService } from "../../Services/ChannelService";
import { User } from "../../Services/UserService";
import { Tag } from "../../Services/TagService";
import { default as TagComponent } from "../Core/Tag";
import { default as CoreButton } from "../Core/Button";
import Identicon from "react-identicons";
import "../../Styles/past-talk-card.css";

interface Props {
  talk: Talk;
  admin?: boolean;
  height?: any;
  width?: any;
  margin?: any;
  onDelete?: any;
  onSave?: any;
  onUnsave?: any;
  user: User | null;
}

interface State {
  showModal: boolean;
  showShadow: boolean;
  saved: boolean;
  showLinkInput: boolean;
  recordingLink: string;
}

export default class PastTalkCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      showShadow: false,
      saved: false,
      showLinkInput: false,
      recordingLink: this.props.talk.recording_link
        ? this.props.talk.recording_link
        : "",
    };
  }

  componentWillMount() {
    this.checkIfSaved();
  }

  checkIfSaved = () => {
    this.props.user &&
      TalkService.isSaved(
        this.props.user.id,
        this.props.talk.id,
        (saved: boolean) => {
          this.setState({ saved });
        }
      );
  };

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
    TalkService.deleteTalk(this.props.talk.id, () => {
      this.props.onDelete();
    });
  };

  onSaveRecordingUrlClicked = () => {
    TalkService.addRecordingLink(
      this.props.talk.id,
      this.state.recordingLink,
      () => {
        this.setState({ showLinkInput: false });
      }
    );
  };

  onSaveTalkClicked = () => {
    if (!this.props.user) {
      return;
    }
    if (this.state.saved) {
      TalkService.unsaveTalk(this.props.user.id, this.props.talk.id, () => {
        this.toggleModal();
        this.setState({ saved: false });
        this.props.onUnsave && this.props.onUnsave();
      });
    } else {
      TalkService.saveTalk(this.props.user.id, this.props.talk.id, () => {
        this.toggleModal();
        this.setState({ saved: true });
        this.props.onSave && this.props.onSave();
      });
    }
  };

  getButtons = () => {
    if (this.props.admin) {
      return (
        <Box gap="xsmall">
          <Button
            size="large"
            label="Link recording"
            color={this.props.talk.channel_colour}
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
    } else if (this.props.talk.recording_link) {
      return (
        <Box gap="xsmall">
          <a
            href={this.props.talk.recording_link}
            target="_blank"
            style={{ width: "100%" }}
          >
            <Button
              primary
              color={this.props.talk.channel_colour}
              label="Watch talk"
              size="large"
              style={{ width: "100%" }}
            ></Button>
          </a>
          {this.props.user && (
            <Button
              onClick={this.onSaveTalkClicked}
              primary
              color={this.props.talk.channel_colour}
              label={this.state.saved ? "Remove from saved" : "Save talk"}
              size="large"
              style={{ width: "100%" }}
            ></Button>
          )}
        </Box>
      );
    } else {
      return;
    }
  };

  render() {
    let [dateStr, timeStr] = this.formatDate(this.props.talk.date);
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
          {this.props.talk.recording_link && (
            <img
              src={TalkService.getYoutubeThumbnail(
                this.props.talk.recording_link,
                this.props.talk.id
              )}
              style={{ height: "50%" }}
            />
          )}
          {!this.props.talk.recording_link && (
            <Box
              height="50%"
              background={this.props.talk.channel_colour}
              style={{ opacity: 0.75 }}
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
              className={this.props.talk.name.length > 40 ? "fade" : "nvm"}
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
              {this.props.talk.name}
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
                style={{ height: "40%", position: "relative" }}
              >
                <Text size="22px" color="black" style={{ overflowY: "auto" }}>
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
            {!this.props.talk.recording_link && !this.props.admin && (
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
