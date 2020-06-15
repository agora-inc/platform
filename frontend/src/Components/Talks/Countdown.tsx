import React, { Component } from "react";
import { Box, Text } from "grommet";
var moment = require("moment");

interface Props {
  talkStart: string;
  showLinkOffset: number;
  link: string;
}

interface State {
  showLinkAt: Date;
  now: Date;
  // offset: number; // Number of seconds before the talk the link is released
  // countdown: number; // number of seconds until link is released
  // showLink: boolean;
}

export default class Countdown extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showLinkAt: this.computeShowLinkTime(),
      now: new Date(),
    };
  }

  computeShowLinkTime = () => {
    let d = new Date(this.props.talkStart);
    return moment(d).subtract(this.props.showLinkOffset, "minutes").toDate();
  };

  componentWillMount() {
    setInterval(() => {
      this.setState({ now: new Date() });
    }, 1000);
  }

  shouldShowLink = () => {
    return this.state.now > this.state.showLinkAt;
  };

  showTimeUntil = () => {
    let message = "Link available in ";
    let minutesUntil =
      (this.state.showLinkAt.getTime() - this.state.now.getTime()) /
      (1000 * 60);

    if (minutesUntil < 60) {
      message += `${minutesUntil} minutes`;
    } else if (minutesUntil < 1440) {
      let hoursUntil = Math.floor(minutesUntil / 60);
      let minutesRemainder = Math.floor(minutesUntil % 60);
      message += `${hoursUntil} hours ${minutesRemainder} minutes`;
    } else {
      let daysUntil = Math.floor(minutesUntil / 1440);
      let hoursRemainder = Math.floor((minutesUntil % 1440) / 60);
      let minutesRemainder = Math.floor((minutesUntil % 1440) % 60);
      message += `${daysUntil} days ${hoursRemainder} hours ${minutesRemainder} minutes`;
    }

    return message;
  };

  render() {
    return this.shouldShowLink() ? (
      <a href={this.props.link} target="_blank">
        Go to talk
      </a>
    ) : (
      <Text size="17px">{this.showTimeUntil()}</Text>
    );
  }
}
