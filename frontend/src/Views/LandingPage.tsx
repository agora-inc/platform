import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Box, Text, Heading, Layer } from "grommet";
import moraStreamFullLogo from "../assets/general/mora.stream_logo_free_v3.png";
import agoraLogo from "../assets/general/agora_logo_v2.1.svg";
import { User, UserService } from "../Services/UserService";
import { Search, Play, Add, Chat, Close, ShareOption, SearchAdvanced, Multiple, Group, Workshop} from "grommet-icons";
import UserManager from "../Components/Account/UserManager";
import FooterComponent from "../Components/Homepage/FooterComponent";
import "../Styles/landing-page.css";
import MediaQuery from "react-responsive";
import ScrollIntoView from 'react-scroll-into-view'
import TrendingChannelsList from "../Components/Homepage/TrendingChannelsList";
import TrendingTalksList from "../Components/Homepage/TrendingTalksList";
import AgoraCreationPage from "../Views/AgoraCreationPage";
import ReactTooltip from "react-tooltip";

interface State {
  user: User | null
  showLogin: boolean
  colorButton: string
  colorHover: string
  showModalGiveATalk: boolean
  renderMobileView: boolean
}

export default class LandingPage extends Component<RouteComponentProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: UserService.getCurrentUser(),
      showLogin: new URL(window.location.href).searchParams.get("showLogin") === "true",
      colorButton: "#EAF1F1",
      colorHover: "#BAD6DB",
      showModalGiveATalk: false,
      renderMobileView: (window.innerWidth < 1000)
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

  // showDynamicTextValue() {
  //   // Changes every second
  //   var dynamicTextValueList = [
  //     "Opening the doors to all online academic seminars in the world",
  //     "Democratizing access to cutting-edge research",
  //     "Leveraging modern technologies in the service of academics",
  //     "Cutting global travel of academics and fight climate change",
  //     "Empowering academics reach and visibility",
  //     "Automating the seminar organisation pipeline",
  //     "Bridging academic and industrial researchers"
  //   ];

  //   var now = Date.now();
  //   // return dynamicTextValueList[now % dynamicTextValueList.length]
  //   // "Home for cutting-edge online/physical academic seminars"
  //   return ""
  //   // return "Home for sharing, debating, and discovering"
  // }

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
      <Box>
        <Box>
          <Text size="48px" weight="bold" color="color1" margin={{top: "15%", bottom: "20px"}}>
            A platform for a thoughtful audience.
          </Text>
          <Text>
            Attend, give, create virtual or hybrid seminars with academic and tech experts from all over the world before grabbing an e-coffee with them!
          </Text>
        </Box>
        <Box>
          {this.callToActions()}
        </Box>
      </Box>
    )

}

  aboveTheFoldImage() {
    return (
      <>
        {/* Desktop version */}
        <MediaQuery minDeviceWidth={800}>
          <Box direction="row" justify="center" style={{ justifyContent: "center" }}>
            <img src={moraStreamFullLogo} style={{ height: "550px" }} />
          </Box>
        </MediaQuery>

        {/* Mobile version */}
        <MediaQuery maxDeviceWidth={800}>

          <Box direction="row" justify="center" style={{ justifyContent: "center" }} margin={{ top: "50px", bottom: "20px" }}>
            <img src={moraStreamFullLogo} style={{ height: "280px" }} />
          </Box>
        </MediaQuery>
      </>
    )
}


  callToActions() {
    return (
      <Box
      direction="row"
      focusIndicator={false}
      margin={{
        top: (window.innerWidth > 800) ? "80px" : "25px",
        bottom: (window.innerWidth > 800) ? "40px" : "0px"
      }}
      justify="center"
    >

      {/* Desktop version */}
      <MediaQuery minDeviceWidth={800}>

        <Box direction="column" width="56%" >

          <Text size="21px" weight="bold" margin={{ left: "10px", bottom: "30px" }}>
            Audiences
          </Text>
          <Box direction="row" gap="10px">
            <Link
              to={{ pathname: "/browse" }}
              style={{ textDecoration: "none" }}
            >
              <Box
                onClick={() => ({})}
                background={this.state.colorButton}
                round="xsmall"
                pad="xsmall"
                height="120px"
                width="150px"
                justify="center"
                align="center"
                focusIndicator={false}
                hoverIndicator={this.state.colorHover}
                margin={{ left: "10px", right: "20px" }}
              >
                <Search size="30px" />
                <Text size="16px" weight="bold" margin={{ top: "10px" }}> Attend </Text>
                <Text size="16px" margin={{ top: "5px" }}> future seminars </Text>
              </Box>
            </Link>

            <Link
              to={{ pathname: "/past" }}
              style={{ textDecoration: "none" }}
            >
              <Box
                onClick={() => ({})}
                background={this.state.colorButton}
                round="xsmall"
                pad="xsmall"
                height="120px"
                width="150px"
                justify="center"
                align="center"
                focusIndicator={false}
                hoverIndicator={this.state.colorHover}
              >
                <Play size="30px" />
                <Text size="16px" weight="bold" margin={{ top: "10px" }}> Watch</Text>
                <Text size="16px" margin={{ top: "5px" }}> past seminars </Text>
              </Box>
            </Link>
          </Box>
        </Box>

        <div id="vertical-line"> {} </div>

        <Box direction="column" width="24%" alignSelf="center">
          <Text size="21px" weight="bold" margin={{ bottom: "30px" }}>
            Speakers
          </Text>

          {/*<Link
              to={{ pathname: "/agoras" }}
              style={{ textDecoration: "none" }}
          > */}
            <Box
              onClick={this.toggleModal}
              background={this.state.colorButton}
              round="xsmall"
              pad="xsmall"
              height="120px"
              width="150px"
              justify="center"
              align="center"
              focusIndicator={false}
              hoverIndicator={this.state.colorHover}
              margin={{ left: "0px" }}
            >
              <Chat size="30px" />
              <Text size="16px" weight="bold" margin={{ top: "10px" }}> Give </Text>
              <Text size="16px" margin={{ top: "5px" }}> a talk </Text>
            </Box>
          {/* </Link> */}
        </Box>

        {this.state.showModalGiveATalk && (
          this.giveATalkOverlay()
        )}

        <div id="vertical-line"> {} </div>

        <Box direction="column" width="25%" alignSelf="center">
          <Text size="21px" weight="bold" margin={{ bottom: "30px" }}>
            Organisers
          </Text>

          <ReactTooltip id="create-your-events" effect="solid">
            Create your events and share them with the world in less than a minute!
          </ReactTooltip>
            
          <ScrollIntoView selector="#pricing">
            <Box
              onClick={() => ({})}
              background={this.state.colorButton}
              round="xsmall"
              pad="xsmall"
              height="120px"
              width="150px"
              justify="center"
              align="center"
              focusIndicator={false}
              hoverIndicator={this.state.colorHover}
              margin={{ left: "0px" }}
              data-tip data-for="create-your-events"
            >
              <Add size="30px" />
              <Text size="16px" weight="bold" margin={{ top: "10px" }}> Post </Text>
              <Text size="16px" margin={{ top: "5px" }}> your seminars </Text>
            </Box>
          </ScrollIntoView>  
        </Box>

      </MediaQuery>


      {/* Mobile version */}
      <MediaQuery maxDeviceWidth={800}>
        <Box direction="column" width="50%" >
          <Text size="18px" weight="bold" margin={{ left: "10px", bottom: "10px" }}>
            Audiences
          </Text>
          <Box direction="column" margin={{ left: "10px" }}>
            <Link
              to={{ pathname: "/browse" }}
              style={{ textDecoration: "none" }}
            >
              <Box
                onClick={() => ({})}
                direction="row"
                background={this.state.colorButton}
                round="xsmall"
                pad="small"
                gap="xsmall"
                height="60px"
                width="150px"
                align="center"
                focusIndicator={false}
                hoverIndicator={this.state.colorHover}
                margin={{ bottom: "25px" }}
              >

                <Search size="20px" />
                <Box direction="column">
                  <Text size="14px" weight="bold" margin={{ left: "2px", bottom: "3px" }}>
                    Browse
                  </Text>
                  <Text size="14px" margin={{ left: "2px" }}>
                    future events
                  </Text>
                </Box>
              </Box>
            </Link>
            <Link
              to={{ pathname: "/past" }}
              style={{ textDecoration: "none" }}
            >
              <Box
                onClick={() => ({})}
                direction="row"
                background={this.state.colorButton}
                round="xsmall"
                pad="small"
                gap="xsmall"
                height="60px"
                width="150px"
                align="center"
                focusIndicator={false}
                hoverIndicator={this.state.colorHover}
              >

                <Play size="20px" />
                <Box direction="column">
                  <Text size="14px" weight="bold" margin={{ left: "2px", bottom: "3px" }}>
                    Watch
                  </Text>
                  <Text size="14px" margin={{ left: "2px" }}>
                    past seminars
                  </Text>
                </Box>
              </Box>
            </Link>
          </Box>
        </Box>

        <div id="vertical-line"> {} </div>

        <Box direction="column" width="50%" alignSelf="center">
          <Text size="18px" weight="bold" margin={{ bottom: "10px" }}>
            Speakers
          </Text>
          
          <Box
            onClick={() => ({})}
            direction="row"
            background={this.state.colorButton}
            round="xsmall"
            pad="small"
            gap="xsmall"
            height="60px"
            width="140px"
            align="center"
            focusIndicator={false}
            hoverIndicator={this.state.colorHover}
            margin={{ bottom: "20px" }}
          >

            <Chat size="20px" />
            <Box direction="column">
              <Text size="14px" weight="bold" margin={{ left: "5px", bottom: "3px" }}>
                Give
              </Text>
              <Text size="14px" margin={{ left: "5px" }}>
                a talk
              </Text>
            </Box>
          </Box>

          <Text size="18px" weight="bold" margin={{ bottom: "10px" }}>
            Organisers
          </Text>

          <ScrollIntoView selector="#pricing">
            <Box
              onClick={() => ({})}
              direction="row"
              background={this.state.colorButton}
              round="xsmall"
              pad="small"
              gap="xsmall"
              height="60px"
              width="140px"
              align="center"
              focusIndicator={false}
              hoverIndicator={this.state.colorHover}
            >
              <Add size="20px" />
              <Box direction="column">
                <Text size="14px" weight="bold" margin={{ left: "5px", bottom: "3px" }}>
                  Post
                </Text>
                <Text size="14px" margin={{ left: "5px" }}>
                  your seminars
                </Text>
              </Box>
            </Box>
          </ScrollIntoView>
        </Box>
      </MediaQuery>
    </Box>
    )
  }

  content1() {
    return (
      <>
        <Text size="34px" margin={this.state.renderMobileView ? {top: "10%", bottom: "10%"} : {top: "5%", bottom: "5%"}} color="white">We empower every aspects of seminars with tech</Text>
        <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } gap="large">
          <Box width="40vh" height="40vh" background="grey" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="35%">
              <Workshop size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color7">
                Paradise for speakers
              </Text>
            </Box>
            <Text size="18px">Got a new idea or want to share your work with some existing communities? Simply browse for them and fill the in-built application form! Their admins will get back to you as soon as they can!</Text>

          </Box>


          <Box width="40vh" height="40vh" background="grey" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="35%">
              <SearchAdvanced size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color7">
                Granular classification system
              </Text>
            </Box>
            <Text size="18px">Classification made by researchers and entrepreneurs for researchers and entrepreneurs.</Text>

          </Box>

          <Box width="40vh" height="40vh" background="grey" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="35%">
              <ShareOption size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color7">
                Physical and online audience are connected
              </Text>
            </Box>
            <Text size="18px">Placeholder description lol mec</Text>

          </Box>

          <Box width="40vh" height="40vh" background="grey" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "20px"}} height="35%">
              <Group size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color7">
                Meet your next teammates! 
              </Text>
            </Box>
            <Text size="18px">Whether you are looking for new opportunities for your next article, collaborations, or partnership, your future teammates are likely to be sitting next to you!</Text>

          </Box>
        </Box>
      </>
    )
  }

  content2() {
    return (
      <>
        <Text size="34px" margin={this.state.renderMobileView ? {top: "10%", bottom: "10%"} : {top: "5%", bottom: "5%"}} color="black">Everything seminar organisers need, from start to finish</Text>
        {/* First row of features */}
        <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } gap="large" margin={{bottom: "20px"}}>
          <Box width="40vh" height="30vh" background="white" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="35%">
              <Workshop size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color1">
                Speakers come to you
              </Text>
            </Box>
            <Text size="18px">Finding exciting speakers to hear about lattest trends in your field can be tedious. Here, they come to you. </Text>

          </Box>


          <Box width="40vh" height="30vh" background="white" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="35%">
              <SearchAdvanced size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color1">
                Post your seminar in less than a minute
              </Text>
            </Box>
            <Text size="18px">Decide whether your event is public or requires registration. Yes, the registration form for your audience is automatically generated: you don't need to take care of that.</Text>
          </Box>

          <Box width="40vh" height="30vh" background="white" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "20px"}} height="35%">
              <Group size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color1">
                Automatic email advertisement
              </Text>
            </Box>
            <Text size="18px">Easily integrate your mailing list into your agora. Whenever a new event is created or some unexpected changes happened, you can with a single click let your community know about it!</Text>
          </Box>

          <Box width="40vh" height="30vh" background="white" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="35%">
              <ShareOption size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color1">
                Easy registration management
              </Text>
            </Box>
            <Text size="18px">You can automatically accept everybody with a verified academic email address (or other institutions). Else, manually accept attendees in a centralised panel.</Text>
          </Box>
        </Box>

        {/* Second row of features */}
        <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } gap="large">
          <Box width="40vh" height="30vh" background="white" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="35%">
              <Workshop size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color1">
                New opportunities for your community
              </Text>
            </Box>
            <Text size="18px">Allow your online audience to mingle after the event around an e-coffee! Some of the most projects and collaborations started around a coffee!</Text>

          </Box>


          <Box width="40vh" height="30vh" background="white" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="35%">
              <SearchAdvanced size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color1">
                Easily record and upload
              </Text>
            </Box>
            <Text size="18px">Classification made by people who know what they're talking about. If we're missing a .</Text>

          </Box>

          <Box width="40vh" height="30vh" background="white" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="35%">
              <ShareOption size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color1">
                Easily give microphone to audience
              </Text>
            </Box>
            <Text size="18px">Placeholder description lol mec</Text>

          </Box>

          <Box width="40vh" height="30vh" background="white" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "20px"}} height="35%">
              <Group size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color1">
                Streaming in browser (no apps!)
              </Text>
            </Box>
            <Text size="18px">Whether you are looking for new opportunities for your next article, collaborations, or partnership, your future teammates are likely to be sitting next to you!</Text>

          </Box>
        </Box>
      </>
    )
  }

  callToCreateAgora() {
    return (
      <Text size="34px" margin={{top: "5%", bottom: "5%"}} color="color1">Empower your community now!</Text>
          
    )
  }

  render() {
    return (
      <Box
        direction="column"
        align="center"
      >
        <Box
          direction="row"
          gap="small"
          align="end"
          style={{ minWidth: "90%", maxHeight: "40px" }}
          margin={{ top: "20px" }}
          justify="end"
        >
          <UserManager showLogin={this.state.showLogin} />
        </Box>

        <video
          autoPlay loop muted id="background-landing"
          style={{ height: "auto", width: "auto", minWidth: "100%", minHeight: "100%" }}
        >
          <source src="https://video.wixstatic.com/video/9b9d14_37244669d1c749ab8d1bf8b15762c61a/720p/mp4/file.mp4" type="video/mp4"/>
        </video>


        <Box height="100%" width="100%">
          <Box width="80%" height={this.state.renderMobileView ? "180vh": "75vh"} direction={this.state.renderMobileView ? "column" : "row"} alignSelf="center">
            <Box width={this.state.renderMobileView ? "100%" : "60%"} height="100%">
              {this.aboveTheFoldMain()}
            </Box>
            <Box width={this.state.renderMobileView ? "100%" : "60%"} height="100%">
              {this.aboveTheFoldImage()}
            </Box>
          </Box>
        </Box>

        <Box height="100%" width="100%" background="color1">
          <Box width="80%" height={this.state.renderMobileView ? "200vh": "70vh"}  direction="column" alignSelf="center">
            {this.content1()}
          </Box>
        </Box>

        <Box height="100%" width="100%" background="color5">
          <Box width="80%" height={this.state.renderMobileView ? "380vh": "130vh"} direction="column" alignSelf="center">
            {this.content2()}
          </Box>
        </Box>
        

        <Box height="100%" width="100%">
          <Box width="80%" height={this.state.renderMobileView ? "200vh": "70vh"} direction="column" alignSelf="center">
            {this.callToCreateAgora()}
          </Box>
        </Box>


        <AgoraCreationPage user={this.state.user} />


        {/* <Box
          direction="row"
          gap="150px"
          margin={{ top: "75px", left: "10px", right: "10px" }}
        >
          <TrendingTalksList />
        </Box> */}

        <Box width={window.innerWidth > 800 ? "70%" : "90%"} align="center">
          <FooterComponent />
        </Box>

      </Box>
    );
  }
}