import React, { Component } from "react";
import { Box, Grommet, Heading, Text } from "grommet";
import { Video, VideoService } from "../Services/VideoService";
import SmallSelector from "../Components/Core/SmallSelector";
import VideoCard from "../Components/Streaming/OldStuff/VideoCard";
import { Talk, TalkService } from "../Services/TalkService";
import PastTalkCard from "../Components/Talks/PastTalkCard";
import { User, UserService } from "../Services/UserService";

interface Props {
  location: { pathname: string };
}

interface State {
  talks: Talk[];
  totalNumberOfTalks: number;
  tagName: string;
  // videos: Video[];
  loading: boolean;
  // totalNumberOfVideos: number;
  // sortBy: string;
  user: User | null;
}

export default class TagPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      talks: [],
      totalNumberOfTalks: 0,
      tagName: this.props.location.pathname.split("/")[2],
      // videos: [],
      // totalNumberOfVideos: 0,
      // sortBy: "date",
      loading: true,
      user: UserService.getCurrentUser(),
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
    TalkService.getPastTalksForTag(
      this.state.tagName,
      (data: { talks: Talk[]; count: number }) => {
        this.setState({ talks: data.talks, totalNumberOfTalks: data.count });
      }
    );
  };

  // fetchVideos = () => {
  //   VideoService.getAllVideosWithTag(
  //     this.state.tagName,
  //     12,
  //     this.state.videos.length,
  //     (data: { count: number; videos: Video[] }) => {
  //       this.setState({
  //         videos: this.state.videos.concat(data.videos),
  //         totalNumberOfVideos: data.count,
  //         loading: false,
  //       });
  //     }
  //   );
  // };

  // compareVideosByDate = (a: Video, b: Video) => {
  //   if (a.date < b.date) {
  //     return 1;
  //   }
  //   if (a.date > b.date) {
  //     return -1;
  //   }
  //   return 0;
  // };

  // compareVideosByViews = (a: Video, b: Video) => {
  //   if (a.views < b.views) {
  //     return 1;
  //   }
  //   if (a.views > b.views) {
  //     return -1;
  //   }
  //   return 0;
  // };

  // sortVideos = () => {
  //   return this.state.sortBy === "date"
  //     ? this.state.videos.sort(this.compareVideosByDate)
  //     : this.state.videos.sort(this.compareVideosByViews);
  // };

  render() {
    return (
      <Box margin={{ top: "10%" }} align="center">
        <Box width="82.5%">
          <Box
            direction="row"
            justify="between"
            align="center"
            gap="small"
            width="100%"
          >
            <Box direction="row" gap="small" align="center">
              <Heading size="3rem" margin="none">
                Past talks tagged under
              </Heading>
              <Box
                background="white"
                round="small"
                style={{ border: "3px solid black" }}
                justify="center"
                align="center"
                pad={{ vertical: "xsmall", horizontal: "small" }}
              >
                <Text color="black" weight="bold" size="22px">
                  {this.state.tagName}
                </Text>
              </Box>
            </Box>
            {/* <Box direction="row" align="center" gap="xsmall">
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
            gap="1.5%"
            wrap
            // justify="center"
            margin={{ top: "10px" }}
          >
            {this.state.talks.map((talk: Talk) => (
              <PastTalkCard
                width="31.5%"
                talk={talk}
                user={this.state.user}
                windowWidth={window.innerWidth}
              />
            ))}
          </Box>
        </Box>
      </Box>
    );
  }
}
