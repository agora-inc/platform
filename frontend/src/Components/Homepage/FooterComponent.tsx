import React, { Component } from "react";
import { Box, Text, Anchor, Heading } from "grommet";
import { Twitter, Linkedin } from "grommet-icons";
import "../../Styles/footer.css";
import FormContainer from "./FormContainer";
import { Link } from "react-router-dom";

export default class FooterComponent extends Component {
  render() {
    return (
      <Box
        pad="none"
        margin={{ top: "xlarge", bottom: "small" }}
        style={{
          position: "relative",
          bottom: 0,
          width: "99.9%",
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
            <p> <a href="https://www.linkedin.com/company/morastream"><Linkedin/></a> <a href="https://twitter.com/morastream"><Twitter/></a></p>

            {/* <a>
              <FormContainer />
            </a> */}
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
