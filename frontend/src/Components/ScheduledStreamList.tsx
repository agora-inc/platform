import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Heading, Text } from "grommet";
import ScheduledStreamCard from "./ScheduledStreamCard";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../Services/ScheduledStreamService";
import { FormNextLink } from "grommet-icons";
import "../Styles/home.css";
import "../Styles/see-more-button.css";

interface Props {
  gridArea?: string;
  title: boolean;
  seeMore: boolean;
  loggedIn: boolean;
}

interface State {
  loading: boolean;
  scheduledStreams: ScheduledStream[];
}

export default class ScheduledStreamList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      scheduledStreams: [],
    };
  }

  componentWillMount() {
    this.fetchScheduledStreams();
  }

  fetchScheduledStreams = () => {
    ScheduledStreamService.getAllScheduledStreams(
      (scheduledStreams: ScheduledStream[]) => {
        this.setState({ scheduledStreams, loading: false });
      }
    );
  };

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
        <Box gap="medium" direction="row" width="100%" height="100%">
          {this.state.scheduledStreams.map((stream: ScheduledStream) => (
            <ScheduledStreamCard
              stream={stream}
              loggedIn={this.props.loggedIn}
            />
          ))}
        </Box>
      </Box>
    );
  }
}
