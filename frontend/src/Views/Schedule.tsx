import React, { Component } from "react";
import { Box, Text, Heading } from "grommet";
import { Talk, TalkService } from "../Services/TalkService";
import { User, UserService } from "../Services/UserService";
import TalkList from "../Components/Talks/TalkList";
import Loading from "../Components/Core/Loading";

interface Props {
  location: { state: { user: User } };
}

interface State {
  user: User;
  loading: boolean;
  talks: Talk[];
}

export default class Schedule extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: this.props.location.state
        ? this.props.location.state.user
        : UserService.getCurrentUser(),
      loading: true,
      talks: [],
    };
  }

  componentWillMount() {
    this.fetchTalks();
  }

  fetchTalks = () => {
    TalkService.getRegisteredTalksForUser(
      this.state.user.id,
      (talks: Talk[]) => {
        this.setState({ talks: talks, loading: false });
      }
    );
  };

  render() {
    return (
      <Box
        pad={{ top: "7.5%", bottom: "100px" }}
        width="100vw"
        height="100vh"
        align="center"
        
      > 
      <Box 
        margin={{left: "2.5%"}}
        width="90%"
      >
        <Box margin={{bottom: "30px"}}>
          <Heading
            color="black"
            size="24px"
            margin="none"
            style={{ height: "20px" }}
          >
            Personal schedule
          </Heading>
        </Box>

          <Box
            width="553px"
            height="50px"
            background="#F3EACE"
            round="xsmall"
            pad="small"
            // gap="xsmall"
          >
            <Box direction="row" align="center" gap="xsmall">
              <Text> Currently registered for</Text>
              <Box
                height="25px"
                width="25px"
                round="12.5px"
                justify="center"
                align="center"
                background="lightgray"
              >
                <Text weight="bold">{this.state.talks.length}</Text>
              </Box>
              <Text> talks</Text>
            </Box>
          </Box>
          {this.state.loading && (
            <Box width="100%" align="center" margin={{ top: "200px" }}>
              <Loading size={50} color="black" />
            </Box>
          )}
          <TalkList
            seeMore={false}
            talks={this.state.talks}
            title={false}
            user={this.state.user}
          />
        </Box>
      </Box>
    );
  }
}
