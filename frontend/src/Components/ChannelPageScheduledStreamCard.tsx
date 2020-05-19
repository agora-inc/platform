import React, { Component } from "react";
import { Box, Text, Button } from "grommet";
import { ScheduledStream } from "../Services/ScheduledStreamService";

interface Props {
  stream: ScheduledStream;
  loggedIn: boolean;
}

export default class ChannelPageScheduledStreamCard extends Component<Props> {
  formatDate = (d: string) => {
    const date = new Date(d);
    const dateStr = date.toDateString().slice(0, -4);
    const timeStr = date.toTimeString().slice(0, 5);
    return `${dateStr} ${timeStr}`;
  };

  render() {
    return (
      <Box
        background="white"
        round="10px"
        // align="center"
        pad="15px"
        width="32%"
        height="325px"
        justify="between"
        gap="small"
      >
        <Text weight="bold" size="20px" color="black">
          {this.props.stream.name}
        </Text>
        <Box gap="small">
          <Text
            size="18px"
            color="black"
            style={{ maxHeight: 150, overflow: "scroll" }}
          >
            {this.props.stream.description}
          </Text>
          <Text size="18px" color="black" weight="bold">
            {this.formatDate(this.props.stream.date)}
          </Text>
          <Button
            primary
            color="black"
            disabled={!this.props.loggedIn}
            label={this.props.loggedIn ? "Register" : "Log in to register"}
            size="large"
          ></Button>
        </Box>
      </Box>
    );
  }
}
