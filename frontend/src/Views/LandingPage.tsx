import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Box, Text, Heading } from "grommet";
import { ReactComponent as Logo } from "../apollo.svg";
import { User, UserService } from "../Services/UserService";
import UserManager from "../Components/Account/UserManager";
import MediaQuery from "react-responsive";

interface State {
  user: User | null
  showLogin: boolean
}

export default class LandingPage extends Component<RouteComponentProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: UserService.getCurrentUser(),
      showLogin: new URL(window.location.href).searchParams.get("showLogin") === "true",
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
        direction="column"
        align="center"
      >
        <Box direction="row" margin={{top: "50px"}}>
          <Logo style={{ height: "60px", width: "60px"}} />
          <Heading
            level="1"
            margin={{ top: "13px" }}
            style={{ fontSize: 48, color: "black" }}
          >
            gora.stream
          </Heading>
          <Box
            direction="row"
            gap="small"
            align="end"
            style={{ minWidth: "30%", maxHeight: "20px" }}
            justify="end"
          >
            <UserManager showLogin={this.state.showLogin} />
          </Box>
        </Box>

        <Box direction="row"> 
          <Text size="24px"> 
            Learn from the best academics in the world -- live and for FREE
          </Text>
        </Box>


        <Box gap="xsmall" pad={{ vertical: "medium" }} focusIndicator={false}>
          <Link
            to={{ pathname: "/browse" }}
            style={{ textDecoration: "none" }}
          >
            <Box
              // onClick={this.toggleDropdown}
              background="#7E1115"
              round="xsmall"
              margin={{ horizontal: "small" }}
              pad="xsmall"
              height="40px"
              justify="center"
              align="center"
              focusIndicator={false}
              hoverIndicator="#5A0C0F"
            >
              <Text size="14px"> Find future seminars </Text>
            </Box>
          </Link>
        </Box>

        <Box direction="row">
          <Box direction="column">
            What is an agora?
          </Box>
          <Box direction="column">
            What do we believe in? 
          </Box>
        </Box>

      </Box>
    );
  }
}
