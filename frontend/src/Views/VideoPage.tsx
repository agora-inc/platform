import React, { Component } from "react";
import { Box, Grid, Text } from "grommet";
import DescriptionAndQuestions from "../Components/DescriptionAndQuestions";
import ChatBox from "../Components/ChatBox";
import ChannelIdCard from "../Components/ChannelIdCard";
import Tag from "../Components/Tag";
import { View } from "grommet-icons";
import { Video, VideoService } from "../Services/VideoService";
import VideoPlayer from "../Components/VideoPlayer";

interface Props {
  location: { pathname: string; state: { video: Video } };
}

interface State {
  video: Video;
}

export default class VideoPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      video: {
        id: -1,
        channel_id: -1,
        channel_name: "",
        name: "",
        description: "",
        tags: [],
        image_url: "",
        date: new Date(),
        views: 0,
        url: "",
        chat_id: -1,
      },
    };
  }

  componentWillMount() {
    this.getVideo();
  }

  getVideo = () => {
    if (this.props.location.state) {
      this.setState({ video: this.props.location.state.video });
    } else {
      VideoService.getVideoById(
        parseInt(this.props.location.pathname.split("/")[2]),
        (video: Video) => {
          this.setState({ video: video });
        }
      );
    }
  };

  render() {
    console.log(this.state.video);
    return (
      <Box align="center">
        <Grid
          margin={{ top: "xlarge", bottom: "none" }}
          // rows={["streamViewRow1", "medium"]}
          rows={["streamViewRow1"]}
          columns={["streamViewColumn1", "streamViewColumn2"]}
          gap="medium"
          areas={[
            { name: "player", start: [0, 0], end: [0, 0] },
            { name: "chat", start: [1, 0], end: [1, 0] },
            // { name: "questions", start: [0, 1], end: [1, 1] },
          ]}
        >
          <Box gridArea="player" justify="between" gap="small">
            <VideoPlayer
              playerOptions={{
                controls: true,
                sources: [
                  {
                    src: this.state.video.url,
                    type: "video/mp4",
                  },
                ],
              }}
              style={{
                width: "100%",
                height: "86%",
                borderRadius: 15,
                overflow: "hidden",
              }}
            ></VideoPlayer>
            <Box direction="row" justify="between" align="start">
              <Box gap="xsmall" width="65%">
                <Text size="34px" weight="bold">
                  {this.state.video!.name}
                </Text>
              </Box>
              <Box direction="row" gap="small" width="35%" justify="end">
                <ChannelIdCard channelName={this.state.video!.channel_name} />
                <Box direction="row" align="center" gap="xxsmall">
                  <View color="black" size="40px" />
                  <Text size="34px" weight="bold">
                    3257
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* <Box gridArea="chat" background="accent-2" round="small" /> */}
          <ChatBox gridArea="chat" chatId={this.state.video.chat_id} />
        </Grid>
        <DescriptionAndQuestions
          gridArea="questions"
          tags={this.state.video.tags.map((t: any) => t.name)}
          description={this.state.video!.description}
          videoId={this.state.video.id}
          streamer={false}
        />
      </Box>
    );
  }
}
