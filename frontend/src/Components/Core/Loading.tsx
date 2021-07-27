import React, { Component } from "react";
import Loader from "react-loader-spinner";

interface Props {
  size: number;
  color: string;
}

export default class Loading extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <Loader
        type="Puff"
        color={this.props.color}
        height={this.props.size}
        width={this.props.size}
      />
    );
  }
}
