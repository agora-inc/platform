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

import Clapping from "../Clapping/Clapping";
import PDFViewer from "../Slides/PDFViewer";

import {FirebaseDb} from "../../../Services/FirebaseService"


interface Props {
    disabled: boolean
    talkId: number;
    uid: string;
    storedName: string;
    onGranted: any; // functions
    onRevoked?: any; // functions
    onDenied?: any; // functions
    callback: any
}


const MicRequestButton:FunctionComponent<Props> = (props) => {
    const [micRequestStatus, setMicRequestStatus] = useState<"PENDING"|"GRANTED"|"DENIED"|null>(null)
    const [micRequestId, setMicRequestId] = useState("")

    // Listens to acceptance / denial of requests
    useEffect(()=>{
        let request_unsubs = FirebaseDb.collection('requests').where('requester_id', '==', props.uid).onSnapshot(snaps=>{
            let req = snaps.docs.filter(d=>d.exists).map(d=>{
            let _d = d.data()
            _d.id = d.id
            return _d
            }).filter(d=>d.requester_id === props.uid).find(d=>d.status === 'GRANTED' || d.status === 'REQUESTED')
    
            if(req) {
                setMicRequestId(req.id)
                setMicRequestStatus(req.status)
                
                if(req.status === 'GRANTED') {
                    props.onGranted()
                } else if(req.status === 'DENIED'){
                    props.onGranted()
                }
             }else{
                    props.onRevoked()
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
            height="50px"
            background={props.disabled ? "grey" : "color1"}
            hoverIndicator={props.disabled ? "grey" : "#BAD6DB"}
            style={{borderRadius:'6px'}}
            onClick={()=>{
                if (!hasPendingMicRequest){
                    MicRequestService.requestMic(props.talkId.toString(), props.uid, props.storedName)
                }
                else {
                    console.log("User has already a pending mic request.")
                }
          }}
        >
          <Text weight="bold" color="white" size="14px" textAlign="center">
            {(hasMicRequested || !callControl.mic) ? "Request microphone" : "Give up microphone"}
          </Text>
        </Box>
        )
      }

    return (
        requestMicButton()
    )




}

export default MicRequestButton