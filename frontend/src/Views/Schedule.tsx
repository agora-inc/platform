import React, { Component } from "react";
import { Box, Text } from "grommet";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../Services/ScheduledStreamService";
import { User } from "../Services/UserService";
import ScheduledStreamList from "../Components/ScheduledStreamList";
import Loading from "../Components/Loading";

interface Props {
  location: { state: { user: User } };
}

interface State {
  user: User;
  loading: boolean;
  scheduledStreams: ScheduledStream[];
}

export default class Schedule extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: this.props.location.state.user,
      loading: true,
      scheduledStreams: [],
    };
  }

  componentWillMount() {
    this.fetchScheduledStreams();
  }

  fetchScheduledStreams = () => {
    ScheduledStreamService.getScheduledStreamsForUser(
      this.state.user.id,
      (scheduledStreams: ScheduledStream[]) => {
        this.setState({ scheduledStreams: scheduledStreams, loading: false });
      }
    );
  };

  render() {
    return (
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
              Welcome to your personal schedule 📅
            </Text>
            <Box direction="row" align="center" gap="xsmall">
              <Text>You are currently registered for</Text>
              <Box
                height="25px"
                width="25px"
                round="12.5px"
                justify="center"
                align="center"
                background="lightgray"
              >
                <Text weight="bold">{this.state.scheduledStreams.length}</Text>
              </Box>
              <Text>Upcoming talks</Text>
            </Box>
          </Box>
          {this.state.loading && (
            <Box width="100%" align="center" margin={{ top: "200px" }}>
              <Loading size={50} color="black" />
            </Box>
          )}
          <ScheduledStreamList
            title={false}
            seeMore={false}
            scheduledStreams={this.state.scheduledStreams}
            user={this.state.user}
          />
        </Box>
      </Box>
    );
  }
}
