import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import PastScheduledStreamCard from "../ScheduledStreams/PastScheduledStreamCard";
import Loading from "../Core/Loading";
import { FormNextLink } from "grommet-icons";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../../Services/ScheduledStreamService";

interface State {
  talks: ScheduledStream[];
  loading: boolean;
}

export default class RecentTalksList extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      talks: [],
      loading: true,
    };
  }

  componentWillMount() {
    this.fetchPastTalks();
  }

  fetchPastTalks = () => {
    ScheduledStreamService.getAllPastScheduledStreams(
      6,
      0,
      (talks: ScheduledStream[]) => {
        this.setState({ talks, loading: false });
      }
    );
  };

  render() {
    return (
      <Box width="100%">
        <Box
          width="100%"
          direction="row"
          gap="xsmall"
          align="end"
          margin={{ bottom: "15px" }}
        >
          <Text size="26px" weight="bold" color="black" margin="none">
            Recent talks
          </Text>
          <Link to="/past" style={{ textDecoration: "none" }}>
            <Box
              className="see-more-button"
              pad={{ vertical: "2px", horizontal: "xsmall" }}
              round="xsmall"
              style={{ border: "2px solid black" }}
              direction="row"
              align="end"
            >
              <Text color="black">See more</Text>
              <FormNextLink color="black" />
            </Box>
          </Link>
        </Box>
        <Box gap="small" direction="row" width="100%" height="100%" wrap>
          {this.state.talks.map((talk: ScheduledStream) => (
            <PastScheduledStreamCard stream={talk} user={null} />
          ))}
        </Box>
      </Box>
    );
  }
}
