import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Box, Text, Image } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Profile, ProfileService } from "../Services/ProfileService";
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
import { ApplyToTalkButton } from "../Components/Talks/ApplyToTalkButton";
import RequestMembershipButton from "../Components/Channel/ApplyMembershipButton";
import { Topic, TopicService } from "../Services/TopicService";
import ShareButtons from ".././Components/Core/ShareButtons";
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
    fullName: string,
    position: string,
    institution: string,
    email: string,
    personalHomepage: string
  }
  topics: Topic[];
  topicId: number;
  field: string;
}

export default class ChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
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
      membershipApplication:
      {
        fullName: "",
        position: "",
        institution: "",
        email: "",
        personalHomepage: ""
      },
      topics: this.props.channel ? this.props.channel.topics : [],
      topicId: this.props.channel?.topics[0].id ? this.props.channel?.topics[0].id : 0,
      field: "",
    };
  }

  componentWillMount() {
    window.addEventListener("scroll", this.handleScroll, true);
    this.fetchChannel();
    ChannelService.getChannelByName(
      this.props.location.pathname.split("/")[1],
      (channel: Channel) => {
        this.setState({channelId: channel.id})
      }
    );
    ChannelService.getChannelTopic(
      this.state.channelId,
      (currentTopicId: number) => {
        this.setState({ topicId:currentTopicId });
      }
    );
    TopicService.getFieldFromId(
      this.state.topicId,
      (topicName: string) => {
        this.setState({field: topicName})
      }
    )
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  storeUserData = () => {
    ChannelService.increaseViewCountForChannel(
      this.state.channel!.id,
      () => {});
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
    this.setState({following: !this.state.following})
  }

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
    return this.state.topicId
    }
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
            {/* <Box
              width="100px"
              height="100px"
              round="50px"
              background="white"
              justify="center"
              align="center"
              style={{ minWidth: 100, minHeight: 100 }}
              overflow="hidden"
            > */}
            <div className="banner_avatar">
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
              </div>
            {/* </Box> */}
            <Box>
              <div className="banner_title">
                  {this.state.channel ?.name}
              </div>
              <Box 
                margin={{top: "10px"}}
                style={{width: "300px"}}
                direction="row"
                gap="25px"
              >
                <Box
                  className="follow-button"
                  background={this.state.following ? "#e5e5e5" : "white"}
                  height={(window.innerWidth < 800) ? "25px" : "35px"}
                  style={{
                    border: "1px solid #C2C2C2",
                  }}
                  width="100px"
                  round="xsmall"
                  align="center"
                  justify="center"
                  onClick={this.state.user ? this.onFollowClicked : ()=>{}}
                  focusIndicator={false}
                  hoverIndicator={this.state.user ? true : false}
                  data-tip data-for='not_registered_follow_button_info'
                >
                  <Text 
                    size="15px" 
                    color="grey"
                    alignSelf="center"
                  >
                    {this.state.following ? "Following" : "Follow"}
                  </Text>
                  {!this.state.user && (
                    <ReactTooltip id='not_registered_follow_button_info' place="top" effect="solid">
                      <p>You need to be registered for that.</p>
                    </ReactTooltip>
                  )}

                </Box>
                <ShareButtons
                  channel={this.state.channel}
                  height={(window.innerWidth < 800) ? "25px" : "35px"}
                  onlyShare={true}
                />
              </Box>
              {/*<Text size="24px" color="#999999" weight="bold">
                {this.state.followerCount} followers
                </Text>*/}
            </Box>
          </Box>

          
          <Box direction="row" gap="50px" align="center">
            <MediaQuery minWidth={900}>
              {this.state.user && (
                <ApplyToTalkButton 
                  userId={this.state.user.id}
                />
              )}
              {!this.state.user && (
                <ApplyToTalkForm
                  channelId={this.state.channel!.id}
                  channelName={this.state.channel!.name}
                /> 
              )}

              {/* {!(this.state.role == "member" || this.state.role == "owner") && (
              <RequestMembershipButton
                channelId={this.state.channel!.id}
                channelName={this.state.channel!.name}
                user={this.state.user}
              />
              )} */}
            </MediaQuery>

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
                __html: this.state.channel ?.long_description
                  ? this.state.channel ?.long_description
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
      return (
        <Box align="center">
          <img style={{ height: "auto", width: "auto", minWidth: "100%", minHeight: "100%" }} id="background-landing"
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
            <div className="overall_channel_box">
                {/* {this.state.streams.length !== 0 && (
                  <ChannelLiveNowCard
                    stream={this.state.streams[0]}
                    colour={this.state.channel!.colour}
                  />
                )} */}


                <Box width="100%" gap="20px" margin={{top: "-20px"}}>
                  {/* <Box direction="row" gap="45vw">
                    {this.state.role == "member" && (
                      <Box
                        width="20vw"
                        height="40px"
                        justify="center"
                        align="center"
                        pad="small"
                        round="xsmall"
                        background="#D3F930"
                      >
                        <Text size="16px" weight="bold">
                          You are a member
                        </Text>
                      </Box>
                    )}
                    </Box>  */}

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
                      {this.state.currentTalks.map((talk: Talk) => (
                        <ChannelPageTalkCard
                          talk={talk}
                          user={this.state.user}
                          admin={false}
                          width="31.5%"
                          isCurrent={true}
                          following={this.state.following}
                        />
                      ))}
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
                  {/* <Box
                    direction="row"
                    width="100%"
                    wrap
                    // justify="between"
                    gap="1.5%"
                    margin={{ top: "10px" }}
                  > */}
                  <div className="talk_cards_outer_box">
                    {this.state.pastTalks.map((talk: Talk) => (
                      <PastTalkCard
                        width={(window.innerWidth < 800) ? "95%" : "31.5%"}
                        talk={talk}
                        margin={{ bottom: "medium" }}
                        user={this.state.user}
                        // show={talk.id === this.state.showTalkId}
                      />
                    ))}
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
