import React, { Component } from "react";
import { Box, Text, Button, Layer } from "grommet";
import Identicon from "react-identicons";
import { Calendar, Workshop, UserExpert } from "grommet-icons";
import { User } from "../../Services/UserService";
import { Tag } from "../../Services/TagService";
import { Link, Redirect } from "react-router-dom";
import { Talk, TalkService } from "../../Services/TalkService";
import EditTalkModal from "../Talks/EditTalkModal";
import { default as TagComponent } from "../Core/Tag";
import { ChannelService } from "../../Services/ChannelService";
import Countdown from "../Talks/Countdown";
import AsyncButton from "../Core/AsyncButton";
import TalkCard from "../Talks/TalkCard";
import LoginModal from "../Account/LoginModal";
import SignUpButton from "../Account/SignUpButton";
import RequestMembershipButton from "./ApplyMembershipButton";
import { thisExpression } from "@babel/types";
import { textToLatex } from "../Core/LatexRendering";
import FooterOverlay from "../Talks/Talkcard/FooterOverlay";
import MediaQuery from "react-responsive";
import MobileTalkCardOverlay from "../Talks/Talkcard/MobileTalkCardOverlay";
import SlidesUploader from "../Core/SlidesUploader";
import CopyUrlButton from "../Core/ShareButtons/CopyUrlButton";
import { encryptIdAndRoleInUrl } from "../Core/Encryption/UrlEncryption"
import { basePoint } from "../../config";


interface Props {
  talk: Talk;
  user: User | null;
  admin: boolean;
  role?: string;
  width?: any;
  margin?: any;
  isCurrent?: boolean;
  show?: boolean;
  following: boolean;
  onEditCallback?: any;
  callback?: any;
}

interface State {
  showModal: boolean;
  showEdit: boolean;
  available: boolean;
  registered: boolean;
  registrationStatus: string;
  showShadow: boolean;
  slideUrl?: string;
}

export default class ChannelPageTalkCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: this.props.show ? this.props.show && !this.props.admin : false,
      showEdit: false,
      available: false,
      registered: false,
      registrationStatus: "",
      showShadow: false,
      slideUrl: ''
    };
  }

  componentWillMount() {
    this.checkIfAvailableAndRegistered();
  }

  componentDidMount = () => {
    this.checkIfUserCanAccessLink();
    this.checkIfUserCanViewCard();
    this.fetchSlide()
  };

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

  checkIfRegistered = () => {
    this.props.user &&
      TalkService.registrationStatusForTalk(
        this.props.talk.id,
        this.props.user.id,
        (status: string) => {
          this.setState({ 
            registered: (status === "accepted"),
            registrationStatus: status,
           });
        }
      );
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
        if (this.props.following || this.props.role === "follower" || this.props.role === "member") {
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

  checkIfUserCanViewCard = (): boolean => {
    if (this.props.admin) {
      return true;
    }
    else {
      if (this.props.talk.card_visibility == "Everybody") {
        return true;
      }
      else if (this.props.talk.card_visibility === "Followers and members") {
        if (this.props.role === "follower" || this.props.role === "member") {
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
      else {
        return false;
      }
    }
  };

  register = () => {
    // this.props.user &&
    //   TalkService.registerForTalk(
    //     this.props.talk.id,
    //     this.props.user.id,
    //     () => {
    //       this.checkIfRegistered();
    //     }
    //   );
  };

  unregister = () => {
    // this.props.user &&
    //   TalkService.unRegisterForTalk(
    //     this.props.talk.id,
    //     this.props.user.id,
    //     () => {
    //       this.checkIfRegistered();
    //     }
    //   );
  };

  onClick = () => {
    if (this.state.registered) {
      this.unregister();
    } else {
      this.register();
    }
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

  formatDateFull = (s: string, e: string) => {
    const start = new Date(s);
    const dateStartStr = start.toDateString().slice(0, -4);
    const timeStartStr = start.toTimeString().slice(0, 5);
    const end = new Date(e);
    const dateEndStr = end.toDateString().slice(0, -4);
    const timeEndStr = end.toTimeString().slice(0, 5);
    return `${dateStartStr} ${timeStartStr} - ${timeEndStr} `;
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

  toggleModal = () => {
    // track click of the event
    if (!(this.state.showModal)){
      TalkService.increaseViewCountForTalk(this.props.talk.id, () => {})
    }
    // toggle Modal
    this.setState({ showModal: !this.state.showModal });
  };

  toggleEdit = () => {
    this.setState({ 
      showEdit: !this.state.showEdit
    });
  };

  onSlideUpload = async (e: any) => {
    await TalkService.uploadSlides(this.props.talk.id, e.target.files[0], ()=>{})
    await this.fetchSlide()
  };
  
  fetchSlide = async () => {
    let {url} = await TalkService.getSlides(this.props.talk.id)
    this.setState({slideUrl: url})
  };

  render() {
    var renderMobileView = (window.innerWidth < 800);
    var agoraTalk = this.props.talk.link.includes( basePoint + "/livestream")

    return (
      <Box
        width={this.props.width ? this.props.width : "32%"}
        // height={this.props.admin 
        //   ? ((renderMobileView && this.state.showModal) ? "1000px" : "240px")
        //   : ((renderMobileView && this.state.showModal) ? "560px" : "180px")}
        focusIndicator={false}
        height="100%"
        style={{ 
          position: "relative",
          maxHeight: this.props.admin 
            ? ((renderMobileView && this.state.showModal) ? "240px" : "240px")
            : ((renderMobileView && this.state.showModal) ? "600px" : "600px"),
          minHeight: this.props.admin 
          ? ((renderMobileView && this.state.showModal) ? "240px" : "240px")
          : ((renderMobileView && this.state.showModal) ? "180px" : "180px"),
        }}
        margin={{ bottom: "small" }}
      >
        <Box
          onMouseEnter={() => this.setState({ showShadow: true })}
          onMouseLeave={() => {
            if (!this.state.showModal) {
              this.setState({ showShadow: false });
            }
          }}
          onClick={this.toggleModal}
          height="180px"
          width="100%"
          background="white"
          round="xsmall"
          justify="between"
          gap="small"
          overflow="hidden"
        >
          <Box height="100%" pad="10px">
            <Box
              direction="row"
              gap="xsmall"
              align="center"
              style={{ height: "40px" }}
              margin={{ bottom: "10px" }}
            >
              <Box
                height="30px"
                width="30px"
                round="15px"
                justify="center"
                align="center"
                background="#efeff1"
                overflow="hidden"
              >
                {!this.props.talk.has_avatar && (
                  <Identicon string={this.props.talk.channel_name} size={15} />
                )}
                {!!this.props.talk.has_avatar && (
                  <img
                    src={ChannelService.getAvatar(this.props.talk.channel_id)}
                    height={30}
                    width={30}
                  />
                )}
              </Box>
              <Text weight="bold" size="14px" color="grey">
                {this.props.talk.channel_name}
              </Text>
            </Box>
            <Text
              size="14px"
              color="black"
              weight="bold"
              style={{ minHeight: "75px", overflow: "auto" }}
            >
              {this.props.talk.name}
            </Text>
            <Box direction="row" gap="small">
              <UserExpert size="18px" />
              <Text
                size="14px"
                color="black"
                style={{
                  height: "30px",
                  overflow: "auto",
                  fontStyle: "italic",
                }}
                margin={{ bottom: "10px" }}
              >
                {this.props.talk.talk_speaker
                  ? this.props.talk.talk_speaker
                  : "TBA"}
              </Text>
            </Box>
            <Box direction="row" gap="small">
              <Calendar size="14px" />
              <Box direction="row" width="100%">
                {this.props.isCurrent && (
                  <Text
                    size="18px"
                    color="#5454A0"
                    weight="bold"
                    style={{ height: "20px", fontStyle: "normal" }}
                  >
                    {this.getTimeRemaining()}
                  </Text>
                )}
                {!this.props.isCurrent && (
                  <Text
                    size="14px"
                    color="black"
                    style={{ height: "30px", fontStyle: "normal" }}
                  >
                    {this.formatDate(this.props.talk.date)}
                  </Text>
                )}
              </Box>
              {this.props.talk.card_visibility === "Members only" &&
                <Box
                  round="xsmall"
                  background="#EAF1F1"
                  pad="xsmall"
                  justify="center"
                  align="center"
                  width="160px"
                >
                  <Text size="12px">
                    member-only
                  </Text>
                </Box>
              }
              {/*this.props.talk.card_visibility !== "Members only" && this.props.talk.visibility === "Members only" && 
                <Box
                  round="xsmall"
                  background="#D3F930"
                  pad="small"
                  justify="center"
                  align="center"
                  width="170px"
                  height="30px"             
                >
                  <Text size="14px" style={{ fontStyle: "normal" }}>
                    on-registration
                  </Text>
                </Box>
            */}
            </Box>
            {this.state.showShadow && (
              <Box
                height="180px"
                width="100%"
                round="xsmall"
                style={{
                  zIndex: -1,
                  position: "absolute",
                  top: 8,
                  left: 8,
                  opacity: 0.5,
                }}
                background="#6DA3C7"
              ></Box>
            )}
          </Box>
        </Box>
          
          {/* We would like the downloaded slides to have the following name: 'TalkService.getTalkByid.name'_slides.pdf */}
          {/* <Text><a href={TalkService.getSlides(160)} target='_blank'>Download</a></Text> */}
          {/* this.state.slideUrl && <Text><a href={this.state.slideUrl} target='_blank'>Download</a></Text> */}
          
          {/*<SlidesUploader
            text="Upload slide"
            onUpload={this.onSlideUpload}
          />*/}

        {this.props.admin && (
          <Box direction="row" gap="10px" margin={{top: "10px"}}>
            <Box
              onClick={() => {
                this.toggleEdit();
              }}
              width={agoraTalk ? "50%" : "100%"}
              background="#0C385B"
              round="xsmall"
              pad="xsmall"
              height="40px"
              justify="center"
              align="center"
              focusIndicator={false}
              hoverIndicator="#0C385B"
              
            >
              <Text size="16px">Edit</Text>
            </Box>
            {agoraTalk && <CopyUrlButton 
              url={encryptIdAndRoleInUrl("livestream", this.props.talk.id, "speaker")}
              text={"Link for speaker"} 
              height="40px"
              width="50%"
            /> }
            </Box>
        )}
        {this.state.showModal && (
          <>
          <MediaQuery maxDeviceWidth={800}>
            <MobileTalkCardOverlay
              talk={this.props.talk}
              pastOrFutureTalk="future"
              user={this.props.user}
              registered={this.state.registered}
              role={this.props.role}
              registrationStatus={this.state.registrationStatus}
            />
          </MediaQuery>

          <MediaQuery minDeviceWidth={800}>
            <Layer
              onEsc={() => {
                this.toggleModal();
                this.setState({ showShadow: false });
              }}
              onClickOutside={() => {
                this.toggleModal();
                this.setState({ showShadow: false });
              }}
              modal
              responsive
              animation="fadeIn"
              style={{
                width: 640,
                height: this.state.registered ? 640 : 540,
                borderRadius: 15,
                overflow: "hidden",
                alignSelf: "center",
              }}
            >
              <Box
                //align="center"
                pad="25px"
                // width="100%"
                height="80%"
                justify="between"
                gap="xsmall"
              >
                <Box
                  style={{ minHeight: "200px", maxHeight: "540px" }}
                  direction="column"
                >
                  <Box direction="row" gap="xsmall" style={{ minHeight: "30px" }}>
                    <Link
                      className="channel"
                      to={`/${this.props.talk.channel_name}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Box
                        direction="row"
                        gap="xsmall"
                        align="center"
                        round="xsmall"
                        pad={{ vertical: "6px", horizontal: "6px" }}
                      >
                        <Box
                          justify="center"
                          align="center"
                          background="#efeff1"
                          overflow="hidden"
                          style={{
                            minHeight: 30,
                            minWidth: 30,
                            borderRadius: 15,
                          }}
                        >
                          {!this.props.talk.has_avatar && (
                            <Identicon
                              string={this.props.talk.channel_name}
                              size={30}
                            />
                          )}
                          {!!this.props.talk.has_avatar && (
                            <img
                              src={ChannelService.getAvatar(
                                this.props.talk.channel_id
                              )}
                              height={30}
                              width={30}
                            />
                          )}
                        </Box>
                        <Box justify="between">
                          <Text weight="bold" size="18px" color="grey">
                            {this.props.talk.channel_name}
                          </Text>
                        </Box>
                      </Box>
                    </Link>
                  </Box>
                  <Text
                    weight="bold"
                    size="18px"
                    color="black"
                    style={{
                      minHeight: "50px",
                      maxHeight: "120px",
                      overflowY: "auto",
                    }}
                    margin={{ bottom: "20px", top: "10px" }}
                  >
                    {this.props.talk.name}
                  </Text>

                  {this.props.talk.talk_speaker_url && (
                    <a href={this.props.talk.talk_speaker_url} target="_blank">
                      <Box
                        direction="row"
                        gap="small"
                        onClick={() => {}}
                        hoverIndicator={true}
                        pad={{ left: "6px", top: "4px" }}
                      >
                        <UserExpert size="14px" />
                        <Text
                          size="14px"
                          color="black"
                          style={{
                            height: "24px",
                            overflow: "auto",
                            fontStyle: "italic",
                          }}
                        >
                          {this.props.talk.talk_speaker
                            ? this.props.talk.talk_speaker
                            : "TBA"}
                        </Text>
                      </Box>
                    </a>
                  )}

                  {!this.props.talk.talk_speaker_url && (
                    <Box direction="row" gap="small">
                      <UserExpert size="14px" />
                      <Text
                        size="14px"
                        color="black"
                        style={{
                          height: "30px",
                          overflow: "auto",
                          fontStyle: "italic",
                        }}
                        margin={{ bottom: "10px" }}
                      >
                        {this.props.talk.talk_speaker
                          ? this.props.talk.talk_speaker
                          : "TBA"}
                      </Text>
                    </Box>
                  )}
                  <Box
                    style={{
                      minHeight: "50px",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                    margin={{ top: "10px", bottom: "10px" }}
                    direction="column"
                  >
                    {this.props.talk.description.split('\n').map(
                      (item, i) => textToLatex(item)
                    )}
                  </Box>
                </Box>
                </Box>
                <FooterOverlay
                  talk={this.props.talk}
                  user={this.props.user}
                  isSharingPage={false}
                  registered={this.state.registered}
                  registrationStatus={this.state.registrationStatus}
                  role={this.props.admin ? "owner" : this.props.role} 
                  available={this.state.available}
                  width={this.props.width}
                  // isCurrent?: boolean;
                  // show?: boolean;
                  following={this.props.following}
                  onEditCallback={this.props.onEditCallback}
                  callback={this.props.callback}
                />
            </Layer>
          </MediaQuery>
          </>
        )}
        {this.props.admin && this.state.showEdit && (
          <EditTalkModal
            visible={this.state.showEdit}
            channel={null}
            channelId={this.props.talk.channel_id}
            talk={this.props.talk}
            onFinishedCallback={() => {
              this.props.onEditCallback();
            }}
            onDeletedCallback={() => {
              this.toggleEdit();
              this.props.onEditCallback();
            }}
            onCanceledCallback={this.toggleEdit}
            onFinishedAdvertisementCallback={this.toggleEdit}
            onCanceledAdvertisementCallback={this.toggleEdit}
          />
        )}
      </Box>
    );
  }
}
