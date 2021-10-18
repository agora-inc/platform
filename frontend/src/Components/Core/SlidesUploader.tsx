import React, { Component } from "react";
import { Box, Text, Button } from "grommet";

interface Props {
  text: string;
  onUpload: (e: any) => void;
  width?: string;
  disabled?: boolean
}

export default class SlidesUploader extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <Box
        width={this.props.width ? this.props.width : "100%"}
        justify="center"
        alignSelf="center"
        pad="small"
        focusIndicator={false}
        height="30px"
        background={this.props.disabled ? "grey" : "color1"}
        hoverIndicator={this.props.disabled ? "grey" : "#BAD6DB"}
        style={{borderRadius:'6px'}}
        onClick={()=>{}}
      >
        {!this.props.disabled && 
        (<input
          width="100%"
          type="file" 
          name="upload" 
          id='upload'
          accept="application/pdf"
          className="input-hidden"
          onChange={this.props.onUpload}
        />)}
        
         <Text size="12px" weight="bold" style={{alignSelf: "center"}} color="white"> {this.props.text} </Text>

      </Box>
    );
  }
}
