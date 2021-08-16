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

export default class PrivacyPage extends Component<Props, State> {
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
        margin={{ top: "10vh" }}
      >
        <Box width="75%">
          {/* <Box
            width="98.25%"
            height="1500px"
            background="#C8EDEC"
            round="xsmall"
            pad="small"
            // gap="xsmall"
          > */}
            <Text color="black" size="14px">
                <h1><b>Data privacy </b></h1>
                <p>As with any other website, when using mora.stream, your internet browser and our servers exchange data. We are going to tell you exactly what transacts and how it is used.
                </p>

                <h2> <b>1. What type of data is exchanged? </b></h2>

                <h4><b>Data gathered from anonymous browsing </b></h4>

                <p>
                Users of the website send requests to our server to receive contents. To allow us to better understand the average request pattern and better develop our infrastructure, we sometimes gather the date and order of the browsing requests, type of internet browser used, and a rough geographical approximation of the location of the user.
                </p>

                <h4><b>Data gathered from a registered member</b></h4>

                <p>
                When creating an account, the User sends us some data (such as name, affiliation, URL for personal website, email address, etc.) that we securely store: this data is also updated on our side when the Member updates these account information. 
                <br/>
                The data associated to user actions (such as following an agora channel or registering for a talk) is also stored on our servers. 
                </p>
                
                <h4><b>Data published from a registered member</b></h4>


                <p>
                The Agora administrators publish content on the website when they create events: this data has the objective to give more information regarding the content of the event that is going to be held as well as some information associated to the event organisers (name, etc). 
                </p>

                <h2> <b>2. How is your data used?</b> </h2>

                <p>
                Your data is used in two clear ways: either it contributes to the content of the website or it is only seen by used to motivate software architectural decisions.
                <ul>

                <li> The one gathered from anonymous browsing is only seen by us and is not exchanged with anybody else. We use it consolidate or motivate 
                  software architectural choices associated with the platform. </li>
                <li> The one gathered from the registered member is partly personal
                   (data associated to user actions, username, password, schedule...) and partly contributing into the content of the website (full name). 
                  For some of the data, the User can decide what is going to be public or 
                  private (e.g. afiiliation among others). </li>
                <li> Regarding the data published from a registered member, this 
                  has to be seen as semi-public data as this depends on the visibility 
                  that the User set on the event (e.g. an event whose visibility is 
                  "for community members" will not be visible to any users who is not part 
                  of the hosting agora). </li>
                </ul>
                </p>

                <h2> <b>3. What are your data protection rights?</b> </h2>
                <p>
                For users in the EU, we would like to make sure you are fully aware of all of your data protection rights. Every User is entitled to the following:
                
                <ol>
                  <li> <em>The right to access</em> – You have the right to request us for copies of your personal data. We may charge you a small fee for this service.</li>
                  <li> <em>The right to rectification</em> – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request Our Company to complete the information you believe is incomplete.</li>
                  <li> <em>The right to erasure</em> – You have the right to request that we erase your personal data, under certain conditions.</li>
                  <li> <em>The right to erasure</em> – You have the right to request that we erase your personal data, under certain conditions.</li>
                  <li> <em>The right to restrict processing</em> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                  <li> <em>The right to object to processing</em> – You have the right to object to our processing of your personal data, under certain conditions.</li>
                  <li> <em>The right to data portability</em> – You have the right to request that we transfer the data that we have collected to another organisation, or directly to you, under certain conditions.</li>
                  <li> <em>The right to access</em> – You have the right to request us for copies of your personal data. We may charge you a small fee for this service.</li>
                </ol>
                </p>

                <h2> <b>4. Contacts</b> </h2>
                <p>Contact information: <em>agora.stream.inquiries(.at.)gmail.com</em></p>
                <p><em>Last revision: 16 June 2020 </em></p>
            </Text>
          {/* </Box> */}


        </Box>
      </Box>
    );
  }
}
