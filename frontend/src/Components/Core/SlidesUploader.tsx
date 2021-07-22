import React, { Component } from "react";
import { Box, Text, Button } from "grommet";

interface Props {
  text: string;
  onUpload: (e: any) => void;
  width?: string;
}

export default class SlidesUploader extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <Box
        background="white"
        round="xsmall"
        height="30px"
        width="100%"
        justify="center"
        align="center"
        focusIndicator={true}
        hoverIndicator={true}
        style={{
          border: "1px solid #C2C2C2",
        }}
      >
        <input
          width="100%"
          type="file" 
          name="upload" 
          id='upload'
          accept="application/pdf"
          className="input-hidden"
          onChange={this.props.onUpload}
        />
         <Text size="14px" weight="bold"> {this.props.text} </Text>

      </Box>
    );
  }
}
