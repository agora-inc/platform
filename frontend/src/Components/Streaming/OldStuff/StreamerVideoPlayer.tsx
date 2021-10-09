import React, { Component } from "react";
import { Box, Button, Heading, Text } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { faSlash } from "@fortawesome/free-solid-svg-icons";

interface Props {
  width: string;
  height: string;
  onScreenSharingEnabled: any;
  onScreenSharingDisabled: any;
}

interface State {
  videoEnabled: boolean;
  audioEnabled: boolean;
  screenSharingEnabled: boolean;
}

export default class StreamerVideoPlayer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      videoEnabled: true,
      audioEnabled: true,
      screenSharingEnabled: false,
    };
  }

  toggleAudio = () => {
    this.setState(
      {
        audioEnabled: !this.state.audioEnabled,
      },
      () => {
        let videoElem = document.querySelector(
          "video#local"
        ) as HTMLMediaElement;
        let stream = videoElem.srcObject;
        let tracks = (stream as MediaStream).getTracks();
        tracks.forEach(function (track) {
          if (track.kind === "audio") {
            track.enabled = !track.enabled;
          }
        });
      }
    );
  };

  toggleVideo = () => {
    this.setState(
      {
        videoEnabled: !this.state.videoEnabled,
      },
      () => {
        let videoElem = document.querySelector(
          "video#local"
        ) as HTMLMediaElement;
        let stream = videoElem.srcObject;
        let tracks = (stream as MediaStream).getTracks();
        tracks.forEach(function (track) {
          if (track.kind === "video") {
            track.enabled = !track.enabled;
          }
        });
      }
    );
  };

  startScreenSharing = () => {
    this.setState(
      {
        screenSharingEnabled: true,
      },
      () => {
        this.props.onScreenSharingEnabled();
      }
    );
  };

  stopScreenSharing = () => {
    this.props.onScreenSharingDisabled();
    this.setState({
      screenSharingEnabled: false,
    });
  };

  toggleScreenSharing = () => {
    this.state.screenSharingEnabled
      ? this.stopScreenSharing()
      : this.startScreenSharing();
  };

  controlButtons = () => {
    return (
      <Box
        direction="row"
        gap="small"
        style={{
          // marginTop: -70,
          // marginLeft: 20,
          zIndex: 10,
          position: "absolute",
          bottom: 20,
          left: 20,
        }}
      >
        {this.toggleVideoButton()}
        {this.toggleAudioButton()}
        {this.shareScreenButton()}
      </Box>
    );
  };

  toggleAudioButton = () => {
    // console.log(document.getElementById("local")!.clientHeight);
    return (
      <Box
        background={this.state.audioEnabled ? "red" : "color1"}
        align="center"
        justify="center"
        style={{
          height: 50,
          width: 50,
          borderRadius: 25,
        }}
        onClick={this.toggleAudio}
        focusIndicator={false}
        // hoverIndicator={true}
      >
        <FontAwesomeIcon
          icon={this.state.audioEnabled ? faMicrophoneSlash : faMicrophone}
          color="white"
        />
      </Box>
    );
  };

  toggleVideoButton = () => {
    return (
      <Box
        background={this.state.videoEnabled ? "red" : "color1"}
        align="center"
        justify="center"
        style={{
          height: 50,
          width: 50,
          borderRadius: 25,
        }}
        onClick={this.toggleVideo}
        focusIndicator={false}
      >
        <FontAwesomeIcon
          icon={this.state.videoEnabled ? faVideoSlash : faVideo}
          color="white"
        />
      </Box>
    );
  };

  shareScreenButton = () => {
    return (
      <Box
        background={this.state.screenSharingEnabled ? "red" : "color1"}
        align="center"
        justify="center"
        style={{
          height: 50,
          width: 50,
          borderRadius: 25,
        }}
        onClick={this.toggleScreenSharing}
        focusIndicator={false}
      >
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon icon={faClone} color="white" />
          {this.state.screenSharingEnabled && (
            <FontAwesomeIcon icon={faSlash} color="white" />
          )}
        </span>
      </Box>
    );
  };

  calculateVerticalOffsetRatio = () => {
    const videoElem = document.querySelector("video#local") as HTMLElement;
    const originalHeight = videoElem.offsetHeight;
    const originalWidth = videoElem.offsetWidth;
    return originalHeight / originalWidth;
  };

  render() {
    return (
      <Box
        width={this.props.width}
        height={this.props.height}
        background="black"
        style={{
          minWidth: this.props.width,
          minHeight: this.props.height,
          borderRadius: 15,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <video
          id="local"
          autoPlay
          muted
          width={this.state.screenSharingEnabled ? "30%" : "100%"}
          style={{
            borderRadius: 15,
            zIndex: 5,
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        {this.state.screenSharingEnabled && (
          <Box justify="center" align="center" width="100%" height="100%">
            <video
              id="screen"
              autoPlay
              width="0px"
              style={{
                borderRadius: 15,
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            ></video>
            <Text color="white">Sharing screen</Text>
          </Box>
        )}
        {this.controlButtons()}
      </Box>
    );
  }
}
