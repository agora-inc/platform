import React, { Component } from "react";
import { Box, Heading, Text, DropButton } from "grommet";
import { Video, VideoService } from "../Services/VideoService";
import VideoCard from "../Components/Streaming/VideoCard";
import Loading from "../Components/Core/Loading";
import SmallSelector from "../Components/Core/SmallSelector";

interface State {
  videos: Video[];
  totalNumberOfVideos: number;
  loading: boolean;
  sortBy: string;
}

export default class AllVideosPage extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      videos: [],
      totalNumberOfVideos: 0,
      loading: true,
      sortBy: "date",
    };
  }

  componentWillMount() {
    window.addEventListener("scroll", this.handleScroll, true);
    this.fetchVideos();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && this.state.videos.length !== this.state.totalNumberOfVideos) {
      this.fetchVideos();
    }
  };

  fetchVideos = () => {
    VideoService.getAllVideos(
      12,
      this.state.videos.length,
      (data: { count: number; videos: Video[] }) => {
        this.setState({
          videos: this.state.videos.concat(data.videos),
          totalNumberOfVideos: data.count,
          loading: false,
        });
      }
    );
  };

  compareVideosByDate = (a: Video, b: Video) => {
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

  compareVideosByViews = (a: Video, b: Video) => {
    if (a.views < b.views) {
      return 1;
    }
    if (a.views > b.views) {
      return -1;
    }
    return 0;
  };

  sortVideos = () => {
    return this.state.sortBy === "date"
      ? this.state.videos.sort(this.compareVideosByDate)
      : this.state.videos.sort(this.compareVideosByViews);
  };

  render() {
    return (
      <Box
        pad={{ top: "7.5%", bottom: "100px" }}
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
            // margin={{ bottom: "small" }}
          >
            <Heading
              color="black"
              size="3rem"
              margin="none"
              style={{ height: "3rem" }}
            >
              All previous talks
            </Heading>
            {/* <Box direction="row" align="center" gap="xsmall">
              <Text color="black" weight="bold">
                Filter by
              </Text>
              <SmallSearchBar placeholder="search tags" />
            </Box> */}
            <Box
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
            </Box>
          </Box>
          <Box
            direction="row"
            gap="2.5%"
            wrap
            // justify="center"
            margin={{ top: "20px" }}
          >
            {this.sortVideos().map((video: Video, index: number) => (
              <VideoCard
                width="22.5%"
                height="192px"
                // margin="none"
                color="#f2f2f2"
                video={video}
              />
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
