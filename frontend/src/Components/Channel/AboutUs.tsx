import React, { Component } from "react";
import { Box, Text } from "grommet";

interface Props {
  text: any;
}

export default class AboutUs extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Box>
        <Text size="24px" weight="bold" color="black">
          About
        </Text>
        <Text size="20px" color="black">
          {this.props.text}
        </Text>
      </Box>
    );
  }
}
