import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Box, Text, Image } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import { Stream, StreamService } from "../Services/StreamService";
import { Talk, TalkService } from "../Services/TalkService";
import Loading from "../Components/Core/Loading";
import ChannelPageTalkList from "../Components/Channel/ChannelPageTalkList";
import ChannelPageTalkCard from "../Components/Channel/ChannelPageTalkCard";
import "../Styles/channel-page.css";
import PastTalkCard from "../Components/Talks/PastTalkCard";
import { CSSProperties } from "styled-components";
import { FormDown, FormUp } from "grommet-icons";
import ApplyToTalkForm from "../Components/Talks/ApplyToTalkForm";
import RequestMembershipButton from "../Components/Channel/ApplyMembershipButton";
import { Topic, TopicService } from "../Services/TopicService";
import ShareButtons from ".././Components/Core/ShareButtons";
import MoraFlexibleGrid from "../Components/Core/MoraFlexibleGrid";
import MediaQuery from "react-responsive";
import { baseApiUrl } from "../config";
import ReactTooltip from "react-tooltip";

// NOTE:
//      -"following" feature globally commented
//      -"viewer count" feature commented for the public (only available to admin)

interface Props {
  location: { pathname: string };
  streamId: number;
  channel?: Channel;
}

interface State {
  channel: Channel | null;
  channelId: number;
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
    fullName: string;
    position: string;
    institution: string;
    email: string;
    personalHomepage: string;
  };
  topics: Topic[];
  topicId: number;
  field: string;
  isMobile: boolean;
  isSmallScreen: boolean;
  windowWidth: number;
}

export default class ChannelPage extends Component<Props, State> {
  private smallScreenBreakpoint: number;
  private mobileScreenBreakpoint: number;

  constructor(props: Props) {
    super(props);
    this.mobileScreenBreakpoint = 992;
    this.smallScreenBreakpoint = 480;
    this.state = {
      channel: null,
      channelId: 0,
      role: "none",
      loading: true,
      streams: [],
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
      membershipApplication: {
        fullName: "",
        position: "",
        institution: "",
        email: "",
        personalHomepage: "",
      },
      topics: this.props.channel ? this.props.channel.topics : [],
      topicId: this.props.channel?.topics[0].id
        ? this.props.channel?.topics[0].id
        : 0,
      field: "",
      isMobile: window.innerWidth < this.mobileScreenBreakpoint,
      isSmallScreen: window.innerWidth < this.smallScreenBreakpoint,
      windowWidth: window.innerWidth,
    };
  }

  componentWillMount() {
    window.addEventListener("scroll", this.handleScroll, true);
    window.addEventListener("resize", this.updateResponsiveSettings);
    this.fetchChannel();
    ChannelService.getChannelByName(
      this.props.location.pathname.split("/")[1],
      (channel: Channel) => {
        this.setState({ channelId: channel.id });
      }
    );
    ChannelService.getChannelTopic(
      this.state.channelId,
      (currentTopicId: number) => {
        this.setState({ topicId: currentTopicId });
      }
    );
    TopicService.getFieldFromId(this.state.topicId, (topicName: string) => {
      this.setState({ field: topicName });
    });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.updateResponsiveSettings);
  }

  storeUserData = () => {
    ChannelService.increaseViewCountForChannel(
      this.state.channel!.id,
      () => {}
    );
  };

  getTalkIdFromUrl = (): number => {
    const urlParams = new URLSearchParams(window.location.search);
    const talkId = urlParams.get("talkId");
    if (!talkId) {
      return -1;
    }
    return Number(talkId);
  };

  shouldRedirect = (): boolean => {
    return this.state.role === "owner";
  };

  handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (
      bottom &&
      this.state.pastTalks.length !== this.state.totalNumberOfpastTalks
    ) {
      this.fetchPastTalks();
    }
  };

  updateResponsiveSettings = () => {
    this.setState({
      isMobile: window.innerWidth < this.mobileScreenBreakpoint,
      isSmallScreen: window.innerWidth < this.smallScreenBreakpoint,
      windowWidth: window.innerWidth,
    });
  };

  fetchChannel = () => {
    // console.log(this.props.location.pathname.split("/"));
    ChannelService.getChannelByName(
      this.props.location.pathname.split("/")[1],
      (channel: Channel) => {
        let user = UserService.getCurrentUser();
        if (user === null) {
          this.setState(
            { channel: channel, role: "none", loading: false },
            () => {
              this.fetchStreams();
              this.fetchPastTalks();
              // this.fetchVideos();
              this.fetchFutureTalks();
              this.fetchCurrentTalks();
              this.fetchFollowerCount();
              this.storeUserData();
              // this.fetchViewCount();
            }
          );
          return;
        }
        ChannelService.getRoleInChannel(
          user.id,
          channel.id,
          (role: "none" | "owner" | "member" | "follower") => {
            this.setState(
              { channel: channel, role: role, loading: false },
              () => {
                this.fetchStreams();
                this.fetchPastTalks();
                // this.fetchVideos();
                this.fetchFutureTalks();
                this.fetchCurrentTalks();
                this.fetchFollowerCount();
                // this.fetchViewCount();
                this.checkIfFollowing();
              }
            );
          }
        );
      }
    );
  };

  fetchStreams = () => {
    StreamService.getStreamsForChannel(
      this.state.channel!.id,
      (streams: Stream[]) => {
        this.setState({ streams });
      }
    );
  };

  fetchFollowerCount = () => {
    ChannelService.getFollowerCountForChannel(
      this.state.channel!.id,
      (followerCount: number) => {
        this.setState({ followerCount });
      }
    );
  };

  // fetchViewCount = () => {
  //   ChannelService.getViewCountForChannel(
  //     this.state.channel!.id,
  //     (viewerCount: number) => {
  //       this.setState({ viewerCount });
  //     }
  //   );
  // };

  fetchFutureTalks = () => {
    if (this.state.channel) {
      TalkService.getAvailableFutureTalksForChannel(
        this.state.channel!.id,
        this.state.user ? this.state.user.id : null,
        (talks: Talk[]) => {
          this.setState({ talks });
        }
      );
    }
  };

  fetchCurrentTalks = () => {
    if (this.state.channel) {
      TalkService.getAvailableCurrentTalksForChannel(
        this.state.channel!.id,
        this.state.user ? this.state.user.id : null,
        (currentTalks: Talk[]) => {
          this.setState({ currentTalks });
        }
      );
    }
  };

  fetchPastTalks = () => {
    if (this.state.channel) {
      TalkService.getAvailablePastTalksForChannel(
        this.state.channel!.id,
        this.state.user ? this.state.user.id : null,
        (pastTalks: Talk[]) => {
          this.setState({ pastTalks });
        }
      );
    }
  };

  checkIfFollowing = () => {
    ChannelService.getRoleInChannel(
      this.state.user!.id,
      this.state.channel!.id,
      (role: string) => {
        this.setState({ following: role === "follower" });
      }
    );
  };

  toggleFollow = () => {
    this.setState({ following: !this.state.following });
  };

  checkIfMembershipRequested = () => {
    // If user not logged in, put a log in/ register inside the box

    // else: check the application and fill the fields with the past application
    if (!this.state.membershipApplicatedFetched) {
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
              personalHomepage: personalHomepage,
            },
          });
        },
        this.state.user!.id
      );
    }
  };

  onApplyMembershipClicked = () => {};

  onFollowClicked = () => {
    if (!this.state.following) {
      ChannelService.addUserToChannel(
        this.state.user!.id,
        this.state.channel!.id,
        "follower",
        () => {
          this.fetchFollowerCount();
        }
      );
      this.setState({ role: "follower" });
    } else {
      ChannelService.removeUserFromChannel(
        this.state.user!.id,
        this.state.channel!.id,
        () => {
          this.fetchFollowerCount();
        }
      );
      if (!(this.state.role === "member")) {
        this.setState({ role: "none" });
      }
    }
    this.setState({ following: !this.state.following });
  };

  getImageUrl = (): string | undefined => {
    let current_time = Math.floor(new Date().getTime() / 5000);
    let imageUrl = this.state.channel?.id
      ? `${baseApiUrl}/channels/cover?channelId=${this.state.channel.id}&ts=` +
        current_time
      : // HACK: we add the new time at the end of the URL to avoid caching;
        // we divide time by value such that all block of requested image have
        // the same name (important for the name to be the same for the styling).
        undefined;
    return imageUrl;
  };

  getCoverBoxStyle = (): CSSProperties => {
    let background = this.state.channel?.colour;
    let border = "none";

    return {
      width: "100%",
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      background: background,
      backgroundSize: "100vw 33vw",
      border: border,
    };
  };

  toggleBanner = () => {
    this.setState({ bannerExtended: !this.state.bannerExtended });
  };

  fetchChannelTopic = () => {
    if (this.state.topics) {
      ChannelService.getChannelTopic(
        this.state.channel!.id,
        (topicId: number) => {
          this.setState({ topicId });
        }
      );
      return this.state.topicId;
    }
  };

  banner = () => {
    return (
      <Box width="75vw" background="white" round="10px">
        <Box direction="row" justify="between" height="25vw">
          <Image src={this.getImageUrl()} style={this.getCoverBoxStyle()} />
        </Box>
        <Box
          direction={this.state.windowWidth < 960 ? "column" : "row"}
          height="auto"
          align="stretch"
          justify="between"
          pad="16px"
        >
          <Box
            direction="row"
            align={this.state.windowWidth < 960 ? "center" : "end"}
            gap="small"
          >
            <div className="banner_avatar">
              {
                <img
                  src={ChannelService.getAvatar(
                    this.state.channel!.id,
                    Math.floor(new Date().getTime() / 45000)
                  )}
                  // HACK: we had the ts argument to prevent from caching.
                  height={100}
                  width={100}
                />
              }
            </div>

            <Box
              direction={
                this.state.windowWidth < 960
                  ? this.state.windowWidth < 600
                    ? "column"
                    : "row"
                  : "column"
              }
              align={
                this.state.windowWidth < 960
                  ? this.state.windowWidth < 600
                    ? "start"
                    : "center"
                  : "start"
              }
            >
              <div
                className="banner_title"
                style={{
                  marginRight: this.state.windowWidth < 960 ? "12px" : "0px",
                  marginBottom: this.state.windowWidth < 600 ? "10px" : "0px",
                }}
              >
                {this.state.channel?.name}
              </div>
              <Box
                margin={{ top: this.state.windowWidth < 960 ? "0px" : "10px" }}
                style={{ width: "300px" }}
                direction="column"
              >
                <ShareButtons
                  channel={this.state.channel}
                  height={window.innerWidth < 800 ? "25px" : "35px"}
                />
              </Box>
              {/*<Text size="24px" color="#999999" weight="bold">
                  {this.state.followerCount} followers
                  </Text>*/}
            </Box>
          </Box>

          <Box direction="row" gap="xsmall" align="end">
            {/*<MediaQuery minWidth={900}>*/}
            <ApplyToTalkForm
              channelId={this.state.channel!.id}
              channelName={this.state.channel!.name}
              widthButton={this.state.windowWidth < 769 ? "100px" : ""}
              windowWidth={this.state.windowWidth}
            />

            <Box
              className="follow-button"
              pad={{ bottom: "6px", top: "6px", left: "3px", right: "3px" }}
              background={this.state.following ? "#e5e5e5" : "white"}
              height="30px"
              style={{
                border: "1px solid #C2C2C2",
              }}
              width={this.state.windowWidth < 769 ? "100px" : "10vw"}
              round="xsmall"
              align="center"
              justify="center"
              onClick={this.state.user ? this.onFollowClicked : () => {}}
              focusIndicator={false}
              hoverIndicator={this.state.user ? true : false}
              data-tip
              data-for="not_registered_follow_button_info"
            >
              <Text size="14px" color="grey" alignSelf="center">
                {this.state.following ? "Following" : "Follow"}
              </Text>
              {!this.state.user && (
                <ReactTooltip
                  id="not_registered_follow_button_info"
                  place="top"
                  effect="solid"
                >
                  <p>You need to be registered for that.</p>
                </ReactTooltip>
              )}
            </Box>

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
            size="14px"
            style={{ textAlign: "justify", fontWeight: 450 }}
            margin={{ horizontal: "16px", bottom: "16px" }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: this.state.channel?.long_description
                  ? this.state.channel?.long_description
                  : "",
              }}
            />
          </Text>
        )}

        {/*     TODO TO UNCOMMENT THIS: make overlay nice to use on mobile

        <MediaQuery maxWidth={600}>
          <Box direction="column" align="center" alignContent="center" gap = "5px" margin={{bottom: "15px"}}>
            <ApplyToTalkForm
                  channelId={this.state.channel!.id}
                  channelName={this.state.channel!.name}
                  widthButton={"200px"}
                />
            {!(this.state.role == "member" || this.state.role == "owner") && (
            <RequestMembershipButton
              channelId={this.state.channel!.id}
              channelName={this.state.channel!.name}
              user={this.state.user}
              widthButton={"200px"}
            />
            )}
          </Box>
        </MediaQuery>  */}
      </Box>
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <Box width="100%" height="100%" justify="center" align="center">
          <Loading color="black" size={50} />
        </Box>
      );
    } else {
      let currentTalks: React.ReactNode[] | undefined = undefined;
      if (this.state.currentTalks.length > 0) {
        currentTalks = this.state.currentTalks.map(
          (talk: Talk, index: number) => (
            <ChannelPageTalkCard
              talk={talk}
              user={this.state.user}
              admin={false}
              width="100%"
              isCurrent={true}
              following={this.state.following}
              key={index}
            />
          )
        );
      }

      let upcomingTalks: React.ReactNode[] | undefined = undefined;
      if (this.state.talks.length !== 0) {
      }

      let pastTalks: React.ReactNode[] | undefined = undefined;
      if (this.state.pastTalks.length !== 0) {
        pastTalks = this.state.pastTalks.map((talk: Talk, index: number) => (
          <PastTalkCard
            width="100%"
            talk={talk}
            margin={{ bottom: "medium" }}
            user={this.state.user}
            windowWidth={window.innerWidth}
            key={index}
          />
        ));
      }

      return (
        <Box align="center">
          <img
            style={{
              height: "auto",
              width: "auto",
              minWidth: "100%",
              minHeight: "100%",
            }}
            id="background-landing"
            // src={BackgroundImage}
            src="https://i.postimg.cc/RhmJmzM3/mora-social-media-cover-bad6db.jpg"
          />
          {this.shouldRedirect() ? (
            <Redirect
              to={{
                pathname: this.props.location.pathname + "/manage",
                state: { channel: this.state.channel },
              }}
            />
          ) : (
            <div
              className="overall_channel_box"
              style={{
                position: "static",
                marginTop: this.state.windowWidth < 501 ? "0px" : "5vh",
              }}
            >
              <Box
                width="100%"
                gap="20px"
                margin={{ top: this.state.isMobile ? "40px" : "40px" }}
                align={this.state.windowWidth < 501 ? "center" : "center"}
              >
                {this.banner()}
                {/* <AboutUs text={this.state.channel?.long_description} /> */}
                {this.state.currentTalks.length > 0 && (
                  <Box width="100%">
                    <Text
                      size="26px"
                      weight="bold"
                      color="color1"
                      margin={{ top: "40px", bottom: "24px" }}
                    >
                      {`Happening now 🔴`}
                    </Text>
                    {
                      <MoraFlexibleGrid
                        windowWidth={this.state.windowWidth}
                        gridBreakpoints={[
                          { screenSize: 1200, columns: 4 },
                          { screenSize: 960, columns: 3 },
                          { screenSize: 767, columns: 2 },
                          { screenSize: 320, columns: 1 },
                        ]}
                        gap={10}
                        childElements={currentTalks}
                      />
                    }
                  </Box>
                )}

                <Text
                  size="26px"
                  weight="bold"
                  color="color1"
                  margin={{ bottom: "10px" }}
                  alignSelf="start"
                >
                  Upcoming talks
                </Text>

                {/*No Upcoming talks section*/}
                {this.state.talks.length === 0 && (
                  <Box
                    direction="row"
                    width="100%"
                    pad="small"
                    justify="between"
                    round="xsmall"
                    align="center"
                    alignSelf="center"
                    background="#F3EACE"
                    margin={{ bottom: "36px" }}
                  >
                    <Text size="14px" weight="bold" color="grey">
                      There are no publicly available upcoming talks in{" "}
                      {this.state.channel
                        ? this.state.channel.name
                        : "this channel"}
                    </Text>
                  </Box>
                )}
                {/*No Upcoming talks section*/}

                {this.state.talks.length !== 0 && (
                  <Box gap="5px" width="100%">
                    <ChannelPageTalkList
                      talks={this.state.talks}
                      channelId={this.state.channel!.id}
                      user={this.state.user}
                      admin={false}
                      showTalkId={this.state.showTalkId}
                      role={this.state.role}
                      following={this.state.following}
                      callback={this.toggleFollow}
                      windowWidth={this.state.windowWidth}
                    />
                  </Box>
                )}

                {this.state.pastTalks.length !== 0 && (
                  <Text
                    size="26px"
                    weight="bold"
                    color="color1"
                    margin={{ top: "40px" }}
                  >{`Past talks`}</Text>
                )}
                <div className="talk_cards_outer_box">
                  {
                    <MoraFlexibleGrid
                      windowWidth={this.state.windowWidth}
                      gridBreakpoints={[
                        { screenSize: 1200, columns: 4 },
                        { screenSize: 960, columns: 3 },
                        { screenSize: 767, columns: 2 },
                        { screenSize: 320, columns: 1 },
                      ]}
                      gap={10}
                      childElements={pastTalks}
                    />
                  }
                </div>
              </Box>
              {/* </Box> */}
            </div>
            // </Box>
          )}
        </Box>
      );
    }
  }
}
