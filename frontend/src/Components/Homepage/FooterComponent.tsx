import React, { Component } from "react";
import { Box, Text, Anchor, Heading } from "grommet";

export default class FooterComponent extends Component {
  render() {
    return (
      <Box
        pad="none"
        margin={{ top: "xlarge", bottom: "large" }}
        style={{
          position: "relative",
          bottom: 0,
          width: "82%",
        }}
      >
        <hr
          style={{
            height: 1.0,
            width: "100%",
            color: "#dadada",
            borderColor: "#dadada",
            backgroundColor: "#dadada",
            marginBottom: 50,
          }}
        />
        <Box direction="row" justify="between">
          <Box>
            <Anchor href="/info/welcome" label="About us" color="grey" />
            <Anchor href="/info/tos" label="Terms of service" color="grey" />
            <Anchor href="/info/privacy" label="Data privacy" color="grey" />
          </Box>
          <Box>
            <Text>Made by Researchers for Researchers.</Text>
            <Text style={{ fontSize: 14 }}>agora.stream © 2020</Text>
          </Box>
        </Box>
      </Box>
    );
  }
}
