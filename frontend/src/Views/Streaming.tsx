import React, { Component, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Box, Heading, Button, Grid, Text } from "grommet";
import { View } from "grommet-icons";
import { UserService } from "../Services/UserService";
import { Stream, StreamService } from "../Services/StreamService";
import StreamerVideoPlayer from "../Components/Streaming/OldStuff/StreamerVideoPlayer";
import DescriptionAndQuestions from "../Components/Streaming/OldStuff/DescriptionAndQuestions";
import { ChatBox } from "../Components/Streaming/OldStuff/ChatBox";
import AsyncButton from "../Components/Core/AsyncButton";
import "../../Styles/streaming.css";
import adapter from "webrtc-adapter";
import { WebRTCAdaptor } from "../Streaming/webrtc_adaptor";
import { antmediaWebSocketUrl } from "../config";
import Loading from "../Components/Core/Loading";
import { useStore } from "../store";
import { useAuth0 } from "@auth0/auth0-react";

const initializeWebRTCAdaptor = () => {
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

  return new WebRTCAdaptor({
    websocket_url: antmediaWebSocketUrl,
    mediaConstraints: mediaConstraints,
    peerconnection_config: pc_config,
    sdp_constraints: sdpConstraints,
    localVideoId: "local",
    debug: true,
    callback: (info: any, obj: any) => {
      // console.log(info, obj);
    },
    callbackError: (error: any, message: any) => {
      // console.log(error, message);
    },
  });
};

interface MediaDevices {
  getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
}

interface Props {
  location: { state: { stream: Stream } };
}

export const Streaming = (props: Props) => {
  const [webrtc, setWebrtc] = useState<WebRTCAdaptor | null>(null);
  const [title, setTitle] = useState(props.location.state.stream.name);
  const [description, setDesciption] = useState(
    props.location.state.stream.description
  );
  const [tags, setTags] = useState(props.location.state.stream.tags);
  const [streamId, setStreamId] = useState(props.location.state.stream.id);
  const [streaming, setStreaming] = useState(false);
  const [toHome, setToHome] = useState(false);
  const [viewCount, setViewCount] = useState(-1);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setWebrtc(initializeWebRTCAdaptor());
    return cleanup;
  }, []);

  const archive = async (callback: () => void, del?: boolean) => {
    if (del === undefined) {
      del = !streaming;
    }
    const token = await getAccessTokenSilently();
    StreamService.archiveStream(streamId, del, callback, token);
  };

  const cleanup = (callback?: () => void) => {
    if (callback === undefined) {
      callback = () => {};
    }
    webrtc && webrtc.closeStream && webrtc.closeStream();
    webrtc && webrtc.closeWebSocket && webrtc.closeWebSocket();
    archive(callback);
  };

  const startStreaming = (callback: any) => {
    setStreaming(true);
    callback();
    webrtc && webrtc.publish && webrtc.publish(streamId.toString(), null);
    // users.goLive(username, () => {
    //   setState({ streaming: true }, () => {
    //     callback();
    //   });
    // });
  };

  const stopStreaming = (callback: any) => {
    setStreaming(false);
    webrtc && webrtc.stop && webrtc.stop("agora1");
    cleanup(() => {
      callback();
      setToHome(true);
    });
    // StreamService.archiveStream(streamId, () => {
    //   setState({ streaming: false }, () => {
    //     callback();
    //     setState({
    //       toHome: true,
    //     });
    //   });
    // });
  };

  const startRecording = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 1280,
        height: 720,
      },
      audio: true,
    });
    (document.querySelector("video#local") as HTMLMediaElement).srcObject =
      localStream;
  };

  const stopRecording = () => {
    const videoElem = document.querySelector("video#local") as HTMLMediaElement;
    const stream = videoElem.srcObject;
    const tracks = (stream as MediaStream).getTracks();

    tracks.forEach(function (track) {
      // console.log(track);
      track.stop();
    });

    videoElem.srcObject = null;
  };

  const startSharingScreen = async () => {
    const screenStream = await (
      navigator.mediaDevices as unknown as MediaDevices
    ).getDisplayMedia();
    (document.querySelector("video#screen") as HTMLMediaElement).srcObject =
      screenStream;
  };

  const stopSharingScreen = () => {
    const videoElem = document.querySelector(
      "video#screen"
    ) as HTMLMediaElement;
    const stream = videoElem.srcObject;
    const tracks = (stream as MediaStream).getTracks();
    tracks.forEach(function (track) {
      // console.log(track);
      track.stop();
    });
    // videoElem.srcObject = null;
  };

  const goLiveButton = () => {
    return (
      <AsyncButton
        color="#61EC9F"
        label="Go live"
        onClick={startStreaming}
        height="40px"
        width="130px"
        fontColor="black"
      />
    );
  };

  const viewerCountAndStopButton = () => {
    return (
      <Box direction="row" align="center" gap="xsmall">
        <AsyncButton
          color="#FF4040"
          label="End stream"
          onClick={stopStreaming}
          height="40px"
          width="150px"
          fontColor="white"
        />
        <View color="black" size="40px" />
        {viewCount === -1 && <Loading color="grey" size={34} />}
        {viewCount !== -1 && (
          <Text size="34px" weight="bold">
            {viewCount}
          </Text>
        )}
      </Box>
    );
  };

  const blinkingRedLight = () => {
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

  if (toHome) {
    return <Redirect to="/" />;
  }

  return (
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
            onScreenSharingEnabled={startSharingScreen}
            onScreenSharingDisabled={stopSharingScreen}
          />
          <Box direction="row" justify="between" align="start">
            <Box gap="xsmall" direction="row" align="center">
              {streaming && blinkingRedLight()}
              <Text size="34px" weight="bold">
                {title}
              </Text>
            </Box>
            {streaming ? viewerCountAndStopButton() : goLiveButton()}
          </Box>
        </Box>
        <ChatBox
          gridArea="chat"
          chatId={streamId}
          viewerCountCallback={setViewCount}
        />
      </Grid>
      <DescriptionAndQuestions
        gridArea="questions"
        description={description}
        streamId={1}
        streamer={true}
        tags={tags.map((t: any) => t.name)}
        margin={{ top: "-20px" }}
      />
    </Box>
  );
};
