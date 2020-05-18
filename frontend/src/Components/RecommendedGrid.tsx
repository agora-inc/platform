import React, { Component } from "react";
import { Box, Text } from "grommet";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import { Video, VideoService } from "../Services/VideoService";
import { FormNextLink } from "grommet-icons";
import "../Styles/see-more-button.css";

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
      <Box width="1293px" margin={{ top: "30px", bottom: "25px" }}>
        <Box
          direction="row"
          gap="small"
          align="center"
          margin={{ bottom: "20px" }}
        >
          <Text size="32px" weight="bold" color="black" margin="none">
            Recent streams
          </Text>
          <Link to="/videos" style={{ textDecoration: "none" }}>
            <Box
              className="see-more-button"
              pad={{ vertical: "xsmall", horizontal: "small" }}
              round="xsmall"
              style={{ border: "2px solid black" }}
              direction="row"
              align="end"
            >
              <Text color="black">See more</Text>
              <FormNextLink color="black" />
            </Box>
          </Link>
        </Box>
        <Box
          direction="row"
          width="100%"
          wrap
          justify="between"
          // margin={{ top: "20px" }}
        >
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
