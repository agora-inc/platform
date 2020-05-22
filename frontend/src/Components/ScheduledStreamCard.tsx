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
      <Box width="32%" height="100%">
        <Box
          height="100%"
          width="100%"
          background="white"
          round="10px"
          // align="center"
          pad="15px"
          justify="between"
          gap="small"
        >
          <Box height="25%">
            <Text weight="bold" size="18px" color="pink">
              {this.props.stream.channel_name}
            </Text>
            <Text weight="bold" size="20px" color="black">
              {this.props.stream.name}
            </Text>
          </Box>
          <Box
            width="100px"
            height="100px"
            round="50px"
            style={{ border: "5px solid pink" }}
            justify="center"
            align="center"
            alignSelf="end"
          >
            <Identicon string={this.props.stream.channel_name} size={65} />
          </Box>
          <Box gap="small">
            {/* <Text
            size="18px"
            color="black"
            style={{ maxHeight: 150, overflow: "scroll" }}
          >
            {this.props.stream.description}
          </Text> */}
            <Text size="18px" color="black" weight="bold">
              {this.formatDate(this.props.stream.date)}
            </Text>
            <Button
              primary
              color="black"
              // disabled={!this.props.loggedIn}
              // label={this.props.loggedIn ? "Register" : "Log in to register"}
              label="Details"
              size="large"
              onClick={this.toggleModal}
            ></Button>
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
              <Box>
                <Text weight="bold" size="22px" color="pink">
                  {this.props.stream.channel_name}
                </Text>
                <Text weight="bold" size="24px" color="black">
                  {this.props.stream.name}
                </Text>
              </Box>
              <Box gap="small">
                <Text
                  size="22px"
                  color="black"
                  // style={{ maxHeight: , overflow: "scroll" }}
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
