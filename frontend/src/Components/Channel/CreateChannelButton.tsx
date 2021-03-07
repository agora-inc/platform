import React, { Component } from "react";
import { Box, Text } from "grommet";
import Identicon from "react-identicons";
import { Channel } from "../../Services/ChannelService";
import agoraLogo from "../../assets/general/agora_logo_v2.png";

interface Props {
  onClick: any;
  width?: string;
  height?: string
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
        pad="xsmall"
        style={{
          border: "2px solid #C2C2C2",
        }}
        hoverIndicator={true}
        focusIndicator={false}
        justify="start"
        margin={{top: "small"}}
      >
        {/* background={this.state.hover ? "#f2f2f2" : "white"} */}
        <Text size="22.5px">🚀</Text>
        <Text size="14px" color="grey"> Create an <img src={agoraLogo} style={{ height: "14px"}}/> </Text>
        
      </Box>
    );
  }
}
