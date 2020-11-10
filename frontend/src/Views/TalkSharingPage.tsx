import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Box, Text, Image } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import { Video, VideoService } from "../Services/VideoService";
import { Stream, StreamService } from "../Services/StreamService";
import { Talk, TalkService } from "../Services/TalkService";
import { Link } from "react-router-dom";
import Identicon from "react-identicons";
import Loading from "../Components/Core/Loading";
import ChannelPageTalkList from "../Components/Channel/ChannelPageTalkList";
import ChannelPageTalkCard from "../Components/Channel/ChannelPageTalkCard";
import VideoCard from "../Components/Streaming/VideoCard";
import ChannelLiveNowCard from "../Components/Channel/ChannelLiveNowCard";
import "../Styles/channel-page.css";
import PastTalkCard from "../Components/Talks/PastTalkCard";
import AboutUs from "../Components/Channel/AboutUs";
import { baseApiUrl } from "../config";
import { Calendar, Workshop, UserExpert } from "grommet-icons";
import { CSSProperties } from "styled-components";
import { FormDown, FormUp } from "grommet-icons";
import ApplyToTalkForm from "../Components/Talks/ApplyToTalkForm";
import RequestMembershipButton from "../Components/Channel/ApplyMembershipButton";
import TalkCard from "../Components/Talks/TalkCard";
import LoginModal from "../Components/Account/LoginModal";
import SignUpButton from "../Components/Account/SignUpButton";
import CountdownAndCalendarButtons from "../Components/Talks/CountdownAndCalendarButtons";
import OverlayFooter from "../Components/Talks/Talkcard/OverlayFooter";

interface Props {
  location: { pathname: string };
  streamId: number;
}

interface State {
  channel: Channel | null;
  talk: Talk;
  role: "none" | "owner" | "member" | "follower";
  loading: boolean;
  streams: Stream[];
  talks: Talk[];
  currentTalks: Talk[];
  pastTalks: Talk[];
  totalNumberOfpastTalks: number;
  followerCount: number;
  following: boolean;
  user: User | null;
  bannerExtended: boolean;
  showTalkId: number;
  membershipApplicatedFetched: boolean;
  membershipApplication: {
    fullName: string,
    position: string,
    institution: string,
    email: string,
    personalHomepage: string
  }
}

export default class ChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channel: null,
      role: "none",
      loading: true,
      streams: [],
      talk: {
        id: NaN,
        channel_id: NaN,
        channel_name: "",
        channel_colour: "",
        has_avatar: false,
        name: "",
        date: "",
        end_date: "",
        description: "",
        link: "",
        recording_link: "",
        tags: [],
        show_link_offset: NaN,
        visibility: "",
        card_visibility: "",
        topics: [],
        talk_speaker: "",
        talk_speaker_url: "",
        published: 0,
        audience_level: "All"
      },
      
      talks: [],
      currentTalks: [],
      pastTalks: [],
      totalNumberOfpastTalks: 0,
      followerCount: 0,
      following: false,
      user: UserService.getCurrentUser(),
      bannerExtended: true,
      showTalkId: this.getTalkIdFromUrl(),
      membershipApplicatedFetched: false,
      membershipApplication:
      {
        fullName: "",
        position: "",
        institution: "",
        email: "",
        personalHomepage: ""
      }
    };
    this.fetchTalk();
  }

  componentWillMount() {
    this.fetchTalk();
  }

  getTalkIdFromUrl = (): number => {
    let talkId = Number(this.props.location.pathname.split("/")[2]);
    if (!talkId) {
      return -1;
    }
    return Number(talkId);
  };

  shouldRedirect = (): boolean => {
    return this.state.role === "owner";
  };

  fetchTalk = () => {
    let talkId = this.getTalkIdFromUrl();
    TalkService.getTalkById(talkId, (talk: Talk) => {
        this.setState({talk: talk})
    });
  }



  
  checkIfFollowing = () => {
    ChannelService.getRoleInChannel(
      this.state.user!.id,
      this.state.channel!.id,
      (role: string) => {
        this.setState({ following: role === "follower" });
      }
    );
  };

  checkIfMembershipRequested = () => {
    // If user not logged in, put a log in/ register inside the box


    // else: check the application and fill the fields with the past application
    if (!(this.state.membershipApplicatedFetched)) {
      ChannelService.getMembershipApplications(
        this.state.channel!.id,
        (
          full_name: string,
          position: string,
          institution: string,
          email: string,
          personalHomepage: string
        ) => {
          this.setState({
            membershipApplication: {
              fullName: full_name,
              position: position,
              institution: institution,
              email: email,
              personalHomepage: personalHomepage
            }
          })
        },
      this.state.user!.id,
      )
    };
    }



  onApplyMembershipClicked = () => {
  };

  onFollowClicked = () => {
    if (!this.state.following) {
      ChannelService.addUserToChannel(
        this.state.user!.id,
        this.state.channel!.id,
        "follower",
        () => {
        }
      );
      this.setState({ role: "follower" });
    } else {
      ChannelService.removeUserFromChannel(
        this.state.user!.id,
        this.state.channel!.id,
        () => {
        }
      );
      if (!(this.state.role === "member")){
        this.setState({ role: "none" });
      }
    }
    this.setState({ following: !this.state.following });
  };

  getImageUrl = (): string | undefined => {
    let current_time = Math.floor(new Date().getTime() / 5000);
    let imageUrl = this.state.channel?.id
      ? `${baseApiUrl}/channels/cover?channelId=${this.state.channel.id}&ts=` + current_time
      // HACK: we add the new time at the end of the URL to avoid caching; 
      // we divide time by value such that all block of requested image have 
      // the same name (important for the name to be the same for the styling).
      : undefined;
    return imageUrl;
  }

  getCoverBoxStyle = (): CSSProperties => {
    let background = this.state.channel ?.colour;
    let border = "none";

    return {
      width: "75vw",
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      background: background,
      backgroundSize: "75vw 25vw",
      border: border,
    };
  };

  toggleBanner = () => {
    this.setState({ bannerExtended: !this.state.bannerExtended });
  };

  escapeDoubleQuotes = (text: string) => {
    return text.replace("''", "'")
  }

  formatDateFull = (s: string, e: string) => {
    const start = new Date(s);
    const dateStartStr = start.toDateString().slice(0, -4);
    const timeStartStr = start.toTimeString().slice(0, 5);
    const end = new Date(e);
    const dateEndStr = end.toDateString().slice(0, -4);
    const timeEndStr = end.toTimeString().slice(0, 5);
    return `${dateStartStr} ${timeStartStr} - ${timeEndStr} `;
  };

  banner = () => {
    return (
      <Box width="75vw" background="white" round="10px">
        <Box
          direction="row"
          justify="between"
          height="25vw"
        >
          <Image src={this.getImageUrl()} style={this.getCoverBoxStyle()} />
        </Box>
        <Box
          direction="row"
          height="133px"
          align="center"
          justify="between"
          pad="16px"
        >
          <Box direction="row" align="end" gap="small">
            <Box
              width="100px"
              height="100px"
              round="50px"
              background="white"
              justify="center"
              align="center"
              style={{ minWidth: 100, minHeight: 100 }}
              overflow="hidden"
            >
              {(
                <img
                  src={
                    ChannelService.getAvatar(this.state.channel!.id, Math.floor(new Date().getTime() / 45000))
                  }
                  // HACK: we had the ts argument to prevent from caching.
                  height={100}
                  width={100}
                />
              )}
            </Box>
            <Box>
              <Text size="30px" color="black" weight="bold">
                {this.state.channel ?.name}
              </Text>
              <Box height="36px"> </Box>
              {/*<Text size="24px" color="#999999" weight="bold">
                {this.state.followerCount} followers
                </Text>*/}
            </Box>
          </Box>
          <Box direction="row" gap="xsmall" align="center">

            {!(this.state.role == "member" || this.state.role == "owner") && (
            <RequestMembershipButton
              channelId={this.state.channel!.id}
              channelName={this.state.channel!.name}
              user={this.state.user}
            />
            )}

            {this.state.user && (
              <Box
                className="follow-button"
                background={this.state.following ? "#e5e5e5" : "white"}
                height="45px"
                style={{
                  border: "1px solid #C2C2C2",
                }}
                width="10vw"
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
                  {this.state.following ? "Following" : "Follow"}
                </Text>
              </Box>
            )}
            {this.state.bannerExtended ? (
              <FormUp
                onClick={this.toggleBanner}
                size="50px"
                color="black"
                style={{ cursor: "pointer" }}
              />
            ) : (
                <FormDown
                  onClick={this.toggleBanner}
                  size="50px"
                  color="black"
                  style={{ cursor: "pointer" }}
                />
              )}
          </Box>
        </Box>
        {this.state.bannerExtended && (
          <Text
            size="20px"
            style={{ textAlign: "justify", fontWeight: 450 }}
            margin={{ horizontal: "16px", bottom: "16px" }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: this.state.channel ?.long_description
                  ? this.state.channel ?.long_description
                    : "",
              }}
            />
          </Text>
        )}
      </Box>
    );
  };

  render() { 
      return(
        <Box
            margin={{top: "100px", left: "20px", right: "20px"}}
            align="center">
            <Box
                width="55vw"
                margin={{left: "20px", right: "20px"}}>
                <Box direction="row" gap="xsmall" style={{ minHeight: "40px" }}>
                <Link
                className="channel"
                to={`/${this.state.talk.channel_name}`}
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
                        <img
                        src={ChannelService.getAvatar(
                            this.state.talk.channel_id
                        )}
                        height={30}
                        width={30}
                        />
                    </Box>
                    <Box justify="between">
                    <Text weight="bold" size="18px" color="grey">
                        {this.state.talk.channel_name}
                    </Text>
                    </Box>
                </Box>
                </Link>
            </Box>
            <Text
                      weight="bold"
                      size="21px"
                      color="black"
                      style={{
                        minHeight: "50px",
                        maxHeight: "120px",
                        overflowY: "auto",
                      }}
                      margin={{ bottom: "5px", top: "10px" }}
                    >
                      {this.state.talk.name}
            </Text> 

            {this.state.talk.talk_speaker_url && (
                      <a href={this.state.talk.talk_speaker_url} target="_blank">
                        <Box
                          direction="row"
                          gap="small"
                          onClick={() => {}}
                          hoverIndicator={true}
                          pad={{ left: "6px", top: "4px" }}
                        >
                          <UserExpert size="18px" />
                          <Text
                            size="18px"
                            color="black"
                            style={{
                              height: "24px",
                              overflow: "auto",
                              fontStyle: "italic",
                            }}
                          >
                            {this.state.talk.talk_speaker
                              ? this.state.talk.talk_speaker
                              : "TBA"}
                          </Text>
                        </Box>
                      </a>
                    )}

            {!this.state.talk.talk_speaker_url && (
                      <Box direction="row" gap="small">
                        <UserExpert size="18px" />
                        <Text
                          size="18px"
                          color="black"
                          style={{
                            height: "30px",
                            overflow: "auto",
                            fontStyle: "italic",
                          }}
                          margin={{ bottom: "10px" }}
                        >
                          {this.state.talk.talk_speaker
                            ? this.state.talk.talk_speaker
                            : "TBA"}
                        </Text>
                      </Box>
                    )}

            <Text
                      size="16px"
                      color="black"
                      style={{
                        minHeight: "50px",
                        // maxHeight: "200px",
                        // overflowY: "auto",
                      }}
                      margin={{ top: "10px", bottom: "10px" }}
                    >
                      {this.escapeDoubleQuotes(this.state.talk.description)}
                    </Text>
          <OverlayFooter
              talk={this.state.talk}
              user={this.state.user}
              role={this.state.role}
              />
          </Box>
        </Box>
      )
    }
}