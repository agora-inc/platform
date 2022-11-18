import React, { Component } from "react";
import { Link, Route, RouteComponentProps } from "react-router-dom";
import { Box, Text, Heading, Layer } from "grommet";
import moraStreamFullLogo from "../../assets/general/mora.stream_logo_v3.svg";
import cassyniFullLogo from "../../assets/general/cassyni-crop.png";
import moraStreamFullLettersLogo from "../../assets/general/mora.stream_logo_v2.1.png";
import agoraLogo from "../../assets/general/agora_logo_v2.1.svg";
import { User, UserService } from "../../Services/UserService";
import { Twitter, Slack, Play, Add, Chat, Close, Connect, Announce, Multiple, Group, Workshop, Trigger, MailOption, DocumentPerformance, Deploy, Attraction, CirclePlay, Like} from "grommet-icons";
import UserManager from "../../Components/Account/UserManager";
import FooterComponent from "../../Components/Homepage/FooterComponent";
import "../../Styles/landing-page.css";

import InstitutionalUsers from "./InstitutionalUsers";


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

export default class CassyniLandingPage extends Component<RouteComponentProps, State> {
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

  aboveTheFoldMain() {
    return (
      <>
        <Box>
          <Text size={this.state.renderMobileView ? "36px" : "48px"} weight="bold" color="color1" margin={this.state.renderMobileView ? {top: "80px", bottom: "40px"} : {top: "120px", bottom: "50px"}}>
          Mora.stream is joining forces with <a href="https://cassyni.com">Cassyni!</a> 
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
          }
          gap="30px"
          align="center"
        >
          <img src={moraStreamFullLogo} style={{maxWidth: "350px"}}/>
          <img src={cassyniFullLogo} style={{maxWidth: "450px"}}/>
        </Box>
      </>
    )
}

contentTrigger() {
  return (
    <Text 
      size={this.state.titleSize} 
      color="black" 
      margin={this.state.renderMobileView ? {top: "80px", bottom: "80px"} : {top: "140px", bottom: "140px"}}
    >
      Seminars are <u>essential</u> in spreading new ideas, and today their reach is <u>bigger than ever</u>. 

    </Text>
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
        <Box>
          <a href="https://cassyni.com/mora?utm_source=mora&utm_medium=cta&utm_campaign=welcome&ref=mora">
            <Box
              background="#0C385B"
              hoverIndicator="#BAD6DB"
              focusIndicator={false}
              align="center"
              justify="center"
              width="250px"
              height="70px"
              round="xsmall"
              direction="row"
            >
              <Group size="medium" style={{marginRight: "10px"}}/>
              <Text size="18px" weight="bold"> Get started </Text>
            </Box>
          </a>
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

        <Box width={window.innerWidth > 800 ? "80%" : "90%"} align="center">
          <FooterComponent />
        </Box>

      </Box>
    );
  }
}