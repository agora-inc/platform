import React, { Component } from "react";
import { Box, Heading, Text, DropButton } from "grommet";
import Loading from "../Components/Core/Loading";
import SmallSelector from "../Components/Core/SmallSelector";
import PastTalkCard from "../Components/Talks/PastTalkCard";
import { Talk, TalkService } from "../Services/TalkService";
import { User, UserService } from "../Services/UserService";

interface State {
  talks: Talk[];
  totalNumberOfTalks: number;
  loading: boolean;
  user: User | null;
  //   sortBy: string;
}

export default class AllPastTalksPage extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      talks: [],
      totalNumberOfTalks: 0,
      loading: true,
      user: UserService.getCurrentUser(),
      //   sortBy: "date",
    };
  }

  componentWillMount() {
    window.addEventListener("scroll", this.handleScroll, true);
    this.fetchTalks();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && this.state.talks.length !== this.state.totalNumberOfTalks) {
      this.fetchTalks();
    }
  };

  fetchTalks = () => {
    TalkService.getAllPastTalks(
      12,
      this.state.talks.length,
      (data: { count: number; talks: Talk[] }) => {
        this.setState({
          talks: this.state.talks.concat(data.talks),
          totalNumberOfTalks: data.count,
          loading: false,
        });
      }
    );
  };

  compareTalksByDate = (a: Talk, b: Talk) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    if (aDate < bDate) {
      return 1;
    }
    if (aDate > bDate) {
      return -1;
    }
    return 0;
  };

  //   sortVideos = () => {
  //     return this.state.sortBy === "date"
  //       ? this.state.videos.sort(this.compareVideosByDate)
  //       : this.state.videos.sort(this.compareVideosByViews);
  //   };

  render() {
    return (
      <Box
        pad={{ top: "14vh", bottom: "100px" }}
        align="center"
        style={{ overflowY: "scroll" }}
        onScroll={this.handleScroll}
      >
        <Box width="90%" margin={{ left: "2.5%" }}>
          <Box
            direction="row"
            width="100%"
            justify="between"
            align="end"
            margin={{ bottom: "medium" }}
          >
            <Heading
              color="black"
              size="24px"
              margin="none"
              style={{ height: "20px" }}
            >
              All previous talks
            </Heading>
            {/* <Box direction="row" align="center" gap="xsmall">
              <Text color="black" weight="bold">
                Filter by
              </Text>
              <SmallSearchBar placeholder="search tags" />
            </Box> */}
            {/* <Box
              direction="row"
              align="center"
              gap="xsmall"
              margin={{ right: "2.5%" }}
            >
              <Text color="black" weight="bold">
                Sort by
              </Text>
              <SmallSelector
                callback={(sortBy: string) =>
                  this.setState({ sortBy: sortBy.toLowerCase() })
                }
              />
            </Box> */}
          </Box>
          <Box
            direction="row"
            gap="1%"
            wrap
            // justify="center"
            margin={{ top: "20px" }}
          >
            {this.state.talks.map((talk: Talk, index: number) => (
              <PastTalkCard talk={talk} width="24%" user={this.state.user} />
            ))}
          </Box>
        </Box>
        {/* {this.state.videos.length !== this.state.totalNumberOfVideos && (
          <Box
            onClick={this.fetchVideos}
            focusIndicator={false}
            background="white"
            pad={{ vertical: "xsmall", horizontal: "medium" }}
            round="small"
            style={{ border: "3px solid black" }}
          >
            <Text weight="bold" color="black">
              See more
            </Text>
          </Box>
        )} */}
      </Box>
    );
  }
}
