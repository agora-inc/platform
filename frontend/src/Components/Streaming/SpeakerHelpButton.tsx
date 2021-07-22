import React, { Component } from "react";
import { Box, Layer, Button, TextInput, Text } from "grommet";
import { Overlay } from "../Core/Overlay";
import ReactTooltip from "react-tooltip";
import { StatusInfo } from "grommet-icons";
import SlidesUploader from "../Core/SlidesUploader";


interface Props {
  callback: any;
  open?: boolean;
  text?: string;
}

interface State {
  showModal: boolean;
}

export default class SpeakerHelpButton extends Component<Props, State> {
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


  // speakerHelpOverlay() {
  //   return (
  //       <Layer
  //           onEsc={() => {
  //               this.toggleModal();
  //           }}
  //           onClickOutside={() => {
  //               this.toggleModal();
  //           }}
  //           modal
  //           responsive
  //           animation="fadeIn"
  //           style={{
  //               width: 400,
  //               height: 600,
  //               borderRadius: 15,
  //               overflow: "hidden",
  //               alignSelf: "center",
  //           }}
  //           >
  //           <Box align="center" width="100%" style={{ overflowY: "auto" }}>
  //             <Box
  //               justify="start"
  //               width="99.7%"
  //               background="#eaf1f1"
  //               direction="row"
  //               style={{
  //                   borderTopLeftRadius: "10px",
  //                   borderTopRightRadius: "10px",
  //                   position: "sticky",
  //                   top: 0,
  //                   minHeight: "45px",
  //                   zIndex: 10,
  //               }}
  //               >
  //                   There are two ways to present
  //               </Box>
  //           </Box>
  //       </Layer>
  //   )
  // }

  render() {
    return (
      <Box style={{maxHeight: "30px"}}>
        <Box
          onClick={this.toggleModal}
          background="#0C385B"
          round="xsmall"
          pad={{bottom: "small", top: "small", left: "small", right: "small"}}
          height="40px"
          width="15vw"
          justify="center"
          align="center"
          focusIndicator={false}
          // hoverIndicator="#2433b5"
          hoverIndicator="#6DA3C7"
        >
          <Text size="14px" weight="bold">How to present?</Text>
        </Box>
        <Overlay
          width={400}
          height={320}
          visible={this.state.showModal}
          title="Choose one of the two"
          onEsc={this.toggleModal}
          onClickOutside={this.toggleModal}
          onCancelClick={this.toggleModal}
          disableSubmitButton={true}
          onSubmitClick={() => {}}
          submitButtonText={""}
          canProceed={true}
          isMissing={[]}
          contentHeight={"170px"}
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
              <b>A. Upload your pdf presentation <StatusInfo size="small" data-tip data-for='slide-upload-info'/></b>
              <SlidesUploader
                text="Upload your slides (pdf)"
                onUpload={()=>{}}
              />
            </Box>
            <ReactTooltip id='slide-upload-info' effect="solid">
                <Text size="12px">Your audience will be able to freely browse through the slides during your presentation. </Text>
              </ReactTooltip>
            <Text style={{alignSelf: "center"}}>OR</Text>
            <Box width="100%" gap="2px">
              <b>B. Share your screen <StatusInfo size="small" data-tip data-for='share-screen-info'/></b>
            <ReactTooltip id='share-screen-info' effect="solid">
                <Text size="12px">Your audience will only see your current view. </Text>
              </ReactTooltip>
            </Box>
          </Box>
        </Overlay>
      </Box>
    );
  }
}
