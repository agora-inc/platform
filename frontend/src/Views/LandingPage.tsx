import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Box, Text, Heading } from "grommet";
import agoraStreamFullLogo from "../assets/general/agora.stream_logo_v2.1.png";
import agoraLogo from "../assets/general/agora_logo_v2.1.png";

import { User, UserService } from "../Services/UserService";
import { Search, Play, Add, Channel, ScheduleNew, Multiple } from "grommet-icons";
import UserManager from "../Components/Account/UserManager";
import FooterComponent from "../Components/Homepage/FooterComponent";
import "../Styles/landing-page.css";
import MediaQuery from "react-responsive";
import TrendingChannelsList from "../Components/Homepage/TrendingChannelsList";



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

  showDynamicTextValue() {
    // Changes every second
    var dynamicTextValueList = [
      "Opening the doors to all online academic seminars in the world",
      "Democratizing access to cutting-edge research",
      "Leveraging modern technologies in the service of academics",
      "Cutting global travel of academics and fight climate change",
      "Empowering academics reach and visibility",
      "Automating the seminar organisation pipeline",
      "Bridging academic and industrial researchers"
    ];

    var now = Date.now();
    return dynamicTextValueList[now % dynamicTextValueList.length]
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

        <Box direction="column" justify="center" style={{justifyContent: "center"}}>
          
          <Box direction="row" justify="center" style={{justifyContent: "center"}} margin={{top: "50px", bottom: "20px"}}>
            {/* <Logo style={{ height: "60px", width: "60px"}} /> */}
            <img src={agoraStreamFullLogo} style={{ height: "90px"}}/>
          </Box>


          <Box direction="column" justify="center" margin={{top: "5px"}}> 
            <Text size="16px" weight="bold" alignSelf="center"> 
              {this.showDynamicTextValue()}
            </Text>
          </Box>

        </Box>

        <Box 
          direction="row" 
          gap="50px" 
          focusIndicator={false}
          margin={{top: "70px"}}
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
              height="130px"
              width="176px"
              justify="center"
              align="center"
              focusIndicator={false}
              hoverIndicator="#CCCCCC"
            >
              <Search size="30px"/>
              <Text size="16px" weight="bold" margin={{top: "10px"}}> Browse </Text>
              <Text size="16px" margin={{top: "10px"}}> future seminars </Text>
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
              height="130px"
              width="176px"
              justify="center"
              align="center"
              focusIndicator={false}
              hoverIndicator="#CCCCCC"
            >
              <Play size="30px" />
              <Text size="16px" weight="bold" margin={{top: "10px"}}> Watch</Text>
              <Text size="16px" margin={{top: "10px"}}> past seminars </Text>
            </Box>
          </Link>
          <Link
            to={{ pathname: "info/agora_creation" }}
            style={{ textDecoration: "none" }}
          >
            <Box
              onClick={() => ({})}
              background="#DDDDDD"
              round="xsmall"
              margin={{ horizontal: "small" }}
              pad="xsmall"
              height="130px"
              width="176px"
              justify="center"
              align="center"
              focusIndicator={false}
              hoverIndicator="#CCCCCC"
            > 
              <Add size="30px" />
              <Text size="16px" weight="bold" margin={{top: "10px"}}> Create </Text>
              <Text size="16px" margin={{top: "10px"}}> an <img src={agoraLogo} style={{ height: "14px"}}/> </Text>
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
              height="130px"
              width="176px"
              justify="center"
              align="center"
              focusIndicator={false}
              hoverIndicator="#CCCCCC"
            >
              <Multiple size="30px" />
              <Text size="16px" weight="bold" margin={{top: "10px"}}> Discover</Text>
              <Text size="16px" margin={{top: "10px"}}> new <img src={agoraLogo} style={{ height: "14px"}}/>s </Text>
            </Box>
          </Link>
        </Box>



        <Box 
          direction="row" 
          gap="150px"
          margin={{top: "60px"}}
        >
          <Box direction="column" justify="center" style={{minWidth: "50%"}}>
            <Text size="21px" weight="bold" margin={{bottom: "24px"}} alignSelf="center"> What is an <img src={agoraLogo} style={{ height: "19px", alignSelf:"center"}}/>? </Text>
            <Text size="14px" margin={{bottom: "6px"}} weight="bold"> An <img src={agoraLogo} style={{ height: "14px", alignSelf:"center"}}/> is a hub for a community (e.g. a reading group, seminar group, institution, etc...)</Text>
            <Text size="14px" margin={{bottom: "6px"}}> It is the place to mingle with the community and where seminars happen </Text>
            <Text size="14px" margin={{bottom: "6px"}} weight="bold"> Visit and connect with any agora by becoming a member or a future speaker </Text>
          </Box>
        </Box>

        <Box 
          direction="row" 
          gap="150px"
          margin={{top: "50px"}}
        >
          <TrendingChannelsList/>
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
                Connecting academics
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
                hoverIndicator="#0C385B"
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
                hoverIndicator="#0C385B"
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
                hoverIndicator="#0C385B"
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
