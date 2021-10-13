import React, { Component } from "react";
import { Box, Layer, Button, TextInput, Text } from "grommet";
import { Help} from "grommet-icons";

import { Overlay } from "../../Core/Overlay";
import ReactTooltip from "react-tooltip";
import { StatusInfo } from "grommet-icons";


interface Props {
  width?: string
}

interface State {
  showModal: boolean;
  headerSize: string;
  textSize: string;
}

export default class AdminHelpButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      headerSize: "16px",
      textSize: "14px"
    };
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
    }, ()=> {
    });
  };

  render() {
    return (
      <Box style={{maxHeight: "50px"}}>
        <Box
          onClick={this.toggleModal}
          background="#0C385B"
          round="xsmall"
          pad={{bottom: "small", top: "small", left: "small", right: "small"}}
          height="45px"
          width={this.props.width ? this.props.width : "45px"}
          justify="center"
          align="center"
          focusIndicator={false}
          hoverIndicator="#BAD6DB"
        >
          <Help size="medium"/>
        </Box>
        <Overlay
          width={400}
          height={520}
          visible={this.state.showModal}
          title="Two ways of presenting"
          onEsc={this.toggleModal}
          onClickOutside={this.toggleModal}
          onCancelClick={this.toggleModal}
          disableSubmitButton={true}
          onSubmitClick={() => {}}
          submitButtonText={""}
          canProceed={true}
          isMissing={[]}
          contentHeight={"820px"}
        >
          <Box
            width="100%"
            height="100%"
            // justify="end"
            align="center"
            pad={{ bottom: "30px" }}
            gap="xsmall"
          >
            <Box width="100%" gap="2px" margin={{"top": "5px"}}>
              TBC
            </Box>
          </Box>
        </Overlay>
      </Box>
    );
  }
}