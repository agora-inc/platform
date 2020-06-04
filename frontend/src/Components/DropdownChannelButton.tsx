import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import Identicon from "react-identicons";
import { Channel } from "../Services/ChannelService";

interface Props {
  channel: Channel;
  onClick: any;
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
      <Link
        to={{
          pathname: `/channel/${this.props.channel.name}/manage`,
          state: { channel: this.props.channel },
        }}
        style={{ height: 40 }}
      >
        <Box
          height="40px"
          onClick={this.props.onClick}
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
          <Text
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {this.props.channel.name}
          </Text>
          <Box
            height="20px"
            width="20px"
            round="10px"
            justify="center"
            align="center"
            overflow="hidden"
          >
            {!this.props.channel.has_avatar && (
              <Identicon string={this.props.channel.name} size={20} />
            )}
            {!!this.props.channel.has_avatar && (
              <img src={`/images/channel-icons/${this.props.channel.id}.jpg`} />
            )}
          </Box>
        </Box>
      </Link>
    );
  }
}
