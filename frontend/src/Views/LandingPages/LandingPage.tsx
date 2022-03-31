import React, { useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Box, Text, Heading, Layer } from "grommet";
import {
  Twitter,
  Slack,
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
import { useAuth0 } from "@auth0/auth0-react";

import { useStore } from "../../store";
import moraStreamFullLettersLogo from "../../assets/general/mora.stream_logo_v2.1.png";
import { User, UserService } from "../../Services/UserService";
import { UserManager } from "../../Components/Account/UserManager";
import FooterComponent from "../../Components/Homepage/FooterComponent";
import { CreatePresentationButton } from "../../Components/Homepage/CreatePresentationButton";
import { CreateChannelOverlay } from "../../Components/Channel/CreateChannelButton/CreateChannelOverlay";
import InstitutionalUsers from "./InstitutionalUsers";
import SignUpButton from "../../Components/Account/SignUpButton";
import moraStreamFullLogo from "../../assets/general/mora.stream_logo_v3.svg";
import agoraLogo from "../../assets/general/agora_logo_v2.1.svg";
import WavyArrowLeftRight from "../../assets/landing_page/wavy_arrow_left_right.png";
import WavyArrowTopBot from "../../assets/landing_page/wavy_arrow_top_bot.png";
import ThreeSidedMarketplaceGraph from "../../assets/landing_page/3_sided_marketplace_graph.jpeg";
import noInviteImage from "../../assets/landing_page/old_vs_new_way/no_invites.png";
import boredImg from "../../assets/landing_page/old_vs_new_way/bored_on_bench.jpg";
import applauseImg from "../../assets/landing_page/old_vs_new_way/applause_img.png";
import seminarResultGif from "../../assets/landing_page/old_vs_new_way/seminar_result.gif";
import localCommunityImg from "../../assets/landing_page/old_vs_new_way/house_local.png";
import worldspinningGif from "../../assets/landing_page/old_vs_new_way/world_spinning.gif";
import heroResultGif from "../../assets/landing_page/old_vs_new_way/g_scholar_hero_lance.gif";
import invitationReceivedGif from "../../assets/landing_page/old_vs_new_way/email_received_animation.gif";
import "../../Styles/landing-page.css";

export const LandingPage = () => {
  const [renderMobileView, setRenderMobileView] = useState(
    window.innerWidth < 1200
  );
  const [titleSize, setTitleSize] = useState(
    window.innerWidth < 1000 ? "26px" : "34px"
  );
  const [showLogin, setShowLogin] = useState(
    new URL(window.location.href).searchParams.get("showLogin") === "true"
  );
  const [colorButton, setColorButton] = useState("color1");
  const [colorHover, setColorHover] = useState("color5");
  const [showModalGiveATalk, setShowModalGiveATalk] = useState(false);
  const [showCreateChannelOverlay, setShowCreateChannelOverlay] =
    useState(false);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setShowLogin(
      new URL(window.location.href).searchParams.get("showLogin") === "true"
    );
  }, [window.location.href]);

  const toggleCreateChannelOverlay = () => {
    setShowCreateChannelOverlay(!showCreateChannelOverlay);
  };

  const toggleModal = () => {
    setShowModalGiveATalk(!showModalGiveATalk);
  };

  const giveATalkOverlay = () => {
    return (
      <Layer
        onEsc={() => {
          toggleModal();
        }}
        onClickOutside={() => {
          toggleModal();
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
              <Close onClick={toggleModal} />
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
  };

  const callToActions = () => {
    return (
      <Box
        direction={renderMobileView ? "column" : "row"}
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
            onClick={toggleModal}
            background={colorButton}
            round="xsmall"
            pad="xsmall"
            height="80px"
            width="310px"
            justify="center"
            align="center"
            focusIndicator={false}
            hoverIndicator={colorHover}
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
          onClick={toggleModal}
          background={colorButton}
          round="xsmall"
          pad="xsmall"
          height="80px"
          width="310px"
          justify="center"
          align="center"
          focusIndicator={false}
          hoverIndicator={colorHover}
          margin={{ left: "0px" }}
          direction="row"
        >
          <Group size="30px" />
          <Text size="18px" margin={{left: "10px"}}> <b>Organise</b>  your seminars</Text>
        </Box>
      </Link> */}
      </Box>
    );
  };

  const aboveTheFoldMain = () => {
    return (
      <>
        <Box>
          <Text
            size="48px"
            weight="bold"
            color="color1"
            margin={
              renderMobileView
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
              renderMobileView
                ? { top: "30px", bottom: "30px" }
                : { top: "0px" }
            }
            height="40%"
          >
            {callToActions()}
          </Box>
          <InstitutionalUsers />
        </Box>
      </>
    );
  };

  const aboveTheFoldImage = () => {
    return (
      <>
        <Box
          direction="column"
          style={
            renderMobileView
              ? { width: "90%", alignSelf: "center", marginTop: "20px" }
              : { width: "90%", marginTop: "120px", alignSelf: "center" }
          }
        >
          <img src={moraStreamFullLogo} style={{ maxWidth: "600px" }} />
        </Box>
      </>
    );
  };

  const content1 = () => {
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
          direction={!renderMobileView ? "row" : "column"}
          gap="30px"
        >
          <Box
            width="350px"
            height={renderMobileView ? "370px" : "430px"}
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
                    Post
                  </Text>
                </Box>
              </Box>
              <Text size="18px" style={{ alignContent: "start" }}>
                Go to your profile and post a description of your future talk.
                Seminar organisers from everywhere will read it for 30 days!
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
              src={renderMobileView ? WavyArrowTopBot : WavyArrowLeftRight}
              style={
                renderMobileView
                  ? { alignSelf: "center", height: "70px" }
                  : { alignSelf: "center", width: "120px" }
              }
            />
          </Box>

          <Box
            width="350px"
            height={renderMobileView ? "370px" : "430px"}
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
                    Get invited
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
              src={renderMobileView ? WavyArrowTopBot : WavyArrowLeftRight}
              style={
                renderMobileView
                  ? { alignSelf: "center", height: "70px" }
                  : { alignSelf: "center", width: "120px" }
              }
            />
          </Box>

          <Box
            width="350px"
            height={renderMobileView ? "370px" : "430px"}
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
                  Speak and mingle
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
  };

  const contentTrigger = () => {
    return (
      <>
        <Text
          size={titleSize}
          color="black"
          margin={
            renderMobileView
              ? { top: "80px", bottom: "80px" }
              : { top: "140px", bottom: "140px" }
          }
        >
          {/* Seminars are a <u>key component</u> of your research, but they still operate in the <u>20th century</u>. */}
          {/* Seminars are <u>essential</u> to every researchers, but nobody has leveraged <u>20th century</u>. */}
          Seminars are <u>essential</u> in spreading new ideas, and today their
          reach is <u>bigger than ever</u>.
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
        <Box width="100%" direction={!renderMobileView ? "row" : "column" } gap="30px">
          <Box>
            Martin Hairer, Field Medalist, Imperial College London
            </Box>
          <Box background="white" height="150px">
            <Text size={secondSize}>"Seminars are key to the growth of researchers."</Text>
            </Box>
        </Box> 
        */}
      </>
    );
  };

  const contentHeroHow = () => {
    var sizeText: string = renderMobileView ? "14px" : "18px";
    var sizeSmallText: string =
      window.innerWidth > 1000
        ? "18px"
        : window.innerWidth > 600
        ? "14px"
        : "9px";
    var widthImage: string = renderMobileView
      ? window.innerWidth * 0.32 + "px"
      : "200px";
    var widthText: string = renderMobileView
      ? window.innerWidth * 0.48 + "px"
      : "300px";
    var heightBox: string = renderMobileView
      ? window.innerWidth * 0.32 + "px"
      : "200px";

    return (
      <Box width="100%" style={{ maxWidth: "2000px" }}>
        <Text
          size={titleSize}
          margin={
            renderMobileView
              ? { top: "80px", bottom: "60px" }
              : { top: "120px", bottom: "80px" }
          }
          color="white"
        >
          The{" "}
          <Text color="#C0C0C0" size={titleSize}>
            <del>old</del>
          </Text>
          <Text color="color7" size={titleSize}>
            new
          </Text>{" "}
          way of giving seminars
        </Text>

        <Box alignContent="center" alignSelf="center">
          <Box
            width="100%"
            direction={renderMobileView ? "column" : "row"}
            margin={{ bottom: "35px" }}
            justify="start"
          >
            <Box
              direction="row"
              margin={{ bottom: renderMobileView ? "30px" : "0px" }}
            >
              <Box
                width={widthImage}
                height={heightBox}
                background="white"
                alignContent="center"
                direction="column"
                pad="small"
              >
                {/* <img src={noInviteImage}/> */}
                <img src={boredImg} />
              </Box>

              <Box
                width={widthText}
                height={heightBox}
                background="color2"
                direction="column"
                justify="center"
                pad="medium"
                margin={{ right: renderMobileView ? "0px" : "15px" }}
              >
                <Text
                  size={sizeText}
                  style={{ alignContent: "start" }}
                  color="#C0C0C0"
                >
                  Do nothing and wait for months / years to <i>maybe</i> get
                  invited.
                </Text>
              </Box>
            </Box>
            <Box direction="row">
              <Box
                width={widthText}
                height={heightBox}
                background="color2"
                direction="column"
                justify="center"
                pad="medium"
                margin={{ left: renderMobileView ? "0px" : "15px" }}
              >
                <Text
                  size={sizeText}
                  style={{ alignContent: "start" }}
                  color="color7"
                >
                  Apply and receive multiple invitations within 30 days
                </Text>
              </Box>
              <Box width={widthImage} height={heightBox} background="color6">
                <img src={invitationReceivedGif} />
              </Box>
            </Box>
          </Box>

          <Box height="60px" direction="column" align="center" width="1030px">
            <img
              src={WavyArrowTopBot}
              style={{ alignSelf: "center", height: "70px" }}
            />
          </Box>

          <Box
            width="100%"
            direction={renderMobileView ? "column" : "row"}
            margin={{ top: "35px", bottom: "35px" }}
            justify="start"
          >
            <Box
              direction="row"
              margin={{ bottom: renderMobileView ? "30px" : "0px" }}
            >
              <Box
                width={widthImage}
                height={heightBox}
                background="color6"
                pad="small"
              >
                <img src={localCommunityImg} />
              </Box>
              <Box
                width={widthText}
                height={heightBox}
                background="color2"
                direction="column"
                justify="center"
                pad="medium"
                margin={{ right: renderMobileView ? "0px" : "15px" }}
              >
                <Text
                  size={sizeText}
                  style={{ alignContent: "start" }}
                  color="#C0C0C0"
                >
                  Speak <u>once</u> to a local physical audience of{" "}
                  <u>10 people</u>
                </Text>
              </Box>
            </Box>

            <Box direction="row">
              <Box
                width={widthText}
                height={heightBox}
                background="color2"
                direction="column"
                justify="center"
                pad="medium"
                margin={{ left: renderMobileView ? "0px" : "15px" }}
              >
                <Text
                  size={sizeText}
                  style={{ alignContent: "start" }}
                  color="color7"
                >
                  Spend <u>multiple times</u> to a cumulative international
                  online/hybrid audience of <u>1000 people</u>.
                </Text>
              </Box>
              <Box width={widthImage} height={heightBox} background="color6">
                <img
                  src={worldspinningGif}
                  style={{ maxHeight: "200px", maxWidth: "200px" }}
                />
              </Box>
            </Box>
          </Box>

          <Box height="60px" direction="column" align="center" width="1030px">
            <img
              src={WavyArrowTopBot}
              style={{ alignSelf: "center", height: "70px" }}
            />
          </Box>

          <Box
            width="100%"
            direction={!renderMobileView ? "row" : "column"}
            margin={{ top: "35px", bottom: "35px" }}
            justify="start"
          >
            <Box
              direction="row"
              margin={{ bottom: renderMobileView ? "30px" : "0px" }}
            >
              <Box width={widthImage} height={heightBox} background="color6">
                <img
                  src={applauseImg}
                  style={{ maxHeight: "200px", maxWidth: "200px" }}
                />
              </Box>

              <Box
                width={widthText}
                height={heightBox}
                background="color2"
                direction="column"
                justify="center"
                pad="medium"
                margin={{ right: renderMobileView ? "0px" : "15px" }}
              >
                <Text
                  size={sizeSmallText}
                  style={{ alignContent: "start" }}
                  color="#C0C0C0"
                >
                  • +10 reads of your article
                </Text>
                <Text
                  size={sizeSmallText}
                  style={{ alignContent: "start" }}
                  color="#C0C0C0"
                >
                  • +1 potential citation
                </Text>
                <Text
                  size={sizeSmallText}
                  style={{ alignContent: "start" }}
                  color="#C0C0C0"
                >
                  • +2 Twitter followers
                </Text>
                <Text
                  size={sizeSmallText}
                  style={{ alignContent: "start" }}
                  color="#C0C0C0"
                >
                  • +2 new collaborators
                </Text>
              </Box>
            </Box>
            <Box direction="row">
              <Box
                width={widthText}
                height={heightBox}
                background="color2"
                direction="column"
                justify="center"
                pad="medium"
                margin={{ left: renderMobileView ? "0px" : "15px" }}
              >
                <Text
                  size={sizeSmallText}
                  style={{ alignContent: "start", marginLeft: "-25px" }}
                  color="color7"
                >
                  <ul>
                    <li> +1000 reads of your article</li>
                    <li> +100 potential citations</li>
                    <li> +200 Twitter followers</li>
                    <li> +200 new collaborators</li>
                  </ul>
                </Text>
              </Box>
              <Box width={widthImage} height={heightBox} background="color6">
                <img src={heroResultGif} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const contentHowDoesItWork = () => {
    return (
      <Box width="100%" style={{ maxWidth: "2000px" }}>
        <Text
          size={titleSize}
          margin={
            renderMobileView
              ? { top: "80px", bottom: "60px" }
              : { top: "120px", bottom: "80px" }
          }
          color="black"
        >
          How does it work?
        </Text>
        <Box
          direction={!renderMobileView ? "row" : "column"}
          gap="30px"
          alignSelf="center"
        >
          <Box
            width="350px"
            height={renderMobileView ? "370px" : "430px"}
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
                    Post
                  </Text>
                </Box>
              </Box>
              <Text size="18px" style={{ alignContent: "start" }}>
                Go to your profile and post a description of your future talk.
                Seminar organisers from everywhere will read it for 30 days!
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
              src={renderMobileView ? WavyArrowTopBot : WavyArrowLeftRight}
              style={
                renderMobileView
                  ? { alignSelf: "center", height: "70px" }
                  : { alignSelf: "center", width: "120px" }
              }
            />
          </Box>

          <Box
            width="350px"
            height={renderMobileView ? "370px" : "430px"}
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
                    Get invited
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
              src={renderMobileView ? WavyArrowTopBot : WavyArrowLeftRight}
              style={
                renderMobileView
                  ? { alignSelf: "center", height: "70px" }
                  : { alignSelf: "center", width: "120px" }
              }
            />
          </Box>

          <Box
            width="350px"
            height={renderMobileView ? "370px" : "430px"}
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
                  Speak and mingle
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
      </Box>
    );
  };

  const contentAcceleratingMatching = () => {
    return (
      <Box width="100%" style={{ maxWidth: "2000px" }}>
        <Text
          size={titleSize}
          margin={{ top: "120px", bottom: "20px" }}
          color="white"
        >
          An evergrowing{" "}
          <Text size="38px" color="color7" weight="bold">
            virtuous circle
          </Text>{" "}
          for researchers
        </Text>

        {!renderMobileView && (
          <img
            src={ThreeSidedMarketplaceGraph}
            height="40%"
            width="auto"
            style={{ alignSelf: "center" }}
          />
        )}

        <Box
          width="100%"
          direction={!renderMobileView ? "row" : "column"}
          gap="30px"
          justify="center"
          margin={{ top: "40px" }}
        >
          <Box
            width="420px"
            height={renderMobileView ? "250px" : "320px"}
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
              The speaker-community matching is now super easy! Future speakers
              provide all necessary information when they post their
              announcement and organisers can easily connect with them.
            </Text>
          </Box>

          <Box
            width="420px"
            height={renderMobileView ? "250px" : "320px"}
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
            height={renderMobileView ? "250px" : "320px"}
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
      </Box>
    );
  };

  const callToActionEndpage = () => {
    return (
      <>
        {!renderMobileView && (
          <>
            <Box width="100%" style={{ maxWidth: "2000px" }}>
              <Text
                size={titleSize}
                margin={{ top: "80px", bottom: "40px" }}
                color="color1"
                weight="bold"
                alignSelf="center"
              >
                What are you waiting for? Let the world know about your work!
              </Text>
              <Text size="24px" color="color1" alignSelf="center">
                Join a leading community of researchers and seminar organisers
              </Text>
              <Box align="center" margin={{ bottom: "90px", top: "40px" }}>
                <SignUpButton
                  callback={() => {}}
                  height="80px"
                  width="200px"
                  textSize="18px"
                  icon={true}
                  text="Join your peers"
                />
              </Box>
              <Box
                alignSelf="center"
                margin={renderMobileView ? { top: "30px" } : {}}
              >
                <InstitutionalUsers />
              </Box>
            </Box>
          </>
        )}
        {renderMobileView && (
          <Text
            size={titleSize}
            margin={{ top: "80px", bottom: "80px" }}
            color="color1"
            weight="bold"
            alignSelf="center"
          >
            Come back with a Desktop browser to get started! 🚀
          </Text>
        )}

        {showCreateChannelOverlay && (
          <CreateChannelOverlay
            onBackClicked={toggleCreateChannelOverlay}
            onComplete={() => {
              toggleCreateChannelOverlay();
            }}
            visible={true}
          />
        )}
      </>
    );
  };

  const contentTestimonial = () => {
    return (
      <>
        {!renderMobileView && (
          <>
            <Box width="100%" style={{ maxWidth: "2000px" }}>
              <Text
                size={titleSize}
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
                margin={renderMobileView ? { top: "30px" } : {}}
              >
                <InstitutionalUsers />
              </Box>
            </Box>
          </>
        )}
        {renderMobileView && (
          <Text
            size={titleSize}
            margin={{ top: "80px", bottom: "80px" }}
            color="color1"
            weight="bold"
            alignSelf="center"
          >
            Come back to this page using a Desktop browser to get started! 🚀
          </Text>
        )}

        {showCreateChannelOverlay && (
          <CreateChannelOverlay
            onBackClicked={toggleCreateChannelOverlay}
            onComplete={() => {
              toggleCreateChannelOverlay();
            }}
            visible={true}
          />
        )}
      </>
    );
  };

  const calltoActionOrganisers = () => {
    return (
      <>
        {!renderMobileView && (
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
                    onClick={toggleModal}
                    background={colorButton}
                    round="xsmall"
                    pad="xsmall"
                    height="80px"
                    width="420px"
                    justify="center"
                    align="center"
                    focusIndicator={false}
                    hoverIndicator={colorHover}
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
  };

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
          height={renderMobileView ? "1300px" : "750px"}
          direction={renderMobileView ? "column" : "row"}
          alignSelf="center"
        >
          <Box
            width={renderMobileView ? "100%" : "60%"}
            height={renderMobileView ? "1250px" : "100%"}
            style={renderMobileView ? {} : { minWidth: "780px" }}
          >
            {aboveTheFoldMain()}
          </Box>
          <Box
            width={renderMobileView ? "100%" : "40%"}
            height={renderMobileView ? "350px" : "100%"}
          >
            {aboveTheFoldImage()}
          </Box>
        </Box>
      </Box>

      <Box height="100%" width="100%" background="color5">
        <Box width="80%" height="350px" direction="column" alignSelf="center">
          {contentTrigger()}
        </Box>
      </Box>

      <Box height="100%" width="100%" background="color3" id="content">
        <Box
          width="80%"
          height={renderMobileView ? "1650px" : "760px"}
          direction="column"
          alignSelf="center"
        >
          {contentHowDoesItWork()}
        </Box>
      </Box>

      <Box height="100%" width="100%" background="color1">
        <Box
          width="80%"
          height={
            renderMobileView ? 600 + window.innerWidth * 2 + "px" : "1200px"
          }
          direction="column"
          alignSelf="center"
        >
          {contentHeroHow()}
        </Box>
      </Box>

      {/* <Box height="100%" width="100%" background="color4">
        <Box width="80%" height={renderMobileView ? "1290px": "1100px"} direction="column" alignSelf="center">
          {contentAcceleratingMatching()}
        </Box>
      </Box> */}

      {/* <Box height="100%" width="100%">
        <Box width="80%" height={renderMobileView ? "450px": "600px"} direction="column" alignSelf="center">
          {contentTestimonial()}
        </Box>
      </Box> */}

      <Box height="100%" width="100%" background="color5">
        <Box
          width="80%"
          height={renderMobileView ? "250px" : "600px"}
          direction="column"
          alignSelf="center"
        >
          {callToActionEndpage()}
        </Box>
      </Box>

      <Box height="100%" width="100%">
        <Box width="80%" height="400px" direction="column" alignSelf="center">
          {calltoActionOrganisers()}
        </Box>
      </Box>

      <Box width={window.innerWidth > 800 ? "80%" : "90%"} align="center">
        <FooterComponent />
      </Box>
    </Box>
  );
};
