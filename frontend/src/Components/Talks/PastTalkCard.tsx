import React, { Component } from "react";
import { Box, Text, Button, Layer, TextInput, Image } from "grommet";
import { Talk, TalkService } from "../../Services/TalkService";
import { Link } from "react-router-dom";
import { ChannelService } from "../../Services/ChannelService";
import { User } from "../../Services/UserService";
import { Calendar, Workshop, UserExpert, FormNextLink } from "grommet-icons";
import { Tag } from "../../Services/TagService";
import { default as TagComponent } from "../Core/Tag";
import { default as CoreButton } from "../Core/Button";
import Identicon from "react-identicons";
import "../../Styles/past-talk-card.css";
import EditTalkModal from "../Talks/EditTalkModal";
import { textToLatex } from "../Core/LatexRendering";
import MobileTalkCardOverlay from "../Talks/Talkcard/MobileTalkCardOverlay";
import MediaQuery from "react-responsive";
import SlidesUploader from "../Core/SlidesUploader";
import FileDownloader from "../Core/FileDownloader";
import ImageCropUploader from "../Channel/ImageCropUploader";


interface Props {
  talk: Talk;
  admin?: boolean;
  height?: any;
  width?: any;
  margin?: any;
  onDelete?: any;
  onSave?: any;
  onUnsave?: any;
  user: User | null;
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
  hasSlides: boolean
}

export default class PastTalkCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: this.props.show ? this.props.show && !this.props.admin : false,
      showEdit: false,
      showShadow: false,
      saved: false,
      showLinkInput: false,
      recordingLink: this.props.talk.recording_link
        ? this.props.talk.recording_link
        : "",
      isRecordingLinkHidden: true,
      hasYoutubeRecording: false,
      hasSlides: false
    };
  }

  onSlideUpload = async (e: any) => {
    await TalkService.uploadSlides(this.props.talk.id, e.target.files[0], ()=>{})
    await this.fetchSlide()
  };

  fetchSlide = async () => {
    let {url} = await TalkService.getSlides(this.props.talk.id)
    this.setState({slideUrl: url})
    await TalkService.hasSlides(
      this.props.talk.id,
      (hasSlides: any) => {
        this.setState({hasSlides: hasSlides})
      }
    )
  };

  formatDateFull = (s: string, e: string) => {
    const start = new Date(s);
    const dateStartStr = start.toDateString().slice(0, -4);
    const timeStartStr = start.toTimeString().slice(0, 5);
    const end = new Date(e);
    const dateEndStr = end.toDateString().slice(0, -4);
    const timeEndStr = end.toTimeString().slice(0, 5);
    return `${dateStartStr} ${timeStartStr} - ${timeEndStr} `;
  };

  componentWillMount() {
    this.checkIfSaved();
    this.isRecordingHidden();

    let thumbnail = TalkService.getYoutubeThumbnail(
      this.props.talk.recording_link,
      this.props.talk.id
    )
    this.setState({ hasYoutubeRecording: thumbnail !== "" })
    this.fetchSlide()
  }

  checkIfSaved = () => {
    this.props.user &&
      TalkService.isSaved(
        this.props.user.id,
        this.props.talk.id,
        (saved: boolean) => {
          this.setState({ saved });
        }
      );
  };

  formatDate = (d: string) => {
    const date = new Date(d);
    const dateStr = date.toDateString().slice(0, -4);
    const timeStr = date.toTimeString().slice(0, 5);
    return [dateStr, timeStr];
  };

  toggleModal = () => {
    // track click of the event
    if (!(this.state.showModal)){
      TalkService.increaseViewCountForTalk(this.props.talk.id, () => {})
    }

    // toggle stuff
    this.setState({
      showModal: this.state.showLinkInput ? true : !this.state.showModal,
      showShadow: true,
    });
  };

  toggleEdit = () => {
    this.setState({ showEdit: !this.state.showEdit });
  };


  onDeleteClicked = () => {
    TalkService.deleteTalk(this.props.talk.id, () => {
      this.props.onDelete();
    });
  };

  onSaveRecordingUrlClicked = () => {
    TalkService.addRecordingLink(
      this.props.talk.id,
      this.state.recordingLink,
      () => {
        this.setState({ showLinkInput: false });
      }
    );
  };

  onSaveTalkClicked = () => {
    if (!this.props.user) {
      return;
    }
    if (this.state.saved) {
      TalkService.unsaveTalk(this.props.user.id, this.props.talk.id, () => {
        this.setState({ saved: false });
        this.props.onUnsave && this.props.onUnsave();
      });
    } else {
      TalkService.saveTalk(this.props.user.id, this.props.talk.id, () => {
        this.setState({ saved: true });
        this.props.onSave && this.props.onSave();
      });
    }
  };

  getSpeakerPhotoUrl = (): string | undefined => {
    let current_time = Math.floor(new Date().getTime() / 5000);
    // HACK: we add the new time at the end of the URL to avoid caching; 
    // we divide time by value such that all block of requested image have 
    // the same name (important for the name to be the same for the styling).
    return TalkService.getSpeakerPhoto(this.props.talk.id, current_time)
  }

  onSpeakerPhotoUpload = (file: File) => {
    TalkService.uploadSpeakerPhoto(
      this.props.talk.id,
      file,
      () => {
        window.location.reload();
      }
    );
  };

  removeSpeakerPhoto = () => {
    TalkService.removeSpeakerPhoto(
      this.props.talk.id,
      () => {
        window.location.reload();
      }
    );
  };

  onClick = () => {
    this.setState({
      showLinkInput: !this.state.showLinkInput,
      showModal: true,
    });
    if (this.state.showLinkInput) {
      this.onSaveRecordingUrlClicked();
    }
  };

  isRecordingHidden = () => {
    if (this.props.talk.recording_link) {
      if (this.props.admin) {
        this.setState({ isRecordingLinkHidden: false })
      } else if (this.props.user) {
        TalkService.isAvailableToUser(
          this.props.user.id,
          this.props.talk.id,
          (available: boolean) => {
            this.setState({ isRecordingLinkHidden: !available })
          }
        )
      } else if (this.props.talk.visibility === "Everybody") {
        this.setState({ isRecordingLinkHidden: false })
      } else {
        this.setState({ isRecordingLinkHidden: true })
      }
    } else {
      this.setState({ isRecordingLinkHidden: true })
    }
  };

  getHeight = () => {
    const mobileScreenThreshold = 900;
    var renderMobileView = (window.innerWidth < mobileScreenThreshold);

    if (this.props.height) {
      return this.props.height
    } else if (renderMobileView) {
      return "100%"
    } else if (this.props.admin) {
      return "400px"
    } else {
      return "350px"
    }
  }

  deleteSlidesButton = () => {
    return (
      <Box
      background="#DDDDDD"
      hoverIndicator="#CCCCCC"
      round="xsmall"
      justify="center"
      align="center"
      height="40px"
      width="35%"
      onClick={() => {
        TalkService.deleteSlides(this.props.talk.id, 
          (res: any) => {
            if (res == "ok"){
              this.setState({hasSlides: false})
            }
          })
        }
      }
      focusIndicator={false}
    >
      {/* <Text alignSelf="center" color="grey" size="14px">
        {this.state.saved ? "Save talk": "Remove from saved"}
      </Text> */}
      <Text alignSelf="center" weight="bold" color="grey" size="14px"> 
        Delete slides
      </Text>
    </Box>
    )
  }


  getButtons = () => {
    if (this.props.admin) {
      // console.log(document.getElementById("upload"))
      return (
        <Box direction="column">  
          <Box gap="small" direction="row" margin={{ top: "20px", bottom: "20px" }}>
            {this.state.recordingLink !== "" && (
              <a
                href={this.state.recordingLink}
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
            {/* <Box width="30%" /> */}
            {this.state.hasSlides && (
              <>
                <Box width="35%" height="40px">
                    <FileDownloader name={this.props.talk.name+'_slides.pdf'} url={this.state.slideUrl}/>
                </Box>
                <Box width="30%" />
                {this.deleteSlidesButton()}
              </>
              )
            }

          </Box>
          <Box gap="small" direction="row" margin={{ bottom: "10px" }}>
            <Box
              onClick={this.onClick}
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
                {this.state.showLinkInput
                  ? "Save link recording"
                  : "Enter link recording"}
              </Text>
            </Box>
            <Box width="27%" />
            <Box width="36.5%" height="30px">
              <SlidesUploader
                text={this.state.hasSlides ? "Re-upload slides": "Upload slides"}
                onUpload={this.onSlideUpload}
                width="100%"
              />
            </Box>  
          </Box>
        </Box>
      );
    } else {
      return (
        <Box gap="small" direction="row" margin={{ top: "20px", bottom: "20px" }}>
          {this.props.talk.recording_link && !this.state.isRecordingLinkHidden && (
            <a
              href={this.props.talk.recording_link}
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
          <Box width={this.props.talk.recording_link && !this.state.isRecordingLinkHidden ? "30%" : "65%"} />
            {this.state.hasSlides && (
              <Box width="35%" height="40px">
                  <FileDownloader 
                    name={this.props.talk.name+'_slides.pdf'} 
                    url={this.state.slideUrl}
                    width="100%"
                    />
              </Box>
              )
            }
        </Box>
      );
    }
  };

  render() {
    let [dateStr, timeStr] = this.formatDate(this.props.talk.date);
    const mobileScreenThreshold = 900;
    var renderMobileView = (window.innerWidth < mobileScreenThreshold);

    return (
      <Box
        width={this.props.width ? this.props.width : "32%"}
        height={this.getHeight()}
        focusIndicator={false}
        style={{ 
          position: "relative",
          maxHeight: this.props.admin 
            ? ((renderMobileView && this.state.showModal) ? "380px" : "380px")
            : ((renderMobileView && this.state.showModal) ? "800px" : "800px"),
          minHeight: this.props.admin 
            ? ((renderMobileView && this.state.showModal) ? "240px" : "240px")
            : ((renderMobileView && this.state.showModal) ? "180px" : "180px"), }}
        margin={this.props.margin ? this.props.margin : { bottom: "small" }}
      >
        <Box
          onMouseEnter={() => this.setState({ showShadow: true })}
          onMouseLeave={() => {
            if (!this.state.showModal) {
              this.setState({ showShadow: false });
            }
          }}
          onClick={() => {
            !this.state.showModal && this.toggleModal();
          }}
          height="100%"
          width="100%"
          background="white"
          round="xsmall"
          overflow="hidden"
          justify="between"
          style={{ position: "relative" }}
        >

          {this.props.talk.has_speaker_photo === 1 && (
            <Image 
              style={{ aspectRatio: "3/2", alignSelf: 'center' }}
              src={this.getSpeakerPhotoUrl()}
              height="62%"
              margin={{top: "20px"}}
            />
          )}
          {this.props.talk.has_speaker_photo === 0 && this.state.hasYoutubeRecording && (
            <img
              src={TalkService.getYoutubeThumbnail(
                this.props.talk.recording_link,
                this.props.talk.id
              )}
              style={{ height: "62%",
              marginTop: "15px", 
              maxWidth: '640px',
              alignSelf: 'center'}}
            />
          )}
          {this.props.talk.has_speaker_photo === 0 && !this.state.hasYoutubeRecording && (
            <img
              src={ChannelService.getAvatar(this.props.talk.channel_id)}
              height={renderMobileView ? "125px" : "48%"}
              style={{
              marginTop: "35px", 
              alignSelf: 'center'}}
            />
          )}
          {this.props.admin && this.props.talk.has_speaker_photo === 0 && (
            <div style={{position: 'absolute', top: 10, right: 10, zIndex: 5}}>
              <ImageCropUploader
                text="Upload thumbnail"
                onUpload={this.onSpeakerPhotoUpload}
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
          {this.props.admin && this.props.talk.has_speaker_photo === 1 && (
            <Box 
              style={{ 
                position: 'absolute', top: 10, right: 10, zIndex: 5,
                border: "solid black 1px", cursor: "pointer" 
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
                e.stopPropagation()
                this.removeSpeakerPhoto()
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
                {!this.props.talk.has_avatar && (
                  <Identicon string={this.props.talk.channel_name} size={15} />
                )}
                {!!this.props.talk.has_avatar && (
                  <img
                    src={ChannelService.getAvatar(this.props.talk.channel_id)}
                    height={25}
                    width={25}
                  />
                )}
              </Box>
              <Text
                weight="bold"
                size="14px"
                color="#025377"
              >
                {this.props.talk.channel_name}
              </Text>
            </Box>
            <Text
              // className={this.props.talk.name.length > 100 ? "fade" : "nvm"}
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
              {this.props.talk.name}
            </Text>

          </Box>

        </Box>
        {this.state.showShadow && (
          <Box
            height={this.props.height ? this.props.height : "350px"}
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

        {this.state.showModal && (
          <>
          <MediaQuery maxDeviceWidth={mobileScreenThreshold}>
              <MobileTalkCardOverlay
                talk={this.props.talk}
                pastOrFutureTalk="past"
                user={this.props.user}
                registered={true}
                registrationStatus={""}
              />
            </MediaQuery>

          <MediaQuery minDeviceWidth={mobileScreenThreshold}>
            <Layer
              onEsc={() => {
                this.toggleModal();
                this.setState({ showShadow: false });
              }}
              onClickOutside={() => {
                this.toggleModal();
                this.setState({ showShadow: false });
              }}
              modal
              responsive
              animation="fadeIn"
              style={{
                width: 640,
                height:
                  this.props.admin
                    ? (this.state.showLinkInput ? 600 : 560)
                    : 500,
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
                  <Box direction="row" gap="xsmall" style={{ minHeight: "30px" }}>
                    <Link
                      className="channel"
                      to={`/${this.props.talk.channel_name}`}
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
                          {!this.props.talk.has_avatar && (
                            <Identicon
                              string={this.props.talk.channel_name}
                              size={30}
                            />
                          )}
                          {!!this.props.talk.has_avatar && (
                            <img
                              src={ChannelService.getAvatar(
                                this.props.talk.channel_id
                              )}
                              height={30}
                              width={30}
                            />
                          )}
                        </Box>
                        <Box justify="between">
                          <Text weight="bold" size="14px" color="grey">
                            {this.props.talk.channel_name}
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
                    {this.props.talk.name}
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
                      {this.props.talk.talk_speaker
                        ? this.props.talk.talk_speaker
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
                    {this.props.talk.description.split('\n').map(
                      (item, i) => textToLatex(item)
                    )}
                  </Box>
                </Box>
                <Box
                  direction="column"
                  gap="small"
                  height={this.props.admin ? (this.state.showLinkInput ? "190px" : "130px") : "90px" }
                  // height={this.state.showLinkInput ? "190px" : (this.props.talk.recording_link || this.props.admin ? "160px" : "90px")}
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
                      {this.formatDateFull(
                        this.props.talk.date,
                        this.props.talk.end_date
                      )}
                    </Text>
                  </Box>
                  {this.getButtons()}
                  {this.state.showLinkInput && (
                    <TextInput
                      style={{ height: 32 }}
                      value={this.state.recordingLink}
                      placeholder={"Enter url here"}
                      onChange={(e) => {
                        this.setState({ recordingLink: e.target.value });
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
                        value={this.state.recordingLink}
                        onChange={(e) => {
                          this.setState({ recordingLink: e.target.value });
                        }}
                      />
                      <CoreButton
                        width="25%"
                        height="32px"
                        text="save"
                        onClick={this.onSaveRecordingUrlClicked}
                      />
                    </Box>
                    */
                  )}
                </Box>
              </Box>
              {this.state.recordingLink === "" && (
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
              {this.props.talk.recording_link && this.state.isRecordingLinkHidden && !this.props.admin && (
                <Box
                  background="#d5d5d5"
                  pad="small"
                  align="center"
                  justify="center"
                >
                  <Text textAlign="center" weight="bold">
                    {`The recording and slides are only available to ${
                      this.props.talk.visibility === "Followers and members"
                        ? "followers and members"
                        : "members"
                      }
                    of ${this.props.talk.channel_name}`}
                  </Text>
                  <Link to={`/${this.props.talk.channel_name}`} style={{ textDecoration: "none" }}>
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
          //     this.toggleModal();
          //     this.setState({ showShadow: false });
          //   }}
          //   onClickOutside={() => {
          //     this.toggleModal();
          //     this.setState({ showShadow: false });
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
          //           {!this.props.talk.has_avatar && (
          //             <Identicon
          //               string={this.props.talk.channel_name}
          //               size={15}
          //             />
          //           )}
          //           {!!this.props.talk.has_avatar && (
          //             <img
          //               src={ChannelService.getAvatar(
          //                 this.props.talk.channel_id
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
          //           {this.props.talk.channel_name}
          //         </Text>
          //       </Box>
          //       <Text
          //         weight="bold"
          //         size="24px"
          //         color="black"
          //         style={{ overflowY: "scroll" }}
          //       >
          //         {this.props.talk.name}
          //       </Text>
          //     </Box>
          //     <Box
          //       gap="xsmall"
          //       justify="end"
          //       style={{ height: "40%", position: "relative" }}
          //     >
          //       <Text size="22px" color="black" style={{ overflowY: "auto" }}>
          //         {this.props.talk.description}
          //       </Text>
          //       {this.props.talk.tags.length !== 0 && (
          //         <Box
          //           direction="row"
          //           gap="xsmall"
          //           wrap
          //           style={{ minHeight: "35px", marginTop: "5px" }}
          //         >
          //           {this.props.talk.tags.map((tag: Tag) => (
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
          //       {this.state.showLinkInput && (
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
          //             value={this.state.recordingLink}
          //             onChange={(e) => {
          //               this.setState({ recordingLink: e.target.value });
          //             }}
          //           />
          //           <CoreButton
          //             width="25%"
          //             height="32px"
          //             text="save"
          //             onClick={this.onSaveRecordingUrlClicked}
          //           />
          //         </Box>
          //       )}
          //     </Box>
          //     {this.getButtons()}
          //   </Box>
          //   {!this.props.talk.recording_link && !this.props.admin && (
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
        {this.props.admin && (
          <Box
            onClick={() => {
              this.toggleEdit();
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
        {this.props.admin && this.state.showEdit && (
          <EditTalkModal
            visible={this.state.showEdit}
            channel={null}
            talk={this.props.talk}
            onFinishedCallback={() => {
              this.toggleEdit();
              this.props.onEditCallback();
            }}
            onDeletedCallback={() => {
              this.toggleEdit();
              this.props.onEditCallback();
            }}
            onCanceledCallback={this.toggleEdit}
          />
        )}
      </Box>
    );
  }
}
