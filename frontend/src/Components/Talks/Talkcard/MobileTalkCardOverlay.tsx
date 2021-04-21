import { render } from "@testing-library/react";
import React, { Component } from "react";
import { Talk } from "../../../Services/TalkService";
import { Box, Text, Button, Layer, Image} from "grommet";
import { textToLatex } from "../../Core/LatexRendering";
import FooterOverlay from "../../Talks/Talkcard/FooterOverlay";
import { User } from "../../../Services/UserService";
import ShareButtons from "../../Core/ShareButtons";
import Countdown from "../Countdown";
import CalendarButtons from "../CalendarButtons";
import TalkRegistrationButton from "./TalkRegistrationButton";

interface Props {
    talk: Talk;
    user: User | null;
    pastOrFutureTalk: "past" | "future";
    registered: boolean;
    registrationStatus: string;
    role?: string | undefined;
}

interface State {
    clicked: boolean,
}

export default class MobileTalkCardOverlay extends Component<Props, State> {
    constructor(props: Props){
        super(props);
        this.state = {
            clicked: false
        }
    }
    
    render() {
        return (
            <Box background="#EAF1F1">
                <Box 
                    overflow="auto" 
                    height="100%"
                    style={{
                        maxHeight: "200px",
                        margin: "10px"
                    }}
                    >
                    {this.props.talk.description.split('\n').map(
                        (item, i) => textToLatex(item)
                    )}
                </Box>
                <Box align="center" direction="column" gap="5px" margin={{bottom: "10px"}}>
                    <ShareButtons
                        talk={this.props.talk}
                        useReducedHorizontalVersion={true}
                    />
                    <CalendarButtons 
                        talk={this.props.talk}
                        height="45px"/>

                    {this.props.pastOrFutureTalk == "future" && (
                        <Box 
                            direction="row"
                            align="center" 
                            gap="20px" 
                            background="#d5d5d5" 
                            pad="25px" 
                            justify="center" 
                            alignContent="center">
                            {((!(this.props.role && ["owner", "member"].includes(this.props.role)) && 
                            !this.props.registered && 
                            this.props.talk.visibility !== "Everybody")) && (

                                <TalkRegistrationButton
                                talk={this.props.talk}
                                user={this.props.user}
                                role={this.props.role}
                                registered={this.props.registered}
                                registrationStatus={this.props.registrationStatus}
                                />
                            )}
                            {((this.props.role && ["owner", "member"].includes(this.props.role) || 
                            this.props.registered || 
                            this.props.talk.visibility === "Everybody")) && (

                                <Countdown talk={this.props.talk} />
                            )}
                        </Box>
                )
                }

                {this.props.pastOrFutureTalk == "past" && (
                    <Box margin={{top: "5px"}}>
                        <a
                            href={this.props.talk.recording_link}
                            target="_blank"
                            style={{ width: "100%" }}
                        >
                            <Box
                            background="#0C385B"
                            round="xsmall"
                            height="40px"
                            width="200px"
                            justify="center"
                            align="start"
                            focusIndicator={false}
                            hoverIndicator="#0C385B"
                            >
                            <Text alignSelf="center" size="14px">
                                Watch talk
                            </Text>
                            </Box>
                        </a>










                    </Box>
                        
                )
                }
                </Box>  
            </Box>
        )
    }
}