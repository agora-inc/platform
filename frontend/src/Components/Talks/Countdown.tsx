import React, { Component } from "react";
import { Box, Text } from "grommet";

interface Props {
  targetTime: string;
  link: string;
}

interface State {
  currentTime: string;
  offset: number; // Number of seconds before the talk the link is released
  countdown: number; // number of seconds until link is released
  showLink: boolean;
}

export default class Countdown extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentTime: new Date().toString(),
      offset: 900,
      countdown:
        ((new Date(this.props.targetTime).getTime() - new Date().getTime()) /
          1000) >>
        0,
      showLink: false,
    };
  }

  componentWillMount() {
    setInterval(() => {
      let now = new Date();
      this.setState({
        currentTime: now.toString(),
        countdown:
          ((new Date(this.props.targetTime).getTime() - now.getTime()) / 1000 -
            this.state.offset) >>
          0,
        showLink: this.state.countdown <= 0,
      });
    }, 1000);
  }

  formatTime() {
    let days = (this.state.countdown / 86400) >> 0;
    let temp = this.state.countdown % 86400;
    let hours = (temp / 3600) >> 0;
    temp = temp % 3600;
    let minutes = (temp / 60) >> 0;
    let dayString = "";
    if (days == 1) {
      dayString = days + " day ";
    } else if (days > 1) {
      dayString = days + " days ";
    }

    return (
      dayString +
      ("0" + hours).slice(-2) +
      "h " +
      ("0" + minutes).slice(-2) +
      "m"
    );
  }

  render() {
    return (
      <Box>
        {this.state.showLink && <Box>Link to talk: {this.props.link}</Box>}
        {!this.state.showLink && <Box>Link shown in: {this.formatTime()}</Box>}
      </Box>
    );
  }
}
