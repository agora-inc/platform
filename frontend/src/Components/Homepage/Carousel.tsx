import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import { Talk, TalkService } from "../../Services/TalkService";
import TalkCard from "../Talks/TalkCard";
import { User, UserService } from "../../Services/UserService";
import TrendingTalksList from "../../Components/Homepage/TrendingTalksList";

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
          No public talks happening right now
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
      <Box width="100%" margin={{ bottom: "20px" }}>
        <Text size="26px" weight="bold" color="color1" margin="none">
          Happening now
        </Text>
        <Box
          direction="row"
          gap="1.5%"
          width="100%"
          height="100%"
          margin={{ top: "10px" }}
        >
          {this.state.talks.map((talk: Talk) => (
            <TalkCard
              talk={talk}
              user={this.state.user}
              width="31.5%"
              isCurrent={true}
              windowWidth={window.innerWidth}
            />
          ))}
        </Box>
      </Box>
    );
  };

  render() {
    return (
      <>
        <Box align="start" margin={{ bottom: "20px" }}>
          <TrendingTalksList />
        </Box>
        <Box
        // width="100%"
        // height="100%"
        // gridArea={this.props.gridArea}
        // margin={{ top: "60px" }}
        >
          {this.state.talks.length != 0 && this.ifStreams()}
        </Box>
      </>
    );
  }
}

// {this.state.talks.length === 0 ? this.ifNoStreams() : this.ifStreams()}
