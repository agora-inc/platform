import React, { Component } from "react";
import { Box, Text, Button } from "grommet";
import { CalendarService } from "../../Services/CalendarService";
import { Google} from "grommet-icons";
import { Talk } from "../../Services/TalkService";
import MediaQuery from "react-responsive";

var moment = require("moment");

interface Props {
  talk: Talk;
}

interface State {
  now: Date;
}

export default class CalendarButtons extends Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      now: new Date(),
    };
  }

  createICShref = () => {
    const url = CalendarService.generateICSDownloadLink(
      this.props.talk.date,
      this.props.talk.end_date,
      this.props.talk.name,
      this.props.talk.description,
      `https://agora.stream/${this.props.talk.channel_name.toLowerCase()}?talkId=${
        this.props.talk.id
      }`
    );
    const blob = new Blob([url], { type: "text/calendar;charset=utf-8" });
    return window.URL.createObjectURL(blob);
  };

  componentWillMount() {
    setInterval(() => {
      this.setState({ now: new Date() });
    }, 1000);
  }

  render() {
    return (
      <Box direction="column">
        <MediaQuery minDeviceWidth={992}>
        <Box
          direction="row"
          width="100%"
          justify="between"
          style={{ minHeight: "35px" }}
          gap="10px"
        >
          <a
            style={{ width: "48%", textDecoration: "none" }}
            href={CalendarService.generateGoogleCalendarLink(
              this.props.talk.date,
              this.props.talk.end_date,
              this.props.talk.name,
              this.props.talk.description,
              `https://agora.stream/event/${
                this.props.talk.id
              }`
            )}
            target="_blank"
          >
            <Box
              width="50px"
              height="35px"
              round="xsmall"
              background="#F2F2F2"
              align="center"
              justify="center"
              direction="row"
              // gap="4px"
              pad={{ vertical: "2px", horizontal: "xsmall" }}
              onClick={() => {}}
              hoverIndicator="#DDDDDD"
            >
              <Google size="14px" color="plain" />
            </Box>
          </a>
          <a
            style={{ width: "48%", textDecoration: "none" }}
            href={this.createICShref()}
            download="download.ics"
          >
            <Box
              width="50px"
              height="35px"
              round="xsmall"
              background="#F2F2F2"
              align="center"
              justify="center"
              pad={{ vertical: "2px", horizontal: "xsmall" }}
              onClick={() => {}}
              hoverIndicator="#DDDDDD"
            >
              <Text size="15px" weight="bold">
                ics
              </Text>
            </Box>
          </a>
        </Box>
        </MediaQuery>
      </Box>
    );
  }
}
