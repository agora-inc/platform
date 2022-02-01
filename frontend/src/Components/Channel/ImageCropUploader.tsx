import React, { Component } from "react";
import { Box, Text } from "grommet";
import CropImageModal from "./CropImageModal";
import ReactTooltip from "react-tooltip";
import { StatusInfo } from "grommet-icons";

interface Props {
  text: string;
  // onClick: () => void;
  onUpload: (file: File) => void;
  width?: string;
  height?: string;
  widthModal?: number; 
  heightModal?: number;
  textSize?: string;
  hideToolTip?: boolean;
  aspect?: number;
}

interface State {
  src: any;
  showModal: boolean;
}

export default class ImageCropUploader extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      src: null,
      showModal: false,
    };
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  onFileChange = (e: any) => {
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
      this.setState({src: fileReader.result })
      this.toggleModal();
    }   
    fileReader.readAsDataURL(e.target.files[0]);
  }

  render() {
    return (
      <Box 
        style={{ position: "relative", border: "solid black 1px", cursor: "pointer" }}
        round="xsmall"
        width={this.props.width ? this.props.width : "150px"}
        height={this.props.height ? this.props.height : "30px"}
        justify="center"
        align="center"
        background="#EAF1F1"
        focusIndicator={true}
        hoverIndicator="#DDDDDD"
        data-tip data-for='link_to_talk_info'
        onClick={(e: any) => e.stopPropagation()}
      >
        <input
          type="file"
          accept="image/*"
          className="input-hidden"
          onChange={this.onFileChange}
        ></input>
          <Text size={this.props.textSize ? this.props.textSize : "14px"} weight="bold" color="black">
            {this.props.text + " "} 
            {!this.props.hideToolTip && (
              <ReactTooltip id='link_to_talk_info' place="bottom" effect="solid">
                <p>Recommended dim: 1500x500px</p>
              </ReactTooltip>
            )}
          </Text>
        <CropImageModal
          width={this.props.widthModal}
          height={this.props.heightModal}
          aspect={this.props.aspect}
          visible={this.state.showModal}
          src={this.state.src}
          onCanceledCallback={this.toggleModal}
          onFinishedCallback={(file) => {
            this.toggleModal();
            this.props.onUpload(file);
          }}
        />
      </Box>
    );
  }
}
