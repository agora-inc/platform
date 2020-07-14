import React, { Component } from "react";
import { User, UserService } from "../Services/UserService";
import { Box, Text } from "grommet";

interface Props {
  location: { state: { user: User } };
}

interface State {
  user: User;
  loading: boolean;
}

export default class GettingStartedPage extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: this.props.location.state
        ? this.props.location.state.user
        : UserService.getCurrentUser(),
      loading: true,
    };
  }

  componentWillMount() {
  }


  render() {
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
            <Text color="black" size="18px">
            <p>Getting started:</p>
            <p>Welcome to agora! Here is a quick overview to use the website.</p>
            <p><strong>1. Where to browse for talks?</strong></p>
            <p>i) On the main page, you will be able to browse for upcoming talks given your topic of interest. Results will be shown below.&nbsp;</p>
            <p>ii) The link to the event (e.g. zoom or microsoft teams) will be available on the talk card 15 minutes before the starting time. Accessing it requires the user to be logged in. </p>
            <p><strong>2. How to create an agora?</strong></p>
            <p>i) To create an agora, one must have a registered account. To do so, sign in using the top right-hand side button.</p>
            <p>ii) Once done, create an agora using the same panel.</p>
            <p>iii) You can then personalise your agora by adding an avatar, banner as well as a description on your community!</p>
            <p>iv) You can also add your fellows as administrators or members!</p>
            <p><strong>3. How to create events?</strong></p>
            <p>i) To create an event on an agora, you must be an administrator on the latter. Start by accessing your hosting agora using the top right-hand side panel.</p>
            <p>ii) Once in it, click on the 'Schedule talk' button on the top left-hand side.</p>
            <p>iii) Fill in the information of your talk. Note that you can decide who can see the talk. For example, if the visibility option set to \"Members only\", only users will the "Member" status on the agora will be able to see and register for the talk.</p>
            <p><strong>4. I saw a talk I am interested in. How can I add it to my calendar?</strong></p>
            <p>i) After seeing a talk of your interest while browsing, click on the talk card and register to it (registering to a talk requires to be logged in). &nbsp;Registering to a talk will automatically adds it to your calendar.</p>
            <p>ii) To add the event to your Google Calendar or iCalendar, click again on the talk card. The two mentioned options can then be found on it.</p>
            <p>iii) Alternatively, you can access your internal agora calendar. To do so, click on your top right-hand side panel and go to \"My schedule\".</p>
            <p>5. There is an agora hosting events that I have been enjoying a lot. Is there a way for me to follow it?</p>
            <p>i) Yes! Simply go on the agora page and click on the follow button (requires you to be logged in.)</p>
            <p>ii) The agoras you follow are displayed on the left hand side panel of the home page.</p>
            </Text>

          {/* </Box> */}


        </Box>
      </Box>
    );
  }
}
