import React, { Component, FunctionComponent } from "react";
import { Box, Text, Button } from "grommet";

interface Props {
  name: string;
  getUrl?: any;
  url?: string;
  text?: string;
  width?: string;
}

const FileDownloader:FunctionComponent<Props> = (props) => {

    async function getFile() {
        if(!props.url){
            return
        }
        let file = await fetch(props.url)
        let blob = await file.blob()
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = props.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a)
    }
    return(
      <Box style={{ position: "relative" }}>
          <Box
            width={props.width || "100px"}
            background="white"
            round="xsmall"
            style={{ border: "solid black 1px", cursor: "pointer", position: 'relative' }}
            align="center"
            justify="center"
           onClick={getFile}>{props.text || 'Download'}</Box>
      </Box>
    )
}

export default FileDownloader;

