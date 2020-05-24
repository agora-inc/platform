import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";


interface State {
  hover: boolean;
}

export default class PreferenceButton extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      hover: false,
    };
  }

  render() {
    return (
      <Link to={`/preferences`}>
        <Box
          onMouseEnter={() => {
            this.setState({ hover: true });
          }}
          onMouseLeave={() => {
            this.setState({ hover: false });
          }}
          direction="row"
          gap="xsmall"
          align="center"
          background={this.state.hover ? "#f2f2f2" : "white"}
          pad="xsmall"
          justify="between"
        >
          <Text> Preferences </Text>
          <Box
            height="20px"
            width="20px"
            round="10px"
            justify="center"
            align="center"
            overflow="hidden"
          >
          </Box>
        </Box>
      </Link>
    );
  }
}
