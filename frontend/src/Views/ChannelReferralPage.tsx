import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Box, Text, Heading, Layer } from "grommet";
import { Channel, ChannelService } from "../Services/ChannelService";
import CreateChannelButton from "../Components/Channel/CreateChannelButton";
import CreateChannelOverlay from "../Components/Channel/CreateChannelButton/CreateChannelOverlay";
import { Redirect } from "react-router-dom";
import Loading from "../Components/Core/Loading";
import ShareButtons from "../Components/Core/ShareButtons";
import LoginModal from "../Components/Account/LoginModal";
import SignUpButton from "../Components/Account/SignUpButton";
import { FaThemeisle } from "react-icons/fa";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

interface State {
  channel: Channel | null;
  channelId: number;
  showAsReferee: boolean
  colorButton: string
  colorHover: string
  showModalGiveATalk: boolean;
  renderMobileView: boolean;
  showCreateChannelOverlay: boolean;
  referralCount: number;
  loading: boolean;
}

export default class ChannelReferralPage extends Component<RouteComponentProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      renderMobileView: (window.innerWidth < 1200),
      channel: null,
      channelId: (this.props.location.pathname.split("/").length > 2 && Number(this.props.location.pathname.split("/")[3]))
        ? Number(this.props.location.pathname.split("/")[3])
        : 0,
      showAsReferee: new URL(window.location.href).searchParams.get("referee") === "true",
      colorButton: "color1",
      colorHover: "color5",
      showModalGiveATalk: false,
      showCreateChannelOverlay: false,
      referralCount: NaN,
      loading: true
    };
  }

  componentWillMount() {
    console.log(this.state.channelId)
    if(this.state.channelId !== 0){
      this.fetchChannelAndReferrals();
    } else {
      this.setState( {
        channel: null,
        channelId: 0,
        loading: false
      })
    }
  }
  
  fetchChannelAndReferrals = () => {
    ChannelService.getChannelById(
      this.state.channelId,
      (channel: Channel) => {
        if (channel){
          this.setState(
            {
              channel: channel,
              },
              () => {
                try{
                  this.fetchChannelReferralCount();
                  this.setState( {loading: false})
                }
                catch{
                  this.setState( {
                    channel: null,
                    loading: false})
                }
              }
              );
        } else {
          this.setState( {loading: false})
        }
      }
    );
  };
    
  fetchChannelReferralCount = () => {
    ChannelService.getReferralsForChannel(
      this.state.channel!.id,
      (referralCount: number) => {
        this.setState({ referralCount },
          () => {this.setState( {loading: false})});
      }
    );
  };

  componentDidUpdate(prevProps: RouteComponentProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({
        showAsReferee:
          new URL(window.location.href).searchParams.get("referee") ===
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

  headTitle() {
    if(this.state.showAsReferee){
        return (
          <>
            <Text size="20px" color="grey" margin={this.state.renderMobileView ? {top: "80px"} : {top: "120px"}}>Don't leave your colleagues behind</Text>
            <Text size="48px" weight="bold" color="color1" margin={this.state.renderMobileView ? {top: "20px", bottom: "40px"} : {top: "20px", bottom: "50px"}}>
            Invite colleagues and empower 
              <Text size="48px" color="color3">
                {this.state.channel && ( " " + this.state.channel.name + " ")} 
                {!this.state.channel && (" your community ")} 
              </Text>
            for free
            </Text>
        </>
        )
    } else{
      if(this.state.channel){
        return (
          <>
            <Text size="20px" color="grey" margin={this.state.renderMobileView ? {top: "80px"} : {top: "120px"}}>Join the team effort!</Text>
            <Box direction="column" height="100%" pad="small">
              <SignUpButton 
                channelId={this.state.channelId}  
                callback={() => {}} 
                height="90px" 
                width="700px" 
                textSize="48px"
                text="Sign up with this button"/>
              <Text size="48px" weight="bold" color="color1" margin={{top: "15px"}}>
              to boost
              <Text size="48px" color="color3">
                {this.state.channel && ( " " + this.state.channel.name + " ")} 
                {!this.state.channel && (" your community ")} 
              </Text>
            </Text>
            </Box>
          </>
        )
      }
      else{
        return (
          <>
            <Text size="20px" color="grey" margin={this.state.renderMobileView ? {top: "80px"} : {top: "120px"}}>Build a shiny community!</Text>
            <Text size="48px" weight="bold" color="color1" margin={this.state.renderMobileView ? {top: "20px", bottom: "40px"} : {top: "20px", bottom: "50px"}}>
              Invite people and empower your community
              for free
            </Text>
          </>
        )
      }
    }
  }


  propagationAction() {
    return (
      <Text size="20px" margin={{top: "80px"}}>
        Share this unique link via email, Facebook, or Twitter and earn exciting rewards for each members who signs up.
    </Text>
    )
  }

  referralStatus() {
    return (
      <>
        <Text   
          size="16px"
          color="#999999"
          weight="bold"
          margin={{bottom: "6px", right: "20px"}}
        >
          {this.state.referralCount} referrals 
        </Text>
        {/* replace 75 with {this.state.referralCount * 2} */}
  <ProgressBar percent={75} width={750} filledBackground="black" unfilledBackground="grey" hasStepZero = {true} stepPositions = {[0,10,20,50,100]} height = {10}>
    <Step>
    {({ accomplished, index  } : {accomplished : boolean, index :  number}) => (
      <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        width: 20,
        height: 20,
        color: "white",
        backgroundColor: accomplished ? "blue" : "gray"
      }}
    >
      {0}
    </div>
    )}
  </Step>
  <Step>
    {({ accomplished, index  } : {accomplished : boolean, index :  number}) => (
      <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        width: 20,
        height: 20,
        color: "white",
        backgroundColor: accomplished ? "blue" : "gray"
      }}
    >
      {5}
    </div>
    )}
  </Step>
  <Step>
    {({ accomplished, index  } : {accomplished : boolean, index :  number}) => (
      <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        width: 20,
        height: 20,
        color: "white",
        backgroundColor: accomplished ? "blue" : "gray"
      }}
    >
      {10}
    </div>
    )}
  </Step>
  <Step>
    {({ accomplished, index  } : {accomplished : boolean, index :  number}) => (
      <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        width: 20,
        height: 20,
        color: "white",
        backgroundColor: accomplished ? "blue" : "gray"
      }}
    >
      {25}
    </div>
    )}
  </Step>
  <Step>
    {({ accomplished, index  } : {accomplished : boolean, index :  number}) => (
      <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        width: 20,
        height: 20,
        color: "white",
        backgroundColor: accomplished ? "blue" : "gray"
      }}
    >
      {50}
    </div>
    )}
  </Step>

</ProgressBar>

        {/* <div style = {{
          height: '30px',
          width: '50%',
          backgroundColor: 'whitesmoke',
          borderRadius: 40,
          margin: 50
        }}>
            <div style = {{
                height: '100%',
                width: `${this.state.referralCount/50}%`,
                backgroundColor: "#99ccff",
                borderRadius:40,
                textAlign:'right'
            }}>
            
            </div>
        </div> */}
        
        <Box margin={this.state.renderMobileView ? {top: "30px", bottom: "30px"} : {top: "0px"}} height="40%">
          {this.callToActions()}
        </Box>
      </>
    )
  }

  aboveTheFoldMain() {
    // console.log("refcount" + this.state.referralCount);
    return (
      <>
        <Box>
            {this.headTitle()}
            <Box direction="row" gap="xsmall" align="end" width="60%">
              <ShareButtons
                channel={this.state.channel}
                referral={true}
              />
          </Box>
            {this.propagationAction()}
            
        </Box>
      </>
    )

}

  aboveTheFoldImage() {
    return (
      <>
        <Box direction="column" style={this.state.renderMobileView 
            ? { width: "90%", alignSelf: "center", marginTop: "20px" } 
            : { width: "90%", marginTop: "120px", alignSelf: "center"}
          }>

          <video 
            autoPlay loop muted
            style={{ height: "auto", width: "100%"}}
            >
            <source src="/videos/referral_page_faces_ai_generated.webm" type="video/webm"/> 
          </video>

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
        
    </Box>
    )
  }

  content1() {
    return (
      <>
        <Text size="28px" margin={{top: "60px", bottom: "80px"}} color="black" alignSelf="center">
          How does this work?
        </Text>
        <Box width="100%" direction={!this.state.renderMobileView ? "row" : "column" } gap="30px">
          {this.referralStatus()}
        </Box>
      </>
    )
  }

  callToActionEndpage() {
    return (
      <>
        {!this.state.renderMobileView && (
          <>
            <Box>
              <Text size="34px" margin={{top: "80px", bottom: "80px"}} color="color1" weight="bold" alignSelf="center">Keep up with the hottest ideas of the moment!</Text>
              <Box align="center" margin={{bottom: "90px"}}>
                  <SignUpButton
                    channelId = {this.state.channelId}
                    callback={()=>{}}
                    height="100px"
                    width="200px"
                    textSize="18px"
                  />
              </Box>
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
                user={null}
              />
            )}
      </>
      
    )
  }

  render() {
    if (this.state.loading){
      return(
        <Loading size={16} color="color1"/>
      )
    } else {
        // if(!this.state.channel){
        //   return(
        //     <Redirect to={"/referral/channel"} push={true}/>
        //   )
        // } 
        // else {
          console.log("3")
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
                <Box width="80%" height={this.state.renderMobileView ? "1480px": "550px"} direction={this.state.renderMobileView ? "column" : "row"} alignSelf="center">
                  <Box width={this.state.renderMobileView ? "100%" : "60%"} height={this.state.renderMobileView ? "500px" : "100%"}>
                    {this.aboveTheFoldImage()}
                  </Box>
                  <Box width={this.state.renderMobileView ? "100%" : "40%"} height={this.state.renderMobileView ? "1250px" : "100%"}
                    style={this.state.renderMobileView ? {} : {minWidth: "780px"}}>
                    {this.aboveTheFoldMain()}
                  </Box>
                </Box>
              </Box>

              <Box height="100%" width="100%" background="color5" id="content">
                <Box width="80%" height={this.state.renderMobileView ? "1750px": "460px"}  direction="column" alignSelf="center">
                  {this.content1()}
                </Box>
              </Box>

              {/* <Box height="100%" width="100%">
                <Box width="80%" height={this.state.renderMobileView ? "450px": "600px"} direction="column" alignSelf="center">
                  {this.callToActionEndpage()}
                </Box>
              </Box>

              <Box width={window.innerWidth > 800 ? "80%" : "90%"} align="center">
                <FooterComponent />
              </Box>  */}

            </Box>
          );
        }
    }
}