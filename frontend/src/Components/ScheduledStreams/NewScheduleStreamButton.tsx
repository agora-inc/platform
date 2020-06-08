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
import "../../Styles/manage-channel.css";
import TagSelector from "../Core/TagSelector";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../../Services/ScheduledStreamService";
import { Tag } from "../../Services/TagService";
import { Channel } from "../../Services/ChannelService";
import Loading from "../Core/Loading";
import { Overlay, OverlaySection } from "../Core/Overlay";
import EditTalkModal from "./EditTalkModal";

interface Props {
  margin: string;
  channel: Channel | null;
  onCreatedCallback: any;
}

interface State {
  showModal: boolean;
}

export default class NewScheduleStreamButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
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
        <EditTalkModal
          visible={this.state.showModal}
          channel={this.props.channel}
          onCanceledCallback={this.toggleModal}
          onFinishedCallback={() => {
            this.toggleModal();
            this.props.onCreatedCallback();
          }}
        />
      </Box>
    );
  }
}
