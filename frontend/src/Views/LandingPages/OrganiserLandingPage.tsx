import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Box, Text, Heading, Layer } from "grommet";
// import moraStreamFullLogo from "../assets/general/mora.stream_logo_free_v3.png";
import moraStreamFullLogo from "../../assets/general/mora.stream_logo_v3.svg";
import moraStreamFullLettersLogo from "../../assets/general/mora.stream_logo_v2.1.png";

import agoraLogo from "../../assets/general/agora_logo_v2.1.svg";
import { User, UserService } from "../../Services/UserService";
import {
  Search,
  Java,
  Play,
  Share,
  Add,
  Video,
  Close,
  ShareOption,
  Rewind,
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
import FooterComponent from "../../Components/Homepage/FooterComponent";
import "../../Styles/landing-page.css";
import MediaQuery from "react-responsive";
import ScrollIntoView from "react-scroll-into-view";
import ReactTooltip from "react-tooltip";

import CreateChannelButton from "../../Components/Channel/CreateChannelButton";
import CreateChannelOverlay from "../../Components/Channel/CreateChannelButton/CreateChannelOverlay";

import MoraGridBox from "../../Components/LandingPage/MoraGridBox";
import LandingPageBanner from "../../Components/LandingPage/LandingPageBanner";
import LandingPageGridBoxRow from "../../Components/LandingPage/LandingPageGridBoxRow";

import ZoomLogo from "../../assets/competitors_logo/427px-Zoom_Communications_Logo.png";
import YoutubeLogo from "../../assets/competitors_logo/YouTube_Logo_2017.svg.png";
import MicrosoftTeams from "../../assets/competitors_logo/youtube_logo.jpeg";
import BackgroundImage from "../../assets/general/mora_social_media_cover_#bad6db.jpg";
import WavyArrow from "../../assets/landing_page/wavy_arrow_left_right.png";

import InstitutionalUsers from "./InstitutionalUsers";
import SeminarImage from "../../assets/general/academic_seminars_photo.jpeg";

import PricingPlans from "../../Views/PricingPlans";

import DashedLine from "../../assets/landing_page/dashed-line.png";
import TransportSeminars from "../../Components/Homepage/TransportSeminars";

interface State {
  user: User | null;
  showLogin: boolean;
  colorButton: string;
  colorHover: string;
  showModalGiveATalk: boolean;
  renderMobileView: boolean;
  isMobile: boolean;
  isSmallScreen: boolean;
  windowWidth: number;
  showCreateChannelOverlay: boolean;
}

export default class OrganiserLandingPage extends Component<
  RouteComponentProps,
  State
> {
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

      renderMobileView: window.innerWidth < 1200,
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

          <Box height="200px" margin={{ bottom: "15px" }}>
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
        <Box direction="column">
          <Text
            size={
              this.state.isMobile
                ? this.state.isSmallScreen
                  ? "25px"
                  : "30px"
                : "48px"
            }
            weight="bold"
            color="color4"
            margin={
              this.state.isMobile ? { bottom: "40px" } : { bottom: "50px" }
            }
            textAlign={this.state.isMobile ? "center" : "start"}
          >
            Organising seminars made easy, from start to finish
          </Text>
          <Box
            margin={{ bottom: "0px" }}
            direction="row"
            justify={this.state.isMobile ? "center" : "start"}
          >
            <CreateChannelButton
              onClick={this.toggleCreateChannelOverlay}
              width="400px"
              height="90px"
              text={"Publish your seminars"}
              textSize="18px"
            />
          </Box>
          {/*<InstitutionalUsers/>*/}
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
          <img src={SeminarImage} width="100%" height="auto" />
        </Box>
      </>
    );
  }

  callToActions() {
    return (
      <Box
        direction="row"
        focusIndicator={false}
        margin={{
          top: window.innerWidth > 800 ? "40px" : "40px",
          bottom: window.innerWidth > 800 ? "0px" : "0px",
        }}
        justify="start"
        alignContent="center"
        gap="medium"
      >
        <Link to={{ pathname: "/browse" }} style={{ textDecoration: "none" }}>
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
            <Text size="18px" margin={{ left: "10px" }}>
              {" "}
              <b>Watch</b> latest seminars
            </Text>
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
            <Text size="18px" margin={{ left: "10px" }}>
              {" "}
              <b>Launch</b> your seminars
            </Text>
          </Box>
        </Link>
      </Box>
    );
  }

  brandCurrentOrganisation() {
    return <Box>sdf</Box>;
  }

  content1() {
    return (
      <>
        <Text
          size="34px"
          margin={{ bottom: "40px" }}
          color="black"
          textAlign={this.state.isMobile ? "center" : "start"}
        >
          Everything seminar organisers need, all in one place
        </Text>
        <LandingPageGridBoxRow
          windowWidth={this.state.windowWidth}
          breakpoint={1080}
          rowImage={DashedLine}
          columnImage={""}
        >
          <MoraGridBox
            headericon={<Attraction size="large" />}
            headertext={"1. Create your agora"}
            content={`Your agora, or community homepage, will be the center of your
              organisational life. It will also be the place where your
              community will periodically come back to check out your next
              events!`}
            action={
              <Box pad="small">
                <CreateChannelButton
                  textColor="color7"
                  text="Create your agora"
                  textSize="20px"
                  onClick={this.toggleCreateChannelOverlay}
                />
              </Box>
            }
          />
          <MoraGridBox
            headericon={<Workshop size="large" />}
            headertext={"2. Find a speaker"}
            content={`Finding speakers can sometimes be very tedious. On mora.stream,
              speakers directly come to you by filling an in-built application
              form!`}
          />
          <MoraGridBox
            headericon={<Share size="large" />}
            headertext={"3. Publish in a minute"}
            content={`We made organising seminars is made <b>as easy as possible</b>.
              Three clicks are enough to automate the sending of reminder
              emails, automatically accept verified academics, and share your
              event on all your social media!`}
          />
        </LandingPageGridBoxRow>

        <Box pad="medium" />

        <LandingPageGridBoxRow
          windowWidth={this.state.windowWidth}
          breakpoint={1080}
          rowImage={DashedLine}
          columnImage={""}
        >
          <MoraGridBox
            headericon={<Video size="large" />}
            headertext={"4. Stream"}
            content={`You can use your <img src=${ZoomLogo} height="14px" /> subscription
              OR the <img src=${moraStreamFullLettersLogo} height="16px" />
              streaming tech. The latter allows you to run hybrid seminars,
              write LateX in chat, go back in the slides, clap for the speaker
              and much more!`}
          />
          <MoraGridBox
            headericon={<Group size="large" />}
            headertext={"5. Network"}
            content={`Enjoy the free access to a 2D-virtual cafeteria after each
              seminars and allow your audience to mingle among themselves and
              meet with the speakers.`}
          />
          <MoraGridBox
            headericon={<Play size="large" />}
            headertext={"6. Upload slides and recordings"}
            content={`Please your community by supplementing your event with your mp4
              recording, your <img src=${YoutubeLogo} height="16px" /> URL as
              well as your speaker's slides in just a couple clicks!`}
          />
        </LandingPageGridBoxRow>
      </>
    );
  }

  content2() {
    return (
      <>
        <Box direction="row" margin={{ bottom: "40px" }}>
          <Text
            size="34px"
            color="black"
            textAlign={this.state.isMobile ? "center" : "start"}
          >
            Your life made life easy, <b>for free</b>
          </Text>
        </Box>

        <Box margin={{ bottom: "30px" }} direction="row">
          <Text size="18px">
            Because we want to facilitate the sharing of new knowledge, we offer{" "}
            <b>all features for free</b> if you use your own external streaming
            tech!
          </Text>
        </Box>

        <LandingPageGridBoxRow
          windowWidth={this.state.windowWidth}
          breakpoint={1200}
          rowImage={""}
          columnImage={""}
        >
          <MoraGridBox
            headertext={"A free customizable homepage"}
            content={`A customizable homepage were academics can contact you,
              register to your future events and consult your past events'
              recordings and slides!`}
            videolink={"/videos/customize_agora_page.mp4"}
          />
          <MoraGridBox
            headertext={"A built-in speaker application form"}
            content={`Speakers directly come to you by filling an in-built
              application form (this can be disabled). If it's a match,
              invite them to speak!`}
            videolink={"/videos/talk_application.mp4"}
          />
          <MoraGridBox
            headertext={"Free event scheduling tools"}
            content={`<ul style="padding-left: 10px; margin: 0" >
                <li>Email reminders</li>
                <li>Automatically accept verified academic email addresses</li>
                <li>Write LateX in description</li>
                <li>And many more...!</li>
              </ul>`}
            videolink={"/videos/schedule_talk.mp4"}
          />
          <MoraGridBox
            headertext={"A free post-seminar cafeteria"}
            content={`Grab an e-coffee in a 2D world and meet with speakers and
              audience. Many collaborations started around a coffee
              (mora.stream included)!`}
            videolink={"/videos/cafeteria-agora-minidemo.mp4"}
          />
        </LandingPageGridBoxRow>
      </>
    );
  }

  content3() {
    return (
      <>
        {/* <Text size="34px" margin={{top: "120px", bottom: "80px"}} color="black">The future of seminars is <b>online and hybrid</b></Text> */}
        <Text
          size="34px"
          margin={{ bottom: "40px" }}
          color="black"
          textAlign={this.state.isMobile ? "center" : "start"}
        >
          A streaming tech sculpted for academics
        </Text>
        <Text>
          <b>We, academics</b>, built a unique streaming technology{" "}
          <b>sculpted for academics</b>. The latter allows you to run online
          seminars where you can write LateX in chat, go back in the slides as
          an attendee, clap for the speaker and much more!
        </Text>

        <PricingPlans
          callback={() => {}}
          channelId={null}
          userId={null}
          disabled={true}
          showDemo={false}
          headerTitle={true}
          title={" "}
          isMobile={this.state.isMobile}
        />
      </>
    );
  }

  callToActionEndpage() {
    return (
      <>
        <Text
          size="34px"
          margin={{ bottom: "40px" }}
          color="color1"
          weight="bold"
          alignSelf="center"
          textAlign={this.state.isMobile ? "center" : "start"}
        >
          Make your life easier + attract world-leading experts to your events
          now!
        </Text>
        {/* <Text>If you already have Zoom or gather.town, it will be completely free!</Text> */}
        <Box align="center" margin={{ bottom: "0px" }}>
          <CreateChannelButton
            onClick={this.toggleCreateChannelOverlay}
            width="400px"
            height="90px"
            text={"Publish your seminars"}
            textSize="18px"
          />
        </Box>

        {/*<Box align="center" justify="center">
            <Text size="34px" margin={{bottom: "80px"}} color="color1" weight="bold" alignSelf="center">
              Already running a series? Import everything in 3 clicks!
            </Text>
            <TransportSeminars 
              user={this.state.user}
            />
          </Box> */}

        {this.state.showCreateChannelOverlay && (
          <CreateChannelOverlay
            onBackClicked={this.toggleCreateChannelOverlay}
            onComplete={() => {
              this.toggleCreateChannelOverlay();
            }}
            visible={true}
            user={this.state.user}
            windowWidth={this.state.windowWidth}
          />
        )}
      </>
    );
  }

  render() {
    return (
      <Box direction="column" align="center">
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
          style={{ padding: "70px 0" }}
        >
          <Box
            width="80%"
            // height={this.state.renderMobileView ? "2650px" : "940px"}
            direction="column"
            alignSelf="center"
            style={{ maxWidth: "1000px" }}
          >
            {this.content1()}
          </Box>
        </Box>

        <Box
          height="100%"
          width="100%"
          background="color6"
          style={{ padding: "70px 0" }}
        >
          <Box
            width="80%"
            // height={this.state.renderMobileView ? "2250px" : "820px"}
            direction="column"
            alignSelf="center"
          >
            {this.content2()}
          </Box>
        </Box>

        <Box
          height="100%"
          width="100%"
          background="color5"
          style={{ padding: "70px 0" }}
        >
          <Box
            width="80%"
            // height={this.state.renderMobileView ? "1150px" : "790px"}
            direction="column"
            alignSelf="center"
          >
            {this.content3()}
          </Box>
        </Box>

        <Box height="100%" width="100%" style={{ padding: "70px 0" }}>
          <Box width="80%" direction="column" alignSelf="center">
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
