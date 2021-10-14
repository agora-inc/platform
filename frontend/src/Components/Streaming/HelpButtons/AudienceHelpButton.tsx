import React, { Component } from "react";
import { Box, Layer, Button, TextInput, Text } from "grommet";
import { Overlay } from "../../Core/Overlay";
import ReactTooltip from "react-tooltip";
import { Help } from "grommet-icons";


interface Props {
  callback?: any;
  open?: boolean;
  text?: string;
  width?: string;
}

interface State {
  showModal: boolean;
  headerSize: string;
  textSize: string;
}

export default class AudienceHelpButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: this.props.open || false,
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
          height="50px"
          width={this.props.width ? this.props.width : "40px"}
          justify="center"
          align="center"
          focusIndicator={false}
          hoverIndicator="#BAD6DB"
        >
          <Help size="20px"/>
        </Box>
        <Overlay
          width={400}
          height={520}
          visible={this.state.showModal}
          title="Getting started"
          onEsc={this.toggleModal}
          onClickOutside={this.toggleModal}
          onCancelClick={this.toggleModal}
          disableSubmitButton={true}
          onSubmitClick={() => {}}
          submitButtonText={""}
          canProceed={true}
          isMissing={[]}
          contentHeight={"320px"}
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
                <Text>1. The chat supports LateX formatting (e.g. $3^2=9$)</Text> 
                <Text>2. <b>Request the mic:</b> by clicking it, you will ask the admin the permission to grab the microphone to interviene in the conversation. </Text>
                <Text>3. <b>Slides view</b> and <b>Standard view</b>: allows you to balance into slides and standard view. The former is available if the speaker decides to upload his slides. In that case, this mode enables you to freely go back and forth the slides without interrupting the flow of the speaker. </Text>

            </Box>
          </Box>
        </Overlay>
      </Box>
    );
  }
}
