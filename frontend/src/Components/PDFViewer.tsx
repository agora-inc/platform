import React, { Component, useState, useEffect } from "react";
import { Box, Text, Button } from "grommet";
import { Link } from "react-router-dom";
import { Stream } from "../Services/StreamService";
import "../Styles/videocard.css";
import { baseApiUrl } from "../config";
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { db, API } from "../Services/FirebaseService";

interface Props {
    url: string;
    slideShareId: string;
    pageNumber?: number;
    presenter?: boolean;
}


export default function({presenter=false, ...props}:Props) {
  const [numPages, setNumPages] = useState(0 as number);
  const [pageNumber, setPageNumber] = useState(1 as number);
  const [isLive, toggleLive] = useState(true as boolean)
  const [livePageNumber, setLivePageNumber] = useState(1 as number)

  function onDocumentLoadSuccess(pdf: any) {
    setNumPages(pdf.numPages);
  }
  function navigate(n:number) {
    n = Math.min(numPages, Math.max(1, n))
    if(n == pageNumber) {
      return
    }
    setPageNumber(n)
    if(presenter) {
      API.slideNavigate(props.slideShareId, n)
    }else{
      toggleLive(false)
    }
  }
  
  useEffect(()=>{
    if(!props.pageNumber){
      return
    }
    setPageNumber(props.pageNumber)
  }, [props.pageNumber])

  useEffect(()=>{
    if(!isLive) {
      return
    }
    setPageNumber(livePageNumber)
  }, [livePageNumber, isLive])

  useEffect(()=>{
    if(presenter) return

    let slide_unsubs = db.collection('slide').doc(props.slideShareId).onSnapshot(snaps=>{
      let data = snaps.data() as any
      setLivePageNumber(data.pageNumber)
    })

    return ()=>{
      slide_unsubs()
    }

  }, [props.slideShareId])

  return (
    <div className='pdf-holder'>
      <Document
        file={props.url}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} height={350} renderAnnotationLayer={false} />
      </Document>
      <Box direction='row'>
        <Button onClick={()=> navigate(pageNumber-1)}>Prev</Button>
        <Text> Page {pageNumber} of {numPages} </Text>
        <Button onClick={()=> navigate(pageNumber + 1)}>Next</Button>
        {!presenter && !isLive && <Button onClick={()=> toggleLive(true)}>Live</Button>}
      </Box>
    </div>
  );
}