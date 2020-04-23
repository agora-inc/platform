import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Heading } from "grommet";
import ScheduledStreamCard from "./ScheduledStreamCard";
import { ScheduledStream } from "../Services/ScheduledStreamService";
import "../Styles/home.css";

interface State {
  scheduledStreams: ScheduledStream[];
}

export default class ScheduledStreamList extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      scheduledStreams: [],
    };
  }

  componentWillMount() {
    const dummyStream = {
      id: 1,
      channel_id: 1,
      channel_name: "ImperialBioEng",
      name:
        "An introduction to image transforms and their applications in compression and edge recognition",
      description: "",
      date: new Date(),
    };
    this.setState({
      scheduledStreams: [dummyStream, dummyStream, dummyStream],
    });
  }

  render() {
    return (
      <Box width="82.5%" align="center" margin={{ top: "60px" }}>
        <Link to="/scheduled" style={{ marginBottom: 25, padding: 0 }}>
          <Heading
            style={{ fontSize: 48 }}
            className="sliding-underline"
            margin="none"
          >
            Upcoming streams
          </Heading>
        </Link>
        <Box gap="small">
          {this.state.scheduledStreams.map((stream: ScheduledStream) => (
            <ScheduledStreamCard stream={stream} />
          ))}
        </Box>
      </Box>
    );
  }
}
