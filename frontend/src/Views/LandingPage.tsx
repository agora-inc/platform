import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Box, Text, Heading, Layer } from "grommet";
// import moraStreamFullLogo from "../assets/general/mora.stream_logo_free_v3.png";
import moraStreamFullLogo from "../assets/general/mora.stream_logo_v3.svg";
import agoraLogo from "../assets/general/agora_logo_v2.1.svg";
import { User, UserService } from "../Services/UserService";
import { Search, Play, Add, Chat, Close, ShareOption, SearchAdvanced, Multiple, Group, Workshop, Trigger, MailOption, DocumentPerformance, Deploy, Attraction, CirclePlay, Like} from "grommet-icons";
import UserManager from "../Components/Account/UserManager";
import FooterComponent from "../Components/Homepage/FooterComponent";
import "../Styles/landing-page.css";
import MediaQuery from "react-responsive";
import ScrollIntoView from 'react-scroll-into-view'
import ReactTooltip from "react-tooltip";

import CreateChannelButton from "../Components/Channel/CreateChannelButton";
import CreateChannelOverlay from "../Components/Channel/CreateChannelButton/CreateChannelOverlay";



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
      colorButton: "#EAF1F1",
      colorHover: "#BAD6DB",
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
            Modernising academic seminars, from start to finish
          </Text>
          <Text size="20px">
            <b>Attend, give, and create virtual or hybrid seminars</b> with academics from all over the world before networking and meeting your next teammates around an e-coffee!
          </Text>
        </Box>
        <Box margin={this.state.renderMobileView ? {top: "30px"} : {top: "10px"}} height="50%">
          {this.callToActions()}
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
          top: (window.innerWidth > 800) ? "80px" : "40px",
          bottom: (window.innerWidth > 800) ? "40px" : "0px"
        }}
        justify="start"
        alignContent="start"
      >

      {/* Desktop version */}
      <MediaQuery minDeviceWidth={1000}>

        <Box direction="column" width="340px" >

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

        <Box direction="column" width="150px" alignSelf="center">
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

        <Box direction="column" width="150px" alignSelf="center">
          <Text size="21px" weight="bold" margin={{ bottom: "30px" }}>
            Organisers
          </Text>

          <ReactTooltip id="create-your-events" effect="solid">
            Create your events and share them with the world in less than a minute!
          </ReactTooltip>
            
          <ScrollIntoView selector="#content">
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
      <MediaQuery maxDeviceWidth={1000}>
        <Box direction="column" width="50%" height="100%">
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

        <Box direction="column" width="50%" alignSelf="center" height="100%">
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

          <ScrollIntoView selector="#content">
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
        <Text size="34px" margin={{top: "120px", bottom: "80px"}} color="white">We empower every aspects of seminars with tech</Text>
        <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } gap="30px">
          <Box width="350px" height={this.state.renderMobileView ? "250px" : "320px"} background="color2" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%">
              <Workshop size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color7">
                Paradise for speakers
              </Text>
            </Box>
            <Text size="18px">Do you want to share a new idea or what you've been working on with some existing communities? We made your life super-easy! Simply connect to them by clicking the 'Give a talk!' button!</Text>
          </Box>


          <Box width="350px" height={this.state.renderMobileView ? "250px" : "320px"} background="color2" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%">
              <SearchAdvanced size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color7">
                Granular classification
              </Text>
            </Box>
            <Text size="18px">We consulted experts for each field: the classification is made by people who know what they are talking about.</Text>
          </Box>

          <Box width="350px" height={this.state.renderMobileView ? "250px" : "320px"} background="color2" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%">
              <ShareOption size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color7">
                Hybrid audience connected
              </Text>
            </Box>
            <Text size="18px">With our mobile app, the in-person audience can interact with the online one through chat and Q&A but can also browse the slides of the speaker back-and-forth!</Text>
          </Box>

          <Box width="350px" height={this.state.renderMobileView ? "250px" : "320px"} background="color2" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "20px"}} height="25%">
              <Group size="large"/>
              <Text size="22px" weight="bold" margin={{left: "10px"}} color="color7">
                Meet your next teammates! 
              </Text>
            </Box>
            <Text size="18px">Whether you are looking for new opportunities for your next research article, community project, or start-up, your future teammates are likely to be sitting next to you!</Text>
          </Box>
        </Box>
      </>
    )
  }

  content2() {
    return (
      <>
        <Text size="34px" margin={{top: "120px", bottom: "80px"}} color="black">Everything seminar organisers need, from start to finish</Text>
        {/* A. First row of features */}
        <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } margin={{bottom: "20px"}} gap="30px">
          <Box width="350px" height={this.state.renderMobileView ? "220px" : "320px"} background="color6" pad="medium" direction="column" className="box1" gap="15px"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%">
              <Attraction size="large"/>
              <Text size="20px" weight="bold" margin={{left: "10px"}} color="color1">
                Speakers come to you
              </Text>
            </Box>
            <Text size="18px">Finding exciting speakers to hear about lattest trends in your field can be tedious. Here, they come to you. </Text>
          </Box>

          {/* {(!this.state.renderMobileView && 
            <hr style={{width: "40px", height: "0.1px", backgroundColor: "black", borderColor: "black", marginTop: "15vh", marginBottom: "15vh"}} />
          )} */}

          <Box width="350px" height={this.state.renderMobileView ? "220px" : "320px"} background="color6" pad="medium" direction="column" className="box2"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%">
              <Trigger size="large"/>
              <Text size="20px" weight="bold" margin={{left: "10px"}} color="color1">
                Seminars posted in 30 seconds
              </Text>
            </Box>
            <Text size="18px">Decide whether your event is public or requires registration. The registration form for your audience is automatically generated: no need to worry about it.</Text>
          </Box>

          {/* {(!this.state.renderMobileView && 
            <hr style={{width: "40px", height: "0.1px", backgroundColor: "black", borderColor: "black", marginTop: "15vh", marginBottom: "15vh"}} />
          )} */}

          <Box width="350px" height={this.state.renderMobileView ? "220px" : "320px"} background="color6" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "20px"}} height="25%">
              <MailOption size="large"/>
              <Text size="20px" weight="bold" margin={{left: "10px"}} color="color1">
                Automatic email advertisement
              </Text>
            </Box>
            <Text size="18px">Easily integrate your mailing list into your administration panel. Whenever a new event is created or modified, you can let your community know about it with a simple click!</Text>
          </Box>

          {/* {(!this.state.renderMobileView && 
            <hr style={{width: "40px", height: "0.5px", backgroundColor: "black", borderColor: "black", marginTop: "15vh", marginBottom: "15vh"}} />
          )} */}

          <Box width="350px" height={this.state.renderMobileView ? "220px" : "320px"} background="color6" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%">
              <DocumentPerformance size="large"/>
              <Text size="20px" weight="bold" margin={{left: "10px"}} color="color1">
                Easy registration management
              </Text>
            </Box>
            <Text size="18px">You can automatically accept everybody with a verified academic email address (or other institutions). Else, manually accept attendees in a centralised panel.</Text>
          </Box>
        </Box>
        
        {/* B. Second row of features */}
        <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } gap="30px">
          <Box width="350px" height={this.state.renderMobileView ? "220px" : "320px"} background="color6" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%">
              <Deploy size="large"/>
              <Text size="20px" weight="bold" margin={{left: "10px"}} color="color1">
                New exciting opportunities
              </Text>
            </Box>
            <Text size="18px">Allow your online audience to mingle after the event around an e-coffee! So many ideas and collaborations started around a coffee (this one included)!</Text>
          </Box>

          {/* {(!this.state.renderMobileView && 
            <hr style={{width: "40px", height: "0.1px", backgroundColor: "black", borderColor: "black", marginTop: "15vh", marginBottom: "15vh"}} />
          )} */}

          <Box width="350px" height={this.state.renderMobileView ? "220px" : "320px"} background="color6" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%">
              <CirclePlay size="large"/>
              <Text size="20px" weight="bold" margin={{left: "10px"}} color="color1">
                Record and upload (BETA)
              </Text>
            </Box>
            <Text size="18px">Recording can be done with one click. Appending the slide to your event with a second one. Uploading your recording on mora.stream with a third one.</Text>
          </Box>

          {/* {(!this.state.renderMobileView && 
            <hr style={{width: "40px", height: "0.1px", backgroundColor: "black", borderColor: "black", marginTop: "15vh", marginBottom: "15vh"}} />
          )} */}

          <Box width="350px" height={this.state.renderMobileView ? "220px" : "320px"} background="color6" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "25px"}} height="25%">
              <Like size="large"/>
              <Text size="20px" weight="bold" margin={{left: "10px"}} color="color1">
                Audience management tools
              </Text>
            </Box>
            <Text size="18px">Allow your audience to request the microphone if they want to ask a question orally. You decide whether you want to give it to them, or take it back if you are running out of time!</Text>
          </Box>
          
          {/* {(!this.state.renderMobileView && 
            <hr style={{width: "40px", height: "0.1px", backgroundColor: "black", borderColor: "black", marginTop: "15vh", marginBottom: "15vh"}} />
          )} */}

          <Box width="350px" height={this.state.renderMobileView ? "220px" : "320px"} background="color6" pad="medium" direction="column"> 
            <Box direction="row" margin={{bottom: "20px"}} height="25%">
              <Workshop size="large"/>
              <Text size="20px" weight="bold" margin={{left: "10px"}} color="color1">
                Speaker friendly
              </Text>
            </Box>
            <Text size="18px">All the streaming happens in the browser (no external software is required!). The speaker interface is so light and simplified that even the founders' grandparents could use it!</Text>
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
            <Text size="34px" margin={{top: "80px", bottom: "80px"}} color="color1" weight="bold" alignSelf="center">Empower your community now, in less than a minute!</Text>
            <Box align="center" margin={{bottom: "20px"}}>
                <CreateChannelButton 
                onClick={this.toggleCreateChannelOverlay} 
                width="250px"
                height="90px"
                text={"Get started!"}/>
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

        <Box height="100%" width="100%" background="color1" id="content">
          <Box width="80%" height={this.state.renderMobileView ? "1550px": "690px"}  direction="column" alignSelf="center">
            {this.content1()}
          </Box>
        </Box>

        <Box height="100%" width="100%" background="color5">
          <Box width="80%" height={this.state.renderMobileView ? "2390px": "970px"} direction="column" alignSelf="center">
            {this.content2()}
          </Box>
        </Box>
        

        <Box height="100%" width="100%">
          <Box width="80%" height={this.state.renderMobileView ? "400px": "400px"} direction="column" alignSelf="center">
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