import React, { Component } from "react";
import { Box, Layer, Button, TextInput, Text } from "grommet";
import { Help} from "grommet-icons";

import { Overlay } from "../../Core/Overlay";
import ReactTooltip from "react-tooltip";
import { StatusInfo, StatusCriticalSmall } from "grommet-icons";


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
          <Help size="20px"/>
        </Box>
        <Overlay
          width={600}
          height={550}
          visible={this.state.showModal}
          title="How to run a seminar on mora?"
          onEsc={this.toggleModal}
          onClickOutside={this.toggleModal}
          onCancelClick={this.toggleModal}
          disableSubmitButton={true}
          onSubmitClick={() => {}}
          submitButtonText={""}
          canProceed={true}
          isMissing={[]}
          contentHeight={"400px"}
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
                Before the seminar
              </Text>
              <Text size="14px" margin={{bottom: "5px"}}>
                <StatusCriticalSmall size="15px" style={{marginRight: "5px"}} /> 
                You can discuss in the chat box with the speaker and the other admins only. 
              </Text>
              <Text size="14px" margin={{bottom: "5px"}}>
                <StatusCriticalSmall size="15px" style={{marginRight: "5px"}} /> 
                The chat supports LateX formatting (e.g. $3^2=9$)
              </Text>
              <Text size="14px" margin={{bottom: "5px"}}>
                <StatusCriticalSmall size="15px" style={{marginRight: "5px"}} /> 
                Click on "Start" to start streaming.
              </Text>
              <Text size="16px" weight="bold" margin={{"bottom": "5px", "top": "20px"}}> 
                During the seminar
              </Text>
              <Text size="14px" margin={{bottom: "5px"}}>
                <StatusCriticalSmall size="15px" style={{marginRight: "5px"}} /> 
                Toggle the button "Speaker view" to switch from the speakers screen to the slides. 
              </Text>
              <Text size="14px" margin={{bottom: "5px"}}>
                <StatusCriticalSmall size="15px" style={{marginRight: "5px"}} /> 
                Go back and forth the slides independently of the speaker using "Prev" and "Next". Toggle the "Your view/Live" button to switch back to the speaker location.
              </Text>
              <Text size="14px" margin={{bottom: "5px"}}>
                <StatusCriticalSmall size="15px" style={{marginRight: "5px"}} /> 
                Manage which participant can speak in the "Requests for mic" box. 
              </Text>
              <Text size="14px" margin={{bottom: "5px"}}>
                <StatusCriticalSmall size="15px" style={{marginRight: "5px"}} /> 
                You can also mute yourself, switch off the camera, share your screen, and go full screen using the corresponding buttons. 
              </Text>
              <Text size="16px" weight="bold" margin={{"bottom": "5px",  "top": "20px"}}> 
                At the end of the seminar
              </Text>
              <Text size="14px" margin={{bottom: "5px"}}>
                <StatusCriticalSmall size="15px" style={{marginRight: "5px"}} /> 
                Click on "Thank speaker" to broadcast a clap to the speaker and the participants.
              </Text>
              <Text size="14px" margin={{bottom: "5px"}}>
                <StatusCriticalSmall size="15px" style={{marginRight: "5px"}} /> 
                Click on "Stop" to end the stream and redirect everyone to the cafeteria.
              </Text>
            </Box>
          </Box>
        </Overlay>
      </Box>
    );
  }
}