import React, { Component } from "react";
import { Box, Grid, Text } from "grommet";
import DescriptionAndQuestions from "../Components/DescriptionAndQuestions";
import ChatBox from "../Components/ChatBox";
import ChannelIdCard from "../Components/ChannelIdCard";
import VideoPlayer from "../Components/VideoPlayer";
import { View } from "grommet-icons";
import { Stream, StreamService } from "../Services/StreamService";

interface Props {
  location: { pathname: string; state: { stream: Stream } };
}

interface State {
  stream: Stream;
}

export default class VideoPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      stream: {
        id: -1,
        channel_id: -1,
        channel_name: "",
        name: "",
        description: "",
        from_url: "",
        to_url: "",
        tags: [],
      },
    };
  }

  componentWillMount() {
    this.getStream();
  }

  getStream = () => {
    if (this.props.location.state) {
      this.setState({ stream: this.props.location.state.stream });
    } else {
      StreamService.getStreamById(
        parseInt(this.props.location.pathname.split("/")[2]),
        (stream: Stream) => {
          this.setState({ stream });
        }
      );
    }
  };

  render() {
    console.log(this.state.stream);
    return (
      <Box align="center">
        <Grid
          margin={{ top: "xlarge", bottom: "none" }}
          rows={["streamViewRow1"]}
          columns={["streamViewColumn1", "streamViewColumn2"]}
          gap="medium"
          areas={[
            { name: "player", start: [0, 0], end: [0, 0] },
            { name: "chat", start: [1, 0], end: [1, 0] },
          ]}
        >
          <Box gridArea="player" justify="between" gap="small">
            {/* <ReactHLS
              url={this.state.stream.from_url}
              width="100%"
              height="86%"
            /> */}
            <VideoPlayer
              playerOptions={{
                autoplay: true,
                controls: true,
                liveui: false,
                sources: [
                  {
                    src: this.state.stream.from_url,
                    type: "application/x-mpegURL",
                  },
                ],
                html5: {
                  hls: {
                    overrideNative: true,
                  },
                },
              }}
              style={{ width: "100%", height: "86%", borderRadius: 15 }}
            ></VideoPlayer>
            <Box direction="row" justify="between" align="start">
              <Box gap="xsmall" width="65%">
                <Text size="34px" weight="bold">
                  {this.state.stream.name}
                </Text>
              </Box>
              <Box direction="row" gap="small" width="35%" justify="end">
                <ChannelIdCard channelName={this.state.stream!.channel_name} />
                <Box direction="row" align="center" gap="xxsmall">
                  <View color="black" size="40px" />
                  <Text size="34px" weight="bold">
                    3257
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
          <ChatBox gridArea="chat" chatId={this.state.stream.id} />
        </Grid>
        <DescriptionAndQuestions
          gridArea="questions"
          tags={this.state.stream.tags.map((t: any) => t.name)}
          description={this.state.stream.description}
          streamId={this.state.stream.id}
          streamer={false}
        />
      </Box>
    );
  }
}