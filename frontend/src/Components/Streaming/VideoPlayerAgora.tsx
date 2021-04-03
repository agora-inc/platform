import React, { FunctionComponent, useRef, useEffect } from "react";
import { Box, Button } from "grommet";

interface Props {
  id: string;
  stream: any;
  [key:string]: any
}


const VideoPlayerAgora:FunctionComponent<Props> = ({id, stream, style={},  ...rest}) => {

  useEffect(()=>{
    if(stream) {
      stream.play(id)
    }
  }, [stream])


  return (
    <Box id={id} style={{position: 'relative', ...style}} {...rest}>
    </Box>
  )
}

export default VideoPlayerAgora
