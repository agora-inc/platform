import React, { Component } from "react";
import { Box, Grid, Heading, Text } from "grommet";
import VideoCard from "./VideoCard";
import { UserService } from "../Services/UserService";
import { ReactComponent as EmptyImage } from "../empty.svg";

const users = UserService;

interface State {
  currentlyLive: string[];
}

export default class Carousel extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentlyLive: [],
    };
  }

  componentWillMount() {
    users.getLiveUsers((currentlyLive: string[]) => {
      this.setState({ currentlyLive });
    });
  }

  ifNoLiveUsers = () => {
    return (
      <Box
        direction="row"
        height="100%"
        margin="none"
        pad="none"
        align="center"
      >
        <EmptyImage height={400} style={{ margin: 0, padding: 0 }} />
        <Box margin={{ left: "medium" }}>
          <Heading level={3} margin="none">
            Looks like nobody is streaming right now 😞
          </Heading>
          <Text style={{ fontSize: 22, marginBottom: 10 }}>
            Please check back later!
          </Text>
        </Box>
      </Box>
    );
  };

  ifLiveUsers = () => {
    return (
      <Box align="center">
        <Heading style={{ fontSize: 64 }}>Currently live</Heading>
        <Grid
          rows={["small"]}
          columns={["medium", "medium", "medium"]}
          gap="small"
          areas={[
            { name: "one", start: [0, 0], end: [0, 0] },
            { name: "two", start: [1, 0], end: [1, 0] },
            { name: "three", start: [2, 0], end: [2, 0] },
          ]}
        >
          {/* <VideoCard gridArea="one" color="#606EEB" channelName="ImperialEEE" />
          <VideoCard gridArea="two" color="#61EC9F" channelName="ImperialEEE" />
          <VideoCard
            gridArea="three"
            color="accent-4"
            channelName="ImperialEEE"
          /> */}
        </Grid>
      </Box>
    );
  };

  render() {
    return (
      <Box
        margin={{ top: "60px" }}
        style={{
          height: 400,
        }}
      >
        {this.state.currentlyLive.length === 0
          ? this.ifNoLiveUsers()
          : this.ifLiveUsers()}
      </Box>
    );
  }
}
