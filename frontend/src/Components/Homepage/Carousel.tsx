import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import StreamCard from "../StreamCard";
import { Talk, TalkService } from "../../Services/TalkService";
import TalkCard from "../Talks/TalkCard";
import { User, UserService } from "../../Services/UserService";

interface Props {
  gridArea: string;
}

interface State {
  talks: Talk[];
  user: User;
}

export default class Carousel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      talks: [],
      user: UserService.getCurrentUser(),
    };
  }

  componentWillMount() {
    TalkService.getAllCurrentTalks(
      3,
      0,
      (data: { talks: Talk[]; count: number }) => {
        this.setState({ talks: data.talks });
      }
    );
  }

  ifNoStreams = () => {
    return (
      <Box
        direction="row"
        width="100%"
        margin="none"
        pad="small"
        justify="between"
        round="xsmall"
        align="center"
        alignSelf="center"
        background="rgba(96, 110, 235, 0.7)"
      >
        <Text size="20px" weight="bold" color="black">
          No talks happening right now
        </Text>
        <Box
          background="white"
          justify="center"
          align="center"
          style={{ border: "solid black 2px" }}
          round="xsmall"
          pad="xsmall"
        >
          <Link
            to="/past"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text size="16px" weight="bold" color="black">
              Explore previous talks
            </Text>
          </Link>
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
      <Box width="100%">
        <Text color="black" weight="bold" size="32px">
          Happening now
        </Text>
        <Box
          direction="row"
          gap="medium"
          width="100%"
          height="100%"
          wrap
          margin={{ top: "20px" }}
        >
          {this.state.talks.map((talk: Talk) => (
            <TalkCard talk={talk} user={this.state.user} />
          ))}
        </Box>
      </Box>
    );
  };

  render() {
    return (
      <Box
      // width="100%"
      // height="100%"
      // gridArea={this.props.gridArea}
      // margin={{ top: "60px" }}
      >
        {this.state.talks.length === 0 ? this.ifNoStreams() : this.ifStreams()}
      </Box>
    );
  }
}
