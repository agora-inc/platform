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
    // this.props.onClick();
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
      this.setState({src: fileReader.result })
      this.toggleModal();
    }   
    fileReader.readAsDataURL(e.target.files[0]);
  }

  render() {
    return (
      <Box style={{ position: "relative" }} width={this.props.width}>
        <input
          type="file"
          accept="image/*"
          className="input-hidden"
          onChange={this.onFileChange}
        ></input>
        <Box 
          width={this.props.width || "150px"}
          height="30px"
          background="white"
          round="xsmall"
          style={{ border: "solid black 2px", cursor: "pointer" }}
          align="center"
          justify="center"
        >
          <Text size="14px" weight="bold" color="black">
            {this.props.text + " "} 
              <StatusInfo size="small" data-tip data-for='link_to_talk_info'/>
            <ReactTooltip id='link_to_talk_info' place="right" effect="solid">
              <p>Recommended dim: 1500x500px</p>
            </ReactTooltip>
          </Text>
        </Box>
        <CropImageModal
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
