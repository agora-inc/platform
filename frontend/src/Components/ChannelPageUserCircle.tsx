import React, { Component } from "react";
import { Box, Text } from "grommet";
import { User } from "../Services/UserService";
import Identicon from "react-identicons";

interface Props {
  user: User;
}

interface State {
  hover: boolean;
}

export default class ChannelPageUserCircle extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hover: false,
    };
  }

  render() {
    return (
      <Box style={{ position: "relative" }}>
        {this.state.hover && (
          <Box
            style={{
              zIndex: 10,
              border: "2px solid black",
              width: "fit-content",
            }}
            height="23px"
            background="white"
            round="xsmall"
            pad={{ horizontal: "3px" }}
            onMouseEnter={() => this.setState({ hover: true })}
            onMouseLeave={() => this.setState({ hover: false })}
          >
            <Text size="14px" weight="bold" color="black">
              {this.props.user.username}
            </Text>
          </Box>
        )}
        <Box
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })}
          background="white"
          height="50px"
          width="50px"
          round="25px"
          justify="center"
          align="center"
          margin={{ top: this.state.hover ? "-23px" : "none" }}
        >
          <Identicon string={this.props.user.username} size={30} />
        </Box>
      </Box>
    );
  }
}
