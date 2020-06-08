import React, { Component } from "react";
import { Box } from "grommet";
import ChannelPageScheduledStreamCard from "./ChannelPageScheduledStreamCard";
import { User } from "../../Services/UserService";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../../Services/ScheduledStreamService";
import Loading from "../Core/Loading";

interface Props {
  scheduledStreams: ScheduledStream[];
  channelId: number;
  user: User | null;
  admin: boolean;
  onEditCallback?: any;
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
    ScheduledStreamService.getFutureScheduledStreamsForChannel(
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
            user={this.props.user}
            admin={this.props.admin}
            onEditCallback={this.props.onEditCallback}
          />
        ))}
      </Box>
    );
  }
}
