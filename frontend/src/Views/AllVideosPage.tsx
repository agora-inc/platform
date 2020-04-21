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
}

export default class AllVideosPage extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      videos: [],
      loading: true,
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

  render() {
    return (
      <Box margin={{ top: "10%" }} align="center">
        <Box width="82.5%">
          <Heading size="4.5rem" margin="none">
            All videos
          </Heading>
          <Box direction="row" width="100%" justify="between">
            <Box direction="row" align="center" gap="xsmall">
              <Text color="black" weight="bold">
                Filter by
              </Text>
              <SmallSearchBar placeholder="search tags" />
            </Box>
            <Box direction="row" align="center" gap="xsmall">
              <Text color="black" weight="bold">
                Sort by
              </Text>
              <SmallSelector />
            </Box>
          </Box>
          <Box
            direction="row"
            gap="medium"
            wrap
            justify="center"
            margin={{ top: "10px" }}
          >
            {this.state.videos.map((video: Video, index: number) => (
              <VideoCard
                width="278px"
                height="192px"
                color="accent-2"
                video={video}
              />
            ))}
          </Box>
        </Box>
      </Box>
    );
  }
}
