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
import FooterComponent from "../Components/Homepage/FooterComponent";

interface State {
  channel: Channel | null;
//   channelId: number;
  mailToken: string
  colorButton: string
  colorHover: string
  renderMobileView: boolean;
  showCreateChannelOverlay: boolean;
  viewCount: number;
  loading: boolean;
}

export default class ChannelClaimPage extends Component<RouteComponentProps, State> {
    constructor(props: any) {
      super(props);
      this.state = {
        renderMobileView: (window.innerWidth < 1200),
        channel: null,
        mailToken: new URL(window.location.href).searchParams.get("mailToken")!,
        colorButton: "color1",
        colorHover: "color5",
        showCreateChannelOverlay: false,
        viewCount: NaN,
        loading: true
      };
    }

    componentWillMount() {
        console.log(this.state.mailToken)
        if(this.state.mailToken !== ""){
          this.fetchChanneltoClaim();
        } else {
          this.setState( {
            channel: null,
            mailToken: "",
            loading: false
          })
        }
      }


    fetchChanneltoClaim = () => {
        let channelId = 0;
        ChannelService.getFetchedChannelForMailToken(this.state.mailToken, channelId);
        ChannelService.getChannelById(
          channelId,
          (channel: Channel) => {
            if (channel){
              this.setState(
                {
                  channel: channel,
                  },
                  () => {
                    try{
                      this.fetchChannelViewCount();
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

      fetchChannelViewCount = () => {
        ChannelService.getViewCountForChannel(
          this.state.channel!.id,
          (viewCount: number) => {
            this.setState({ viewCount },
              () => {this.setState( {loading: false})});
          }
        );
      }; 

      toggleCreateChannelOverlay = () => {
        this.setState({
          showCreateChannelOverlay: !this.state.showCreateChannelOverlay
        });
      };

      componentDidUpdate(prevProps: RouteComponentProps) {
        if (this.props.location !== prevProps.location) {
          this.setState({
            mailToken: new URL(window.location.href).searchParams.get("mailToken")!
          });
        }
      }

      headTitle() {
        if(this.state.mailToken !== ""){
            return (
              <>
                <Text size="20px" color="grey" margin={this.state.renderMobileView ? {top: "80px"} : {top: "120px"}}>Don't leave your colleagues behind</Text>
                <Text size="48px" weight="bold" color="color1" margin={this.state.renderMobileView ? {top: "20px", bottom: "40px"} : {top: "20px", bottom: "50px"}}>
                Claim your channel 
                  <Text size="48px" color="color3">
                    {this.state.channel && ( " " + this.state.channel.name + " ")} 
                    {!this.state.channel && (" and interact with your community! ")} 
                  </Text>
                for free
                </Text>
            </>
            )
        } 
    }

    propagationAction() {
        return (
          <Text size="20px" margin={{top: "80px"}}>
            Share this unique link via email, Facebook, or Twitter and earn exciting rewards for each members who signs up.
        </Text>
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


    callToActionEndpage() {
        return (
          <>
            {!this.state.renderMobileView && (
              <>
                <Box>
                  <Text size="34px" margin={{top: "80px", bottom: "80px"}} color="color1" weight="bold" alignSelf="center">Keep up with the hottest ideas of the moment!</Text>
                  <Box align="center" margin={{bottom: "90px"}}>
                      <SignUpButton
                        channelId = {this.state.channel?.id}
                        mode = "claim"
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
    
    
                  <Box height="100%" width="100%">
                    <Box width="80%" height={this.state.renderMobileView ? "450px": "600px"} direction="column" alignSelf="center">
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
}