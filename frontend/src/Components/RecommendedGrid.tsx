import React, { Component } from "react";
import { Box, Grid, ResponsiveContext } from "grommet";
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
    const gridAreaNames = [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
    ];
    return (
      <ResponsiveContext.Consumer>
        {(responsive) =>
          responsive === "small" ? (
            <Grid
              rows={["small", "small", "small", "small"]}
              columns={["smallmedium", "smallmedium"]}
              gap="medium"
              areas={[
                { name: "one", start: [0, 0], end: [0, 0] },
                { name: "two", start: [1, 0], end: [1, 0] },
                { name: "three", start: [0, 1], end: [0, 1] },
                { name: "four", start: [1, 1], end: [1, 1] },
                { name: "five", start: [0, 2], end: [0, 2] },
                { name: "six", start: [1, 2], end: [1, 2] },
                { name: "seven", start: [0, 3], end: [0, 3] },
                { name: "eight", start: [1, 3], end: [1, 3] },
              ]}
            >
              {this.state.videos.map((video: Video, index: number) => (
                <VideoCard
                  gridArea={gridAreaNames[index]}
                  color="accent-2"
                  video={video}
                />
              ))}
            </Grid>
          ) : (
            <Grid
              rows={["small", "small"]}
              columns={[
                "smallmedium",
                "smallmedium",
                "smallmedium",
                "smallmedium",
              ]}
              gap="medium"
              areas={[
                { name: "one", start: [0, 0], end: [0, 0] },
                { name: "two", start: [1, 0], end: [1, 0] },
                { name: "three", start: [2, 0], end: [2, 0] },
                { name: "four", start: [3, 0], end: [3, 0] },
                { name: "five", start: [0, 1], end: [0, 1] },
                { name: "six", start: [1, 1], end: [1, 1] },
                { name: "seven", start: [2, 1], end: [2, 1] },
                { name: "eight", start: [3, 1], end: [3, 1] },
              ]}
            >
              {this.state.videos.map((video: Video, index: number) => (
                <VideoCard
                  gridArea={gridAreaNames[index]}
                  color="accent-2"
                  video={video}
                />
              ))}
            </Grid>
          )
        }
      </ResponsiveContext.Consumer>
    );
  }
}
