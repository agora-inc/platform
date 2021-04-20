import React, { FunctionComponent, useRef, useEffect } from "react";
import { Box, Text } from "grommet";

interface Props {
  id: string;
  stream: any;
  mute?: boolean;
  [key:string]: any
}


const VideoPlayerAgora:FunctionComponent<Props> = ({id, stream, style={}, className='', mute=false,  ...rest}) => {

  useEffect(()=>{
    if(stream) {
      stream.play(id)
    }
  }, [stream])


  return (
    <Box id={id} style={{position: 'relative', ...style, flex: 1}} className={`${!stream?'no-video':''} ${className}`} {...rest}>
      {!stream && <Text>No Video</Text>}
      {mute && <Text style={{zIndex: 200, position:'absolute', bottom: 20, left: 20, background: 'white', padding: 10, color: 'black'}} className='muted'>Muted</Text>}
    </Box>
  )
}

export default VideoPlayerAgora
