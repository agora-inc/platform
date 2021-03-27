import React, { Component } from "react";
import { Box, Text } from "grommet";
import MediaQuery from "react-responsive";
import { User } from "../../../../Services/UserService";
import { Talk, TalkService } from "../../../../Services/TalkService";
import Button from "../../../Core/Button";


interface Props {
    user: User | null;
    talk: Talk;
}
  
interface State {
}

export default class CoffeeHangoutButton extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
      };
    }

    redirectToGatherTown() {
        return 
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
        return (
            <>
                <Box>
                    <Button
                        width={"150px"}
                        height={"50px"}
                        onClick={()=>{}}
                        text={this.cafeteriaIsOpen() ? "Coffee is ready" : "hi"}
                        buttonType="secondaryAction"
                    />
                </Box>
            </>
        )
    }
}