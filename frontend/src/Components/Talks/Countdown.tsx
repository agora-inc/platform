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

  addS = (n: number) =>  {
    return n > 1 ? "s " : " "
  }

  showTimeUntil = () => {
    let message = "Link available here in ";
    let secondsUntil = Math.floor(
      (this.state.showLinkAt.getTime() - this.state.now.getTime()) / 1000
    )

    // Check if 
    // if (this.DstAppliesInbetween()){
    //   secondsUntil = secondsUntil + 60*60
    // }

    let daysRemain = Math.floor(secondsUntil / (60*60*24))
    let hoursRemain =  Math.floor((secondsUntil % (60*60*24)) / (60*60));
    let minutesRemain =  Math.floor((secondsUntil % (60*60)) / 60);
    let secondsRemain = secondsUntil % 60

    if (daysRemain > 0) {
      message += `${daysRemain} day` + this.addS(daysRemain)
    } 
    if (hoursRemain > 0) {
      message += `${hoursRemain} hour` + this.addS(hoursRemain)
    }  
    if (minutesRemain > 0) {
      message += `${minutesRemain} minute` + this.addS(minutesRemain)
    }  
    if (secondsRemain > 0) {
      message += `${secondsRemain} second` + this.addS(secondsRemain)
    }

    return message;
  };

  seminarIsFinished() {
    var endTime = new Date(this.props.talk.end_date).getTime()
    var secondsAfterSeminar = Math.floor((this.state.now.getTime() - endTime ) / 1000)

    return (secondsAfterSeminar > 0)
  }


  render() {
    return (
      <Box direction="column">
        {!this.seminarIsFinished() && (
          <>
          {this.shouldShowLink() && (
            <Box>
            <a
              style={{ width: "100%", textDecoration: "none" }}
              href={this.props.talk.link}
              target="_blank"
            >
              <Box
                onClick={() => {}}
                background="#0C385B"
                round="xsmall"
                width="160px" height="35px"
                justify="center"
                align="center"
                focusIndicator={true}
                hoverIndicator="#6DA3C7"
              >
                <Text size="15px" weight="bold">
                  Click to join
                </Text>
              </Box>
            </a>
            </Box>
          )}

          {!this.shouldShowLink() && (
            <Text size="16px" weight="bold" margin={{ top: "1px" }} textAlign="center">
              {this.showTimeUntil()}
            </Text>
          )}
        </>
        )}
        {this.seminarIsFinished() && (
          <Text size="16px" weight="bold" margin={{ top: "1px" }} textAlign="center">
            This event ended.
          </Text>
        )
        }
      </Box>
    );
  }
}
