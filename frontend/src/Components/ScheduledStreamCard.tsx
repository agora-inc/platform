import React, { Component } from "react";
import { Box, Text, Button } from "grommet";
import { Down, Up } from "grommet-icons";
import { ScheduledStream } from "../Services/ScheduledStreamService";
import Identicon from "react-identicons";

interface Props {
  stream: ScheduledStream;
}

interface State {
  expanded: boolean;
}

export default class ScheduledStreamService extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  renderUnexpandedCard = () => {
    return (
      <Box
        direction="row"
        background="white"
        justify="between"
        align="center"
        width="864px"
        height="74px"
        gap="small"
        pad={{ horizontal: "small" }}
        round="small"
      >
        <Box direction="row" gap="small" align="center">
          <Box
            width="50px"
            height="50px"
            round="25px"
            background="black"
            justify="center"
            align="center"
          >
            <Identicon string={this.props.stream.channel_name} size={35} />
          </Box>
          <Text
            color="black"
            size="24px"
            weight="bold"
            style={{
              width: 450,
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {this.props.stream.name}
          </Text>
        </Box>
        <Box direction="row" gap="small" align="center">
          <Box
            background="brand"
            width="150px"
            height="35px"
            round="small"
            justify="center"
            align="center"
          >
            <Text size="18px" weight="bold" color="white">
              Fri 24 April
            </Text>
          </Box>
          <Box
            direction="row"
            align="end"
            gap="xsmall"
            onClick={() => this.setState({ expanded: true })}
            focusIndicator={false}
          >
            <Text size="20px" weight="bold" color="black">
              Details
            </Text>
            <Down size="22px" color="black" />
          </Box>
        </Box>
      </Box>
    );
  };

  renderExpandedCard = () => {
    return (
      <Box
        background="white"
        width="864px"
        round="small"
        pad={{ horizontal: "small", bottom: "small" }}
      >
        <Box
          direction="row"
          justify="between"
          align="center"
          height="74px"
          gap="small"
        >
          <Box direction="row" gap="small" align="center">
            <Box
              width="50px"
              height="50px"
              round="25px"
              background="black"
              justify="center"
              align="center"
            >
              <Identicon string={this.props.stream.channel_name} size={35} />
            </Box>
            <Box
              background="#606EEB"
              width="180px"
              height="35px"
              round="small"
              justify="center"
              align="center"
            >
              <Text size="18px" weight="bold" color="white">
                {this.props.stream.channel_name}
              </Text>
            </Box>
            <Box
              background="brand"
              width="240px"
              height="35px"
              round="small"
              justify="center"
              align="center"
            >
              <Text size="18px" weight="bold" color="white">
                Fri 24 April 17:00 BST
              </Text>
            </Box>
          </Box>
          <Box
            direction="row"
            align="end"
            gap="xsmall"
            onClick={() => this.setState({ expanded: false })}
            focusIndicator={false}
          >
            <Text size="20px" weight="bold" color="black">
              Details
            </Text>
            <Up size="22px" color="black" />
          </Box>
        </Box>
        <Box direction="row" justify="between" align="end">
          <Text style={{ width: 581 }} weight="bold" color="black" size="24px">
            {this.props.stream.name}
          </Text>
          <Box
            background="black"
            width="150px"
            height="50px"
            round="30px"
            justify="center"
            align="center"
            onClick={() => {}}
            focusIndicator={false}
          >
            <Text weight="bold" color="white" size="24px">
              Register
            </Text>
          </Box>
        </Box>
      </Box>
    );
  };

  render() {
    return this.state.expanded
      ? this.renderExpandedCard()
      : this.renderUnexpandedCard();
  }
}
