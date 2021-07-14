import React, { Component } from "react";
import { Box, Text, Button } from "grommet";

interface Props {
  text: string;
  onUpload: (e: any) => void;
  width?: string;
}

export default class SlidesUploader extends Component<Props> {
  render() {
    return (
      <Box style={{ position: "relative" }} width={this.props.width}>
        <input
            type="file" 
            name="upload" 
            id='upload'
            accept="application/pdf"
            className="input-hidden"
            onChange={this.props.onUpload}
        ></input>
        <label
          htmlFor='upload'
          style={{background: '#7E1115', flexBasis: '100%', padding: '10px', boxShadow: 'none', minWidth: '100px',
                    color: 'white', textAlign: 'center', borderRadius: '6px', height: '40px', width: this.props.width}}
        >
          {this.props.text}
        </label>
      </Box>
    );
  }
}
