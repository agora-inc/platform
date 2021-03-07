import React, { Component } from "react";
import { User, UserService } from "../Services/UserService";
import { Box, Text, Grid} from "grommet";
import { Checkmark } from "grommet-icons";
import { Link } from "react-router-dom";
import { Launch, CircleQuestion, FormUp, FormDown, Test, Schedules, Help, Channel, PersonalComputer} from "grommet-icons";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import agorastreamLogo from "../assets/general/agora.stream_logo_v2.png";
import agoraLogo from "../assets/general/agora_logo_v2.png";
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
      sizeHeader: "28px",
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
        margin={{ top: "10vh" }}
      >
        <Box width="70%" direction="column">
          {/* <Box
            width="98.25%"
            height="950px"
            background="#C8EDEC"
            round="xsmall"
            pad="small"
            // gap="xsmall"
          > */}
          <Box direction="row" gap="small" margin={{bottom: "40px"}}>
            <Text size={this.state.sizeHeader} weight="bold"> Welcome to <img src={agorastreamLogo} height="28px"/>, the centralized platform to advertise and attend academic seminars! </Text>
          </Box>
          <Box margin={{bottom: "32px"}}>
            <Text size={this.state.sizeText} > Get your <img src={agoraLogo} height="14px"/> up and running in less than a minute.
             </Text>
          {/* <Text size={this.state.sizeText} style={{fontStyle:"italic", marginTop:"10px", marginBottom: "10px"}}>
            PS: while we try to update this page as often as possible, some parts might be outdated or missing due to a recent explosive growth of this website and the evergrowing speed of its development.
          </Text> */}
          </Box>

          <Text size={this.state.sizeText} weight="bold">Why having an <img src={agoraLogo} height={this.state.sizeText}/> simplifies your life:</Text>

            <Grid
              rows={['18px', '18px', '18px', '18px', '18px', '18px', '18px']}
              columns={['20px', 'large']}
              gap="15px"
              margin={{left: "10px", "top": "18px"}}
              areas={[
                { name: 'arg_1_icon', start: [0, 0], end: [0, 0] },
                { name: 'arg_1', start: [1, 0], end: [1, 0] },
                { name: 'arg_2_icon', start: [0, 1], end: [0, 1] },
                { name: 'arg_2', start: [1, 1], end: [1, 1] },
                { name: 'arg_3_icon', start: [0, 2], end: [0, 2] },
                { name: 'arg_3', start: [1, 2], end: [1, 2] },
                { name: 'arg_4_icon', start: [0, 3], end: [0, 3] },
                { name: 'arg_4', start: [1, 3], end: [1, 3] },
                { name: 'arg_5_icon', start: [0, 4], end: [0, 4] },
                { name: 'arg_5', start: [1, 4], end: [1, 4] },
                { name: 'arg_6_icon', start: [0, 5], end: [0, 5] },
                { name: 'arg_6', start: [1, 5], end: [1, 5] },
              ]}
            >
              <Box gridArea="arg_1_icon">
                <Checkmark/>
                </Box>
              <Box gridArea="arg_1">
                : Easy to customize and does not require maintenance.
                </Box>
              <Box gridArea="arg_2_icon">
                <Checkmark/>
                </Box>
              <Box gridArea="arg_2">
                : Control your audience and manage your talk registrations in a centralised place.
                </Box>

              <Box gridArea="arg_3_icon">
                <Checkmark/>
                </Box>
              <Box gridArea="arg_3">
                : Allow like-minded people around the world to connect with your events
                </Box>

              <Box gridArea="arg_4_icon">
                <Checkmark/>
                </Box>
              <Box gridArea="arg_4">
                : Allow potential future speakers to apply to give a talk within your community.
                </Box>

              <Box gridArea="arg_5_icon">
                <Checkmark/>
                </Box>
              <Box gridArea="arg_5">
                : Automated advertisement to your members, subscribers and all your social media followers.
                </Box>

              <Box gridArea="arg_6_icon">
                <Checkmark/>
                </Box>
              <Box gridArea="arg_6">
                : Event creation, advertisement to your community and social medias and registration management: <b>all can be done in less than a minute.</b>
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
