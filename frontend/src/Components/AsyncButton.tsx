import React, { Component } from "react";
import { Box } from "grommet";
import Loading from "./Loading";

interface Props {
  color: string;
  onClick: any;
  label: string;
  height: string;
  width: string;
  fontColor: string;
  disabled?: boolean;
}

interface State {
  loading: boolean;
}

export default class AsyncButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  onClick = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        this.props.onClick(() => {
          this.setState({
            loading: false,
          });
        });
      }
    );
  };

  render() {
    return (
      <Box
        justify="center"
        align="center"
        background={this.props.disabled ? "grey" : this.props.color}
        round="medium"
        onClick={this.props.disabled ? () => {} : this.onClick}
        pad={{ horizontal: "medium", vertical: "small" }}
        height={this.props.height}
        width={this.props.width}
        focusIndicator={false}
        style={
          this.props.disabled
            ? { color: this.props.fontColor, pointerEvents: "none" }
            : { color: this.props.fontColor }
        }
      >
        {this.state.loading ? (
          <Loading size={24} color={this.props.fontColor} />
        ) : (
          this.props.label
        )}
      </Box>
    );
  }
}
