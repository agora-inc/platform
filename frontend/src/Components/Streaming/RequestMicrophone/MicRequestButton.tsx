import React, { useRef, useEffect, Component, createRef, FunctionComponent, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Box, Grid, Text, TextInput, Layer, Button, Table, TableHeader, TableRow, TableCell, TableBody } from "grommet";
// import DescriptionAndQuestions from "../../Components/Streaming/DescriptionAndQuestions";
// import ChatBox from "../../Components/Streaming/ChatBox";
import ChannelIdCard from "../../Channel/ChannelIdCard";
import Tag from "../../Core/Tag";
import Loading from "../../Core/Loading";
import { textToLatex } from "../../Core/LatexRendering";
import { Java } from "grommet-icons";
import { Video, VideoService } from "../../../Services/VideoService";
import { StreamService } from "../../../Services/StreamService";
import { TalkService, Talk } from "../../../Services/TalkService";
import { ChannelService } from "../../../Services/ChannelService";
import VideoPlayerAgora from "../VideoPlayer/VideoPlayerAgora";
import AgoraRTC, { IAgoraRTCClient, ClientRole } from "agora-rtc-sdk-ng"
import AgoraRTM from 'agora-rtm-sdk';
import {FaMicrophone, FaVideo, FaExpand, FaCompress, FaVideoSlash, FaMicrophoneSlash} from 'react-icons/fa'
import {MdScreenShare, MdStopScreenShare, MdClear, MdSlideshow} from 'react-icons/md'
import {MicRequestService} from '../../../Services/FirebaseService'
import Loader from "react-loader-spinner";
import ReactTooltip from "react-tooltip";
import PostSeminarCoffeeImage from "../../assets/streaming/post_seminar_coffee_invitation.jpg"
import '../../../Styles/all-stream-page.css'

import PDFViewer from "../Slides/PDFViewer";

import {FirebaseDb} from "../../../Services/FirebaseService"


interface Props {
    disabled: boolean
    talkId: number;
    uid: string;
    storedName: string;
    onGranted?: any; // functions
    onRevoked?: any; // functions
    onCancelled?: any; // functions
    onDenied?: any; // functions
    onRequested?: any; // functions
    callback?: any
}


const MicRequestButton:FunctionComponent<Props> = (props) => {
    const [micRequestStatus, setMicRequestStatus] = useState<"REQUESTED"|"GRANTED"|"DENIED"|"CANCELLED"|null>(null)
    const [micRequestId, setMicRequestId] = useState("")
    const [textMicButton, setTextMicButton] = useState("Request microphone")
    const [buttonColor, setButtonColor] = useState("color1")
    const [buttonHoverColor, setButtonHoverColor] = useState("#BAD6DB")
    const [textColor, setTextColor] = useState("white")

    function _resetMicRequest() {
      setMicRequestStatus(null)
      setMicRequestId("")
      setTextMicButton("Request microphone")
      setButtonColor("color1")
      setButtonHoverColor("#BAD6DB")
      setTextColor("white")
    }

    // Listens to acceptance / denial of requests
    useEffect(()=>{
        let request_unsubs = FirebaseDb.collection('requests').where('requester_id', '==', props.uid).onSnapshot(snaps=>{
            let req = snaps.docs.filter(d=>d.exists).map(d=>{
            let _d = d.data()
            _d.id = d.id
            return _d
            }).filter(d=>d.requester_id === props.uid).find(d=>d.status === 'REQUESTED' || d.status === 'GRANTED' || d.status === 'DENIED' || d.status === 'REVOKED')
    
            if(req) {
                console.log("voila la req")
                console.log(req)



                setMicRequestId(req.id)
                setMicRequestStatus(req.status)
                
                if (req.status === 'REQUESTED') {
                  setTextMicButton("Microphone request pending")
                  setButtonColor("color5")
                  setButtonHoverColor("color5")

                  if (props.onRequested){
                      props.onRequested()
                    }
                }
                else if (req.status === 'GRANTED') {
                  setTextMicButton("Give up microphone")
                  setButtonColor("color3")
                  setButtonHoverColor("color2")

                  if (props.onGranted){
                      props.onGranted()
                    }
                } else if(req.status === 'DENIED'){
                  setTextMicButton("Denied request")
                  setButtonColor("color7")
                  setButtonHoverColor("color7")
                  setTextColor("grey")

                  if (props.onDenied){
                    props.onDenied()
                  }
                  
                  //Reset memory after 5sec
                  setInterval(_resetMicRequest, 5000)
                  
                } else if(req.status === 'REVOKED'){
                  setTextMicButton("Thank's for your input!")
                  setButtonColor("color7")
                  setButtonHoverColor("color7")
                  setTextColor("grey")

                  if (props.onRevoked){
                    props.onRevoked()
                  }
                  // Reset memory after 5sec
                  setInterval(_resetMicRequest, 5000)
                } else if(req.status === 'CANCELLED'){
                  setTextMicButton("Thank's for your input!")
                  setButtonColor("color7")
                  setButtonHoverColor("color7")

                  if (props.onCancelled){
                    props.onCancelled()
                  }
                  // Reset memory after 5sec
                  setInterval(_resetMicRequest, 5000)
                }
            }
        })
        return ()=>{
            request_unsubs()
            }
      }, [props.talkId])



      function requestMicButton () {
        return (
          <Box
            justify="center"
            align="center"
            pad="small"
            focusIndicator={false}
            height="40px"
            background={props.disabled ? "grey" : buttonColor}
            hoverIndicator={props.disabled ? "grey" : buttonHoverColor}
            style={{borderRadius:'6px'}}
            onClick={()=>{
                if(micRequestStatus == null){
                    MicRequestService.requestMic(props.talkId.toString(), props.uid, props.storedName)
                } else if (micRequestStatus == "REQUESTED"){
                  return
                } else if(micRequestStatus == "GRANTED"){
                  MicRequestService.giveUpMic(micRequestId)
                  setTextMicButton("Thanks for your input!")
                  setButtonColor("color7")
                  setButtonHoverColor("color7")
                  setTextColor("grey")

                  // Reset memory after 5sec
                  setInterval(_resetMicRequest, 5000)

                } else if(micRequestStatus == "DENIED"){
                  return
                }
          }}
        >
          <Text weight="bold" color={textColor} size="12px" textAlign="center">
            {textMicButton}
          </Text>
        </Box>
        )
      }

    return (
        requestMicButton()
    )




}

export default MicRequestButton