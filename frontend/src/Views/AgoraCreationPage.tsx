import React, { Component } from "react";
import { User, UserService } from "../Services/UserService";
import { Box, Text, Grid} from "grommet";
import { Checkmark, Close, Linkedin,  Twitter} from "grommet-icons";
import agorastreamLogo from "../assets/general/agora.stream_logo_300px.svg";
import agoraLogo from "../assets/general/agora_logo_v2.1.svg";

import ReactTooltip from "react-tooltip";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import CreateChannelButton from "../Components/Channel/CreateChannelButton";
import CreateChannelOverlay from "../Components/Channel/CreateChannelButton/CreateChannelOverlay";
import { StreamingProductService } from "../Services/StreamingProductService";
import MediaQuery from "react-responsive";
import PricingPlans from "../Views/PricingPlans";
import agoraStreamFullLogo from "../assets/general/agora.stream_logo_300px.svg";


interface Props {
  user: User | null;
}

interface State {
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
      loading: true,
      text: "",
      sizeHeader: "32px",
      sizeItem: "16px",
      sizeText: "14px",
      agoraCreationOverlay:
        {
          showCreateChannelOverlay: false
        },
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

    console.log("width", window.innerWidth)

    return (
      <Box
        id="pricing"
        width="100vw"
        height="auto"
        align="center"
        margin={{ top: "8vh" }}
        // background="color6"
        >
        <Box width={renderMobileView ? "85%" : "70%"} direction="column" margin={{top: "10px"}}>
            <Text size={this.state.sizeHeader} weight="bold" color="color1" margin={{bottom: "44px"}} >
              Tech to empower the seminar experience and simplify their organisation
            </Text>
            <Grid
              rows={
                renderMobileView 
                ?  [
                  "30px", "50px", "300px", 
                  "350px", "250px", "250px", 
                  "250px", "250px", "250px", 
                  "250px", "50px", "250px",
                  ]
                : [
                    '10px', "300px",
                    '300px', "300px",
                    '300px', "300px",
                    '10px', 
                  ]
              }
              columns={renderMobileView ? ["100%"] : ['50%', "50%"]}
              gap={renderMobileView ? "0px" : "50px"}
              margin={renderMobileView ? {} : {left: "10px"}}
              areas={ renderMobileView 
                ?
                  [
                    { name: 'arg_1_text', start: [0, 1], end: [0, 2] },
                    { name: 'arg_1_image', start: [0, 2], end: [0, 3] },
    
                    { name: 'arg_2_text', start: [0, 3], end: [0, 4] },
                    { name: 'arg_2_image', start: [0, 4], end: [0, 5] },
    
                    { name: 'arg_3_text', start: [0, 5], end: [0, 6] },
                    { name: 'arg_3_image', start: [0, 6], end: [0, 7] },
    
                    { name: 'arg_6_text', start: [0, 7], end: [0, 8] },
                    { name: 'arg_6_image', start: [0, 8], end: [0, 9] },
    
                    { name: 'arg_7_text', start: [0, 9], end: [0, 10] },
                    { name: 'arg_7_image', start: [0, 10], end: [0, 11] },
                  ]
                :
                  [
                  { name: 'arg_1_text', start: [0, 1], end: [0, 2] },
                  { name: 'arg_1_image', start: [1, 0], end: [1, 1] },

                  { name: 'arg_2_text', start: [1, 2], end: [1, 3] },
                  { name: 'arg_2_image', start: [0, 2], end: [0, 3] },

                  { name: 'arg_3_text', start: [0, 3], end: [0, 4] },
                  { name: 'arg_3_image', start: [1, 3], end: [1, 4] },

                  { name: 'arg_6_text', start: [1, 4], end: [1, 5] },
                  { name: 'arg_6_image', start: [0, 4], end: [0, 5] },

                  { name: 'arg_7_text', start: [0, 5], end: [0, 6] },
                  { name: 'arg_7_image', start: [1, 5], end: [1, 6] },
              ]
            }
            >
              <Box gridArea="arg_1_text" justify="center">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  A platform for a thoughtful audience
                </Text>
                <Text size="18px">
                  Our users are <b>university students, researchers, and experts </b> from all over the world, hungry to know about the latest trends in academia or tech.
                </Text>
                </Box>
              <Box gridArea="arg_1_image">
                <video 
                    autoPlay loop muted
                    style={{ height: "100%", width: "auto"}}
                  >
                  <source src="https://media.giphy.com/media/V3FqlRGEaJN5kjYE0D/giphy.mp4" type="video/mp4"/> 
                </video>
              </Box>

              <Box gridArea="arg_2_text" justify="center">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Organise and advertise your seminars in 1 minute
                </Text>
                <Text size="18px">
                  Create your <img src={agoraLogo} height="14px"/>  to:
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


              <Box gridArea="arg_7_text" justify="center" >
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Send automatic email reminders
                </Text>
                <Text size="18px">
                  You can decide to remind your community about upcoming event <b> without any work! </b>
                </Text>
                <Text size="18px" margin={{top: "10px"}}>
                  Simply choose the time and the group of people you want to send the reminder to, be it <b> all your followers, your mailing list or only the registered participants. </b>
                </Text>
              </Box>
              <Box gridArea="arg_7_image">
                <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto"}}
                >
                  <source src="/videos/email-reminders.mp4" type="video/mp4"/> 
                </video>
              </Box>

              <Box gridArea="arg_6_text" justify="center">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  A couple clicks to handle all registrations
                </Text>
                <Text size="18px">
                  As an organiser, you can decide to automatically accept certains group of people <b> everyone, only verified academics, only people from your institution, etc. </b>
                </Text>
                <Text size="18px" margin={{top: "10px"}}>
                  For the others, manually accepting them is made very easy and intuitive!
                </Text>
              </Box>
              <Box gridArea="arg_6_image">
                <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto"}}
                >
                  <source src="/videos/automatic-registration.mp4" type="video/mp4"/> 
                </video>
              </Box>


              <Box gridArea="arg_3_text" justify="center">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  A marketplace for speakers
                </Text>
                <Text size="18px">
                  Any speakers <b> from all around the world </b> can apply to give a talk within a community (if it is accepting applications).
                </Text>
                <Text size="18px" margin={{top: "10px"}}>
                  Speakers fill out a form stating the <b> title and the abstract </b> of their talk, and the admins decide whether it's a fit.
                </Text>
              </Box>
              <Box gridArea="arg_3_image" >
                <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto"}}
                >
                  <source src="/videos/talk_application.mp4" type="video/mp4"/> 
                </video>
              </Box>
            </Grid>

            <Box direction="row" gap="small" margin={{bottom: "44px", top: (renderMobileView ? "50px" : "150px") }}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
                Everything seminar organisers need, from start to finish
              </Text>
            </Box>

            <Grid
              rows={
                renderMobileView 
                ?  [
                  "440px", "200px", "150px",
                  "200px", "200px", "80px", "100px"
                  ]
                : [
                    '10px', "300px",
                    '10px', "300px",
                    '10px', '300px',
                  ]
              }
              columns={renderMobileView ? ["100%"] : ['50%', "50%"]}
              gap="70px"
              margin={renderMobileView ? {} : {left: "10px"}}
              areas={ renderMobileView 
                ?
                  [
                    { name: 'arg_5_text', start: [0, 0], end: [0, 1] },
                    { name: 'arg_5_image', start: [0, 1], end: [0, 2] },
    
                    { name: 'arg_4_text', start: [0, 2], end: [0, 3] },
                    { name: 'arg_4_image', start: [0, 3], end: [0, 4] },

                    { name: 'arg_8_text', start: [0, 4], end: [0, 5] },
                    { name: 'arg_8_image', start: [0, 5], end: [0, 6] },
                  ]
                :
                  [
                    { name: 'arg_5_text', start: [0, 1], end: [0, 2] },
                    { name: 'arg_5_image', start: [1, 0], end: [1, 1] },

                    { name: 'arg_4_text', start: [1, 2], end: [1, 3] },
                    { name: 'arg_4_image', start: [0, 2], end: [0, 3] },

                    { name: 'arg_8_text', start: [0, 4], end: [0, 5] },
                    { name: 'arg_8_image', start: [1, 4], end: [1, 5] },
                  ]
              }
            >

              <Box gridArea="arg_5_text">
                <Text size="25px" weight="bold" color="color3" margin={{bottom:"20px"}}>
                  Streaming technology made by academics for academics
                </Text>
                <Text size="18px">
                  We built an in-house streaming technology sculpted for online and hybrid academic seminars:
                </Text>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> Clean and easy-to-use interface for speakers </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> <b> Upload slides </b> and allow participants to go back and forth </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> Participants can <b> request the mic </b> and you have the control </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> LateX supported chat </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> Give a <b> round of applause </b> by pressing your space bar to broadcast a clap </Text>
                </Box>
              </Box>
              <Box gridArea="arg_5_image">
                <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto"}}
                >
                  <source src="/videos/url_streaming_homemade_or_agora.mp4" type="video/mp4"/> 
                </video>
              </Box>

              <Box gridArea="arg_4_text" justify="center">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Let your audience mingle in the virtual cafeteria
                </Text>
                <Text size="18px">
                  Your audience can grab a virtual coffee at the <img src={agoraLogo} height={"14px"}/> café 15 minutes before the start and 1 hour after the end of your seminar. 
                </Text>
                <Text size="18px" margin={{top: "10px"}}>
                  Networking and mingling with each other is <b> fun and intuitive, </b> a cozy place to chat about the event!
                </Text>
              </Box>
              <Box gridArea="arg_4_image">
                <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto"}}
                >
                  <source src="/videos/cafeteria_agora_minidemo.mp4" type="video/mp4"/> 
                </video>
              </Box>

              <Box gridArea="arg_8_text" justify="center">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Run a new transformative type of seminars: hybrid seminars! (coming soon!)
                  {/* Connect your online and physical audience with our mobile app (coming soon!) */}
                </Text>
                <Text size="18px">
                  With our mobile app, the physical audience can now browse the slides of the speaker on their phone, so they won't be lost 10 minutes in the seminar! 
                </Text>
                <Text size="18px" margin={{top: "10px"}}>
                  Both audiences can interact with each other through the chat and Q&A.
                </Text>
              </Box>
              <Box gridArea="arg_8_image">
                <img src="/images/connect_world.jpg" style={{ height: "100%", width: "auto"}}/> 
              </Box>

            </Grid>
              
          </Box>
          <Box width={renderMobileView ? "95%" : "70%"} alignContent="center" margin={{top: "100px", left: "10px"}}>
            <Box margin={{top:"70px"}} gap="30px">
              <Box direction="row" gap="30px" align="center"> 
                <Text size="25px" weight="bold" color="color1">
                  Create your <img src={agoraLogo} height="22px" style={{marginBottom: "-5px"}}/> now, for free!
                </Text>
                <CreateChannelButton 
                  onClick={this.toggleCreateChannelOverlay} 
                  width="190px" 
                  text={"Create your agora"}/>
              </Box>

              <Text size="18px" >
                An agora is a hub for your community. It is the place where you organise and list all your events, past or future.
              </Text>

              <Text size="18px" >
                If you wish to empower your community with awesome features, check out the pricing below!
              </Text>

            </Box>

            {this.state.agoraCreationOverlay.showCreateChannelOverlay && (
              <CreateChannelOverlay
                onBackClicked={this.toggleCreateChannelOverlay}
                onComplete={() => {
                  this.toggleCreateChannelOverlay();
                }}
                visible={true}
                user={this.props.user}
              />
            )}

            <PricingPlans 
              callback={() => {}}
              channelId={null}
              userId={null}
              disabled={true}
              showDemo={false}
              headerTitle={true}
              title={" "}
            />

          </Box>
        </Box>
    );
  }
}
