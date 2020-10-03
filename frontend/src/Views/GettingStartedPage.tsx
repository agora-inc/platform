import React, { Component } from "react";
import { User, UserService } from "../Services/UserService";
import { Box, Text, TextArea } from "grommet";
import { Link } from "react-router-dom";

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


interface Props {
  location: { state: { user: User } };
}

interface State {
  user: User;
  loading: boolean;
  text: string
}

export default class GettingStartedPage extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: this.props.location.state
        ? this.props.location.state.user
        : UserService.getCurrentUser(),
      loading: true,
      text: ""
    };
  }

  componentWillMount() {
  }

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
        height="100vh"
        align="center"
        margin={{ top: "140px" }}
      >
        <Box width="75%">
          {/* <Box
            width="98.25%"
            height="950px"
            background="#C8EDEC"
            round="xsmall"
            pad="small"
            // gap="xsmall"
          > */}

            <h1><strong>Getting started! </strong></h1>
            <p>Welcome to agora. Here is a quick overview on how to use the site.</p>
            <div>
              <ReactPlayer
                url="https://www.youtube.com/embed/vlqhG3YGMUg"
                playing={true}
                controls
                width="60vw"
                height="60vh"
              />
            </div>
            <br></br>
            <br></br>
            <h1>FAQ</h1>
            <h2><strong>1. How to become a member of an agora?</strong></h2>
            <p>i) A user can become a member of an agora only if he is invited by one of its administrators. Inviting someone who already has an agora account will instantly make him member.</p>
            <img src={adding_email_addresses_registered}
              width="900vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            
            <p>ii) On the other side, if the person does not have an account, the invitation be shown in the 'invited members' section and the following email invitation will be sent:</p>
            <img src={adding_email_invitation}
              width="900vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <br></br>
            <img src={email_invitation}
              width="650vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <br></br>
            <p>iii) If the person decides to create an agora account using the address he has been invited to, then all membership invitation will automatically be transfered to his/her new account.</p>
            <img src={registration}
              width="900vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <br></br>
            <p>A list of all the newly acquired memberships will be stated in the registration email.</p>
            <img src={email_registration}
              width="550vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <br></br>
            <p> iv) The membership status to an agora will be highlighted on the top-right hand side of the page.</p>
            <img src={membership_top_right}
              width="900vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <br></br>
            <p> v) On the administrator side, once the invited user registered, its invitation will be removed from the 'Invited members' column and he/she will be transfered to the 'Agora members' one.</p>
            <img src={member_got_added_after_registration}
              width="900vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />

            {/* <h2><strong>1. Where to browse for talks?</strong></h2>
            <p>i) On the main page, you will be able to browse for upcoming talks given your topic of interest. Results will be shown below.&nbsp;</p>
            <div>
            <img src={homepage} 
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            </div>
            <br></br>

            <p>ii) The link to the event (e.g. zoom or microsoft teams) will be available on the talk card 15 minutes before the starting time. Accessing it requires the user to be logged in. </p>
            <img src={accessing_link}
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <br></br>
            <br></br>

            <h2><strong>2. How to create an agora?</strong></h2>
            <p>i) To create an agora, one must have a registered account. To do so, sign in using the top right-hand side button.</p>
            <img src={top_right_panel}            
            width="1150vw" 
            height="auto"
            max-width="230px"
            max-height="95px"
            />            
            <br></br>
            
            <p>ii) Once done, create an agora using the same panel.</p>
            <img src={create_agora}            
            width="1150vw" 
            height="auto"
            max-width="230px"
            max-height="95px"
            />
            <br></br>
            <p>iii) You can then personalise your agora by adding an avatar, banner as well as a description on your community!</p>
            <img src={create_agora_empty_page}
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <img src={agora_created_done}
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <br></br>
            <p>iv) You can also add your fellows as administrators or members!</p>
            <img src={admin_agora}
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />

            <br></br>
            <br></br>

            <h2><strong>3. How to create events?</strong></h2>
            <p>i) To create an event on an agora, you must be an administrator on the latter. Start by accessing your hosting agora using the top right-hand side panel.</p>
            <img src={top_right_panel_select_agora}              
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />            
            <br></br>
            <p>ii) Once in it, click on the 'Schedule talk' button on the top left-hand side.</p>
            <img src={agora_created_done}              
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />            
            <br></br>


            <p>iii) Fill in the information of your talk. Note that you can decide who can see the talk. For example, if the visibility option set to "Members only", only users will the "Member" status on the agora will be able to see and register for the talk.</p>
            <img src={create_event_done}
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <br></br>
            <br></br>

            <h2><strong>4. I saw a talk I am interested in. How can I add it to my calendar?</strong></h2>
            <p>i) After seeing a talk of your interest while browsing, click on the talk card and register to it (registering to a talk requires to be logged in). Note that registering to a talk will automatically add it to your internal agora calendar.</p>
            <img src={registering}
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />            
            <br></br>

            <p>ii) To add the event to your Google Calendar or iCalendar, click again on the talk card. The two mentioned options can then be found on it.</p>
            <br></br>

            <img src={talk_card_registered}
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <br></br>

            <p>iii) Alternatively, you can access your internal agora calendar. To do so, click on your top right-hand side panel and go to \"My schedule\".</p>
            <br></br>
            <img src={top_right_panel}
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <img src={internal_calendar}
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <h2><strong>5. Can I follow an agora that I like?</strong></h2>
            <p>i) Yes! Simply go on the agora page and click on the follow button (requires you to be logged in.)</p>
            <img src={following_agora}
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <br></br>

            <p>ii) The agoras you follow are displayed on the left hand side panel of the home page.</p>
            <br></br>
            
            <img src={homepage_following}
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <br></br> */}



            {/* <h2><strong>6. Can I watch previous talks?</strong></h2>
            <p>i) Yes! You can if the organiser decided to record it and make it public. To see the recording of a past talk, go on the "Recent talk" section on the homepage or simply on the hosting agora page. Click then on the event in question and then on "Watch talk".</p>
            <img src={}
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <br></br>


            <h2><strong>7. I am an agora administrator and recorded a talk. How can I link?</strong></h2>
            <p>i) If your talk has been uploaded somewhere and is accessible by a URL, simply log on your agora, scroll down to the "Past talks" section. Click then on the talk you want to add the URL link to.</p>
            <img src={}
              width="1150vw" 
              height="auto"
              max-width="230px"
              max-height="95px"
            />
            <br></br> */}




            {/* </Text> */}

          {/* </Box> */}

          <br></br>
          <br></br>
          <br></br>

          <h2><strong>Any questions? Reach out!</strong></h2>
          <p>Do you have any questions, inqueries, or feedbacks? If yes, please reach out to us using the top right-hand side button, or drop us a message at agora.stream.inquiries(.at.)gmail.com! For more information, check our{" "} 
            <Link to={"/info/tos"}>
              <Text weight="bold" color="brand">
                Term of services
              </Text>
            </Link>
            {" "} and {" "} 
            <Link to={"/info/privacy"}>
              <Text weight="bold" color="brand">
                data privacy policies
              </Text>
            </Link>
            .
          </p>
        </Box>
      </Box>
    );
  }
}
