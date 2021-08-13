import React, { Component } from "react";
import { Box, Text, Button } from "grommet";
import { RadialSelected } from "grommet-icons";


interface Props {
  checked: boolean;
  width: string;
  height?: number;
  callback?: any;
  textOn?: string;
  textOff?: string;
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
    let height: string = this.props.height ? this.props.height + "px" : "24px";
    let round: string = this.props.height ? (this.props.height / 2) + "px" : "12px";

    if (this.state.checked) {
      return (
        <Box
          width={this.props.width}
          height={height}
          round={round}
          onClick={this.toggleChecked} 
          direction="row"
          style={{
            border: "1px solid gray"
          }}
          align="center"
          background="#6DA3C7"
          focusIndicator={false}
        >
          <RadialSelected size={height} />
          <Box width={this.props.width}> </Box>
          <Text size="12px" margin={{right: "10px"}}> 
            {this.props.textOn ? this.props.textOn : ""} 
          </Text>
        </Box>
      );
    } else {
      return (
        <Box
          width={this.props.width}
          height={height}
          round={round}
          onClick={this.toggleChecked}  
          direction="row"
          focusIndicator={false}
          style={{
            border: "1px solid gray"
          }}
          align="center"
          background="#BAD6DB"
        >
          <Text size="12px" margin={{left: "10px"}}> 
            {this.props.textOff ? this.props.textOff : ""} 
          </Text>
          <Box width={this.props.width}> </Box>
          <RadialSelected size={height} />
        </Box>
      );
    }
  }
}