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
            <Heading level={3}>Agora</Heading>
            <Anchor href="/about" label="About" color="grey" />
            <Anchor href="/pricing" label="Pricing" color="grey" />
            <Anchor href="/company" label="Company" color="grey" />
          </Box>
          <Box>
            <Text>Made with ❤️ in England + Switzerland</Text>
            <Text style={{ fontSize: 14 }}>© Copyright 2020 Agora</Text>
          </Box>
        </Box>
      </Box>
    );
  }
}
