import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import { CalendarService } from "../../Services/CalendarService";
import { Google } from "grommet-icons";
import { Talk } from "../../Services/TalkService";

interface Props {
  // startTime: string;
  // endTime: string;
  // name: string;
  // description: string;
  // link: string;
  talk: Talk;
}

export default class AddToCalendarButtons extends Component<Props> {
  createICShref = () => {
    const url = CalendarService.generateICSDownloadLink(
      this.props.talk.date,
      this.props.talk.end_date,
      this.props.talk.name,
      this.props.talk.description,
      this.props.talk.link
    );
    const blob = new Blob([url], { type: "text/calendar;charset=utf-8" });
    return window.URL.createObjectURL(blob);
  };

  render() {
    return (
      <Box
        direction="row"
        width="100%"
        justify="between"
        style={{ minHeight: "35px" }}
      >
        <a
          style={{ width: "48%", textDecoration: "none" }}
          href={CalendarService.generateGoogleCalendarLink(
            this.props.talk.date,
            this.props.talk.end_date,
            this.props.talk.name,
            this.props.talk.description,
            this.props.talk.link
          )}
          target="_blank"
        >
          <Box
            width="100%"
            height="35px"
            round="xsmall"
            background="white"
            style={{ border: "3px solid black" }}
            align="center"
            justify="center"
            direction="row"
            gap="4px"
            onClick={() => {}}
            hoverIndicator={true}
          >
            {/* <Text size="14px" weight="bold" color="black">
              Add to
            </Text> */}
            <Google size="14px" color="plain" />
            {/* <Text size="14px" weight="bold" color="black">
              Calendar
            </Text> */}
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
            style={{ border: "3px solid black" }}
            align="center"
            justify="center"
            onClick={() => {}}
            hoverIndicator={true}
          >
            {/* <Text size="14px" weight="bold" color="black">
              Download .ics file
            </Text> */}
          </Box>
        </a>
      </Box>
    );
  }
}
