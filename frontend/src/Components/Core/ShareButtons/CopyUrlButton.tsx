import React, { Component } from "react";
import { Box } from "grommet";
import ReactTooltip from "react-tooltip";
import {Link as LinkIcon} from "grommet-icons";

interface Props {
  url: string;
}

export default class CopyUrlButton extends Component<Props, {}> {
  render() {
    return (
        <>
        <Box
        onClick={() => {navigator.clipboard.writeText(this.props.url); }}
        data-tip data-for='save_url_event'
        background="#5AAB61"
        round="xsmall"
        width="140px" height="35px"
        margin={{left: "2px"}}
        justify="center"
        align="center"
        focusIndicator={true}
        hoverIndicator={{color: "#62DB69"}}
        >
            <LinkIcon style={{width: 18, height: 18, stroke: "white"}} />
        </Box>
        <ReactTooltip id="save_url_event" effect="solid">
            Click to copy URL
        </ReactTooltip>
        </>
    );
  }
}