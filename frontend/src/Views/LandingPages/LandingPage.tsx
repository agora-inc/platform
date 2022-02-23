import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Box, Text, Layer } from "grommet";

import moraStreamFullLogo from "../../assets/general/mora.stream_logo_v3.svg";
import agoraLogo from "../../assets/general/agora_logo_v2.1.svg";
import { User, UserService } from "../../Services/UserService";
import { Play, Close, Connect, Announce, Multiple, Group } from "grommet-icons";
import FooterComponent from "../../Components/Homepage/FooterComponent";
import "../../Styles/landing-page.css";
import { CreatePresentationButton } from "../../Components/Homepage/CreatePresentationButton";
import CreateChannelOverlay from "../../Components/Channel/CreateChannelButton/CreateChannelOverlay";
import WavyArrowLeftRight from "../../assets/landing_page/wavy_arrow_left_right.png";
import WavyArrowTopBot from "../../assets/landing_page/wavy_arrow_top_bot.png";
import ThreeSidedMarketplaceGraph from "../../assets/landing_page/3_sided_marketplace_graph.jpeg";
import InstitutionalUsers from "./InstitutionalUsers";
import SignUpButton from "../../Components/Account/SignUpButton";

interface State {
  user: User | null;
  showLogin: boolean;
  colorButton: string;
  colorHover: string;
  showModalGiveATalk: boolean;
  renderMobileView: boolean;
  showCreateChannelOverlay: boolean;
}

export default class LandingPage extends Component<RouteComponentProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
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
            size="48px"
            weight="bold"
            color="color1"
            margin={
              this.state.renderMobileView
                ? { top: "80px", bottom: "40px" }
                : { top: "120px", bottom: "50px" }
            }
          >
            Boost your academic career, paper citations, and more. Make a name
            for yourself.
          </Text>
          <Text size="20px">
            <b></b>
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
              this.state.renderMobileView
                ? { top: "30px", bottom: "30px" }
                : { top: "0px" }
            }
            height="40%"
          >
            {this.callToActions()}
          </Box>
          <InstitutionalUsers />
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
            this.state.renderMobileView
              ? { width: "90%", alignSelf: "center", marginTop: "20px" }
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
        direction={this.state.renderMobileView ? "column" : "row"}
        focusIndicator={false}
        margin={{
          top: window.innerWidth > 800 ? "40px" : "20px",
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
            width="310px"
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
              <b>Watch</b> trending seminars
            </Text>
          </Box>
        </Link>

        <CreatePresentationButton />

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
        <Text
          size="34px"
          margin={{ top: "120px", bottom: "80px" }}
          color="black"
        >
          How does this work?
        </Text>
        <Box
          width="100%"
          direction={!this.state.renderMobileView ? "row" : "column"}
          gap="30px"
        >
          <Box
            width="350px"
            height={this.state.renderMobileView ? "370px" : "430px"}
            background="color2"
            direction="column"
            justify="between"
          >
            <Box height="230px" pad="medium" gap="10px">
              <Box direction="row" height="60px" width="100%">
                <Box width="70px">
                  <Announce size="large" />
                </Box>
                <Box height="170px">
                  <Text
                    size="24px"
                    weight="bold"
                    margin={{ left: "5px" }}
                    color="color7"
                  >
                    Post,
                  </Text>
                </Box>
              </Box>
              <Text size="18px" style={{ alignContent: "start" }}>
                Post a brief description of your future talk. Seminar organisers
                from all around the world will read it for 30 days!
              </Text>
            </Box>
            <Box height="200px" alignSelf="center" direction="row">
              <video
                autoPlay
                loop
                muted
                style={{
                  height: "100%",
                  width: "auto",
                  alignSelf: "center",
                  maxWidth: "100%",
                }}
              >
                <source src="/videos/create_pres.mp4" type="video/mp4" />
              </video>
            </Box>
          </Box>

          <Box width="190px" direction="column" alignSelf="center">
            <img
              src={
                this.state.renderMobileView
                  ? WavyArrowTopBot
                  : WavyArrowLeftRight
              }
              style={
                this.state.renderMobileView
                  ? { alignSelf: "center", height: "70px" }
                  : { alignSelf: "center", width: "120px" }
              }
            />
          </Box>

          <Box
            width="350px"
            height={this.state.renderMobileView ? "370px" : "430px"}
            background="color2"
            direction="column"
            justify="between"
          >
            <Box height="230px" pad="medium" gap="10px">
              <Box direction="row" height="60px" width="100%">
                <Box width="70px">
                  <Connect size="large" />
                </Box>
                <Box height="170px">
                  <Text
                    size="24px"
                    weight="bold"
                    margin={{ left: "5px" }}
                    color="color7"
                  >
                    Get invited,
                  </Text>
                </Box>
              </Box>
              <Box height="170px">
                <Text size="18px" style={{ alignContent: "start" }}>
                  {/* Seminars can be run online or hybrid with <img src={ZoomLogo} height="14px"/>, <img src={YoutubeLogo} height="14px"/> or the <img src={moraStreamFullLettersLogo} height="14px"/> streaming tech sculpted for academics! */}
                  During these 30 days, interested seminar organisers will get
                  in touch with you to fix a date!
                </Text>
              </Box>
            </Box>
            <Box height="200px" alignSelf="center" direction="row">
              <video
                autoPlay
                loop
                muted
                style={{ height: "100%", width: "auto", maxWidth: "100%" }}
              >
                <source
                  src="/videos/email_received_animation.mp4"
                  type="video/mp4"
                />
              </video>
            </Box>
          </Box>

          <Box width="190px" direction="column" alignSelf="center">
            <img
              src={
                this.state.renderMobileView
                  ? WavyArrowTopBot
                  : WavyArrowLeftRight
              }
              style={
                this.state.renderMobileView
                  ? { alignSelf: "center", height: "70px" }
                  : { alignSelf: "center", width: "120px" }
              }
            />
          </Box>

          <Box
            width="350px"
            height={this.state.renderMobileView ? "370px" : "430px"}
            background="color2"
            direction="column"
            justify="between"
          >
            <Box height="230px" pad="medium" gap="10px">
              <Box direction="row" height="60px" width="100%">
                <Box width="70px">
                  <Group size="large" />
                </Box>
                <Text
                  size="24px"
                  weight="bold"
                  margin={{ left: "5px" }}
                  color="color7"
                >
                  Speak and mingle!
                </Text>
              </Box>
              <Box height="170px">
                <Text size="18px" style={{ alignContent: "start" }}>
                  Present your work and meet new teammates! Several
                  collaborations started right after a seminar (e.g.
                  mora.stream)!
                </Text>
              </Box>
            </Box>

            <Box height="200px" alignSelf="center" direction="row">
              <video
                autoPlay
                loop
                muted
                style={{ height: "100%", width: "auto", maxWidth: "100%" }}
              >
                <source
                  src="/videos/morastreaming_tech_example.mp4"
                  type="video/mp4"
                />
              </video>
            </Box>
          </Box>
        </Box>
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

        {!this.state.renderMobileView && (
          <img
            src={ThreeSidedMarketplaceGraph}
            height="40%"
            width="auto"
            style={{ alignSelf: "center" }}
          />
        )}

        <Box
          width="100%"
          direction={!this.state.renderMobileView ? "row" : "column"}
          gap="30px"
          justify="center"
          margin={{ top: "40px" }}
        >
          <Box
            width="420px"
            height={this.state.renderMobileView ? "250px" : "320px"}
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
            height={this.state.renderMobileView ? "250px" : "320px"}
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
            height={this.state.renderMobileView ? "250px" : "320px"}
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

  callToActionEndpage() {
    return (
      <>
        {!this.state.renderMobileView && (
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
                margin={this.state.renderMobileView ? { top: "30px" } : {}}
              >
                <InstitutionalUsers />
              </Box>
            </Box>
          </>
        )}
        {this.state.renderMobileView && (
          <Text
            size="34px"
            margin={{ top: "80px", bottom: "80px" }}
            color="color1"
            weight="bold"
            alignSelf="center"
          >
            Come back to this page using a Desktop browser to get started! 🚀
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
    );
  }

  callToActionSocial() {
    return (
      <>
        {!this.state.renderMobileView && (
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
                mora.stream is built around what our community wants. Sign up
                and join the conversation!
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
                margin={this.state.renderMobileView ? { top: "30px" } : {}}
              >
                <InstitutionalUsers />
              </Box>
            </Box>
          </>
        )}
        {this.state.renderMobileView && (
          <Text
            size="34px"
            margin={{ top: "80px", bottom: "80px" }}
            color="color1"
            weight="bold"
            alignSelf="center"
          >
            Come back to this page using a Desktop browser to get started! 🚀
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
    );
  }

  calltoActionOrganisers() {
    return (
      <>
        {!this.state.renderMobileView && (
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
                    width="420px"
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
        )}
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

        <Box height="100%" width="100%">
          <Box
            width="80%"
            height={this.state.renderMobileView ? "1480px" : "750px"}
            direction={this.state.renderMobileView ? "column" : "row"}
            alignSelf="center"
          >
            <Box
              width={this.state.renderMobileView ? "100%" : "60%"}
              height={this.state.renderMobileView ? "1250px" : "100%"}
              style={this.state.renderMobileView ? {} : { minWidth: "780px" }}
            >
              {this.aboveTheFoldMain()}
            </Box>
            <Box
              width={this.state.renderMobileView ? "100%" : "40%"}
              height={this.state.renderMobileView ? "500px" : "100%"}
            >
              {this.aboveTheFoldImage()}
            </Box>
          </Box>
        </Box>

        <Box height="100%" width="100%" background="color5" id="content">
          <Box
            width="80%"
            height={this.state.renderMobileView ? "1750px" : "760px"}
            direction="column"
            alignSelf="center"
          >
            {this.content1()}
          </Box>
        </Box>

        <Box height="100%" width="100%" background="color1">
          <Box
            width="80%"
            height={this.state.renderMobileView ? "1290px" : "1100px"}
            direction="column"
            alignSelf="center"
          >
            {this.content2()}
          </Box>
        </Box>

        <Box height="100%" width="100%">
          <Box
            width="80%"
            height={this.state.renderMobileView ? "450px" : "600px"}
            direction="column"
            alignSelf="center"
          >
            {this.callToActionSocial()}
          </Box>
        </Box>

        {/* <Box height="100%" width="100%" background="color5">
          <Box width="80%" height={this.state.renderMobileView ? "450px": "600px"} direction="column" alignSelf="center">
            {this.callToActionEndpage()}
          </Box>
        </Box> */}

        <Box height="100%" width="100%" background="color5">
          <Box
            width="80%"
            height={this.state.renderMobileView ? "450px" : "400px"}
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
