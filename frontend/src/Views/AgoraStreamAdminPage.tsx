import React, { useRef, useEffect, Component, createRef, FunctionComponent, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Grid, Text, Layer, Button } from "grommet";
import DescriptionAndQuestions from "../Components/Streaming/DescriptionAndQuestions";
import ChatBox from "../Components/Streaming/ChatBox";
import ChannelIdCard from "../Components/Channel/ChannelIdCard";
import Tag from "../Components/Core/Tag";
import Loading from "../Components/Core/Loading";
import { View } from "grommet-icons";
import { Video, VideoService } from "../Services/VideoService";
import { StreamService } from "../Services/StreamService";
import { TalkService } from "../Services/TalkService";
import VideoPlayerAgora from "../Components/Streaming/VideoPlayerAgora";
import AgoraRTC, { IAgoraRTCClient, ClientRole } from "agora-rtc-sdk-ng"
import AgoraRTM from 'agora-rtm-sdk';


interface Props {
  location: { pathname: string; state: { video: Video } };
  match: {params: {talk_id: string}};
}

interface State {
  options: any;
  video: Video;
  viewCount: number;
  overlay: boolean;
}
interface Message{
  senderId: string;
  text: string
}
const APP_ID = 'f68f8f99e18d4c76b7e03b2505f08ee3'
const APP_ID_MESSAGING = 'c80c76c5fa6348d3b6c022cb3ff0fd38'

function getUserId(talkId:string, userId?:string|null){
  let key = userId || talkId
  let uid = window.localStorage.getItem(key)
  if(!uid) {
    uid = `${userId?'reg':'guest'}-${key}-${Math.floor(Date.now()/1000)}`
    window.localStorage.setItem(key, uid)
  }

  return uid
}

function useQuery(){
  return new URLSearchParams(useLocation().search)
}


const AgoraStream:FunctionComponent<Props> = (props) => {
  const videoContainer = useRef<HTMLDivElement>(null)
  const [agoraClient] = useState(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }))
  const [agoraScreenShareClient] = useState(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }))
  const [agoraMessageClient] = useState(AgoraRTM.createInstance(APP_ID_MESSAGING))
  const [messageChannel, setMessageChannel] = useState(null as any)
  const [localUser, setLocalUser] = useState({
        appId: APP_ID,
        talkId: "",
        role: 'host',
        name: 'Prof. Patric',
        uid: getUserId(props.match.params.talk_id, useQuery().get('dummy'))
      } as any)
  const [talkDetail, setTalkDetail] = useState({} as any)
  const [localAudioTrack, setLocalAudioTrack] = useState(null as any)
  const [localVideoTrack, setLocalVideoTrack] = useState(null as any)
  const [localScreenTrack, setLocalScreenTrack] = useState(null as any)
  const [messages, setMessages] = useState<Message[]>([])

  const [state, setState] = useState({
      video: {
        id: -1,
        channel_id: -1,
        channel_name: "",
        channel_colour: "",
        name: "Speaker",
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

  function toggleFullscreen() {
    let fullscreenEl = document.fullscreenElement
    if(fullscreenEl) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      return
    }

    let element = videoContainer.current!
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }

  }
  function leave() {

  }

  async function setup() {
    const talkId = props.match.params.talk_id
    let talk = await get_talk_by_id(talkId)
    setTalkDetail(talk)
    agoraMessageClient.on('ConnectionStateChanged', (newState, reason) => {
      console.log('on connection state changed to ' + newState + ' reason: ' + reason);
    });
    // Setting client as Speaker
    agoraClient.setClientRole(localUser.role);
    agoraScreenShareClient.setClientRole(localUser.role);
    join()
  }

  async function get_token_for_talk(talkId: string) {
    // Get dynamic access token
    return new Promise((res:any, rej:any)=>{
      StreamService.getToken(talkId, 1, Math.floor(Date.now()/1000 + 600 ), null, localUser.uid, (tk:string)=>{
        if(tk)
          return res(tk)
        rej()
      })

    })
  }

  async function get_talk_by_id(talkId: string) {
    // Fetch talk details
    return new Promise((res:any, rej:any)=>{
      TalkService.getTalkById(parseInt(talkId), (tk:string)=>{
        if(tk)
          return res(tk)
        rej()
      })

    })
  }

  async function join(){
    console.log('joining...')
    let {appId , uid} = localUser
    let talkId = props.match.params.talk_id
    let token = await get_token_for_talk(talkId)
    let screenSharetoken = await get_token_for_talk(`${talkId}-screen`)

    try{
      // @ts-ignore
      await agoraClient.join(appId, talkId, token, uid)
      // @ts-ignore
      await agoraScreenShareClient.join(appId, `${talkId}-screen`, screenSharetoken, uid)

      await agoraMessageClient.login({ uid })
      let _messageChannel = agoraMessageClient.createChannel(talkId)
      await _messageChannel.join()
      _messageChannel.on('ChannelMessage', on_message)
      setMessageChannel(_messageChannel)

      let _localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      let _localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

      setLocalAudioTrack(_localAudioTrack)
      setLocalVideoTrack(_localVideoTrack)

      await agoraClient.publish([_localAudioTrack, _localVideoTrack]);
    }catch(e) {
      console.log(e)
    }
  }
  async function stop_share_screen() {
      console.log("sharing stopped")
      await agoraScreenShareClient.unpublish()
  }
  async function share_screen() {
    // Create a new stream for the screen share.
    let {appId , uid} = localUser
    let talkId = props.match.params.talk_id

    try{
      const config = {
        // Set the encoder configurations. For details, see the API description.
        encoderConfig: "1080p_1",
        screenSourceType: 'screen'
      }
      if(localScreenTrack) {
        localScreenTrack.stop()
      }
      // @ts-ignore
      var _localScreenTrack = await AgoraRTC.createScreenVideoTrack(config);
      _localScreenTrack.on('track-ended', stop_share_screen)
      console.log(_localScreenTrack)

      setLocalScreenTrack(_localScreenTrack)

      await agoraScreenShareClient.publish(_localScreenTrack);
    }catch(e) {
      console.log(agoraScreenShareClient)
      console.log("Error sharing screen", e)
    }
  }

  // async function stop_sharing_video(){
  //   //PLACEHOLDER
  // }

  // async function stop_sharing_screen(){
  //   //PLACEHOLDER
  // }

  // async function share_screen_and_audio(){
  //   // Check if the browser supports screen sharing without an extension.
  //   // Number.tem = ua.match(/(Chrome(?=\/))\/?(\d+)/i);
  //   // if(parseInt(tem[2]) >= 72  && navigator.mediaDevices.getUserMedia ) {
  //   // // Create the stream for screen sharing.
  //   //     screenStream = AgoraRTC.createStream({
  //   //         streamID: uid,
  //   //         audio: false,
  //   //         video: false,
  //   //         screen: true,
  //   //     });
  //   // }

  //   try{
  //     var screenStream = AgoraRTC.createScreenVideoTrack({}, "enable");
  //     await agoraClient.publish([screenStream]);

  //   }catch(e) {
  //     console.log(e)
  //   }




  // }

  // async function stop_share_screen_and_audio(){
  //   //PLACEHOLDER
  // }

  async function on_message(msg:any, senderId:string){
    setMessages((m)=>[...m, {senderId, text: msg.text}])
  }
  async function send_message(evt:React.KeyboardEvent<HTMLInputElement>){
    if(evt.key !== 'Enter') return
    // @ts-ignore
    let text = evt.target.value
    // @ts-ignore
    evt.target.value = ''
    try{
      setMessages([...messages, {senderId: localUser.uid, text: text}])
      await messageChannel.sendMessage({text})
    }catch{
      console.log('error sending message')
    }
  }

  useEffect(()=>{
    setup()
    return ()=>{
      leave()
    }
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
            <Box ref={videoContainer} className={`video-holder ${localUser.role}`}
              style={{height: '90%', position: 'relative'}}>
              <VideoPlayerAgora id='speaker' stream={localVideoTrack} />
              <Button className='full-screen-button' label="Fullscreen" primary size='small' onClick={toggleFullscreen} />
            </Box>

            <Box direction="row" justify="between" align="start">
              <p
                style={{
                  padding: 0,
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: "bold",
                  // color: "black",
                  maxWidth: "65%",
                }}
              >
                {talkDetail.name}
              </p>
              <br />
              <p
                style={{
                  padding: 0,
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: "bold",
                  // color: "black",
                  maxWidth: "65%",
                }}
              >
                Speaker: {talkDetail.talk_speaker}
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
          <Box gridArea="chat" background="accent-2" round="small">
            {messages.map((msg, i)=>(
                <Box key={i}>
                  <span style={{textAlign: msg.senderId == localUser.uid?'right': 'left'}}>{msg.text}</span>
                </Box>
              ))}
            <input type='textbox' onKeyUp={send_message} placeholder='type mesasge and press enter.' />
          </Box>
        </Grid>
        <Button
          label="Share screen"
          onClick={share_screen}
          style={{
            width: 90,
            height: 35,
            fontSize: 15,
            fontWeight: "bold",
            padding: 0,
            // margin: 6,
            backgroundColor: "#F2F2F2",
            border: "none",
            borderRadius: 7,
          }}
        />
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
