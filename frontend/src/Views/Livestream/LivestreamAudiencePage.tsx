import React, { useRef, useEffect, Component, createRef, FunctionComponent, useState } from "react";
import { Box, Grid, Text, Layer, Button, TextInput } from "grommet";
import { useLocation, Link } from "react-router-dom";
// import DescriptionAndQuestions from "../../Components/Streaming/DescriptionAndQuestions";
// import ChatBox from "../../Components/Streaming/ChatBox";
import ChannelIdCard from "../../Components/Channel/ChannelIdCard";
import Tag from "../../Components/Core/Tag";
import Loading from "../../Components/Core/Loading";
import { Java } from "grommet-icons";
import { Video, VideoService } from "../../Services/VideoService";
import { StreamService } from "../../Services/StreamService";
import { TalkService } from "../../Services/TalkService";
import VideoPlayerAgora from "../../Components/Streaming/VideoPlayer/VideoPlayerAgora";
import AgoraRTC, { IAgoraRTCClient, ClientRole } from "agora-rtc-sdk-ng"
import AgoraRTM from 'agora-rtm-sdk';
import {db, API} from '../../Services/FirebaseService'
import { textToLatex } from "../../Components/Core/LatexRendering";
import {FaMicrophone, FaVideo, FaExpand, FaCompress, FaVideoSlash, FaMicrophoneSlash} from 'react-icons/fa'
import Loader from "react-loader-spinner";
import ReactTooltip from "react-tooltip";

import '../../Styles/all-stream-page.css'
import Clapping from "../../Components/Streaming/Clapping/Clapping";
import { ChannelService } from "../../Services/ChannelService";
import PDFViewer from "../../Components/Streaming/Slides/PDFViewer";


import AudienceHelpButton from "../../Components/Streaming/HelpButtons/AudienceHelpButton";


import BeforeStartImage from "../../assets/streaming/waiting_start_image.jpeg"
import PostSeminarCoffeeImage from "../../assets/streaming/post_seminar_coffee_invitation.jpg"


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

interface Control {
  mic: boolean
  fullscreen: boolean
  slideShare: boolean
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

  // Role: added for future merging of the files
  const [role, setRole] = useState("audience")
  
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
  const [isTimeover, setTimeover] = useState(false)
  const [isUnpublishFromRemote, unpublishFromRemote] = useState('')
  const [slideUrl, setSlideUrl] = useState('')
  const [isSlideVisible, toggleSlide] = useState(false)

  const [slideShareId, setSlideShareId] = useState('')
  
  const [talkId, setTalkId] = useState('')

  const [callControl, _setCallControl] = useState({
    mic: false,
    fullscreen: false,
    slideShare: false,
    // video: false
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
      }
      return
    }

    let element = videoContainer.current!
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }

  }

  async function fetchTalkDetails() {
    const talkId = props.talkId.toString()
    let talk = await get_talk_by_id(talkId)
    setTalkDetail(talk)
  }

  async function setup() {
    // Fetch talk details

    fetchTalkDetails()
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

  // async function unpublish_camera_and_microphone(){
  //   console.log('unp mic', localAudioTrack)
  //   if(hasMicRequested) {
  //     API.removeRequest(hasMicRequested)
  //   }

  //   setMicRequest('')
  //   if(localAudioTrack || localVideoTrack) {

  //     localAudioTrack.stop()
  //     localVideoTrack.stop()

  //     await agoraClient.unpublish(localAudioTrack);
  //     await agoraClient.unpublish(localVideoTrack);

  //     setLocalAudioTrack(null)
  //     setLocalVideoTrack(null)

  //     await agoraClient.setClientRole(localUser.role);
      
  //     setCallControl({...callControl, mic: false})
  //     setCallControl({...callControl, video: false})
  //   }

  //   // if(localVideoTrack) {
  //   //   localVideoTrack.stop()

  //   //   await agoraClient.unpublish(localVideoTrack);
  //   //   setCallControl({ video: false})
  //   //   setLocalVideoTrack(null)
  //   // }
  // }

  async function publish_microphone(){
    await agoraClient.setClientRole('host');
    let _localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    setLocalAudioTrack(_localAudioTrack)
    await agoraClient.publish(_localAudioTrack);
    setCallControl({...callControl, mic: true})
  }

  // async function publish_camera(){
  //   await agoraClient.setClientRole('host');
  //   let _localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  //   setLocalVideoTrack(_localVideoTrack)
  //   await agoraClient.publish([_localVideoTrack]);
  //   setCallControl({video: true})
  // }

  // async function publish_camera_and_microphone(){
  //   await agoraClient.setClientRole('host');
  //   let _localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  //   setLocalAudioTrack(_localAudioTrack)
  //   await agoraClient.publish(_localAudioTrack);
  //   // setCallControl({...callControl, mic: true})
  //   let _localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  //   setLocalVideoTrack(_localVideoTrack)
  //   await agoraClient.publish([_localVideoTrack]);
  //   setCallControl({...callControl, mic: true, video: true})
  // }

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

  // Set all Firestore listening ports (slides + clapping + video)
  useEffect(()=>{
    if(!talkId) {
      return
    }
    let unsubs = db.collection('talk').doc(talkId).onSnapshot(doc=>{
      if(!doc.exists){
        return
      }
      let data = doc.data() as any

      // Start chat + video + init clapping
      if(data.status == "NOT_STARTED" || data.status == "STARTED"){
        setup()
      }
      if(data.status === 'STARTED') {
        setTalkStatus(data.status)
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

    // listen to mic requests
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

    // listen to slides (grab url, SlideShareId, and set listening port)
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

      // automatically displays slides when speaker uploads slides (i.e. slide URL is known)
      setSlideShareId(req[0].id)
      toggleSlide(true)
    })

    return ()=>{
      unsubs()
      request_unsubs()
      slide_unsubs()
    }
  }, [talkId])


  // SLIDE SHARING (speaker + admin ONLY)
  // async function slideShare(slideShare: boolean) {
  //   if(slideShare) {
  //     let req = await API.slideShare(localUser.uid, talkId) as any
  //     setSlideShareId(req.id)
  //     setCallControl({slideShare: true})
  //   }else{
  //     let req = await API.slideStop(slideShareId) as any
  //     setSlideShareId('')
  //     setCallControl({slideShare: false})
  //   }
  // }

  ///////////////////////
  // Frontend methods
  //////////////////////
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
            toggleFullscreen()
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
        if (talkStatus == "STARTED"){
          if (isSlideVisible){
            toggleSlide(false)
          } else {
            toggleSlide(true)
          }
        }
      }}
    >
      <Text weight="bold" color="white" size="14px" textAlign="center">
        {isSlideVisible? "View speaker" : "View slides"}
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
      background={talkStatus == "NOT_STARTED" ? "grey" : "color1"}
      hoverIndicator={talkStatus == "NOT_STARTED" ? "grey" : "#BAD6DB"}
      style={{borderRadius:'6px'}}
      onClick={()=>{
        if (talkStatus == "STARTED"){
          if (hasMicRequested || !callControl.mic){
            API.requestMic(talkId, localUser.uid, storedName)
          }
          else {
            unpublish_microphone()
          }
        }
      }}
    >
      <Text weight="bold" color="white" size="14px" textAlign="center">
        {(hasMicRequested || !callControl.mic) ? "Request microphone" : "Give up microphone"}
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
        <TextInput onKeyUp={send_message} placeholder="Aa" />
        {/* <input type='textbox' onKeyUp={send_message} placeholder='type message and press enter.' /> */}
  
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

  function streamingButtons () {
    return (
      <>
      {/* MAIN BUTTONS */}
        <Box 
            direction='row'
            // gap="10px"
            align="center"
          >
          {/* {(role == "admin") && (
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
          )}   */}
          {(role != "admin" && role != "speaker") && (
            <>
              {requestMicButton()}
              {viewChangeButton()}
              {fullscreenButton()}
              <AudienceHelpButton/>
            </>
            ) 
          }


        </Box>
        
        {/* SECONDARY BUTTONS */}
        <Box direction="row">
            {/* {(role == "admin") && (
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
            )} */}

            {(role !== "admin" && role != "speaker") && (
            <>
            </>
            )}
        </Box>
      </>
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
      // <Box align="center">
      //   <Grid
      //     margin={{ top: "xlarge", bottom: "none" }}
      //     // rows={["streamViewRow1", "medium"]}
      //     rows={["streamViewRow1"]}
      //     columns={["streamViewColumn1", "streamViewColumn2"]}
      //     gap="medium"
      //     areas={[
      //       { name: "player", start: [0, 0], end: [0, 0] },
      //       { name: "chat", start: [1, 0], end: [1, 0] },
      //       // { name: "questions", start: [0, 1], end: [1, 1] },
      //     ]}
      //   >
          
        
      //     <Box gridArea="player" justify="between" gap="small">

      //       {talkStatus === 'NOT_STARTED' ? 
      //         <Box align='center'>
      //           <Grid margin={{ top: "xlarge", bottom: "none" }}>
      //             <Text margin={{top: '20vh'}}>The admin is going to start the talk soon.</Text>
      //           </Grid>
      //         </Box>:
      //         <Box ref={videoContainer} className={`video-holder ${localUser.role} ${isScreenAvailable || isSlideVisible?'screen-share':''}`}
      //           style={{height: '100%', position: 'relative'}}>
      //           <Box className='camera-video'>
      //             {remoteVideoTrack.map((user)=>(
      //               //@ts-ignore
      //               <VideoPlayerAgora key={user.uid} id={user.uid} className='camera' stream={user.videoTrack} />
      //             ))}
      //           </Box>

      //           { isScreenAvailable && 
      //               <VideoPlayerAgora id='screen' stream={remoteScreenTrack} />
      //           }
      //           {isSlideVisible && <PDFViewer url={slideUrl} slideShareId={slideShareId} />}
      //           <Box className='call-control' direction='row'>
      //             {hasMicRequested || callControl.mic?!callControl.mic?<Button label="Requested mic" primary size='small' />:
      //               <Button label="Give-up mic" primary size='small' onClick={unpublish_microphone} />:
      //               <Button label="Request mic" primary size='small' onClick={()=>API.requestMic(talkId, localUser.uid, storedName)} />
      //             }
      //           </Box>

      //           <Button className='full-screen-button' label="Fullscreen" primary size='small' onClick={toggleFullscreen} />
      //         </Box>
      //       }

      //       <Box direction="row" justify="between" align="start">
      //         <p
      //           style={{
      //             padding: 0,
      //             margin: 0,
      //             fontSize: "24px",
      //             fontWeight: "bold",
      //             // color: "black",
      //             maxWidth: "65%",
      //           }}
      //         >
      //           {talkDetail.name}
      //         </p>
      //         <br />
      //         <p
      //           style={{
      //             padding: 0,
      //             margin: 0,
      //             fontSize: "24px",
      //             fontWeight: "bold",
      //             // color: "black",
      //             maxWidth: "65%",
      //           }}
      //         >
      //           Speaker: {talkDetail.talk_speaker}
      //         </p>
      //         <Box
      //           direction="row"
      //           gap="small"
      //           justify="end"
      //           style={{ minWidth: "35%" }}
      //         >
      //           <ChannelIdCard channelName={state.video!.channel_name} />
      //           <Box direction="row" align="center" gap="xxsmall">
      //             <View color="black" size="40px" />
      //             {state.viewCount === -1 && (
      //               <Loading color="grey" size={34} />
      //             )}
      //             {state.viewCount !== -1 && (
      //               <Text size="34px" weight="bold">
      //                 {state.viewCount}
      //               </Text>
      //             )}
      //           </Box>
      //         </Box>
      //       </Box>
      //     </Box>
      //     <Box gridArea="chat" background="#EAF1F1" round="small" height="20vw" margin={{bottom: "10px"}}>
      //       {/* <Text size="16px" color="grey" style={{marginBottom: "10px"}}>Chat</Text> */}
      //       <Box height="90%" flex={true} gap="2px" overflow="auto">
      //         {messages.map((msg, i)=>(
      //             <Box flex={false} alignSelf={msg.senderId == localUser.uid ? 'end': 'start'} direction="column" key={i} gap={msg.first ? "2px" : "0px"}>
      //               { msg.first && (
      //                 <Text color="#0C385B" size="12px" weight="bold" style={{textAlign: msg.senderId == localUser.uid?'right': 'left'}}>
      //                   {msg.name}
      //                 </Text>
      //               )}
      //               <Text size="14px" style={{textAlign: msg.senderId == localUser.uid?'right': 'left'}}>
      //                 {textToLatex(msg.text)}
      //               </Text>
      //             </Box>
      //             // style={{textAlign: msg.senderId == localUser.uid?'right': 'left'}}
      //           ))}
      //       </Box>
      //       <TextInput onKeyUp={send_message} placeholder='type message and press enter.' />
      //       {/* <input type='textbox' onKeyUp={send_message} placeholder='type message and press enter.' /> */}
      //     </Box>
      //     {/* <Box gridArea="description" width="30%" margin={{top: "-20px"}}>
      //       <Text size="12px"> {talkDetail.description} </Text>
      //     </Box> */}
      //   </Grid>
      //   <Clapping clapOnChange={isClapping} clapBase='/claps/auditorium.mp3' clapUser='/claps/applause-5.mp3' /> 
      //   <DescriptionAndQuestions
      //     gridArea="questions"
      //     tags={state.video.tags.map((t: any) => t.name)}
      //     description={state.video!.description}
      //     videoId={state.video.id}
      //     streamer={false}
      //     margin={{ top: "-20px" }}
        
      //   />
      // </Box>




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
          <Box ref={videoContainer} className={`video-holder ${localUser.role} ${isScreenAvailable || callControl.slideShare || isSlideVisible?'screen-share':''}`}
            style={{height: '100%', position: 'relative'}}>
            {/* If not started, waiting screen */}
            {talkStatus == "NOT_STARTED" && (
              <Box background="black" alignContent="center">
                <img src={BeforeStartImage} style={{height:"100%", width: "80%", maxWidth: "100%", maxHeight: "100%", alignSelf: "center"}}/>
              </Box>
            )}

            {/* If started, stream */}
            {talkStatus == "STARTED" && (
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
            { isSlideVisible &&
              <PDFViewer url={slideUrl} slideShareId={slideShareId} />
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
        </Box>

        <Box gridArea="description" margin={{top: "-20px"}}>
            {talkDetailsDescription()}
        </Box>
      </Grid>

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