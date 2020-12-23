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

export default class Countdown extends Component<
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

  // Daylight Saving Time
  // Taken from:
  // https://stackoverflow.com/questions/11887934/how-to-check-if-dst-daylight-saving-time-is-in-effect-and-if-so-the-2
  // NOTE: -"The getTimezoneOffset() method returns the time zone difference, 
  //        in minutes, from current locale (host system settings) to UTC."
  //       - Therefore, standard time > daylight time for DST countries
  getStandardTimezoneOffset = () => {
    var year = new Date();
    var jan = new Date(year.getFullYear(), 0, 1);
    var jul = new Date(year.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  }

  // if there is a diff with now and max of above, then DST holds now
  DstAppliesInbetween = (month: number, day: number, year: number) => {
    var date = new Date(year, month, day);
    return date.getTimezoneOffset() < this.getStandardTimezoneOffset()
  }

  extractDateNumberFromString = (d: string) => {
    // to implement
  };

  showTimeUntil = () => {
    let message = "Link available here in ";
    let minutesUntil =
      (this.state.showLinkAt.getTime() - this.state.now.getTime()) /
      (1000 * 60);

    // Check if 
    // if (this.DstAppliesInbetween()){
    //   minutesUntil = minutesUntil + 60
    // }

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
              align="center"
              focusIndicator={false}
              style={{
                border: "1px solid #C2C2C2",
              }}
              hoverIndicator={true}
              height="40px"
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
               alignSelf="center"
              hoverIndicator={false}
              style={{
                fontSize: 17,
                fontWeight: "bold",
                padding: 10,
                backgroundColor: "#d5d5d5",
                border: "none",
                borderRadius: 5,
              }}
              margin={{bottom: "5px"}}
              >
              <Text size="14px" weight="bold" margin={{ top: "1px" }}>
                {this.showTimeUntil()}
              </Text>
            </Button>
        )}
      </Box>
    );
  }
}
