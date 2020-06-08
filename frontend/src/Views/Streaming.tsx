import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Box, Heading, Button, Grid, Text } from "grommet";
import { View } from "grommet-icons";
import { UserService } from "../Services/UserService";
import { StreamService } from "../Services/StreamService";
import StreamerVideoPlayer from "../Components/Streaming/StreamerVideoPlayer";
import DescriptionAndQuestions from "../Components/Streaming/DescriptionAndQuestions";
import ChatBox from "../Components/Streaming/ChatBox";
import AsyncButton from "../Components/Core/AsyncButton";
import "../Styles/streaming.css";
import adapter from "webrtc-adapter";
import { WebRTCAdaptor } from "../Streaming/webrtc_adaptor";
import { antmediaWebSocketUrl } from "../config";
import Loading from "../Components/Core/Loading";

const users = UserService;

interface Props {
  location: any;
}

interface State {
  title: string;
  description: string;
  streamId: number;
  tags: string[];
  streaming: boolean;
  username: string | null;
  toHome: boolean;
  viewCount: number;
}

interface MediaDevices {
  getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
}

export default class Streaming extends Component<Props, State> {
  private webrtc: WebRTCAdaptor | null;
  constructor(props: any) {
    super(props);
    this.state = {
      title: this.props.location.state.stream.name,
      description: this.props.location.state.stream.description,
      streamId: this.props.location.state.stream.id,
      tags: this.props.location.state.stream.tags,
      streaming: false,
      username: users.getCurrentUser(),
      toHome: false,
      viewCount: -1,
    };
    this.webrtc = null;
  }

  componentWillMount() {
    this.initializeWebRTCAdaptor();
  }

  componentWillUnmount() {
    console.log("UNMOUNTING");
    this.webrtc?.closeStream();
    this.webrtc?.closeWebSocket();
    StreamService.archiveStream(
      this.state.streamId,
      !this.state.streaming,
      () => {}
    );
  }

  initializeWebRTCAdaptor = () => {
    const mediaConstraints = {
      video: {
        width: 1280,
        height: 720,
      },
      audio: true,
    };
    const pc_config = null;
    const sdpConstraints = {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false,
    };

    this.webrtc = new WebRTCAdaptor({
      websocket_url: antmediaWebSocketUrl,
      mediaConstraints: mediaConstraints,
      peerconnection_config: pc_config,
      sdp_constraints: sdpConstraints,
      localVideoId: "local",
      debug: true,
      callback: (info: any, obj: any) => {
        console.log(info, obj);
      },
      callbackError: (error: any, message: any) => {
        console.log(error, message);
      },
    });
  };

  startStreaming = (callback: any) => {
    this.setState({ streaming: true }, () => {
      callback();
      this.webrtc?.publish(this.state.streamId.toString(), null);
    });
    // users.goLive(this.state.username, () => {
    //   this.setState({ streaming: true }, () => {
    //     callback();
    //   });
    // });
  };

  stopStreaming = (callback: any) => {
    this.setState({ streaming: false }, () => {
      this.webrtc?.stop("agora1");
      this.webrtc?.closeStream();
      this.webrtc?.closeWebSocket();
      StreamService.archiveStream(this.state.streamId, false, () => {
        callback();
        this.setState({
          toHome: true,
        });
      });
    });
    // StreamService.archiveStream(this.state.streamId, () => {
    //   this.setState({ streaming: false }, () => {
    //     callback();
    //     this.setState({
    //       toHome: true,
    //     });
    //   });
    // });
  };

  startRecording = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 1280,
        height: 720,
      },
      audio: true,
    });
    (document.querySelector(
      "video#local"
    ) as HTMLMediaElement).srcObject = localStream;
  };

  stopRecording = () => {
    const videoElem = document.querySelector("video#local") as HTMLMediaElement;
    const stream = videoElem.srcObject;
    const tracks = (stream as MediaStream).getTracks();

    tracks.forEach(function (track) {
      console.log(track);
      track.stop();
    });

    videoElem.srcObject = null;
  };

  startSharingScreen = async () => {
    const screenStream = await ((navigator.mediaDevices as unknown) as MediaDevices).getDisplayMedia();
    (document.querySelector(
      "video#screen"
    ) as HTMLMediaElement).srcObject = screenStream;
  };

  stopSharingScreen = () => {
    const videoElem = document.querySelector(
      "video#screen"
    ) as HTMLMediaElement;
    const stream = videoElem.srcObject;
    const tracks = (stream as MediaStream).getTracks();
    tracks.forEach(function (track) {
      console.log(track);
      track.stop();
    });

    // videoElem.srcObject = null;
  };

  goLiveButton = () => {
    return (
      <AsyncButton
        color="#61EC9F"
        label="Go live"
        onClick={this.startStreaming}
        height="40px"
        width="130px"
        fontColor="black"
      />
    );
  };

  viewerCountAndStopButton = () => {
    return (
      <Box direction="row" align="center" gap="xsmall">
        <AsyncButton
          color="#FF4040"
          label="End stream"
          onClick={this.stopStreaming}
          height="40px"
          width="150px"
          fontColor="white"
        />
        <View color="black" size="40px" />
        {this.state.viewCount === -1 && <Loading color="grey" size={34} />}
        {this.state.viewCount !== -1 && (
          <Text size="34px" weight="bold">
            {this.state.viewCount}
          </Text>
        )}
      </Box>
    );
  };

  blinkingRedLight = () => {
    return (
      <div
        className="blink"
        style={{
          height: 25,
          width: 25,
          borderRadius: 12.5,
          backgroundColor: "#FF4040",
          margin: 0,
          padding: 0,
        }}
      />
    );
  };

  render() {
    return this.state.toHome ? (
      <Redirect to="/" />
    ) : (
      <Box align="center" margin={{ bottom: "small" }}>
        <Grid
          margin={{ top: "xlarge", bottom: "medium" }}
          // rows={["streamViewRow1", "medium"]}
          rows={["streamViewRow1"]}
          columns={["streamViewColumn1", "streamViewColumn2"]}
          gap="medium"
          areas={[
            { name: "player", start: [0, 0], end: [0, 0] },
            { name: "chat", start: [1, 0], end: [1, 0] },
            // { name: "questions", start: [0, 1], end: [1, 1] },
          ]}
        >
          <Box gridArea="player" justify="between" gap="small">
            <StreamerVideoPlayer
              width="100%"
              height="90%"
              onScreenSharingEnabled={this.startSharingScreen}
              onScreenSharingDisabled={this.stopSharingScreen}
            />
            <Box direction="row" justify="between" align="start">
              <Box gap="xsmall" direction="row" align="center">
                {this.state.streaming && this.blinkingRedLight()}
                <Text size="34px" weight="bold">
                  {this.state.title}
                </Text>
              </Box>
              {this.state.streaming
                ? this.viewerCountAndStopButton()
                : this.goLiveButton()}
            </Box>
          </Box>
          <ChatBox
            gridArea="chat"
            chatId={this.state.streamId}
            viewerCountCallback={(viewCount: number) =>
              this.setState({ viewCount })
            }
          />
        </Grid>
        <DescriptionAndQuestions
          gridArea="questions"
          description={this.state.description}
          streamId={1}
          streamer={true}
          tags={this.state.tags.map((t: any) => t.name)}
          margin={{ top: "-20px" }}
        />
      </Box>
    );
  }
}
