import React, { Component } from "react";
import { Box, Text, Button, Layer, Image} from "grommet";
import { Talk, TalkService } from "../../../Services/TalkService";
import { ChannelService } from "../../../Services/ChannelService";
import { User } from "../../../Services/UserService";
import { Link } from "react-router-dom";
import { Tag } from "../../../Services/TagService";
import AsyncButton from "../../Core/AsyncButton";
import { Calendar, Workshop, UserExpert, LinkNext, FormNextLink, Link as LinkIcon} from "grommet-icons";
import { default as TagComponent } from "../../Core/Tag";
import AddToCalendarButtons from "../AddToCalendarButtons";
import Countdown from "../Countdown";
import LoginModal from "../../Account/LoginModal";
import SignUpButton from "../../Account/SignUpButton";
import MediaQuery from "react-responsive";
import RequestMembershipButton from "../../Channel/ApplyMembershipButton";
import ReactTooltip from "react-tooltip";
import EditTalkModal from "../EditTalkModal";
import ShareButtons from "./ShareButtons";
import TalkRegistrationButton from "../TalkRegistrationButton";
import CalendarButtons from "../CalendarButtons";

interface Props {
    talk: Talk;
    user: User | null;
    admin?: boolean;
    width?: string;
    // isCurrent?: boolean;
    following?: boolean;
    role?: string;
    onEditCallback?: any;
    callback?: any;
  }
  
  interface State {
    showModal: boolean;
    showShadow: boolean;
    registered: boolean;
    available: boolean;
    showEdit: boolean
  }
  
  export default class FooterOverlay extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        showModal: false,
        showShadow: false,
        registered: false,
        available: true,
        showEdit: false
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

    onFollowClicked = () => {
      if (!this.props.following) {
        ChannelService.addUserToChannel(
          this.props.user!.id,
          this.props.talk.channel_id,
          "follower",
          () => {}
        );
      } else {
        ChannelService.removeUserFromChannel(
          this.props.user!.id,
          this.props.talk.channel_id,
          () => {}
        );
      }
      this.props.callback()
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

    componentWillMount() {
      this.checkIfAvailableAndRegistered();
    }
  
    checkIfAvailableAndRegistered = () => {
      if (this.props.user) {
        TalkService.isAvailableToUser(
          this.props.user.id,
          this.props.talk.id,
          (available: boolean) => {
            this.setState({ available }, () => {
              if (available) {
                this.checkIfRegistered();
              }
            });
          }
        );
      } else {
        this.setState({
          available:
            this.props.talk.visibility === "Everybody" ||
            this.props.talk.visibility === null,
        });
      }
    };

    register = () => {
      // this.props.user &&
      //   TalkService.registerForTalk(
      //     this.props.talk.id,
      //     this.props.user.id,
      //     () => {
      //       // this.toggleModal();
      //       this.checkIfRegistered();
      //       this.setState({
      //         showShadow: false,
      //       });
      //     }
      //   );
    };
  
    unregister = () => {
      // this.props.user &&
      //   TalkService.unRegisterForTalk(
      //     this.props.talk.id,
      //     this.props.user.id,
      //     () => {
      //       // this.toggleModal();
      //       this.checkIfRegistered();
      //       this.setState({
      //         showShadow: false,
      //       });
      //     }
      //   );
    };

    checkIfUserCanViewCard = () => {
      if (this.props.admin) {
        return true;
      }
      else
        if (this.props.talk.card_visibility == "Everybody") {
          return true;
        }
        else if (this.props.talk.card_visibility === "Followers and members") {
          if (this.props.role === "follower" || this.props.role === "member" || this.props.role === "owner") {
            return true;
          }
          else {
            return false;
          };
        }
        else if (this.props.talk.card_visibility == "Members only") {
          if (this.props.role === "member") {
            return true;
          }
          else {
            return false;
          }
        }
    };

    checkIfUserCanAccessLink = () => {
      if (this.props.admin) {
        return true;
      }
      else
        if (this.props.talk.visibility == "Everybody") {
          return true;
        }
        else if (this.props.talk.visibility == "Followers and members") {
          if (this.props.following || this.props.role === "follower" || this.props.role === "member" || this.props.role === "owner") {
            return true;
          }
          else {
            return false;
          }
        }
        else if (this.props.talk.visibility == "Members only") {
          if (this.props.role === "member"){
            return true;
          }
          else {
            return false;
          }
        }
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

    toggleEdit = () => {
      this.setState({ showEdit: !this.state.showEdit });
    };

render() {
    return (
        <Box direction="column" gap="small" width="100%" >
          <Box direction="row" gap="small" margin={{left: "20px", right: "20px"}}>
            <Box 
              width="50%" 
              direction="row"
              >
                <Calendar size="16px" />
                <Text
                  size="16px"
                  color="black"
                  margin={{left:"5px"}}
                  style={{ height: "20px", fontStyle: "normal" }}
                >
                  {this.formatDateFull(
                    this.props.talk.date,
                    this.props.talk.end_date
                    )}
                </Text>
                <Box margin={{left: "5px"}}>
                  <CalendarButtons talk={this.props.talk}/>
                </Box>
            </Box>
            <Box
                width="50%"
                align="end"
                >
              <ShareButtons 
                talk={this.props.talk}
              />

              {/* <Box
                  onClick={() => {navigator.clipboard.writeText(`https://agora.stream/event/${this.props.talk.id}`); }}
                  data-tip data-for='save_url_event'
                  background="white"
                  round="xsmall"
                  pad={{ bottom: "6px", top: "6px", left: "18px", right: "18px" }}
                  justify="center"
                  align="end"
                  focusIndicator={true}
                  style={{
                    border: "1px solid #C2C2C2",
                  }}
                  hoverIndicator={true}>
                  <LinkIcon size="medium"/>
              </Box>
              <ReactTooltip id="save_url_event" effect="solid">
                Click to copy Event URL!
              </ReactTooltip> */}

            </Box>
          </Box>
          {this.checkIfUserCanAccessLink() &&
            this.props.user !== null &&
            this.state.registered && (
              <Box margin={{ top: "10px", bottom: "5px", left: "20px", right: "20px" }} background="#d5d5d5">
                <Countdown talk={this.props.talk} />
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
            this.props.user !== null &&
            !this.state.registered && (
              <Box 
              margin={{ top: "5px", bottom: "5px", left: "20px", right: "20px" }}>
                <Box>
                  <Countdown talk={this.props.talk} />
                </Box>
                {/* <Box
                  onClick={this.onClick}
                  background="#7E1115"
                  round="xsmall"
                  // pad="xsmall"
                  height="30px"
                  justify="center"
                  align="center"
                  focusIndicator={false}
                  hoverIndicator="#5A0C0F"
                  margin={{top: "10px"}}
                >
                  <Text size="18px">Register</Text>
                </Box> */}
              </Box>
          )}
          {this.checkIfUserCanAccessLink() &&
            this.props.user == null &&
            !this.state.registered && (
              <Box 
              margin={{ top: "5px", bottom: "5px", left: "20px", right: "20px" }}>
                <Box>
                  <Countdown talk={this.props.talk} />
                </Box>
              </Box>
          )}
          {!this.checkIfUserCanAccessLink() && this.props.user === null
          && (
            
            <Box direction="row" align="center" gap="10px" background="#d5d5d5" pad="25px" justify="center">
              <TalkRegistrationButton
                talk={this.props.talk}
              />
              <Text size="16px"> or </Text>
              <LoginModal callback={() => {}} />
              {/* <RequestMembershipButton
                channelId={this.props.talk.channel_id}
                channelName={this.props.talk.channel_name}
                user={this.props.user}
              /> */}
              {/* <SignUpButton callback={() => {}} /> */}
              <Text size="16px"> to attend </Text>
            </Box>
          )}
          {!this.checkIfUserCanAccessLink() && this.props.user !== null
          && (
            <Box direction="row" align="center" gap="25px" pad="25px" justify="center" background="#d5d5d5">
            <Text textAlign="center" weight="bold" size="16px">
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
      </Box>
      
    )
  }
}