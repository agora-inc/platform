import React, { Component } from "react";
import { Box, Grommet, Heading, Text } from "grommet";
import { Video, VideoService } from "../Services/VideoService";
import SmallSearchBar from "../Components/SmallSearchBar";
import SmallSelector from "../Components/SmallSelector";
import VideoCard from "../Components/VideoCard";

interface Props {
  location: { pathname: string };
}

interface State {
  tagName: string;
  videos: Video[];
  sortBy: string;
}

export default class TagPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tagName: this.props.location.pathname.split("/")[2],
      videos: [],
      sortBy: "date",
    };
  }

  componentWillMount() {
    VideoService.getAllVideosWithTag(this.state.tagName, (videos: Video[]) => {
      this.setState({ videos });
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
      <Box margin={{ top: "10%" }} align="center">
        <Box width="82.5%">
          <Box
            direction="row"
            align="end"
            margin={{ bottom: "small" }}
            gap="small"
          >
            <Heading size="3.5rem" margin="none">
              Videos tagged under
            </Heading>
            <Box
              background="white"
              round="small"
              style={{ border: "2.5px solid black" }}
              justify="center"
              align="center"
              pad={{ vertical: "small", horizontal: "medium" }}
              margin={{ left: "xsmall" }}
            >
              <Text weight="bold" size="24px">
                {this.state.tagName}
              </Text>
            </Box>
          </Box>
          <Box
            direction="row"
            width="100%"
            justify="between"
            margin={{ bottom: "small" }}
          >
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
              <SmallSelector
                callback={(sortBy: string) =>
                  this.setState({ sortBy: sortBy.toLowerCase() })
                }
              />
            </Box>
          </Box>
          <Box
            direction="row"
            gap="medium"
            wrap
            // justify="center"
            margin={{ top: "10px" }}
          >
            {this.sortVideos().map((video: Video, index: number) => (
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
