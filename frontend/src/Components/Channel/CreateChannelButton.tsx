import React, { Component } from "react";
import { Box, Text } from "grommet";
import { Group } from "grommet-icons"
import Identicon from "react-identicons";
import { Channel } from "../../Services/ChannelService";
import agoraLogo from "../../assets/general/agora_logo_v2.1.svg";
import ReactTooltip from "react-tooltip";

interface Props {
  onClick: any;
  width?: string;
  height?: string;
  text?: string;
  textSize?: string;
  textColor?: string;
}

interface State {
  hover: boolean;
}

export default class CreateChannelButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hover: false,
    };
  }

  render() {
    return (
      <Box
        data-tip data-for="create_agora_button"
        onClick={this.props.onClick}
        onMouseEnter={() => {
          this.setState({ hover: true });
        }}
        onMouseLeave={() => {
          this.setState({ hover: false });
        }}
        direction="row"
        gap="small"
        align="center"
        width={this.props.width ? (this.props.width) : "fill"}
        height={this.props.height ? (this.props.height) : "fill"}
        round="xsmall"
        pad="small"
        background="color1"
        hoverIndicator="color3"
        focusIndicator={false}
        justify="center"
      >
        <Text 
          size={this.props.textSize ? this.props.textSize : "14px"}  
          color={this.props.textColor ? this.props.textColor : "white"}
          weight="bold"
        ><Group size="medium" style={{marginRight: "10px"}}/>
            {this.props.text ? this.props.text : "Create an agora"}
        </Text>
        {/* <Text size="22.5px">🚀</Text> */}
        <ReactTooltip id="create_agora_button" effect="solid">
            Create a new channel (we call it agora) for your seminar series
        </ReactTooltip>
      </Box>

    );
  }
}
