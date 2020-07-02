import React, { Component } from "react";
import { Box, Text } from "grommet";


interface Props {
  text: any
}

interface State {
  showText: boolean
}

export default class AboutUs extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showText: false
    };
  }

  onClick() {
    console.log(this.state)
    this.setState((state) => ({
      showText: !state.showText
    }));
  }

  render() {
    return (
      <Box direction="column">
        <Box direction="row" gap="24px">
          <Text
            size="28px"
            weight="bold"
            color="black"
            margin={{ bottom: "10px" }}
          >
            About us
          </Text>
          <Box
            width="100px"
            height="25px"
            background="white"
            round="xsmall"
            style={{ border: "solid black 2px", cursor: "pointer" }}
            align="center"
            justify="center"
            onClick={this.onClick.bind(this)}
          >
            <Text size="16px" weight="bold" color="black">
              {this.state.showText ? "Reduce" : "Expand"}
            </Text>
          </Box>
        </Box>

        {this.state.showText && (
          <Box 
            style={{ maxHeight: "80%"}}
            margin={{bottom: "20px"}}
          >
            <Text size="22px" color="black" margin="10px">
            <div dangerouslySetInnerHTML={{__html: this.props.text}} />
            </Text>
          </Box>
        )}
      </Box>
    );
  }
}
