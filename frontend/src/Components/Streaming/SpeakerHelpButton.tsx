import React, { Component } from "react";
import { Box, Layer, Button, TextInput, Text } from "grommet";
import { Help} from "grommet-icons";

import { Overlay } from "../Core/Overlay";
import ReactTooltip from "react-tooltip";
import { StatusInfo } from "grommet-icons";
import SlidesUploader from "../Core/SlidesUploader";
import { TalkService } from "../../Services/TalkService";
import shareScreenButtonImage from "../../assets/tutorial_images/streaming/share_screen_button.jpeg";
import moveSlidesViewButtonImage from "../../assets/tutorial_images/streaming/move_to_slides_view.png";
import uploadButtonImage from "../../assets/tutorial_images/streaming/upload_button_image.png";
import slidesButtonImage from "../../assets/tutorial_images/streaming/slides_button.png";
import AgoraLogo from "../../assets/general/agora_logo_v2.png";


interface Props {
  talkId: number;
  callback: any;
  open?: boolean;
  text?: string;
  width?: string;
}

interface State {
  showModal: boolean;
  headerSize: string;
  textSize: string;
}

export default class SpeakerHelpButton extends Component<Props, State> {
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
          width={this.props.width ? this.props.width : "50px"}
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
              <Box width="100%" height="30px" background="color7" alignContent="center">
                <Text weight="bold" size={this.state.headerSize}>Option A: <img src={AgoraLogo} height={this.state.headerSize}/> slide sharing tool <StatusInfo size="small" data-tip data-for='slide-upload-info'/></Text>
              </Box>
              <Box width="100%">
                <Text size={this.state.textSize} margin={{top: "25px", bottom: "5px"}}>1) Upload your slides</Text>
                <img src={uploadButtonImage} width="100%"/>
                <Text size={this.state.textSize} margin={{top: "25px", bottom: "5px"}}>2) Switch to "slides view"</Text>
                <img src={moveSlidesViewButtonImage} width="100%"/>
                <Text size={this.state.textSize} margin={{top: "25px", bottom: "5px"}}>3) Present using arrow keys</Text>
                <img src={slidesButtonImage} width="100%"/>
              </Box>

            </Box>
            <ReactTooltip id='slide-upload-info' effect="solid">
                <Text size={this.state.textSize}>(Prefered) Doing so will allow your physical and online audience to freely browse through the slides during your presentation. </Text>
              </ReactTooltip>
              {/* <img src={shareScreenButtonImage} width="100%" margin-top="20px"/> */}
            <Box width="100%" gap="2px">
            <Box width="100%" height="30px" background="color7" margin={{top: "20px", bottom: "20px"}} alignContent="center">
                <Text weight="bold" size={this.state.headerSize}>Option B: Share your screen <StatusInfo size="small" data-tip data-for='share-screen-info'/></Text>
              </Box>
            <ReactTooltip id='share-screen-info' effect="solid">
                <Text size={this.state.textSize}>Your online and physical audience will only see your current view. </Text>
              </ReactTooltip>
              <img src={shareScreenButtonImage} width="100%" margin-top="20px"/>
            </Box>
          </Box>
        </Overlay>
      </Box>
    );
  }
}
