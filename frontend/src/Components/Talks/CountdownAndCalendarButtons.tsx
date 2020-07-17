import React, { Component } from "react";
import { Box, Text, Button } from "grommet";
import { CalendarService } from "../../Services/CalendarService";
import { Google } from "grommet-icons";
var moment = require("moment");

interface Props {
  talkStart: string;
  showLinkOffset: number;
  color: string;
  startTime: string;
  endTime: string;
  name: string;
  description: string;
  link: string;
}

interface State {
  showLinkAt: Date;
  now: Date;
}

export default class CountdownAndCalendarButtons extends Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showLinkAt: this.computeShowLinkTime(),
      now: new Date(),
    };
  }

  createICShref = () => {
    const url = CalendarService.generateICSDownloadLink(
      this.props.startTime,
      this.props.endTime,
      this.props.name,
      this.props.description,
      this.props.link
    );
    const blob = new Blob([url], { type: "text/calendar;charset=utf-8" });
    return window.URL.createObjectURL(blob);
  };

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
      message += `${Math.floor(minutesUntil)} minutes`;
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
    return( 
      <Box gap="30px" direction="column">
        <Box
          direction="row"
          width="100%"
          justify="between"
          style={{ minHeight: "35px" }}
        >
          <a
            style={{ width: "48%", textDecoration: "none" }}
            href={CalendarService.generateGoogleCalendarLink(
              this.props.startTime,
              this.props.endTime,
              this.props.name,
              this.props.description,
              this.props.link
            )}
            target="_blank"
          >
            <Box
              width="100%"
              height="35px"
              round="xsmall"
              background="white"
              style={{ border: "2px solid #C2C2C2" }}
              align="center"
              justify="center"
              direction="row"
              gap="4px"
              pad={{ vertical: "2px", horizontal: "xsmall" }}
              onClick={() => {}}
              hoverIndicator={true}
            >
              <Text size="14px" weight="bold" color="grey" >
                Add to
              </Text>
              <Google size="14px" color="plain" />
              <Text size="14px" weight="bold" color="grey">
                Calendar
              </Text>
            </Box>
          </a>
          <a
            style={{ width: "48%", textDecoration: "none" }}
            href={this.createICShref()}
            //   target="_blank"
            download="download.ics"
          >
            <Box
              width="100%"
              height="35px"
              round="xsmall"
              background="white"
              style={{ border: "2px solid #C2C2C2" }}
              align="center"
              justify="center"
              pad={{ vertical: "2px", horizontal: "xsmall" }}
              onClick={() => {}}
              hoverIndicator={true}
            >
              <Text size="14px" weight="bold" color="grey">
                Download .ics file
              </Text>
            </Box>
          </a>
        </Box>

        {this.shouldShowLink() && (
          <a 
            style={{ width: "48%", textDecoration: "none" }} 
            href={this.props.link} target="_blank"
          >
            <Box
              onClick={() => {}}
              background="#7E1115"
              round="xsmall"
              pad="xsmall"
              height="35px"
              justify="center"
              align="center"
              focusIndicator={false}
              hoverIndicator="#5A0C0F"
            >
              <Text size="14px" weight="bold"> 
                Go to talk
              </Text>
            </Box>
          </a>
        )}

        {!this.shouldShowLink() && (
          <Box height="35px">
            <Text size="14px" weight="bold" margin={{top: "10px"}}>
              {this.showTimeUntil()}</Text>
          </Box>
        )}
      </Box>
    );
  }
}
