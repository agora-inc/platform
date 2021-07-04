import React, { Component } from "react";
import { Box, Text } from "grommet";
import ReactTooltip from "react-tooltip";
import {Link as LinkIcon} from "grommet-icons";

interface Props {
  url: string;
  text?: string;
  height?: string;
  width?: string;
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
        width={this.props.width ? this.props.width : "100px"}
        height={this.props.height ? this.props.height : "35px"}
        margin={{left: "2px"}}
        justify="center"
        align="center"
        focusIndicator={true}
        hoverIndicator={{color: "#62DB69"}}
        >
          {!this.props.text && <LinkIcon style={{width: 18, height: 18, stroke: "white"}} />}
          {this.props.text && <Text size="16px" color="white"> {this.props.text} </Text> }
        </Box>
        <ReactTooltip id="save_url_event" effect="solid">
            Click to copy URL
        </ReactTooltip>
        </>
    );
  }
}