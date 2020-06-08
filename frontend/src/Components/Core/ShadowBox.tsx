import React, { Component } from "react";
import { Box } from "grommet";

interface Props {
  background: string;
  height: string;
  width: string;
  zIndex: number;
  offset?: number;
  [x: string]: any;
}

export default class ShadowBox extends Component<Props, {}> {
  render() {
    return (
      <Box
        style={{
          position: "relative",
          //   marginBottom: this.props.height,
          width: this.props.width,
          height: this.props.height,
          alignSelf: "center",
        }}
      >
        <Box
          {...this.props}
          style={{
            position: "absolute",
            alignSelf: "center",
            top: 0,
            zIndex: this.props.zIndex + 1,
          }}
          //   width={this.props.width}
          //   height={this.props.height}
        >
          {this.props.children}
        </Box>
        <Box
          style={{
            position: "absolute",
            alignSelf: "center",
            top: this.props.offset ? this.props.offset : 7,
            left: this.props.offset ? this.props.offset : 7,
            opacity: "70%",
            zIndex: this.props.zIndex,
          }}
          //   width={this.props.width}
          //   height={this.props.height}
          width="100%"
          height="100%"
          background={this.props.background}
          round="small"
        ></Box>
      </Box>
    );
  }
}
