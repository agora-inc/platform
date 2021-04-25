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
            <Text size={this.state.sizeHeader} weight="bold" color="color1"> Everything you need for your seminars, all in one place</Text>
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
                  "70px", "350px", "200px",
                  ]
                : [
                    '40px', "200px",
                    '40px', "200px",
                    '40px', "200px",
                    '40px', "200px",
                    '40px', "200px",
                    '40px', "200px",
                  ]
              }

              columns={renderMobileView ? ["100%"] : ['50%', "50%"]}
              gap="15px"
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
    
                    { name: 'arg_6_title', start: [0, 15], end: [0, 15] },
                    { name: 'arg_6_text', start: [0, 16], end: [0, 16] },
                    { name: 'arg_6_image', start: [0, 17], end: [0, 17] },
                    // NOTE THAT arg_6_image box is not the same as the other ones!
                  ]
                :
                  [
                  { name: 'arg_1_title', start: [0, 0], end: [1, 0] },
                  { name: 'arg_1_text', start: [0, 1], end: [0, 1] },
                  { name: 'arg_1_image', start: [1, 0], end: [1, 1] },

                  { name: 'arg_2_title', start: [0, 2], end: [1, 2] },
                  { name: 'arg_2_text', start: [0, 3], end: [0, 3] },
                  { name: 'arg_2_image', start: [1, 2], end: [1, 3] },

                  { name: 'arg_3_title', start: [0, 4], end: [1, 4] },
                  { name: 'arg_3_text', start: [0, 5], end: [0, 5] },
                  { name: 'arg_3_image', start: [1, 4], end: [1, 5] },

                  { name: 'arg_4_title', start: [0, 6], end: [1, 6] },
                  { name: 'arg_4_text', start: [0, 7], end: [0, 7] },
                  { name: 'arg_4_image', start: [1, 6], end: [1, 7] },

                  { name: 'arg_5_title', start: [0, 8], end: [1, 8] },
                  { name: 'arg_5_text', start: [0, 9], end: [0, 9] },
                  { name: 'arg_5_image', start: [1, 8], end: [1, 9] },

                  { name: 'arg_6_title', start: [0, 10], end: [1, 10] },
                  { name: 'arg_6_text', start: [0, 11], end: [0, 11] },
                  { name: 'arg_6_image', start: [1, 11], end: [1, 11] },
                  // NOTE THAT arg_6_image box is not the same as the other ones!
              ]
            }
            >
              <Box gridArea="arg_1_title">
                <Text size="25px" weight="bold" color="color3">
                  Your target audience is right there
                  </Text>
                
                </Box>
              <Box gridArea="arg_1_text">
                <Text size="14px">
                  Users of <img src={agorastreamLogo} height={"14px"} width="85px"/> are <b>university students and researchers (academic and industrial)</b> coming from all over the world. Are one of these your target audience? If yes, you are in the right place.
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
                  Organising is quick and easy
                  </Text>
                </Box>
              <Box gridArea="arg_2_text">
                <Text size="14px">
                  Get your <img src={agoraLogo} height="14px"/> and your seminars up and running in <b>a minute</b>. You can also:
                    <ul>
                      <li><b>Create and customize your homepage</b></li>
                      <li>Create <b>public or on-registration</b> events</li>
                      <li><b>Send emails to your community</b> -- <i>optional; can also be automated</i></li>
                      <li><b>Advertise your events on all your social media</b> via a couple clicks -- <i>optional; can also be automated</i></li>
                      <li><b>Publish your past seminar recordings</b></li>
                      <li>Use LateX format and much more!</li>
                    </ul>

                </Text>
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
                  Allow potential future speakers to come to you
                  </Text>
                </Box>
              <Box gridArea="arg_3_text" margin={{top: "15px"}}>
                <Text size="14px">
                  Give the chance to potential future speakers from all around the world to apply to give a talk within your community via an in-build application form (this feature can be disabled).
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
                <Text size="14px">
                  Let your audience grab a pre/post-seminar coffee at the <img src={agoraLogo} height={"14px"}/> café by taking control of a 2D avatar using their arrow keys (cafeteria is open 45 minutes before the start of the event and closes 2 hours after it finishes). Allow your audience to network and mingle with each others and discuss about the event in a nice and cosy place!
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
                  Use your own streaming URL or <img src={agoraLogo} height={"18px"}/> tech
                  </Text>
                </Box>
              <Box gridArea="arg_5_text" margin={{top: "15px"}}>
                <Text size="14px">
                  Do you already have a streaming plan? Do not worry. You can still enjoy many of the logistic features of <img src={agorastreamLogo} height={"14px"}/>: simply insert your own streaming URL during the event creation process.
                </Text>
                </Box>
              <Box gridArea="arg_5_image"  margin={{top:"10px", bottom: "10px"}}>
                <video 
                    autoPlay loop muted
                    style={{ height: "100%", width: "auto"}}
                    >
                    <source src="/videos/url_streaming_homemade_or_agora.mp4" type="video/mp4"/> 
                </video>
                </Box>

              <Box gridArea="arg_6_title">
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
                </Box>
            </Grid>
                

            <Box alignContent="center" margin={{top:"50px"}}>
              <Text size={this.state.sizeHeader} color="color1" weight="bold">
                Pricing
              </Text>
                <Grid
                rows={
                  renderMobileView ?
                  [
                    '60px',
                    '60px',

                    '60px',
                    '60px',
                    '60px',

                    '60px',
                    '60px',

                    '60px',
                    '60px',
                    '60px',
                  ]
                :
                  [
                    '40px',
                    '40px',

                    '40px',
                    '40px',
                    '40px',

                    '40px',
                    '40px',

                    '40px',
                    '40px',
                    '40px',
                  ]
                
                
                
                }
                style={{border: "true"}}
                columns={renderMobileView ? ['33%', "33%", "33%"] : ['25%', "35%", "35%"]}
                gap="15px"
                margin={{top: "18px"}}
                areas={[
                  { name: 'feature_1', start: [0, 0], end: [0, 0] },
                  { name: 'plan1_1', start: [1, 0], end: [1, 0] },
                  { name: 'plan2_1', start: [2, 0], end: [2, 0] },

                  { name: 'feature_2', start: [0, 1], end: [0, 1] },
                  { name: 'plan1_2', start: [1, 1], end: [1, 1] },
                  { name: 'plan2_2', start: [2, 1], end: [2, 1] },

                  { name: 'feature_3', start: [0, 2], end: [0, 2] },
                  { name: 'plan1_3', start: [1, 2], end: [1, 2] },
                  { name: 'plan2_3', start: [2, 2], end: [2, 2] },

                  { name: 'feature_4', start: [0, 3], end: [0, 3] },
                  { name: 'plan1_4', start: [1, 3], end: [1, 3] },
                  { name: 'plan2_4', start: [2, 3], end: [2, 3] },

                  { name: 'feature_5', start: [0, 4], end: [0, 4] },
                  { name: 'plan1_5', start: [1, 4], end: [1, 4] },
                  { name: 'plan2_5', start: [2, 4], end: [2, 4] },

                  { name: 'feature_6', start: [0, 5], end: [0, 5] },
                  { name: 'plan1_6', start: [1, 5], end: [1, 5] },
                  { name: 'plan2_6', start: [2, 5], end: [2, 5] },

                  
                  { name: 'feature_7', start: [0, 6], end: [0, 6] },
                  { name: 'plan1_7', start: [1, 6], end: [1, 6] },
                  { name: 'plan2_7', start: [2, 6], end: [2, 6] },
                  
                  { name: 'feature_8', start: [0, 7], end: [0, 7] },
                  { name: 'plan1_8', start: [1, 7], end: [1, 7] },
                  { name: 'plan2_8', start: [2, 7], end: [2, 7] },
                  
                  { name: 'feature_9', start: [0, 8], end: [0, 8] },
                  { name: 'plan1_9', start: [1, 8], end: [1, 8] },
                  { name: 'plan2_9', start: [2, 8], end: [2, 8] },

                ]}
              >
                
                {/* <Box gridArea="feature_1" background="blue">
                  <Text>
                    Plan
                    </Text>
                </Box> */}

                <Box gridArea="plan1_1" background="color7">
                <Text margin="5px" weight="bold" size={this.state.sizeText}>
                  Student plan <i>(free)</i>
                    </Text>
                </Box>

                <Box gridArea="plan2_1" background="color7">
                <Text margin="5px" weight="bold" size={this.state.sizeText}>
                  Professor plan
                    </Text>
                </Box>



                <Box gridArea="feature_2" background="color5">
                <Text margin="5px" size={this.state.sizeText} weight="bold">
                  Emails
                    </Text>
                </Box>

                <Box gridArea="plan1_2" background="color5">
                <Text margin="5px" size={this.state.sizeText}>
                  Up to 300 per month
                    </Text>
                </Box>

                <Box gridArea="plan2_2" background="color5">
                <Text margin="5px" size={this.state.sizeText}>
                  Unlimited
                    </Text>
                </Box>
                
                <Box gridArea="feature_3" background="color5">
                <Text margin="5px" size={this.state.sizeText} weight="bold">
                  Social media automation
                    </Text>
                </Box>

                <Box gridArea="plan1_3" background="color5">
                <Text margin="5px" size={this.state.sizeText}>
                  <Checkmark/>
                    </Text>
                </Box>

                <Box gridArea="plan2_3" background="color5">
                <Text margin="5px" size={this.state.sizeText}>
                  <Checkmark/>
                    </Text>
                </Box>


                <Box gridArea="feature_4" background="color5">
                <Text margin="5px" size={this.state.sizeText} weight="bold">
                  Custom streaming
                    </Text>
                </Box>

                <Box gridArea="plan1_4" background="color5">
                <Text margin="5px" size={this.state.sizeText}>
                  <Checkmark/>
                    </Text>
                </Box>

                <Box gridArea="plan2_4" background="color5">
                <Text margin="5px" weight="bold" size={this.state.sizeText}>
                  <Checkmark/>
                    </Text>
                </Box>



                <Box gridArea="feature_5" background="color5">
                <Text margin="5px" size={this.state.sizeText} weight="bold">
                  Integrated speaker form
                    </Text>
                </Box>

                <Box gridArea="plan1_5" background="color5">
                <Text margin="5px" size={this.state.sizeText}>
                  <Checkmark/>
                    </Text>
                </Box>

                <Box gridArea="plan2_5" background="color5">
                <Text margin="5px" size={this.state.sizeText}>
                  <Checkmark/>
                    </Text>
                </Box>



                <Box gridArea="feature_6" background="color5">
                <Text margin="5px" size={this.state.sizeText}>
                  <img src={agoraLogo} height={"14px"}/> <i>streaming tech</i>
                    </Text>
                </Box>

                <Box gridArea="plan1_6" background="color5">
                <Text margin="5px" size={this.state.sizeText}>
                    <Close/>
                    </Text>
                </Box>

                <Box gridArea="plan2_6" background="color5">
                <Text margin="5px" size={this.state.sizeText}>
                  <Checkmark/>
                    </Text>
                </Box>




                <Box gridArea="feature_7" background="color5">
                <Text margin="5px" size={this.state.sizeText} weight="bold">
                  Virtual cafeteria
                    </Text>
                </Box>

                <Box gridArea="plan1_7" background="color5">
                <Text margin="5px" size={this.state.sizeText}>
                  Up to 50 people per event
                    </Text>
                </Box>

                <Box gridArea="plan2_7" background="color5">
                <Text margin="5px" size={this.state.sizeText}>
                  Up to 500 people per event
                    </Text>
                </Box>



                <Box gridArea="feature_8" background="color5">
                <Text margin="5px" size={this.state.sizeText} weight="bold">
                  Hybrid events
                    </Text>
                </Box>

                <Box gridArea="plan1_8" background="color5">
                <Text margin="5px" size={this.state.sizeText}>
                    <Close/>
                    </Text>
                </Box>

                <Box gridArea="plan2_8" background="color5" alignContent="center">
                <Text margin="5px" size={this.state.sizeText}>
                    <Checkmark/>
                    </Text>
                </Box>




                <Box gridArea="feature_9" background="color5">
                <Text margin="5px" weight="bold" size={this.state.sizeText}>
                  Price
                  </Text>
                </Box>

                <Box gridArea="plan1_9" background="color5">
                  <Text margin="5px" weight="bold" size={this.state.sizeText}>
                    Free
                  </Text>
                </Box>

                <Box gridArea="plan2_9" background="color5">
                  <Text margin="5px" weight="bold" size={this.state.sizeText}>
                    TBA (pricing per event and/or per month)*
                  </Text>
                </Box>


              </Grid>

              <Text size={this.state.sizeText}>
                *: Due to an overwhelming demand and to maintain a high quality experience, we are limiting the number of simulatenous active "Professor plans" and are actively working on increasing it ASAP. Stay tuned by following us on <a href="https://linkedin.com/company/agorastream"><Linkedin size={this.state.sizeText}/></a> and <a href="https://https://twitter.com/AgoraStream"><Twitter size={this.state.sizeText}/></a>!
              </Text>





            <Box margin={{top:"50px"}}>
              <Text size={this.state.sizeHeader} color="color1" weight="bold" margin={{ bottom: "25px"}}>
                Start delivering your seminars to a worldwide community of academics and researchers!
              </Text>

            <MediaQuery maxDeviceWidth={1000}>
                <b>Log on the Desktop version to proceed.</b>
            </MediaQuery>


            <MediaQuery minDeviceWidth={1000}>
              <CreateChannelButton 
                onClick={this.toggleCreateChannelOverlay} 
                text={"Create your agora (Student plan)"}
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
                data-tip data-for='professor_plan'
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
                {/* background={this.state.hover ? "#f2f2f2" : "white"} */}
                <Text size="22.5px">🚀</Text>
                <Text size="14px" color="white">Create an agora (Professor plan)</Text>
              </Box>
              <ReactTooltip id='professor_plan' place="bottom" effect="solid">
                  Publicly available soon.
                </ReactTooltip>


            
              <img src="/images/academic_seminars_photo.jpeg" 
                width="60%" 
                style={{
                  margin: "10px",
                  alignSelf: "center"}}
                  />
            </MediaQuery>
            </Box>
            </Box>
          </Box>
        </Box>
    );
  }
}
