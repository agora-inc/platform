import React, { Component } from "react";
import { Box, Layer, Button, TextInput, Text } from "grommet";


interface Props {
  callback: any;
  open?: boolean;
  text?: string;
}

interface State {
  showModal: boolean;
}

export default class DonorButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: this.props.open || false,
    };
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
    }, ()=> {
    });
  };


  donateOverlay() {
    return (
        <Layer
            onEsc={() => {
                this.toggleModal();
            }}
            onClickOutside={() => {
                this.toggleModal();
            }}
            modal
            responsive
            animation="fadeIn"
            style={{
                width: 400,
                height: 600,
                borderRadius: 15,
                overflow: "hidden",
                alignSelf: "center",
            }}
            >
            <Box align="center" width="100%" style={{ overflowY: "auto" }}>
                <Box
                justify="start"
                width="99.7%"
                background="#eaf1f1"
                direction="row"
                style={{
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    position: "sticky",
                    top: 0,
                    minHeight: "45px",
                    zIndex: 10,
                }}
                >
                    <script src="https://donorbox.org/widget.js" ></script>
                    <iframe src="https://donorbox.org/embed/join-your-forces-to-ours?default_interval=o&enable_auto_scroll=true" name="donorbox" scrolling="yes" height="600px" width="400px"
                        style={{
                            width: 400,
                            height: 600,
                            borderRadius: 15,
                            overflow: "hidden",
                            alignSelf: "center",
                        }}>
                    </iframe>
                </Box>
            </Box>
        </Layer>
    )
  }

  render() {
    return (
      <Box style={{maxHeight: "30px"}}>
        <Button
          label={this.props.text ? this.props.text : "Donate"}
          onClick={this.toggleModal}
          style={{
            width: 90,
            height: 35,
            fontSize: 15,
            fontWeight: "bold",
            padding: 0,
            color: "0C385B",
            // margin: 6,
            backgroundColor: "#D3F930",
            border: "none",
            borderRadius: 7,
          }}
          hoverIndicator="#D3F930"
        />
        {this.state.showModal && this.donateOverlay()}
      </Box>
    );
  }
}
