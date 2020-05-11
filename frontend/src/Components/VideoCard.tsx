import React, { Component } from "react";
import { Box, Text } from "grommet";
import { Link } from "react-router-dom";
import { Video } from "../Services/VideoService";
import { ArtService } from "../Services/ArtService";
import "../Styles/videocard.css";
import { baseApiUrl } from "../config";
import Identicon from "react-identicons";

interface Props {
  height?: any;
  width?: any;
  color: string;
  gridArea?: string;
  margin?: any;
  pad?: any;
  video: Video;
}

interface State {
  focused: boolean;
}

export default class VideoCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      focused: false,
    };
  }

  render() {
    return (
      <Box
        onMouseEnter={() => this.setState({ focused: true })}
        onMouseLeave={() => this.setState({ focused: false })}
        height={this.props.height}
        width={this.props.width}
        gridArea={this.props.gridArea}
        style={{ position: "relative" }}
        className="videocard"
        pad={this.props.pad ? this.props.pad : "none"}
        margin={
          this.props.margin
            ? this.props.margin
            : { bottom: "medium", horizontal: "none" }
        }
      >
        <Box
          width="100%"
          height="100%"
          justify="between"
          pad="small"
          style={{
            position: "absolute",
            top: 0,
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <Box direction="row" gap="xsmall" align="center">
            {this.state.focused && (
              <Box
                width="30px"
                height="30px"
                round="15px"
                align="center"
                justify="center"
                background="white"
              >
                <Identicon string={this.props.video.channel_name} size={20} />
              </Box>
            )}
            <Text size="24px" weight="bold">
              {this.props.video.channel_name}
            </Text>
          </Box>
          <Text textAlign="end" size="28px" weight="bold">
            {this.props.video.name}
          </Text>
        </Box>
        <Box
          className="videocard-background"
          height="100%"
          width="100%"
          round="10px"
          onClick={() => {}}
          style={{
            backgroundImage: `url(${
              "http://agora.stream:5080/WebRTCAppEE/previews/" +
              this.props.video.chat_id +
              ".png"
            })`,
            backgroundSize: "cover",
            position: "absolute",
            top: 0,
          }}
        >
          <Link
            to={{
              pathname: `/video/${this.props.video.id}`,
              state: { video: this.props.video },
            }}
            style={{ height: "100%", width: "100%" }}
          ></Link>
        </Box>
      </Box>
    );
  }
}
