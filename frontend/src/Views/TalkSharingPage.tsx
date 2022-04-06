import React, { Component, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Box, Text, Image } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import { Talk, TalkService } from "../Services/TalkService";
import { ChannelSubscriptionService } from "../Services/ChannelSubscriptionService";
import { StreamingProductService } from "../Services/StreamingProductService";
import { Link } from "react-router-dom";
import "../Styles/channel-page.css";
import { Calendar, Workshop, UserExpert } from "grommet-icons";
import Countdown from "../Components/Talks/Countdown";
import { FooterOverlay } from "../Components/Talks/Talkcard/FooterOverlay";
import CoffeeHangoutRoom from "../Components/Talks/TalkSharingPage/CoffeeHangoutRoom";
import { textToLatex } from "../Components/Core/LatexRendering";
import { Helmet } from "react-helmet";
import { useStore } from "../store";
import { useAuth0 } from "@auth0/auth0-react";

const getTalkIdFromUrl = (pathname: string): number => {
  let talkId = Number(pathname.split("/")[2]);
  if (!talkId) {
    return -1;
  }
  return Number(talkId);
};

const nullTalk: Talk = {
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
  audience_level: "All",
  has_speaker_photo: 0,
};

interface Props {
  location: { pathname: string };
  streamId: number;
}

type Role = "none" | "owner" | "member" | "follower";

export const TalkSharingPage = (props: Props) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [role, setRole] = useState<Role>("none");
  const [talk, setTalk] = useState(nullTalk);
  const [available, setAvailable] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [showTalkId, setShowTalkId] = useState(
    getTalkIdFromUrl(props.location.pathname)
  );
  const [allPlansId, setAllPlansId] = useState<number[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<string[]>([]);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    let scroll_element = window.document.querySelector(
      // TODO: add a proper id to the element + use that
      ".StyledGrommet-sc-19lkkz7-0"
    );
    (scroll_element as HTMLInputElement).scrollTo(0, 0);
    fetchAll();
  }, []);

  useEffect(() => {
    fetchUserInfo();
    getChannelSubscriptions();
  }, [talk]);

  const fetchAll = () => {
    let talkId = getTalkIdFromUrl(props.location.pathname);
    TalkService.getTalkById(talkId, (talk: Talk) => {
      setTalk(talk);
    });
  };

  const fetchUserInfo = async () => {
    if (user == null) {
      return;
    }
    const token = await getAccessTokenSilently();
    ChannelService.getRoleInChannel(user.id, talk.channel_id, setRole, token);

    TalkService.isAvailableToUser(user.id, talk.id, setAvailable, token);

    TalkService.registrationStatusForTalk(
      talk.id,
      user.id,
      (status: string) => {
        setRegistered(status === "accepted");
        setRegistrationStatus(status);
      },
      token
    );
  };

  const getChannelSubscriptions = () => {
    ChannelSubscriptionService.getAllActiveSubscriptionsForChannel(
      talk.channel_id,
      (plans: number[]) => {
        setSubscriptionPlans(getChannelSubscriptionTiers(plans));
      }
    );
  };

  const getChannelSubscriptionTiers = (allPlansId: number[]) => {
    let tiers: string[] = [];
    allPlansId.map((id: number) => {
      StreamingProductService.getStreamingProductById(id, (product: any) => {
        tiers.push(product.tier);
      });
    });
    return tiers;
  };

  const getSpeakerPhotoUrl = (): string | undefined => {
    return TalkService.getSpeakerPhoto(talk.id);
  };

  const formatDateFull = (s: string, e: string) => {
    const start = new Date(s);
    const dateStartStr = start.toDateString().slice(0, -4);
    const timeStartStr = start.toTimeString().slice(0, 5);
    const end = new Date(e);
    const dateEndStr = end.toDateString().slice(0, -4);
    const timeEndStr = end.toTimeString().slice(0, 5);
    return `${dateStartStr} ${timeStartStr} - ${timeEndStr} `;
  };

  const renderMobileView = window.innerWidth < 800;

  return (
    <>
      <Helmet>
        <title>{talk.name}</title>
        <meta name="description" content={talk.description} />
        <meta property="og:title" content={talk.name} />
        <meta property="og:description" content={talk.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={document.location.href} />
        {/* <meta property="og:image" content={ChannelService.getAvatar(talk.channel_id)} /> */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={talk.name} />
        <meta name="twitter:description" content={talk.description} />
      </Helmet>

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

      <Box /* this element is responsible for scrolling */
        margin={{
          top: "10vh",
          left: "20px",
          right: "20px",
        }}
        align="center"
      >
        <Box
          width={renderMobileView ? "100vw" : "60vw"}
          margin={{ left: "20px", right: "20px", bottom: "30px" }}
        >
          <Box direction="row" width="100%">
            <Box
              direction="column"
              width={talk.has_speaker_photo === 1 ? "75%" : "100%"}
            >
              <Box direction="row" gap="xsmall" style={{ minHeight: "40px" }}>
                <Link
                  className="channel"
                  to={`/${talk.channel_name}`}
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
                        src={ChannelService.getAvatar(talk.channel_id)}
                        height={30}
                        width={30}
                      />
                    </Box>
                    <Box justify="between">
                      <Text weight="bold" size="18px" color="grey">
                        {talk.channel_name}
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
                {talk.name}
              </Text>

              {talk.talk_speaker_url && (
                <a href={talk.talk_speaker_url} target="_blank">
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
                      {talk.talk_speaker ? talk.talk_speaker : "TBA"}
                    </Text>
                  </Box>
                </a>
              )}

              {!talk.talk_speaker_url && (
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
                    {talk.talk_speaker ? talk.talk_speaker : "TBA"}
                  </Text>
                </Box>
              )}
            </Box>

            {talk.has_speaker_photo === 1 && (
              <Box width="25%" align="end">
                <Image
                  style={{
                    position: "relative",
                    top: 10,
                    right: 0,
                    aspectRatio: "3/2",
                  }}
                  src={getSpeakerPhotoUrl()}
                  width="200px"
                />
              </Box>
            )}
          </Box>

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
            {talk.description.split("\n").map((item, i) => textToLatex(item))}
          </Text>

          <FooterOverlay
            talk={talk}
            role={role}
            available={available}
            registered={registered}
            registrationStatus={registrationStatus}
            isSharingPage={true}
          />

          <CoffeeHangoutRoom
            talk={talk}
            disabled={
              !subscriptionPlans.includes("tier1") &&
              subscriptionPlans.includes("tier2")
            }
          />
        </Box>
      </Box>
    </>
  );
};
