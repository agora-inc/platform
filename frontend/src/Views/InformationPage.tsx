import React, { Component } from "react";
import { Link } from "react-router-dom";
import { User, UserService } from "../Services/UserService";
import { Box, Text } from "grommet";

interface Props {
  location: { state: { user: User } };
}

interface State {
  user: User;
  loading: boolean;
}

export default class InformationPage extends Component<Props, State> {
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
            <h1> <b>Welcome to agora.stream!</b> </h1> 
              <h2><strong>1) What do we believe in?</strong></h2>
                <p>In 1989, the Word Wide Web was created by scientists with the goal to faciliate international scientific research communications. While we deeply believe in the values carried by this revolution, we also believe in the huge non-exploited potential of modern technologies in making the shining of research communities a lot more effective.</p>
                {/* <p>Founded in 2020 by a team of researchers at Imperial College London and the University of Oxford, Agora believes in a connected world where ideas can be exchanged without any friction among inter- and intra-disciplinary communities in an efficient way.</p> */}
          
              <h2><strong>2) How to use agora.stream?</strong></h2>
                <p>We made the use of this plateform very intuitive.</p>
                <h3>a) Are you a researcher?&nbsp;</h3>
                  <ul>
                    <li><strong>Browse</strong> efficiently through talks aligning with your research interests.&nbsp;
                      <ul>
                        <li>Simply use the filter by topics to <strong>browse</strong> among talks hosted every other agoras (this is how we call research groups on our plateform). Alternatively, you can also go on the agora page of your community to see the incoming events.</li>
                      </ul>
                    </li>
                    <li><strong>Connect</strong> with research communities and get updated about their future seminars!&nbsp;
                      <ul>
                        <li>If interested by a talk, easily find the seminar link (e.g. zoom link, google hangouts, etc..) on the talk card 15 minutes / 1h or 24h before the event.</li>
                        <li>Note that some talks are open to everybody and do not require creating an agora account while other ones have restricted access (e.g. the link is only shown to people who have an agora account and who have been promoted to official member of the hosting agora)</li>
                      </ul>
                    </li>
                    <li><strong>Organise</strong> all your seminar schedule in a centralised way (internal calendar syncable with Google Calendar)&nbsp;
                      <ul>
                        <li>In addition to allow you to keep track of your agora of interests, creating an account on the plateform will also allow you to add events to our internal calendar that can be synced up with your google calendar! (Creating accounts are free!)</li>
                      </ul>
                    </li>
                  </ul>
                <h3>b) Are you a leading organisational figure of your community?&nbsp;</h3>
                  <ul>
                    <li><strong>Regroup</strong> <strong>your community</strong> in a centralised way!&nbsp;
                      <ul>
                        <li>Create your personalised agora page with your own banner, avatar and a description! On it, people will see your upcoming events and might register to them.</li>
                        <li>If your fellows are registered on agora.stream, you can promoted them to the status of <em>member</em> or <em>administrator</em> of your agora (in case there are several person in charge of the organisation of seminars).</li>
                      </ul>
                    </li>
                    <li><strong>Increase</strong> <strong>the exposure</strong> of your seminars by efficiently targetting your relevant public&nbsp;
                      <ul>
                        <li><strong>Create events with personalised access</strong> (i.e. <strong>you</strong> decide who will be able to see the zoom/hangout link leading to the talk: you have the option to set the visibility to "Everybody" (opening the event accessible to everybody,), or "Members" (i.e. the user must have created an account and be added as a registered member to the agora by an administrator).</li>
                      </ul>
                    </li>
                    <li>(Optional) If you decide to record your talks and upload them on Youtube, we offer the possibility for you to link your recording to your event: hence, people will be able to watch/re-watch the talk at any time!</li>
                  </ul>

                <h2><strong>3) Who are we?</strong></h2>
                  <p>Founded in 2020 by a team of three researchers at Imperial College London and the University of Oxford, Agora believes in a connected world where ideas can be exchanged without any friction among inter- and intra-disciplinary communities in an efficient way.</p>

                <h2><strong>4) Any questions? Reach out!</strong></h2>
                  <p>Do you have any questions, inqueries, or suggestions? If yes, please reach out to us using the top right-hand side button, or drop us a message at <em>agora.stream.inquiries(.at.)gmail.com</em>. For more information, check our{" "}
                    <Link to={"/info/tos"} color="brand">
                      <Text color="brand" weight="bold">
                        Term of services
                      </Text>
                    </Link>
                    {" "} and {"  "} 
                    <Link to={"/info/privacy"} color="brand">
                      <Text color="brand" weight="bold">
                      data privacy policies
                      </Text>
                    </Link>
                    .
                  </p>
          </Text>
        </Box>
      </Box>
    );
  }
}
