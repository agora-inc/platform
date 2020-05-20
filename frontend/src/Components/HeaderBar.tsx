import React, { Component } from "react";
import { Box, Button, Heading, Grommet, TextInput } from "grommet";
import { Search } from "grommet-icons";
import { ReactComponent as Logo } from "../apollo.svg";
import { Link } from "react-router-dom";
import UserManager from "./UserManager";
import FormContainer from "./FormContainer"

export default class HeaderBar extends Component {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <Box
        tag="header"
        direction="row"
        align="center"
        justify="between"
        background="white"
        pad={{ left: "small", right: "small", vertical: "small" }}
        elevation="none"
        style={{
          height: "8vh",
          minHeight: "8vh",
          width: "100vw",
          color: "black",
          position: "absolute",
          zIndex: 100,
        }}
        {...this.props}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <Box direction="row" align="center" style={{ width: 224 }}>
            <Logo style={{ height: "6vh" }} />
            <Heading
              level="3"
              margin="xsmall"
              style={{ fontSize: 34, color: "black" }}
            >
              Agora
            </Heading>
          </Box>
        </Link>
        <Box>
          <TextInput
            icon={<Search />}
            reverse
            placeholder="search ..."
            style={{ width: "27vw" }}
          />
        </Box>
        <FormContainer />
        <UserManager />
      </Box>
    );
  }
}
