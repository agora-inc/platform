import React, { Component } from "react";
import { Box, Text } from "grommet";
import { User } from "../../Services/UserService";
import { ChannelService } from "../../Services/ChannelService";
import Identicon from "react-identicons";
import Avatar from 'react-avatar';

interface Props {
  user: User;
  channelId?: number;
  onRemovedCallback?: any;
  showRemoveButton: boolean;
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

  onRemoveClicked = () => {
    this.props.channelId &&
      ChannelService.removeUserFromChannel(
        this.props.user.id,
        this.props.channelId,
        () => {
          this.props.onRemovedCallback();
        }
      );
  };

  render() {
    return (
      <Box style={{ position: "relative" }}>
        {this.state.hover && (
          <Box
            direction="row"
            style={{
              zIndex: 10,
              border: "2px solid black",
              width: "fit-content",
            }}
            height="35px"
            background="white"
            round="xsmall"
            pad={{ horizontal: "3px" }}
            onMouseEnter={() => this.setState({ hover: true })}
            onMouseLeave={() => this.setState({ hover: false })}
            align="center"
            gap="xsmall"
          >
            <Text size="14px" weight="bold" color="black">
              {this.props.user.username}
            </Text>
            {this.props.showRemoveButton && (
              <Box
                background="#FF4040"
                round="4px"
                pad="2.5px"
                align="center"
                justify="center"
                onClick={this.onRemoveClicked}
              >
                <Text color="white" size="14px" style={{ fontWeight: 500 }}>
                  remove
                </Text>
              </Box>
            )}
          </Box>
        )}
        <Box
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })}
          // background="white"
          height="40px"
          width="40px"
          // round="25px"
          justify="center"
          align="center"
          margin={{ top: this.state.hover ? "-23px" : "none" }}
        >
          <Avatar name={this.props.user.username} size="33" round={true}/>
        </Box>
      </Box>
    );
  }
}
