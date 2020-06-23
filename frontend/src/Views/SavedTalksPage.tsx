import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Box, Text } from "grommet";
import { Talk, TalkService } from "../Services/TalkService";
import { User, UserService } from "../Services/UserService";
import Loading from "../Components/Core/Loading";
import TalkList from "../Components/Talks/TalkList";

interface Props {
  location: { state: { user: User } };
}

interface State {
  user: User | null;
  talks: Talk[];
  loading: boolean;
}

export default class SavedTalksPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: this.props.location.state
        ? this.props.location.state.user
        : UserService.getCurrentUser(),
      talks: [],
      loading: true,
    };
  }

  componentWillMount() {
    this.fetchTalks();
  }

  fetchTalks = () => {
    this.state.user &&
      TalkService.getSavedTalksForUser(this.state.user.id, (talks: Talk[]) => {
        this.setState({ talks, loading: false });
      });
  };

  render() {
    return this.state.user === null ? (
      <Redirect to="/" />
    ) : (
      <Box
        width="100vw"
        height="100vh"
        align="center"
        margin={{ top: "140px" }}
      >
        <Box width="75%">
          <Box
            width="98.25%"
            height="80px"
            background="#CEFEE9"
            round="xsmall"
            pad="small"
            // gap="xsmall"
          >
            <Text color="black" weight="bold" size="18px">
              Welcome to your library
            </Text>
            <Box direction="row" align="center" gap="xsmall">
              <Text>You have</Text>
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
              <Text>saved talks</Text>
            </Box>
          </Box>
          {this.state.loading && (
            <Box width="100%" align="center" margin={{ top: "200px" }}>
              <Loading size={50} color="black" />
            </Box>
          )}
          <TalkList
            past
            seeMore={false}
            talks={this.state.talks}
            title={false}
            topicSearch={true}
            user={this.state.user}
            onUnsave={this.fetchTalks}
          />
        </Box>
      </Box>
    );
  }
}
