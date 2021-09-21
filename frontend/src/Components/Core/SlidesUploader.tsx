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
        justify="center"
        align="center"
        pad="small"
        focusIndicator={false}
        height="50px"
        background="color1"
        hoverIndicator="#BAD6DB"
        style={{borderRadius:'6px'}}
        onClick={()=>{}}
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
