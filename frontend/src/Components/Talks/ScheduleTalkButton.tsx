import React, { Component } from "react";
import { Box, Text } from "grommet";
import "../../Styles/manage-channel.css";
import { Channel } from "../../Services/ChannelService";
import EditTalkModal from "./EditTalkModal";

interface Props {
  margin: string;
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
          onClick={this.toggleModal}
          background="#7E1115"
          round="xsmall"
          margin={{bottom: "medium"}}
          pad={{bottom: "small", top: "small", left: "medium", right: "medium"}}
          height="40px"
          justify="center"
          align="center"
          focusIndicator={false}
          // hoverIndicator="#2433b5"
          hoverIndicator="#5A0C0F"
        >
          <Text size="20px"> Schedule talk </Text>
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
