import React, { Component } from "react";
import { Box } from "grommet";
import ChannelPageScheduledStreamCard from "./ChannelPageScheduledStreamCard";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../Services/ScheduledStreamService";
import Loading from "./Loading";

interface Props {
  scheduledStreams: ScheduledStream[];
  channelId: number;
  loggedIn: boolean;
  admin: boolean;
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
    // this.fetchScheduledStreams();
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
    return (
      <Box gap="medium" direction="row" width="100%">
        {this.props.scheduledStreams.map((stream: ScheduledStream) => (
          <ChannelPageScheduledStreamCard
            stream={stream}
            loggedIn={this.props.loggedIn}
            admin={this.props.admin}
          />
        ))}
      </Box>
    );
  }
}
