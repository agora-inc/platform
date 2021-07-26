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
import Svg, { Image } from "react-native-svg";


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
            <Svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={300.018}
      height={45.517}
      viewBox="0 0 19609 2975"
    >
      <Image
        data-name="#BAD6DB#4D869F#D3F930"
        width={19609}
        height={2975}
        xlinkHref="data:img/png;base64,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"
      />
    </Svg>
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
            <Svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={300.018}
      height={45.517}
      viewBox="0 0 19609 2975"
    >
      <Image
        data-name="#BAD6DB#4D869F#D3F930"
        width={19609}
        height={2975}
        xlinkHref="data:img/png;base64,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"
      />
    </Svg>
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
