import React, { Component, useEffect, useState } from "react";
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
import CreateChannelButton from "../../Components/Channel/CreateChannelButton";
import { CreateChannelOverlay } from "../../Components/Channel/CreateChannelButton/CreateChannelOverlay";
import ZoomLogo from "../../assets/competitors_logo/427px-Zoom_Communications_Logo.png";
import YoutubeLogo from "../../assets/competitors_logo/YouTube_Logo_2017.svg.png";
import InstitutionalUsers from "./InstitutionalUsers";
import SeminarImage from "../../assets/general/academic_seminars_photo.jpeg";
import PricingPlans from "../../Views/PricingPlans";
import DashedLine from "../../assets/landing_page/dashed-line.png";
import { useStore } from "../../store";
import { useAuth0 } from "@auth0/auth0-react";

export const OrganiserLandingPage = () => {
  const [renderMobileView, setRenderMobileView] = useState(
    window.innerWidth < 1200
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
  };

  const aboveTheFoldMain = () => {
    return (
      <>
        <Box direction="column">
          <Text
            size="48px"
            weight="bold"
            color="color4"
            margin={
              renderMobileView
                ? { top: "80px", bottom: "40px" }
                : { top: "120px", bottom: "50px" }
            }
          >
            Organising seminars made easy, from start to finish
          </Text>
          {!renderMobileView && (
            <Box margin={{ bottom: "50px" }}>
              <CreateChannelButton
                onClick={toggleCreateChannelOverlay}
                width="400px"
                height="90px"
                text={"Publish your seminars"}
                textSize="18px"
              />
            </Box>
          )}
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
              ? { width: "90%", alignSelf: "center" }
              : { width: "90%", marginTop: "120px", alignSelf: "center" }
          }
        >
          <img src={SeminarImage} width="100%" height="auto" />
        </Box>
      </>
    );
  };

  const callToActions = () => {
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
            onClick={toggleModal}
            background={colorButton}
            round="xsmall"
            pad="xsmall"
            height="80px"
            width="300px"
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
            onClick={toggleModal}
            background={colorButton}
            round="xsmall"
            pad="xsmall"
            height="80px"
            width="300px"
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
              <b>Launch</b> your seminars
            </Text>
          </Box>
        </Link>
      </Box>
    );
  };

  const brandCurrentOrganisation = () => {
    return <Box>sdf</Box>;
  };

  const content1 = () => {
    return (
      <>
        <Text
          size="34px"
          margin={{ top: "120px", bottom: "80px" }}
          color="black"
        >
          Everything seminar organisers need, all in one place
        </Text>
        {/* First line */}
        <Box
          width="100%"
          direction={!renderMobileView ? "row" : "column"}
          gap="30px"
          margin={{ bottom: "50px" }}
        >
          <Box
            width="380px"
            height={renderMobileView ? "340px" : "300px"}
            background="color2"
            pad="medium"
            direction="column"
            gap="10px"
            hoverIndicator={colorHover}
          >
            <Box
              direction="row"
              margin={{ bottom: "25px" }}
              height="25%"
              width="100%"
            >
              <Box width="70px">
                <Attraction size="large" />
              </Box>
              {renderMobileView && (
                <Text
                  size="24px"
                  weight="bold"
                  margin={{ left: "8px" }}
                  color="color7"
                >
                  1. Create your agora
                </Text>
              )}
              {!renderMobileView && (
                <CreateChannelButton
                  textColor="color7"
                  text="1. Create your agora"
                  textSize="20px"
                  onClick={toggleCreateChannelOverlay}
                />
              )}
            </Box>
            <Text size="18px">
              Your agora, or community homepage, will be the center of your
              organisational life. It will also be the place where your
              community will periodically come back to check out your next
              events!
            </Text>
          </Box>

          {!renderMobileView && (
            <Box width="120px" direction="column" alignSelf="center">
              <img
                src={DashedLine}
                style={{ alignSelf: "center" }}
                width="120px"
              />
            </Box>
          )}

          <Box
            width="380px"
            height={renderMobileView ? "340px" : "300px"}
            background="color2"
            pad="medium"
            direction="column"
          >
            <Box
              direction="row"
              margin={{ bottom: "25px" }}
              height="25%"
              width="100%"
            >
              <Box width="70px">
                <Workshop size="large" />
              </Box>
              <Text
                size="24px"
                weight="bold"
                margin={{ left: "8px" }}
                color="color7"
              >
                2. Find a speaker
              </Text>
            </Box>

            <Text size="18px">
              Finding speakers can sometimes be very tedious. On mora.stream,
              speakers directly come to you by filling an in-built application
              form!
            </Text>
          </Box>

          {!renderMobileView && (
            <Box width="120px" direction="column" alignSelf="center">
              <img
                src={DashedLine}
                style={{ alignSelf: "center" }}
                width="120px"
              />
            </Box>
          )}

          <Box
            width="380px"
            height={renderMobileView ? "340px" : "300px"}
            background="color2"
            pad="medium"
            direction="column"
            gap="10px"
          >
            <Box
              direction="row"
              margin={{ bottom: "25px" }}
              height="25%"
              width="100%"
            >
              <Box width="70px">
                <Share size="large" />
              </Box>
              <Text
                size="24px"
                weight="bold"
                margin={{ left: "8px" }}
                color="color7"
              >
                3. Publish in a minute
              </Text>
            </Box>
            <Text size="18px">
              We made organising seminars is made <b>as easy as possible</b>.
              Three clicks are enough to automate the sending of reminder
              emails, automatically accept verified academics, and share your
              event on all your social media!
            </Text>
          </Box>
        </Box>

        {/* Second line */}
        <Box
          width="100%"
          direction={!renderMobileView ? "row" : "column"}
          gap="30px"
        >
          <Box
            width="380px"
            height={renderMobileView ? "340px" : "300px"}
            background="color2"
            pad="medium"
            direction="column"
            gap="10px"
            hoverIndicator={colorHover}
          >
            <Box
              direction="row"
              margin={{ bottom: "25px" }}
              height="25%"
              width="100%"
            >
              <Box width="70px">
                <Video size="large" />
              </Box>
              <Text
                size="24px"
                weight="bold"
                margin={{ left: "15px" }}
                color="color7"
              >
                4. Stream
                {/* with <img src={ZoomLogo} height="14px"/> or <img src={moraStreamFullLettersLogo} height="18px"/> */}
              </Text>
            </Box>
            <Text size="18px">
              You can use your <img src={ZoomLogo} height="14px" /> subscription
              OR the <img src={moraStreamFullLettersLogo} height="16px" />{" "}
              streaming tech. The latter allows you to run hybrid seminars,
              write LateX in chat, go back in the slides, clap for the speaker
              and much more!
            </Text>
          </Box>

          {!renderMobileView && (
            <Box width="120px" direction="column" alignSelf="center">
              <img
                src={DashedLine}
                style={{ alignSelf: "center" }}
                width="120px"
              />
            </Box>
          )}

          <Box
            width="380px"
            height={renderMobileView ? "340px" : "300px"}
            background="color2"
            pad="medium"
            direction="column"
          >
            <Box
              direction="row"
              margin={{ bottom: "25px" }}
              height="25%"
              width="100%"
            >
              <Box width="70px">
                <Group size="large" />
              </Box>
              <Text
                size="24px"
                weight="bold"
                margin={{ left: "8px" }}
                color="color7"
              >
                5. Network
              </Text>
            </Box>

            <Text size="18px">
              Enjoy the free access to a 2D-virtual cafeteria after each
              seminars and allow your audience to mingle among themselves and
              meet with the speakers.
            </Text>
          </Box>

          {!renderMobileView && (
            <Box width="120px" direction="column" alignSelf="center">
              <img
                src={DashedLine}
                style={{ alignSelf: "center" }}
                width="120px"
              />
            </Box>
          )}

          <Box
            width="380px"
            height={renderMobileView ? "340px" : "300px"}
            background="color2"
            pad="medium"
            direction="column"
            gap="10px"
          >
            <Box
              direction="row"
              margin={{ bottom: "25px" }}
              height="25%"
              width="100%"
            >
              <Box width="70px">
                <Play size="large" />
              </Box>
              <Text
                size="24px"
                weight="bold"
                margin={{ left: "8px" }}
                color="color7"
              >
                6. Upload slides and recordings
              </Text>
            </Box>
            <Text size="18px">
              Please your community by supplementing your event with your mp4
              recording, your <img src={YoutubeLogo} height="16px" /> URL as
              well as your speaker's slides in just a couple clicks!
            </Text>
          </Box>
        </Box>
      </>
    );
  };

  const content2 = () => {
    return (
      <>
        <Box direction="row" margin={{ top: "120px", bottom: "50px" }}>
          <Text size="34px" color="black">
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

        <Box
          width="100%"
          direction={!renderMobileView ? "row" : "column"}
          gap="30px"
        >
          <Box
            width="350px"
            height={renderMobileView ? "430px" : "450px"}
            background="color2"
            direction="column"
            justify="between"
          >
            <Box height="250px" pad="medium" gap="10px">
              <Box direction="row" height="60px" width="100%">
                <Box height="100px">
                  <Text
                    size="24px"
                    weight="bold"
                    margin={{ left: "5px" }}
                    color="color7"
                  >
                    A free customizable homepage
                  </Text>
                </Box>
              </Box>
              <Box height="150px">
                <Text size="18px" style={{ alignContent: "start" }}>
                  A customizable homepage were academics can contact you,
                  register to your future events and consult your past events'
                  recordings and slides!
                </Text>
              </Box>
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
                <source
                  src="/videos/customize_agora_page.mp4"
                  type="video/mp4"
                />
              </video>
            </Box>
          </Box>

          <Box
            width="350px"
            height={renderMobileView ? "430px" : "450px"}
            background="color2"
            direction="column"
            justify="between"
          >
            <Box height="250px" pad="medium" gap="10px">
              <Box direction="row" height="100px" width="100%">
                <Text
                  size="24px"
                  weight="bold"
                  margin={{ left: "5px" }}
                  color="color7"
                >
                  A built-in speaker application form
                </Text>
              </Box>
              <Box height="150px">
                <Text size="18px" style={{ alignContent: "start" }}>
                  Speakers directly come to you by filling an in-built
                  application form (this can be disabled). If it's a match,
                  invite them to speak!
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
                <source src="/videos/talk_application.mp4" type="video/mp4" />
              </video>
            </Box>
          </Box>

          <Box
            width="350px"
            height={renderMobileView ? "430px" : "450px"}
            background="color2"
            direction="column"
            justify="between"
          >
            <Box height="250px" pad="medium" gap="10px">
              <Box direction="row" height="100px" width="100%">
                <Box height="170px">
                  <Text
                    size="24px"
                    weight="bold"
                    margin={{ left: "5px" }}
                    color="color7"
                  >
                    Free event scheduling tools
                  </Text>
                </Box>
              </Box>
              <Box height="150px">
                <Text size="18px" style={{ marginTop: "-10px" }}>
                  <ul>
                    <li>Email reminders</li>
                    <li>
                      Automatically accept verified academic email addresses
                    </li>
                    <li>Write LateX in description</li>
                    <li>And many more...!</li>
                  </ul>
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
                <source src="/videos/schedule_talk.mp4" type="video/mp4" />
              </video>
            </Box>
          </Box>

          <Box
            width="350px"
            height={renderMobileView ? "430px" : "450px"}
            background="color2"
            direction="column"
            justify="between"
          >
            <Box height="250px" pad="medium" gap="10px">
              <Box direction="row" height="100px" width="100%">
                <Text
                  size="24px"
                  weight="bold"
                  margin={{ left: "5px" }}
                  color="color7"
                >
                  A free post-seminar cafeteria
                </Text>
              </Box>
              <Box height="150px">
                <Text size="18px" style={{ alignContent: "start" }}>
                  Grab an e-coffee in a 2D world and meet with speakers and
                  audience. Many collaborations started around a coffee
                  (mora.stream included)!
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
                  src="/videos/cafeteria-agora-minidemo.mp4"
                  type="video/mp4"
                />
              </video>
            </Box>
          </Box>
        </Box>
      </>
    );
  };

  const content3 = () => {
    return (
      <>
        {/* <Text size="34px" margin={{top: "120px", bottom: "80px"}} color="black">The future of seminars is <b>online and hybrid</b></Text> */}
        <Text
          size="34px"
          margin={{ top: "120px", bottom: "80px" }}
          color="black"
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
          disabled={true}
          showDemo={false}
          headerTitle={true}
          title={" "}
        />
      </>
    );
  };

  const callToActionEndpage = () => {
    return (
      <>
        {!renderMobileView && (
          <>
            <Text
              size="34px"
              margin={{ top: "80px", bottom: "80px" }}
              color="color1"
              weight="bold"
              alignSelf="center"
            >
              Make your life easier + attract world-leading experts to your
              events now!
            </Text>
            {/* <Text>If you already have Zoom or gather.town, it will be completely free!</Text> */}
            <Box align="center" margin={{ bottom: "100px" }}>
              <CreateChannelButton
                onClick={toggleCreateChannelOverlay}
                width="400px"
                height="90px"
                text={"Publish your seminars"}
                textSize="18px"
              />
            </Box>

            {/*
            
            
            <Box align="center" justify="center">
              <Text size="34px" margin={{bottom: "80px"}} color="color1" weight="bold" alignSelf="center">
                Already running a series? Import everything in 3 clicks!
              </Text>
              <TransportSeminars 
                user={user}
              />
            </Box> */}
          </>
        )}
        {renderMobileView && (
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

      <Box height="100%" width="100%">
        <Box
          width="80%"
          height={renderMobileView ? "1080px" : "700px"}
          direction={renderMobileView ? "column" : "row"}
          alignSelf="center"
        >
          <Box
            width={renderMobileView ? "100%" : "50%"}
            height={renderMobileView ? "750px" : "100%"}
            style={renderMobileView ? {} : { minWidth: "780px" }}
          >
            {aboveTheFoldMain()}
          </Box>
          <Box
            width={renderMobileView ? "100%" : "50%"}
            height={renderMobileView ? "100px" : "100%"}
          >
            {aboveTheFoldImage()}
          </Box>
        </Box>
      </Box>

      <Box height="100%" width="100%" background="color5" id="content">
        <Box
          width="80%"
          height={renderMobileView ? "2650px" : "940px"}
          direction="column"
          alignSelf="center"
        >
          {content1()}
        </Box>
      </Box>

      <Box height="100%" width="100%" background="color6">
        <Box
          width="80%"
          height={renderMobileView ? "2250px" : "820px"}
          direction="column"
          alignSelf="center"
        >
          {content2()}
        </Box>
      </Box>

      <Box height="100%" width="100%" background="color5" style={{}}>
        <Box
          width="80%"
          height={renderMobileView ? "1150px" : "790px"}
          direction="column"
          alignSelf="center"
        >
          {content3()}
        </Box>
      </Box>

      <Box height="100%" width="100%">
        <Box
          width="80%"
          height={renderMobileView ? "300px" : "500px"}
          direction="column"
          alignSelf="center"
        >
          {callToActionEndpage()}
        </Box>
      </Box>

      <Box width={window.innerWidth > 800 ? "80%" : "90%"} align="center">
        <FooterComponent />
      </Box>
    </Box>
  );
};
