import React, { Component } from "react";
import {
  Box,
  Select,
  Text,
  TextInput,
} from "grommet";
import { Overlay, OverlaySection } from "../Core/Overlay";
import { ChannelService } from "../../Services/ChannelService";

const titleOptions = ["Undergraduate", "Postgraduate", "PhD Candidate", "Dr", "Prof"];

interface Props {
  height?: string,
  width?: string,
  actionTitle:string,
  confirmationMessage:string,
  buttonMessage: string,
  action: boolean,

}

interface State {
    showModal: boolean;
}

export default class ConfirmationButton extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  onClick = () => {
    this.setState({showModal: false})
  }

  handleClickButton = () => {
    this.setState({ showModal: true });
  };

  render() {
    return (
      <Box>
        <Box
          focusIndicator={false}
          width={this.props.width ? this.props.width : "10vw"}
          background="white"
          round="xsmall"
          height={this.props.height ? this.props.height : "30px"}
          pad={{bottom: "6px", top: "6px", left: "3px", right: "3px"}}
          onClick={() => 
            {this.handleClickButton()}
        }
          style={{
            border: "1px solid #C2C2C2",
            minWidth: "25px"
          }}
          hoverIndicator={true}
          justify="center"   
        >
          <Text 
            size="14px" 
            color="grey"
            alignSelf="center"
          >
            { this.props.buttonMessage }
          </Text>
        </Box>
  

        <Overlay
          visible={this.state.showModal}
          onEsc={this.toggleModal}
          onCancelClick={this.toggleModal}
          onClickOutside={this.toggleModal}
          onSubmitClick={this.onClick}
          submitButtonText="close"
          canProceed={true}
          isMissing={[]}
          width={900}
          height={400}
          contentHeight="250px"
          title={this.props.actionTitle}
        >
            <Text>
                {this.props.confirmationMessage}
            </Text>
        </Overlay>
      </Box>
    );
  }
}