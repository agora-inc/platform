import React, { Component, useEffect, useState } from "react";
import { Box, Text, Button, Layer, Image } from "grommet";
import { Talk, TalkService } from "../../Services/TalkService";
import { ChannelService } from "../../Services/ChannelService";
import { User } from "../../Services/UserService";
import { Link } from "react-router-dom";
import {
  Calendar,
  Workshop,
  UserExpert,
  LinkNext,
  FormNextLink,
} from "grommet-icons";
import "../../Styles/talk-card.css";
import MediaQuery from "react-responsive";
import { textToLatex } from "../Core/LatexRendering";
import MobileTalkCardOverlay from "../Talks/Talkcard/MobileTalkCardOverlay";
import { FooterOverlay } from "./Talkcard/FooterOverlay";
import MoraStreamLogo from "../../assets/general/mora_simplified_logo.jpeg";
import { useStore } from "../../store";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  talk: Talk;
  width?: string;
  isCurrent?: boolean;
  substituteTbdTba?: boolean;
  addPicture?: boolean;
}

export const TalkCard = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [showShadow, setShowShadow] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [available, setAvailable] = useState(true);
  const [role, setRole] = useState("none");
  const [processedTalk, setProcessedTalk] = useState(
    TalkService.polishTalkData(
      props.talk,
      props.substituteTbdTba ? props.substituteTbdTba : true,
      props.addPicture ? props.addPicture : true
    )
  );

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchRoleInChannel();
    checkIfAvailableAndRegistered();
  }, []);

  const fetchRoleInChannel = async () => {
    const token = await getAccessTokenSilently();
    if (user !== null) {
      ChannelService.getRoleInChannel(
        user.id,
        processedTalk.channel_id,
        (role: "none" | "owner" | "member" | "follower") => {
          setRole(role);
        },
        token
      );
    }
  };

  // method here for mobile
  const checkIfAvailableAndRegistered = async () => {
    if (user) {
      const token = await getAccessTokenSilently();
      TalkService.isAvailableToUser(
        user.id,
        processedTalk.id,
        (available: boolean) => {
          setAvailable(available);
          if (available) {
            checkIfRegistered();
          }
        },
        token
      );
    } else {
      setAvailable(
        processedTalk.visibility === "Everybody" ||
          processedTalk.visibility === null
      );
    }
  };

  // method here for mobile
  const checkIfRegistered = async () => {
    if (user) {
      const token = await getAccessTokenSilently();
      TalkService.registrationStatusForTalk(
        processedTalk.id,
        user.id,
        (status: string) => {
          setRegistered(status === "accepted");
          setRegistrationStatus(status);
        },
        token
      );
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    const dateStr = date.toDateString().slice(0, -4);
    const timeStr = date.toTimeString().slice(0, 5);
    return `${dateStr} ${timeStr}`;
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

  const getTimeRemaining = (): string => {
    const end = new Date(processedTalk.end_date);
    const now = new Date();
    let deltaMin = Math.floor((end.valueOf() - now.valueOf()) / (60 * 1000));
    let message = deltaMin < 0 ? "Finished " : "Finishing in ";
    const suffix = deltaMin < 0 ? " ago" : "";
    deltaMin = Math.abs(deltaMin);

    let hours = Math.floor(deltaMin / 60);
    let minutes = Math.floor(deltaMin % 60);
    if (hours > 0) {
      message += `${hours}h `;
    }
    if (minutes > 0) {
      message += `${minutes}m `;
    }
    return message + suffix;
  };

  const toggleModal = () => {
    // track click of the event
    if (!showModal) {
      TalkService.increaseViewCountForTalk(processedTalk.id, () => {});
    }
    // toggle Modal
    setShowModal(!showModal);
  };

  // method here for mobile
  const register = () => {
    // user &&
    //   TalkService.registerForTalk(
    //     processedTalk.id,
    //     user.id,
    //     () => {
    //       // toggleModal();
    //       checkIfRegistered();
    //       setState({
    //         showShadow: false,
    //       });
    //     }
    //   );
  };

  // method here for mobile
  const unregister = () => {
    // user &&
    //   TalkService.unRegisterForTalk(
    //     processedTalk.id,
    //     user.id,
    //     () => {
    //       // toggleModal();
    //       checkIfRegistered();
    //       setState({
    //         showShadow: false,
    //       });
    //     }
    //   );
  };

  const getSpeakerPhotoUrl = (): string | undefined => {
    return TalkService.getSpeakerPhoto(processedTalk.id);
  };

  // method here for mobile
  const onClick = () => {
    if (registered) {
      unregister();
    } else {
      register();
    }
  };

  const renderMobileView = window.innerWidth < 800;

  return (
    <Box
      className="talk_card_box_1"
      focusIndicator={false}
      height="100%"
      style={{
        maxHeight: renderMobileView && showModal ? "600px" : "180px",
        position: "relative",
        width: props.width ? props.width : "32%",
      }}
    >
      <Box
        onMouseEnter={() => setShowShadow(true)}
        onMouseLeave={() => {
          if (!showModal) {
            setShowShadow(false);
          }
        }}
        onClick={toggleModal}
        height="180px"
        width="100%"
        background="white"
        round="xsmall"
        justify="between"
        gap="10px"
        overflow="hidden"
      >
        <Box height="100%" pad="10px">
          <Box
            direction="column"
            width={processedTalk.has_speaker_photo === 1 ? "65%" : "80%"}
            margin={{ bottom: "10px" }}
          >
            <Box
              direction="row"
              gap="xsmall"
              align="center"
              style={{ height: "45px" }}
              margin={{ bottom: "15px" }}
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
                {!processedTalk.has_avatar && (
                  <img src={MoraStreamLogo} height={36} width={36} />
                )}
                {!!processedTalk.has_avatar && (
                  <img
                    src={ChannelService.getAvatar(processedTalk.channel_id)}
                    height={30}
                    width={30}
                  />
                )}
              </Box>
              <Text weight="bold" size="14px" color="color3">
                {processedTalk.channel_name}
              </Text>
            </Box>

            <Text
              size="14px"
              color="color1"
              weight="bold"
              style={{ minHeight: "60px", overflow: "auto" }}
            >
              {textToLatex(processedTalk.name)}
            </Text>
          </Box>
          {processedTalk.has_speaker_photo === 1 && (
            <Box width="40%">
              <Image
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  aspectRatio: "3/2",
                }}
                src={getSpeakerPhotoUrl()}
                width="30%"
              />
            </Box>
          )}
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
              {processedTalk.talk_speaker ? processedTalk.talk_speaker : "TBA"}
            </Text>
          </Box>
          <Box direction="row" gap="small">
            <Calendar size="14px" />
            <Box direction="row" width="100%">
              {props.isCurrent && (
                <Text
                  size="16px"
                  color="#5454A0"
                  weight="bold"
                  style={{ height: "20px", fontStyle: "normal" }}
                >
                  {getTimeRemaining()}
                </Text>
              )}
              {!props.isCurrent && (
                <Text
                  size="14px"
                  color="black"
                  style={{ height: "20px", fontStyle: "normal" }}
                >
                  {formatDate(processedTalk.date)}
                </Text>
              )}
            </Box>
            {processedTalk.card_visibility === "Members only" && (
              <Box
                round="xsmall"
                background="#EAF1F1"
                pad="xsmall"
                justify="center"
                align="center"
                width="160px"
              >
                <Text size="12px">member-only</Text>
              </Box>
            )}
            {/*processedTalk.card_visibility !== "Members only" && processedTalk.visibility === "Members only" && 
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
        </Box>
      </Box>
      {showShadow && (
        <Box
          height="180px"
          width="100%"
          round="xsmall"
          style={{
            zIndex: -1,
            position: "absolute",
            top: 8,
            left: 8,
            opacity: 0.8,
          }}
          background="color1"
        ></Box>
      )}
      {showModal && (
        <>
          {/* //
        // A. DESKTOP OVERLAY (HACK)
        // */}
          <MediaQuery minDeviceWidth={800}>
            <Layer
              onEsc={() => {
                toggleModal();
                setShowShadow(false);
              }}
              onClickOutside={() => {
                toggleModal();
                setShowShadow(false);
              }}
              modal
              responsive
              animation="fadeIn"
              style={{
                width: 640,
                height: registered ? 640 : 540,
                borderRadius: 15,
                overflow: "hidden",
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
                  <Box
                    direction="row"
                    gap="xsmall"
                    style={{ minHeight: "40px" }}
                  >
                    <Link
                      className="channel"
                      to={`/${processedTalk.channel_name}`}
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
                              processedTalk.channel_id
                            )}
                            height={30}
                            width={30}
                          />
                        </Box>
                        <Box justify="between">
                          <Text weight="bold" size="16px" color="color3">
                            {processedTalk.channel_name}
                          </Text>
                        </Box>
                      </Box>
                    </Link>
                  </Box>
                  <Text
                    weight="bold"
                    size="18px"
                    color="color1"
                    style={{
                      minHeight: "50px",
                      maxHeight: "120px",
                      overflowY: "auto",
                    }}
                    margin={{ bottom: "20px", top: "10px" }}
                  >
                    {textToLatex(processedTalk.name)}
                  </Text>

                  {processedTalk.talk_speaker_url && (
                    <a href={processedTalk.talk_speaker_url} target="_blank">
                      <Box direction="row" pad={{ left: "6px", top: "4px" }}>
                        <UserExpert size="16px" />
                        <Text
                          size="16px"
                          color="black"
                          style={{
                            height: "24px",
                            overflow: "auto",
                            fontStyle: "italic",
                          }}
                        >
                          {processedTalk.talk_speaker
                            ? processedTalk.talk_speaker
                            : "TBA"}
                        </Text>
                      </Box>
                    </a>
                  )}

                  {!processedTalk.talk_speaker_url && (
                    <Box direction="row" gap="small">
                      <UserExpert size="16px" />
                      <Text
                        size="16px"
                        color="black"
                        style={{
                          height: "30px",
                          overflow: "auto",
                          fontStyle: "italic",
                        }}
                        margin={{ bottom: "10px" }}
                      >
                        {processedTalk.talk_speaker
                          ? processedTalk.talk_speaker
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
                  >
                    {processedTalk.description
                      .split("\n")
                      .map((item, i) => textToLatex(item))}
                  </Box>
                </Box>
              </Box>
              <FooterOverlay
                talk={processedTalk}
                role={role}
                available={available}
                registered={registered}
                registrationStatus={registrationStatus}
                isSharingPage={false}
              />
            </Layer>
          </MediaQuery>

          {/* //
        // B. MOBILE OVERLAY (HACK; copy-pasting code is ugly (R))
        // */}
          <MediaQuery maxDeviceWidth={800}>
            <MobileTalkCardOverlay
              talk={processedTalk}
              pastOrFutureTalk="future"
              registered={registered}
              registrationStatus={registrationStatus}
            />
          </MediaQuery>
        </>
      )}
    </Box>
  );
};
