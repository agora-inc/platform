import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Box, Text, Layer, Button, Heading, Grommet, TextInput } from "grommet";
import { Search } from "grommet-icons";

import agoraStreamFullLogo from "../../assets/general/agora.stream_logo_v2.1.png";
import { Link } from "react-router-dom";
import UserManager from "../Account/UserManager";
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
    if (this.props.location.pathname !== "/") {
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
                <img src={agoraStreamFullLogo} style={{ height: "5vh", margin: 0 }}/>
                </MediaQuery>
                  <MediaQuery maxDeviceWidth={992}>
                <img src={agoraStreamFullLogo} style={{ height: "3vh", marginLeft: 5 }}/>
                    <Text size="xsmall" color="black">mobile</Text>
                    </MediaQuery>
              </Box>
            </Link>
              <MediaQuery minDeviceWidth={992}>
                <Text 
                  size="12px"
                  color="grey"
                  margin={{start: "1.6%"}}
                  style={{
                    // height: "30px",
                    overflow: "auto",
                    fontStyle: "italic",
                  }}
                >
                  Connecting academics
                </Text>
                {/* Automating the academic seminar organisation pipeline. */}
              </MediaQuery>
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
            <TimeZoneInfo />
          <MediaQuery minDeviceWidth={992}>
            <UserManager showLogin={this.state.showLogin} />
          </MediaQuery> 
          </Box>

        </Box>
      );
    } else {
      return null;
    }
  } 
}

export default withRouter(HeaderBar);