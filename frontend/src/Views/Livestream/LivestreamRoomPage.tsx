import React, { useRef, useEffect, Component, createRef, FunctionComponent, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Box, Grid, Text, TextInput, Layer, Button, Table, TableHeader, TableRow, TableCell, TableBody } from "grommet";
import DescriptionAndQuestions from "../../Components/Streaming/DescriptionAndQuestions";
import ChatBox from "../../Components/Streaming/ChatBox";
import ChannelIdCard from "../../Components/Channel/ChannelIdCard";
import Tag from "../../Components/Core/Tag";
import Loading from "../../Components/Core/Loading";
import { textToLatex } from "../../Components/Core/LatexRendering";
import { Chat, View } from "grommet-icons";
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
import PDFViewer from "../../Components/PDFViewer";

// Admin-only features
import Clapping from "../../Components/Streaming/Clapping";

// Speaker-only features
import SlidesUploader from "../../Components/Core/SlidesUploader";
import SpeakerHelpButton from "../../Components/Streaming/SpeakerHelpButton"


interface Props {
  // location: { pathname: string; state: { video: Video } };
  // match: {params: {talk_id: string}};
  talkId: number;
  role?: "speaker" | "admin" | "audience"
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
  fullscreen: boolean
  video?: boolean;
  screenShare?: boolean;
  slideShare?: boolean;
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

  const [role, setRole] = useState((props.role !== undefined || props.role != "") ? props.role : "audience" )

  const [name, setName] = useState('')
  const [storedName, setStoredName] = useState(getLocalName(props.talkId.toString())||'')

  var agoraIoRoleName = ""
  if (props.role == "speaker" || props.role == "admin"){
    agoraIoRoleName = "host"
  } else {
    agoraIoRoleName = "audience"
  }
  const [localUser, setLocalUser] = useState({
        appId: APP_ID,
        talkId: "",
        role: agoraIoRoleName,
        name: 'Prof. Newton',
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

  
  const [messages, setMessages] = useState<Message[]>([])
  const [talkStatus, setTalkStatus] = useState('NOT_STARTED' as string)
  
  const [talkId, setTalkId] = useState('')
  const [slideShareId, setSlideShareId] = useState('')

  const [slideUrl, setSlideUrl] = useState('')
  const [isSlideVisible, toggleSlide] = useState(false)
  

  // admin only features
  const [micRequests, setMicRequests] = useState([] as any[])
  const [isTimeover, setTimeover] = useState(false)
  
  // speaker only feature
  const [slidesGotUploaded, setSlidesGotUploaded] = useState(false)

  // audience only features
  const [hasMicRequested, setMicRequest] = useState('')
  const [isUnpublishFromRemote, unpublishFromRemote] = useState('')
  const [isClapping, setClapping] = useState('')


  const [callControl, _setCallControl] = useState({
    mic: (role == "speaker" || role == "admin") ? true : false
    // video: (role == "speaker" || role == "admin") ? true : false, 
    // screenShare: false, 
    // fullscreen: false, 
    // slideShare: false
  } as Control)
  const [cc, setCallControl] = useState({} as any)

  useEffect(()=>{
    _setCallControl({...callControl, ...cc})
  }, [cc])

  ////////////////////////////////
  // Setting audience name
  ////////////////////////////////
  function getLocalName(talk_id:string){
    return  window.localStorage.getItem(`${talk_id}.user_name`)
  }
  function setLocalName(talk_id:string, name:string){
    return  window.localStorage.setItem(`${talk_id}.user_name`, name)
  }


  ////////////////////////////////
  // Backend methods
  ////////////////////////////////
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

  async function initStreamingConnection() {
    // FETCH talk details
    fetchTalkDetails()

    // Setting client role (agora.io: 'host' or 'audience')
    // await agoraClient.setClientRole(localUser.role);
    // await agoraScreenShareClient.setClientRole(localUser.role);

    agoraClient.on('user-published', onClient)
    agoraClient.on('user-unpublished', onClientStop)
    
    if (localUser.role == "host"){
    agoraClient.on('user-left', onClientStop)
    }
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
    agoraMessageClient.on('ConnectionStateChanged', (newState, reason) => {
      console.log('on connection state changed to ' + newState + ' reason: ' + reason);
    });

    //console.log('joining...')
    let {uid} = localUser
    let talkId = props.talkId.toString()
    

    try{
      await agoraMessageClient.login({ uid })
      let _messageChannel = agoraMessageClient.createChannel(talkId)
      if (role == "admin"){
        await agoraMessageClient.addOrUpdateLocalUserAttributes({name: `Admin`})
      } else if (role == "speaker"){
        let talk = await get_talk_by_id(talkId) as any
        await agoraMessageClient.addOrUpdateLocalUserAttributes({name: `(Speaker) ${talk.talk_speaker}`})
      } else {
        await agoraMessageClient.addOrUpdateLocalUserAttributes({name: storedName})
      }

      await _messageChannel.join()
      _messageChannel.on('ChannelMessage', on_message)
      setMessageChannel(_messageChannel)
    }catch(e) {
      console.log(e)
    }
  }
  async function join(){
    //console.log('joining...')
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
      //console.log("sharing stopped")
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
      //console.log(222, _localScreenTrack)
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
    if (role == "audience"){
      if(hasMicRequested) {
        API.removeRequest(hasMicRequested)
      }
      setMicRequest('')
    }

    if(localAudioTrack) {
      localAudioTrack.stop()

      await agoraClient.unpublish(localAudioTrack);
      setCallControl({mic: false})
      setLocalAudioTrack(null)
    }
  }
  async function publish_microphone(){
    if (role == "audience"){
      await agoraClient.setClientRole('host');
    }
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
    if (role == "admin"){
      setTimeout(()=>{
        setRemoteVideoTrack([...agoraClient.remoteUsers])
      }, 2000)
    } else {
      setTimeout(()=>{
        setRemoteVideoTrack([...agoraClient.remoteUsers])
      }, 200)
    }

    if(mediaType == 'video'){
      return
    }
    if(mediaType == 'audio') {
      setRemoteAudioTrack(null)
      return
    }
  }
  // async function onClientLeft(user: any, mediaType: "audio" | "video") {
  //   //console.log("left", agoraClient.remoteUsers)
  //   setRemoteVideoTrack([...agoraClient.remoteUsers])
  // }

  async function onScreenShare(user: any, mediaType: "audio" | "video") {
    await agoraScreenShareClient.subscribe(user, mediaType);
    if(mediaType == 'video'){
      setRemoteScreenTrack(user.videoTrack)
      setScreenAvailability(true)
      //console.log("Getting screen")
      return
    }
  }
  async function onScreenShareStop(user: any, mediaType: "audio" | "video") {
    setScreenAvailability(false)
    setRemoteScreenTrack(null)
    await agoraScreenShareClient.unsubscribe(user, mediaType);
    //console.log("stop share")
  }
  
  ////////////////////////////////
  // Admin-only methods
  ////////////////////////////////
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
      fetchTalkDetails()
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
        initStreamingConnection()
      }
      if(data.status === 'ENDED') {
        setTalkStatus(data.status)
      }
      if (role == "audience"){
        if(data.clapping_status) {
          setClapping(data.clapping_status)
        }else{
          setClapping('')
        }
      }
    })

    // Unsub mic requests
    let request_unsubs = () => {}
    if (role == "admin" || role == "speaker"){
      let request_unsubs = db.collection('requests').where('talk_id', '==', talkId).onSnapshot(snaps=>{
        let req = snaps.docs.filter(d=>d.exists).map(d=>{
          let _d = d.data()
          _d.id = d.id
          return _d
        }).filter((d:any)=> d.status !== 'DENIED')
        setMicRequests([...req])
      })
    } else if (role == "audience") {
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
    }
    // Unsub slides
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
        //console.log('okay')
        setSlideShareId(req[0].id)
        toggleSlide(false)
        setCallControl({slideShare: true})
      }else{
        //console.log("haha")
        setSlideShareId(req[0].id)
        toggleSlide(true)
        setCallControl({ slideShare: false})
      }
    })

    return ()=>{
      leave()
      unsubs()
      slide_unsubs()
      if (role == "admin" || role == "audience"){
        request_unsubs()
      }
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
          {(role == "admin") && (
            <>
              {startTalkButton()}
              {stopTalkButton()}
              <Clapping onClick={()=> API.thankTheSpeaker(talkId)} clapBase='/claps/auditorium.mp3' clapUser='/claps/applause-5.mp3' /> 
              {viewChangeButton()}
            </>
            )}
        
          {(role == "speaker") && (
            <>
              {screenShareButton()}
              <SlidesUploader
                text={slidesGotUploaded ? "Uploaded ✔️ (click to reupload)" : "Upload slides"}
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
              <Clapping onClick={()=> API.thankTheSpeaker(talkId)} clapBase='/claps/auditorium.mp3' clapUser='/claps/applause-5.mp3' />     
              {viewChangeButton()}
            </>
          )}  
          {(role != "admin" && role != "speaker") && (
            <>
              {requestMicButton()}
              {fullscreenButton()}
              <Clapping onClick={()=> API.thankTheSpeaker(talkId)} clapBase='/claps/auditorium.mp3' clapUser='/claps/applause-5.mp3' /> 
              {viewChangeButton()}
            </>
            ) 
          }


        </Box>
        
        {/* SECONDARY BUTTONS */}
        <Box direction="row">
            {(role == "admin") && (
            <>
              {micButton()}
              {webcamButton()}
              {screenShareButton()}
              {fullscreenButton()}
            </>
            )}

            {(role == "speaker") && (
            <>
              {micButton()}
              {webcamButton()}
              {fullscreenButton()}
              <SpeakerHelpButton
                talkId={props.talkId}
                width="5vw"
                callback={()=>{}}
              />
            </>
            )}

            {(role !== "admin" && role != "speaker") && (
            <>
            </>
            )}
        </Box>
      </>
    )
  }

  function startTalkButton () {
    return (
      <Button
      onClick={startTalk}
      disabled={(talkStatus === 'STARTED')}
      hoverIndicator="#6DA3C7"
      focusIndicator={true}
      style={{
        background: "#0C385B", width: "120px",
        color: 'white', textAlign: 'center', borderRadius: '6px', height: '50px'
      }}
    >
      <Text size="14px" weight="bold"> {talkStatus === 'ENDED'? 'Restart': 'Start'} </Text>
      
    </Button>
    )
  }

  function stopTalkButton () {
    return (
      <Button
        onClick={stopTalk}
        disabled={talkStatus !== 'STARTED'}
        hoverIndicator="#6DA3C7"
        focusIndicator={true}
        style={{
          background: "#0C385B", width: "120px",
          color: 'white', textAlign: 'center', borderRadius: '6px', height: '50px'
        }}
      >
      <Text size="14px" weight="bold"> Stop </Text>
      </Button>
    )
  }

  function screenShareButton () {
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
      background="color1"
      hoverIndicator="#BAD6DB"
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
        {callControl.slideShare? "Standard view" : "Slides view"}
      </Text>
    </Box>
    )
  }

  function requestMicButton () {
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
        if (hasMicRequested || !callControl.mic){
          API.requestMic(talkId, localUser.uid, storedName)
        }
        else {
          unpublish_microphone()
        }
      }}
    >
      <Text weight="bold" color="white" size="14px" textAlign="center">
        {(hasMicRequested || !callControl.mic) ? "Give up microphone" : "Request microphone"}
      </Text>
    </Box>
    )
  }

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

  function requestMicBox() {
    return (
      <>
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
      </>
    )
  }

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

              <Box
                direction="row"
                gap="small"
                justify="end"
                style={{ width: "10%" }}
              >
              </Box>
          </Box>

        <Text size="12px"> {talkDetail.description} </Text>
      </>
    )
  }

  return (
    <>
      {(storedName == "" && (props.role != "speaker" && props.role != "admin")) && (
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
                  setLocalName(props.talkId.toString(), name)
                  var StoredName = getLocalName(props.talkId.toString())
                  if (StoredName !== null){
                    setStoredName(StoredName)
                  }
              }
              }
              >
            <Text weight="bold" color="white" size="14px" textAlign="center">
              Join
            </Text>
            </Box>
        </Grid>

      </Box>
      )}


      {/* {((props.role == "admin" || props.role == "speaker") || name == "") && ( */}
      {!(storedName == "" && (props.role != "speaker" && props.role != "admin")) && (
        <Box style={{position: "absolute", left: "20px", top: "5px"}} margin={{bottom: "50px", top: "80px"}} width="100%">
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

            <Box gridArea="extra_feature" direction='column' height="20vw">   {/*flex width='70vw'>*/}
                {(role == "admin") && (
                  requestMicBox()
                )}
                {/* <DescriptionAndQuestions
                  gridArea="questions"
                  tags={state.video.tags.map((t: any) => t.name)}
                  description={state.video!.description}
                  videoId={state.video.id}
                  streamer={false}
                /> */}
            </Box>

            <Box gridArea="description" margin={{top: "-20px"}}>
                {talkDetailsDescription()}
            </Box>
          </Grid>

        </Box>
        )}
      </>
  )
}

export default AgoraStream
