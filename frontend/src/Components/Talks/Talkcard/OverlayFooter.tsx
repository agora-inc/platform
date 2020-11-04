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
import AddToCalendarButtons from "../AddToCalendarButtons";
import CountdownAndCalendarButtons from "../CountdownAndCalendarButtons";
import LoginModal from "../../Account/LoginModal";
import SignUpButton from "../../Account/SignUpButton";
import MediaQuery from "react-responsive";
import RequestMembershipButton from "../../Channel/ApplyMembershipButton";


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
  
  export default class OverlayFooter extends Component<Props, State> {
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
        <Box direction="column" gap="small">
          <Box direction="row" gap="small">
              <Calendar size="18px" />
              <Text
                size="18px"
                color="black"
                style={{ height: "20px", fontStyle: "normal" }}
              >
                {this.formatDateFull(
                  this.props.talk.date,
                  this.props.talk.end_date
                )}
              </Text>
          </Box>
          {(this.props.user !== null || this.props.admin) &&
            this.state.registered && (
              <Box margin={{ top: "10px", bottom: "20px" }}>
                <CountdownAndCalendarButtons talk={this.props.talk} />
                <Box
                  focusIndicator={false}
                  background="#FF4040"
                  round="xsmall"
                  pad="xsmall"
                  justify="center"
                  align="center"
                  width="20%"
                  height="35px"
                  onClick={this.onClick}
                  margin={{ top: "-35px" }}
                  alignSelf="end"
                  hoverIndicator={true}
                >
                  <Text size="14px" weight="bold">
                    Unregister
                  </Text>
                </Box>
              </Box>
            )}
          {this.checkIfUserCanAccessLink() &&
            (this.props.user !== null || this.props.admin) &&
            !this.state.registered && (
              <Box
                onClick={this.onClick}
                background="#7E1115"
                round="xsmall"
                pad="xsmall"
                height="40px"
                justify="center"
                align="center"
                focusIndicator={false}
                hoverIndicator="#5A0C0F"
              >
                <Text size="18px">Register</Text>
              </Box>
          )}
          {!this.checkIfUserCanAccessLink() && this.props.user === null
          && (
            <Box direction="row" align="center" gap="10px" background="#d5d5d5" pad="25px" justify="center">
              <Text size="18px"> You need to </Text>
              <LoginModal callback={() => {}} />
              <Text size="18px"> or </Text>
              <SignUpButton callback={() => {}} />
              <Text size="18px"> to attend </Text>
            </Box>
          )}
          {!this.checkIfUserCanAccessLink() && this.props.user !== null
          && (
            <Box direction="row" align="center" gap="15px" background="#d5d5d5" pad="25px" justify="center">
              <Text> You need to </Text>
              {this.props.talk.visibility == "Followers and members" && (
                <Box gap="15px" direction="row" align="center">
                  <Box
                    className="follow-button"
                    background={this.props.following ? "#e5e5e5": "white"}
                    height="35px"
                    style={{
                      border: "1px solid #C2C2C2",
                    }}
                    width="100px"
                    round="xsmall"
                    pad={{bottom: "6px", top: "6px", left: "18px", right: "18px"}}
                    align="center"
                    justify="center"
                    onClick={this.onFollowClicked}
                  focusIndicator={false}
                  hoverIndicator={true}
                  >
                    <Text 
                      size="16px" 
                      color="grey"
                      alignSelf="center"
                    >
                      Follow
                    </Text>
                  </Box>
                  <Text> or </Text>
                </Box>
              )}
            {this.props.role !== "member" && this.props.role !== "owner" && (
              <RequestMembershipButton
                channelId={this.props.talk.channel_id}
                channelName={this.props.talk.channel_name}
                user={this.props.user}
                height="35px"
                width="200px"
              />
            )}
            <Text> to attend </Text>
          </Box>
        )}
      </Box>
    )
  }
}