import React, { useRef, useEffect, Component, createRef, FunctionComponent, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Box, Grid, Text, TextInput, Layer, Button, Table, TableHeader, TableRow, TableCell, TableBody } from "grommet";
// import DescriptionAndQuestions from "../../Components/Streaming/DescriptionAndQuestions";
// import ChatBox from "../../Components/Streaming/ChatBox";
import ChannelIdCard from "../../../Components/Channel/ChannelIdCard";
import Tag from "../../../Components/Core/Tag";
import Loading from "../../../Components/Core/Loading";
import { textToLatex } from "../../../Components/Core/LatexRendering";
import { Volume } from "grommet-icons";
import { Video, VideoService } from "../../../Services/VideoService";
import { StreamService } from "../../../Services/StreamService";
import { TalkService, Talk } from "../../../Services/TalkService";
import { ChannelService } from "../../../Services/ChannelService";
import VideoPlayerAgora from "../../../Components/Streaming/VideoPlayer/VideoPlayerAgora";
import AgoraRTC, { IAgoraRTCClient, ClientRole } from "agora-rtc-sdk-ng"
import AgoraRTM from 'agora-rtm-sdk';
import {FaMicrophone, FaVideo, FaExpand, FaCompress, FaVideoSlash, FaMicrophoneSlash} from 'react-icons/fa'
import {MdScreenShare, MdStopScreenShare, MdClear, MdSlideshow} from 'react-icons/md'
import {MicRequestService} from '../../../Services/FirebaseService'
import Loader from "react-loader-spinner";
import ReactTooltip from "react-tooltip";
import PostSeminarCoffeeImage from "../../assets/streaming/post_seminar_coffee_invitation.jpg"
import '../../../Styles/all-stream-page.css'

import Clapping from "../../../Components/Streaming/Clapping/Clapping";
import PDFViewer from "../../../Components/Streaming/Slides/PDFViewer";

import {FirebaseDb} from "../../../Services/FirebaseService"


interface Props {
    talkId: number;
  }


const MicrophoneRequests:FunctionComponent<Props> = (props) => {
    const [micRequests, setMicRequests] = useState([] as any[])

    // Init listening
    useEffect(()=>{
        let request_unsubs = FirebaseDb.collection('requests').where('talk_id', '==', props.talkId.toString()).onSnapshot(snaps=>{
            console.log("testing toto")
            let req = snaps.docs.filter(d=>d.exists).map(d=>{
                let _d = d.data()
                _d.id = d.id
                return _d
            }).filter((d:any)=> d.status !== 'DENIED')
            setMicRequests([...req])
            })

        return ()=>{
            request_unsubs()
            }
      }, [props.talkId])




    function requestMicBox() {
        return (
        <>
            <Text size="16px" color="grey" style={{marginBottom: "10px"}}>Requests for mic</Text>
            <Table>
            <TableBody>
                {micRequests.map((req, i)=>(
                    <TableRow key={i} className='request-item'>
                        <TableCell>
                            {req.status ==='REQUESTED' && (
                                <Text size="14px"> {req.requester_name || req.requester_id} </Text>
                            )}
                            {req.status ==='GRANTED' && (
                                <>
                                <Volume size="small"/>
                                <Text weight="bold" size="14px"> {req.requester_name || req.requester_id} </Text>
                                </>
                            )}
                        </TableCell>
                        
                        {req.status ==='REQUESTED' && (
                            <>
                                <Button 
                                    margin={{left: '10px'}}
                                    onClick={()=>MicRequestService.grantRequest(req.id)} 
                                    hoverIndicator="#6DA3C7"
                                    focusIndicator={true}
                                    style={{
                                        background: "#0C385B", width: "90px",
                                        color: 'white', textAlign: 'center', borderRadius: '6px', height: '30px'
                                    }}
                                >
                                    <Text size="14px" weight="bold"> Accept </Text>
                                </Button>
                                <Button 
                                    margin={{left: '10px'}}
                                    onClick={()=>MicRequestService.denyRequest(req.id)} 
                                    hoverIndicator="#6DA3C7"
                                    focusIndicator={true}
                                    style={{
                                        background: "#0C385B", width: "90px",
                                        color: 'white', textAlign: 'center', borderRadius: '6px', height: '30px'
                                    }}
                                >
                                    <Text size="14px" weight="bold"> Deny </Text>
                                </Button>
                            </>
                        )}
                        {req.status ==='GRANTED' && (
                            <Button 
                                margin={{left: '10px'}}
                                onClick={()=>MicRequestService.revokeRequest(req.id)} 
                                hoverIndicator="#6DA3C7"
                                focusIndicator={true}
                                style={{
                                    background: "#0C385B", width: "90px",
                                    color: 'white', textAlign: 'center', borderRadius: '6px', height: '30px'
                                }}
                            >
                            <Text size="14px" weight="bold"> Revoke </Text>
                        </Button>
                        )}
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </>
        )
    }

    return (
        <>
            {requestMicBox()}
        </>
    )




}

export default MicrophoneRequests