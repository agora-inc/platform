import React, { Component } from "react";
import { Box, Tabs, Tab, Text } from "grommet";
import QandA from "./QandA";
import Tag from "../Core/Tag";

interface Props {
  description: string;
  gridArea: string;
  tags: string[];
  streamer: boolean;
  streamId?: number;
  videoId?: number;
  margin?: any;
}

export default class DescriptionAndQuestions extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Box width="72%" margin={this.props.margin} pad="none">
        <Tabs justify="start" style={{ marginBottom: 12 }}>
          <Tab
            title="Description"
          >
            <Box
              height="100%"
              width="100%"
              round="small"
              gap="small"
              margin={{ right: "12px" }}
            >
              <Box direction="row" gap="xsmall">
                {this.props.tags.map((tag: string) => (
                  <Tag tagName={tag} />
                ))}
              </Box>
              <Text size="24px">{this.props.description}</Text>
            </Box>
          </Tab>
          <Tab title="Questions">
            <QandA
              streamId={this.props.streamId}
              videoId={this.props.videoId}
              streamer={this.props.streamer}
            />
          </Tab>
        </Tabs>
      </Box>
    );
  }
}
