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
import VideoCard from "../Components/Streaming/VideoCard";
import ChannelLiveNowCard from "../Components/Channel/ChannelLiveNowCard";
import "../Styles/channel-page.css";
import PastTalkCard from "../Components/Talks/PastTalkCard";
import AboutUs from "../Components/Channel/AboutUs";
import { baseApiUrl } from "../config";
import { CSSProperties } from "styled-components";
import { FormDown, FormUp } from "grommet-icons";

interface Props {
  location: { pathname: string };
  streamId: number;
}

interface State {
  channel: Channel | null;
  admin: boolean;
  loading: boolean;
  streams: Stream[];
  talks: Talk[];
  pastTalks: Talk[];
  totalNumberOfpastTalks: number;
  followerCount: number;
  following: boolean;
  user: User | null;
  bannerExtended: boolean;
}

export default class ChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channel: null,
      admin: false,
      loading: true,
      streams: [],
      talks: [],
      pastTalks: [],
      totalNumberOfpastTalks: 0,
      followerCount: 0,
      following: false,
      user: UserService.getCurrentUser(),
      bannerExtended: true,
    };
  }

  componentWillMount() {
    window.addEventListener("scroll", this.handleScroll, true);
    this.fetchChannel();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

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
    console.log(this.props.location.pathname.split("/"));
    ChannelService.getChannelByName(
      this.props.location.pathname.split("/")[1],
      (channel: Channel) => {
        let user = UserService.getCurrentUser();
        if (user === null) {
          this.setState(
            { channel: channel, admin: false, loading: false },
            () => {
              this.fetchStreams();
              this.fetchPastTalks();
              // this.fetchVideos();
              this.fetchTalks();
              this.fetchFollowerCount();
              // this.fetchViewCount();
            }
          );
          return;
        }
        ChannelService.isUserInChannel(
          user.id,
          channel.id,
          ["owner", "member"],
          (res: boolean) => {
            this.setState(
              { channel: channel, admin: res, loading: false },
              () => {
                this.fetchStreams();
                this.fetchPastTalks();
                // this.fetchVideos();
                this.fetchTalks();
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

  fetchTalks = () => {
    TalkService.getFutureTalksForChannel(
      this.state.channel!.id,
      (talks: Talk[]) => {
        this.setState({ talks });
      }
    );
  };

  fetchPastTalks = () => {
    TalkService.getPastTalksForChannel(
      this.state.channel!.id,
      (data: { talks: Talk[]; count: number }) => {
        this.setState({
          pastTalks: data.talks,
          totalNumberOfpastTalks: data.count,
        });
      }
    );
  };

  checkIfFollowing = () => {
    ChannelService.isUserInChannel(
      this.state.user!.id,
      this.state.channel!.id,
      ["follower"],
      (following: boolean) => {
        this.setState({ following });
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
    let background = this.state.channel?.has_cover
      ? `url(${baseApiUrl}/channels/cover?channelId=${this.state.channel.id})`
      : this.state.channel?.colour;

    let border = this.state.channel?.has_cover
      ? `8px solid ${this.state.channel.colour}`
      : "none";

    return {
      width: "100%",
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      background: background,
      padding: 20,
      border: border,
    };
  };

  toggleBanner = () => {
    this.setState({ bannerExtended: !this.state.bannerExtended });
  };

  banner = () => {
    return (
      <Box width="100%" background="white" round="10px">
        <Box
          direction="row"
          justify="between"
          style={this.getCoverBoxStyle()}
          height="312px"
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
              {!this.state.channel!.has_avatar && (
                <Identicon string={this.state.channel!.name} size={50} />
              )}
              {!!this.state.channel!.has_avatar && (
                <img
                  src={ChannelService.getAvatar(this.state.channel!.id)}
                  height={100}
                  width={100}
                />
              )}
            </Box>
            <Box>
              <Text size="30px" color="black" weight="bold">
                {this.state.channel?.name}
              </Text>
              <Text size="24px" color="#999999" weight="bold">
                {this.state.followerCount} followers
              </Text>
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
            {this.state.channel?.long_description}
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
          {this.state.admin ? (
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
                {this.banner()}
                {/* <AboutUs text={this.state.channel?.long_description} /> */}
                {this.state.talks.length !== 0 && (
                  <Box gap="5px">
                    <Text
                      size="24px"
                      weight="bold"
                      color="black"
                      margin={{ bottom: "10px" }}
                    >
                      Upcoming talks
                    </Text>
                    <ChannelPageTalkList
                      talks={this.state.talks}
                      channelId={this.state.channel!.id}
                      user={this.state.user}
                      admin={false}
                    />
                  </Box>
                )}
                {this.state.pastTalks.length !== 0 && (
                  <Box gap="5px">
                    <Text size="24px" weight="bold" color="black">
                      Past talks
                    </Text>
                    <Box
                      direction="row"
                      width="100%"
                      wrap
                      justify="between"
                      margin={{ top: "10px" }}
                    >
                      {this.state.pastTalks.map((talk: Talk) => (
                        <PastTalkCard
                          width="31.5%"
                          talk={talk}
                          margin={{ bottom: "medium" }}
                          user={this.state.user}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      );
    }
  }
}
