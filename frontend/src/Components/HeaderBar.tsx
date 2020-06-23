import React, { Component } from "react";
import { Box, Button, Heading, Grommet, TextInput } from "grommet";
import { Search } from "grommet-icons";
import { ReactComponent as Logo } from "../apollo.svg";
import { Link } from "react-router-dom";
import UserManager from "./Account/UserManager";
import FormContainer from "./Homepage/FormContainer";
import SiteWideSearch from "./SiteWideSearch";
import TimeZoneInfo from "./TimeZoneInfo";

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
        pad={{ left: "xsmall", right: "small", vertical: "small" }}
        elevation="none"
        style={{
          height: "6vh",
          minHeight: "6vh",
          width: "100vw",
          color: "black",
          position: "absolute",
          zIndex: 100,
        }}
        {...this.props}
      >
        <Box style={{ minWidth: "30%" }}>
          <Link to="/" style={{ textDecoration: "none", width: 140 }}>
            <Box direction="row" align="center">
              <Logo style={{ height: "5vh", margin: 0 }} />
              <Heading
                level="3"
                margin="none"
                style={{ fontSize: 28, color: "black" }}
              >
                Agora
              </Heading>
            </Box>
          </Link>
        </Box>
        <SiteWideSearch />
        {/* <Box>
          <TextInput
            icon={<Search />}
            reverse
            placeholder="search ..."
            style={{ width: "27vw", height: "4.5vh", justifySelf: "center" }}
          />
        </Box> */}
        <Box
          direction="row"
          gap="xsmall"
          align="center"
          style={{ minWidth: "30%" }}
          justify="end"
        >
          <FormContainer />
          <TimeZoneInfo />
          <UserManager />
        </Box>
      </Box>
    );
  }
}
