import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Box, Text, Heading, Layer } from "grommet";
import agoraStreamFullLogo from "../assets/general/agora.stream_logo_v2.1.svg";
import agoraLogo from "../assets/general/agora_logo_v2.1.svg";
import { User, UserService } from "../Services/UserService";
import { Search, Play, Add, Chat, Close, Channel, ScheduleNew, Multiple } from "grommet-icons";
import UserManager from "../Components/Account/UserManager";
import FooterComponent from "../Components/Homepage/FooterComponent";
import "../Styles/landing-page.css";
import MediaQuery from "react-responsive";
import ScrollIntoView from 'react-scroll-into-view'
import TrendingChannelsList from "../Components/Homepage/TrendingChannelsList";
import TrendingTalksList from "../Components/Homepage/TrendingTalksList";
import AgoraCreationPage from "../Views/AgoraCreationPage";
import ReactTooltip from "react-tooltip";


interface State {
  user: User | null
  showLogin: boolean
  colorButton: string
  colorHover: string
  showModalGiveATalk: boolean
}

export default class LandingPage extends Component<RouteComponentProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: UserService.getCurrentUser(),
      showLogin: new URL(window.location.href).searchParams.get("showLogin") === "true",
      colorButton: "#EAF1F1",
      colorHover: "#BAD6DB",
      showModalGiveATalk: false,
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
    // return dynamicTextValueList[now % dynamicTextValueList.length]
    // "Home for cutting-edge online/physical academic seminars"
    return "Delivering hybrid academic seminars"
  }

  toggleModal = () => {
    this.setState({ showModalGiveATalk: !this.state.showModalGiveATalk });
  };

  giveATalkOverlay() {
    return (
      <Layer
        onEsc={() => {
          this.toggleModal();
        }}
        onClickOutside={() => {
          this.toggleModal();
        }}
        modal
        responsive
        animation="fadeIn"
        style={{
          width: 600,
          height: 480,
          borderRadius: 15,
          overflow: "hidden",
          alignSelf: "center",
        }}
      >
        <Box align="center" width="100%" style={{ overflowY: "auto" }}>
          <Box
            justify="start"
            width="99.7%"
            background="#eaf1f1"
            direction="row"
            style={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              position: "sticky",
              top: 0,
              minHeight: "45px",
              zIndex: 10,
            }}
          >
            <Box pad="30px" alignSelf="center" fill={true}>
              <Text size="16px" color="black" weight="bold"  >
                How to give your talk on agora.stream
              </Text>
            </Box>
            <Box pad="32px" alignSelf="center">
              <Close onClick={this.toggleModal} />
            </Box>
          </Box>

          <Box height="300px" margin={{bottom: "15px"}}>


            <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto"}}
                  >
                  <source src="/videos/talk_application.mp4" type="video/mp4"/> 
            </video>





          </Box>

          <Link
            to={{ pathname: "/agoras" }}
            style={{ textDecoration: "none" }}
          >
            <Box
              onClick={() => ({})}
              direction="row"
              background="#EAF1F1"
              round="xsmall"
              pad="small"
              gap="xsmall"
              height="50px"
              width="250px"
              align="center"
              focusIndicator={false}
              hoverIndicator="#BAD6DB"
            >
              <Multiple size="25px" />
              <Text size="14px" weight="bold" margin={{left: "2px"}}> 
                Contact the relevant <img src={agoraLogo} style={{ height: "12px", marginTop: "1px", marginRight: "-1px"}}/>s 
              </Text>
            </Box>
          </Link>

        </Box>
              
      </Layer>
    );
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
          margin={{ top: "20px" }}
          justify="end"
        >
          <UserManager showLogin={this.state.showLogin} />
        </Box>

        { /* Column version */}

        <video
          autoPlay loop muted id="background-landing"
          style={{ height: "auto", width: "auto", minWidth: "100%", minHeight: "100%" }}
        >
          <source src="https://video.wixstatic.com/video/9b9d14_37244669d1c749ab8d1bf8b15762c61a/720p/mp4/file.mp4" type="video/mp4" />
        </video>

        <Box direction="column" justify="start"> {/*style={{justifyContent: "center"}}>*/}

          {/* Desktop version */}
          <MediaQuery minDeviceWidth={800}>
            <Box direction="row" justify="center" style={{ justifyContent: "center" }} margin={{ top: "50px", bottom: "20px" }}>
              <img src={agoraStreamFullLogo} style={{ height: "90px" }} />
            </Box>
            <Box direction="column" justify="center" alignContent="center"
              margin={{ top: "-35px", left: "215px", right: "10px", bottom: "38px" }}
            >
              <Text size="16px" weight="bold" alignSelf="center" color="#0C385B">
                {this.showDynamicTextValue()}
              </Text>
            </Box>
          </MediaQuery>

          {/* Mobile version */}
          <MediaQuery maxDeviceWidth={800}>

            <Box direction="row" justify="center" style={{ justifyContent: "center" }} margin={{ top: "50px", bottom: "20px" }}>
              <img src={agoraStreamFullLogo} style={{ width: "200px", maxHeight: "40px" }} />
              <Text margin={{ left: "5px" }} size="14px">Mobile</Text>
            </Box>
            <Box direction="column" justify="center" alignContent="center"
              margin={{ top: "-25px", left: "61px", right: "10px", bottom: "38px" }}
            >
              <Text size="11px" weight="bold" alignSelf="center" color="#0C385B">
                {this.showDynamicTextValue()}
              </Text>
            </Box>
          </MediaQuery>

        </Box>

        <Box
          direction="row"
          focusIndicator={false}
          margin={{
            top: (window.innerWidth > 800) ? "80px" : "25px",
            bottom: (window.innerWidth > 800) ? "40px" : "0px"
          }}
          justify="center"
        >

          {/* Desktop version */}

          <MediaQuery minDeviceWidth={800}>

            <Box direction="column" width="56%" >

              <Text size="21px" weight="bold" margin={{ left: "10px", bottom: "30px" }}>
                For academics
              </Text>
              <Box direction="row" gap="10px">
                <Link
                  to={{ pathname: "/browse" }}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    onClick={() => ({})}
                    background={this.state.colorButton}
                    round="xsmall"
                    pad="xsmall"
                    height="120px"
                    width="150px"
                    justify="center"
                    align="center"
                    focusIndicator={false}
                    hoverIndicator={this.state.colorHover}
                    margin={{ left: "10px", right: "20px" }}
                  >
                    <Search size="30px" />
                    <Text size="16px" weight="bold" margin={{ top: "10px" }}> Browse </Text>
                    <Text size="16px" margin={{ top: "5px" }}> future seminars </Text>
                  </Box>
                </Link>

                <Link
                  to={{ pathname: "/past" }}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    onClick={() => ({})}
                    background={this.state.colorButton}
                    round="xsmall"
                    pad="xsmall"
                    height="120px"
                    width="150px"
                    justify="center"
                    align="center"
                    focusIndicator={false}
                    hoverIndicator={this.state.colorHover}
                  >
                    <Play size="30px" />
                    <Text size="16px" weight="bold" margin={{ top: "10px" }}> Watch</Text>
                    <Text size="16px" margin={{ top: "5px" }}> past seminars </Text>
                  </Box>
                </Link>
              </Box>
            </Box>

            <div id="vertical-line"> {} </div>

            <Box direction="column" width="24%" alignSelf="center">
              <Text size="21px" weight="bold" margin={{ bottom: "30px" }}>
                For speakers
              </Text>

              {/*<Link
                  to={{ pathname: "/agoras" }}
                  style={{ textDecoration: "none" }}
              > */}
                <Box
                  onClick={this.toggleModal}
                  background={this.state.colorButton}
                  round="xsmall"
                  pad="xsmall"
                  height="120px"
                  width="150px"
                  justify="center"
                  align="center"
                  focusIndicator={false}
                  hoverIndicator={this.state.colorHover}
                  margin={{ left: "0px" }}
                >
                  <Chat size="30px" />
                  <Text size="16px" weight="bold" margin={{ top: "10px" }}> Give </Text>
                  <Text size="16px" margin={{ top: "5px" }}> a talk </Text>
                </Box>
              {/* </Link> */}
            </Box>

            {this.state.showModalGiveATalk && (
              this.giveATalkOverlay()
            )}

            <div id="vertical-line"> {} </div>

            <Box direction="column" width="24%" alignSelf="center">
              <Text size="21px" weight="bold" margin={{ bottom: "30px" }}>
                For organizers
              </Text>

              <ReactTooltip id="create-your-events" effect="solid">
                Create your events and share them with the world in less than a minute!
              </ReactTooltip>
                
              <ScrollIntoView selector="#pricing">
                <Box
                  onClick={() => ({})}
                  background={this.state.colorButton}
                  round="xsmall"
                  pad="xsmall"
                  height="120px"
                  width="150px"
                  justify="center"
                  align="center"
                  focusIndicator={false}
                  hoverIndicator={this.state.colorHover}
                  margin={{ left: "0px" }}
                  data-tip data-for="create-your-events"
                >
                  <Add size="30px" />
                  <Text size="16px" weight="bold" margin={{ top: "10px" }}> Post </Text>
                  <Text size="16px" margin={{ top: "5px" }}> your seminars </Text>
                </Box>
              </ScrollIntoView>  
            </Box>

          </MediaQuery>


          {/* Mobile version */}

          <MediaQuery maxDeviceWidth={800}>
            <Box direction="column" width="50%" >
              <Text size="18px" weight="bold" margin={{ left: "10px", bottom: "10px" }}>
                For academics
              </Text>
              <Box direction="column" margin={{ left: "10px" }}>
                <Link
                  to={{ pathname: "/browse" }}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    onClick={() => ({})}
                    direction="row"
                    background={this.state.colorButton}
                    round="xsmall"
                    pad="small"
                    gap="xsmall"
                    height="60px"
                    width="150px"
                    align="center"
                    focusIndicator={false}
                    hoverIndicator={this.state.colorHover}
                    margin={{ bottom: "25px" }}
                  >

                    <Search size="20px" />
                    <Box direction="column">
                      <Text size="14px" weight="bold" margin={{ left: "2px", bottom: "3px" }}>
                        Browse
                      </Text>
                      <Text size="14px" margin={{ left: "2px" }}>
                        future seminars
                      </Text>
                    </Box>
                  </Box>
                </Link>
                <Link
                  to={{ pathname: "/past" }}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    onClick={() => ({})}
                    direction="row"
                    background={this.state.colorButton}
                    round="xsmall"
                    pad="small"
                    gap="xsmall"
                    height="60px"
                    width="150px"
                    align="center"
                    focusIndicator={false}
                    hoverIndicator={this.state.colorHover}
                  >

                    <Play size="20px" />
                    <Box direction="column">
                      <Text size="14px" weight="bold" margin={{ left: "2px", bottom: "3px" }}>
                        Watch
                      </Text>
                      <Text size="14px" margin={{ left: "2px" }}>
                        past seminars
                      </Text>
                    </Box>
                  </Box>
                </Link>
              </Box>
            </Box>

            <div id="vertical-line"> {} </div>

            <Box direction="column" width="50%" alignSelf="center">
              <Text size="18px" weight="bold" margin={{ bottom: "10px" }}>
                For speakers
              </Text>
              
              <Box
                onClick={() => ({})}
                direction="row"
                background={this.state.colorButton}
                round="xsmall"
                pad="small"
                gap="xsmall"
                height="60px"
                width="140px"
                align="center"
                focusIndicator={false}
                hoverIndicator={this.state.colorHover}
                margin={{ bottom: "20px" }}
              >

                <Chat size="20px" />
                <Box direction="column">
                  <Text size="14px" weight="bold" margin={{ left: "5px", bottom: "3px" }}>
                    Give
                  </Text>
                  <Text size="14px" margin={{ left: "5px" }}>
                    a talk
                  </Text>
                </Box>
              </Box>

              <Text size="18px" weight="bold" margin={{ bottom: "10px" }}>
                For organizers
              </Text>

              <ScrollIntoView selector="#pricing">
                <Box
                  onClick={() => ({})}
                  direction="row"
                  background={this.state.colorButton}
                  round="xsmall"
                  pad="small"
                  gap="xsmall"
                  height="60px"
                  width="140px"
                  align="center"
                  focusIndicator={false}
                  hoverIndicator={this.state.colorHover}
                >
                  <Add size="20px" />
                  <Box direction="column">
                    <Text size="14px" weight="bold" margin={{ left: "5px", bottom: "3px" }}>
                      Post
                    </Text>
                    <Text size="14px" margin={{ left: "5px" }}>
                      your seminars
                    </Text>
                  </Box>
                </Box>
              </ScrollIntoView>
            </Box>
          </MediaQuery>
        </Box>


        {/*<Box 
          direction="row" 
          gap="150px"
          margin={{top: "60px", left: "10px", right: "10px"}}
        >
          <Box direction="column" justify="center" style={{minWidth: "50%"}}>
            <Text size="21px" weight="bold" margin={{bottom: "24px"}} alignSelf="center"> What is an <img src={agoraLogo} style={{ height: "19px", alignSelf:"center"}}/>? </Text>
            <Text size="14px" margin={{bottom: "6px"}} weight="bold"> An <img src={agoraLogo} style={{ height: "14px", alignSelf:"center"}}/> is a hub for a community (e.g. a reading group, seminar group, institution, etc...)</Text>
            <Text size="14px" margin={{bottom: "6px"}}> It is the place to mingle with the community and where seminars happen </Text>
            <Text size="14px" margin={{bottom: "6px"}} weight="bold"> Visit and connect with any agora by becoming a member or a future speaker </Text>
          </Box>
        </Box> */}

        <Box
          direction="row"
          gap="150px"
          margin={{ top: "75px", left: "10px", right: "10px" }}
        >
          {/* <TrendingChannelsList /> */}



          {/* WIP */}
          {/* WIP */}
          {/* WIP */}
          {/* WIP */}
          {/* WIP */}



          <TrendingTalksList />

        </Box>

        <AgoraCreationPage />


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

        <Box width={window.innerWidth > 800 ? "70%" : "90%"} align="center">
          <FooterComponent />
        </Box>

      </Box>
    );
  }
}