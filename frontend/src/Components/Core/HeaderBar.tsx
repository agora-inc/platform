import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Box, Text, Layer, Button, Heading, Grommet, TextInput } from "grommet";
import { Search, Twitter, Slack, Play } from "grommet-icons";
import moraStreamFullLogo from "../../assets/general/mora_simple_m_cropped_logo_v3.png";
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
    var renderMobileView = (window.innerWidth < 900);
      return (
        <Box
          tag="header"
          direction="row"
          align="center"
          justify="between"
          pad={{ left: "xsmall", right: "small", vertical: "30px" }}
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
          <Box style={{ minWidth: "7vh" }} direction="row">

            <Link to="/" style={{ textDecoration: "none" }}>
              <Box direction="row" align="center">
                <MediaQuery minDeviceWidth={992}>
                  <img src={moraStreamFullLogo} style={{ height: "5vh", margin: 0 }}/>
                </MediaQuery>
                  <MediaQuery maxDeviceWidth={992}>
                    <img src={moraStreamFullLogo} style={{ height: "3vh", marginLeft: 5 }}/>
                    {/* <Text size="xsmall" color="black">mobile</Text> */}
                  </MediaQuery>
              </Box>
            </Link>
          </Box>

          <Box
            direction="row"
            gap="small"
            align="center"
            style={{ minWidth: "30%", maxHeight: "20px" }}
            justify="end"
            margin={{left: "10px"}}
          >
            {((this.props.location.pathname !== "/") && (this.props.location.pathname !== "/organisers")) && (
              <TimeZoneInfo />
            )}





          {/* <Box>
            <Link
              to={{ pathname: "/info/welcome" }}
              style={{ textDecoration: "none"}}
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
                <Text size="14px" weight="bold"> About us </Text>
              </Box>
            </Link>
          </Box> */}



        <Link
          to={{ pathname: "/b" }}
          style={{ textDecoration: "none" }}
        >
          <Box
            onClick={() => {}}
            background="#F2F2F2"
            hoverIndicator="#BAD6DB"
            round="xsmall"
            pad="xsmall"
            width={renderMobileView ? "150px" : "300px"}
            height="35px"
            justify="center"
            align="center"
            focusIndicator={false}
            margin={{ left: "0px" }}
            direction="row"
          >
            {/* <Play size="30px" /> */}
            <Text size="14px" margin={{left: "10px"}}> 
              <b> {renderMobileView ? "Browse seminars" : "Browse trending seminars"} </b>
            </Text>
          </Box>
        </Link>






          <Box
            width="40px"
            height="30px"
            round="7px"
            justify="center"
          >
            <a
              href="https://twitter.com/morastream"
            >
                <Twitter color='plain'/>
            </a>
          </Box>

          {/* <Box
            width="40px"
            height="30px"
            round="7px"
            justify="center"
          >
            <a
              href="https://join.slack.com/t/morastream/shared_invite/zt-13ug7lh9j-4ijI41o0iiGF5cmmZ8osYw"
            >
                <Slack color='plain'/>
            </a>
          </Box> */}


            <MediaQuery minDeviceWidth={992}>
              <UserManager showLogin={this.state.showLogin} />
            </MediaQuery> 
          </Box>

        </Box>
      );
  } 
}

export default withRouter(HeaderBar);
