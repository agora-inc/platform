import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import { Stream } from "../../Services/StreamService";
import { FormNextLink } from "grommet-icons";

interface Props {
  stream: Stream;
  colour: string;
}

export default class ChannelLiveNowCard extends Component<Props> {
  render() {
    return (
      <Link
        to={{
          pathname: `/stream/${this.props.stream.id}`,
          state: { stream: this.props.stream },
        }}
        style={{ width: "40%", height: 80 }}
      >
        <Box
          width="100%"
          height="100%"
          background="white"
          round="10px"
          style={{ border: `4px solid ${this.props.colour}` }}
          pad="10px"
          justify="center"
          align="center"
          direction="row"
        >
          <Text
            weight="bold"
            size="24px"
            color="black"
          >{`${this.props.stream.channel_name} is live now`}</Text>
          <FormNextLink
            size="40px"
            color="black"
            style={{ marginTop: 3, marginLeft: 3 }}
          />
        </Box>
      </Link>
    );
  }
}
