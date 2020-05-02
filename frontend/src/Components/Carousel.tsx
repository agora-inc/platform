import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Grid, Heading, Text } from "grommet";
import StreamCard from "./StreamCard";
import { UserService } from "../Services/UserService";
import { Stream, StreamService } from "../Services/StreamService";
import ShadowBox from "./ShadowBox";

const users = UserService;

interface Props {
  gridArea: string;
}

interface State {
  streams: Stream[];
}

export default class Carousel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      streams: [],
    };
  }

  componentWillMount() {
    StreamService.getAllStreams((streams: Stream[]) => {
      this.setState({ streams });
    });
  }

  ifNoStreams = () => {
    return (
      <Box
        width="100%"
        height="100%"
        margin="none"
        pad="25px"
        justify="between"
        background="black"
        round="20px"
        alignSelf="center"
        // zIndex={1}
      >
        <Text size="36px" weight="bold" color="white">
          Nobody is streaming right now
        </Text>
        <Box direction="row" justify="between" align="end">
          <Text
            size="26px"
            weight="bold"
            color="#D8D8D8"
            style={{ width: 357 }}
          >
            While you’re waiting, why not explore some previous streams?
          </Text>
          <Box
            width="153px"
            height="57px"
            background="white"
            round="40px"
            justify="center"
            align="center"
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
              <Text size="24px" weight="bold" color="black">
                Explore
              </Text>
            </Link>
          </Box>
        </Box>
      </Box>
    );
  };

  ifStreams = () => {
    return (
      // <Box align="center">
      //   <Heading style={{ fontSize: 64 }}>Currently live</Heading>
      //   <Grid
      //     rows={["small"]}
      //     columns={["medium", "medium", "medium"]}
      //     gap="small"
      //     areas={[
      //       { name: "one", start: [0, 0], end: [0, 0] },
      //       { name: "two", start: [1, 0], end: [1, 0] },
      //       { name: "three", start: [2, 0], end: [2, 0] },
      //     ]}
      //   >
      //     {/* <VideoCard gridArea="one" color="#606EEB" channelName="ImperialEEE" />
      //     <VideoCard gridArea="two" color="#61EC9F" channelName="ImperialEEE" />
      //     <VideoCard
      //       gridArea="three"
      //       color="accent-4"
      //       channelName="ImperialEEE"
      //     /> */}
      <Box direction="row" gap="medium" width="82.5%" wrap justify="center">
        {this.state.streams.map((stream: Stream) => (
          <StreamCard
            width="278px"
            height="192px"
            color="accent-2"
            stream={stream}
          />
        ))}
      </Box>
      //   </Grid>
      // </Box>
    );
  };

  render() {
    return (
      <Box
        width="100%"
        height="100%"
        gridArea={this.props.gridArea}
        // margin={{ top: "60px" }}
      >
        {this.state.streams.length === 0
          ? this.ifNoStreams()
          : this.ifStreams()}
      </Box>
    );
  }
}
