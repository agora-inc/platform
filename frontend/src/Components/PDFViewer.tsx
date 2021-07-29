import React, { Component, useState, useEffect, useRef } from "react";
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
interface PDFDimension {
  width?: number,
  height?: number
}


export default function({presenter=false, ...props}:Props) {
  const el = useRef<HTMLDivElement>(null)
  const [numPages, setNumPages] = useState(0 as number);
  const [pageNumber, setPageNumber] = useState(1 as number);
  const [isLive, toggleLive] = useState(true as boolean)
  const [livePageNumber, setLivePageNumber] = useState(1 as number)
  const [limitSide, setLimitSide] = useState('limit-width' as any)
  const [dimension, setDimension] = useState({height: 350} as PDFDimension)

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
    if(presenter) {
      if(props.slideShareId) {
        db.collection('slide').doc(props.slideShareId).get()
        .then((doc)=>{
          let data = doc.data()
          if(data) {
            setLivePageNumber(data.pageNumber)
          }
        })
      }

      return
    }


    let slide_unsubs = db.collection('slide').doc(props.slideShareId).onSnapshot(snaps=>{
      let data = snaps.data() as any
      console.log(data)
      if(data) {
        setLivePageNumber(data.pageNumber)
      }
    })

    return ()=>{
      slide_unsubs()
    }

  }, [props.slideShareId, presenter])

  useEffect(()=>{
    let a:any = null
    if(numPages) {
      a= setInterval(()=>{
        if(!el.current) return
        let canvas = el.current.querySelector('canvas')
        if(!canvas) return

        let viewR = el.current.clientHeight/(el.current.clientWidth + 0.01)
        let canvasR = canvas.clientHeight / canvas.clientWidth

        if(viewR < canvasR){
          setDimension({height: el.current.clientHeight})
          setLimitSide('limit-height')
        }else {
          setDimension({width: el.current.clientWidth})
          setLimitSide('limit-width')
        }
      }, 1000)
    }
    return ()=> clearInterval(a)
  }, [numPages])

  return (
    <div ref={el} className={`pdf-viewer ${limitSide}`}>
      <Document
        file={"https://cors-anywhere.herokuapp.com/ " + props.url}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} {...dimension} renderAnnotationLayer={false} />
      </Document>
      <Box direction='row'>
        <Box direction="row" className="pdf-control">
          <Button onClick={()=> navigate(pageNumber-1)}
            hoverIndicator="#5A0C0F"
            style={{background: '#7E1115', padding: '10px', boxShadow: 'none',
                      color: 'white', textAlign: 'center', borderRadius: '6px', height: '40px'}}
            >Prev</Button>
          <Text style={{width: '140px', textAlign: 'center', padding: '10px'}}> Page {pageNumber} of {numPages} </Text>
          <Button onClick={()=> navigate(pageNumber + 1)}
            hoverIndicator="#5A0C0F"
            style={{background: '#7E1115', padding: '10px', boxShadow: 'none',
                      color: 'white', textAlign: 'center', borderRadius: '6px', height: '40px'}}
          
            >Next</Button>
          {!presenter && !isLive && <Button onClick={()=> toggleLive(true)}
            hoverIndicator="#5A0C0F"
            style={{background: '#7E1115', padding: '10px', boxShadow: 'none',
                      color: 'white', textAlign: 'center', borderRadius: '6px', height: '40px'}}
            >Live</Button>}
        </Box>
      </Box>
    </div>
  );
}