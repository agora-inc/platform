import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Text, Layer, Image } from "grommet";
import Identicon from "react-identicons";
import { Calendar, UserExpert } from "grommet-icons";
import MediaQuery from "react-responsive";

import { User } from "../../Services/UserService";
import { Talk, TalkService } from "../../Services/TalkService";
import { EditTalkModal } from "../Talks/EditTalkModal";
import { ChannelService } from "../../Services/ChannelService";
import { textToLatex } from "../Core/LatexRendering";
import { FooterOverlay } from "../Talks/Talkcard/FooterOverlay";
import MobileTalkCardOverlay from "../Talks/Talkcard/MobileTalkCardOverlay";
import CopyUrlButton from "../Core/ShareButtons/CopyUrlButton";
import { encryptIdAndRoleInUrl } from "../Core/Encryption/UrlEncryption";
import { basePoint } from "../../config";
import ImageCropUploader from "./ImageCropUploader";
import { useStore } from "../../store";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  talk: Talk;
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

export const ChannelPageTalkCard = (props: Props) => {
  const [showModal, setShowModal] = useState(
    props.show ? props.show && !props.admin : false
  );
  const [showEdit, setShowEdit] = useState(false);
  const [available, setAvailable] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [showShadow, setShowShadow] = useState(false);
  const [slideUrl, setSlideUrl] = useState("");

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    checkIfAvailableAndRegistered();
    checkIfUserCanAccessLink();
    checkIfUserCanViewCard();
    fetchSlide();
  }, []);

  const checkIfAvailableAndRegistered = async () => {
    const token = await getAccessTokenSilently();
    if (user) {
      TalkService.isAvailableToUser(
        user.id,
        props.talk.id,
        (available: boolean) => {
          setAvailable(available);
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
    const token = await getAccessTokenSilently();
    user &&
      TalkService.registrationStatusForTalk(
        props.talk.id,
        user.id,
        (status: string) => {
          setRegistered(status === "accepted");
          setRegistrationStatus(status);
        },
        token
      );
  };

  const checkIfUserCanAccessLink = () => {
    if (props.admin) {
      return true;
    } else if (props.talk.visibility == "Everybody") {
      return true;
    } else if (props.talk.visibility == "Followers and members") {
      if (
        props.following ||
        props.role === "follower" ||
        props.role === "member"
      ) {
        return true;
      } else {
        return false;
      }
    } else if (props.talk.visibility == "Members only") {
      if (props.role === "member") {
        return true;
      } else {
        return false;
      }
    }
  };

  const checkIfUserCanViewCard = (): boolean => {
    if (props.admin) {
      return true;
    } else {
      if (props.talk.card_visibility == "Everybody") {
        return true;
      } else if (props.talk.card_visibility === "Followers and members") {
        if (props.role === "follower" || props.role === "member") {
          return true;
        } else {
          return false;
        }
      } else if (props.talk.card_visibility == "Members only") {
        if (props.role === "member") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  };

  const register = () => {
    // props.user &&
    //   TalkService.registerForTalk(
    //     props.talk.id,
    //     props.user.id,
    //     () => {
    //       checkIfRegistered();
    //     }
    //   );
  };

  const unregister = () => {
    // props.user &&
    //   TalkService.unRegisterForTalk(
    //     props.talk.id,
    //     props.user.id,
    //     () => {
    //       checkIfRegistered();
    //     }
    //   );
  };

  const onClick = () => {
    if (registered) {
      unregister();
    } else {
      register();
    }
  };

  const onFollowClicked = async () => {
    if (user === null) {
      return;
    }
    const token = await getAccessTokenSilently();
    if (!props.following) {
      ChannelService.addUserToChannel(
        user.id,
        props.talk.channel_id,
        "follower",
        () => {},
        token
      );
    } else {
      ChannelService.removeUserFromChannel(
        user.id,
        props.talk.channel_id,
        () => {},
        token
      );
    }
    props.callback();
  };

  const onSpeakerPhotoUpload = async (file: File) => {
    const token = await getAccessTokenSilently();
    TalkService.uploadSpeakerPhoto(
      props.talk.id,
      file,
      () => {
        window.location.reload();
      },
      token
    );
  };

  const removeSpeakerPhoto = async () => {
    const token = await getAccessTokenSilently();
    TalkService.removeSpeakerPhoto(
      props.talk.id,
      () => {
        window.location.reload();
      },
      token
    );
  };

  const getSpeakerPhotoUrl = (): string | undefined => {
    let current_time = Math.floor(new Date().getTime() / 5000);
    // HACK: we add the new time at the end of the URL to avoid caching;
    // we divide time by value such that all block of requested image have
    // the same name (important for the name to be the same for the styling).
    return TalkService.getSpeakerPhoto(props.talk.id, current_time);
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

  const toggleModal = () => {
    // track click of the event
    if (!showModal) {
      TalkService.increaseViewCountForTalk(props.talk.id, () => {});
    }
    // toggle Modal
    setShowModal(!showModal);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const onSlideUpload = async (e: any) => {
    const token = await getAccessTokenSilently();
    await TalkService.uploadSlides(
      props.talk.id,
      e.target.files[0],
      () => {},
      token
    );
    await fetchSlide();
  };

  const fetchSlide = async () => {
    const token = await getAccessTokenSilently();
    let { url } = await TalkService.getSlides(props.talk.id);
    setSlideUrl(url);
  };

  const renderMobileView = window.innerWidth < 800;
  const agoraTalk = props.talk.link.includes(basePoint + "/livestream");

  return (
    <Box
      width={props.width ? props.width : "32%"}
      // height={props.admin
      //   ? ((renderMobileView && showModal) ? "1000px" : "240px")
      //   : ((renderMobileView && showModal) ? "560px" : "180px")}
      focusIndicator={false}
      height="100%"
      style={{
        position: "relative",
        maxHeight: props.admin
          ? renderMobileView && showModal
            ? "240px"
            : "240px"
          : renderMobileView && showModal
          ? "600px"
          : "600px",
        minHeight: props.admin
          ? renderMobileView && showModal
            ? "240px"
            : "240px"
          : renderMobileView && showModal
          ? "180px"
          : "180px",
      }}
      margin={{ bottom: "small" }}
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

          {props.admin && props.talk.has_speaker_photo === 0 && (
            <div
              style={{ position: "absolute", top: 10, right: 10, zIndex: 5 }}
            >
              <ImageCropUploader
                text="Upload speaker pic"
                onUpload={onSpeakerPhotoUpload}
                width="100px"
                height="20px"
                widthModal={600}
                heightModal={600}
                textSize="10px"
                hideToolTip={true}
                aspect={3 / 2}
              />
            </div>
          )}
          {props.admin && props.talk.has_speaker_photo === 1 && (
            <Box
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 5,
                border: "solid black 1px",
                cursor: "pointer",
              }}
              round="xsmall"
              width="105px"
              height="20px"
              justify="center"
              align="center"
              background="#EAF1F1"
              focusIndicator={true}
              hoverIndicator="#DDDDDD"
              onClick={(e: any) => {
                e.stopPropagation();
                removeSpeakerPhoto();
              }}
            >
              <Text size="10px" weight="bold" color="black">
                Remove speaker pic
              </Text>
            </Box>
          )}
          {props.talk.has_speaker_photo === 1 && (
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
              {props.isCurrent && (
                <Text
                  size="18px"
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
                  {formatDate(props.talk.date)}
                </Text>
              )}
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
            {/*props.talk.card_visibility !== "Members only" && props.talk.visibility === "Members only" && 
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
                opacity: 0.5,
              }}
              background="#6DA3C7"
            ></Box>
          )}
        </Box>
      </Box>

      {/* We would like the downloaded slides to have the following name: 'TalkService.getTalkByid.name'_slides.pdf */}
      {/* <Text><a href={TalkService.getSlides(160)} target='_blank'>Download</a></Text> */}
      {/* slideUrl && <Text><a href={slideUrl} target='_blank'>Download</a></Text> */}

      {/*<SlidesUploader
          text="Upload slide"
          onUpload={onSlideUpload}
        />*/}

      {props.admin && (
        <Box direction="row" gap="10px" margin={{ top: "10px" }}>
          <Box
            onClick={() => {
              toggleEdit();
            }}
            width={agoraTalk ? "50%" : "100%"}
            background="#0C385B"
            round="xsmall"
            pad="xsmall"
            height="40px"
            justify="center"
            align="center"
            focusIndicator={false}
            hoverIndicator="#BAD6DB"
          >
            <Text size="16px">Edit</Text>
          </Box>
          {agoraTalk && (
            <CopyUrlButton
              url={encryptIdAndRoleInUrl(
                "livestream",
                props.talk.id,
                "speaker"
              )}
              text={"Link for speaker"}
              height="40px"
              width="50%"
            />
          )}
        </Box>
      )}
      {showModal && (
        <>
          <MediaQuery maxDeviceWidth={800}>
            <MobileTalkCardOverlay
              talk={props.talk}
              pastOrFutureTalk="future"
              registered={registered}
              role={props.role}
              registrationStatus={registrationStatus}
            />
          </MediaQuery>

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
                  <Box
                    direction="row"
                    gap="xsmall"
                    style={{ minHeight: "30px" }}
                  >
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
                            <Identicon
                              string={props.talk.channel_name}
                              size={30}
                            />
                          )}
                          {!!props.talk.has_avatar && (
                            <img
                              src={ChannelService.getAvatar(
                                props.talk.channel_id
                              )}
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
                    size="18px"
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
                          {props.talk.talk_speaker
                            ? props.talk.talk_speaker
                            : "TBA"}
                        </Text>
                      </Box>
                    </a>
                  )}

                  {!props.talk.talk_speaker_url && (
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
                        {props.talk.talk_speaker
                          ? props.talk.talk_speaker
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
                    {props.talk.description
                      .split("\n")
                      .map((item, i) => textToLatex(item))}
                  </Box>
                </Box>
              </Box>
              <FooterOverlay
                talk={props.talk}
                isSharingPage={false}
                registered={registered}
                registrationStatus={registrationStatus}
                role={props.admin ? "owner" : props.role}
                available={available}
                width={props.width}
                // isCurrent?: boolean;
                // show?: boolean;
                following={props.following}
                onEditCallback={props.onEditCallback}
                callback={props.callback}
              />
            </Layer>
          </MediaQuery>
        </>
      )}
      {props.admin && showEdit && (
        <EditTalkModal
          visible={showEdit}
          channel={null}
          channelId={props.talk.channel_id}
          talk={props.talk}
          onFinishedCallback={() => {
            toggleEdit();
            props.onEditCallback();
          }}
          onDeletedCallback={() => {
            toggleEdit();
            props.onEditCallback();
          }}
          onCanceledCallback={toggleEdit}
          onFinishedAdvertisementCallback={toggleEdit}
          onCanceledAdvertisementCallback={toggleEdit}
        />
      )}
    </Box>
  );
};
