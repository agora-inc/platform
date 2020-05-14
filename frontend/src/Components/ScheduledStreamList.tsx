import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Heading, Text } from "grommet";
import NewScheduledStreamCard from "./NewScheduledStreamCard";
import { ScheduledStream } from "../Services/ScheduledStreamService";
import { FormNextLink } from "grommet-icons";
import "../Styles/home.css";
import "../Styles/see-more-button.css";

interface Props {
  gridArea?: string;
  title: boolean;
  seeMore: boolean;
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
        <Box
          direction="row"
          gap="small"
          align="center"
          margin={{ bottom: "20px" }}
        >
          {this.props.title && (
            <Text size="32px" weight="bold" color="black" margin="none">
              Upcoming streams
            </Text>
          )}
          {this.props.seeMore && (
            <Link to="/scheduled" style={{ textDecoration: "none" }}>
              <Box
                className="see-more-button"
                pad={{ vertical: "xsmall", horizontal: "small" }}
                round="xsmall"
                style={{ border: "2px solid black" }}
                direction="row"
                align="end"
              >
                <Text color="black">See more</Text>
                <FormNextLink color="black" />
              </Box>
            </Link>
          )}
        </Box>
        <Box gap="medium" direction="row" justify="between" width="100%">
          {this.state.scheduledStreams.map((stream: ScheduledStream) => (
            <NewScheduledStreamCard stream={stream} />
          ))}
        </Box>
      </Box>
    );
  }
}
