import React, { Component } from "react";
import { Box, Text } from "grommet";
import { Link } from "react-router-dom";

interface Props {
  tagName: string;
  width?: string;
  height?: string;
  colour?: string;
  marginTop?: any;
}

export default class Tag extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Link
        to={`/tag/${this.props.tagName}`}
        style={{
          textDecoration: "none",
          padding: 0,
          marginTop: this.props.marginTop || 0,
          maxWidth: "50%",
          height: this.props.height,
        }}
      >
        <Box
          height="100%"
          background={this.props.colour}
          align="center"
          justify="center"
          pad={{ vertical: "xsmall", horizontal: "medium" }}
          margin="none"
          round="medium"
          overflow="hidden"
          style={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            display: "inline-block",
          }}
        >
          <Text size="16px" weight="bold" color="black">
            {this.props.tagName}
          </Text>
        </Box>
      </Link>
    );
  }
}
