import React, { Component } from "react";
import { Box, Text } from "grommet";
import CropImageModal from "./CropImageModal";

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
          width={this.props.width || "100px"}
          height="25px"
          background="white"
          round="xsmall"
          style={{ border: "solid black 2px", cursor: "pointer" }}
          align="center"
          justify="center"
        >
          <Text size="13px" weight="bold" color="black">
            {this.props.text}
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
