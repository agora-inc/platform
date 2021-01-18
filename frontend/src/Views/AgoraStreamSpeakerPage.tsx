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
import AgoraRTM from 'agora-rtm-sdk';


interface Props {
  location: { pathname: string; state: { video: Video } };
  match: {params: {room_id: string}};
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


const AgoraStream:FunctionComponent<Props> = (props) => {
  const [agoraClient] = useState(AgoraRTC.createClient({ mode: "live", codec: "vp8" }))
  const [agoraMessageClient] = useState(AgoraRTM.createInstance(APP_ID_MESSAGING))
  const [messageChannel, setMessageChannel] = useState(null as any)
  const [localUser, setLocalUser] = useState({
        appId: APP_ID,
        roomId: "",
        token: '006f68f8f99e18d4c76b7e03b2505f08ee3IABpOfC4oGQL6yjRYJ0mrE9AKao79dSPOMHQtvvKvX5tl1t/ioMAAAAAEABXvn0Ft0wCYAEAAQC3TAJg',
        role: 'host',
        name: 'Prof. Patric',
        uid: 'abc-55441-u1'
      } as any)
  const [localAudioTrack, setLocalAudioTrack] = useState(null as any)
  const [localVideoTrack, setLocalVideoTrack] = useState(null as any)
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

  function setup() {
    agoraMessageClient.on('ConnectionStateChanged', (newState, reason) => {
      console.log('on connection state changed to ' + newState + ' reason: ' + reason);
    });
    agoraClient.setClientRole(localUser.role);
    join()
  }

  async function get_token_for_room(roomId: string) {
    // TODO: make api call to get token
    return localUser.token
  }

  async function join(){
    console.log('joining...')
    let {appId , uid} = localUser
    let roomId = props.match.params.room_id
    let token = await get_token_for_room(roomId)

    try{
      await agoraClient.join(appId, roomId, token, uid)

      await agoraMessageClient.login({ uid })
      let _messageChannel = agoraMessageClient.createChannel(roomId)
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
                {localUser.name}
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
