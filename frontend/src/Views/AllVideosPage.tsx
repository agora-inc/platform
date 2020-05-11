import React, { Component } from "react";
import { Box, Heading, Text, DropButton } from "grommet";
import { Video, VideoService } from "../Services/VideoService";
import VideoCard from "../Components/VideoCard";
import Loading from "../Components/Loading";
import SmallSearchBar from "../Components/SmallSearchBar";
import SmallSelector from "../Components/SmallSelector";

interface State {
  videos: Video[];
  loading: boolean;
  sortBy: string;
}

export default class AllVideosPage extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      videos: [],
      loading: true,
      sortBy: "date",
    };
  }

  componentWillMount() {
    VideoService.getAllVideos((videos: Video[]) => {
      this.setState({
        videos: videos,
        loading: false,
      });
    });
  }

  compareVideosByDate = (a: Video, b: Video) => {
    if (a.date < b.date) {
      return 1;
    }
    if (a.date > b.date) {
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
      <Box margin={{ top: "7.5%" }} align="center">
        <Box width="90%" margin={{ left: "2.5%" }}>
          <Box
            direction="row"
            width="100%"
            justify="between"
            align="end"
            // margin={{ bottom: "small" }}
          >
            <Heading size="3rem" margin="none" style={{ height: "3rem" }}>
              All videos
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
      </Box>
    );
  }
}
