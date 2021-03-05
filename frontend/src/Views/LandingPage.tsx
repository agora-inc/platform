import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Box, Text, Heading } from "grommet";
// import { ReactComponent as Logo } from "../apollo.svg";
import Logo from "../assets/general/logo_v2.png";

import { User, UserService } from "../Services/UserService";
import { Search, Play, Add, Channel, ScheduleNew, Multiple } from "grommet-icons";
import UserManager from "../Components/Account/UserManager";
import FooterComponent from "../Components/Homepage/FooterComponent";
import "../Styles/landing-page.css";
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
        <Box
          direction="row"
          gap="small"
          align="end"
          style={{ minWidth: "90%", maxHeight: "40px" }}
          margin={{top: "20px"}}
          justify="end"
        >
          <UserManager showLogin={this.state.showLogin} />
        </Box>
        
        { /* Column version */ }

        <video 
          autoPlay loop muted id="background-landing" 
          style={{ width: "100%", top: "0px" }}
        >
          <source src="https://video.wixstatic.com/video/9b9d14_37244669d1c749ab8d1bf8b15762c61a/720p/mp4/file.mp4" type="video/mp4" /> 
        </video>

        <Box direction="column" justify="center" margin={{right: "60px"}} >
          
          <Box direction="row" justify="center" style={{justifyContent: "center"}} margin={{top: "50px"}}>
            {/* <Logo style={{ height: "60px", width: "60px"}} /> */}
            <img src={Logo} style={{ height: "50px", width: "55px"}}/>
            <Heading
              level="1"
              // margin={{ top: "5px" }}
              style={{ fontSize: "48px", color: "black" }}
            >
              gora.stream
            </Heading>
          </Box>


          <Box direction="column" justify="center" margin={{top: "5px"}}> 
            <Text size="16px" weight="bold"> 
            {/* A click away from any academic seminars in the world. */}
            Opening the doors to all online academic seminars in the world.
            </Text>
          </Box>

        </Box>

        <Box 
          direction="row" 
          gap="50px" 
          focusIndicator={false}
          margin={{top: "80px"}}
        >
          <Link
            to={{ pathname: "/browse" }}
            style={{ textDecoration: "none" }}
          >
            <Box
              onClick={() => ({})}
              background="#DDDDDD"
              round="xsmall"
              margin={{ horizontal: "small" }}
              pad="xsmall"
              height="100px"
              width="176px"
              justify="center"
              align="center"
              focusIndicator={false}
              hoverIndicator="#CCCCCC"
            >
              <Search size="30px"/>
              <Text size="16px" weight="bold" margin={{top: "10px"}}> Find future seminars </Text>
            </Box>
          </Link>
          <Link
            to={{ pathname: "/past" }}
            style={{ textDecoration: "none" }}
          >
            <Box
              onClick={() => ({})}
              background="#DDDDDD"
              round="xsmall"
              margin={{ horizontal: "small" }}
              pad="xsmall"
              height="100px"
              width="176px"
              justify="center"
              align="center"
              focusIndicator={false}
              hoverIndicator="#CCCCCC"
            >
              <Play size="30px" />
              <Text size="16px" weight="bold" margin={{top: "10px"}}> Watch past seminars </Text>
            </Box>
          </Link>
          <Link
            to={{ pathname: "/info/getting-started" }}
            style={{ textDecoration: "none" }}
          >
            <Box
              onClick={() => ({})}
              background="#DDDDDD"
              round="xsmall"
              margin={{ horizontal: "small" }}
              pad="xsmall"
              height="100px"
              width="176px"
              justify="center"
              align="center"
              focusIndicator={false}
              hoverIndicator="#CCCCCC"
            > 
              <Add size="30px" />
              <Text size="16px" weight="bold" margin={{top: "10px"}}> Create an <img src={Logo} style={{ height: "14px", width: "16px"}}/>gora </Text>
            </Box>
          </Link>
          <Link
            to={{ pathname: "/agoras" }}
            style={{ textDecoration: "none" }}
          >
            <Box
              onClick={() => ({})}
              background="#DDDDDD"
              round="xsmall"
              margin={{ horizontal: "small" }}
              pad="xsmall"
              height="100px"
              width="176px"
              justify="center"
              align="center"
              focusIndicator={false}
              hoverIndicator="#CCCCCC"
            >
              <Multiple size="30px" />
              <Text size="16px" weight="bold" margin={{top: "10px"}}> Discover all <img src={Logo} style={{ height: "14px", width: "14px"}}/>goras </Text>
            </Box>
          </Link>
        </Box>



        <Box 
          direction="row" 
          gap="150px"
          margin={{top: "100px", left:"-50px"}}
        >
          <Box direction="column" justify="start" style={{minWidth: "50%"}}>
            <Text size="21px" margin={{bottom: "12px"}}> What is an <img src={Logo} style={{ height: "16px", width: "16px"}}/>gora? </Text>
            <Text size="14px" margin={{bottom: "6px"}}> An agora is a community hub </Text>
            <Text size="14px" margin={{bottom: "6px"}} weight="bold"> It is the place where seminars are hosted and future events advertised </Text>
            <Text size="14px" margin={{bottom: "6px"}}> Visit and connect with any agora by becoming a member or a future speaker </Text>
            <Text size="14px" margin={{bottom: "6px"}} weight="bold"> Follow some Agoras to never miss out on their awesome events! </Text>

          </Box>
          <Box direction="column" justify="start" style={{minWidth: "50%"}}>
            <Text size="21px" margin={{bottom: "12px"}}> Our values </Text>
            <Text size="14px" margin={{bottom: "6px"}} weight="bold"> Democratizing access to cutting-edge research </Text>
            <Text size="14px" margin={{bottom: "6px"}}> Cut global travel of academics and fight climate change </Text>
            <Text size="14px" margin={{bottom: "6px"}} weight="bold"> Empower academics' reach and visibility </Text>
            <Text size="14px" margin={{bottom: "6px"}}> Provide a social and interactive solution to online academic seminars</Text>
          </Box>
 
        </Box>


        { /*

        <Box direction="row" gap="50px">

          <Box direction="column" justify="center" margin={{right: "60px"}} >
            <Box direction="row" margin={{top: "70px"}}>
              <Logo style={{ height: "60px", width: "60px"}} />
              <Heading
                level="1"
                margin={{ top: "13px" }}
                style={{ fontSize: "48px", color: "black" }}
              >
                gora.stream
              </Heading>
            </Box>

            <Box direction="column" margin={{top: "-20px"}}> 
              <Text size="18px"> 
                Live stream seminars from the best
              </Text>
              <Text size="18px"> 
                academics in the world - for FREE!
              </Text>
            </Box>
          </Box>
          <Box 
            direction="column" 
            gap="50px" 
            focusIndicator={false}
            margin={{top: "80px"}}
          >
            <Link
              to={{ pathname: "/browse" }}
              style={{ textDecoration: "none" }}
            >
              <Box
                background="#F2F2F2"
                round="xsmall"
                margin={{ horizontal: "small" }}
                pad="xsmall"
                height="100px"
                width="162px"
                justify="center"
                align="center"
                focusIndicator={false}
                hoverIndicator="#5A0C0F"
              >
                <Text size="18px" weight="bold"> Find </Text>
                <Text size="18px" weight="bold"> future seminars </Text>
              </Box>
            </Link>
            <Link
              to={{ pathname: "/past" }}
              style={{ textDecoration: "none" }}
            >
              <Box
                background="#F2F2F2"
                round="xsmall"
                margin={{ horizontal: "small" }}
                pad="xsmall"
                height="100px"
                width="162px"
                justify="center"
                align="center"
                focusIndicator={false}
                hoverIndicator={true}
              >
                <Text size="18px" weight="bold"> Watch  </Text>
                <Text size="18px" weight="bold"> past seminars </Text>
              </Box>
            </Link>
          </Box>

          <Box 
            direction="column" 
            gap="50px"
            focusIndicator={false}
            margin={{top: "80px"}}
          >
            <Link
              to={{ pathname: "/browse" }}
              style={{ textDecoration: "none" }}
            >
              <Box
                background="#F2F2F2"
                round="xsmall"
                margin={{ horizontal: "small" }}
                pad="xsmall"
                height="100px"
                width="162px"
                justify="center"
                align="center"
                focusIndicator={false}
                hoverIndicator="#5A0C0F"
              >
                <Text size="18px" weight="bold"> Create </Text>
                <Text size="18px" weight="bold"> an Agora </Text>
              </Box>
            </Link>
            <Link
              to={{ pathname: "/agoras" }}
              style={{ textDecoration: "none" }}
            >
              <Box
                background="#F2F2F2"
                round="xsmall"
                margin={{ horizontal: "small" }}
                pad="xsmall"
                height="100px"
                width="162px"
                justify="center"
                align="center"
                focusIndicator={false}
                hoverIndicator="#5A0C0F"
              >
                <Text size="18px" weight="bold"> Discover</Text>
                <Text size="18px" weight="bold"> all Agoras </Text>
              </Box>
            </Link>
          </Box>
        </Box>

        <Box 
          direction="row" 
          gap="200px"
          margin={{top: "150px", left:"-240px"}}
          // background="rgba(96, 110, 235, 0.7)"
        >
          <Box direction="column" justify="start" style={{minWidth: "50%"}}>
            <Text size="21px"> What do we believe in? </Text>
            <Text size="14px" margin={{top: "10px"}}> Values </Text>
          </Box>
          <Box direction="column" justify="start" style={{minWidth: "50%"}}>
            <Text size="21px"> What is an agora? </Text>
            <Text size="14px" margin={{top: "10px"}}> An agora is like a youtube channel </Text>
          </Box>
        </Box>

        */}

        <Box width="1024px" align="center">
          <FooterComponent />
        </Box>

      </Box>
    );
  }
}
