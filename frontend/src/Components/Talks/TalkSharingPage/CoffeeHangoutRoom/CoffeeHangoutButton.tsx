import React, { Component } from "react";
import { Box, Text } from "grommet";
import MediaQuery from "react-responsive";
import { User } from "../../../../Services/UserService";
import { Talk, TalkService } from "../../../../Services/TalkService";
import Button from "../../../Core/Button";
import { Redirect } from "react-router";
import ReactTooltip from "react-tooltip";

var moment = require("moment");

interface Props {
    user: User | null;
    talk: Talk;
}
  
interface State {
    now: Date;
    openingTimeBeforeSemInMinutes: number;
    openingTimeAfterSemInMinutes: number;
    cafeteriaOpeningTime: Date;
    cafeteriaClosingTime: Date;
  }

export default class CoffeeHangoutButton extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        now: new Date(),
        openingTimeBeforeSemInMinutes: 45,
        openingTimeAfterSemInMinutes: 120,
        cafeteriaOpeningTime: new Date(),
        cafeteriaClosingTime: new Date()
      };
    }

    componentWillMount() {
        setInterval(() => {
          this.setState({ 
              now: new Date() ,
              cafeteriaOpeningTime: this.computeCafeteriaOpeningTime(),
              cafeteriaClosingTime: this.computeCafeteriaClosingTime()
        });
        }, 1000);
      }

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
    
      computeCafeteriaOpeningTime = () => {
        let d = new Date(this.props.talk.date);
        return moment(d)
          .subtract(45, "minutes")
          .toDate();
      };

      computeCafeteriaClosingTime = () => {
        let d = new Date(this.props.talk.end_date);
        return moment(d)
          .add(60, "minutes")
          .toDate();
      };

      showTimeUntil = () => {
        let message = "Virtual cafeteria opening in ";
        var startTime = new Date(this.props.talk.date).getTime()
        let secondsUntil = Math.floor(
          (startTime - this.state.now.getTime()) / 1000 - this.state.openingTimeBeforeSemInMinutes * 60
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

    cafeteriaOpened() {
        return (this.state.now > this.state.cafeteriaOpeningTime) && (this.state.now < this.state.cafeteriaClosingTime)
    }

    cafeteriaPermanentlyClosed() {
    var startTime = new Date(this.props.talk.date).getTime()
    var endTime = new Date(this.props.talk.end_date).getTime()

    var secondsBeforeSeminar = Math.floor((startTime - this.state.now.getTime() ) / 1000)
    var secondsAfterSeminar = Math.floor((this.state.now.getTime() - endTime ) / 1000)

    return (secondsAfterSeminar > 0 && secondsAfterSeminar > this.state.openingTimeAfterSemInMinutes * 60)
    }

    render() {
        var renderMobileView = (window.innerWidth < 800);
        return (
            <>
            {!this.cafeteriaPermanentlyClosed() && (
                <>
                {!this.cafeteriaOpened() || (
                    <Box align="center" data-tip data-for='grab_coffee_button_before'>
                    <a
                        style={{ width: "100%", textDecoration: "none" }}
                        href={"https://gather.town/app/ZdQRhpTeDNaBiV2P/agora.stream%20Cafeteria"}
                        target="_blank"
                    >
                        <Button
                            width={"150px"}
                            height={"50px"}
                            onClick={()=>{}}
                            text={"Grab an e-coffee"}
                            buttonType="mainAction"
                        />
                    </a>

                    <ReactTooltip id="grab_coffee_button_before" effect="solid" place="bottom">
                        Chat with other seminar participants and speakers; cafeteria remains open 2 hours after the end of the seminar.
                    </ReactTooltip>
                    </Box>
                )}
                {this.cafeteriaOpened() || (
                    <Box align="center" data-tip data-for='grab_coffee_button_after'>
                        <Button
                            width={renderMobileView ? "300px" : "500px"}
                            height={"50px"}
                            onClick={()=>{}}
                            text={this.showTimeUntil()}
                            buttonType="mainAction"
                        />
                        <ReactTooltip id="grab_coffee_button_after" effect="solid" place="bottom">
                            Chat with other seminar participants and speakers
                        </ReactTooltip>
                    </Box>
                )}
                </>
            )}
            {this.cafeteriaPermanentlyClosed() && (
                <>
                    <Box align="center" data-tip data-for='grab_coffee_button_cafet_perma_closed'>
                        <Button
                            width={"500px"}
                            height={"50px"}
                            onClick={()=>{}}
                            text={"This virtual cafeteria is closed"}
                            buttonType="secondaryAction"
                            hoverIndicator={false}
                            disabled={true}
                        />
                    </Box>
                    <ReactTooltip id="grab_coffee_button_cafet_perma_closed" effect="solid" place="bottom">
                        The virtual cafeteria opens 45 minutes before the start of a seminar and closes 2 hours after it ends.
                    </ReactTooltip>
                </>
            )}
            </>
        )
    }
}