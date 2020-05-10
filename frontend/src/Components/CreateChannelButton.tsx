import React, { Component } from "react";
import { Box, Text } from "grommet";
import Identicon from "react-identicons";
import { Channel } from "../Services/ChannelService";

interface State {
  hover: boolean;
}

export default class CreateChannelButton extends Component<{}, State> {
  constructor(props: any) {
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
        <Text>Create channel</Text>
        <Text size="20px">🚀</Text>
      </Box>
    );
  }
}
