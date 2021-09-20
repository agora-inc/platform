import React, { FunctionComponent, useRef, useEffect, useState } from "react";
import { Box, Text } from "grommet";

interface Props {
  id: string;
  stream: any;
  mute?: boolean;
  [key:string]: any
}


const VideoPlayerAgora:FunctionComponent<Props> = ({id, stream, style={}, className='', mute=false,  ...rest}) => {
  const el = useRef<HTMLDivElement>(null)
  const [limitSide, setLimitSide] = useState('limit-width' as any)

  useEffect(()=>{
    let a:any = null
    if(stream) {
      stream.play(id)
      clearInterval(a)
      a= setInterval(()=>{
        if(!el.current) return
        let video = el.current.querySelector('video')
        if(!video) return

        let viewR = el.current.clientHeight/(el.current.clientWidth + 0.01)
        let videoR = video.clientHeight / video.clientWidth

        if(viewR < videoR){
          setLimitSide('limit-height')
        }else {
          setLimitSide('limit-width')
        }
      }, 1000)
    }
    return ()=> clearInterval(a)
  }, [stream])



  return (
    <Box ref={el} id={id} style={{position: 'relative', ...style, flex: 1}} className={`agora-video-player ${!stream?'no-video':''} ${limitSide} ${className}`} {...rest}>
      {!stream && <Text>No Video</Text>}
      {mute && <Text style={{zIndex: 200, position:'absolute', bottom: 20, left: 20, background: 'white', padding: 10, color: 'black'}} className='muted'>Muted</Text>}
    </Box>
  )
}

export default VideoPlayerAgora
