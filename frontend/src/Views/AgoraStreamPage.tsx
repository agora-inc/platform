import React, { useRef, useEffect, Component, createRef, FunctionComponent, useState } from "react";
import { Box, Grid, Text, Layer, Button } from "grommet";
import DescriptionAndQuestions from "../Components/Streaming/DescriptionAndQuestions";
import ChatBox from "../Components/Streaming/ChatBox";
import ChannelIdCard from "../Components/Channel/ChannelIdCard";
import Tag from "../Components/Core/Tag";
import Loading from "../Components/Core/Loading";
import { View } from "grommet-icons";
import { Video, VideoService } from "../Services/VideoService";
import VideoPlayerAgora from "../Components/Streaming/VideoPlayerAgora";
import AgoraRTC, { IAgoraRTCClient, ClientRole } from "agora-rtc-sdk-ng"


interface Props {
  location: { pathname: string; state: { video: Video } };
}

interface State {
  options: any;
  video: Video;
  viewCount: number;
  overlay: boolean;
}


interface Props {
  id: string;
  style: any;
  className: string;
  stream: any
}


const AgoraStream:FunctionComponent<Props> = (props) => {
  const [agoraClient] = useState(AgoraRTC.createClient({ mode: "live", codec: "vp8" }))
  const [localUser, setLocalUser] = useState({
        appId: 'f68f8f99e18d4c76b7e03b2505f08ee3',
        channel: "demo_channel_name",
        token: '006f68f8f99e18d4c76b7e03b2505f08ee3IADEeCqsTZ5JIaMM4mho/q1NiZznhY/WJg9uvVSfkLW/hI4kO3kAAAAAEACyc3Bi5zv/XwEAAQDnO/9f',
        role: 'host',
        uid: null
      } as any)
  const [localAudioTrack, setLocalAudioTrack] = useState(null as any)
  const [localVideoTrack, setLocalVideoTrack] = useState(null as any)

  const [state, setState] = useState({
      video: {
        id: -1,
        channel_id: -1,
        channel_name: "",
        channel_colour: "",
        name: "",
        description: "",
        tags: [],
        image_url: "",
        date: new Date(),
        views: 0,
        url: "",
        chat_id: -1,
        has_avatar: false,
      },
      viewCount: -1,
      overlay: false,
  })

  function setup() {
    agoraClient.setClientRole(localUser.role);
    agoraClient.on('user-published', onClient)
    join()
  }

  async function onClient(user: any, mediaType: string) {
    console.log(mediaType, user)
    console.log(agoraClient)
    // await this.rtc.client.subscribe(user, mediaType);
    // if(mediaType == 'video'){
    //   const remoteVideoTrack = user.videoTrack
    //   remoteVideoTrack.play('video')
    //   return
    // }
    // if(mediaType == 'audio') {
    //   const remoteAudioTrack = user.audioTrack;
    //   remoteAudioTrack.play();
    //   return
    // }
  }
  async function join(){
    console.log('joining...')
    let {appId, channel, token } = localUser
    const uid = await agoraClient.join(appId, channel, token, null)
    if(localUser.role !== 'host') {
      return
    }
    let _localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    let _localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

    setLocalAudioTrack(_localAudioTrack)
    setLocalVideoTrack(_localVideoTrack)

    await agoraClient.publish([_localAudioTrack, _localVideoTrack]);
  }


  useEffect(()=>{
    setup()
  }, [])

  return (
      <Box align="center">
        <Grid
          margin={{ top: "xlarge", bottom: "none" }}
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
            <VideoPlayerAgora style={{height: '90%'}} id='ad' stream={localVideoTrack} />

            <Box direction="row" justify="between" align="start">
              <p
                style={{
                  padding: 0,
                  margin: 0,
                  fontSize: "34px",
                  fontWeight: "bold",
                  // color: "black",
                  maxWidth: "65%",
                }}
              >
                {state.video!.name}
              </p>
              <Box
                direction="row"
                gap="small"
                justify="end"
                style={{ minWidth: "35%" }}
              >
                <ChannelIdCard channelName={state.video!.channel_name} />
                <Box direction="row" align="center" gap="xxsmall">
                  <View color="black" size="40px" />
                  {state.viewCount === -1 && (
                    <Loading color="grey" size={34} />
                  )}
                  {state.viewCount !== -1 && (
                    <Text size="34px" weight="bold">
                      {state.viewCount}
                    </Text>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          {/* <Box gridArea="chat" background="accent-2" round="small" /> */}
          {/* <ChatBox
            gridArea="chat"
            chatId={state.video.chat_id}
            viewerCountCallback={(viewCount: number) =>
              setState({...state, viewCount })
            }
          /> */}
        </Grid>
        <DescriptionAndQuestions
          gridArea="questions"
          tags={state.video.tags.map((t: any) => t.name)}
          description={state.video!.description}
          videoId={state.video.id}
          streamer={false}
          margin={{ top: "-20px" }}
        />
      </Box>
  )
}

export default AgoraStream
