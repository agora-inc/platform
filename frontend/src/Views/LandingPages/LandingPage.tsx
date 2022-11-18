import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Box, Text, Heading, Layer } from "grommet";
import moraStreamFullLogo from "../../assets/general/mora.stream_logo_v3.svg";
import moraStreamFullLettersLogo from "../../assets/general/mora.stream_logo_v2.1.png";
import agoraLogo from "../../assets/general/agora_logo_v2.1.svg";
import { User, UserService } from "../../Services/UserService";
import { Twitter, Slack, Play, Add, Chat, Close, Connect, Announce, Multiple, Group, Workshop, Trigger, MailOption, DocumentPerformance, Deploy, Attraction, CirclePlay, Like} from "grommet-icons";
import UserManager from "../../Components/Account/UserManager";
import FooterComponent from "../../Components/Homepage/FooterComponent";
import "../../Styles/landing-page.css";
import MediaQuery from "react-responsive";
import ScrollIntoView from 'react-scroll-into-view'
import ReactTooltip from "react-tooltip";
import TrendingTalksList from "../../Components/Homepage/TrendingTalksList";
import { CreatePresentationButton } from "../../Components/Homepage/CreatePresentationButton";

import CreateChannelButton from "../../Components/Channel/CreateChannelButton";
import CreateChannelOverlay from "../../Components/Channel/CreateChannelButton/CreateChannelOverlay";


import ZoomLogo from "../../assets/competitors_logo/427px-Zoom_Communications_Logo.png";
import YoutubeLogo from "../../assets/competitors_logo/YouTube_Logo_2017.svg.png";
import MicrosoftTeams from "../../assets/competitors_logo/youtube_logo.jpeg";
import BackgroundImage from "../../assets/general/mora_social_media_cover_#bad6db.jpg"
import WavyArrowLeftRight from "../../assets/landing_page/wavy_arrow_left_right.png"
import WavyArrowTopBot from "../../assets/landing_page/wavy_arrow_top_bot.png"


import ThreeSidedMarketplaceGraph from "../../assets/landing_page/3_sided_marketplace_graph.jpeg"

import InstitutionalUsers from "./InstitutionalUsers";
import LoginModal from "../../Components/Account/LoginModal";
import SignUpButton from "../../Components/Account/SignUpButton";





import noInviteImage from "../../assets/landing_page/old_vs_new_way/no_invites.png";
// import worldPins from "../../assets/landing_page/old_vs_new_way/world_gif_raw.gif";
// import hourglassImg from "../../assets/landing_page/old_vs_new_way/hourglass.png";
import boredImg from "../../assets/landing_page/old_vs_new_way/bored_on_bench.jpg";
import applauseImg from "../../assets/landing_page/old_vs_new_way/applause_img.png";
import seminarResultGif from "../../assets/landing_page/old_vs_new_way/seminar_result.gif";
import localCommunityImg from "../../assets/landing_page/old_vs_new_way/house_local.png";
import worldspinningGif from "../../assets/landing_page/old_vs_new_way/world_spinning.gif";
import heroResultGif from "../../assets/landing_page/old_vs_new_way/g_scholar_hero_lance.gif";
import invitationReceivedGif from "../../assets/landing_page/old_vs_new_way/email_received_animation.gif";




interface State {
  user: User | null
  showLogin: boolean
  colorButton: string
  colorHover: string
  titleSize: string
  secondSize: string
  showModalGiveATalk: boolean;
  renderMobileView: boolean;
  showCreateChannelOverlay: boolean
}

export default class LandingPage extends Component<RouteComponentProps, State> {
  constructor(props: any) {
    super(props);
    var maxWidthMobile = 1000;
    this.state = {
      renderMobileView: (window.innerWidth < maxWidthMobile),
      user: UserService.getCurrentUser(),
      showLogin: new URL(window.location.href).searchParams.get("showLogin") === "true",
      colorButton: "color1",
      colorHover: "color5",
      titleSize: window.innerWidth < maxWidthMobile ? "26px" : "34px",
      secondSize: window.innerWidth < maxWidthMobile ? "18px" : "24px",
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

  // HACK: scroll up when page loads. (Remy)
  // Origin of hack: see https://github.com/agora-inc/agora/commit/b6a0a0cafbaae0d9ff8a7266705fe22c3ed4bcf6
  componentDidMount() {
    let scroll_element = window.document.querySelector('.StyledGrommet-sc-19lkkz7-0');
    (scroll_element as HTMLInputElement).scrollTo(0,0);
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
          <Text size={this.state.renderMobileView ? "36px" : "48px"} weight="bold" color="color1" margin={this.state.renderMobileView ? {top: "80px", bottom: "40px"} : {top: "120px", bottom: "50px"}}>
            Boost your academic career. Make a name for yourself.
          </Text>
          {/*  paper citations, and more. */}
          <Text size="20px">
            <b>Get invited to speak to academic communities from all around the world</b>
          </Text>
          <Text size="20px">Boost your citations and start exciting collaborations by meeting new teammates</Text>
          <Box 
            margin={this.state.renderMobileView ? {top: "30px", bottom: "0px"} : {top: "0px"}} 
            height={this.state.renderMobileView ? "25%" : "40%"}
          >
            {this.callToActions()}
          </Box>
          <InstitutionalUsers />
        </Box>
      </>
    )

}

  aboveTheFoldImage() {
    return (
      <>
        <Box direction="column" style={this.state.renderMobileView 
            ? { width: "90%", alignSelf: "center", marginTop: "0px" } 
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
        direction={this.state.renderMobileView ? "column" : "row"}
        focusIndicator={false}
        margin={{
          top: (window.innerWidth > 800) ? "40px" : "20px",
          bottom: (window.innerWidth > 800) ? "0px" : "0px"
        }}
        justify="start"
        alignContent="center"
        gap="medium"
        >
        <SignUpButton 
          callback={()=>{}}
          height="70px"
          width="250px"
          textSize="18px"
          text="Get started"
          icon={true}
        />


        
        {/* <Link
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
            <Text size="18px" margin={{left: "10px"}}> <b>Find</b> your next speakers</Text>
          </Box>
        </Link> */}
        {/* <Link
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
            <Text size="18px" margin={{left: "10px"}}> <b>Watch</b> trending seminars</Text>
          </Box>
        </Link> */}

    </Box>
    )
  }


  contentTrigger() {
    return (
      <>
        <Text 
          size={this.state.titleSize} 
          color="black" 
          margin={this.state.renderMobileView ? {top: "80px", bottom: "80px"} : {top: "140px", bottom: "140px"}}
        >
          {/* Seminars are a <u>key component</u> of your research, but they still operate in the <u>20th century</u>. */}
          {/* Seminars are <u>essential</u> to every researchers, but nobody has leveraged <u>20th century</u>. */}
          Seminars are <u>essential</u> in spreading new ideas, and today their reach is <u>bigger than ever</u>. 



          {/* Seminars have been citation and network boosters since Newton, but today <u>everyone</u> can organise, give, and attend them <u>from everywhere</u>. */}
          {/* Seminars have been attended by <u>local</u> audiences since old Greece, but today <u>everyone</u> can organise, give, and attend them <u>from everywhere</u> */}
          {/* Seminars are the essence of research,but today <u>everyone</u> can organise, give, and attend them <u>from everywhere</u> */}
          {/* Seminars have been at the core of research since the Ancient Greece, but today <u>everyone</u> can organise, give, and attend them <u>from everywhere</u> */}
          {/* Physical seminars have been the atomic component of academics' social life since Newton, but today <u>everyone</u> can organise, give, and attend them <u>from everywhere</u>. */}
          {/* Seminars have been mostly attended by local communities since Newton, but today <u>everyone</u> can organise, give, and attend them <u>from everywhere</u>. */}
          {/* Seminars have been limimte since Newton, but today <u>everyone</u> can organise, give, and attend them <u>from everywhere</u>. */}
          {/* The more people understand your work in a seminar, the more likely you will get cited and find collaborators.  */}
          {/* One's academic reputation is built around papers and seminars since Newton, but today, most of it happens online. */}
          {/* A good article without advertisement is a forgotten article. */}
          {/* Getting to give a talk has been a rare priviledge since Newton, but today, it's easier. */}
          {/* 20 years ago, good papers would easily get good citations, but today, it is <u>not enough</u>. */}
          {/* Giving a seminar has been a rare career booster since Newton, but the tools to organise them has not changed for decades. */}
          {/* You organise and give seminars to boost but the tools  */}
          {/* Seminars have been the bonfire of academics since Newton, but organising them is still overly time consuming. */}
          {/* The tools to organise and give seminars have barely changed since the 1200s. */}
          {/* Your academic reputation */}
          {/* Getting invited to give a seminar hasn't changed since Newton, but today it's <u>their turn</u> to be empowered with tech. */}
          {/* Seminars have been the bonfire of academics since Newton but finding opportunities have been hard, until now. */}
          {/* Seminars have been the bonfire of academics since Newton. */}
        </Text>




        {/* 
        #######################
        # Testimonial: to be added soon (Remy)
        #######################
        <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } gap="30px">
          <Box>
            Martin Hairer, Field Medalist, Imperial College London
            </Box>
          <Box background="white" height="150px">
            <Text size={this.state.secondSize}>"Seminars are key to the growth of researchers."</Text>
            </Box>
        </Box> 
        */}
      </>
    )
  }


  contentHeroHow() {
    var sizeText : string = this.state.renderMobileView ? "14px" : "18px"
    var sizeSmallText : string = window.innerWidth > 1000 ? "18px" : (window.innerWidth > 600 ? "14px" : "9px")
    var widthImage : string = this.state.renderMobileView ? (window.innerWidth * 0.32) + "px" : "200px"
    var widthText : string = this.state.renderMobileView ? (window.innerWidth * 0.48) + "px" : "300px"
    var heightBox : string = this.state.renderMobileView ? (window.innerWidth * 0.32) + "px" : "200px"

    return (
      <Box width="100%" style={{maxWidth: "2000px"}}>
        <Text 
          size={this.state.titleSize} 
          margin={this.state.renderMobileView ? {top: "80px", bottom: "60px"} : {top: "120px", bottom: "80px"}} color="white"
        >
           The <Text color="#C0C0C0" size={this.state.titleSize}><del>old</del></Text> 
           <Text color="color7" size={this.state.titleSize}>new</Text> way of giving seminars
        </Text>

        <Box alignContent="center" alignSelf="center">
          <Box width="100%" direction={this.state.renderMobileView ? "column" : "row"} margin={{bottom: "35px"}} justify="start">
            <Box direction="row" margin={{bottom: this.state.renderMobileView ? "30px" : "0px"}}>
              <Box 
                width={widthImage} 
                height={heightBox}
                background="white" alignContent="center" direction="column" pad="small"
              >
                {/* <img src={noInviteImage}/> */}
                <img src={boredImg}/>
              </Box>
            
              <Box 
                width={widthText} 
                height={heightBox} 
                background="color2" direction="column" justify="center" pad="medium" 
                margin={{right: this.state.renderMobileView ? "0px" : "15px"}}
              >
                <Text size={sizeText} style={{alignContent: "start"}} color="#C0C0C0">
                  Do nothing and wait for months / years to <i>maybe</i> get invited. 
                </Text>
              </Box>
            </Box>
            <Box direction="row">
              <Box 
                width={widthText} 
                height={heightBox} 
                background="color2" direction="column" justify="center" pad="medium" 
                margin={{left: this.state.renderMobileView ? "0px" : "15px"}}
              >
                <Text size={sizeText}style={{alignContent: "start"}} color="color7"> 
                  Apply and receive multiple invitations within 30 days
                </Text>
              </Box>
              <Box width={widthImage} height={heightBox}  background="color6">
                <img src={invitationReceivedGif}/>
              </Box>
            </Box>
          </Box>

          <Box height="60px" direction="column" align="center" width="1030px"> 
            <img src={ WavyArrowTopBot}
              style={{alignSelf: "center", height: "70px"}} />
          </Box>


          <Box width="100%" direction={this.state.renderMobileView ? "column" : "row"} margin={{top: "35px", bottom: "35px"}} justify="start">
            <Box direction="row" margin={{bottom: this.state.renderMobileView ? "30px" : "0px"}}>
              <Box width={widthImage} height={heightBox} background="color6" pad="small">
                <img src={localCommunityImg}/>
              </Box>
              <Box 
                width={widthText} 
                height={heightBox} 
                background="color2" direction="column" justify="center" pad="medium" 
                margin={{right: this.state.renderMobileView ? "0px" : "15px"}}
              >
                <Text size={sizeText} style={{alignContent: "start"}} color="#C0C0C0">
                  Speak <u>once</u> to a local physical audience of <u>10 people</u>
                </Text>
              </Box>
            </Box>

            <Box direction="row">
              <Box 
                width={widthText} 
                height={heightBox} 
                background="color2" direction="column" justify="center" pad="medium" 
                margin={{left: this.state.renderMobileView ? "0px" : "15px"}}
              >
                <Text size={sizeText} style={{alignContent: "start"}} color="color7"> 
                  Spend <u>multiple times</u> to a cumulative international online/hybrid audience of <u>1000 people</u>.
                </Text>
              </Box>
              <Box width={widthImage} height={heightBox} background="color6">
                <img src={worldspinningGif} style={{maxHeight: "200px", maxWidth: "200px"}}/>
              </Box>
            </Box>

          </Box>

          <Box height="60px" direction="column" align="center" width="1030px"> 
            <img src={WavyArrowTopBot}
              style={{alignSelf: "center", height: "70px"}} />
          </Box>

          <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } margin={{top: "35px", bottom: "35px"}} justify="start">
            <Box direction="row" margin={{bottom: this.state.renderMobileView ? "30px" : "0px"}}>
              <Box width={widthImage} height={heightBox} background="color6">
                <img src={applauseImg} style={{maxHeight: "200px", maxWidth: "200px"}}/>
              </Box>
              
              <Box 
                width={widthText} 
                height={heightBox} 
                background="color2" direction="column" justify="center" pad="medium" 
                margin={{right: this.state.renderMobileView ? "0px" : "15px"}}
              >
                <Text size={sizeSmallText} style={{alignContent: "start"}} color="#C0C0C0">
                    • +10 reads of your article
                </Text>
                <Text size={sizeSmallText} style={{alignContent: "start"}} color="#C0C0C0">
                    • +1 potential citation
                </Text>
                <Text size={sizeSmallText} style={{alignContent: "start"}} color="#C0C0C0">
                  • +2 Twitter followers
                </Text>
                <Text size={sizeSmallText} style={{alignContent: "start"}} color="#C0C0C0">
                • +2 new collaborators
                </Text>
              </Box>
            </Box>
            <Box direction="row">
              <Box 
                width={widthText}
                height={heightBox}
                background="color2" direction="column" justify="center" pad="medium" 
                margin={{left: this.state.renderMobileView ? "0px" : "15px"}}
              >
                <Text size={sizeSmallText} style={{alignContent: "start", marginLeft: "-25px"}} color="color7"> 
                  <ul>
                    <li> +1000 reads of your article</li>
                    <li> +100 potential citations</li>
                    <li> +200 Twitter followers</li>
                    <li> +200 new collaborators</li>
                  </ul>
                </Text>
              </Box>
              <Box width={widthImage} height={heightBox} background="color6">
                <img src={heroResultGif}/>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }





  contentHowDoesItWork() {
    return (
      <Box width="100%" style={{maxWidth: "2000px"}}>
        <Text 
          size={this.state.titleSize}
          margin={this.state.renderMobileView ? {top: "80px", bottom: "60px"} : {top: "120px", bottom: "80px"}} 
          color="black"
        >
          How does it work?
        </Text>
        <Box direction={!this.state.renderMobileView ? "row" : "column" } gap="30px" alignSelf="center">
          <Box width="350px" height={this.state.renderMobileView ? "370px" : "430px"} background="color2" direction="column" justify="between">
            <Box height="230px" pad="medium" gap="10px">
              <Box direction="row" height="60px" width="100%">
                <Box width="70px">
                  <Announce size="large"/>
                </Box>
                <Box height="170px">
                  <Text size="24px" weight="bold" margin={{left: "5px"}} color="color7">
                    Post
                  </Text>
                </Box>
              </Box>
              <Text size="18px" style={{alignContent: "start"}}> 
                Go to your profile and post a description of your future talk. Seminar organisers from everywhere will read it for 30 days!
              </Text>
            </Box>
            <Box height="200px" alignSelf="center" direction="row">
              <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto", alignSelf: "center", maxWidth:"100%"}}
                  >
                  <source src="/videos/create_pres.mp4" type="video/mp4"/> 
              </video>
            </Box>
          </Box>

          <Box width="190px" direction="column" alignSelf="center"> 
            <img src={this.state.renderMobileView ? WavyArrowTopBot : WavyArrowLeftRight}
              style={this.state.renderMobileView ? {alignSelf: "center", height:"70px"}  : {alignSelf: "center", width: "120px"}} />
          </Box>

          <Box width="350px" height={this.state.renderMobileView ? "370px" : "430px"} background="color2" direction="column" justify="between">
            <Box height="230px" pad="medium" gap="10px">
              <Box direction="row" height="60px" width="100%">
                <Box width="70px">
                  <Connect size="large"/>
                </Box>
                <Box height="170px">
                  <Text size="24px" weight="bold" margin={{left: "5px"}} color="color7">
                    Get invited
                  </Text>
                </Box>
              </Box>
              <Box height="170px">
                <Text size="18px" style={{alignContent: "start"}}>
                  {/* Seminars can be run online or hybrid with <img src={ZoomLogo} height="14px"/>, <img src={YoutubeLogo} height="14px"/> or the <img src={moraStreamFullLettersLogo} height="14px"/> streaming tech sculpted for academics! */}
                  During these 30 days, interested seminar organisers will get in touch with you to fix a date!
                </Text>
              </Box>
            </Box>
            <Box height="200px" alignSelf="center" direction="row">
              <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto", maxWidth:"100%"}}
                  >
                  <source src="/videos/email_received_animation.mp4" type="video/mp4"/> 
              </video>
            </Box>
          </Box>

          <Box width="190px" direction="column" alignSelf="center"> 
            <img src={this.state.renderMobileView ? WavyArrowTopBot : WavyArrowLeftRight}
              style={this.state.renderMobileView ? {alignSelf: "center", height:"70px"}  : {alignSelf: "center", width: "120px"}} />
          </Box>

          <Box width="350px" height={this.state.renderMobileView ? "370px" : "430px"} background="color2" direction="column" justify="between">
            <Box height="230px" pad="medium" gap="10px">
              <Box direction="row" height="60px" width="100%">
                <Box width="70px">
                  <Group size="large"/>
                </Box>
                <Text size="24px" weight="bold" margin={{left: "5px"}} color="color7">
                  Speak and mingle
                </Text>
              </Box>
              <Box height="170px">
                <Text size="18px" style={{alignContent: "start"}}>
                  Present your work and meet new teammates! Several collaborations started right after a seminar (e.g. mora.stream)!
                </Text>
              </Box>
            </Box>

            <Box height="200px" alignSelf="center" direction="row">
              <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto", maxWidth:"100%"}}
                  >
                  <source src="/videos/morastreaming_tech_example.mp4" type="video/mp4"/> 
              </video>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }
  
  contentAcceleratingMatching() {
    return (
      <Box width="100%" style={{maxWidth: "2000px"}}>
        <Text 
          size={this.state.titleSize} 
          margin={{top: "120px", bottom: "20px"}} color="white"
        >
          An evergrowing <Text size="38px" color="color7" weight="bold">virtuous circle</Text> for researchers
        </Text>

        {!this.state.renderMobileView && 
          <img src={ThreeSidedMarketplaceGraph} height="40%" width="auto" style={{alignSelf: "center"}}/>
        }

        <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } gap="30px" justify="center" margin={{top: "40px"}}>
          <Box width="420px" height={this.state.renderMobileView ? "250px" : "320px"} background="color4" direction="column" pad="medium">
            <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
              {/* <Box width="70px">
                <SearchAdvanced size="large"/>
              </Box> */}
              <Text size="24px" weight="bold" margin={{left: "5px"}} color="black">
                <Text size="24px" color="color7">More speakers</Text> are matched with communities
              </Text>
            </Box>
            <Text size="18px"> 
              The speaker-community matching is now super easy! Future speakers provide all necessary information when they post their announcement and organisers can easily connect with them.
            </Text>
          </Box>

          <Box width="420px" height={this.state.renderMobileView ? "250px" : "320px"} background="color4" direction="column" pad="medium">
            <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
              {/* <Box width="70px">
                <SearchAdvanced size="large"/>
              </Box> */}
              <Text size="24px" weight="bold" margin={{left: "5px"}} color="black">
              <Text size="24px" weight="bold" color="color7">More seminars</Text> are organised
              </Text>
            </Box>
            <Text size="18px"> 
              We use tech to made the life of the seminar organisers as easy as possible, from start to finish. Organising seminars now takes less than a minute! 
            </Text>
          </Box>

          <Box width="420px" height={this.state.renderMobileView ? "250px" : "320px"} background="color4" direction="column" pad="medium">
            <Box direction="row" margin={{bottom: "25px"}} height="25%" width="100%">
              {/* <Box width="70px">
                <SearchAdvanced size="large"/>
              </Box> */}
              <Text size="24px" weight="bold" margin={{left: "5px"}} color="black">
              <Text size="24px" weight="bold" color="color7">More networking</Text> implies <Text size="24px" weight="bold" color="color7">more future speakers</Text>
              </Text>
            </Box>
            <Text size="18px"> 
              More seminars means more post seminar-coffees mingling, making new ideas more likely to emerge and mature to the point where they will be presented.
            </Text>
          </Box>
        </Box>
      </Box>
    )
  }
  

  callToActionEndpage() {
    return (
      <>
        {!this.state.renderMobileView && (
          <>
            <Box width="100%" style={{maxWidth: "2000px"}}>
              <Text size={this.state.titleSize} margin={{top: "80px", bottom: "40px"}} color="color1" weight="bold" alignSelf="center">What are you waiting for? Let the world know about your work!</Text>
              <Text size="24px" color="color1" alignSelf="center">
                Join a leading community of researchers and seminar organisers
              </Text>
              <Box align="center" margin={{bottom: "90px", top: "40px"}}>
                  <SignUpButton 
                    callback={()=>{}}
                    height="80px"
                    width="200px"
                    textSize="18px"
                    icon={true}
                    text="Join your peers"
                  />
              </Box>
              <Box alignSelf="center" margin={this.state.renderMobileView ? {top: "30px"} : {}}>
                <InstitutionalUsers/>
              </Box>
            </Box>
          </>
        )}
        {this.state.renderMobileView && (
            <Text size={this.state.titleSize} margin={{top: "80px", bottom: "80px"}} color="color1" weight="bold" alignSelf="center">
              Come back with a Desktop browser to get started! 🚀
            </Text>
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


contentTestimonial() {
  return (
    <>
      {!this.state.renderMobileView && (
        <>
          <Box width="100%" style={{maxWidth: "2000px"}}>
            <Text size={this.state.titleSize} margin={{top: "80px", bottom: "15px"}} color="color1" weight="bold" alignSelf="center">Built by academics, for academics</Text>
            <Text size="24px" margin={{top: "15px", bottom: "80px"}} color="black" alignSelf="center">mora.stream is built around what our community wants. Sign up and join the conversation!</Text>
            
            <Box align="center" margin={{bottom: "90px"}}>
                <SignUpButton 
                  callback={()=>{}}
                  height="100px"
                  width="200px"
                  textSize="18px"
                />
            </Box>
            <Box alignSelf="center" margin={this.state.renderMobileView ? {top: "30px"} : {}}>
              <InstitutionalUsers/>
            </Box>
          </Box>
        </>
      )}
      {this.state.renderMobileView && (
          <Text size={this.state.titleSize} margin={{top: "80px", bottom: "80px"}} color="color1" weight="bold" alignSelf="center">Come back to this page using a Desktop browser to get started! 🚀</Text>
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


calltoActionOrganisers() {
  return (
    <Box width="100%" style={{maxWidth: "2000px"}}>
      <Text 
        size={this.state.titleSize} 
        margin={{top: "80px", bottom: "15px"}} 
        color="color1" weight="bold" alignSelf="center"
      >
        Are you a seminar organiser?
      </Text>
      <Text 
        size={this.state.secondSize} 
        margin={{top: "15px", bottom: this.state.renderMobileView ? "50px" : "80px"}} 
        color="black" alignSelf="center"
      >
        Finding speakers and organising seminars is now easy!
      </Text>
      
      <Box align="center" margin={{bottom: this.state.renderMobileView ? "50px" : "90px"}}>
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
            width={this.state.renderMobileView ? "250px" : "420px"}
            justify="center"
            align="center"
            focusIndicator={false}
            hoverIndicator={this.state.colorHover}
            margin={{ left: "0px" }}
            direction="row"
          >
            <Group size="30px" />
            <Text size="18px" margin={{left: "10px"}}> <b>Tell me more</b></Text>
          </Box>
        </Link>
      </Box>
    </Box>    
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
          <Box width="80%" height={this.state.renderMobileView ? "1300px": "750px"} direction={this.state.renderMobileView ? "column" : "row"} alignSelf="center">
            <Box width={this.state.renderMobileView ? "100%" : "60%"} height={this.state.renderMobileView ? "1250px" : "100%"}
              style={this.state.renderMobileView ? {} : {minWidth: "780px"}}>
              {this.aboveTheFoldMain()}
            </Box>
            <Box width={this.state.renderMobileView ? "100%" : "40%"} height={this.state.renderMobileView ? "350px" : "100%"}>
              {this.aboveTheFoldImage()}
            </Box>
          </Box>
        </Box>

        <Box height="100%" width="100%" background="color5">
          <Box width="80%" height="350px" direction="column" alignSelf="center">
            {this.contentTrigger()}
          </Box>
        </Box>

        {/* <Box height="100%" width="100%" background="color3" id="content">
          <Box width="80%" height={this.state.renderMobileView ? "1650px": "760px"}  direction="column" alignSelf="center">
            {this.contentHowDoesItWork()}
          </Box>
        </Box> */}

        <Box height="100%" width="100%" background="color1">
          <Box width="80%" height={this.state.renderMobileView ? (600 + window.innerWidth * 2) + "px" : "1200px"} direction="column" alignSelf="center">
            {this.contentHeroHow()}
          </Box>
        </Box>


        {/* <Box height="100%" width="100%" background="color4">
          <Box width="80%" height={this.state.renderMobileView ? "1290px": "1100px"} direction="column" alignSelf="center">
            {this.contentAcceleratingMatching()}
          </Box>
        </Box> */}


        {/* <Box height="100%" width="100%">
          <Box width="80%" height={this.state.renderMobileView ? "450px": "600px"} direction="column" alignSelf="center">
            {this.contentTestimonial()}
          </Box>
        </Box> */}

        <Box height="100%" width="100%" background="color5">
          <Box width="80%" height={this.state.renderMobileView ? "250px": "600px"} direction="column" alignSelf="center">
            {this.callToActionEndpage()}
          </Box>
        </Box>

        <Box height="100%" width="100%">
          <Box width="80%" height="400px" direction="column" alignSelf="center">
            {this.calltoActionOrganisers()}
          </Box>
        </Box>

        <Box width={window.innerWidth > 800 ? "80%" : "90%"} align="center">
          <FooterComponent />
        </Box>

      </Box>
    );
  }
}