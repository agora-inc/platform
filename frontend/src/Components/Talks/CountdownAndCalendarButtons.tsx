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

  computeShowLinkTime = () => {
    let d = new Date(this.props.talk.date);
    return moment(d)
      .subtract(this.props.talk.show_link_offset, "minutes")
      .toDate();
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
    let message = "Link available here in ";
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
    return (
      <Box direction="column">
        <MediaQuery minDeviceWidth={992}>
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
              `https://agora.stream/${this.props.talk.channel_name.toLowerCase()}?talkId=${
                this.props.talk.id
              }`
            )}
            target="_blank"
          >
            <Box
              width="100%"
              height="25px"
              round="xsmall"
              background="white"
              style={{
                border: "1px solid #C2C2C2",
              }}
              align="center"
              justify="center"
              direction="row"
              // gap="4px"
              pad={{ vertical: "2px", horizontal: "xsmall" }}
              onClick={() => {}}
              hoverIndicator={true}
            >
              <Google size="14px" color="plain" />
              <Text size="14px" weight="bold" color="grey">
                Calendar
              </Text>
            </Box>
          </a>
          <a
            style={{ width: "48%", textDecoration: "none" }}
            href={this.createICShref()}
            download="download.ics"
          >
            <Box
              width="100%"
              height="25px"
              round="xsmall"
              background="white"
              style={{
                border: "1px solid #C2C2C2",
              }}
              align="center"
              justify="center"
              pad={{ vertical: "2px", horizontal: "xsmall" }}
              onClick={() => {}}
              hoverIndicator={true}
            >
              <Text size="14px" weight="bold" color="grey">
                ics Calendar
              </Text>
            </Box>
          </a>
        </Box>
        </MediaQuery>


        {this.shouldShowLink() && (
          <Box>
          <a
            style={{ width: "100%", textDecoration: "none" }}
            href={this.props.talk.link}
            target="_blank"
          >
            <Box
              onClick={() => {}}



              background="white"
              round="xsmall"
              pad={{ bottom: "6px", top: "6px", left: "18px", right: "18px" }}
              justify="center"
              align="end"
              focusIndicator={false}
              style={{
                border: "1px solid #C2C2C2",
              }}
              hoverIndicator={true}







              height="45px"

              // background="#7E1115"
              // round="xsmall"
              // pad="xsmall"
              // justify="center"
              // align="center"
              // focusIndicator={false}
              // hoverIndicator="#5A0C0F"
            >
              <Text size="14px" weight="bold">
                Link to talk
              </Text>
            </Box>
          </a>
          </Box>
        )}

        {!this.shouldShowLink() && (
            <Button 
              // height="45px"
              // color="#7E1115"
              alignSelf="center"
              hoverIndicator={false}
              style={{
                // width: 90,
                // height: 35,
                fontSize: 17,
                fontWeight: "bold",
                // color: "white",
                padding: 10,
                backgroundColor: "#d5d5d5",
                border: "none",
                borderRadius: 5,
              }}
              margin={{bottom: "5px"}}
              >
              <Text size="16px" weight="bold" margin={{ top: "1px" }}>
                {this.showTimeUntil()}
              </Text>
            </Button>
        )}
      </Box>
    );
  }
}
