import React, { Component } from "react";
import { Box, Button, Text } from "grommet";
import MediaQuery from "react-responsive";
import { User } from "../../../Services/UserService";
import { Talk, TalkService } from "../../../Services/TalkService";
import CoffeeHangoutButton from "./CoffeeHangoutRoom/CoffeeHangoutButton";
// import { time } from "node:console";

interface Props {
    user: User | null;
    talk: Talk;
}
  
interface State {
    now: Date;
    openingTimeBeforeSemInMinutes: number;
    openingTimeAfterSemInMinutes: number;
  }


export default class CoffeeHangoutRoom extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        now: new Date(),
        openingTimeBeforeSemInMinutes: 45,
        openingTimeAfterSemInMinutes: 120,
      };
    }

    // cafeteriaOpened() {
    //     // Showing link 30 minutes before seminar starts and 2 hours after
    //     // NOTE: difference between times are given in seconds.
    //     var startTime = new Date(this.props.talk.date).getTime()
    //     var endTime = new Date(this.props.talk.end_date).getTime()
    //     var secondsBeforeSeminar = Math.floor((startTime - this.state.now.getTime() ) / 1000)
    //     var secondsAfterSeminar = Math.floor((this.state.now.getTime() - endTime ) / 1000)
    //     return ((secondsBeforeSeminar > 0 && secondsBeforeSeminar < this.state.openingTimeAfterSemInMinutes * 60))
    //     }

    cafeteriaPermanentlyClosed() {
        var startTime = new Date(this.props.talk.date).getTime()
        var endTime = new Date(this.props.talk.end_date).getTime()
    
        var secondsAfterSeminar = Math.floor((this.state.now.getTime() - endTime ) / 1000)
    
        return (secondsAfterSeminar > 0 && secondsAfterSeminar > this.state.openingTimeAfterSemInMinutes * 60)
        }

    render() {
        return (
            <>
                {/* {!this.cafeteriaPermanentlyClosed() || ( */}
                    <Box align="center" background="#BAD6DB" margin={{top:"20px"}}>
                        <Text size="21px" weight="bold" margin={{top:"20px", bottom: "10px"}}>
                            {/* Waiting for the start or looking to mingle after the seminar? Grab an e-coffee with other the other participants! */}
                            {/* Want to grab a pre/post seminar coffee and have chat with the seminar participants and speakers? */}
                            Grab a pre/post seminar coffee!
                        </Text>
                        <CoffeeHangoutButton
                            talk={this.props.talk}
                            user={this.props.user}
                        />
                        <video 
                            autoPlay loop muted
                            style={{ height: "auto", width: "90%", marginTop: "10px", marginBottom: "10px"}}
                            >
                            <source src="/eCoffee/cafeteria_agora_minidemo.mp4" type="video/mp4"/> 
                        </video>
                    </Box>
                {/* )} */}
            </>
        )
    }
}