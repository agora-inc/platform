import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Box, Text, Heading, Layer } from "grommet";
// import moraStreamFullLogo from "../assets/general/mora.stream_logo_free_v3.png";
import moraStreamFullLogo from "../../assets/general/mora.stream_logo_v3.svg";
import agoraLogo from "../../assets/general/agora_logo_v2.1.svg";
import { User, UserService } from "../../Services/UserService";
import { Search, Java, Play, Add, Chat, Close, ShareOption, SearchAdvanced, Multiple, Group, Workshop, Trigger, MailOption, DocumentPerformance, Deploy, Attraction, CirclePlay, Like} from "grommet-icons";
import UserManager from "../../Components/Account/UserManager";
import FooterComponent from "../../Components/Homepage/FooterComponent";
import "../../Styles/landing-page.css";
import MediaQuery from "react-responsive";
import ScrollIntoView from 'react-scroll-into-view'
import ReactTooltip from "react-tooltip";
import TrendingTalksList from "../../Components/Homepage/TrendingTalksList";

import CreateChannelButton from "../../Components/Channel/CreateChannelButton";
import CreateChannelOverlay from "../../Components/Channel/CreateChannelButton/CreateChannelOverlay";


import ZoomLogo from "../../assets/competitors_logo/427px-Zoom_Communications_Logo.png";
import YoutubeLogo from "../../assets/competitors_logo/YouTube_Logo_2017.svg.png";
import MicrosoftTeams from "../../assets/competitors_logo/youtube_logo.jpeg";
import BackgroundImage from "../../assets/general/mora_social_media_cover_#bad6db.jpg"
import WavyArrow from "../../assets/landing_page/wavy_arrow_left_right.png"
import ThreeSidedMarketplaceGraph from "../../assets/landing_page/3_sided_marketplace_graph.jpeg"

import InstitutionalUsers from "./InstitutionalUsers";
import LoginModal from "../../Components/Account/LoginModal";
import SignUpButton from "../../Components/Account/SignUpButton";

interface State {
  user: User | null
  showLogin: boolean
  colorButton: string
  colorHover: string
  showModalGiveATalk: boolean;
  renderMobileView: boolean;
  showCreateChannelOverlay: boolean
}

export default class LandingPage extends Component<RouteComponentProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      renderMobileView: (window.innerWidth < 1200),
      user: UserService.getCurrentUser(),
      showLogin: new URL(window.location.href).searchParams.get("showLogin") === "true",
      colorButton: "color1",
      colorHover: "color5",
      showModalGiveATalk: false,
      showCreateChannelOverlay: false
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

  toggleCreateChannelOverlay = () => {
    this.setState({
      showCreateChannelOverlay: !this.state.showCreateChannelOverlay
    });
  };

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
                How to give your talk on mora.stream
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

  aboveTheFoldMain() {
    return (
      <>
        <Box>
          <Text size="48px" weight="bold" color="color1" margin={this.state.renderMobileView ? {top: "40px", bottom: "40px"} : {top: "120px", bottom: "50px"}}>
            Delivering hybrid academic seminars
          </Text>
          <Text size="20px">
            <b>Attend, give, and create virtual or hybrid seminars</b> with academics from all over the world before networking with speakers and audience in a 2D world!
          </Text>
          <Box margin={this.state.renderMobileView ? {top: "30px"} : {top: "0px"}} height="50%">
            {this.callToActions()}
          </Box>
          <InstitutionalUsers/>
        </Box>
      </>
    )

}

  aboveTheFoldImage() {
    return (
      <>
        <Box direction="column" style={this.state.renderMobileView 
            ? { width: "90%", alignSelf: "center" } 
            : { width: "90%", marginTop: "120px", alignSelf: "center"}
          }>
          <img src={moraStreamFullLogo} style={{maxWidth: "600px"}}/>
        </Box>
      </>
    )
}

  callToActions() {
    return (
      <Box
        direction="row"
        focusIndicator={false}
        margin={{
          top: (window.innerWidth > 800) ? "40px" : "40px",
          bottom: (window.innerWidth > 800) ? "0px" : "0px"
        }}
        justify="start"
        alignContent="center"
        gap="medium"
      >
      <Link
        to={{ pathname: "/browse" }}
        style={{ textDecoration: "none" }}
      >
        <Box
          onClick={this.toggleModal}
          background={this.state.colorButton}
          round="xsmall"
          pad="xsmall"
          height="80px"
          width="310px"
          justify="center"
          align="center"
          focusIndicator={false}
          hoverIndicator={this.state.colorHover}
          margin={{ left: "0px" }}
          direction="row"
        >
          <Play size="30px" />
          <Text size="18px" margin={{left: "10px"}}> <b>Watch</b>  latest seminars</Text>
          {/* <Text size="22px">🔥</Text> */}
        </Box>
      </Link>

      <Link
        to={{ pathname: "/organisers" }}
        style={{ textDecoration: "none" }}
        >
        <Box
          onClick={this.toggleModal}
          background={this.state.colorButton}
          round="xsmall"
          pad="xsmall"
          height="80px"
          width="310px"
          justify="center"
          align="center"
          focusIndicator={false}
          hoverIndicator={this.state.colorHover}
          margin={{ left: "0px" }}
          direction="row"
        >
          <Group size="30px" />
          <Text size="18px" margin={{left: "10px"}}> <b>Publish</b>  your own seminars</Text>
        </Box>
      </Link>
    </Box>
    )
  }

  brandCurrentOrganisation() {
    return(
      <Box>
        sdf
      </Box>
    )
  }


  content1() {
    return (
      <>
        <Text size="34px" margin={{top: "120px", bottom: "80px"}} color="black">
          How does this work?
        </Text>
        <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } gap="30px">
          <Box width="380px" height={this.state.renderMobileView ? "250px" : "450px"} background="color2" direction="column">
            <Box height="50%" pad="medium" gap="10px">
              <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
                <Box width="70px">
                  <SearchAdvanced size="large"/>
                </Box>
                <Text size="24px" weight="bold" margin={{left: "5px"}} color="color7">
                  1. Register,
                </Text>
              </Box>
              <Text size="18px"> 
                Register to a seminar as an attendee or apply as a speaker within a community!
              </Text>
            </Box>
            <Box height="45%" alignSelf="end" direction="column">
              <video 
                    autoPlay loop muted
                    style={{ height: "auto", width: "100%"}}
                    >
                    <source src="/videos/talk_application.mp4" type="video/mp4"/> 
              </video>
            </Box>
          </Box>

          <Box width="120px" direction="column" alignSelf="center"> 
            <img src={WavyArrow} style={{alignSelf: "center"}} width="120px"/>
          </Box>

          <Box width="380px" height={this.state.renderMobileView ? "250px" : "450px"} background="color2" direction="column">
            <Box height="50%" pad="medium" gap="10px">
              <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
                <Box width="70px">
                  <Workshop size="large"/>
                </Box>
                <Text size="24px" weight="bold" margin={{left: "5px"}} color="color7">
                  2. Attend,
                </Text>
              </Box>
              <Text size="18px">
                Seminars can be run online or hybrid using a mobile app. Request the mic, browse through the slides, and clap for the speaker with your space bar!
              </Text>
            </Box>
            <Box height="45%" alignSelf="end" direction="column">
              <img src="/videos/mora_streaming_gif_test.gif"/> 
            </Box>
          </Box>

          <Box width="120px" direction="column" alignSelf="center"> 
            <img src={WavyArrow} style={{alignSelf: "center"}} width="120px"/>
          </Box>

          <Box width="380px" height={this.state.renderMobileView ? "250px" : "450px"} background="color2" direction="column">
            <Box height="50%" pad="medium" gap="10px">
              <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
                <Box width="70px">
                  <Group size="large"/>
                </Box>
                <Text size="24px" weight="bold" margin={{left: "5px"}} color="color7">3. Mingle!
                </Text>
              </Box>
              <Text size="18px">
                Grab an e-coffee in a custom 2D world after each seminars and meet with the speakers, the audience, and maybe your future co-authors!
              </Text>   
            </Box>

            <Box height="45%" alignSelf="end" direction="column">
              <video 
                    autoPlay loop muted
                    style={{ height: "auto", width: "100%"}}
                    >
                    <source src="/videos/cafeteria_agora_minidemo.mp4" type="video/mp4"/> 
              </video>
            </Box>
          </Box>
        </Box>
      </>
    )
  }
  
  content2() {
    return (
      <>
        <Text size="34px" margin={{top: "120px", bottom: "20px"}} color="white">We <Text size="38px" color="color7">boost</Text> research collaborations with tech</Text>

        <img src={ThreeSidedMarketplaceGraph} height="40%" width="40%" style={{alignSelf: "center", marginBottom: "40px"}}/>
        <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } gap="30px" justify="center">
          <Box width="420px" height={this.state.renderMobileView ? "250px" : "320px"} background="color6" direction="column" pad="medium">
            <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
              {/* <Box width="70px">
                <SearchAdvanced size="large"/>
              </Box> */}
              <Text size="24px" weight="bold" margin={{left: "5px"}} color="black">
                More speakers are matched with communities
              </Text>
            </Box>
            <Text size="18px"> 
              The whole speaker-community has been matching easy! Speakers can now directly connect with communities by clicking a "Give a talk" button.
            </Text>
          </Box>

          <Box width="420px" height={this.state.renderMobileView ? "250px" : "320px"} background="color6" direction="column" pad="medium">
            <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
              {/* <Box width="70px">
                <SearchAdvanced size="large"/>
              </Box> */}
              <Text size="24px" weight="bold" margin={{left: "5px"}} color="black">
                More seminars are organised
              </Text>
            </Box>
            <Text size="18px"> 
              We use tech to made the life of the seminar organisers as easy as possible, from start to finish. Organising seminars now takes less than a minute! 
            </Text>
          </Box>

          <Box width="420px" height={this.state.renderMobileView ? "250px" : "320px"} background="color6" direction="column" pad="medium">
            <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
              {/* <Box width="70px">
                <SearchAdvanced size="large"/>
              </Box> */}
              <Text size="24px" weight="bold" margin={{left: "5px"}} color="black">
                More collaborations create more speakers
              </Text>
            </Box>
            <Text size="18px"> 
              More seminars means more post seminar-coffees mingling, making new ideas more likely to emerge and mature to the point where they will be presented.
            </Text>
          </Box>
        </Box>
      </>
    )
  }

  callToActionEndpage() {
    return (
      <>
        {!this.state.renderMobileView && (
          <>
            <Box>
              <Text size="34px" margin={{top: "80px", bottom: "80px"}} color="color1" weight="bold" alignSelf="center">Do not miss out the hottest discussions of the moment!</Text>
              <Box align="center" margin={{bottom: "90px"}}>
                  <SignUpButton 
                    callback={()=>{}}
                    height="100px"
                    width="200px"
                    textSize="18px"
                  />
              </Box>
              <Box alignSelf="center">
                <InstitutionalUsers/>
              </Box>
            </Box>
          </>
        )}
        {this.state.renderMobileView && (
            <Text size="34px" margin={{top: "80px", bottom: "80px"}} color="color1" weight="bold" alignSelf="center">Come back to this page using a Desktop browser to get started! 🚀</Text>
        )}

        {this.state.showCreateChannelOverlay && (
              <CreateChannelOverlay
                onBackClicked={this.toggleCreateChannelOverlay}
                onComplete={() => {
                  this.toggleCreateChannelOverlay();
                }}
                visible={true}
                user={this.state.user}
              />
            )}
      </>
      
    )
  }

  render() {
    return (
      <Box
        direction="column"
        align="center"
      >
        {/* <video
          autoPlay loop muted id="background-landing"
          style={{ height: "auto", width: "auto", minWidth: "100%", minHeight: "100%" }}
        >
          <source src="https://video.wixstatic.com/video/9b9d14_37244669d1c749ab8d1bf8b15762c61a/720p/mp4/file.mp4" type="video/mp4"/>
        </video> */}
        {/* <img height="200px" src={BackgroundImage}/> */}
        <img style={{ height: "auto", width: "auto", minWidth: "100%", minHeight: "100%" }} id="background-landing"
          // src={BackgroundImage}
          src="https://i.postimg.cc/RhmJmzM3/mora-social-media-cover-bad6db.jpg"
        />






        <Box height="100%" width="100%">
          <Box width="80%" height={this.state.renderMobileView ? "1080px": "750px"} direction={this.state.renderMobileView ? "column" : "row"} alignSelf="center">
            <Box width={this.state.renderMobileView ? "100%" : "60%"} height={this.state.renderMobileView ? "750px" : "100%"}
              style={this.state.renderMobileView ? {} : {minWidth: "780px"}}>
              {this.aboveTheFoldMain()}
            </Box>
            <Box width={this.state.renderMobileView ? "100%" : "40%"} height={this.state.renderMobileView ? "100px" : "100%"}>
              {this.aboveTheFoldImage()}
            </Box>
          </Box>
        </Box>

        <Box height="100%" width="100%" background="color5" id="content">
          <Box width="80%" height={this.state.renderMobileView ? "1550px": "760px"}  direction="column" alignSelf="center">
            {this.content1()}
          </Box>
        </Box>

        <Box height="100%" width="100%" background="color1">
          <Box width="80%" height={this.state.renderMobileView ? "2390px": "1100px"} direction="column" alignSelf="center">
            {this.content2()}
          </Box>
        </Box>
        

        <Box height="100%" width="100%">
          <Box width="80%" height={this.state.renderMobileView ? "600px": "600px"} direction="column" alignSelf="center">
            {this.callToActionEndpage()}
          </Box>
        </Box>


        <Box width={window.innerWidth > 800 ? "80%" : "90%"} align="center">
          <FooterComponent />
        </Box>

      </Box>
    );
  }
}