import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Grid, Heading, Text } from "grommet";
import VideoCard from "./VideoCard";
import { UserService } from "../Services/UserService";
import ShadowBox from "./ShadowBox";

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
      <ShadowBox
        direction="row"
        width="60vw"
        height="175px"
        margin="none"
        pad="large"
        align="center"
        justify="between"
        background="#606EEB"
        round="small"
        zIndex={1}
      >
        <Box width="60%" gap="small">
          <Text size="28px" weight="bold" color="white">
            Nobody is streaming right now
          </Text>
          <Text size="22px" color="#D8D8D8">
            While you’re waiting, why not explore some previous streams?
          </Text>
        </Box>
        <ShadowBox
          width="148px"
          height="62px"
          background="brand"
          round="small"
          justify="center"
          align="center"
          zIndex={3}
        >
          <Link
            to="/videos"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text size="24px" weight="bold" color="white">
              Explore
            </Text>
          </Link>
        </ShadowBox>
      </ShadowBox>
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
        width="75.8%"
        margin={{ top: "60px" }}
        style={
          {
            // height: 400,
          }
        }
      >
        {this.state.currentlyLive.length === 0
          ? this.ifNoLiveUsers()
          : this.ifLiveUsers()}
      </Box>
    );
  }
}
