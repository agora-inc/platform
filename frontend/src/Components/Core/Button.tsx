import React, { Component } from "react";
import { Box, Text } from "grommet";
import { timeStamp } from "node:console";
import { min } from "moment";

interface Props {
  width: string;
  height: string;
  text: string;
  onClick: any;
  buttonType?: "mainAction" | "secondaryAction";
  disabled?: boolean;
  fill?: string;
  hoverIndicator?: string | boolean;
  background?: string;
  onMouseEnter?: any
}

interface State {
  background: string;
  hoverIndicator: string | boolean;
  textColor: string;
}

export default class Button extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      background:  "#0C385B",
      hoverIndicator: true,
      textColor: "black",
    };
  }

  componentDidMount() {
    if (this.props.buttonType === "mainAction"){
      this.setState({
        background: "#0C385B",
        hoverIndicator:"#6DA3C7",
        textColor: ""
      })
    } else if (this.props.buttonType === "secondaryAction"){
      this.setState({
        background: "#F2F2F2",
        hoverIndicator: "#BAD6DB",
        textColor: "black"}
      )
    }
    if (this.props.disabled){
      this.setState({
        hoverIndicator: false
      }
      )
    }
  }

  render() {
    return (
      <Box
        height={this.props.height}
        background={this.props.fill ? this.props.fill : this.state.background}
        round="xsmall"
        align="center"
        justify="center"
        width={this.props.width}
        onClick={this.props.onClick}
        focusIndicator={false}
        pad="xsmall"
        onMouseEnter={this.props.onMouseEnter}
        hoverIndicator={this.state.hoverIndicator}
      >
        <Text
          weight="bold"
          color={this.state.textColor}
          size="14px"
        >
          {this.props.text}
        </Text>
      </Box>
    );
  }
}
