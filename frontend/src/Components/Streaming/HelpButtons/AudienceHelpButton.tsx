import React, { Component } from "react";
import { Box, Layer, Button, TextInput, Text } from "grommet";
import { Overlay } from "../../Core/Overlay";
import ReactTooltip from "react-tooltip";
import { Help, StatusCriticalSmall } from "grommet-icons";


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
          height="40px"
          width={this.props.width ? this.props.width : "40px"}
          justify="center"
          align="center"
          focusIndicator={false}
          hoverIndicator="#BAD6DB"
        >
          <Help size="20px"/>
        </Box>
        <Overlay
          width={600}
          height={350}
          visible={this.state.showModal}
          title="How to attend a seminar on mora?"
          onEsc={this.toggleModal}
          onClickOutside={this.toggleModal}
          onCancelClick={this.toggleModal}
          disableSubmitButton={true}
          onSubmitClick={() => {}}
          submitButtonText={""}
          canProceed={true}
          isMissing={[]}
          contentHeight={"200px"}
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
              <Text size="16px" weight="bold" margin={{"bottom": "5px"}}> 
                Functionalities
              </Text>
              <Text size="14px" margin={{bottom: "5px"}}>
                <StatusCriticalSmall size="15px" style={{marginRight: "5px"}} /> 
                The chat supports LateX formatting (e.g. $3^2=9$) 
              </Text>
              <Text size="14px" margin={{bottom: "5px"}}>
                <StatusCriticalSmall size="15px" style={{marginRight: "5px"}} /> 
                Click on "Request microphone" to request the permission to speak in the seminar. 
              </Text>
              <Text size="14px" margin={{bottom: "5px"}}>
                <StatusCriticalSmall size="15px" style={{marginRight: "5px"}} /> 
                Toggle the button "Speaker view" to switch from the speakers screen to the slides.
              </Text>
            </Box>
          </Box>
        </Overlay>
      </Box>
    );
  }
}
