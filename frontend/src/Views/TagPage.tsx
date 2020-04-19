import React, { Component } from "react";
import { Box, Grommet, Heading } from "grommet";

interface Props {
  location: { pathname: string };
}

interface State {
  tagName: string;
}

export default class TagPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tagName: this.props.location.pathname.split("/")[2]
    };
  }

  render() {
    return <Heading>Videos tagged under {this.state.tagName}</Heading>;
  }
}
