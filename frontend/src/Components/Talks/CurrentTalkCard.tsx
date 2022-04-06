import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Identicon from "react-identicons";
import { Box, Text, Layer, Image } from "grommet";
import { Calendar, UserExpert } from "grommet-icons";
import { useAuth0 } from "@auth0/auth0-react";

import { Talk, TalkService } from "../../Services/TalkService";
import { ChannelService } from "../../Services/ChannelService";
import Countdown from "./Countdown";
import { LoginButton } from "../Account/LoginButton";
import SignUpButton from "../Account/SignUpButton";
import { textToLatex } from "../Core/LatexRendering";
import "../Styles/all-agoras-page.css";
import { useStore } from "../../store";

interface Props {
  talk: Talk;
  width?: string;
}

export const CurrentTalkCard = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [showShadow, setShowShadow] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [available, setAvailable] = useState(true);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    checkIfAvailableAndRegistered();
  }, []);

  const checkIfAvailableAndRegistered = async () => {
    if (user) {
      const token = await getAccessTokenSilently();
      TalkService.isAvailableToUser(
        user.id,
        props.talk.id,
        (available: boolean) => {
          setAvailable(true);
          available && checkIfRegistered();
        },
        token
      );
    } else {
      setAvailable(
        props.talk.visibility === "Everybody" || props.talk.visibility === null
      );
    }
  };

  const checkIfRegistered = async () => {
    if (user) {
      const token = await getAccessTokenSilently();
      TalkService.registrationStatusForTalk(
        props.talk.id,
        user.id,
        (status: string) => {
          setRegistered(status === "accepted");
          setRegistrationStatus(status);
        },
        token
      );
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    setShowShadow(true);
  };

  const getTimeRemaining = (): string => {
    const end = new Date(props.talk.end_date);
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

  const register = () => {
    // user &&
    //   TalkService.registerForTalk(
    //     props.talk.id,
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

  const unregister = () => {
    // user &&
    //   TalkService.unRegisterForTalk(
    //     props.talk.id,
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
    return TalkService.getSpeakerPhoto(props.talk.id);
  };

  const onClick = () => {
    if (registered) {
      unregister();
    } else {
      register();
    }
  };

  return (
    <Box
      width={props.width ? props.width : "32%"}
      height="180px"
      onClick={() => {
        !showModal && toggleModal();
      }}
      focusIndicator={false}
      style={{ position: "relative" }}
      margin={{ bottom: "small" }}
    >
      <Box
        onMouseEnter={() => setShowShadow(true)}
        onMouseLeave={() => {
          if (!showModal) {
            setShowShadow(false);
          }
        }}
        height="100%"
        width="100%"
        background="white"
        round="xsmall"
        justify="between"
        gap="small"
        overflow="hidden"
      >
        <Box height="100%" pad="10px">
          <Box
            direction="column"
            width={props.talk.has_speaker_photo === 1 ? "65%" : "80%"}
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
                {!props.talk.has_avatar && (
                  <Identicon string={props.talk.channel_name} size={15} />
                )}
                {!!props.talk.has_avatar && (
                  <img
                    src={ChannelService.getAvatar(props.talk.channel_id)}
                    height={30}
                    width={30}
                  />
                )}
              </Box>
              <Text weight="bold" size="14px" color="grey">
                {props.talk.channel_name}
              </Text>
            </Box>

            <Text
              size="14px"
              color="black"
              weight="bold"
              style={{ minHeight: "60px", overflow: "auto" }}
            >
              {props.talk.name}
            </Text>
          </Box>

          {props.talk.has_speaker_photo && (
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
              {props.talk.talk_speaker ? props.talk.talk_speaker : "TBA"}
            </Text>
          </Box>
          <Box direction="row" gap="small">
            <Calendar size="14px" />
            <Box direction="row" width="100%">
              <Text
                size="18px"
                color="#5454A0"
                weight="bold"
                style={{ height: "20px", fontStyle: "normal" }}
              >
                {getTimeRemaining()}
              </Text>
            </Box>
            {props.talk.card_visibility === "Members only" && (
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
          </Box>
        </Box>
      </Box>
      {showShadow && (
        <Box
          height="100%"
          width="100%"
          round="xsmall"
          style={{
            zIndex: -1,
            position: "absolute",
            top: 8,
            left: 8,
            opacity: 0.5,
          }}
          background="#BAD6DB"
        ></Box>
      )}
      {showModal && (
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
            height="100%"
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
                  to={`/${props.talk.channel_name}`}
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
                      {!props.talk.has_avatar && (
                        <Identicon string={props.talk.channel_name} size={30} />
                      )}
                      {!!props.talk.has_avatar && (
                        <img
                          src={ChannelService.getAvatar(props.talk.channel_id)}
                          height={30}
                          width={30}
                        />
                      )}
                    </Box>
                    <Box justify="between">
                      <Text weight="bold" size="18px" color="grey">
                        {props.talk.channel_name}
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
                margin={{ bottom: "20px", top: "10px" }}
              >
                {props.talk.name}
              </Text>

              {props.talk.talk_speaker_url && (
                <a href={props.talk.talk_speaker_url} target="_blank">
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
                      {props.talk.talk_speaker
                        ? props.talk.talk_speaker
                        : "TBA"}
                    </Text>
                  </Box>
                </a>
              )}

              {!props.talk.talk_speaker_url && (
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
                    {props.talk.talk_speaker ? props.talk.talk_speaker : "TBA"}
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
                {props.talk.description
                  .split("\n")
                  .map((item, i) => textToLatex(item))}
              </Box>
            </Box>
            <Box direction="column" gap="small">
              <Box direction="row" gap="small">
                <Calendar size="18px" />
                <Text
                  size="18px"
                  color="#5454A0"
                  weight="bold"
                  style={{ height: "20px", fontStyle: "normal" }}
                >
                  {getTimeRemaining()}
                </Text>
              </Box>
              {registered && (
                <Box margin={{ top: "10px", bottom: "20px" }}>
                  <Countdown talk={props.talk} />
                  <Box
                    focusIndicator={false}
                    background="#FF4040"
                    round="xsmall"
                    pad="xsmall"
                    justify="center"
                    align="center"
                    width="20%"
                    height="35px"
                    onClick={onClick}
                    margin={{ top: "-35px" }}
                    alignSelf="end"
                    hoverIndicator={true}
                  >
                    <Text size="14px" weight="bold">
                      Unregister
                    </Text>
                  </Box>
                </Box>
              )}
              {available && user !== null && !registered && (
                <Box
                  onClick={onClick}
                  background="#0C385B"
                  round="xsmall"
                  pad="xsmall"
                  height="40px"
                  justify="center"
                  align="center"
                  focusIndicator={false}
                  hoverIndicator="#BAD6DB"
                >
                  <Text size="18px">Register</Text>
                </Box>
              )}
              {available && user === null && (
                <Box direction="row" align="center" gap="10px">
                  s
                  <LoginButton callback={() => {}} />
                  <Text size="18px"> or </Text>
                  <SignUpButton callback={() => {}} />
                  <Text size="18px"> to register </Text>
                </Box>
              )}
            </Box>
          </Box>
          {!available && (
            <Box
              background="#d5d5d5"
              pad="small"
              align="center"
              justify="center"
            >
              <Text textAlign="center" weight="bold">
                {`Sorry, this talk is only available to ${
                  props.talk.visibility === "Followers and members"
                    ? "followers and members"
                    : "members"
                }
                of ${props.talk.channel_name}`}
              </Text>
            </Box>
          )}
        </Layer>
      )}
    </Box>
  );
};
