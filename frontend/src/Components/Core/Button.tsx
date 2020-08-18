import React, { Component } from "react";
import { Box, Text } from "grommet";

interface Props {
  width: string;
  height: string;
  disabled?: boolean;
  onClick: any;
  text: string;
  fill?: string;
  hoverIndicator?: string;
}

export default class Button extends Component<Props> {
  render() {
    const borderStyle = this.props.fill ? "none" : "2px solid black";
    return (
      <Box
        height={this.props.height}
        background={this.props.fill || "white"}
        round="xsmall"
        style={
          !this.props.disabled
            ? { border: borderStyle }
            : {
                border: borderStyle,
                opacity: 0.4,
                pointerEvents: "none",
              }
        }
        align="center"
        justify="center"
        width={this.props.width}
        onClick={this.props.onClick}
        focusIndicator={false}
        hoverIndicator={this.props.hoverIndicator || true}
      >
        <Text
          weight="bold"
          color={this.props.fill ? "white" : "black"}
          size="16px"
        >
          {this.props.text}
        </Text>
      </Box>
    );
  }
}
