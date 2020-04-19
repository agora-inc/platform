import React, { Component } from "react";
import { Box, Grid, Text, Video } from "grommet";
import DescriptionAndQuestions from "../Components/DescriptionAndQuestions";
import ChannelIdCard from "../Components/ChannelIdCard";
import Tag from "../Components/Tag";
import { View } from "grommet-icons";

interface Props {
  location: { pathname: string };
  streamId: number;
}

interface State {
  channelName: string;
  description: string;
}

export default class Channel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channelName: this.props.location.pathname.split("/")[2],
      description: "this is a test",
    };
  }

  render() {
    return (
      <Box align="center">
        <Grid
          margin={{ top: "xlarge", bottom: "medium" }}
          // rows={["streamViewRow1", "medium"]}
          rows={["streamViewRow1"]}
          columns={["streamViewColumn1", "streamViewColumn2"]}
          gap="medium"
          areas={[
            { name: "player", start: [0, 0], end: [0, 0] },
            { name: "chat", start: [1, 0], end: [1, 0] },
            // { name: "questions", start: [0, 1], end: [1, 1] },
          ]}
        >
          <Box gridArea="player" justify="between" gap="small">
            <Box background="#61EC9F" width="100%" height="86%" round="small" />
            <Box direction="row" justify="between" align="start">
              <Box gap="xsmall">
                <Text size="34px" weight="bold">
                  Introduction to timeseries analysis
                </Text>
                <Box direction="row" gap="xsmall">
                  <Tag tagName="Maths" />
                  <Tag tagName="Signals" />
                  <Tag tagName="Finance" />
                </Box>
              </Box>
              <ChannelIdCard channelName="ImperialEEE" />
              <Box direction="row" align="center" gap="xxsmall">
                <View color="black" size="40px" />
                <Text size="34px" weight="bold">
                  3257
                </Text>
              </Box>
            </Box>
          </Box>
          <Box gridArea="chat" background="accent-2" round="small" />
        </Grid>
        <DescriptionAndQuestions
          gridArea="questions"
          description={this.state.description}
          streamId={1}
          streamer={false}
          tags={[]}
        />
      </Box>
    );
  }
}
