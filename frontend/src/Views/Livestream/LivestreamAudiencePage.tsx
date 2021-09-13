import React, { useRef, useEffect, Component, createRef, FunctionComponent, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Grid, Text, Layer, Button, TextInput } from "grommet";
import DescriptionAndQuestions from "../../Components/Streaming/DescriptionAndQuestions";
import ChatBox from "../../Components/Streaming/ChatBox";
import ChannelIdCard from "../../Components/Channel/ChannelIdCard";
import Tag from "../../Components/Core/Tag";
import Loading from "../../Components/Core/Loading";
import { View } from "grommet-icons";
import { Video, VideoService } from "../../Services/VideoService";
import { StreamService } from "../../Services/StreamService";
import { TalkService } from "../../Services/TalkService";
import VideoPlayerAgora from "../../Components/Streaming/VideoPlayerAgora";
import AgoraRTC, { IAgoraRTCClient, ClientRole } from "agora-rtc-sdk-ng"
import AgoraRTM from 'agora-rtm-sdk';
import {db, API} from '../../Services/FirebaseService'
import { textToLatex } from "../../Components/Core/LatexRendering";

import '../../Styles/all-stream-page.css'
import { FaMicrophone } from "react-icons/fa";
import Clapping from "../../Components/Streaming/Clapping";
import { ChannelService } from "../../Services/ChannelService";
import PDFViewer from "../../Components/PDFViewer";


interface Props {
  // location: { pathname: string; state: { video: Video } };
  // match: {params: {talk_id: string}};
  talkId: number;
}

interface State {
  options: any;
  video: Video;
  viewCount: number;
  overlay: boolean;
}
interface Message{
  senderId: string;
  text: string;
  name?: string;
  first: boolean;
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
interface Control {
  mic: boolean
}
AgoraRTC.setLogLevel(4)


const AgoraStreamCall:FunctionComponent<Props> = (props) => {
  const [storedName, setStoredName] = useState(getLocalName(props.talkId.toString())||'')
  const videoContainer = useRef<HTMLDivElement>(null)
  const [agoraClient] = useState(AgoraRTC.createClient({ mode: "live", codec: "vp8",  }))
  const [agoraScreenShareClient] = useState(AgoraRTC.createClient({ mode: "live", codec: "vp8" }))
  const [agoraMessageClient] = useState(AgoraRTM.createInstance(APP_ID_MESSAGING))
  const [messageChannel, setMessageChannel] = useState(null as any)
  const [localUser, setLocalUser] = useState({
        appId: APP_ID,
        talkId: "",
        role: 'audience',
        name: 'Prof. Patric',
        uid: getUserId(props.talkId.toString(), useQuery().get('dummy'))
      } as any)
  const [talkDetail, setTalkDetail] = useState({} as any)
  const [localAudioTrack, setLocalAudioTrack] = useState(null as any)
  const [localVideoTrack, setLocalVideoTrack] = useState(null as any)
  const [remoteVideoTrack, setRemoteVideoTrack] = useState([] as any[])
  const [remoteScreenTrack, setRemoteScreenTrack] = useState(null as any)
  const [remoteAudioTrack, setRemoteAudioTrack] = useState(null as any)
  const [messages, setMessages] = useState<Message[]>([])
  const [isScreenAvailable, setScreenAvailability] = useState(false as boolean)

  const [talkStatus, setTalkStatus] = useState('NOT_STARTED' as string)
  const [isClapping, setClapping] = useState('')
  const [hasMicRequested, setMicRequest] = useState('')
  const [isUnpublishFromRemote, unpublishFromRemote] = useState('')
  const [slideUrl, setSlideUrl] = useState('')
  const [isSlideVisible, toggleSlide] = useState(false)

  const [slideShareId, setSlideShareId] = useState('')
  
  const [talkId, setTalkId] = useState('')
  const [callControl, setCallControl] = useState({
    mic: false
  } as Control)


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


  async function setup() {
    console.log(props)
    const talkId = props.talkId
    let talk = await get_talk_by_id(talkId.toString())
    setTalkDetail(talk)
    // Setting client as Audience
    agoraClient.setClientRole(localUser.role);
    agoraScreenShareClient.setClientRole(localUser.role);
    agoraClient.on('user-published', onClient)
    agoraClient.on('user-unpublished', onClientStop)
    agoraScreenShareClient.on('user-published', onScreenShare)
    agoraScreenShareClient.on('user-unpublished', onScreenShareStop)
    join()
  }

  async function onClient(user: any, mediaType: "audio" | "video") {
    await agoraClient.subscribe(user, mediaType);
    setRemoteVideoTrack([...agoraClient.remoteUsers])
    if(mediaType == 'video'){
      return
    }
    if(mediaType == 'audio') {
      const _remoteAudioTrack = user.audioTrack;
      _remoteAudioTrack.play();
      setRemoteAudioTrack(_remoteAudioTrack)
      return
    }
  }
  async function onClientStop(user: any, mediaType: "audio" | "video") {
    console.log("left", agoraClient.remoteUsers)
    setTimeout(()=>{
      setRemoteVideoTrack([...agoraClient.remoteUsers])
    }, 200)
    if(mediaType == 'video'){
      return
    }
    if(mediaType == 'audio') {
      setRemoteAudioTrack(null)
      return
    }
  }
  async function onScreenShare(user: any, mediaType: "audio" | "video") {
    await agoraScreenShareClient.subscribe(user, mediaType);
    if(mediaType == 'video'){
      setRemoteScreenTrack(user.videoTrack)
      setScreenAvailability(true)
      console.log("Getting screen")
      return
    }
  }
  async function onScreenShareStop(user: any, mediaType: "audio" | "video") {
    setScreenAvailability(false)
    setRemoteScreenTrack(null)
    await agoraScreenShareClient.unsubscribe(user, mediaType);
    console.log("stop share")
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


  async function join_live_chat(){
    agoraMessageClient.on('ConnectionStateChanged', (newState, reason) => {
      console.log('on connection state changed to ' + newState + ' reason: ' + reason);
    });
    console.log('joining live chat...')
    let {appId , uid} = localUser
    let talkId = props.talkId.toString()

    try{
      await agoraMessageClient.login({ uid })
      let _messageChannel = agoraMessageClient.createChannel(talkId)
      await agoraMessageClient.addOrUpdateLocalUserAttributes({name: storedName})
      await _messageChannel.join()
      _messageChannel.on('ChannelMessage', on_message)
      setMessageChannel(_messageChannel)
    }catch(e) {
      console.log(e)
    }
  }
  async function join(){
    console.log('joining...')
    let {appId , uid} = localUser
    let talkId = props.talkId.toString()
    let token = await get_token_for_talk(talkId)
    let screenShareToken = await get_token_for_talk(`${talkId}-screen`)

    try{
      // @ts-ignore
      await agoraClient.join(appId, talkId, token, uid)
      // @ts-ignore
      await agoraScreenShareClient.join(appId, `${talkId}-screen`, screenShareToken, uid)

    }catch(e) {
      console.log(e)
    }
  }





  
//
//
////
//
//// Remy: checkpoint
//// Remy: checkpoint
//// Remy: checkpoint

//
//
// WIP: INTEGRATING "REQUEST MIC FEATURE" into LivestreamAudiencePAge
//
//
//
//
//
//
////
//
//// Remy: checkpoint
//// Remy: checkpoint
//// Remy: checkpoint

//
//
// WIP: INTEGRATING "REQUEST MIC FEATURE" into LivestreamAudiencePAge
//
//
//
//



















  useEffect(()=>{
    unpublish_microphone()
  }, [isUnpublishFromRemote])

  async function unpublish_microphone(){
    console.log('unp mic', localAudioTrack)
    if(hasMicRequested) {
      API.removeRequest(hasMicRequested)
    }

    setMicRequest('')
    if(localAudioTrack) {
      localAudioTrack.stop()

      await agoraClient.unpublish(localAudioTrack);
      setLocalAudioTrack(null)
      await agoraClient.setClientRole(localUser.role);
      setCallControl({...callControl, mic: false})
    }
  }

  async function publish_microphone(){
    await agoraClient.setClientRole('host');
    let _localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    setLocalAudioTrack(_localAudioTrack)
    await agoraClient.publish(_localAudioTrack);
    setCallControl({...callControl, mic: true})
  }
  async function on_message(msg:any, senderId:string){
    let attr = await agoraMessageClient.getUserAttributes(senderId)
    setMessages((m) => {
      let first = m.length === 0 ? true : m[m.length-1].senderId !== senderId
      return [...m, {senderId, text: msg.text, name: attr.name ||'', first: first}]
    })
  }
  async function send_message(evt:React.KeyboardEvent<HTMLInputElement>){
    if(evt.key !== 'Enter') return
    // @ts-ignore
    let text = evt.target.value
    // @ts-ignore
    evt.target.value = ''
    try{
      let first = messages.length === 0 ? true : messages[messages.length-1].senderId !== localUser.uid
      setMessages([...messages, {senderId: localUser.uid, text: text, name: 'Me', first: first}])
      await messageChannel.sendMessage({text})
    }catch{
      console.log('error sending message')
    }
  }

  useEffect(()=>{
    (async ()=>{
      let {url} = await TalkService.getSlides(Number(props.talkId))
      setSlideUrl(url)
      setTalkId(props.talkId.toString())
      join_live_chat()
    })()
  }, [])

  useEffect(()=>{
    if(!talkId) {
      return
    }
    let unsubs = db.collection('talk').doc(talkId).onSnapshot(doc=>{
      if(!doc.exists){
        return
      }
      let data = doc.data() as any
      if(data.status === 'STARTED') {
        setTalkStatus(data.status)
        setup()
      }
      if(data.status === 'ENDED') {
        setTalkStatus(data.status)
      }
      if(data.clapping_status) {
        setClapping(data.clapping_status)
      }else{
        setClapping('')
      }
    })

    let request_unsubs = db.collection('requests').where('requester_id', '==', localUser.uid).onSnapshot(snaps=>{
      let req = snaps.docs.filter(d=>d.exists).map(d=>{
        let _d = d.data()
        _d.id = d.id
        return _d
      }).filter(d=>d.requester_id === localUser.uid).find(d=>d.status === 'GRANTED' || d.status === 'REQUESTED')

      
      setMicRequest('')
      if(req) {
        setMicRequest(req.id)
        if(req.status === 'GRANTED') {
          publish_microphone()
        }
      }else{
        unpublishFromRemote(Math.random().toString())
      }
    })

    let slide_unsubs = db.collection('slide').where('talk_id', '==', talkId).onSnapshot(async(snaps)=>{
      let req = snaps.docs.filter(d=>d.exists).map(d=>{
        let _d = d.data()
        _d.id = d.id
        return _d
      })
      console.log(req)
      if(req.length == 0){
        toggleSlide(false)
        setSlideShareId('')
        return
      }
      let {url} = await TalkService.getSlides(Number(props.talkId))
      setSlideUrl(url)
      
      setSlideShareId(req[0].id)
      toggleSlide(true)
    })

    return ()=>{
      unsubs()
      request_unsubs()
      slide_unsubs()
    }
  }, [talkId])

  if(talkStatus === 'ENDED'){
    return (
      <Box align='center'>
        <Grid margin={{ top: "xlarge", bottom: "none" }}>
          <Text margin={{top: '20vh'}}>This talk was ended by the admin.</Text>
        </Grid>
      </Box>
    )
  }

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

            {talkStatus === 'NOT_STARTED' ? 
              <Box align='center'>
                <Grid margin={{ top: "xlarge", bottom: "none" }}>
                  <Text margin={{top: '20vh'}}>The admin is going to start the talk soon.</Text>
                </Grid>
              </Box>:
              <Box ref={videoContainer} className={`video-holder ${localUser.role} ${isScreenAvailable || isSlideVisible?'screen-share':''}`}
                style={{height: '100%', position: 'relative'}}>
                <Box className='camera-video'>
                  {remoteVideoTrack.map((user)=>(
                    //@ts-ignore
                    <VideoPlayerAgora key={user.uid} id={user.uid} className='camera' stream={user.videoTrack} />
                  ))}
                </Box>

                { isScreenAvailable && 
                    <VideoPlayerAgora id='screen' stream={remoteScreenTrack} />
                }
                {isSlideVisible && <PDFViewer url={slideUrl} slideShareId={slideShareId} />}
                <Box className='call-control' direction='row'>
                  {hasMicRequested || callControl.mic?!callControl.mic?<Button label="Requested mic" primary size='small' />:
                    <Button label="Give-up mic" primary size='small' onClick={unpublish_microphone} />:
                    <Button label="Request mic" primary size='small' onClick={()=>API.requestMic(talkId, localUser.uid, storedName)} />
                  }
                </Box>

                <Button className='full-screen-button' label="Fullscreen" primary size='small' onClick={toggleFullscreen} />
              </Box>
            }

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
          <Box gridArea="chat" background="#EAF1F1" round="small" height="20vw" margin={{bottom: "10px"}}>
            {/* <Text size="16px" color="grey" style={{marginBottom: "10px"}}>Chat</Text> */}
            <Box height="90%" flex={true} gap="2px" overflow="auto">
              {messages.map((msg, i)=>(
                  <Box flex={false} alignSelf={msg.senderId == localUser.uid ? 'end': 'start'} direction="column" key={i} gap={msg.first ? "2px" : "0px"}>
                    { msg.first && (
                      <Text color="#0C385B" size="12px" weight="bold" style={{textAlign: msg.senderId == localUser.uid?'right': 'left'}}>
                        {msg.name}
                      </Text>
                    )}
                    <Text size="14px" style={{textAlign: msg.senderId == localUser.uid?'right': 'left'}}>
                      {textToLatex(msg.text)}
                    </Text>
                  </Box>
                  // style={{textAlign: msg.senderId == localUser.uid?'right': 'left'}}
                ))}
            </Box>
            <TextInput onKeyUp={send_message} placeholder='type message and press enter.' />
            {/* <input type='textbox' onKeyUp={send_message} placeholder='type message and press enter.' /> */}
          </Box>
          {/* <Box gridArea="description" width="30%" margin={{top: "-20px"}}>
            <Text size="12px"> {talkDetail.description} </Text>
          </Box> */}
        </Grid>
        <Clapping clapOnChange={isClapping} clapBase='/claps/auditorium.mp3' clapUser='/claps/applause-5.mp3' /> 
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

function getLocalName(talk_id:string){
  return  window.localStorage.getItem(`${talk_id}.user_name`)
}
function setLocalName(talk_id:string, name:string){
  return  window.localStorage.setItem(`${talk_id}.user_name`, name)
}

const AgoraStream:FunctionComponent<Props> = (props) => {
  const [name, setName] = useState('')
  const [storedName, setStoredName] = useState(getLocalName(props.talkId.toString()))

  function join(){
    if(!name) {
      return
    }
    setLocalName(props.talkId.toString(), name)
    setStoredName(getLocalName(props.talkId.toString()))
  }
  if(storedName) {
    return <AgoraStreamCall {...props} />
  }

  return (
    <Box align="center">
      <Grid margin={{ top: "xlarge", bottom: "none" }}>
          <TextInput style={{minWidth: '300px', marginTop: "20vh", marginBottom: "20px"}} placeholder='Enter your name.' value={name} onChange={(e)=> setName(e.target.value)} />
          <Box
              justify="center"
              align="center"
              pad="small"
              focusIndicator={false}
              height="30px"
              background="color1"
              hoverIndicator="#BAD6DB"
              style={{borderRadius:'6px'}}
              onClick={()=>{
                join()
              }}
            >
          <Text weight="bold" color="white" size="14px" textAlign="center">
            Join
          </Text>
          </Box>
      </Grid>

    </Box>
  )
}

export default AgoraStream