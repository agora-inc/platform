import React, { Component } from "react";
import { Box } from "grommet";
import { Search } from "grommet-icons";

interface Props {
  placeholder: string;
}

export default class SmallSearchBar extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <Box
        height="35px"
        width="200px"
        background="lightgrey"
        round="5px"
        direction="row"
        justify="between"
        align="center"
        pad={{ left: "xsmall" }}
      >
        <Search size="20px" />
        <input
          placeholder={this.props.placeholder}
          style={{
            backgroundColor: "lightgrey",
            borderRadius: 5,
            border: "none",
            height: 35,
            padding: 10,
            width: "93%",
          }}
        ></input>
      </Box>
    );
  }
}
