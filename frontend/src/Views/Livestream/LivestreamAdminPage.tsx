import React, { useRef, useEffect, Component, createRef, FunctionComponent, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Box, Grid, Text, TextInput, Layer, Button, Table, TableHeader, TableRow, TableCell, TableBody } from "grommet";
import DescriptionAndQuestions from "../../Components/Streaming/DescriptionAndQuestions";
import ChatBox from "../../Components/Streaming/ChatBox";
import ChannelIdCard from "../../Components/Channel/ChannelIdCard";
import Tag from "../../Components/Core/Tag";
import Loading from "../../Components/Core/Loading";
import { textToLatex } from "../../Components/Core/LatexRendering";
import { View } from "grommet-icons";
import { Video, VideoService } from "../../Services/VideoService";
import { StreamService } from "../../Services/StreamService";
import { TalkService } from "../../Services/TalkService";
import { ChannelService } from "../../Services/ChannelService";
import VideoPlayerAgora from "../../Components/Streaming/VideoPlayerAgora";
import AgoraRTC, { IAgoraRTCClient, ClientRole } from "agora-rtc-sdk-ng"
import AgoraRTM from 'agora-rtm-sdk';
import {FaMicrophone, FaVideo, FaExpand, FaCompress, FaVideoSlash, FaMicrophoneSlash} from 'react-icons/fa'
import {MdScreenShare, MdStopScreenShare, MdClear, MdSlideshow} from 'react-icons/md'
import {db, API} from '../../Services/FirebaseService'

import '../../Styles/all-stream-page.css'
import Clapping from "../../Components/Streaming/Clapping";
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
interface Message {
  senderId: string;
  text: string;
  name?: string;
  first: boolean;
}

interface Control {
  mic: boolean;
  video: boolean;
  screenShare: boolean;
  slideShare: boolean;
  fullscreen: boolean
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
        uid: getUserId(props.talkId.toString(), useQuery().get('dummy'))
      } as any)
  const [talkDetail, setTalkDetail] = useState({} as any)
  const [localAudioTrack, setLocalAudioTrack] = useState(null as any)
  const [localVideoTrack, setLocalVideoTrack] = useState(null as any)
  const [localScreenTrack, setLocalScreenTrack] = useState(null as any)

  const [remoteVideoTrack, setRemoteVideoTrack] = useState([] as any[])
  const [remoteScreenTrack, setRemoteScreenTrack] = useState(null as any)
  const [remoteAudioTrack, setRemoteAudioTrack] = useState(null as any)
  const [isScreenAvailable, setScreenAvailability] = useState(false as boolean)

  const [micRequests, setMicRequests] = useState([] as any[])
  const [isTimeover, setTimeover] = useState(false)

  const [messages, setMessages] = useState<Message[]>([])
  const [talkStatus, setTalkStatus] = useState('NOT_STARTED' as string)
  
  const [talkId, setTalkId] = useState('')
  const [slideShareId, setSlideShareId] = useState('')
  const [isSlideVisible, toggleSlide] = useState(false)

  const [slideUrl, setSlideUrl] = useState('')

  const [callControl, _setCallControl] = useState({
    mic: true, video: true, screenShare: false, fullscreen: false, slideShare: false
  } as Control)
  const [cc, setCallControl] = useState({} as any)

  useEffect(()=>{
    _setCallControl({...callControl, ...cc})
  }, [cc])

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

  async function fetchTalkDetails() {
    const talkId = props.talkId.toString()
    let talk = await get_talk_by_id(talkId)
    setTalkDetail(talk)
  }

  function toggleFullscreen() {
    let fullscreenEl = document.fullscreenElement
    if(fullscreenEl) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setCallControl({fullscreen: false})
      }
      return
    }

    let element = videoContainer.current!
    if (element.requestFullscreen) {
      element.requestFullscreen();
      setCallControl({fullscreen: true})
    }

  }
  function leave() {

  }
  useEffect(()=>{
    if(!talkDetail.id) return

    let end = Date.parse(talkDetail.end_date)
    let loop = setInterval(()=>{
      if(Date.now() >end) {
        setTimeover(true)
      }
      if(Date.now() > end + 15*60*1000) {
        // API.endSeminar(props.match.params.talk_id)
      }
    }, 1000)

    return ()=> clearInterval(loop)
  }, [talkDetail])



  async function setup() {
    agoraMessageClient.on('ConnectionStateChanged', (newState, reason) => {
      console.log('on connection state changed to ' + newState + ' reason: ' + reason);
    });
    // Setting client as Speaker
    // await agoraClient.setClientRole(localUser.role);
    // await agoraScreenShareClient.setClientRole(localUser.role);

    agoraClient.on('user-published', onClient)
    agoraClient.on('user-unpublished', onClientStop)
    agoraClient.on('user-left', onClientStop)
    agoraScreenShareClient.on('user-published', onScreenShare)
    agoraScreenShareClient.on('user-unpublished', onScreenShareStop)

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

  async function join_live_chat(){
    console.log('joining...')
    let {appId , uid} = localUser
    let talkId = props.talkId.toString()

    try{
      await agoraMessageClient.login({ uid })
      let _messageChannel = agoraMessageClient.createChannel(talkId)
      await agoraMessageClient.addOrUpdateLocalUserAttributes({name: `Admin`})
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
    let screenSharetoken = await get_token_for_talk(`${talkId}-screen`)

    try{
      // @ts-ignore
      await agoraClient.join(appId, talkId, token, uid)
      // @ts-ignore
      await agoraScreenShareClient.join(appId, `${talkId}-screen`, screenSharetoken, uid)

      await publish_camera()
      await publish_microphone()
    }catch(e) {
      console.log(e)
    }
  }
  async function stop_share_screen() {
      console.log("sharing stopped")
      await agoraScreenShareClient.unpublish()
      if(localScreenTrack){
        localScreenTrack._originMediaStreamTrack.stop()
      }
      setCallControl({screenShare: false})
  }
  async function share_screen() {
    // Create a new stream for the screen share.
    let {appId , uid} = localUser
    let talkId = props.talkId.toString()

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
      console.log(222, _localScreenTrack)
      _localScreenTrack.on('track-ended', stop_share_screen)
      setCallControl({screenShare: true})

      setLocalScreenTrack(_localScreenTrack)

      await agoraScreenShareClient.publish(_localScreenTrack);
    }catch(e) {
      console.log("Error sharing screen", e)
    }
  }

  async function unpublish_camera(){
    if(localVideoTrack) {
      localVideoTrack.stop()

      await agoraClient.unpublish(localVideoTrack);
      setCallControl({ video: false})
      setLocalVideoTrack(null)
    }
  }
  async function publish_camera(){
      let _localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      setLocalVideoTrack(_localVideoTrack)
      await agoraClient.publish([_localVideoTrack]);
      setCallControl({video: true})
  }

  async function unpublish_microphone(){
    if(localAudioTrack) {
      localAudioTrack.stop()

      await agoraClient.unpublish(localAudioTrack);
      setCallControl({mic: false})
      setLocalAudioTrack(null)
    }
  }
  async function publish_microphone(){
    let _localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    setLocalAudioTrack(_localAudioTrack)
    await agoraClient.publish(_localAudioTrack);

    setCallControl({mic: true})
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
    try {
      let first = messages.length === 0 ? true : messages[messages.length-1].senderId !== localUser.uid
      setMessages([...messages, {senderId: localUser.uid, text: text, name: 'Me', first: first}])
      await messageChannel.sendMessage({text})
    } catch{
      console.log('error sending message')
    }
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
    setTimeout(()=>{
      setRemoteVideoTrack([...agoraClient.remoteUsers])
    }, 2000)
    if(mediaType == 'video'){
      return
    }
    if(mediaType == 'audio') {
      setRemoteAudioTrack(null)
      return
    }
  }
  async function onClientLeft(user: any, mediaType: "audio" | "video") {
    console.log("left", agoraClient.remoteUsers)
    setRemoteVideoTrack([...agoraClient.remoteUsers])
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
  
  async function startTalk(){
    let data = {
      admin_id: localUser.uid,
      speaker_id: '',
      meta: ''
    }
    let ret = await API.startSeminar(talkId, data)
  }
  
  async function stopTalk(){
    if(!window.confirm('Are you sure? Doing so will redirect people to the Cafeteria.')) {
      return
    }
    let ret = await API.endSeminar(talkId)
  }


  useEffect(()=>{
    (async ()=>{
      setTalkId(props.talkId.toString())
      join_live_chat()
      fetchTalkDetails()
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
    })
    let request_unsubs = db.collection('requests').where('talk_id', '==', talkId).onSnapshot(snaps=>{
      let req = snaps.docs.filter(d=>d.exists).map(d=>{
        let _d = d.data()
        _d.id = d.id
        return _d
      }).filter((d:any)=> d.status !== 'DENIED')
      setMicRequests([...req])
    })


    let slide_unsubs = db.collection('slide').where('talk_id', '==', talkId).onSnapshot(async(snaps)=>{
      let req = snaps.docs.filter(d=>d.exists).map(d=>{
        let _d = d.data()
        _d.id = d.id
        return _d
      })
      if(req.length == 0){
        toggleSlide(false)
        setSlideShareId('')
        return
      }
      let {url} = await TalkService.getSlide(Number(props.talkId))
      setSlideUrl(url)

      if(req[0].user_id === localUser.uid) {
        console.log('okay')
        setSlideShareId(req[0].id)
        toggleSlide(false)
        setCallControl({slideShare: true})
      }else{
        console.log("haha")
        setSlideShareId(req[0].id)
        toggleSlide(true)

        setCallControl({ slideShare: false})
      }
    })

    return ()=>{
      leave()
      unsubs()
      request_unsubs()
      slide_unsubs()
    }
  }, [talkId])

  async function slideShare(slideShare: boolean) {
    if(slideShare) {
      let req = await API.slideShare(localUser.uid, talkId) as any
      setSlideShareId(req.id)
      setCallControl({slideShare: true})
    }else{
      let req = await API.slideStop(slideShareId) as any
      setSlideShareId('')
      setCallControl({slideShare: false})
    }
  }

  return (
      <Box style={{position: "absolute", left: "40px", top: "5px"}} margin={{bottom: "50px"}}>
        {isTimeover && (
          <Box 
            margin={{ top: "xlarge", bottom: "xsmall" }} 
            style={{ 
              zIndex: 1000, background: 'red', color: 'white',
              padding: '10px', borderRadius: '4px', width: "50%"
            }}
          >
            {talkStatus === 'ENDED' ? <Text> Talk ended </Text> : 
            <Text>Seminar time over. It will end automatically in 15 mins.</Text> }
          </Box>
        )}

          <Box 
            direction='row'
            gap="40px"
            margin={{ 
              top: isTimeover ? "xsmall" : "xlarge", 
              bottom: "15px" 
            }}
            width="72%"
            align="center"
          >
            <Link
              className="channel"
              to={`/${talkDetail.channel_name}`}
              style={{ textDecoration: "none", width: "40%"}}
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
                    <img
                      src={ChannelService.getAvatar(
                        talkDetail.channel_id
                      )}
                      height={30}
                      width={30}
                    />
                </Box>
                <Box justify="between">
                  <Text weight="bold" size="16px" color="grey">
                    {talkDetail.channel_name}
                  </Text>
                </Box>
              </Box>
            </Link>
            <Box width="30.1%" />
                      
            <Button
              onClick={startTalk}
              disabled={(talkStatus === 'STARTED')}
              hoverIndicator="#6DA3C7"
              focusIndicator={false}
              
              style={{
                background: "#0C385B", width: "120px",
                color: 'white', textAlign: 'center', borderRadius: '6px', height: '40px'
              }}
            >
              <Text size="14px" weight="bold"> {talkStatus === 'ENDED'? 'Restart': 'Start'} </Text>
              
            </Button>

            <Button
              onClick={stopTalk}
              disabled={talkStatus !== 'STARTED'}
              hoverIndicator="#6DA3C7"
              focusIndicator={false}
              style={{
                background: "#0C385B", width: "120px",
                color: 'white', textAlign: 'center', borderRadius: '6px', height: '40px'
              }}
            >
            <Text size="14px" weight="bold"> Stop </Text>
            </Button>
          </Box>
      
        <Grid
          rows={["streamViewRow1", "streamViewRow2", "streamView3"]}
          columns={["streamViewColumn1", "streamViewColumn2"]}
          gap="medium"
          areas={[
            { name: "player", start: [0, 0], end: [0, 1] },
            { name: "chat", start: [1, 0], end: [1, 0] },
            { name: "requests", start: [1, 1], end: [1, 2] },
            { name: "description", start: [0, 2], end: [0, 2] },
          ]}
        >
          
          <Box gridArea="player" justify="between" gap="small">
            <Box ref={videoContainer} className={`video-holder ${localUser.role} ${isScreenAvailable||callControl.slideShare || isSlideVisible?'screen-share':''}`}
              style={{height: '90%', position: 'relative'}}>
              <Box className='camera-video'>
                {remoteVideoTrack.map((user)=>(
                  //@ts-ignore
                  <VideoPlayerAgora key={user.uid} id={user.uid} className='camera' stream={user.videoTrack} mute={!user.hasAudio} />
                ))}
                <VideoPlayerAgora id='speaker' className='camera' stream={localVideoTrack} />
              </Box>

              { isScreenAvailable && 
                  <VideoPlayerAgora id='screen' stream={remoteScreenTrack} />
              }
              {(callControl.slideShare || isSlideVisible) &&
                <PDFViewer url={slideUrl} slideShareId={slideShareId} presenter={callControl.slideShare} />
              }

              <Box className='call-control' direction='row'>
                {callControl.mic?
                  <FaMicrophone onClick={unpublish_microphone} />:
                  <FaMicrophoneSlash onClick={publish_microphone} />
                }
                {callControl.video?
                  <FaVideo onClick={unpublish_camera} />:
                  <FaVideoSlash onClick={publish_camera} />
                }
                {callControl.screenShare?
                  <MdStopScreenShare onClick={stop_share_screen} />:
                  <MdScreenShare onClick={share_screen} />
                }
                {callControl.slideShare?
                  <MdClear onClick={()=> slideShare(false)} />:
                  <MdSlideshow onClick={()=> slideShare(true)} />
                }
                {callControl.fullscreen?
                  <FaCompress onClick={toggleFullscreen} />:
                  <FaExpand onClick={toggleFullscreen} />
                }
              </Box>
            </Box>

            <Box direction="row" justify="between" align="center" margin={{top: "10px"}} gap="5px">
              <Text
                size="18px"
                weight="bold"
                style={{width: "45%"}}
              >
                {talkDetail.name}
              </Text>
              <Text
                size="18px"
                weight="bold"
                style={{width: "25%"}}
              >
                {talkDetail.talk_speaker}
              </Text>

              <Clapping onClick={()=> API.thankTheSpeaker(talkId)} clapBase='/claps/auditorium.mp3' clapUser='/claps/applause-5.mp3' /> 

              <Box
                direction="row"
                gap="small"
                justify="end"
                style={{ width: "10%" }}
              >
                {/* <Box direction="row" align="center" gap="5px">
                  <View color="black" size="30px" />
                  {state.viewCount === -1 && (
                    <Loading color="grey" size={34} />
                  )}
                  {state.viewCount !== -1 && (
                    <Text size="20px" weight="bold">
                      {state.viewCount}
                    </Text>
                  )}
                  </Box> */}
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

          <Box gridArea="requests" direction='column' height="20vw">   {/*flex width='70vw'>*/}
            <Text size="16px" color="grey" style={{marginBottom: "10px"}}>Requests for mic</Text>
            <Table>
              <TableBody>
                {micRequests.map((req, i)=>(
                  <TableRow key={i} className='request-item'>
                    <TableCell>
                      <Text weight="bold" size="14px"> {req.requester_name || req.requester_id} </Text>
                    </TableCell>
                    {req.status ==='REQUESTED' && (
                      <Button 
                        margin={{left: '10px'}}
                        onClick={()=>API.grantRequest(req.id, true)} 
                        hoverIndicator="#6DA3C7"
                        focusIndicator={true}
                        style={{
                          background: "#0C385B", width: "90px",
                          color: 'white', textAlign: 'center', borderRadius: '6px', height: '30px'
                        }}
                      >
                        <Text size="14px" weight="bold"> Accept </Text>
                      </Button>
                    )}
                    <Button 
                      margin={{left: '30px'}} 
                      onClick={()=>API.grantRequest(req.id, false)}
                      style={{
                        background: "#FF4040", width: "90px",
                        color: 'white', textAlign: 'center', borderRadius: '6px', height: '30px'
                      }}
                    >
                      <Text size="14px" weight="bold"> {req.status =='GRANTED' ? 'Remove': 'Refuse'} </Text>
                    </Button>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <Box gridArea="description" width="30%" margin={{top: "-20px"}}>
            <Text size="12px"> {talkDetail.description} </Text>
          </Box>

        {/* <DescriptionAndQuestions
          gridArea="questions"
          tags={state.video.tags.map((t: any) => t.name)}
          description={state.video!.description}
          videoId={state.video.id}
          streamer={false}
        /> */}
        </Grid>
      

      </Box>
  )
}

export default AgoraStream
