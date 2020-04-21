import React, { Component } from "react";
import { Box } from "grommet";
import VideoCard from "./VideoCard";
import { Video, VideoService } from "../Services/VideoService";
import { UserService } from "../Services/UserService";

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
    VideoService.getAllVideos((videos: Video[]) => {
      this.setState({ videos, loading: false });
    });
  }

  render() {
    return (
      <Box direction="row" gap="medium" width="82.5%" wrap justify="center">
        {this.state.videos.map((video: Video, index: number) => (
          <VideoCard
            width="278px"
            height="192px"
            color="accent-2"
            video={video}
          />
        ))}
      </Box>
    );
  }
}
