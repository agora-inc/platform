import React, { Component, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Box, Text, Image } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import { Stream, StreamService } from "../Services/StreamService";
import { Talk, TalkService } from "../Services/TalkService";
import Loading from "../Components/Core/Loading";
import ChannelPageTalkList from "../Components/Channel/ChannelPageTalkList";
import { ChannelPageTalkCard } from "../Components/Channel/ChannelPageTalkCard";
import "../Styles/channel-page.css";
import { PastTalkCard } from "../Components/Talks/PastTalkCard";
import { CSSProperties } from "styled-components";
import { FormDown, FormUp } from "grommet-icons";
import ApplyToTalkForm from "../Components/Talks/ApplyToTalkForm";
import { Topic, TopicService } from "../Services/TopicService";
import ShareButtons from ".././Components/Core/ShareButtons";
import MediaQuery from "react-responsive";
import { baseApiUrl } from "../config";
import ReactTooltip from "react-tooltip";
import { useStore } from "../store";
import { useAuth0 } from "@auth0/auth0-react";

// NOTE:
//      -"following" feature globally commented
//      -"viewer count" feature commented for the public (only available to admin)

type MembershipApplication = {
  fullName: string;
  position: string;
  institution: string;
  email: string;
  personalHomepage: string;
};

const emptyApplication: MembershipApplication = {
  fullName: "",
  position: "",
  institution: "",
  email: "",
  personalHomepage: "",
};

const getTalkIdFromUrl = (): number => {
  const urlParams = new URLSearchParams(window.location.search);
  const talkId = urlParams.get("talkId");
  if (!talkId) {
    return -1;
  }
  return Number(talkId);
};

interface Props {
  location: { pathname: string };
  streamId: number;
  channel?: Channel;
}

export const ChannelPage = (props: Props) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [role, setRole] = useState<"none" | "owner" | "member" | "follower">(
    "none"
  );
  const [loading, setLoading] = useState(false);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [talks, setTalks] = useState<Talk[]>([]);
  const [currentTalks, setCurrentTalks] = useState<Talk[]>([]);
  const [pastTalks, setPastTalks] = useState<Talk[]>([]);
  const [totalNumberOfPastTalks, setTotalNumberOfPastTalks] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [following, setFollowing] = useState(false);
  const [bannerExtended, setBannerExtended] = useState(true);
  const [showTalkId, setShowTalkId] = useState(getTalkIdFromUrl());
  const [membershipApplicatedFetched, setMembershipApplicatedFetched] =
    useState(false);
  const [membershipApplication, setMembershipApplication] =
    useState(emptyApplication);
  const [topics, setTopics] = useState<Topic[]>(
    props.channel ? props.channel.topics : []
  );
  const [topicId, setTopicId] = useState(
    props.channel?.topics[0].id ? props.channel?.topics[0].id : 0
  );
  const [field, setField] = useState("");

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, true);
    fetchChannel();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (channel) {
      ChannelService.getChannelTopic(channel.id, setTopicId);
      fetchStreams();
      fetchPastTalks();
      fetchFutureTalks();
      fetchCurrentTalks();
      fetchFollowerCount();
      storeUserData();
      checkIfFollowing();
    }
  }, [channel]);

  useEffect(() => {
    TopicService.getFieldFromId(topicId, setField);
  }, [topicId]);

  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && pastTalks.length !== totalNumberOfPastTalks) {
      fetchPastTalks();
    }
  };

  const fetchChannel = async () => {
    const token = await getAccessTokenSilently();
    ChannelService.getChannelByName(
      props.location.pathname.split("/")[1],
      (channel: Channel) => {
        setChannel(channel);
        setRole("none");
        if (user) {
          ChannelService.getRoleInChannel(user.id, channel.id, setRole, token);
        }
        setLoading(false);
      }
    );
  };

  const fetchStreams = () => {
    channel && StreamService.getStreamsForChannel(channel.id, setStreams);
  };

  const fetchFollowerCount = () => {
    channel &&
      ChannelService.getFollowerCountForChannel(channel.id, setFollowerCount);
  };

  // fetchViewCount = () => {
  //   ChannelService.getViewCountForChannel(
  //     channel!.id,
  //     (viewerCount: number) => {
  //       setState({ viewerCount });
  //     }
  //   );
  // };

  const fetchFutureTalks = () => {
    channel &&
      TalkService.getAvailableFutureTalksForChannel(
        channel.id,
        user ? user.id : null,
        setTalks
      );
  };

  const fetchCurrentTalks = () => {
    channel &&
      TalkService.getAvailableCurrentTalksForChannel(
        channel.id,
        user ? user.id : null,
        setCurrentTalks
      );
  };

  const fetchPastTalks = () => {
    channel &&
      TalkService.getAvailablePastTalksForChannel(
        channel!.id,
        user ? user.id : null,
        setPastTalks
      );
  };

  const checkIfFollowing = async () => {
    const token = await getAccessTokenSilently();
    user &&
      channel &&
      ChannelService.getRoleInChannel(
        user.id,
        channel.id,
        (role: string) => {
          setFollowing(role === "follower");
        },
        token
      );
  };

  const storeUserData = () => {
    channel && ChannelService.increaseViewCountForChannel(channel.id, () => {});
  };

  const shouldRedirect = (): boolean => {
    return role === "owner";
  };

  const toggleFollow = () => {
    setFollowing(!following);
  };

  const onApplyMembershipClicked = () => {};

  const onFollowClicked = async () => {
    if (!user || !channel) {
      return;
    }
    const token = await getAccessTokenSilently();
    if (!following) {
      ChannelService.addUserToChannel(
        user.id,
        channel.id,
        "follower",
        () => {
          fetchFollowerCount();
          setRole("follower");
        },
        token
      );
    } else {
      ChannelService.removeUserFromChannel(
        user.id,
        channel.id,
        () => {
          fetchFollowerCount();
          if (role !== "member") {
            setRole("none");
          }
        },
        token
      );
    }
    toggleFollow();
  };

  const getImageUrl = (): string | undefined => {
    let current_time = Math.floor(new Date().getTime() / 5000);
    let imageUrl = channel?.id
      ? `${baseApiUrl}/channels/cover?channelId=${channel.id}&ts=` +
        current_time
      : // HACK: we add the new time at the end of the URL to avoid caching;
        // we divide time by value such that all block of requested image have
        // the same name (important for the name to be the same for the styling).
        undefined;
    return imageUrl;
  };

  const getCoverBoxStyle = (): CSSProperties => {
    let background = channel?.colour;
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

  const toggleBanner = () => {
    setBannerExtended(!bannerExtended);
  };

  const fetchChannelTopic = () => {
    if (channel && topics) {
      ChannelService.getChannelTopic(channel.id, setTopicId);
      return topicId;
    }
  };

  const banner = () => {
    return (
      <Box width="75vw" background="white" round="10px">
        <Box direction="row" justify="between" height="25vw">
          <Image src={getImageUrl()} style={getCoverBoxStyle()} />
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
              {
                <img
                  src={ChannelService.getAvatar(
                    channel!.id,
                    Math.floor(new Date().getTime() / 45000)
                  )}
                  // HACK: we had the ts argument to prevent from caching.
                  height={100}
                  width={100}
                />
              }
            </div>
            {/* </Box> */}
            <Box>
              <div className="banner_title">{channel?.name}</div>
              <Box
                margin={{ top: "10px" }}
                style={{ width: "300px" }}
                direction="column"
              >
                <ShareButtons
                  channel={channel}
                  height={window.innerWidth < 800 ? "25px" : "35px"}
                />
              </Box>
              {/*<Text size="24px" color="#999999" weight="bold">
                  {followerCount} followers
                  </Text>*/}
            </Box>
          </Box>

          <Box direction="row" gap="xsmall" align="center">
            <MediaQuery minWidth={900}>
              <ApplyToTalkForm
                channelId={channel!.id}
                channelName={channel!.name}
              />
              {/* {!(role == "member" || role == "owner") && (
              <RequestMembershipButton
                channelId={channel!.id}
                channelName={channel!.name}
                user={user}
              />
              )} */}
            </MediaQuery>

            <Box
              className="follow-button"
              pad={{ bottom: "6px", top: "6px", left: "3px", right: "3px" }}
              background={following ? "#e5e5e5" : "white"}
              height="30px"
              style={{
                border: "1px solid #C2C2C2",
              }}
              width="10vw"
              round="xsmall"
              align="center"
              justify="center"
              onClick={user ? onFollowClicked : () => {}}
              focusIndicator={false}
              hoverIndicator={user ? true : false}
              data-tip
              data-for="not_registered_follow_button_info"
            >
              <Text size="14px" color="grey" alignSelf="center">
                {following ? "Following" : "Follow"}
              </Text>
              {!user && (
                <ReactTooltip
                  id="not_registered_follow_button_info"
                  place="top"
                  effect="solid"
                >
                  <p>You need to be registered for that.</p>
                </ReactTooltip>
              )}
            </Box>

            {bannerExtended ? (
              <FormUp
                onClick={toggleBanner}
                size="50px"
                color="black"
                style={{ cursor: "pointer" }}
              />
            ) : (
              <FormDown
                onClick={toggleBanner}
                size="50px"
                color="black"
                style={{ cursor: "pointer" }}
              />
            )}
          </Box>
        </Box>
        {bannerExtended && (
          <Text
            size="14px"
            style={{ textAlign: "justify", fontWeight: 450 }}
            margin={{ horizontal: "16px", bottom: "16px" }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: channel?.long_description
                  ? channel?.long_description
                  : "",
              }}
            />
          </Text>
        )}

        {/*     TODO TO UNCOMMENT THIS: make overlay nice to use on mobile

        <MediaQuery maxWidth={600}>
          <Box direction="column" align="center" alignContent="center" gap = "5px" margin={{bottom: "15px"}}>
            <ApplyToTalkForm
                  channelId={channel!.id}
                  channelName={channel!.name}
                  widthButton={"200px"}
                />
            {!(role == "member" || role == "owner") && (
            <RequestMembershipButton
              channelId={channel!.id}
              channelName={channel!.name}
              user={user}
              widthButton={"200px"}
            />
            )}
          </Box>
        </MediaQuery>  */}
      </Box>
    );
  };

  return loading ? (
    <Box width="100%" height="100%" justify="center" align="center">
      <Loading color="black" size={50} />
    </Box>
  ) : (
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
      {shouldRedirect() ? (
        <Redirect
          to={{
            pathname: props.location.pathname + "/manage",
            state: { channel: channel },
          }}
        />
      ) : (
        <div className="overall_channel_box">
          {/* {streams.length !== 0 && (
                  <ChannelLiveNowCard
                    stream={streams[0]}
                    colour={channel!.colour}
                  />
                )} */}

          <Box width="100%" gap="20px" margin={{ top: "-20px" }}>
            {/* <Box direction="row" gap="45vw">
                    {role == "member" && (
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

            {banner()}
            {/* <AboutUs text={channel?.long_description} /> */}
            {currentTalks.length > 0 && (
              <Box width="100%">
                <Text
                  size="26px"
                  weight="bold"
                  color="color1"
                  margin={{ top: "40px", bottom: "24px" }}
                >
                  {`Happening now 🔴`}
                </Text>
                {currentTalks.map((talk: Talk) => (
                  <ChannelPageTalkCard
                    talk={talk}
                    admin={false}
                    width="31.5%"
                    isCurrent={true}
                    following={following}
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
            {talks.length === 0 && (
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
                  {channel ? channel.name : "this channel"}
                </Text>
              </Box>
            )}
            {talks.length !== 0 && (
              <Box gap="5px" width="100%">
                <ChannelPageTalkList
                  talks={talks}
                  channelId={channel!.id}
                  admin={false}
                  showTalkId={showTalkId}
                  role={role}
                  following={following}
                  callback={toggleFollow}
                />
              </Box>
            )}
            {pastTalks.length !== 0 && (
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
              {pastTalks.map((talk: Talk) => (
                <PastTalkCard
                  width={window.innerWidth < 800 ? "95%" : "31.5%"}
                  talk={talk}
                  margin={{ bottom: "medium" }}
                  // show={talk.id === showTalkId}
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
};
