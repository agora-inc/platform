import React, { Component } from "react";
import { Box, Text } from "grommet";
import { Talk, TalkService } from "../../../Services/TalkService";
import { ChannelService } from "../../../Services/ChannelService";
import { User } from "../../../Services/UserService";
import { Calendar } from "grommet-icons";
import { default as TagComponent } from "../../Core/Tag";
import Countdown from "../Countdown";
import CalendarButtons from "../CalendarButtons";
import ShareButtons from "../../Core/ShareButtons";
import TalkRegistrationButton from "./TalkRegistrationButton";
import SaveForLaterButton  from "./SaveForLaterButton";
// import "../../../Styles/talk"

interface Props {
    talk: Talk;
    user: User | null;
    role: string | undefined;
    available: boolean;
    registered: boolean;
    registrationStatus: string;
    isSharingPage: boolean;
    width?: string;
    // isCurrent?: boolean;
    following?: boolean;
    onEditCallback?: any;
    callback?: any;
  }
  
  interface State {
    showModal: boolean;
    showShadow: boolean;
    showEdit: boolean;
  }
  
  export default class FooterOverlay extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        showModal: false,
        showShadow: false,
        showEdit: false,
      };
    }

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
        let deltaMin = Math.floor((end.valueOf() - now.valueOf()) / (60*1000));
        let message = deltaMin < 0 ? "Finished " : "Finishing in ";
        const suffix = deltaMin < 0 ? " ago" : "";
        deltaMin = Math.abs(deltaMin)
        
        let hours =  Math.floor(deltaMin / 60);
        let minutes =  Math.floor(deltaMin % 60);
        if (hours > 0) {
          message += `${hours}h `
        }  
        if (minutes > 0) {
          message += `${minutes}m `
        }  
        return message + suffix
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
    /*
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
          if (this.props.role === "member") {
            return true;
          }
          else {
            return false;
          }
        }
    };
    */
  
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
      if (this.props.registered) {
        this.unregister();
      } else {
        this.register();
      }
    };

    toggleEdit = () => {
      this.setState({ showEdit: !this.state.showEdit });
    };

render() {
    var renderMobileView = (window.innerWidth < 800);

    return (
        <Box direction="column" gap="small" width="100%" >
          <Box direction="row" gap="small" margin={{left: "20px", right: "20px"}} >
            <Box direction="row" width="100%" align="center" gap="10px">
              <Calendar size={renderMobileView ? "14px" : "16px"} />
              <Text
                size={renderMobileView ? "14px" : "16px"}
                color="black"
                margin={{left:"5px"}}
                style={{ height: "20px", fontStyle: "normal" }}
              >
                {this.formatDateFull(
                  this.props.talk.date,
                  this.props.talk.end_date
                )}
              </Text>
              <CalendarButtons talk={this.props.talk}/>
            </Box>
            <Box
              justify="end"
              align="end"
              // margin={{left: "10px"}}
            >
              <ShareButtons talk={this.props.talk} width={renderMobileView ? "50px" : "90px"} />
            </Box>



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

      {/* <SaveForLaterButton
            talk={this.props.talk}
            user={this.props.user}
          /> */}

          <Box direction="row" align="center" gap="20px" background="#d5d5d5" pad="25px" justify="center">
            {(!this.props.isSharingPage || (
              !(this.props.role && ["owner", "member"].includes(this.props.role)) && 
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
            {(this.props.isSharingPage && (
              (this.props.role && ["owner", "member"].includes(this.props.role)) || 
              this.props.registered || 
              this.props.talk.visibility === "Everybody")) && (

                <Countdown talk={this.props.talk} />
            )}
          </Box>
      </Box>
      
    )
  }
}