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
      <Box
        background="#EAF1F1"
        round="xsmall"
        justify="center"
        align="center"
        height="40px"
        width="100%"
        onClick={getFile}
        focusIndicator={false}
        hoverIndicator="#BAD6DB"
      >
        {/* <Text alignSelf="center" color="grey" size="14px">
          {this.state.saved ? "Save talk": "Remove from saved"}
        </Text> */}
        <Text alignSelf="center" color="black" size="14px"> 
          Download slides
        </Text>
      </Box>
    )
}

export default FileDownloader;

