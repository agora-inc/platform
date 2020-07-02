import React, { Component } from "react";
import { Box, Text } from "grommet";
import "../../Styles/manage-channel.css";
import { Channel } from "../../Services/ChannelService";
import EditTalkModal from "./EditTalkModal";

interface Props {
  margin: any;
  channel: Channel | null;
  onCreatedCallback: any;
}

interface State {
  showModal: boolean;
}

export default class ScheduleTalkButton extends Component<Props, State> {
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
          // className="gradient-border"
          round="8px"
          align="center"
          justify="center"
          onClick={this.toggleModal}
          focusIndicator={false}
          background="#606eeb"
          height="42px"
          pad={{ horizontal: "small" }}
        >
          <Text color="white" size="16.5px" style={{ fontWeight: 500 }}>
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
