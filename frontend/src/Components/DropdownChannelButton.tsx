import React, { Component } from "react";
import { Box, Text } from "grommet";
import Identicon from "react-identicons";
import { Channel } from "../Services/ChannelService";

interface Props {
  channel: Channel;
}

interface State {
  hover: boolean;
}

export default class DropdownChannelButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hover: false,
    };
  }

  render() {
    return (
      <Box
        onMouseEnter={() => {
          this.setState({ hover: true });
        }}
        onMouseLeave={() => {
          this.setState({ hover: false });
        }}
        direction="row"
        gap="xsmall"
        align="center"
        background={this.state.hover ? "#f2f2f2" : "white"}
        round="xsmall"
        pad="xsmall"
        style={{ border: "black 2px solid" }}
        justify="between"
      >
        <Text>{this.props.channel.name}</Text>
        <Box
          height="20px"
          width="20px"
          round="10px"
          justify="center"
          align="center"
          overflow="hidden"
        >
          <Identicon string={this.props.channel.name} size={20} />
        </Box>
      </Box>
    );
  }
}
