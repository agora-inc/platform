import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Box, Text } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import { Video, VideoService } from "../Services/VideoService";
import { Stream, StreamService } from "../Services/StreamService";
import { Talk, TalkService } from "../Services/TalkService";
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
import { CSSProperties } from "styled-components";
import { FormDown, FormUp } from "grommet-icons";
import ApplyToTalkForm from "../Components/Talks/ApplyToTalkForm";

interface Props {
  location: { pathname: string };
  streamId: number;
}

interface State {
  channel: Channel | null;
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
}

export default class ChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channel: null,
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
    };
  }

  componentWillMount() {
    window.addEventListener("scroll", this.handleScroll, true);
    this.fetchChannel();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

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
    } else {
      ChannelService.removeUserFromChannel(
        this.state.user!.id,
        this.state.channel!.id,
        () => {
          this.fetchFollowerCount();
        }
      );
    }
    this.setState({ following: !this.state.following });
  };

  getCoverBoxStyle = (): CSSProperties => {
    let current_time = Math.floor(new Date().getTime() / 5000);
    let background = this.state.channel ?.id
      ? `url(${baseApiUrl}/channels/cover?channelId=${this.state.channel.id}&ts=` +
      current_time +
      `)`
      // HACK: we add the new time at the end of the URL to avoid caching; 
      // we divide time by value such that all block of requested image have 
      // the same name (important for the name to be the same for the styling).
      : this.state.channel ?.colour;

    let border = "none";

    return {
      width: "75vw",
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      background: background,
      backgroundSize: "75vw 25vw",
      padding: 20,
      border: border,
    };
  };

  toggleBanner = () => {
    this.setState({ bannerExtended: !this.state.bannerExtended });
  };

  banner = () => {
    return (
      <Box width="75vw" background="white" round="10px">
        <Box
          direction="row"
          justify="between"
          style={this.getCoverBoxStyle()}
          height="25vw"
        />
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
              {/*<Text size="24px" color="#999999" weight="bold">
                {this.state.followerCount} followers
                </Text>*/}
            </Box>
          </Box>
          <Box direction="row" gap="xsmall" align="center">
            {this.state.user && (
              <Box
                className="follow-button"
                background={this.state.following ? "#e5e5e5" : "white"}
                height="45px"
                width="130px"
                pad="small"
                round="small"
                style={{ border: "2.5px solid black" }}
                align="center"
                justify="center"
                onClick={this.onFollowClicked}
                focusIndicator={false}
              >
                <Text weight="bold" color="black">
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
    if (this.state.loading) {
      return (
        <Box width="100~%" height="100%" justify="center" align="center">
          <Loading color="black" size={50} />
        </Box>
      );
    } else {
      return (
        <Box>
          {this.shouldRedirect() ? (
            <Redirect
              to={{
                pathname: this.props.location.pathname + "/manage",
                state: { channel: this.state.channel },
              }}
            />
          ) : (
              <Box
                width="100%"
                height="100%"
                align="center"
                margin={{ top: "100px" }}
              >
                {this.state.streams.length !== 0 && (
                  <ChannelLiveNowCard
                    stream={this.state.streams[0]}
                    colour={this.state.channel!.colour}
                  />
                )}
                <Box width="75%" align="start" gap="20px">
                  <Box direction="row" gap="45vw">
                    <ApplyToTalkForm
                      channelId={this.state.channel!.id}
                      channelName={this.state.channel!.name}
                    />
                    {this.state.role == "member" && (
                      <Box
                        width="20vw"
                        height="40px"
                        justify="center"
                        align="center"
                        pad="small"
                        round="xsmall"
                        background="#F3EACE"
                      >
                        <Text size="18px" weight="bold" color="grey">
                          You are a member
                        </Text>
                      </Box>
                    )}
                  </Box>

                  {this.banner()}
                  {/* <AboutUs text={this.state.channel?.long_description} /> */}
                  {this.state.currentTalks.length > 0 && (
                    <Box width="100%">
                      <Text
                        size="28px"
                        weight="bold"
                        color="black"
                        margin={{ top: "40px", bottom: "24px" }}
                      >
                        {`Happening now`}
                      </Text>
                      {this.state.currentTalks.map((talk: Talk) => (
                        <ChannelPageTalkCard
                          talk={talk}
                          user={this.state.user}
                          admin={false}
                          width="31.5%"
                          isCurrent={true}
                        />
                      ))}
                    </Box>
                  )}
                  <Text
                    size="28px"
                    weight="bold"
                    color="black"
                    margin={{ bottom: "10px" }}
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
                      <Text size="18px" weight="bold" color="grey">
                        There are no upcoming talks in{" "}
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
                      />
                    </Box>
                  )}
                  {this.state.pastTalks.length !== 0 && (
                    <Text
                      size="28px"
                      weight="bold"
                      color="black"
                      margin={{ top: "40px" }}
                    >{`Past talks`}</Text>
                  )}
                  <Box
                    direction="row"
                    width="100%"
                    wrap
                    // justify="between"
                    gap="1.5%"
                    margin={{ top: "10px" }}
                  >
                    {this.state.pastTalks.map((talk: Talk) => (
                      <PastTalkCard
                        width="31.5%"
                        talk={talk}
                        margin={{ bottom: "medium" }}
                        user={this.state.user}
                        show={talk.id === this.state.showTalkId}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
        </Box>
      );
    }
  }
}
