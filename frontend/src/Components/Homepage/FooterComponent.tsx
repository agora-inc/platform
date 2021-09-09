import React, { Component } from "react";
import { Box, Text, Anchor, Heading } from "grommet";
import "../../Styles/footer.css";
import FormContainer from "./FormContainer";

export default class FooterComponent extends Component {
  render() {
    return (
      <Box
        pad="none"
        margin={{ top: "xlarge", bottom: "small" }}
        style={{
          position: "relative",
          bottom: 0,
          width: "98%",
        }}
      >
        <hr
          style={{
            height: 1.0,
            width: "100%",
            color: "#dadada",
            borderColor: "#dadada",
            backgroundColor: "#dadada",
            marginBottom: 5,
          }}
        />
        <Box direction="row" justify="between">
          <Box gap="xsmall" width="50%">
            {/* <a href="/info/welcome" style={{ color: "grey" }}>
              About us
            </a> */}
            {/* <a href="/info/getting-started" style={{ color: "grey" }}>
              Getting started
            </a> */}
            <a>
              <FormContainer />
            </a>
            <a href="/info/tos" style={{ color: "grey" }}>
              Terms of service
            </a>
            <a href="/info/privacy" style={{ color: "grey" }}>
              Data privacy
            </a>
          </Box>
          <Box gap="medium" width="50%">
            <Text size="14px" style={{textAlign: "right", marginRight: "5px"}}> where minds meet</Text>
            <Text style={{ fontSize: 14, marginRight: "5px", textAlign: "right"}}>mora.stream © 2021</Text>
          </Box>
        </Box>
      </Box>
    );
  }
}
