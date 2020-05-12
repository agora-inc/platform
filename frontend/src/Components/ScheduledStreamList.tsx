import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Heading, Text } from "grommet";
import NewScheduledStreamCard from "./NewScheduledStreamCard";
import { ScheduledStream } from "../Services/ScheduledStreamService";
import "../Styles/home.css";

interface Props {
  gridArea?: string;
  title: boolean;
}

interface State {
  scheduledStreams: ScheduledStream[];
}

export default class ScheduledStreamList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scheduledStreams: [],
    };
  }

  componentWillMount() {
    const dummyStream1 = {
      id: 1,
      channel_id: 1,
      channel_name: "RenTec",
      name: "Timeseries forecasting for fun and profit",
      description: "",
      date: new Date(),
    };
    const dummyStream2 = {
      id: 1,
      channel_id: 1,
      channel_name: "PolyAI",
      name:
        "An introduction to generative language models and their uses in translation and chatbots",
      description: "",
      date: new Date(),
    };
    const dummyStream3 = {
      id: 1,
      channel_id: 1,
      channel_name: "DeepMind",
      name: "A survey of recent advances in reinforcement learning",
      description: "",
      date: new Date(),
    };
    this.setState({
      scheduledStreams: [dummyStream1, dummyStream2, dummyStream3],
    });
  }

  render() {
    return (
      <Box height="100%" gridArea={this.props.gridArea}>
        <Link to="/scheduled" style={{ marginBottom: 25, padding: 0 }}>
          {this.props.title && (
            <Text
              size="32px"
              weight="bold"
              color="black"
              className="sliding-underline"
              margin="none"
            >
              Upcoming streams
            </Text>
          )}
        </Link>
        <Box gap="medium" direction="row" justify="between" width="100%">
          {this.state.scheduledStreams.map((stream: ScheduledStream) => (
            <NewScheduledStreamCard stream={stream} />
          ))}
        </Box>
      </Box>
    );
  }
}
