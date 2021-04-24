import React, { Component } from "react";
import { User, UserService } from "../Services/UserService";
import { Box, Text, Grid} from "grommet";
import { Checkmark } from "grommet-icons";
import { Link } from "react-router-dom";
import { Launch, CircleQuestion, FormUp, FormDown, Test, Schedules, Help, Channel, PersonalComputer} from "grommet-icons";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import agorastreamLogo from "../assets/general/agora.stream_logo_v2.1.png";
import agoraLogo from "../assets/general/agora_logo_v2.1.png";
import ChannelCreationButton from "../Components/Channel/CreateChannelButton";



import adding_email_addresses_registered from "../assets/getting-started/adding_members/adding_email_addresses_registered.png";
import adding_email_invitation from "../assets/getting-started/adding_members/adding_email_invitation.png";
import email_invitation from "../assets/getting-started/adding_members/email_invitation.png";
import registration from "../assets/getting-started/adding_members/registration.png";
import email_registration from "../assets/getting-started/adding_members/email_registration.png";
import member_got_added_after_registration from "../assets/getting-started/adding_members/member_got_added_after_registration.png";
import membership_top_right from "../assets/getting-started/adding_members/membership_top_right.png";


import accessing_link from "../assets/getting-started/accessing_link.png";
// import agora_created_done from "../assets/getting-started/agora_created_done.png";
// import create_agora from "../assets/getting-started/create_agora.png";
// import create_agora_empty_page from "../assets/getting-started/create_agora_empty_page.png";
// import create_event_done from "../assets/getting-started/create_event_done.png";
// import customize_agora_done from "../assets/getting-started/customize_agora_done.png";
// import homepage from "../assets/getting-started/homepage.png";
// import internal_calendar from "../assets/getting-started/internal_calendar.png";
// import registering from "../assets/getting-started/registering.png";
// import talk_card_registered from "../assets/getting-started/talk_card_registered.png";
// import top_right_panel from "../assets/getting-started/top_right_panel.png";
// import following_agora from "../assets/getting-started/following_agora.png";
// import homepage_following from "../assets/getting-started/homepage_following.png";
// import admin_agora from "../assets/getting-started/admin_agora.png";
// import top_right_panel_select_agora from "../assets/getting-started/top_right_panel_select_agora.png";
// import watch_past_talk from "../assets/getting-started/watch_past_talk.png";
// import LatexInput from "../Components/Streaming/LatexInput";
import ReactPlayer from "react-player"
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import CreateChannelButton from "../Components/Channel/CreateChannelButton";
import CreateChannelOverlay from "../Components/Channel/CreateChannelButton/CreateChannelOverlay";



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
    return (
      <Box
        width="100vw"
        height="400vh"
        align="center"
        margin={{ top: "8vh" }}
        background="color6"
        >
        <Box width="70%" direction="column" margin={{"top": "10px"}}>
          {/* <Box
            width="98.25%"
            height="950px"
            background="#C8EDEC"
            round="xsmall"
            pad="small"
            // gap="xsmall"
          > */}
          <Box direction="row" gap="small" margin={{bottom: "40px"}}>
            <Text size={this.state.sizeHeader} weight="bold" color="color1"> Everything you need for your seminars, all in one place</Text>
          </Box>
          <Box margin={{bottom: "32px"}}>
            <Text size={this.state.sizeText} > Get your <img src={agoraLogo} height="14px"/> and your seminars up and running in <b>less than a minute</b>.
             </Text>
          {/* <Text size={this.state.sizeText} style={{fontStyle:"italic", marginTop:"10px", marginBottom: "10px"}}>
            PS: while we try to update this page as often as possible, some parts might be outdated or missing due to a recent explosive growth of this website and the evergrowing speed of its development.
          </Text> */}
          </Box>
{/* 
          <Text size={this.state.sizeText} weight="bold"> What can you do with an <img src={agoraLogo} height={this.state.sizeText}/>?</Text> */}
            <Grid
              rows={
                [
                  '40px', "220px",
                  '40px', "220px",
                  '40px', "220px",
                  '40px', "220px",
                  '40px', "220px",
                  '40px', "220px",

                ]}
              columns={['50%', "50%"]}
              gap="15px"
              margin={{left: "10px", "top": "18px"}}
              areas={[
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
                { name: 'arg_6_image', start: [1, 10], end: [1, 11] },


              ]}
            >
              <Box gridArea="arg_1_title" alignSelf="center">
                <Text size="25px" weight="bold" color="color3">
                  Your targetted audience is right there
                  </Text>
                
                </Box>
              <Box gridArea="arg_1_text" >
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



              <Box gridArea="arg_2_title" alignContent="center">
                <Text size="25px" weight="bold" color="color3">
                  Organising is quick and easy
                  </Text>
                </Box>
              <Box gridArea="arg_2_text">
                <Text size="14px">
                  Our goal is to make organising academic seminars as <b>time-efficient</b> and <b>complete</b> as possible. On <img src={agorastreamLogo} height={"14px"} width="85px"/>, you can:
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
              <Box gridArea="arg_2_image" background="orange">
                [PLACEHOLDER GIFS]
                </Box>



              <Box gridArea="arg_3_title" alignContent="center">
                <Text size="25px" weight="bold" color="color3">
                  Allow potential future speakers to come to you
                  </Text>
                </Box>
              <Box gridArea="arg_3_text" margin={{top: "15px"}}>
                <Text size="14px">
                  Give the chance to potential future speakers from all around the world to apply to give a talk within your community. <img src={agorastreamLogo} height={"14px"} width="85px"/> via an in-build application form (this feature can be disabled).
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

                <Box gridArea="arg_4_title" alignContent="center">
                <Text size="25px" weight="bold" color="color3">
                Integrated virtual cafeteria
                  </Text>
                </Box>
              <Box gridArea="arg_4_text" margin={{top: "15px"}}>
                <Text size="14px">
                  Let your audience grab a pre/post-seminar coffee at the <img src={agoraLogo} height={"14px"}/> café
                Have you already experienced that unpleasant awkwardness when a seminar ends? Everybody clearly wants to mingle with each others and discuss about the event! Sadly, the mainstream streaming techs just feel very limited on that regard.
                On <img src={agorastreamLogo} height={"14px"}/>, every event has an 

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


              <Box gridArea="arg_5_title" alignContent="center">
                <Text size="25px" weight="bold" color="color3">
                  Use your own streaming URL or <img src={agoraLogo} height={"18px"}/> tech
                  </Text>
                </Box>
              <Box gridArea="arg_5_text" margin={{top: "15px"}}>
                <Text size="14px">
                  Do you already have a streaming plan? Do not worry. You can still enjoy many of the logistic features of <img src={agorastreamLogo} height={"14px"}/>: simply insert your own streaming URL during the event creation process.
                </Text>
                </Box>
              <Box gridArea="arg_5_image" background="orange">
                  [PACEHOLDER GIF]
                </Box>

              <Box gridArea="arg_6_title" alignContent="center">
                <Text size="25px" weight="bold" color="color3">
                  Host online or hybrid physical-online seminars
                  </Text>
                </Box>
              <Box gridArea="arg_6_text" margin={{top: "15px"}}>
                <Text size="14px">
                  The <img src={agoraLogo} height={"14px"}/> streaming technology is sculpted for both online and hybrid online-physical seminars.
                  <ul>
                    <li><b>Clean and easy-to-use interface</b> for the speakers</li>
                    <li><b>Augmented interface</b> for the organisers</li>
                    <li><b>Ability for seminar participants to request the mic</b></li>
                    <li><b>Give a round of applause</b> by pressing your space bar to broadcast a clap in the room -- <i>event triggered by an organiser only</i></li>
                    <li><b>Online audience is automatically redirected</b> to the <img src={agoraLogo} height={"14px"}/> cafeteria once the talk is over</li>
                    <li><b>Connect physical and online audience</b> with a mobile app</li>
                    <li>LateX supported chat, and much more!</li>
                  </ul>
                </Text>
                </Box>
              <Box gridArea="arg_6_image" background="orange">
                <Text size="28px">
                  Public release soon. Interested to try it? Contact us!
                  </Text>
                </Box>
            </Grid>
                





            <CreateChannelButton 
              onClick={this.toggleCreateChannelOverlay} 
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
          </Box>
        </Box>
    );
  }
}
