import React, { Component } from "react";
import { Box, Button, Text } from "grommet";
import MediaQuery from "react-responsive";
import { User } from "../../../Services/UserService";
import { Talk, TalkService } from "../../../Services/TalkService";
import CoffeeHangoutButton from "./CoffeeHangoutRoom/CoffeeHangoutButton";
import { time } from "node:console";


interface Props {
    user: User | null;
    talk: Talk;
}
  
interface State {
}

export default class CoffeeHangoutRoom extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
      };
    }

    cafeteriaIsOpen() {
        // Showing link 30 minutes before seminar starts and 2 hours after
        // NOTE: difference between times are given in seconds.
        var now = new Date().getTime();
        var startTime = new Date(this.props.talk.date).getTime()
        var endTime = new Date(this.props.talk.end_date).getTime()

        var secondsBeforeSeminar = startTime - now
        var secondsAfterSeminar = now - endTime

        return (secondsBeforeSeminar < 30 * 60) || (secondsAfterSeminar < 2 * 3600)
    }

    render() {
        var cafeteriaIsOpen = this.cafeteriaIsOpen();
        return (
            <Box>
                {!cafeteriaIsOpen && (
                    <>
                        <Text>The </Text>
                        <CoffeeHangoutButton
                            talk={this.props.talk}
                            user={this.props.user}
                        />
                    </>
                )}
                {cafeteriaIsOpen && (
                    <>
                        <Text>The </Text>
                        <a
                        style={{ width: "100%", textDecoration: "none" }}
                        href={"https://gather.town/app/cYriy3vrC45SKr3f/Pre-post%20seminar%20coffees"}
                        target="_blank"
                         >
                            <CoffeeHangoutButton
                                talk={this.props.talk}
                                user={this.props.user}
                            />
                        </a>
                    </>
                )}
            </Box>
        )
    }
}