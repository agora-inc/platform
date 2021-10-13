import React, { Component } from "react";
import { Box, Text, Button } from "grommet";
import { RadialSelected } from "grommet-icons";


interface Props {
  checked: boolean;
  width: number;
  height: number;
  callback?: any;
  textOn?: string;
  textOff?: string;
  color?: string
}

interface State {
  checked: boolean;
}

export default class Switch extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      checked: this.props.checked
    }
  }

  toggleChecked = () => {
    this.setState({ checked: !this.state.checked})
    if (this.props.callback) {
      this.props.callback(!this.state.checked)
    }
  }

  render() {
    let round: string = this.props.height ? (this.props.height / 2) + "px" : "12px";

    if (this.state.checked) {
      return (
        <Box
          width={this.props.width + "px"}
          height={this.props.height + "px"}
          round={round}
          onClick={this.toggleChecked} 
          direction="row"
          style={{
            border: "1px solid gray"
          }}
          align="center"
          justify="center"
          background={this.props.color ? this.props.color : "#025377"}
          focusIndicator={false}
        >
          <RadialSelected size={this.props.height + "px"} />
          <Box alignContent="center" alignSelf="center" align="center">
            <Text size="12px" margin={{right: "5px"}} weight="bold" textAlign="center"
              style={{width: (this.props.width - this.props.height) + "px"}}
            > 
              {this.props.textOn ? this.props.textOn : ""} 
            </Text>
          </Box>
        </Box>
      );
    } else {
      return (
        <Box
          width={this.props.width + "px"}
          height={this.props.height + "px"}
          round={round}
          onClick={this.toggleChecked}  
          direction="row"
          focusIndicator={false}
          style={{
            border: "1px solid gray"
          }}
          align="center"
          justify="center"
          background="white"
        >
          <Text size="12px" margin={{left: "5px"}} weight="bold" textAlign="center"
            style={{width: (this.props.width - this.props.height) + "px"}}
          > 
            {this.props.textOff ? this.props.textOff : ""} 
          </Text>
          <RadialSelected size={this.props.height + "px"}  />
        </Box>
      );
    }
  }
}