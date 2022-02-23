import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Box, Text, Layer, Button, Heading, Grommet, TextInput } from "grommet";
import { Search } from "grommet-icons";

import moraStreamFullLogo from "../../assets/general/mora_simple_m_cropped_logo_v3.png";
import { Link } from "react-router-dom";
import { UserManager } from "../Account/UserManager";
import FormContainer from "../Homepage/FormContainer";
import SiteWideSearch from "./SiteWideSearch";
import TimeZoneInfo from "./TimeZoneInfo";
import MediaQuery from "react-responsive";

type State = {
  showLogin: boolean;
};

class HeaderBar extends Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      showLogin:
        new URL(window.location.href).searchParams.get("showLogin") === "true",
    };
  }

  componentDidUpdate(prevProps: RouteComponentProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({
        showLogin:
          new URL(window.location.href).searchParams.get("showLogin") ===
          "true",
      });
    }
  }

  render() {
    return (
      <Box
        tag="header"
        direction="row"
        align="center"
        justify="between"
        pad={{ left: "xsmall", right: "small", vertical: "small" }}
        elevation="none"
        style={{
          height: "8vh",
          minHeight: "8vh",
          width: "100vw",
          color: "black",
          position: "absolute",
          zIndex: 1000,
        }}
        {...this.props}
      >
        <Box style={{ minWidth: "15%" }}>
          <Link to="/" style={{ textDecoration: "none", width: 140 }}>
            <Box direction="row" align="center">
              <MediaQuery minDeviceWidth={992}>
                <img
                  src={moraStreamFullLogo}
                  style={{ height: "5vh", margin: 0 }}
                />
              </MediaQuery>
              <MediaQuery maxDeviceWidth={992}>
                <img
                  src={moraStreamFullLogo}
                  style={{ height: "3vh", marginLeft: 5 }}
                />
                {/* <Text size="xsmall" color="black">mobile</Text> */}
              </MediaQuery>
            </Box>
          </Link>
        </Box>
        {/* <MediaQuery minDeviceWidth={992}>
            <Link
              to={{ pathname: "/info/getting-started" }}
              style={{ textDecoration: "none" }}
            >
            <Box
                onClick={() => {}}
                background="white"
                round="xsmall"
                pad={{ bottom: "6px", top: "6px", left: "18px", right: "18px" }}
                justify="start"
                align="start"
                focusIndicator={false}
                style={{
                  border: "1px solid #C2C2C2",
                }}
                hoverIndicator={true}
              >
                <Text size="14px" color="grey">
                  {" "}
                  How to use me?{" "}
                </Text>
              </Box>
            </Link>
          </MediaQuery> */}

        {/* <MediaQuery minDeviceWidth={992}>
            <SiteWideSearch />
          </MediaQuery> */}
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
          gap="small"
          align="center"
          style={{ minWidth: "30%", maxHeight: "20px" }}
          justify="end"
        >
          {this.props.location.pathname !== "/" &&
            this.props.location.pathname !== "/organisers" && <TimeZoneInfo />}

          <Box>
            <Link
              to={{ pathname: "/info/welcome" }}
              style={{ textDecoration: "none" }}
            >
              <Box
                onClick={() => ({})}
                width="120px"
                height="30px"
                background="#BAD6DB"
                round="7px"
                justify="center"
                align="center"
                focusIndicator={false}
                hoverIndicator="#6DA3C7"
              >
                <Text size="14px" weight="bold">
                  {" "}
                  About us{" "}
                </Text>
              </Box>
            </Link>
          </Box>

          <MediaQuery minDeviceWidth={992}>
            <UserManager showLogin={this.state.showLogin} />
          </MediaQuery>
        </Box>
      </Box>
    );
  }
}

export default withRouter(HeaderBar);
