import React, { Component } from "react";
import { Box, Text, Anchor, Heading } from "grommet";
import "../../Styles/footer.css";

export default class FooterComponent extends Component {
  render() {
    return (
      <Box
        pad="none"
        margin={{ top: "xlarge", bottom: "small" }}
        style={{
          position: "relative",
          bottom: 0,
          width: "100%",
        }}
      >
        <hr
          style={{
            height: 1.0,
            width: "100%",
            color: "#dadada",
            borderColor: "#dadada",
            backgroundColor: "#dadada",
            marginBottom: 20,
          }}
        />
        <Box direction="row" justify="between">
          <Box gap="xsmall">
            <a href="/info/welcome" style={{ color: "grey" }}>
              About us
            </a>
            <a href="/info/getting-started" style={{ color: "grey" }}>
              Getting started
            </a>
            <a href="/info/tos" style={{ color: "grey" }}>
              Terms of service
            </a>
            <a href="/info/privacy" style={{ color: "grey" }}>
              Data privacy
            </a>
          </Box>
          <Box gap="medium">
            <Text size="18px"> Made by Researchers for Researchers.</Text>
            <Text style={{ fontSize: 14 }} alignSelf="end">agora.stream © 2020</Text>
          </Box>
        </Box>
      </Box>
    );
  }
}
