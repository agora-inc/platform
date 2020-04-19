import React, { Component } from "react";
import { Box, Text } from "grommet";
import { Link } from "react-router-dom";

interface Props {
  tagName: string;
}

export default class Tag extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Link
        to={`/tag/${this.props.tagName}`}
        style={{ textDecoration: "none" }}
      >
        <Box
          background="#61EC9F"
          align="center"
          justify="center"
          pad={{ vertical: "small", horizontal: "medium" }}
          round="medium"
        >
          <Text size="16px" weight="bold">
            {this.props.tagName}
          </Text>
        </Box>
      </Link>
    );
  }
}
