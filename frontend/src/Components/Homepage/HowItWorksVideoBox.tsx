import React, { Component } from "react";
import { Box, Text, Heading, Layer } from "grommet";

interface Props {
  headericon: React.ReactNode;
  headertext: string;
  content: string;
  videolink: string;
}

export default class HowItWorksVideoBox extends Component<Props> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <Box
        style={{ minWidth: "250px", maxWidth: "300px" }}
        height="auto"
        background="color2"
        direction="column"
        justify="between"
      >
        <Box height="230px" pad="medium" gap="10px">
          <Box direction="row" height="60px" width="100%">
            <Box width="70px">{this.props.headericon}</Box>
            <Box height="170px">
              <Text
                size="24px"
                weight="bold"
                margin={{ left: "5px" }}
                color="color7"
              >
                {this.props.headertext}
              </Text>
            </Box>
          </Box>
          <Text size="18px" style={{ alignContent: "start" }}>
            {this.props.content}
          </Text>
        </Box>
        <Box height="200px" alignSelf="center" direction="row">
          <video
            autoPlay
            loop
            muted
            style={{
              height: "100%",
              width: "auto",
              alignSelf: "center",
              maxWidth: "100%",
            }}
          >
            <source src={this.props.videolink} type="video/mp4" />
          </video>
        </Box>
      </Box>
    );
  }
}
