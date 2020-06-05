import React, { Component } from "react";
import { Box, Text } from "grommet";

interface Props {
  width: string;
  height: string;
  disabled?: boolean;
  onClick: any;
  text: string;
}

export default class Button extends Component<Props> {
  render() {
    return (
      <Box
        height={this.props.height}
        background="white"
        round="xsmall"
        style={
          !this.props.disabled
            ? { border: "2px solid black" }
            : {
                border: "2px solid black",
                opacity: 0.4,
                pointerEvents: "none",
              }
        }
        align="center"
        justify="center"
        width={this.props.width}
        onClick={this.props.onClick}
        focusIndicator={false}
        hoverIndicator={true}
      >
        <Text weight="bold" color="black" size="16px">
          {this.props.text}
        </Text>
      </Box>
    );
  }
}
