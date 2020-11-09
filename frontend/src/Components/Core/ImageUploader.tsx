import React, { Component } from "react";
import { Box, Text } from "grommet";

interface Props {
  text: string;
  onUpload: (e: any) => void;
  width?: string;
}

export default class ImageUploader extends Component<Props> {
  render() {
    return (
      <Box style={{ position: "relative" }} width={this.props.width}>
        <input
          type="file"
          accept="image/*"
          className="input-hidden"
          onChange={this.props.onUpload}
        ></input>
        <Box 
          width={this.props.width || "100px"}
          height="25px"
          background="white"
          round="xsmall"
          style={{ border: "solid black 2px", cursor: "pointer" }}
          align="center"
          justify="center"
        >
          <Text size="13px" weight="bold" color="black">
            {this.props.text}
          </Text>
        </Box>
      </Box>
    );
  }
}
