import React, { Component } from "react";
import { Box, DropButton, Text } from "grommet";
import { FormDown, FormUp } from "grommet-icons";

interface Props {
  callback: any;
  selected: string;
}

interface State {
  open: boolean;
  options: string[];
  selected: string;
}

export default class ColorPicker extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selected: this.props.selected,
      open: false,
      options: [
        "orange",
        "goldenrod",
        "teal",
        "aquamarine",
        "mediumslateblue",
        "blueviolet",
        "palevioletred",
        "lightcoral",
        "pink",
      ],
    };
  }

  select = (option: string) => {
    this.setState({ selected: option }, () => {
      this.toggle();
      this.props.callback(option);
    });
  };

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  renderDropContent = () => {
    return (
      <Box
        width="139px"
        margin={{ top: "5px" }}
        pad="small"
        background="white"
        // round="10px"
        direction="row"
        wrap
      >
        {this.state.options.map((option: string, index: number) => (
          <Box
            onClick={() => this.select(option)}
            width="30px"
            height="30px"
            round="xsmall"
            background={option}
            margin={{
              right: index + (1 % 3) === 0 ? "none" : "5px",
              left: index % 3 === 0 ? "none" : "5px",
              top: "5px",
              bottom: "5px",
            }}
          ></Box>
        ))}
      </Box>
    );
  };

  render() {
    return (
      <Box
        width={this.state.open ? "139px" : "86px"}
        background="white"
        direction="row"
        justify="between"
        align="center"
        round="xsmall"
        style={
          this.state.open
            ? {
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
                transition: "width 75ms ease-in-out",
              }
            : { transition: "width 75ms ease-in-out" }
        }
        pad={{ left: "10px", vertical: "10px" }}
      >
        <Box
          width="30px"
          height="30px"
          round="xsmall"
          background={this.state.selected}
        ></Box>
        <DropButton
          reverse
          // label={this.state.selected}
          color="white"
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            paddingRight: 10,
          }}
          primary
          dropAlign={{ top: "bottom", right: "right" }}
          dropContent={this.renderDropContent()}
          icon={this.state.open ? <FormUp /> : <FormDown />}
          open={this.state.open}
          onOpen={this.toggle}
          onClose={this.toggle}
        />
      </Box>
    );
  }
}
