import React, { Component } from "react";
import { Box, Text } from "grommet";
import Identicon from "react-identicons";
import { ScheduledStream } from "../Services/ScheduledStreamService";

interface Props {
  stream: ScheduledStream;
}

export default class NewScheduledStreamCard extends Component<Props> {
  render() {
    return (
      <Box
        width="270px"
        height="351px"
        background="#f2f2f2"
        round="10px"
        pad="20px"
        justify="between"
      >
        <Text
          size="20px"
          color="black"
          weight="bold"
          margin="none"
          style={{ height: "40%" }}
        >
          {this.props.stream.name}
        </Text>
        <Box width="100%" direction="row" justify="end" margin="none">
          <Box
            width="110px"
            height="110px"
            round="55px"
            background="white"
            justify="center"
            align="center"
          >
            <Identicon size={60} string={this.props.stream.channel_name} />
          </Box>
        </Box>
        <Text size="18px" color="black" weight="bold" margin="none">
          Fri 24 April 17:00 BST
        </Text>
      </Box>
    );
  }
}
