import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Box, Text, Heading, Layer } from "grommet";
import moraStreamFullLogo from "../../assets/general/mora.stream_logo_v3.svg";
import moraStreamFullLettersLogo from "../../assets/general/mora.stream_logo_v2.1.png";
import agoraLogo from "../../assets/general/agora_logo_v2.1.svg";
import { User, UserService } from "../../Services/UserService";
import {
  Search,
  Java,
  Play,
  Add,
  Chat,
  Close,
  Connect,
  Announce,
  Multiple,
  Group,
  Workshop,
  Trigger,
  MailOption,
  DocumentPerformance,
  Deploy,
  Attraction,
  CirclePlay,
  Like,
} from "grommet-icons";
import UserManager from "../../Components/Account/UserManager";
import FooterComponent from "../../Components/Homepage/FooterComponent";
import "../../Styles/landing-page.css";
import MediaQuery from "react-responsive";
import ScrollIntoView from "react-scroll-into-view";
import ReactTooltip from "react-tooltip";
import TrendingTalksList from "../../Components/Homepage/TrendingTalksList";
import MoraGridBox from "../../Components/LandingPage/MoraGridBox";
import LandingPageBanner from "../../Components/LandingPage/LandingPageBanner";
import LandingPageGridBoxRow from "../../Components/LandingPage/LandingPageGridBoxRow";
import { CreatePresentationButton } from "../../Components/Homepage/CreatePresentationButton";

import CreateChannelButton from "../../Components/Channel/CreateChannelButton";
import CreateChannelOverlay from "../../Components/Channel/CreateChannelButton/CreateChannelOverlay";

import ZoomLogo from "../../assets/competitors_logo/427px-Zoom_Communications_Logo.png";
import YoutubeLogo from "../../assets/competitors_logo/YouTube_Logo_2017.svg.png";
import MicrosoftTeams from "../../assets/competitors_logo/youtube_logo.jpeg";
import BackgroundImage from "../../assets/general/mora_social_media_cover_#bad6db.jpg";
import WavyArrowLeftRight from "../../assets/landing_page/wavy_arrow_left_right.png";
import WavyArrowTopBot from "../../assets/landing_page/wavy_arrow_top_bot.png";

import ThreeSidedMarketplaceGraph from "../../assets/landing_page/3_sided_marketplace_graph.jpeg";

import InstitutionalUsers from "./InstitutionalUsers";
import LoginModal from "../../Components/Account/LoginModal";
import SignUpButton from "../../Components/Account/SignUpButton";

interface State {
  user: User | null;
  showLogin: boolean;
  colorButton: string;
  colorHover: string;
  showModalGiveATalk: boolean;
  isMobile: boolean;
  isSmallScreen: boolean;
  windowWidth: number;
  showCreateChannelOverlay: boolean;
}

export default class LandingPage extends Component<RouteComponentProps, State> {
  private smallScreenBreakpoint: number;
  private mobileScreenBreakpoint: number;
  constructor(props: any) {
    super(props);
    this.mobileScreenBreakpoint = 992;
    this.smallScreenBreakpoint = 480;

    this.state = {
      isMobile: window.innerWidth < this.mobileScreenBreakpoint,
      isSmallScreen: window.innerWidth < this.smallScreenBreakpoint,
      windowWidth: window.innerWidth,

      user: UserService.getCurrentUser(),
      showLogin:
        new URL(window.location.href).searchParams.get("showLogin") === "true",
      colorButton: "color1",
      colorHover: "color5",
      showModalGiveATalk: false,
      showCreateChannelOverlay: false,
    };
  }

  updateResponsiveSettings = () => {
    this.setState({
      isMobile: window.innerWidth < this.mobileScreenBreakpoint,
      isSmallScreen: window.innerWidth < this.smallScreenBreakpoint,
      windowWidth: window.innerWidth,
    });
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateResponsiveSettings);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateResponsiveSettings);
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
      showCreateChannelOverlay: !this.state.showCreateChannelOverlay,
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
              <Text size="16px" color="black" weight="bold">
                How to give your talk on mora.stream
              </Text>
            </Box>
            <Box pad="32px" alignSelf="center">
              <Close onClick={this.toggleModal} />
            </Box>
          </Box>

          <Box height="300px" margin={{ bottom: "15px" }}>
            <video
              autoPlay
              loop
              muted
              style={{ height: "100%", width: "auto" }}
            >
              <source src="/videos/talk_application.mp4" type="video/mp4" />
            </video>
          </Box>

          <Link to={{ pathname: "/agoras" }} style={{ textDecoration: "none" }}>
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
              <Text size="14px" weight="bold" margin={{ left: "2px" }}>
                Contact the relevant{" "}
                <img
                  src={agoraLogo}
                  style={{
                    height: "12px",
                    marginTop: "1px",
                    marginRight: "-1px",
                  }}
                />
                s
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
          <Text
            size={
              this.state.isMobile
                ? this.state.isSmallScreen
                  ? "25px"
                  : "30px"
                : "48px"
            }
            weight="bold"
            color="color1"
            margin={
              this.state.isMobile ? { bottom: "40px" } : { bottom: "50px" }
            }
          >
            Boost your academic career, paper citations, and more. Make a name
            for yourself.
          </Text>
          <Text size="20px">
            <b>
              Attend, give, and organise academic seminars all around the world
            </b>
            .
          </Text>
          <Text size="20px">
            Let your research be known and grow your network of teammates!
          </Text>
          <Box
            margin={
              this.state.isMobile
                ? { top: "30px", bottom: "30px" }
                : { top: "0px", bottom: "30px" }
            }
            // height="40%"
          >
            {this.callToActions()}
          </Box>
          <InstitutionalUsers
            isMobile={this.state.isMobile}
            isSmallScreen={this.state.isSmallScreen}
            windowWidth={this.state.windowWidth}
          />
        </Box>
      </>
    );
  }

  aboveTheFoldImage() {
    return (
      <>
        <Box
          direction="column"
          style={
            this.state.isMobile
              ? {
                  width: "90%",
                  alignSelf: "center",
                  marginTop: "20px",
                  display: "none",
                }
              : { width: "90%", marginTop: "120px", alignSelf: "center" }
          }
        >
          <img src={moraStreamFullLogo} style={{ maxWidth: "600px" }} />
        </Box>
      </>
    );
  }

  callToActions() {
    return (
      <Box
        direction={this.state.isSmallScreen ? "column" : "row"}
        focusIndicator={false}
        margin={{
          top: this.state.windowWidth > 800 ? "40px" : "20px",
          bottom: this.state.windowWidth > 800 ? "0px" : "0px",
        }}
        justify="start"
        alignContent="center"
        gap="medium"
      >
        <Link
          to={{ pathname: "/browse" }}
          style={{
            textDecoration: "none",
            alignSelf: this.state.isSmallScreen ? "center" : "",
          }}
        >
          <Box
            onClick={this.toggleModal}
            background={this.state.colorButton}
            round="xsmall"
            pad={this.state.isMobile ? "30px" : "xsmall"}
            height="80px"
            width={this.state.isMobile ? "250px" : "310px"}
            justify="center"
            align="center"
            focusIndicator={false}
            hoverIndicator={this.state.colorHover}
            margin={{ left: "0px" }}
            direction="row"
            style={{ maxWidth: "320px" }}
          >
            {this.state.isMobile ? "" : <Play size="30px" />}
            <Text
              size="18px"
              margin={{ left: this.state.isMobile ? "0px" : "10px" }}
            >
              <b>Watch</b> trending seminars
            </Text>
          </Box>
        </Link>

        <CreatePresentationButton
          isMobile={this.state.isMobile}
          isSmallScreen={this.state.isSmallScreen}
          windowWidth={this.state.windowWidth}
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
          <Text size="18px" margin={{left: "10px"}}> <b>Organise</b>  your seminars</Text>
        </Box>
      </Link> */}
      </Box>
    );
  }

  content1() {
    return (
      <>
        <Text size="34px" margin={{ top: "0px", bottom: "30px" }} color="black">
          How does this work?
        </Text>
        <LandingPageGridBoxRow
          windowWidth={this.state.windowWidth}
          breakpoint={1080}
          rowImage={WavyArrowLeftRight}
          columnImage={WavyArrowTopBot}
        >
          <MoraGridBox
            headericon={<Announce size="large" />}
            headertext={"Post"}
            content={
              "Post a brief description of your future talk. Seminar organisers from all around the world will read it for 30 days!"
            }
            videolink={"/videos/create_pres.mp4"}
          />
          <MoraGridBox
            headericon={<Connect size="large" />}
            headertext={"Get invited"}
            content={
              "During these 30 days, interested seminar organisers will get in touch with you to fix a date!"
            }
            videolink={"/videos/email_received_animation.mp4"}
          />
          <MoraGridBox
            headericon={<Group size="large" />}
            headertext={"Speak and mingle!"}
            content={
              "Present your work and meet new teammates! Several collaborations started right after a seminar (e.g. mora.stream)!"
            }
            videolink={"/videos/morastreaming_tech_example.mp4"}
          />
        </LandingPageGridBoxRow>
      </>
    );
  }

  content2() {
    return (
      <>
        <Text
          size="34px"
          margin={{ top: "120px", bottom: "20px" }}
          color="white"
        >
          An evergrowing{" "}
          <Text size="38px" color="color7" weight="bold">
            virtuous circle
          </Text>{" "}
          for researchers
        </Text>

        {!this.state.isMobile && (
          <img
            src={ThreeSidedMarketplaceGraph}
            height="40%"
            width="auto"
            style={{ alignSelf: "center" }}
          />
        )}

        <Box
          width="100%"
          direction={!this.state.isMobile ? "row" : "column"}
          gap="30px"
          justify="center"
          margin={{ top: "40px" }}
          style={{
            alignItems: this.state.isMobile ? "center" : "inherit",
          }}
        >
          <Box
            width="420px"
            height={this.state.isMobile ? "250px" : "320px"}
            background="color4"
            direction="column"
            pad="medium"
          >
            <Box
              direction="row"
              margin={{ bottom: "25px" }}
              height="25%"
              width="100%"
            >
              {/* <Box width="70px">
                <SearchAdvanced size="large"/>
              </Box> */}
              <Text
                size="24px"
                weight="bold"
                margin={{ left: "5px" }}
                color="black"
              >
                <Text size="24px" color="color7">
                  More speakers
                </Text>{" "}
                are matched with communities
              </Text>
            </Box>
            <Text size="18px">
              The whole speaker-community matching has been made easy! Future
              speakers provide all necessary information when they post their
              announcement and organisers can easily connect with them.
            </Text>
          </Box>

          <Box
            width="420px"
            height={this.state.isMobile ? "250px" : "320px"}
            background="color4"
            direction="column"
            pad="medium"
          >
            <Box
              direction="row"
              margin={{ bottom: "25px" }}
              height="25%"
              width="100%"
            >
              {/* <Box width="70px">
                <SearchAdvanced size="large"/>
              </Box> */}
              <Text
                size="24px"
                weight="bold"
                margin={{ left: "5px" }}
                color="black"
              >
                <Text size="24px" weight="bold" color="color7">
                  More seminars
                </Text>{" "}
                are organised
              </Text>
            </Box>
            <Text size="18px">
              We use tech to made the life of the seminar organisers as easy as
              possible, from start to finish. Organising seminars now takes less
              than a minute!
            </Text>
          </Box>

          <Box
            width="420px"
            height={this.state.isMobile ? "250px" : "320px"}
            background="color4"
            direction="column"
            pad="medium"
          >
            <Box
              direction="row"
              margin={{ bottom: "25px" }}
              height="25%"
              width="100%"
            >
              {/* <Box width="70px">
                <SearchAdvanced size="large"/>
              </Box> */}
              <Text
                size="24px"
                weight="bold"
                margin={{ left: "5px" }}
                color="black"
              >
                <Text size="24px" weight="bold" color="color7">
                  More networking
                </Text>{" "}
                implies{" "}
                <Text size="24px" weight="bold" color="color7">
                  more future speakers
                </Text>
              </Text>
            </Box>
            <Text size="18px">
              More seminars means more post seminar-coffees mingling, making new
              ideas more likely to emerge and mature to the point where they
              will be presented.
            </Text>
          </Box>
        </Box>
      </>
    );
  }

  // Not currently being used
  callToActionEndpage() {
    return (
      <>
        <Box>
          <Text
            size="34px"
            margin={{ top: "80px", bottom: "80px" }}
            color="color1"
            weight="bold"
            alignSelf="center"
          >
            Start giving!
          </Text>
          <Box align="center" margin={{ bottom: "90px" }}>
            <SignUpButton
              callback={() => {}}
              height="100px"
              width="200px"
              textSize="18px"
            />
          </Box>
          <Box
            alignSelf="center"
            margin={this.state.isMobile ? { top: "30px" } : {}}
          >
            <InstitutionalUsers
              isMobile={this.state.isMobile}
              isSmallScreen={this.state.isSmallScreen}
              windowWidth={this.state.windowWidth}
            />
          </Box>
        </Box>

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
    );
  }

  callToActionSocial() {
    return (
      <>
        <Box>
          <Text
            size="34px"
            margin={{ top: "80px", bottom: "15px" }}
            color="color1"
            weight="bold"
            alignSelf="center"
          >
            Built by academics, for academics
          </Text>
          <Text
            size="24px"
            margin={{ top: "15px", bottom: "80px" }}
            color="black"
            alignSelf="center"
          >
            mora.stream is built around what our community wants. Sign up and
            join the conversation!
          </Text>

          <Box align="center" margin={{ bottom: "90px" }}>
            <SignUpButton
              callback={() => {}}
              height="100px"
              width="200px"
              textSize="18px"
              windowWidth={this.state.windowWidth}
            />
          </Box>
          <Box
            alignSelf="center"
            margin={this.state.isMobile ? { top: "30px" } : {}}
          >
            <InstitutionalUsers
              isMobile={this.state.isMobile}
              isSmallScreen={this.state.isSmallScreen}
              windowWidth={this.state.windowWidth}
            />
          </Box>
        </Box>

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
    );
  }

  calltoActionOrganisers() {
    return (
      <>
        <Box>
          <Text
            size="34px"
            margin={{ top: "80px", bottom: "15px" }}
            color="color1"
            weight="bold"
            alignSelf="center"
          >
            Are you a seminar organiser?
          </Text>
          <Text
            size="24px"
            margin={{ top: "15px", bottom: "80px" }}
            color="black"
            alignSelf="center"
          >
            Finding speakers and organising seminars has now been made easy,
            from start to finish!
          </Text>

          <Box align="center" margin={{ bottom: "90px" }}>
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
                width={this.state.isSmallScreen ? "300px" : "420px"}
                justify="center"
                align="center"
                focusIndicator={false}
                hoverIndicator={this.state.colorHover}
                margin={{ left: "0px" }}
                direction="row"
              >
                <Group size="30px" />
                <Text size="18px" margin={{ left: "10px" }}>
                  {" "}
                  <b>Tell me more</b>
                </Text>
              </Box>
            </Link>
          </Box>
        </Box>
      </>
    );
  }

  render() {
    return (
      <Box direction="column" align="center">
        {/* <video
          autoPlay loop muted id="background-landing"
          style={{ height: "auto", width: "auto", minWidth: "100%", minHeight: "100%" }}
        >
          <source src="https://video.wixstatic.com/video/9b9d14_37244669d1c749ab8d1bf8b15762c61a/720p/mp4/file.mp4" type="video/mp4"/>
        </video> */}
        {/* <img height="200px" src={BackgroundImage}/> */}
        <img
          style={{
            height: "auto",
            width: "auto",
            minWidth: "100%",
            minHeight: "100%",
          }}
          id="background-landing"
          // src={BackgroundImage}
          src="https://i.postimg.cc/RhmJmzM3/mora-social-media-cover-bad6db.jpg"
        />
        {
          <LandingPageBanner
            isMobile={this.state.isMobile}
            mainContent={this.aboveTheFoldMain()}
            image={this.aboveTheFoldImage()}
          />
        }

        <Box
          height="100%"
          width="100%"
          background="color5"
          id="content"
          style={{ padding: "100px 0" }}
        >
          <Box
            // width="80%"
            // height={this.state.isMobile ? "1750px" : "760px"}
            direction="column"
            alignSelf="center"
            style={{ maxWidth: "1000px" }}
          >
            {this.content1()}
          </Box>
        </Box>

        <Box height="100%" width="100%" background="color1">
          <Box
            width="80%"
            height={this.state.isMobile ? "1290px" : "1100px"}
            direction="column"
            alignSelf="center"
          >
            {this.content2()}
          </Box>
        </Box>

        <Box height="100%" width="100%">
          <Box
            width="80%"
            // height={this.state.isMobile ? "450px" : "600px"}
            direction="column"
            alignSelf="center"
          >
            {this.callToActionSocial()}
          </Box>
        </Box>

        {/* <Box height="100%" width="100%" background="color5">
          <Box width="80%" height={this.state.isMobile ? "450px": "600px"} direction="column" alignSelf="center">
            {this.callToActionEndpage()}
          </Box>
        </Box> */}

        <Box height="100%" width="100%" background="color5">
          <Box
            width="80%"
            // height={this.state.isMobile ? "450px" : "400px"}
            direction="column"
            alignSelf="center"
          >
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
