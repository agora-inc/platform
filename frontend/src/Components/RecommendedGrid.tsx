import React, { Component } from "react";
import { Box, Text } from "grommet";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import { Video, VideoService } from "../Services/VideoService";

interface State {
  videos: Video[];
  loading: boolean;
}

export default class RecommendedGrid extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      videos: [],
      loading: true,
    };
  }

  componentWillMount() {
    VideoService.getRecentVideos((videos: Video[]) => {
      this.setState({ videos, loading: false });
    });
  }

  render() {
    return (
      <Box width="1293px" margin={{ top: "40px", bottom: "25px" }}>
        <Link to="/videos">
          <Text
            size="32px"
            weight="bold"
            color="black"
            margin="none"
            className="sliding-underline"
            alignSelf="start"
          >
            Recent videos
          </Text>
        </Link>
        <Box direction="row" width="100%" wrap justify="between">
          {this.state.videos.map((video: Video) => (
            <VideoCard
              width="410px"
              height="240px"
              color="#f2f2f2"
              video={video}
              // margin="none"
            />
          ))}
        </Box>
      </Box>
    );
  }
}
