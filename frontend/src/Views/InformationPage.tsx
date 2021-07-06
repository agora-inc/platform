import React, { Component } from "react";
import { Link } from "react-router-dom";
import { User, UserService } from "../Services/UserService";
import { Box, Text, Grid } from "grommet";
import MediaQuery from "react-responsive";
import { Checkmark, Close, Linkedin,  Twitter} from "grommet-icons";
import agoraLogo from "../assets/general/agora_logo_v2.1.png";
import DonorButton from "../Components/Pricing/DonorButton"



interface Props {
  location: { state: { user: User } };
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

export default class InformationPage extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      text: "",
      sizeHeader: "42px",
      sizeItem: "16px",
      sizeText: "14px",
      agoraCreationOverlay:
        {
          showCreateChannelOverlay: false
        }
    };
  }

  componentWillMount() {
  }


  render() {
    var renderMobileView = (window.innerWidth < 1000);

    return (

      <Box
        id="pricing"
        width="100vw"
        height="auto"
        align="center"
        margin={{ top: "8vh" }}
        // background="color6"
        >
        <Box width={renderMobileView ? "85%" : "70%"} direction="column" margin={{top: "80px"}}>
          <Box direction="row" gap="small" margin={{bottom: "44px"}}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
                Our vision
              </Text>
            </Box>
            <Text>In 1989, the World Wide Web was created by scientists to facilitate international scientific research communications. While we deeply believe in the values carried out by this revolution, we also see the huge unexploited potential of modern technologies at the service of researchers to broadly promote their research and reach out to the relevant audience. The COVID-19 crisis created an outburst of ad hoc solutions (e.g. websites hosting excel sheets of talks or nested mailing lists) to advertise the newly online seminars. While the majority of online talks are meant to disappear as soon as travel restrictions are lifted, we strongly believe that a technological paradigm shift should remain even after the pandemic. Indeed, online streaming technologies offer the tools to broadcast seminars in every place of the world, democratizing access to world-class research and reducing the carbon footprint associated with scholars' countless travels.</Text>


            <Box direction="row" gap="small" margin={{bottom: "44px", top: (renderMobileView ? "50px" : "100px") }}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
                Our mission
              </Text>
            </Box>
          {/* <Box margin={{bottom: "32px"}}>
            <Text size={this.state.sizeText} > Get your <img src={agoraLogo} height="14px"/> and your seminars up and running in <b>less than a minute</b>.
             </Text>
                               "70px", "80px", "200px",
                  "70px", "200px", "200px",
                  "70px", "110px", "200px",
                  "70px", "170px", "200px",
                  "70px", "100px", "200px",
          </Box> */}
            <Grid
              rows={
                renderMobileView 
                ?  [
                  "30px", "50px", "300px", 
                  "350px", "250px", "250px", 
                  "250px", "250px", "250px", 
                  "150px", "50px", "250px",
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
                    { name: 'arg_1_right', start: [0, 2], end: [0, 3] },
    
                    { name: 'arg_2_text', start: [0, 3], end: [0, 4] },
                    { name: 'arg_2_right', start: [0, 4], end: [0, 5] },
    
                    { name: 'arg_7_text', start: [0, 5], end: [0, 6] },
                    { name: 'arg_7_right', start: [0, 6], end: [0, 7] },
    
                    { name: 'arg_6_text', start: [0, 7], end: [0, 8] },
                    { name: 'arg_6_right', start: [0, 8], end: [0, 9] },
    
                    { name: 'arg_3_text', start: [0, 9], end: [0, 10] },
                    { name: 'arg_3_right', start: [0, 10], end: [0, 11] },
                  ]
                :
                  [
                  { name: 'arg_1_text', start: [0, 1], end: [0, 2] },
                  { name: 'arg_1_right', start: [1, 0], end: [1, 1] },

                  { name: 'arg_2_text', start: [1, 2], end: [1, 3] },
                  { name: 'arg_2_right', start: [0, 2], end: [0, 3] },

                  { name: 'arg_7_text', start: [0, 3], end: [0, 4] },
                  { name: 'arg_7_right', start: [1, 3], end: [1, 4] },

                  { name: 'arg_6_text', start: [1, 4], end: [1, 5] },
                  { name: 'arg_6_right', start: [0, 4], end: [0, 5] },

                  { name: 'arg_3_text', start: [0, 5], end: [0, 6] },
                  { name: 'arg_3_right', start: [1, 5], end: [1, 6] },
              ]
            }
            >
              <Box gridArea="arg_1_text" justify="center">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Carry on the mission of the founders of internet
                </Text>
                <Text size="18px">
                  In 1989, the World Wide Web was created by scientists to facilitate international scientific research communications. 
                  While we deeply believe in the values carried out by this revolution, we also see the huge unexploited potential of 
                  modern technologies at the service of researchers to broadly promote their research and reach out to the relevant audience.
                  The COVID-19 crisis created an outburst of ad hoc solutions 
                  (e.g. websites hosting excel sheets of talks or nested mailing lists) to advertise the newly online seminars. 
                  While the majority of online talks are meant to disappear as soon as travel restrictions are lifted, 
                  we strongly believe that a technological paradigm shift should remain even after the pandemic. 
                  Indeed, online streaming technologies offer the tools to broadcast seminars in every place of the world, 
                  democratizing access to world-class research and reducing the carbon footprint 
                  associated with scholars' countless travels.
                
                </Text>
                </Box>
              <Box gridArea="arg_1_right">
                <video 
                    autoPlay loop muted
                    style={{ height: "100%", width: "auto"}}
                  >
                  <source src="https://media.giphy.com/media/V3FqlRGEaJN5kjYE0D/giphy.mp4" type="video/mp4"/> 
                </video>
              </Box>

              <Box gridArea="arg_2_text" justify="center">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Allow every academic, independently of its location or affiliation, to be an active member of the network
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
              <Box gridArea="arg_2_right">
               <video 
                    autoPlay loop muted
                    style={{ height: "100%", width: "auto"}}
                    >
                    <source src="/videos/creation_speed_1mn_agora_15sec_version_15sec_version.mp4" type="video/mp4"/> 
                </video>
              </Box>


              <Box gridArea="arg_7_text" justify="center" >
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Reduce carbon footprint
                </Text>
                <Text size="18px">
                  You can decide to remind your community about upcoming event <b> without any work! </b>
                </Text>
                <Text size="18px" margin={{top: "10px"}}>
                  Simply choose the time and the group of people you want to send the reminder to, be it <b> all your followers, your mailing list or only the registered participants. </b>
                </Text>
              </Box>
              <Box gridArea="arg_7_right">
                <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto"}}
                >
                  <source src="/videos/email-reminders.mp4" type="video/mp4"/> 
                </video>
              </Box>

              <Box gridArea="arg_6_text" justify="center">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Facilitate cross-discipline collaborations and dialogue
                </Text>
                <Text size="18px">
                  As an organizer, you can decide to automatically accept certains group of people <b> everyone, only verified academics, only people from your institution, etc. </b>
                </Text>
                <Text size="18px" margin={{top: "10px"}}>
                  For the others, manually accepting them is made very easy and intuitive!
                </Text>
              </Box>
              <Box gridArea="arg_6_right">
                <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto"}}
                >
                  <source src="/videos/automatic-registration.mp4" type="video/mp4"/> 
                </video>
              </Box>


              <Box gridArea="arg_3_text" justify="center">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Finding speakers has never been easier
                </Text>
                <Text size="18px">
                  You can allow potential future speakers <b> from all around the world </b> to apply to give a talk to your community.
                </Text>
                <Text size="18px" margin={{top: "10px"}}>
                  Speakers fill out a form stating the <b> title and the abstract </b> of their talk, and you decide whether it's a fit.
                </Text>
              </Box>
              <Box gridArea="arg_3_right" >
                <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto"}}
                >
                  <source src="/videos/talk_application.mp4" type="video/mp4"/> 
                </video>
              </Box>
            </Grid>

            <Box direction="row" gap="small" margin={{bottom: "44px", top: (renderMobileView ? "50px" : "120px") }}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
                Our values
              </Text>
            </Box>

            <Grid
              rows={
                renderMobileView 
                ?  [
                  "400px", "200px", "150px",
                  "10px", "200px",
                  ]
                : [
                    '10px', "300px",
                    '10px', "300px",
                  ]
              }
              columns={renderMobileView ? ["100%"] : ['50%', "50%"]}
              gap="70px"
              margin={renderMobileView ? {} : {left: "10px"}}
              areas={ renderMobileView 
                ?
                  [
                    { name: 'arg_5_text', start: [0, 0], end: [0, 1] },
                    { name: 'arg_5_right', start: [0, 1], end: [0, 2] },
    
                    { name: 'arg_4_text', start: [0, 2], end: [0, 3] },
                    { name: 'arg_4_right', start: [0, 3], end: [0, 4] },
                  ]
                :
                  [
                    { name: 'arg_5_text', start: [0, 1], end: [0, 2] },
                    { name: 'arg_5_right', start: [1, 0], end: [1, 1] },

                    { name: 'arg_4_text', start: [1, 2], end: [1, 3] },
                    { name: 'arg_4_right', start: [0, 2], end: [0, 3] },
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
                  <Text> <b> Upload slides </b> to allow participants can go back and forth </Text>
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
              <Box gridArea="arg_5_right">
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
              <Box gridArea="arg_4_right">
                <video 
                  autoPlay loop muted
                  style={{ height: "100%", width: "auto"}}
                >
                  <source src="/videos/cafeteria_agora_minidemo.mp4" type="video/mp4"/> 
                </video>
              </Box>

            </Grid>
            <Box direction="row" gap="small" margin={{bottom: "100px", top: (renderMobileView ? "50px" : "150px") }}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
                Join your forces to ours!
              </Text>
            </Box>
            <Text>Does our mission and value resonate with you? Then join your forces to us! You can help our vision become a reality by</Text>
            <Box direction="row" gap="10px" margin={{left: "10px", top: "10px", bottom: "100px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> Clean and easy-to-use interface for speakers </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> <b> Upload slides </b> to allow participants can go back and forth </Text>
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

        </Box>














      
      // <Box
      //   width="100vw"
      //   height="100vh"
      //   align="center"
      //   margin={{ top: "10vh" }}
      // >
      //   <Box width="75%">
      //     {/* <Box
      //       width="98.25%"
      //       height="950px"
      //       background="#C8EDEC"
      //       round="xsmall"
      //       pad="small"
      //       // gap="xsmall"
      //     > */}
      //     <Text size="14px">
      //       <h1> <b>Welcome to agora.stream!</b> </h1> 
      //         <h2><strong>1) What do we believe in?</strong></h2>
      //           <p> In 1989, the World Wide Web was created by scientists to facilitate international scientific research communications. 
      //             While we deeply believe in the values carried out by this revolution, we also see the huge unexploited potential of 
      //             modern technologies at the service of researchers to broadly promote their research and reach out to the relevant audience. </p>
      //           <p> The COVID-19 crisis created an outburst of ad hoc solutions 
      //             (e.g. websites hosting excel sheets of talks or nested mailing lists) to advertise the newly online seminars. 
      //             While the majority of online talks are meant to disappear as soon as travel restrictions are lifted, 
      //             we strongly believe that a technological paradigm shift should remain even after the pandemic. 
      //             Indeed, online streaming technologies offer the tools to broadcast seminars in every place of the world, 
      //             democratizing access to world-class research and reducing the carbon footprint 
      //             associated with scholars' countless travels.  </p>
      //           <p>
      //             We are working on executing this vision by building a scalable, mature and long-term solution.
      //           </p>
      //           {/* <p>Founded in 2020 by a team of researchers at Imperial College London and the University of Oxford, Agora believes in a connected world where ideas can be exchanged without any friction among inter- and intra-disciplinary communities in an efficient way.</p> */}
      //         <h2><strong> 2) What is agora.stream? </strong></h2>
      //           <p> agora.stream is a centralised platform for academics to share their online events and manage their audience, as well as browse across a large selection of seminars in a smooth, easy and efficient way.</p>
      //         {/* <h2><strong> 3) How to use agora.stream?</strong></h2>
      //           <p>We made the use of this platform very intuitive.</p>
      //           <h3>a) Are you a researcher?&nbsp;</h3>
      //             <ul>
      //               <li><strong>Browse</strong> efficiently through talks aligning with your research interests.&nbsp;
      //                 <ul>
      //                   <li>Simply use the filter by topics to <strong>browse</strong> among talks hosted every other agoras (this is how we call research groups on our platform). Alternatively, you can also go on the agora page of your community to see the incoming events.</li>
      //                 </ul>
      //               </li>
      //               <li><strong>Connect</strong> with research communities and get updated about their future seminars!&nbsp;
      //                 <ul>
      //                   <li>If interested by a talk, easily find the seminar link (e.g. zoom link, google hangouts, etc...) on the talk card 15 minutes / 1h or 24h before the event.</li>
      //                   <li>Note that some talks are open to everybody and do not require creating an agora account while other ones have restricted access (e.g. the link is only shown to people who have an agora account and who have been promoted to official member of the hosting agora)</li>
      //                 </ul>
      //               </li>
      //               <li><strong>Organise</strong> all your seminar schedule in a centralised way (internal calendar syncable with Google Calendar)&nbsp;
      //                 <ul>
      //                   <li>In addition to allow you to keep track of your agora of interests, creating an account on the platform will also allow you to add events to our internal calendar that can be synced up with your google calendar! (Creating accounts are free!)</li>
      //                 </ul>
      //               </li>
      //             </ul>
      //           <h3>b) Are you a leading organisational figure of your community?&nbsp;</h3>
      //             <ul>
      //               <li><strong>Regroup</strong> <strong>your community</strong> in a centralised way!&nbsp;
      //                 <ul>
      //                   <li>Create your personalised agora page with your own banner, avatar and a description! On it, people will see your upcoming events and might register to them.</li>
      //                   <li>If your fellows are registered on agora.stream, you can promoted them to the status of <em>member</em> or <em>administrator</em> of your agora (in case there are several person in charge of the organisation of seminars).</li>
      //                 </ul>
      //               </li>
      //               <li><strong>Increase</strong> <strong>the exposure</strong> of your seminars by efficiently targetting your relevant public&nbsp;
      //                 <ul>
      //                   <li><strong>Create events with personalised access</strong> (i.e. <strong>you</strong> decide who will be able to see the zoom/hangout link leading to the talk: you have the option to set the visibility to "Everybody" (opening the event accessible to everybody,), or "Members" (i.e. the user must have created an account and be added as a registered member to the agora by an administrator).</li>
      //                 </ul>
      //               </li>
      //               <li>(Optional) If you decide to record your talks and upload them on Youtube, we offer the possibility for you to link your recording to your event: hence, people will be able to watch/re-watch the talk at any time!</li>
      //             </ul> */}

      //           <h2><strong>3) Who are we?</strong></h2>
      //             <p>We are a team of researchers at Imperial College London and the University of Oxford who believes in a connected world where ideas can be exchanged without any friction among inter- and intra-disciplinary communities in an efficient way.</p>

      //           <h2><strong>4) Any questions? Reach out!</strong></h2>
      //             <p>Do you have any questions, inqueries, or suggestions? If yes, please reach out to us using the top right-hand side button, or drop us a message at <em>agora.stream.inquiries(.at.)gmail.com</em>. For more information, check our{" "}
      //               <Link to={"/info/tos"} color="color1">
      //                 <Text color="color1" weight="bold" size="14px">
      //                   Term of services
      //                 </Text>
      //               </Link>
      //               {" "} and {"  "} 
      //               <Link to={"/info/privacy"} color="color1">
      //                 <Text color="color1" weight="bold" size="14px">
      //                 data privacy policies
      //                 </Text>
      //               </Link>
      //               .
      //             </p>
      //     </Text>
      //   </Box>
      // </Box>
    );
  }
}
