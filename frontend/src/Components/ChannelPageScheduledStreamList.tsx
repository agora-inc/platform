import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Heading, Text } from "grommet";
import ChannelPageScheduledStreamCard from "./ChannelPageScheduledStreamCard";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../Services/ScheduledStreamService";
import Loading from "./Loading";

interface Props {
  channelId: number;
  loggedIn: boolean;
}

interface State {
  scheduledStreams: ScheduledStream[];
  loading: boolean;
}

export default class ChannelPageScheduledStreamList extends Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scheduledStreams: [],
      loading: true,
    };
  }

  componentWillMount() {
    this.fetchScheduledStreams();
  }

  fetchScheduledStreams = () => {
    ScheduledStreamService.getScheduledStreamsForChannel(
      this.props.channelId,
      (scheduledStreams: ScheduledStream[]) => {
        this.setState({ scheduledStreams, loading: false });
      }
    );
  };

  render() {
    return this.state.loading ? (
      <Box height="325px" align="center" justify="center" width="100%">
        <Loading size={50} color="black" />
      </Box>
    ) : (
      <Box>
        <Box gap="medium" direction="row" width="100%">
          {this.state.scheduledStreams.map((stream: ScheduledStream) => (
            <ChannelPageScheduledStreamCard
              stream={stream}
              loggedIn={this.props.loggedIn}
            />
          ))}
        </Box>
      </Box>
    );
  }
}
