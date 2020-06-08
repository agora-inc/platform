import React, { Component } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface Props {
  size: number;
  color: string;
}

export default class Loading extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const antIcon = (
      <LoadingOutlined
        style={{ fontSize: this.props.size, color: this.props.color }}
        spin
      />
    );
    return <Spin indicator={antIcon} />;
  }
}
