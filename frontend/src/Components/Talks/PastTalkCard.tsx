import React, { useEffect, useState } from "react";
import { Box, Text, Layer, TextInput, Image } from "grommet";
import { Talk, TalkService } from "../../Services/TalkService";
import { Link } from "react-router-dom";
import { ChannelService } from "../../Services/ChannelService";
import { Calendar, UserExpert, FormNextLink } from "grommet-icons";
import Identicon from "react-identicons";
import "../../Styles/past-talk-card.css";
import { EditTalkModal } from "../Talks/EditTalkModal";
import { textToLatex } from "../Core/LatexRendering";
import MobileTalkCardOverlay from "../Talks/Talkcard/MobileTalkCardOverlay";
import MediaQuery from "react-responsive";
import SlidesUploader from "../Core/SlidesUploader";
import FileDownloader from "../Core/FileDownloader";
import ImageCropUploader from "../Channel/ImageCropUploader";
import { useStore } from "../../store";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  talk: Talk;
  admin?: boolean;
  height?: any;
  width?: any;
  margin?: any;
  onDelete?: any;
  onSave?: any;
  onUnsave?: any;
  show?: boolean;
  onEditCallback?: any;
}

interface State {
  showModal: boolean;
  showEdit: boolean;
  showShadow: boolean;
  saved: boolean;
  showLinkInput: boolean;
  recordingLink: string;
  isRecordingLinkHidden: boolean;
  hasYoutubeRecording: boolean;
  slideUrl?: string;
  hasSlides: boolean;
}

export const PastTalkCard = (props: Props) => {
  const [showModal, setShowModal] = useState(
    props.show ? props.show && !props.admin : false
  );
  const [showEdit, setShowEdit] = useState(false);
  const [showShadow, setShowShadow] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [recordingLink, setRecordingLink] = useState(
    props.talk.recording_link || ""
  );
  const [isRecordingLinkHidden, setIsRecordingLinkHidden] = useState(true);
  const [hasYoutubeRecording, setHasYoutubeRecording] = useState(false);
  const [hasSlides, setHasSlides] = useState(false);
  const [slideUrl, setSlideUrl] = useState("");

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    checkIfSaved();
    isRecordingHidden();

    let thumbnail = TalkService.getYoutubeThumbnail(
      props.talk.recording_link,
      props.talk.id
    );

    setHasYoutubeRecording(thumbnail !== "");
    fetchSlide();
  });

  const checkIfSaved = async () => {
    if (user) {
      const token = await getAccessTokenSilently();
      TalkService.isSaved(
        user.id,
        props.talk.id,
        (saved: boolean) => {
          setSaved(saved);
        },
        token
      );
    }
  };

  const isRecordingHidden = async () => {
    if (props.talk.recording_link) {
      if (props.admin) {
        setIsRecordingLinkHidden(false);
      } else if (user) {
        const token = await getAccessTokenSilently();
        TalkService.isAvailableToUser(
          user.id,
          props.talk.id,
          (available: boolean) => {
            setIsRecordingLinkHidden(!available);
          },
          token
        );
      } else if (props.talk.visibility === "Everybody") {
        setIsRecordingLinkHidden(false);
      } else {
        setIsRecordingLinkHidden(true);
      }
    } else {
      setIsRecordingLinkHidden(true);
    }
  };

  const fetchSlide = async () => {
    let { url } = await TalkService.getSlides(props.talk.id);
    setSlideUrl(url);
    await TalkService.hasSlides(props.talk.id, (hasSlides: any) => {
      setHasSlides(hasSlides);
    });
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

  const formatDateFull = (s: string, e: string) => {
    const start = new Date(s);
    const dateStartStr = start.toDateString().slice(0, -4);
    const timeStartStr = start.toTimeString().slice(0, 5);
    const end = new Date(e);
    const dateEndStr = end.toDateString().slice(0, -4);
    const timeEndStr = end.toTimeString().slice(0, 5);
    return `${dateStartStr} ${timeStartStr} - ${timeEndStr} `;
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    const dateStr = date.toDateString().slice(0, -4);
    const timeStr = date.toTimeString().slice(0, 5);
    return [dateStr, timeStr];
  };

  const toggleModal = () => {
    // track click of the event
    if (!showModal) {
      TalkService.increaseViewCountForTalk(props.talk.id, () => {});
    }

    // toggle stuff
    setShowModal(showLinkInput ? true : !showModal);
    setShowShadow(true);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const onDeleteClicked = async () => {
    const token = await getAccessTokenSilently();
    TalkService.deleteTalk(
      props.talk.id,
      () => {
        props.onDelete();
      },
      token
    );
  };

  const onSaveRecordingUrlClicked = async () => {
    const token = await getAccessTokenSilently();
    TalkService.addRecordingLink(
      props.talk.id,
      recordingLink,
      () => {
        setShowLinkInput(false);
      },
      token
    );
  };

  const onSaveTalkClicked = async () => {
    if (!user) {
      return;
    }
    const token = await getAccessTokenSilently();
    if (saved) {
      TalkService.unsaveTalk(
        user.id,
        props.talk.id,
        () => {
          setSaved(false);
          props.onUnsave && props.onUnsave();
        },
        token
      );
    } else {
      TalkService.saveTalk(
        user.id,
        props.talk.id,
        () => {
          setSaved(true);
          props.onSave && props.onSave();
        },
        token
      );
    }
  };

  const getSpeakerPhotoUrl = (): string | undefined => {
    let current_time = Math.floor(new Date().getTime() / 5000);
    // HACK: we add the new time at the end of the URL to avoid caching;
    // we divide time by value such that all block of requested image have
    // the same name (important for the name to be the same for the styling).
    return TalkService.getSpeakerPhoto(props.talk.id, current_time);
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

  const onClick = () => {
    setShowLinkInput(!showLinkInput);
    setShowModal(true);
    if (showLinkInput) {
      onSaveRecordingUrlClicked();
    }
  };

  const getHeight = () => {
    const mobileScreenThreshold = 900;
    var renderMobileView = window.innerWidth < mobileScreenThreshold;

    if (props.height) {
      return props.height;
    } else if (renderMobileView) {
      return "100%";
    } else if (props.admin) {
      return "400px";
    } else {
      return "350px";
    }
  };

  const onDeleteSlidesClicked = async () => {
    const token = await getAccessTokenSilently();
    TalkService.deleteSlides(
      props.talk.id,
      (res: any) => {
        if (res == "ok") {
          setHasSlides(false);
        }
      },
      token
    );
  };

  const deleteSlidesButton = () => {
    return (
      <Box
        background="#DDDDDD"
        hoverIndicator="#CCCCCC"
        round="xsmall"
        justify="center"
        align="center"
        height="40px"
        width="35%"
        onClick={onDeleteSlidesClicked}
        focusIndicator={false}
      >
        {/* <Text alignSelf="center" color="grey" size="14px">
        {saved ? "Save talk": "Remove from saved"}
      </Text> */}
        <Text alignSelf="center" weight="bold" color="grey" size="14px">
          Delete slides
        </Text>
      </Box>
    );
  };

  const getButtons = () => {
    if (props.admin) {
      // console.log(document.getElementById("upload"))
      return (
        <Box direction="column">
          <Box
            gap="small"
            direction="row"
            margin={{ top: "20px", bottom: "20px" }}
          >
            {recordingLink !== "" && (
              <a href={recordingLink} target="_blank" style={{ width: "35%" }}>
                <Box
                  background="#0C385B"
                  round="xsmall"
                  height="40px"
                  width="100%"
                  justify="center"
                  align="start"
                  focusIndicator={false}
                  hoverIndicator="#BAD6DB"
                >
                  <Text alignSelf="center" size="14px">
                    Watch talk
                  </Text>
                </Box>
              </a>
            )}
            {/* <Box width="30%" /> */}
            {hasSlides && (
              <>
                <Box width="35%" height="40px">
                  <FileDownloader
                    name={props.talk.name + "_slides.pdf"}
                    url={slideUrl}
                  />
                </Box>
                <Box width="30%" />
                {deleteSlidesButton()}
              </>
            )}
          </Box>
          <Box gap="small" direction="row" margin={{ bottom: "10px" }}>
            <Box
              onClick={onClick}
              background="white"
              round="xsmall"
              height="30px"
              width="36.5%"
              justify="center"
              align="start"
              focusIndicator={false}
              hoverIndicator={true}
              style={{
                border: "1px solid #C2C2C2",
              }}
            >
              <Text alignSelf="center" size="14px" weight="bold">
                {showLinkInput ? "Save link recording" : "Enter link recording"}
              </Text>
            </Box>
            <Box width="27%" />
            <Box width="36.5%" height="30px">
              <SlidesUploader
                text={hasSlides ? "Re-upload slides" : "Upload slides"}
                onUpload={onSlideUpload}
                width="100%"
              />
            </Box>
          </Box>
        </Box>
      );
    } else {
      return (
        <Box
          gap="small"
          direction="row"
          margin={{ top: "20px", bottom: "20px" }}
        >
          {props.talk.recording_link && !isRecordingLinkHidden && (
            <a
              href={props.talk.recording_link}
              target="_blank"
              style={{ width: "35%" }}
            >
              <Box
                background="#0C385B"
                round="xsmall"
                height="40px"
                width="100%"
                justify="center"
                align="start"
                focusIndicator={false}
                hoverIndicator="#BAD6DB"
              >
                <Text alignSelf="center" size="14px">
                  Watch talk
                </Text>
              </Box>
            </a>
          )}
          <Box
            width={
              props.talk.recording_link && !isRecordingLinkHidden
                ? "30%"
                : "65%"
            }
          />
          {hasSlides && (
            <Box width="35%" height="40px">
              <FileDownloader
                name={props.talk.name + "_slides.pdf"}
                url={slideUrl}
                width="100%"
              />
            </Box>
          )}
        </Box>
      );
    }
  };

  const [dateStr, timeStr] = formatDate(props.talk.date);
  const mobileScreenThreshold = 900;
  const renderMobileView = window.innerWidth < mobileScreenThreshold;

  return (
    <Box
      width={props.width ? props.width : "32%"}
      height={getHeight()}
      focusIndicator={false}
      style={{
        position: "relative",
        maxHeight: props.admin
          ? renderMobileView && showModal
            ? "380px"
            : "380px"
          : renderMobileView && showModal
          ? "800px"
          : "800px",
        minHeight: props.admin
          ? renderMobileView && showModal
            ? "240px"
            : "240px"
          : renderMobileView && showModal
          ? "180px"
          : "180px",
      }}
      margin={props.margin ? props.margin : { bottom: "small" }}
    >
      <Box
        onMouseEnter={() => setShowShadow(true)}
        onMouseLeave={() => {
          if (!showModal) {
            setShowShadow(false);
          }
        }}
        onClick={() => {
          !showModal && toggleModal();
        }}
        height="100%"
        width="100%"
        background="white"
        round="xsmall"
        overflow="hidden"
        justify="between"
        style={{ position: "relative" }}
      >
        {props.talk.has_speaker_photo === 1 && (
          <Image
            style={{ aspectRatio: "3/2", alignSelf: "center" }}
            src={getSpeakerPhotoUrl()}
            height="62%"
            margin={{ top: "20px" }}
          />
        )}
        {props.talk.has_speaker_photo === 0 && hasYoutubeRecording && (
          <img
            src={TalkService.getYoutubeThumbnail(
              props.talk.recording_link,
              props.talk.id
            )}
            style={{
              height: "62%",
              marginTop: "15px",
              maxWidth: "640px",
              alignSelf: "center",
            }}
          />
        )}
        {props.talk.has_speaker_photo === 0 && !hasYoutubeRecording && (
          <img
            src={ChannelService.getAvatar(props.talk.channel_id)}
            height={renderMobileView ? "125px" : "48%"}
            style={{
              marginTop: "35px",
              alignSelf: "center",
            }}
          />
        )}
        {props.admin && props.talk.has_speaker_photo === 0 && (
          <div style={{ position: "absolute", top: 10, right: 10, zIndex: 5 }}>
            <ImageCropUploader
              text="Upload thumbnail"
              onUpload={onSpeakerPhotoUpload}
              width="95px"
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
            width="100px"
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
              Remove thumbnail
            </Text>
          </Box>
        )}
        <Box height="38%" pad="15px" justify="end">
          <Box
            direction="row"
            gap="xsmall"
            align="center"
            style={{ minHeight: "30px" }}
          >
            <Box
              height="25px"
              width="25px"
              round="12.5px"
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
                  height={25}
                  width={25}
                />
              )}
            </Box>
            <Text weight="bold" size="14px" color="#025377">
              {props.talk.channel_name}
            </Text>
          </Box>
          <Text
            // className={props.talk.name.length > 100 ? "fade" : "nvm"}
            className="nvm"
            weight="bold"
            size="14px"
            color="black"
            style={{
              // whiteSpace: "nowrap",
              overflow: "hidden",
              // textOverflow: "ellipsis",
              lineHeight: "23px",
              // maxHeight: "63px",
            }}
          >
            {props.talk.name}
          </Text>
        </Box>
      </Box>
      {showShadow && (
        <Box
          height={props.height ? props.height : "350px"}
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

      {showModal && (
        <>
          <MediaQuery maxDeviceWidth={mobileScreenThreshold}>
            <MobileTalkCardOverlay
              talk={props.talk}
              pastOrFutureTalk="past"
              registered={true}
              registrationStatus={""}
            />
          </MediaQuery>

          <MediaQuery minDeviceWidth={mobileScreenThreshold}>
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
                height: props.admin ? (showLinkInput ? 600 : 560) : 500,
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
                  style={{ minHeight: "200px", maxHeight: "400px" }}
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
                          <Text weight="bold" size="14px" color="grey">
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
                <Box
                  direction="column"
                  gap="small"
                  height={
                    props.admin ? (showLinkInput ? "190px" : "130px") : "90px"
                  }
                  // height={showLinkInput ? "190px" : (props.talk.recording_link || props.admin ? "160px" : "90px")}
                  //style={{ minHeight: "90px", maxHeight: "150px" }}
                >
                  <Box direction="row" gap="small">
                    <Calendar size="14px" />
                    <Text
                      size="14px"
                      color="black"
                      style={{ height: "20px", fontStyle: "normal" }}
                    >
                      Held on{" "}
                      {formatDateFull(props.talk.date, props.talk.end_date)}
                    </Text>
                  </Box>
                  {getButtons()}
                  {showLinkInput && (
                    <TextInput
                      style={{ height: 32 }}
                      value={recordingLink}
                      placeholder={"Enter url here"}
                      onChange={(e) => {
                        setRecordingLink(e.target.value);
                      }}
                    />
                    /*
                  <Box
                    direction="row"
                    width="100%"
                    height="15px"
                    margin={{top: "60px"}}
                    justify="center"
                    align="center"
                    style={{
                      position: "absolute",
                      bottom: 0,
                    }}
                  >
                    <TextInput
                      style={{ height: 32 }}
                      value={recordingLink}
                      onChange={(e) => {
                        setState({ recordingLink: e.target.value });
                      }}
                    />
                    <CoreButton
                      width="25%"
                      height="32px"
                      text="save"
                      onClick={onSaveRecordingUrlClicked}
                    />
                  </Box>
                  */
                  )}
                </Box>
              </Box>
              {recordingLink === "" && (
                <Box
                  background="#d5d5d5"
                  pad="small"
                  align="center"
                  justify="center"
                >
                  <Text textAlign="center" weight="bold">
                    There is currently no recording available for this talk
                  </Text>
                </Box>
              )}
              {props.talk.recording_link &&
                isRecordingLinkHidden &&
                !props.admin && (
                  <Box
                    background="#d5d5d5"
                    pad="small"
                    align="center"
                    justify="center"
                  >
                    <Text textAlign="center" weight="bold">
                      {`The recording and slides are only available to ${
                        props.talk.visibility === "Followers and members"
                          ? "followers and members"
                          : "members"
                      }
                  of ${props.talk.channel_name}`}
                    </Text>
                    <Link
                      to={`/${props.talk.channel_name}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Box
                        className="see-more-button"
                        pad={{ vertical: "2px", horizontal: "xsmall" }}
                        round="xsmall"
                        style={{
                          border: "2px solid #C2C2C2",
                        }}
                        direction="row"
                        align="end"
                      >
                        <FormNextLink color="grey" />
                      </Box>
                    </Link>
                  </Box>
                )}
            </Layer>
          </MediaQuery>
        </>
        // <Layer
        //   onEsc={() => {
        //     toggleModal();
        //     setState({ showShadow: false });
        //   }}
        //   onClickOutside={() => {
        //     toggleModal();
        //     setState({ showShadow: false });
        //   }}
        //   onClick={(e) => e.stopPropagation()}
        //   modal
        //   responsive
        //   animation="fadeIn"
        //   style={{
        //     width: 400,
        //     height: 500,
        //     borderRadius: 15,
        //     overflow: "hidden",
        //   }}
        // >
        //   <Box
        //     // align="center"
        //     pad="25px"
        //     // width="100%"
        //     height="100%"
        //     justify="between"
        //     gap="xsmall"
        //   >
        //     <Box style={{ minHeight: "40%", maxHeight: "60%" }}>
        //       <Box
        //         direction="row"
        //         gap="xsmall"
        //         align="center"
        //         style={{ minHeight: "30px" }}
        //       >
        //         <Box
        //           height="25px"
        //           width="25px"
        //           round="12.5px"
        //           justify="center"
        //           align="center"
        //           background="#efeff1"
        //           overflow="hidden"
        //         >
        //           {!props.talk.has_avatar && (
        //             <Identicon
        //               string={props.talk.channel_name}
        //               size={15}
        //             />
        //           )}
        //           {!!props.talk.has_avatar && (
        //             <img
        //               src={ChannelService.getAvatar(
        //                 props.talk.channel_id
        //               )}
        //               height={25}
        //               width={25}
        //             />
        //           )}
        //         </Box>
        //         <Text
        //           weight="bold"
        //           size="22px"
        //           color="#6DA3C7"
        //         >
        //           {props.talk.channel_name}
        //         </Text>
        //       </Box>
        //       <Text
        //         weight="bold"
        //         size="24px"
        //         color="black"
        //         style={{ overflowY: "scroll" }}
        //       >
        //         {props.talk.name}
        //       </Text>
        //     </Box>
        //     <Box
        //       gap="xsmall"
        //       justify="end"
        //       style={{ height: "40%", position: "relative" }}
        //     >
        //       <Text size="22px" color="black" style={{ overflowY: "auto" }}>
        //         {props.talk.description}
        //       </Text>
        //       {props.talk.tags.length !== 0 && (
        //         <Box
        //           direction="row"
        //           gap="xsmall"
        //           wrap
        //           style={{ minHeight: "35px", marginTop: "5px" }}
        //         >
        //           {props.talk.tags.map((tag: Tag) => (
        //             <TagComponent
        //               tagName={tag.name}
        //               width="80px"
        //               colour="#f3f3f3"
        //             />
        //           ))}
        //         </Box>
        //       )}
        //       <Text size="18px" color="black">
        //         Held on{" "}
        //         <Text size="18px" color="black" weight="bold">
        //           {dateStr}
        //         </Text>{" "}
        //         at{" "}
        //         <Text size="18px" color="black" weight="bold">
        //           {timeStr}
        //         </Text>
        //       </Text>
        //       {showLinkInput && (
        //         <Box
        //           direction="row"
        //           width="100%"
        //           height="45px"
        //           background="#eaf1f1"
        //           round="xsmall"
        //           pad="xsmall"
        //           justify="center"
        //           align="center"
        //           gap="xsmall"
        //           style={{
        //             position: "absolute",
        //             bottom: 0,
        //           }}
        //         >
        //           <TextInput
        //             style={{ height: 32 }}
        //             value={recordingLink}
        //             onChange={(e) => {
        //               setState({ recordingLink: e.target.value });
        //             }}
        //           />
        //           <CoreButton
        //             width="25%"
        //             height="32px"
        //             text="save"
        //             onClick={onSaveRecordingUrlClicked}
        //           />
        //         </Box>
        //       )}
        //     </Box>
        //     {getButtons()}
        //   </Box>
        //   {!props.talk.recording_link && !props.admin && (
        //     <Box
        //       background="#d5d5d5"
        //       pad="small"
        //       align="center"
        //       justify="center"
        //     >
        //       <Text textAlign="center" weight="bold">
        //         Sorry, there is currently no recording available for this talk
        //         :(
        //       </Text>
        //     </Box>
        //   )}
        // </Layer>
      )}
      {props.admin && (
        <Box
          onClick={() => {
            toggleEdit();
          }}
          background="#0C385B"
          round="xsmall"
          pad="xsmall"
          height="40px"
          width="98%"
          justify="center"
          align="center"
          focusIndicator={false}
          hoverIndicator="#BAD6DB"
          margin="10px"
        >
          <Text size="18px">Edit</Text>
        </Box>
      )}
      {props.admin && showEdit && (
        <EditTalkModal
          visible={showEdit}
          channel={null}
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
        />
      )}
    </Box>
  );
};
