import React, { Component } from "react";
import { Box, Text } from "grommet";
import { Link } from "react-router-dom";
import { Video } from "../Services/VideoService";
import { ArtService } from "../Services/ArtService";
import "../Styles/videocard.css";

interface Props {
  height?: any;
  width?: any;
  color: string;
  gridArea?: string;
  video: Video;
}

export default class VideoCard extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Box
        height={this.props.height}
        width={this.props.width}
        gridArea={this.props.gridArea}
        style={{ position: "relative" }}
        className="videocard"
      >
        <Box
          width="100%"
          height="100%"
          justify="center"
          align="center"
          pad="small"
          style={{
            position: "absolute",
            top: 0,
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <Text textAlign="center" size="24px" weight="bold">
            {this.props.video.name}
          </Text>
        </Box>
        <Box
          className="videocard-background"
          height="100%"
          width="100%"
          round="small"
          onClick={() => {}}
          style={{
            backgroundImage: `url(${ArtService.generateRandomArt(400, 400)})`,
            position: "absolute",
            top: 0,
          }}
        >
          <Link
            to={{
              pathname: `/videos/${this.props.video.id}`,
              state: { video: this.props.video },
            }}
            style={{ height: "100%", width: "100%" }}
          ></Link>
        </Box>
      </Box>
    );
  }
}
