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

import CreateChannelButton from "../../Components/Channel/CreateChannelButton";
import CreateChannelOverlay from "../../Components/Channel/CreateChannelButton/CreateChannelOverlay";


import ZoomLogo from "../../assets/competitors_logo/427px-Zoom_Communications_Logo.png";
import YoutubeLogo from "../../assets/competitors_logo/YouTube_Logo_2017.svg.png";
import MicrosoftTeams from "../../assets/competitors_logo/youtube_logo.jpeg";
import BackgroundImage from "../../assets/general/mora_social_media_cover_#bad6db.jpg"
import WavyArrow from "../../assets/landing_page/wavy_arrow_left_right.png"

import InstitutionalUsers from "./InstitutionalUsers";


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
            Hybrid academic seminars to share ideas and network
          </Text>
          <Text size="20px">
            <b>Attend, give, and create virtual or hybrid seminars</b> with academics from all over the world before networking and meeting your next teammates around an e-coffee!
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
          width="300px"
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
          width="300px"
          justify="center"
          align="center"
          focusIndicator={false}
          hoverIndicator={this.state.colorHover}
          margin={{ left: "0px" }}
          direction="row"
        >
          <Group size="30px" />
          <Text size="18px" margin={{left: "10px"}}> <b>Launch</b>  your own seminars</Text>
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
          <Box width="350px" height={this.state.renderMobileView ? "250px" : "320px"} background="color2" pad="medium" direction="column" gap="10px" hoverIndicator={this.state.colorHover}> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
              <Box width="70px">
                <SearchAdvanced size="large"/>
              </Box>
              <Text size="24px" weight="bold" margin={{left: "5px"}} color="color7">
                1. Find a seminar 
              </Text>
            </Box>
            <Text size="18px"> 
              Register as an attendee or apply as a speaker within a community!
            </Text>
          </Box>

          <Box width="120px" direction="column" alignSelf="center"> 
            <img src={WavyArrow} style={{alignSelf: "center"}} width="120px"/>
          </Box>

          <Box width="350px" height={this.state.renderMobileView ? "250px" : "320px"} background="color2" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
              <Box width="70px">
                <Workshop size="large"/>
              </Box>
              <Text size="24px" weight="bold" margin={{left: "5px"}} color="color7">2. Attend
              </Text>
            </Box>

            <Text size="18px">
              Seminars can be run online or hybrid. Ask questions, go back-and-forth the slides
            </Text>
          </Box>

          <Box width="120px" direction="column" alignSelf="center"> 
            <img src={WavyArrow} style={{alignSelf: "center"}} width="120px"/>
          </Box>

          <Box width="350px" height={this.state.renderMobileView ? "250px" : "320px"} background="color2" pad="medium" direction="column" gap="10px"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
              <Box width="70px">
                <Group size="large"/>
              </Box>
              <Text size="24px" weight="bold" margin={{left: "5px"}} color="color7">3. Mingle!
              </Text>
            </Box>
            <Text size="18px">
              Grab an e-coffee in a custom 2D world after each seminars and meet with the speakers and the audience.
            </Text>
          </Box>
        </Box>
      </>
    )
  }

  content2() {
    return (
      <>
        <Text size="34px" margin={{top: "120px", bottom: "80px"}} color="black">How does this work?</Text>
        {/* A. First row of features */}
        <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } margin={{bottom: "20px"}} gap="30px">
          <Box width="350px" height={this.state.renderMobileView ? "220px" : "320px"} background="color6" pad="medium" direction="column" className="box1" gap="10px"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%">
              <Attraction size="large"/>
              <Text size="20px" weight="bold" margin={{left: "10px"}} color="color1">
                Speakers come to you
              </Text>
            </Box>
            <Text size="18px">
              Finding exciting speakers to hear about latest trends in your field can be tedious. 
            </Text>
            <Text size="18px">
              On mora.stream, they directly come to you. 
            </Text>
          </Box>

          {/* {(!this.state.renderMobileView && 
            <hr style={{width: "40px", height: "0.1px", backgroundColor: "black", borderColor: "black", marginTop: "15vh", marginBottom: "15vh"}} />
          )} */}

          <Box width="350px" height={this.state.renderMobileView ? "220px" : "320px"} background="color6" pad="medium" direction="column" className="box2" gap="10px"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%">
              <Trigger size="large"/>
              <Text size="20px" weight="bold" margin={{left: "10px"}} color="color1">
                Seminars posted in 30 seconds
              </Text>
            </Box>
            <Text size="18px">
              Decide whether your event is public or requires a registration. 
            </Text>
            <Text size="18px">
              The registration form for your audience is automatically generated and integrated: no need to worry about it.
            </Text>
          </Box>

          {/* {(!this.state.renderMobileView && 
            <hr style={{width: "40px", height: "0.1px", backgroundColor: "black", borderColor: "black", marginTop: "15vh", marginBottom: "15vh"}} />
          )} */}

          <Box width="350px" height={this.state.renderMobileView ? "220px" : "320px"} background="color6" pad="medium" direction="column" gap="10px"> 
            <Box direction="row" margin={{bottom: "20px"}} height="25%">
              <MailOption size="large"/>
              <Text size="20px" weight="bold" margin={{left: "10px"}} color="color1">
                Automatic email advertisement
              </Text>
            </Box>
            <Text size="18px">
              Easily integrate your existing mailing list on mora.stream.
            </Text>
            <Text size="18px">
              Whenever an event is created or modified, you can let your community know about it with a simple click.
            </Text>
          </Box>
        </Box>
        
        {/* B. Second row of features */}
        <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } gap="30px">
          <Box width="350px" height={this.state.renderMobileView ? "220px" : "320px"} background="color6" pad="medium" direction="column" gap="10px"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%">
              <Deploy size="large"/>
              <Text size="20px" weight="bold" margin={{left: "10px"}} color="color1">
                New exciting opportunities
              </Text>
            </Box>
            <Text size="18px">
              Let your online audience mingle after the event around an e-coffee.
            </Text>
            <Text size="18px">
              So many ideas and collaborations started around a coffee (mora.stream included)!
            </Text>
          </Box>

          {/* {(!this.state.renderMobileView && 
            <hr style={{width: "40px", height: "0.1px", backgroundColor: "black", borderColor: "black", marginTop: "15vh", marginBottom: "15vh"}} />
          )} */}

          <Box width="350px" height={this.state.renderMobileView ? "220px" : "320px"} background="color6" pad="medium" direction="column" gap="10px"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%">
              <CirclePlay size="large"/>
              <Text size="20px" weight="bold" margin={{left: "10px"}} color="color1">
                Record and upload (BETA)
              </Text>
            </Box>
            <Text size="18px">
              Record the seminar, include the slides of the speaker and uploading everything on mora.stream in 3 clicks.
            </Text>
          </Box>

          {/* {(!this.state.renderMobileView && 
            <hr style={{width: "40px", height: "0.1px", backgroundColor: "black", borderColor: "black", marginTop: "15vh", marginBottom: "15vh"}} />
          )} */}

          <Box width="350px" height={this.state.renderMobileView ? "220px" : "320px"} background="color6" pad="medium" direction="column" gap="10px"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%">
              <Like size="large"/>
              <Text size="20px" weight="bold" margin={{left: "10px"}} color="color1">
                Audience management tools
              </Text>
            </Box>
            <Text size="18px">
              Allow your audience to request the microphone if they want to ask a question. 
            </Text>
            <Text size="18px">
              You decide whether you want to give it to them, or take it back if you are running out of time.
            </Text>
          </Box>
          
          {/* {(!this.state.renderMobileView && 
            <hr style={{width: "40px", height: "0.1px", backgroundColor: "black", borderColor: "black", marginTop: "15vh", marginBottom: "15vh"}} />
          )} */}

          <Box width="350px" height={this.state.renderMobileView ? "220px" : "320px"} background="color6" pad="medium" direction="column" gap="10px"> 
            <Box direction="row" margin={{bottom: "20px"}} height="25%">
              <Workshop size="large"/>
              <Text size="20px" weight="bold" margin={{left: "10px"}} color="color1">
                Speaker-friendly
              </Text>
            </Box>
            <Text size="18px">
              All the streaming happens in the browser (no external software is required). 
            </Text>
            <Text size="18px">
              The speaker interface is light and simple: even the founders' grandparents can use it!
            </Text>
          </Box>
        </Box>
      </>
    )
  }

  callToCreateAgora() {
    return (
      <>
        {!this.state.renderMobileView && (
          <>
            <Text size="34px" margin={{top: "80px", bottom: "80px"}} color="color1" weight="bold" alignSelf="center">Start running your seminar series, in less than a minute!</Text>
            {/* <Text>If you already have Zoom or gather.town, it will be completely free!</Text> */}
            <Box align="center" margin={{bottom: "20px"}}>
                <CreateChannelButton 
                  onClick={this.toggleCreateChannelOverlay} 
                  width="250px"
                  height="90px"
                  text={"Get started"}
                  textSize="18px"
                />
            </Box>

            <Text size="34px" margin={{top: "80px", bottom: "15px"}} color="color1" weight="bold" alignSelf="center">Already running a series? Migrate everything together in a minute!</Text>
            <Text color="black" margin={{bottom: "80px"}} alignSelf="center">Bring your <img height="15px" src={ZoomLogo}/> subscription, your <img height="20px" style={{marginBottom: "-3px"}} src={YoutubeLogo}/> seminar recordings, or <i>gather.town</i> in your centralised panel <b>for free</b>!</Text>
            <Box align="center" margin={{bottom: "5px"}}>
                <CreateChannelButton 
                  onClick={this.toggleCreateChannelOverlay} 
                  width="250px"
                  height="90px"
                  text={"Migrate"}
                  textSize="18px"
                />
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
          <Box width="80%" height={this.state.renderMobileView ? "1550px": "690px"}  direction="column" alignSelf="center">
            {this.content1()}
          </Box>
        </Box>

        <Box height="100%" width="100%" background="color1">
          <Box width="80%" height={this.state.renderMobileView ? "2390px": "970px"} direction="column" alignSelf="center">
            {this.content2()}
          </Box>
        </Box>
        

        <Box height="100%" width="100%">
          <Box width="80%" height={this.state.renderMobileView ? "600px": "600px"} direction="column" alignSelf="center">
            {this.callToCreateAgora()}
          </Box>
        </Box>

        <Box width={window.innerWidth > 800 ? "80%" : "90%"} align="center">
          <FooterComponent />
        </Box>

      </Box>
    );
  }
}