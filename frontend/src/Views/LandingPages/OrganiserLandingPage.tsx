import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Box, Text, Heading, Layer } from "grommet";
// import moraStreamFullLogo from "../assets/general/mora.stream_logo_free_v3.png";
import moraStreamFullLogo from "../../assets/general/mora.stream_logo_v3.svg";
import moraStreamFullLettersLogo from "../../assets/general/mora.stream_logo_v2.1.png";

import agoraLogo from "../../assets/general/agora_logo_v2.1.svg";
import { User, UserService } from "../../Services/UserService";
import { Search, Java, Play, Share, Add, Video, Close, ShareOption, Rewind, Multiple, Group, Workshop, Trigger, MailOption, DocumentPerformance, Deploy, Attraction, CirclePlay, Like} from "grommet-icons";
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
import SeminarImage from "../../assets/general/academic_seminars_photo.jpeg"

import PricingPlans from "../../Views/PricingPlans";

import DashedLine from "../../assets/landing_page/dashed-line.png"
import TransportSeminars from "../../Components/Homepage/TransportSeminars";

interface State {
  user: User | null
  showLogin: boolean
  colorButton: string
  colorHover: string
  showModalGiveATalk: boolean;
  renderMobileView: boolean;
  showCreateChannelOverlay: boolean
}

export default class OrganiserLandingPage extends Component<RouteComponentProps, State> {
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

          <Box height="200px" margin={{bottom: "15px"}}>

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
        <Box direction="column">
          <Text size="48px" weight="bold" color="color4" margin={this.state.renderMobileView ? {top: "80px", bottom: "40px"} : {top: "120px", bottom: "50px"}}>
            Empowering seminar organisers, from start to finish
          </Text>
          {!this.state.renderMobileView && (
            <Box margin={{bottom: "50px"}}>
              <CreateChannelButton 
                      onClick={this.toggleCreateChannelOverlay} 
                      width="400px"
                      height="90px"
                      text={"Publish your seminars"}
                      textSize="18px"
                    />
            </Box>
          )}
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
          <img src={SeminarImage} width="100%" height="auto"/>
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
          <Text size="18px" margin={{left: "10px"}}> <b>Launch</b>  your seminars</Text>
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
            Everything seminar organiser need, all in one place
        </Text>
        {/* First line */}
        <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } gap="30px" margin={{bottom: "50px"}}>
          <Box width="380px" height={this.state.renderMobileView ? "340px" : "300px"} background="color2" pad="medium" direction="column" gap="10px" hoverIndicator={this.state.colorHover}> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
              <Box width="70px">
                <Attraction size="large"/>
              </Box>
              {this.state.renderMobileView && (
                <Text size="24px" weight="bold" margin={{left: "8px"}} color="color7">1. Create your agora</Text>
              )}
              {!this.state.renderMobileView && (
                <CreateChannelButton 
                  textColor="color7"
                  text="1. Create your agora"
                  textSize="20px"
                  onClick={this.toggleCreateChannelOverlay}
                />
              )}
            </Box>
            <Text size="18px">
              Your agora, or community homepage, will be the center of your organisational life. It will also be the place where your community will periodically come back to check out your next events! 
            </Text>
            </Box>


          {!this.state.renderMobileView && (
            <Box width="120px" direction="column" alignSelf="center"> 
              <img src={DashedLine} style={{alignSelf: "center"}} width="120px"/>
            </Box>
          )}

          <Box width="380px" height={this.state.renderMobileView ? "340px" : "300px"} background="color2" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
              <Box width="70px">
                <Workshop size="large"/>
              </Box>
              <Text size="24px" weight="bold" margin={{left: "8px"}} color="color7">2. Find a speaker
              </Text>
            </Box>

            <Text size="18px">
                Finding speakers can sometimes be very tedious. On mora.stream, speakers directly come to you by filling an in-built application form!
            </Text>
          </Box>

          {!this.state.renderMobileView && (
            <Box width="120px" direction="column" alignSelf="center"> 
              <img src={DashedLine} style={{alignSelf: "center"}} width="120px"/>
            </Box>
          )}

          <Box width="380px" height={this.state.renderMobileView ? "340px" : "300px"} background="color2" pad="medium" direction="column" gap="10px"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
              <Box width="70px">
                <Share size="large"/>
              </Box>
              <Text size="24px" weight="bold" margin={{left: "8px"}} color="color7">3. Publish in a minute
              </Text>
            </Box>
            <Text size="18px">
                We made organising seminars is made <b>as easy as possible</b>. Three clicks are enough to automate the sending of reminder emails, automatically accept verified academics, and share your event on all your social media!
            </Text>
          </Box>
        </Box>

        {/* Second line */}
        <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } gap="30px">
          <Box width="400px" height={this.state.renderMobileView ? "340px" : "300px"} background="color2" pad="medium" direction="column" gap="10px" hoverIndicator={this.state.colorHover}> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
              <Box width="70px">
                <Video size="large"/>
              </Box>
              <Text size="24px" weight="bold" margin={{left: "15px"}} color="color7">
                4. Stream with <img src={ZoomLogo} height="14px"/> or <img src={moraStreamFullLettersLogo} height="18px"/>
              </Text>
            </Box>
            <Text size="18px"> 
                You can use your <img src={ZoomLogo} height="14px"/> subscription OR the <img src={moraStreamFullLettersLogo} height="16px"/> streaming tech. The latter allows you to run hybrid seminars, write LateX in chat, go back in the slides, clap for the speaker and much more!
            </Text>
            </Box>

            {!this.state.renderMobileView && (
            <Box width="120px" direction="column" alignSelf="center"> 
              <img src={DashedLine} style={{alignSelf: "center"}} width="120px"/>
            </Box>
          )}

          <Box width="400px" height={this.state.renderMobileView ? "340px" : "300px"} background="color2" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
              <Box width="70px">
                <Group size="large"/>
              </Box>
              <Text size="24px" weight="bold" margin={{left: "8px"}} color="color7">5. Mingle et network
              </Text>
            </Box>

            <Text size="18px">
              Enjoy the free access to a 2D-virtual cafeteria after each seminars and allow your audience to mingle among themselves and meet with the speakers.
            </Text>
          </Box>

          {!this.state.renderMobileView && (
            <Box width="120px" direction="column" alignSelf="center"> 
              <img src={DashedLine} style={{alignSelf: "center"}} width="120px"/>
            </Box>
          )}

          <Box width="400px" height={this.state.renderMobileView ? "340px" : "300px"} background="color2" pad="medium" direction="column" gap="10px"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
              <Box width="70px">
                <Play size="large"/>
              </Box>
              <Text size="24px" weight="bold" margin={{left: "8px"}} color="color7">6. Upload slides and recordings
              </Text>
            </Box>
            <Text size="18px">
              Please your community by supplementing your event with your mp4 recording, your <img src={YoutubeLogo} height="16px"/> URL as well as your speaker's slides in just a couple clicks!
            </Text>
          </Box>
        </Box>

      </>
    )
  }

  content2() {
    return (
      <>
        <Text size="34px" margin={{top: "120px", bottom: "80px"}} color="black">Your life made easy, for free</Text>
        <Text>
            Because we want to facilitate the sharing of new knowledge, <b>most of the features are free and no plan is required to deploy your seminars on mora.stream!</b> The option is always there for those who want a premium experience!            
        </Text>


        <PricingPlans 
            callback={() => {}}
            channelId={null}
            userId={null}
            disabled={true}
            showDemo={false}
            headerTitle={true}
            title={" "}
        />
        


      </>
    )
  }

  callToActionEndpage() {
    return (
      <>
        {!this.state.renderMobileView && (
          <>
            <Text size="34px" margin={{top: "80px", bottom: "80px"}} color="color1" weight="bold" alignSelf="center">Empower your community now by attracting new teammates to your events!</Text>
            {/* <Text>If you already have Zoom or gather.town, it will be completely free!</Text> */}
            <Box align="center" margin={{bottom: "20px"}}>
                <CreateChannelButton 
                  onClick={this.toggleCreateChannelOverlay} 
                  width="400px"
                  height="90px"
                  text={"Publish your seminars"}
                  textSize="18px"
                />
            </Box>


            {/* TODO: INTEGRATE SCRAPPER RESEARCHSEMINARS.ORG before commenting out

            <Text size="34px" margin={{top: "80px", bottom: "80px"}} color="color1" weight="bold" alignSelf="center">Already running a series? Import everything in a minute!</Text>
            <Box align="center" margin={{bottom: "20px"}} gap="small">
            <CreateChannelButton 
                  onClick={this.toggleCreateChannelOverlay} 
                  width="400px"
                  height="90px"
                  text={"Import from researchseminars.org"}
                  textSize="18px"
                />
            <CreateChannelButton 
                  onClick={this.toggleCreateChannelOverlay} 
                  width="400px"
                  height="90px"
                  text={"Import from custom website"}
                  textSize="18px"
                />
            </Box> */}
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

  migrateFromResearchSeminars() {
    return (
      <Box align="center" justify="center">
        <Text size="34px" margin={{bottom: "80px"}} color="color1" weight="bold" alignSelf="center">
          Already running a series on researchseminars.org? Migrate everything in 3 clicks!
        </Text>
        <TransportSeminars 
          user={this.state.user}
        />
      </Box>
    );
  }

  render() {
    return (
      <Box
        direction="column"
        align="center"
      >
        <img style={{ height: "auto", width: "auto", minWidth: "100%", minHeight: "100%" }} id="background-landing"
          // src={BackgroundImage}
          src="https://i.postimg.cc/RhmJmzM3/mora-social-media-cover-bad6db.jpg"
        />


        <Box height="100%" width="100%">
          <Box width="80%" height={this.state.renderMobileView ? "1080px": "700px"} direction={this.state.renderMobileView ? "column" : "row"} alignSelf="center">
            <Box width={this.state.renderMobileView ? "100%" : "50%"} height={this.state.renderMobileView ? "750px" : "100%"}
              style={this.state.renderMobileView ? {} : {minWidth: "780px"}}>
              {this.aboveTheFoldMain()}
            </Box>
            <Box width={this.state.renderMobileView ? "100%" : "50%"} height={this.state.renderMobileView ? "100px" : "100%"}>
              {this.aboveTheFoldImage()}
            </Box>
          </Box>
        </Box>

        <Box height="100%" width="100%" background="color5" id="content">
          <Box width="80%" height={this.state.renderMobileView ? "2650px": "940px"}  direction="column" alignSelf="center">
            {this.content1()}
          </Box>
        </Box>

        <Box height="100%" width="100%" background="color6">
          <Box width="80%" height={this.state.renderMobileView ? "1150px": "820px"} direction="column" alignSelf="center">
            {this.content2()}
          </Box>
        </Box>
        

        <Box height="100%" width="100%">
          <Box width="80%" height={this.state.renderMobileView ? "300px": "400px"} direction="column" alignSelf="center">
            {this.callToActionEndpage()}
          </Box>
        </Box>

        <Box height="100%" width="100%">
          <Box width="80%" height={this.state.renderMobileView ? "300px": "400px"} direction="column" alignSelf="center">
            {this.migrateFromResearchSeminars()}
          </Box>
        </Box>

        <Box width={window.innerWidth > 800 ? "80%" : "90%"} align="center">
          <FooterComponent />
        </Box>

      </Box>
    );
  }
}