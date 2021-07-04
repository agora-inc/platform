import React, { FunctionComponent, useRef, useEffect } from "react";
import { Box, Button } from "grommet";

interface Props {
  id: string;
  stream: any;
  [key:string]: any
}


const VideoPlayerAgora:FunctionComponent<Props> = ({id, stream, style={},  ...rest}) => {
  const videoContainer = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if(stream) {
      stream.play(id)
    }
  }, [stream])

  function toggleFullscreen() {
    let fullscreenEl = document.fullscreenElement
    if(fullscreenEl) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      return
    }

    console.log(videoContainer)
    let element = videoContainer.current!
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }

  }


  return (
    <Box style={{position: 'relative', ...style}} {...rest}>
      <Box ref={videoContainer} style={{display: 'flex', flex: 1}} id={id}>
      </Box>
      <Button style={{position: 'absolute', right: '5px', top: '5px'}} label="Fullscreen" primary size='small' onClick={toggleFullscreen} />
    </Box>
  )
}

export default VideoPlayerAgora
