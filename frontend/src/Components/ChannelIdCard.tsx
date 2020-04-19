import React, { Component } from "react";
import { Box, Text } from "grommet";
import { Link } from "react-router-dom";

interface Props {
  channelName: string;
}

export default class ChannelIdCard extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Link
        to={`/channel/${this.props.channelName}`}
        style={{ textDecoration: "none" }}
      >
        <Box
          direction="row"
          background="#606EEB"
          round="small"
          align="center"
          justify="center"
          pad="small"
          gap="xsmall"
        >
          {/* <img
            src={`/images/channel-icons/${this.props.channelName}.png`}
            width={40}
            height={40}
          ></img> */}
          <Text color="white" size="24px" weight="bold">
            {this.props.channelName}
          </Text>
        </Box>
      </Link>
    );
  }
}
