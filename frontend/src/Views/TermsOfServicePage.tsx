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

export default class TermsOfService extends Component<Props, State> {
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
            height="3000px"
            background="#C8EDEC"
            round="xsmall"
            pad="small"
            // gap="xsmall"
          > */}
            <Text size="14px">
            <h1><b>Terms of service</b></h1>
            <p>Simply put, we thrive to maintain a high scientific standard of conduct on this platform. The following paragraphs are here to set the ground guidelines of usage for you, the user, and state the rights we have to sanction any misconduct. </p>

            <h2><b>1. Use of the site</b></h2>
            <ol>
              <li> All added content to mora.stream must be academic-related.</li>
              <li> The Users should not attempt to use the site for any purpose other than browsing through past and future events, connecting with communities, organizing, and publicizing events on research.</li>
            </ol>

            <h2><b>2. Code of conduct</b></h2>
            <ol>
              <li> The User commit to act with the values of honesty, trust, fairness, respect and responsibility in learning, teaching and research.</li>
              <li> The User commits to not voluntarily spread misinformation.</li>
              <li> The User commits to behave without any discrimination with regard to age, disability, caste, nationality, carer and parental status, ethnicity, race, religious beliefs, gender identity, gender expression, sexual orientation, employment activity, marital status, physical features, political belief or activity.</li>
              <li> The User will not distribute or promote advertising or commercial promotional content, or send unsolicited advertising, job offers, or business proposals;</li>
              <li> The User will not post requests for or distribute any unauthorized copyrighted material (e.g. software, books, publications) or "pirated" or "cracked" versions of software;</li>
              <li> When creating his account, the User commits to not take someone's else identity or to falsely claim an affiliation.</li>
              <li> When participating in communication of any kind, the User may not use language that could be offensive or vulgar to others.</li>
              <li> When publishing an event, the User will check with the people involved with the former that they give him/her their approval concerning the content and the accuracy of the information associated with the event.</li>
              <li> When using a third-party technology, the User will be careful to not share any confidential information. Note that mora.stream will never reach out to the User to ask for his password or account credentials.</li>
            </ol>



            <h2><b>3. Liability</b></h2>

            While the above code of conduct is highly valued by us and its respect is one of our main mission, mora.stream cannot be held responsible nor liable for any harm caused through the use of this site.
              <ol>
                <li> While the above code of conduct is highly valued by us and its respect is one of our main mission, mora.stream cannot be held responsible nor liable for any harm caused through the use of this site. </li>
                <li> mora.stream cannot be held responsible for technical issues or any harm originating from a third-party technology (e.g. <em>Zoom</em> or <em>Microsoft Teams</em> among others). </li>
                <li> Any action, comment, or opinion of a User of mora.stream does not necessarely represent mora.stream's position. </li>
                <li> While we commit to serve the research community in a whole, Agora makes no guarantee of the availability of the website at anytime: its usage is at the user's risk. </li>
              </ol>
            <h2><b>4. Violations</b></h2>
              <ol>
                <li> In case of violations of term of services and code of conduct or whether it is judged inappropriate, mora.stream reserves the right to edit or delete the content hosted on the platform. </li>
                <li> In case of misconduct, mora.stream reserves the right to temporarily or permanently disable an account or IP address. </li>
              </ol>
            <h2><b>5. General information</b></h2>
              <ol>
                <li> mora.stream's mission is to connect the world of science and make research open to all. Any natural or legal person who, as a recipient of the Service, accesses or uses the Service for any purpose is a User ("User", "you"). Our registered Users ("Members") share their professional identities and credentials, engage and collaborate with their networks and exchange knowledge. Some content is also visible to unregistered and logged-out Users ("Visitors"). </li>
                <li> Use of our services constitutes acceptance of the Terms of service. </li>
                <li> These terms are subject to change. </li>
              </ol>
            <h2><b>6. Contacts</b></h2>
                <p>Contact information: <em>agora.stream.inquiries(.at.)gmail.com</em></p>
                <p><em>Last revision: 16 June 2020 </em></p>
            </Text>
          {/* </Box> */}

        </Box>
      </Box>
    );
  }
}
