import React, { useRef, useEffect, Component, createRef, FunctionComponent, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Box, Grid, Text, TextInput, Layer, Button, Table, TableHeader, TableRow, TableCell, TableBody } from "grommet";
// import DescriptionAndQuestions from "../../Components/Streaming/DescriptionAndQuestions";
// import ChatBox from "../../Components/Streaming/ChatBox";
import ChannelIdCard from "../../Components/Channel/ChannelIdCard";
import Tag from "../../Components/Core/Tag";
import Loading from "../../Components/Core/Loading";
import { textToLatex } from "../../Components/Core/LatexRendering";
import { Java } from "grommet-icons";
import { Video, VideoService } from "../../Services/VideoService";
import { StreamService } from "../../Services/StreamService";
import { TalkService } from "../../Services/TalkService";
import { ChannelService } from "../../Services/ChannelService";
import VideoPlayerAgora from "../../Components/Streaming/VideoPlayer/VideoPlayerAgora";
import AgoraRTC, { IAgoraRTCClient, ClientRole } from "agora-rtc-sdk-ng"
import AgoraRTM from 'agora-rtm-sdk';
import {FaMicrophone, FaVideo, FaExpand, FaCompress, FaVideoSlash, FaMicrophoneSlash} from 'react-icons/fa'
import {MdScreenShare, MdStopScreenShare, MdSlideshow, MdClear} from 'react-icons/md'
import {db, API} from '../../Services/FirebaseService'
import '../../Styles/all-stream-page.css'
import PDFViewer from "../../Components/Streaming/Slides/PDFViewer";
import ReactTooltip from "react-tooltip";
import Loader from "react-loader-spinner";


import PostSeminarCoffeeImage from "../../assets/streaming/post_seminar_coffee_invitation.jpg"

// Speaker-only features
import SlidesUploader from "../../Components/Core/SlidesUploader";
import SpeakerHelpButton from "../../Components/Streaming/HelpButtons/SpeakerHelpButton"

import BeforeStartImage from "../../assets/streaming/waiting_start_image.jpeg"

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

  // Role: added to facilitate merging of file later on
  const [role, setRole] = useState("speaker")

  const [localAudioTrack, setLocalAudioTrack] = useState(null as any)
  const [localVideoTrack, setLocalVideoTrack] = useState(null as any)
  const [localScreenTrack, setLocalScreenTrack] = useState(null as any)

  const [remoteVideoTrack, setRemoteVideoTrack] = useState([] as any[])
  const [remoteScreenTrack, setRemoteScreenTrack] = useState(null as any)
  const [remoteAudioTrack, setRemoteAudioTrack] = useState(null as any)
  const [isScreenAvailable, setScreenAvailability] = useState(false as boolean)

  const [messages, setMessages] = useState<Message[]>([])
  const [talkStatus, setTalkStatus] = useState('NOT_STARTED' as string)
  
  const [talkId, setTalkId] = useState('')
  const [slideShareId, setSlideShareId] = useState('')

  const [slideUrl, setSlideUrl] = useState('')
  const [isSlideVisible, toggleSlide] = useState(false)

  const [isTimeover, setTimeover] = useState(false)

  // speaker only feature
  const [slidesGotUploaded, setSlidesGotUploaded] = useState(false)


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

  function toggleFullscreen() {
    let fullscreenEl = document.fullscreenElement
    if(fullscreenEl) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setCallControl({ fullscreen: false})
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

  async function fetchTalkDetails() {
    const talkId = props.talkId.toString()
    let talk = await get_talk_by_id(talkId)
    setTalkDetail(talk)
  }

  async function setup_connection_video_and_screen_sharing() {
    // fetch talk details
    fetchTalkDetails()

    agoraMessageClient.on('ConnectionStateChanged', (newState, reason) => {
      console.log('on connection state changed to ' + newState + ' reason: ' + reason);
    });
    // Setting client as Speaker
    agoraClient.setClientRole(localUser.role);
    agoraScreenShareClient.setClientRole(localUser.role);

    agoraClient.on('user-published', onClient)
    agoraClient.on('user-unpublished', onClientStop)
    agoraScreenShareClient.on('user-published', onScreenShare)
    agoraScreenShareClient.on('user-unpublished', onScreenShareStop)
    join()
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
        console.log(tk)
        if(tk)
          return res(tk)
        rej()
      })

    })
  }
  
  async function join_live_chat(){
    console.log('joining...')
    let {uid} = localUser
    let talkId = props.talkId.toString()
    let talk = await get_talk_by_id(talkId) as any

    try{
      await agoraMessageClient.login({ uid })
      let _messageChannel = agoraMessageClient.createChannel(talkId)
      await agoraMessageClient.addOrUpdateLocalUserAttributes({name: `(Speaker) ${talk.talk_speaker}`})
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
      setCallControl({...callControl, video: false})
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
      setTalkStatus(data.status)
      // Start chat + video
      if(data.status == "NOT_STARTED" || data.status == "STARTED"){
        setup_connection_video_and_screen_sharing()
      }
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
      let {url} = await TalkService.getSlides(Number(props.talkId))
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

  ////////////////////////////////
  // Frontend methods
  ////////////////////////////////
  function streamingButtons () {
    return (
      <>
      {/* MAIN BUTTONS */}
        <Box 
            direction='row'
            // gap="10px"
            align="center"
          >
          {(role == "speaker") && (
            <>
              {screenShareButton()}
              <SlidesUploader
                text={slidesGotUploaded ? "Uploaded ✔️ (click to reupload)" : "Upload slides"}
                disabled={(talkStatus == "NOT_STARTED" || talkStatus == "ENDED")}
                onUpload={(e: any) => {
                  TalkService.uploadSlides(
                    props.talkId, 
                    e.target.files[0],
                    (res: any) => {
                      if (res){
                        setSlidesGotUploaded(true)
                        // this.setState({slidesAlreadyUploaded: true})
                      }
                    }
                    )
                  }}
                  />
              {viewChangeButton()}
              <SpeakerHelpButton
                talkId={props.talkId}
                callback={()=>{}}
              />
            </>
          )}  
        </Box>
        
        {/* SECONDARY BUTTONS */}
        <Box direction="row">
            {(role == "speaker") && (
            <>
              {micButton()}
              {webcamButton()}
              {fullscreenButton()}
            </>
            )}
        </Box>
      </>
    )
  }

  // function startTalkButton () {
  //   return (
  //     <Button
  //     onClick={startTalk}
  //     disabled={(talkStatus === 'STARTED')}
  //     hoverIndicator="#6DA3C7"
  //     focusIndicator={true}
  //     style={{
  //       background: "#0C385B", width: "120px",
  //       color: 'white', textAlign: 'center', borderRadius: '6px', height: '50px'
  //     }}
  //   >
  //     <Text size="14px" weight="bold"> {talkStatus === 'ENDED'? 'Restart': 'Start'} </Text>
      
  //   </Button>
  //   )
  // }

  // function stopTalkButton () {
  //   return (
  //     <Button
  //       onClick={stopTalk}
  //       disabled={talkStatus !== 'STARTED'}
  //       hoverIndicator="#6DA3C7"
  //       focusIndicator={true}
  //       style={{
  //         background: "#0C385B", width: "120px",
  //         color: 'white', textAlign: 'center', borderRadius: '6px', height: '50px'
  //       }}
  //     >
  //     <Text size="14px" weight="bold"> Stop </Text>
  //     </Button>
  //   )
  // }

  function screenShareButton () {
    return (
      <Box
        justify="center"
        align="center"
        pad="small"
        focusIndicator={false}
        height="50px"
        background={(talkStatus == "NOT_STARTED" || talkStatus == "ENDED") ? "grey" : "color1"}
        hoverIndicator={(talkStatus == "NOT_STARTED" || talkStatus == "ENDED") ? "grey" : "#BAD6DB"}
        style={{borderRadius:'6px'}}
        onClick={()=>{
          if (callControl.screenShare){
            stop_share_screen()
          } else {
            share_screen()
          }

        }}
      >
      <Text weight="bold" color="white" size="14px" textAlign="center">
        {callControl.screenShare? "Unshare" : "Share screen"}
      </Text>
      </Box>
    )
  }

  function micButton () {
    return (
      <Box
      justify="center"
      align="center"
      pad="small"
      focusIndicator={false}
      height="50px"
      background="color1"
      hoverIndicator="#BAD6DB"
      style={{borderRadius:'6px'}}
      onClick={()=>{
        if (callControl.mic){
          unpublish_microphone()
        } else {
          publish_microphone()
        }
    
      }}
    >
      <Text weight="bold" color="white" size="14px" textAlign="center">
        {callControl.mic? <FaMicrophone/> : <FaMicrophoneSlash/>}
      </Text>
    </Box>
    )
  }

  function webcamButton () {
    return (
      <Box
        justify="center"
        align="center"
        pad="small"
        focusIndicator={false}
        height="50px"
        background="color1"
        hoverIndicator="#BAD6DB"
        style={{borderRadius:'6px'}}
        onClick={()=>{
          if (callControl.video){
            unpublish_camera()
          } else {
            publish_camera()
          }

        }}
      >
      <Text weight="bold" color="white" size="14px" textAlign="center">
        {callControl.video? <FaVideo/> : <FaVideoSlash/>}
      </Text>
    </Box>
    )
  }

  function fullscreenButton () {
    return (
      <Box
        justify="center"
        align="center"
        pad="small"
        focusIndicator={false}
        height="50px"
        background="color1"
        hoverIndicator="#BAD6DB"
        style={{borderRadius:'6px'}}
        onClick={()=>{
          if (callControl.fullscreen){
            toggleFullscreen()
          } else {
            toggleFullscreen()
          }

        }}
      >
        <Text weight="bold" color="white" size="14px" textAlign="center">
          {callControl.fullscreen? <FaExpand/> : <FaCompress/>}
        </Text>
      </Box>
    )
  }

  function viewChangeButton () {
    return (
      <Box
      justify="center"
      align="center"
      pad="small"
      focusIndicator={false}
      height="50px"
      background={(talkStatus == "NOT_STARTED" || talkStatus == "ENDED") ? "grey" : "color1"}
      hoverIndicator={(talkStatus == "NOT_STARTED" || talkStatus == "ENDED") ? "grey" : "#BAD6DB"}
      style={{borderRadius:'6px'}}
      onClick={()=>{
        if (callControl.slideShare){
          slideShare(false)
        } else {
          slideShare(true)
        }
    
      }}
    >
      <Text weight="bold" color="white" size="14px" textAlign="center">
      {callControl.slideShare? "View speaker" : "View slides"}
      </Text>
    </Box>
    )
  }

  // function requestMicButton () {
  //   return (
  //     <Box
  //     justify="center"
  //     align="center"
  //     pad="small"
  //     focusIndicator={false}
  //     height="50px"
  //     background="color1"
  //     hoverIndicator="#BAD6DB"
  //     style={{borderRadius:'6px'}}
  //     onClick={()=>{
  //       if (hasMicRequested || !callControl.mic){
  //         API.requestMic(talkId, localUser.uid, storedName)
  //       }
  //       else {
  //         unpublish_microphone()
  //       }
  //     }}
  //   >
  //     <Text weight="bold" color="white" size="14px" textAlign="center">
  //       {(hasMicRequested || !callControl.mic) ? "Give up microphone" : "Request microphone"}
  //     </Text>
  //   </Box>
  //   )
  // }

  function chatBox() {
    return (
      <>
          {/* <Text size="16px" color="grey" style={{marginBottom: "10px"}}>Chat</Text> */}
          <Box height="85%" flex={true} gap="2px" overflow="auto" margin="small">
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
        <TextInput onKeyUp={send_message} placeholder='Aa' />
        {/* <input type='textbox' onKeyUp={send_message} placeholder='type message and press enter.' /> */}
  
      </>
    )
  }

  // function requestMicBox() {
  //   return (
  //     <>
  //       <Text size="16px" color="grey" style={{marginBottom: "10px"}}>Requests for mic</Text>
  //       <Table>
  //         <TableBody>
  //           {micRequests.map((req, i)=>(
  //             <TableRow key={i} className='request-item'>
  //               <TableCell>
  //                 <Text weight="bold" size="14px"> {req.requester_name || req.requester_id} </Text>
  //               </TableCell>
  //               {req.status ==='REQUESTED' && (
  //                 <Button 
  //                   margin={{left: '10px'}}
  //                   onClick={()=>API.grantRequest(req.id, true)} 
  //                   hoverIndicator="#6DA3C7"
  //                   focusIndicator={true}
  //                   style={{
  //                     background: "#0C385B", width: "90px",
  //                     color: 'white', textAlign: 'center', borderRadius: '6px', height: '30px'
  //                   }}
  //                 >
  //                   <Text size="14px" weight="bold"> Accept </Text>
  //                 </Button>
  //               )}
  //               <Button 
  //                 margin={{left: '30px'}} 
  //                 onClick={()=>API.grantRequest(req.id, false)}
  //                 style={{
  //                   background: "#FF4040", width: "90px",
  //                   color: 'white', textAlign: 'center', borderRadius: '6px', height: '30px'
  //                 }}
  //               >
  //                 <Text size="14px" weight="bold"> {req.status =='GRANTED' ? 'Remove': 'Refuse'} </Text>
  //               </Button>
  //             </TableRow>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </>
  //   )
  // }

  function talkDetailsDescription() {
    return (
      <>
        <Box direction="row" justify="between" align="center" margin={{top: "10px"}} gap="5px">
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

              {talkStatusIcon()}
          </Box>

        <Text size="12px"> {talkDetail.description} </Text>
      </>
    )
  }

  function talkStatusIcon() {
    return (
      <Box
      direction="row"
      gap="small"
      justify="end"
      style={{ width: "10%" }}
      data-tip data-for='talk_status'
    >
      {talkStatus == "STARTED" && (
        <>
        <Loader
          type="Puff"
          color="red"
          height="42px"
          width="42px"
          timeout={30000}
        />
        <ReactTooltip id="talk_status" effect="solid">
            Streaming is broadcasted to audience.
        </ReactTooltip>
        </>
      )}

      {talkStatus == "NOT_STARTED" && (
        <>
          <Box
            data-tip data-for='talk_status'
            justify="center"
            align="center"
            background="color5"
            round={"medium"}
            onClick={() => {}}
            height="45px"
            width="150px"
            focusIndicator={false}
            direction="row"
          >
            <Text>Starting soon</Text>
          </Box>
          <ReactTooltip id="talk_status" effect="solid">
              Speakers and admins can talk to each other but audience cannot see yet.
            </ReactTooltip>
        </>
      )}

      {talkStatus == "ENDED" && (
        <>
        <Box
          data-tip data-for='talk_status'
          justify="center"
          align="center"
          background="grey"
          round={"medium"}
          onClick={() => {}}
          pad={{ horizontal: "medium", vertical: "small" }}
          height="35px"
          width="140px"
          focusIndicator={false}
        >
          <Text>Ended</Text>
        </Box>
        <ReactTooltip id="talk_status" effect="solid">
            Stream has been ended.
          </ReactTooltip>
      </>
    )}
    </Box>
    )
  }

  function postSeminarCoffeeButton() {
    return (
      <a href={"https://gather.town/app/q9m3D0XU6stq8fNG/morastream%20Cafeteria"}>
        <Box
          justify="center"
          align="center"
          pad="small"
          focusIndicator={false}
          height="80px"
          width="350px"
          background="color1"
          hoverIndicator="#BAD6DB"
          style={{borderRadius:'6px'}}
          onClick={()=>{
          }}
        >
          <Text weight="bold" color="white" size="14px" textAlign="center">
            <Java size="medium"/> Grab a coffee and meet your peers!
          </Text>
        </Box>
      </a>
    )
  }

  return (
    // <Box style={{position: "absolute", left: "40px", top: "5px"}}               margin={{ 
    //   top: "xlarge", 
    //   bottom: "15px" 
    // }}>
    
    //     <Grid
    //       columns={["streamViewColumn1", "streamViewColumn2"]}
    //       rows={["streamViewRow1", "streamViewRow2", "streamViewRow3"]}
    //       gap="medium"
    //       areas={[
    //         { name: "top_bar", start: [0, 0], end: [0, 0] },
    //         { name: "top_chat", start: [1, 0], end: [1, 0] },
    //         { name: "player", start: [0, 1], end: [0, 1] },
    //         { name: "chat", start: [1, 1], end: [1, 2] },
    //         { name: "description", start: [0, 2], end: [0, 2] },
    //       ]}
    //     >

    //       <Box gridArea="top_bar" direction='row'>
    //         <Box 
    //           direction='row'
    //           width="60%"
    //           // gap="40px"
    //           alignSelf="start"
    //         >
    //           <Link
    //             className="channel"
    //             to={`/${talkDetail.channel_name}`}
    //             style={{ textDecoration: "none", width: "100%"}}
    //           >
    //             <Box
    //               direction="row"
    //               gap="xsmall"
    //               align="center"
    //               round="xsmall"
    //               pad={{ vertical: "6px", horizontal: "6px" }}
    //             >
    //               <Box
    //                 justify="center"
    //                 align="center"
    //                 background="#efeff1"
    //                 overflow="hidden"
    //                 style={{
    //                   minHeight: 30,
    //                   minWidth: 30,
    //                   borderRadius: 15,
    //                 }}
    //               >
    //                   <img
    //                     src={ChannelService.getAvatar(
    //                       talkDetail.channel_id
    //                     )}
    //                     height={30}
    //                     width={30}
    //                   />
    //               </Box>
    //               <Box justify="between">
    //                 <Text weight="bold" size="16px" color="grey">
    //                   {talkDetail.channel_name}
    //                 </Text>
    //               </Box>
    //             </Box>
    //           </Link>
    //           </Box>
    //           <Box align="end" width="40%">
    //             <Box
    //               width="20vw"
    //               height="40px"
    //               justify="end"
    //               align="center"
    //               pad="small"
    //               round="xsmall"
    //               background="#D3F930"
    //             >
    //               <Text size="14px" weight="bold">
    //                 You are the speaker
    //               </Text>
    //           </Box>
    //         </Box>
    //       </Box>


    //       <Box gridArea="top_chat" height="40px" align="center" direction="row" gap="small">
    //         {/* <SlidesUploader
    //           text={"Upload your slides"}
    //           onUpload={()=>{}}
    //         /> */}

    //         <SpeakerHelpButton
    //           talkId={props.talkId}
    //           width="25vw"
    //           callback={()=>{}}
    //         />
    //         <SlidesUploader
    //           text={slidesGotUploaded ? "Uploaded ✔️ (click to reupload)" : "Upload pdf"}
    //           onUpload={(e: any) => {
    //             TalkService.uploadSlides(
    //               props.talkId, 
    //               e.target.files[0],
    //               (res: any) => {
    //                 console.log("WESH REMY")
    //                 if (res){
    //                   setSlidesGotUploaded(true)
    //                   // this.setState({slidesAlreadyUploaded: true})
    //                   }
    //                 }
    //               )
    //             }}
    //         />

    //       </Box>


          
    //       <Box gridArea="player" justify="between" gap="small">
    //         <Box ref={videoContainer} className={`video-holder ${localUser.role} ${(isScreenAvailable||callControl.slideShare||isSlideVisible)?'screen-share':''}`}
    //           style={{height: '90%', position: 'relative'}}>
    //           <Box className='camera-video'>
    //             {remoteVideoTrack.map((user)=>(
    //               //@ts-ignore
    //               <VideoPlayerAgora key={user.uid} id={user.uid} className='camera' stream={user.videoTrack} mute={!user.hasAudio} />
    //             ))}
    //             <VideoPlayerAgora id='speaker' className='camera' stream={localVideoTrack} />
    //           </Box>

    //           { isScreenAvailable && 
    //               <VideoPlayerAgora id='screen' stream={remoteScreenTrack} />
    //           }
    //           {(callControl.slideShare || isSlideVisible) &&
    //             <PDFViewer url={slideUrl} slideShareId={slideShareId} presenter={callControl.slideShare} />
    //           }

    //           <Box className='call-control' direction='row'>
    //             {callControl.mic?
    //               <FaMicrophone onClick={unpublish_microphone} />:
    //               <FaMicrophoneSlash onClick={publish_microphone} />
    //             }
    //             {callControl.video?
    //               <FaVideo onClick={unpublish_camera} />:
    //               <FaVideoSlash onClick={publish_camera} />
    //             }
    //             {callControl.screenShare?
    //               <MdStopScreenShare onClick={stop_share_screen} />:
    //               <MdScreenShare onClick={share_screen} />
    //             }
    //             {!isSlideVisible && (callControl.slideShare?
    //               <MdClear onClick={()=> slideShare(false)} />:
    //               <MdSlideshow onClick={()=> slideShare(true)} />)
    //             }
    //             {callControl.fullscreen?
    //               <FaCompress onClick={toggleFullscreen} />:
    //               <FaExpand onClick={toggleFullscreen} />
    //             }
    //           </Box>
    //         </Box>

    //         <Box direction="row" justify="between" align="center" margin={{top: "10px"}} gap="5px">
    //           <Text
    //             size="18px"
    //             weight="bold"
    //             style={{width: "45%"}}
    //           >
    //             {talkDetail.name}
    //           </Text>
    //           <Text
    //             size="18px"
    //             weight="bold"
    //             style={{width: "25%"}}
    //           >
    //             {talkDetail.talk_speaker}
    //           </Text>

    //           <Box
    //             direction="row"
    //             gap="small"
    //             justify="end"
    //             style={{ width: "10%" }}
    //           >
    //             {/* <Box direction="row" align="center" gap="5px">
    //               <View color="black" size="30px" />
    //               {state.viewCount === -1 && (
    //                 <Loading color="grey" size={34} />
    //               )}
    //               {state.viewCount !== -1 && (
    //                 <Text size="20px" weight="bold">
    //                   {state.viewCount}
    //                 </Text>
    //               )}
    //             </Box>*/}
    //           </Box>
    //         </Box>
    //       </Box>

    //       <Box gridArea="chat" background="#EAF1F1" round="small" height="36vw" margin={{bottom: "10px"}}>
    //         <Box flex={true} height="90%" gap="2px" overflow="auto">
    //           {messages.map((msg, i)=>(
    //               <Box flex={false} alignSelf={msg.senderId == localUser.uid ? 'end': 'start'} direction="column" key={i} gap={msg.first ? "2px" : "-2px"}>
    //                 { msg.first && (
    //                   <Text color="#0C385B" size="12px" weight="bold" style={{textAlign: msg.senderId == localUser.uid?'right': 'left'}}>
    //                     {msg.name}
    //                   </Text>
    //                 )}
    //                 <Text size="14px" style={{textAlign: msg.senderId == localUser.uid?'right': 'left'}}>
    //                   {textToLatex(msg.text)}
    //                 </Text>
    //               </Box>
    //             ))}
    //         </Box>
    //         <TextInput onKeyUp={send_message} placeholder='type message and press enter.' />
    //       </Box>

    //       <Box gridArea="description" width="30%" margin={{top: "-20px"}}>
    //         <Text size="12px"> {talkDetail.description} </Text>
    //       </Box>
    //     </Grid>

    //   </Box>





      <Box style={{position: "absolute", left: "20px", top: "5px"}} margin={{bottom: "50px", top: "80px"}} width="100%">
        {/* Background image */}
        <img style={{ height: "100%", width: "auto", minWidth: "100%", minHeight: "100%" }} id="background-streaming"
          src="https://i.postimg.cc/RhmJmzM3/mora-social-media-cover-bad6db.jpg"
        />
        {/* {isTimeover && (
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
        )} */}
      
        <Grid
          columns={["75%", "20%"]}
          rows={["2vh", "15vh", "55vh", "25vh"]}
          gap="medium"
          areas={[
            { name: "player", start: [0, 0], end: [0, 3] },
            { name: "display_role", start: [1, 0], end: [1, 0] },
            { name: "main_buttons", start: [1, 1], end: [1, 1] },
            { name: "chat", start: [1, 2], end: [1, 2] },
            { name: "description", start: [0, 3], end: [0, 3] },
            { name: "extra_feature", start: [1, 3], end: [1, 3] },
          ]}
        >
          
          <Box gridArea="player" justify="between" gap="small">
            <Box ref={videoContainer} className={`video-holder ${localUser.role} ${isScreenAvailable||callControl.slideShare || isSlideVisible?'screen-share':''}`}
              style={{height: '100%', position: 'relative'}}>
                {/* Before and after: allow stream */}
                {(talkStatus == "STARTED" || talkStatus == "NOT_STARTED") && (
                  <Box className='camera-video'>
                    {remoteVideoTrack.map((user)=>(
                      //@ts-ignore
                      <VideoPlayerAgora key={user.uid} id={user.uid} className='camera' stream={user.videoTrack} mute={!user.hasAudio} />
                      ))}
                    <VideoPlayerAgora id='speaker' className='camera' stream={localVideoTrack} />
                  </Box>
                )}


                {talkStatus == "ENDED" && (
                <Box background="black">
                  <img src={PostSeminarCoffeeImage} style={{position: "absolute", height:"100%", width: "80%", maxWidth: "100%", maxHeight: "100%", alignSelf: "center"}}/>
                      
                  <Box align="center" margin={{top: "15%", bottom: "20%"}} style={{zIndex: 1}}>
                    {postSeminarCoffeeButton()}
                    </Box>
                </Box>
                )}



              { isScreenAvailable && 
                  <VideoPlayerAgora id='screen' stream={remoteScreenTrack} />
              }
              {(callControl.slideShare || isSlideVisible) &&
                <PDFViewer url={slideUrl} slideShareId={slideShareId} presenter={(role == "speaker")} />
              }
            </Box>
          </Box>

          <Box gridArea="display_role" justify="between" gap="small">
            {role == "admin" && (
            <Text size="16px" color="grey">You are an admin.</Text>
            )}
            {role == "speaker" && (
            <Text size="16px" color="grey">You are a speaker.</Text>
            )}
            {(role !== "admin" && role !== "speaker")  && (
            <Text size="16px" color="grey">You are an attendee.</Text>
            )}  

          </Box>

          <Box gridArea="main_buttons" justify="between" gap="small">
              {streamingButtons()}
          </Box>

          <Box gridArea="chat" background="#EAF1F1" round="small" margin={{bottom: "10px"}}>
              {chatBox()}
          </Box>

          <Box gridArea="extra_feature" direction='column' height="20vw"> 
          </Box>

          <Box gridArea="description" margin={{top: "-20px"}}>
              {talkDetailsDescription()}
          </Box>
        </Grid>

      </Box>







  )
}

export default AgoraStream