import React, { Component } from "react";
import { Box, Text, Button, Layer, Image} from "grommet";
import { Talk, TalkService } from "../../../Services/TalkService";
import { ChannelService } from "../../../Services/ChannelService";
import { User } from "../../../Services/UserService";
import { Link } from "react-router-dom";
import { Tag } from "../../../Services/TagService";
import AsyncButton from "../../Core/AsyncButton";
import { Calendar, Workshop, UserExpert, LinkNext, FormNextLink } from "grommet-icons";
import { default as TagComponent } from "../../Core/Tag";
import AddToCalendarButtons from ".././AddToCalendarButtons";
import CountdownAndCalendarButtons from ".././CountdownAndCalendarButtons";
import LoginModal from "../../Account/LoginModal";
import SignUpButton from "../../Account/SignUpButton";
import MediaQuery from "react-responsive";


interface Props {
    talk: Talk;
    user: User | null;
    width?: string;
    isCurrent?: boolean;
  }
  
  interface State {
    showModal: boolean;
    showShadow: boolean;
    registered: boolean;
    available: boolean;
  }
  
  export default class TalkCardFooter extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        showModal: false,
        showShadow: false,
        registered: false,
        available: true,
      };
    }
  
    checkIfRegistered = () => {
        this.props.user &&
          TalkService.isRegisteredForTalk(
            this.props.talk.id,
            this.props.user.id,
            (registered: any) => {
              this.setState({ registered });
            }
          );
      };

    formatDate = (d: string) => {
        const date = new Date(d);
        const dateStr = date.toDateString().slice(0, -4);
        const timeStr = date.toTimeString().slice(0, 5);
        return `${dateStr} ${timeStr}`;
      };

      getTimeRemaining = (): string => {
        const end = new Date(this.props.talk.end_date);
        const now = new Date();
        const deltaSec = Math.floor((end.valueOf() - now.valueOf()) / 1000);
        if (deltaSec < 60) {
          return `Finishing in ${deltaSec}s`;
        }
        if (deltaSec < 3600) {
          let deltaMin = Math.floor(deltaSec / 60);
          return `Finishing in ${deltaMin}m`;
        }
        let deltaHour = Math.floor(deltaSec / 3600);
        let remainderMin = Math.floor((deltaSec % 3600) / 60);
        return `Finishing in ${deltaHour}h ${remainderMin}m`;
      };

      register = () => {
        this.props.user &&
          TalkService.registerForTalk(
            this.props.talk.id,
            this.props.user.id,
            () => {
              // this.toggleModal();
              this.checkIfRegistered();
              this.setState({
                showShadow: false,
              });
            }
          );
      };
    
      unregister = () => {
        this.props.user &&
          TalkService.unRegisterForTalk(
            this.props.talk.id,
            this.props.user.id,
            () => {
              // this.toggleModal();
              this.checkIfRegistered();
              this.setState({
                showShadow: false,
              });
            }
          );
      };

      formatDateFull = (s: string, e: string) => {
        const start = new Date(s);
        const dateStartStr = start.toDateString().slice(0, -4);
        const timeStartStr = start.toTimeString().slice(0, 5);
        const end = new Date(e);
        const dateEndStr = end.toDateString().slice(0, -4);
        const timeEndStr = end.toTimeString().slice(0, 5);
        return `${dateStartStr} ${timeStartStr} - ${timeEndStr} `;
      };

      onClick = () => {
        if (this.state.registered) {
          this.unregister();
        } else {
          this.register();
        }
      };

render() {
    return (
        <Box>
            {!this.state.available && this.props.user === null && (
                <Box direction="row" align="center" gap="10px" background="#d5d5d5" pad="25px">
                <Text size="18px"> You need to </Text>
                <LoginModal callback={() => {}} />
                <Text size="18px"> or </Text>
                <SignUpButton callback={() => {}} />
                <Text size="18px"> to attend </Text>
                </Box>
            )}
            {!this.state.available && this.props.user !== null && (
                <Box direction="row" align="center" gap="25px" background="#d5d5d5" pad="25px">
                <Text textAlign="center" weight="bold">
                {`${this.props.talk.visibility === "Followers and members"
                        ? "Follow or become a member"
                        : "Become a member"
                    } 
                    of ${this.props.talk.channel_name} to attend`
                }
                </Text>
                <Link to={`/${this.props.talk.channel_name}`} style={{ textDecoration: "none" }}>
                    <Box
                    className="see-more-button"
                    pad={{ vertical: "2px", horizontal: "xsmall" }}
                    round="xsmall"
                    style={{
                        border: "2px solid #C2C2C2",
                    }}
                    direction="row"
                    align="end"
                    >      
                    <FormNextLink color="grey" />
                    </Box>
                </Link>

                </Box>
            )}
            {/*!this.state.available && (
                <Box
                background="#d5d5d5"
                pad="small"
                align="center"
                justify="center"
                >
                <Text textAlign="center" weight="bold">
                    {`Sorry, the link to the talk is only available to ${
                    this.props.talk.visibility === "Followers and members"
                        ? "followers and members"
                        : "members"
                    }
                    of ${this.props.talk.channel_name}`}
                </Text>
                </Box>
                )*/}
        </Box>)
        }
};