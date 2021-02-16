import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
// import "../Styles/home.css";
import MediaQuery from "react-responsive";


export default class LandingPage extends Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <Box>
        <Text>
          Alanou lapinou is the best
        </Text>
      </Box>
    );
  }
}
