import React, { Component } from "react";
import { User, UserService } from "../Services/UserService";
import { Box, Text, Grid} from "grommet";
import { Checkmark, Close, Linkedin,  Twitter} from "grommet-icons";
import agorastreamLogo from "../assets/general/agora.stream_logo_v2.1.png";
import agoraLogo from "../assets/general/agora_logo_v2.1.png";

import ReactTooltip from "react-tooltip";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import CreateChannelButton from "../Components/Channel/CreateChannelButton";
import CreateChannelOverlay from "../Components/Channel/CreateChannelButton/CreateChannelOverlay";
import MediaQuery from "react-responsive";
import PricingPlans from "../Views/PricingPlans";


interface Props {
  location: { state: { user: User } };
}

interface State {
  user: User;
  loading: boolean;
  text: string;
  sizeHeader: string;
  sizeItem: string,
  sizeText: string;
  agoraCreationOverlay:
    {
      showCreateChannelOverlay: boolean
    }
}

export default class AgoraCreationPage extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: this.props.location.state
        ? this.props.location.state.user
        : UserService.getCurrentUser(),
      loading: true,
      text: "",
      sizeHeader: "32px",
      sizeItem: "16px",
      sizeText: "14px",
      agoraCreationOverlay:
        {
          showCreateChannelOverlay: false
        }
    };
  }

  toggleCreateChannelOverlay = () => {
    this.setState({
      agoraCreationOverlay: {
        showCreateChannelOverlay: !this.state.agoraCreationOverlay.showCreateChannelOverlay
    }});
  };

  updateText = (e: any) => {
    this.setState({
      text: e.target.value,
    });
  };

  parse = (rawText: string) => {
    const textArr = rawText.split("$");
    return (
      <Box
        width="100%"
        height="100%"
        margin={{ left: "15px" }}
        overflow="scroll"
      >
        <Box
          //   height="100%"
          direction="row"
          wrap
          align="center"
          style={{
            overflowWrap: "break-word",
            wordBreak: "break-all",
          }}
        >
          {textArr.map((textElement: string, index) => {
            if (index % 2 == 0) {
              return (
                <Text
                  color="black"
                  style={{
                    marginLeft: 3,
                    marginRight: 3,
                    // whiteSpace: "pre",
                    overflowWrap: "break-word",
                    wordBreak: "break-all",
                  }}
                  size="18px"
                >
                  {textElement}
                </Text>
              );
            } else {
              if (textElement != "" && index != textArr.length - 1) {
                return <InlineMath math={textElement} />;
              }
            }
          })}
        </Box>
      </Box>
    );
  };

  render() {
    let path_image = "/home/cloud-user/plateform/agora/frontend/media/tutorial/adding_members/";
    var renderMobileView = (window.innerWidth < 1000);

    return (
      <Box
        width="100vw"
        height="auto"
        align="center"
        margin={{ top: "8vh" }}
        background="color6"
        >
        <Box width="70%" direction="column" margin={{top: "10px", bottom: "60px"}}>
          <Box direction="row" gap="small" margin={{bottom: "44px"}}>
            <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
              The easiest way to organize your seminars
            </Text>
          </Box>
          {/* <Box margin={{bottom: "32px"}}>
            <Text size={this.state.sizeText} > Get your <img src={agoraLogo} height="14px"/> and your seminars up and running in <b>less than a minute</b>.
             </Text>
          </Box> */}
            <Grid
              rows={
                renderMobileView 
                ?  [
                  "70px", "80px", "200px",
                  "70px", "200px", "200px",
                  "70px", "110px", "200px",
                  "70px", "170px", "200px",
                  "70px", "100px", "200px",
                  ]
                : [
                    '10px', "200px",
                    '10px', "200px",
                    '10px', "200px",
                    '10px', "200px",
                    '10px', "200px",
                  ]
              }

              columns={renderMobileView ? ["100%"] : ['50%', "50%"]}
              gap="40px"
              margin={renderMobileView ? {} : {left: "10px"}}
              areas={ renderMobileView 
                ?
                  [
                    { name: 'arg_1_title', start: [0, 0], end: [0, 0] },
                    { name: 'arg_1_text', start: [0, 1], end: [0, 1] },
                    { name: 'arg_1_image', start: [0, 2], end: [0, 2] },
    
                    { name: 'arg_2_title', start: [0, 3], end: [0, 3] },
                    { name: 'arg_2_text', start: [0, 4], end: [0, 4] },
                    { name: 'arg_2_image', start: [0, 5], end: [0, 5] },
    
                    { name: 'arg_3_title', start: [0, 6], end: [0, 6] },
                    { name: 'arg_3_text', start: [0, 7], end: [0, 7] },
                    { name: 'arg_3_image', start: [0, 8], end: [0, 8] },
    
                    { name: 'arg_4_title', start: [0, 9], end: [0, 9] },
                    { name: 'arg_4_text', start: [0, 10], end: [0, 10] },
                    { name: 'arg_4_image', start: [0, 11], end: [0, 11] },
    
                    { name: 'arg_5_title', start: [0, 12], end: [0, 12] },
                    { name: 'arg_5_text', start: [0, 13], end: [0, 13] },
                    { name: 'arg_5_image', start: [0, 14], end: [0, 14] },
                  ]
                :
                  [
                  { name: 'arg_1_title', start: [0, 0], end: [1, 0] },
                  { name: 'arg_1_text', start: [0, 1], end: [0, 1] },
                  { name: 'arg_1_image', start: [1, 0], end: [1, 1] },

                  { name: 'arg_2_title', start: [1, 2], end: [1, 2] },
                  { name: 'arg_2_text', start: [1, 3], end: [1, 3] },
                  { name: 'arg_2_image', start: [0, 2], end: [0, 3] },

                  { name: 'arg_3_title', start: [0, 4], end: [1, 4] },
                  { name: 'arg_3_text', start: [0, 5], end: [0, 5] },
                  { name: 'arg_3_image', start: [1, 4], end: [1, 5] },

                  { name: 'arg_4_title', start: [1, 6], end: [1, 6] },
                  { name: 'arg_4_text', start: [1, 7], end: [1, 7] },
                  { name: 'arg_4_image', start: [0, 6], end: [0, 7] },

                  { name: 'arg_5_title', start: [0, 8], end: [1, 8] },
                  { name: 'arg_5_text', start: [0, 9], end: [0, 9] },
                  { name: 'arg_5_image', start: [1, 8], end: [1, 9] },
              ]
            }
            >
              <Box gridArea="arg_1_title">
                <Text size="25px" weight="bold" color="color3">
                  Your target audience is right there
                  </Text>
                
                </Box>
              <Box gridArea="arg_1_text">
                <Text size="18px">
                  Our users are <b>university students and researchers </b> from all over the world, hungry to know about the latest research.
                </Text>
                </Box>
              <Box gridArea="arg_1_image" margin={{top:"10px", bottom: "10px"}}>
                <video 
                    autoPlay loop muted
                    style={{ height: "100%", width: "auto"}}
                  >
                  <source src="https://media.giphy.com/media/V3FqlRGEaJN5kjYE0D/giphy.mp4" type="video/mp4"/> 
                </video>
                </Box>



              <Box gridArea="arg_2_title">
                <Text size="25px" weight="bold" color="color3">
                  Organising seminars has never been quicker
                  </Text>
                </Box>
              <Box gridArea="arg_2_text">
                <Text size="18px">
                  Create your <img src={agoraLogo} height="14px"/> and your seminars in <b>a minute</b>. Also:
                </Text>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> Customize your homepage </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> Create <b>public or on-registration</b> events </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> Send emails to your community </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> Advertise your events on social media with a few clicks  </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> Publish your past seminar recordings  </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> LateX formatting  </Text>
                </Box>
              </Box>

                {/* TO BE CHANGED:!!!!! */}
              <Box gridArea="arg_2_image">
               <video 
                    autoPlay loop muted
                    style={{ height: "100%", width: "auto"}}
                    >
                    <source src="/videos/creation_speed_1mn_agora_15sec_version_15sec_version.mp4" type="video/mp4"/> 
                </video>
                </Box>



              <Box gridArea="arg_3_title">
                <Text size="25px" weight="bold" color="color3">
                  Future speakers are coming to your door
                  </Text>
                </Box>
              <Box gridArea="arg_3_text" margin={{top: "15px"}}>
                <Text size="18px">
                  You can allow potential future speakers <b> from all around the world </b> to apply to give a talk to your community.
                </Text>
                </Box>
              <Box gridArea="arg_3_image" margin={{top:"10px", bottom: "10px"}}>
                <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto"}}
                >
                  <source src="/videos/talk_application.mp4" type="video/mp4"/> 
                </video>
              </Box>

              <Box gridArea="arg_4_title">
                <Text size="25px" weight="bold" color="color3">
                  Integrated virtual cafeteria
                </Text>
              </Box>
              <Box gridArea="arg_4_text" margin={{top: "15px"}}>
                <Text size="18px">
                  Your audience can grab a virtual coffee at the <img src={agoraLogo} height={"14px"}/> café 15 minutes before the start and 1 hour after the end of your seminar. 
                </Text>
                <Text size="18px" margin={{top: "10px"}}>
                  Networking and mingling with each other is <b> fun and intuitive </b>, a cozy place to chat about the event!
                </Text>
              </Box>
              <Box gridArea="arg_4_image" margin={{top:"10px", bottom: "10px"}}>
                <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto"}}
                >
                  <source src="/videos/cafeteria_agora_minidemo.mp4" type="video/mp4"/> 
                </video>
              </Box>

              <Box gridArea="arg_5_title">
                <Text size="25px" weight="bold" color="color3">
                  Use the new <img src={agoraLogo} height={"18px"}/> streaming tool!
                </Text>
              </Box>
              <Box gridArea="arg_5_text" margin={{top: "15px"}}>
                <Text size="18px">
                  We built an in-house streaming technology sculpted for online and hybrid academic seminars:
                </Text>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> Clean and easy-to-use interface for speakers </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> <b> Upload slides </b> to allow participants can go back and forth </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> Participants can request the mic and you have the control </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> LateX supported chat </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> Give a round of applause by pressing your space bar to broadcast a clap in the room </Text>
                </Box>

                {/*<Text size="18px" margin={{top: "10px"}}>
                  If you already have a streaming plan, just enter the link to your event and everyone will be redirected to it.
          </Text> */}

                </Box>
              <Box gridArea="arg_5_image"  margin={{top:"10px", bottom: "10px"}}>
                <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto"}}
                >
                  <source src="/videos/url_streaming_homemade_or_agora.mp4" type="video/mp4"/> 
                </video>
              </Box>

              {/* <Box gridArea="arg_6_title">
                <Text size="25px" weight="bold" color="color3">
                  Host online or hybrid physical-online seminars
                  </Text>
                </Box>
              <Box gridArea="arg_6_text" margin={{top: "15px"}}>
                <Text size="14px">
                  The <img src={agoraLogo} height={"14px"}/> streaming technology is sculpted for both online and hybrid online-physical seminars.
                  <ul>
                    <li><b>Clean and easy-to-use interface</b> for speakers</li>
                    <li><b>Augmented interface</b> for organisers</li>
                    <li><b>Ability for seminar participants to request the mic</b></li>
                    <li><b>Give a round of applause</b> by pressing your space bar to broadcast a clap in the room -- <i>event triggered by an organiser only</i></li>
                    <li><b>Online audience is automatically redirected</b> to the <img src={agoraLogo} height={"14px"}/> cafeteria once the talk is over</li>
                    <li><b>Connect physical and online audience</b> with a mobile app</li>
                    <li>LateX supported chat, and much more!</li>
                  </ul>
                </Text>
                </Box>
              <Box gridArea="arg_6_image" background="color2">
                <Text size="28px" textAlign="center" margin={{top: "15px"}} weight="bold">
                Public release soon.🎊 <br></br>
                  Stay tuned by following us on <a href="https://linkedin.com/company/agorastream"><Linkedin size="28px"/></a> or <a href="https://https://twitter.com/AgoraStream"><Twitter size="28px"/></a>!
                  </Text>
          </Box> */}
            </Grid>
                

            <Box alignContent="center" margin={{top:"100px"}}>
              <PricingPlans 
                callback={() => {}}
                headerTitle={true}
              />

            <Box margin={{top:"50px"}}>

            <MediaQuery maxDeviceWidth={1000}>
                <b>Log on the Desktop version to proceed.</b>
            </MediaQuery>


            {/* <MediaQuery minDeviceWidth={1000}>
              <CreateChannelButton 
                onClick={this.toggleCreateChannelOverlay} 
                text={"Create your agora (Free plan)"}
                />
              {!this.state.agoraCreationOverlay.showCreateChannelOverlay || (
                <CreateChannelOverlay
                onBackClicked={this.toggleCreateChannelOverlay}
                onComplete={() => {
                  this.toggleCreateChannelOverlay();
                }}
                visible={true}
                user={this.state.user}
                />)}
              <Box
                data-tip data-for='Premium_plan'
                direction="row"
                gap="small"
                align="center"
                width="fill"
                height="fill"
                round="xsmall"
                pad="xsmall"
                style={{
                  border: "2px solid #C2C2C2",
                  }}
                  background="color1"
                  hoverIndicator="color3"
                  focusIndicator={false}
                  justify="start"
                  margin={{top: "small"}}
              >
                <Text size="22.5px">🚀</Text>
                <Text size="14px" color="white">Create an agora (Premium plan)</Text>
              </Box>
              <ReactTooltip id='Premium_plan' place="bottom" effect="solid">
                  Publicly available soon.
                </ReactTooltip>


            
              <img src="/images/academic_seminars_photo.jpeg" 
                width="60%" 
                style={{
                  margin: "10px",
                  alignSelf: "center"}}
                  />
            </MediaQuery> */}
            </Box>
            </Box>
          </Box>
        </Box>
    );
  }
}
