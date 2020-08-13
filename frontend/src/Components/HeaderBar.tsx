import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Box, Text, Button, Heading, Grommet, TextInput } from "grommet";
import { Search } from "grommet-icons";
import { ReactComponent as Logo } from "../apollo.svg";
import { Link } from "react-router-dom";
import UserManager from "./Account/UserManager";
import FormContainer from "./Homepage/FormContainer";
import SiteWideSearch from "./SiteWideSearch";
import TimeZoneInfo from "./TimeZoneInfo";

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
        <Link
          to={{ pathname: "/info/getting-started" }}
          style={{ textDecoration: "none" }}
        >
          <Box
            onClick={() => {}}
            background="white"
            round="xsmall"
            pad={{ bottom: "6px", top: "6px", left: "18px", right: "18px" }}
            justify="center"
            align="center"
            focusIndicator={false}
            style={{
              border: "1px solid #C2C2C2",
            }}
            hoverIndicator={true}
          >
            <Text size="16px" color="grey">
              {" "}
              How to use me?{" "}
            </Text>
          </Box>
        </Link>
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
          gap="medium"
          align="center"
          style={{ minWidth: "30%" }}
          justify="end"
        >
          <FormContainer />
          <TimeZoneInfo />
          <UserManager showLogin={this.state.showLogin} />
        </Box>
      </Box>
    );
  }
}

export default withRouter(HeaderBar);
