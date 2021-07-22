import React, { Component } from "react";
import { Box, Layer, Button, TextInput, Text } from "grommet";
import { Overlay } from "../Core/Overlay";
import ReactTooltip from "react-tooltip";
import { StatusInfo } from "grommet-icons";
import SlidesUploader from "../Core/SlidesUploader";
import { TalkService } from "../../Services/TalkService";
import shareScreenButtonImage from "../../assets/tutorial_images/streaming/share_screen_button.jpeg";
import moveSlidesViewButtonImage from "../../assets/tutorial_images/streaming/move_to_slides_view.jpeg";


interface Props {
  talkId: number;
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
          height={520}
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
          contentHeight={"370px"}
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





              {/* PLACEHOLDER: ADD IMAGE!! */}






            </Box>
            <ReactTooltip id='slide-upload-info' effect="solid">
                <Text size="12px">Doing so will allow your audience to freely browse through the slides during your presentation. </Text>
              </ReactTooltip>
              {/* <img src={shareScreenButtonImage} width="100%" margin-top="20px"/> */}
            <Text style={{alignSelf: "center"}} margin={{top: "20px", bottom: "20px"}}>OR</Text>
            <Box width="100%" gap="2px">
              <b>B. Share your screen <StatusInfo size="small" data-tip data-for='share-screen-info'/></b>
            <ReactTooltip id='share-screen-info' effect="solid">
                <Text size="12px">Your audience will only see your current view. </Text>
              </ReactTooltip>
              <img src={shareScreenButtonImage} width="100%" margin-top="20px"/>
            </Box>
          </Box>
        </Overlay>
      </Box>
    );
  }
}
