import React, { Component } from "react";
import { Box, Text, Button, Layer } from "grommet";
import { ScheduledStream } from "../Services/ScheduledStreamService";
import Identicon from "react-identicons";

interface Props {
  stream: ScheduledStream;
  loggedIn: boolean;
}

interface State {
  showModal: boolean;
}

export default class ScheduledStreamCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }
  formatDate = (d: string) => {
    const date = new Date(d);
    const dateStr = date.toDateString().slice(0, -4);
    const timeStr = date.toTimeString().slice(0, 5);
    return `${dateStr} ${timeStr}`;
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  render() {
    return (
      <Box
        width="32%"
        height="300px"
        onClick={this.toggleModal}
        focusIndicator={false}
      >
        <Box
          height="100%"
          width="100%"
          background="white"
          round="xsmall"
          // align="center"
          pad="15px"
          justify="between"
          gap="small"
        >
          <Box height="35%">
            <Box
              direction="row"
              gap="xsmall"
              align="center"
              style={{ minHeight: "30px" }}
            >
              <Box
                height="25px"
                width="25px"
                round="12.5px"
                justify="center"
                align="center"
                background="#efeff1"
              >
                <Identicon string={this.props.stream.channel_name} size={15} />
              </Box>
              <Text
                weight="bold"
                size="18px"
                color={this.props.stream.channel_colour}
              >
                {this.props.stream.channel_name}
              </Text>
            </Box>
            <Text
              weight="bold"
              size="20px"
              color="black"
              style={{
                // whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {this.props.stream.name}
            </Text>
          </Box>
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
          </Box>
        </Box>
        {this.state.showModal && (
          <Layer
            onEsc={this.toggleModal}
            onClickOutside={this.toggleModal}
            modal
            responsive
            animation="fadeIn"
            style={{ width: 375, height: 450, borderRadius: 15 }}
          >
            <Box
              // align="center"
              pad="25px"
              width="100%"
              height="100%"
              justify="between"
              gap="small"
            >
              <Box height="40%">
                <Text weight="bold" size="22px" color="pink">
                  {this.props.stream.channel_name}
                </Text>
                <Text
                  weight="bold"
                  size="24px"
                  color="black"
                  style={{ overflowY: "scroll" }}
                >
                  {this.props.stream.name}
                </Text>
              </Box>
              <Box height="60%" gap="small" justify="end">
                <Text size="22px" color="black" style={{ overflowY: "scroll" }}>
                  {this.props.stream.description}
                </Text>
                <Text size="18px" color="black" weight="bold">
                  {this.formatDate(this.props.stream.date)}
                </Text>
                <Button
                  primary
                  color="black"
                  disabled={!this.props.loggedIn}
                  label={
                    this.props.loggedIn ? "Register" : "Log in to register"
                  }
                  size="large"
                ></Button>
              </Box>
            </Box>
          </Layer>
        )}
      </Box>
    );
  }
}
