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
            <Text color="black" size="20px">
            <h1> <b>Welcome to Agora!</b> </h1> 
            <h2> <b>A. What does Agora believe in?</b></h2>

            <p>In 1989, the Word Wide Web was created by scientists with the goal to faciliate international scientific research communications. While we deeply believe in the values carried by this revolution, we also believe in the huge non-exploited potential of modern technologies in making the shining of research communities a lot more effective.
            </p>
            <p>
            Founded in 2020 by a team of researchers at Imperial College London and the University of Oxford, Agora believes in a connected world where ideas can be exchanged without any friction among inter- and intra-disciplinary communities in an efficient way.
            </p>
            <br/>

            <h2> <b>B. What is Agora? </b></h2>
            <p>
            Agora is a centralised research plateform allowing researchers to easily connect with communities as well as communities to connect with themselves.
            <br/>
            Every research group or research community is represented by an agora. The people managing an agora can create events (such as online seminars) and manage their community.
            <br/>
            Agora is sculpted for researchers by researchers.
            </p>
            <br/>

            <h2> <b>C. How to use Agora? </b></h2>
            <ul>
                <li> <h3><em>You are a researcher?</em> </h3></li>

                <ul>
                    <li> <b>Browse</b> efficiently through talks aligning with your research interests. </li>
                    <li> <b>Connect</b> with research communities and get updated about their future seminars </li>
                    <li> <b>Organise</b> all your seminar schedule in a centralised way (internal calendar syncable with Google Calendar) </li>
                    <li> <b>Access</b> the recordings** of past previous talks you might have missed </li>
                    <li> Easily <b>retrieve</b> any video-conferencing link of any event you registered to (the link is clearly released shortly before the start next to the event description). </li>
                </ul>

                <br/>
                <li><h3> <em>You are a leading figure of your community?</em> </h3></li>
                <ul>
                    <li> <b>Regroup</b> your members in a centralised way </li>
                    <li> <b>Increase</b> the exposure of your seminars by efficiently targetting your relevant public </li>
                    <li> <b>Offer</b> in a centralised place the recording of your previous seminars </li>
                    <li> <b>Connect</b> with other communities whose interests intersect with or complement yours </li>
                    <li> <b>Easily share</b> your agora page with people using your personalised URL of the form: <em>agora.stream/</em><b>your_agora_name</b></li>
                </ul>
            </ul>


            <h2> <b>D. Any questions? </b></h2>
            <p>Do you have any questions, inqueries, or suggestions? If yes, please reach out to us using the top right-hand side button, or drop us a message at agora.stream.inquiries(.at.)gmail.com! For more information, check our <a href="https://www.agora.stream/info/tos"> Term of services</a> and <a href="https://www.agora.stream/info/privacy"> data privacy policies</a>.
            </p>





            </Text>

          {/* </Box> */}


        </Box>
      </Box>
    );
  }
}
