import React, { Component } from "react";
import { Box } from "grommet";
import { Overlay } from "../Core/Overlay";
import ReactCrop, { Crop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css'

interface Props {
  visible: boolean,
  src: any,
  onCanceledCallback?: any,
  onFinishedCallback: (file: File) => void;
}

interface State {
  crop: Crop,
  croppedImageUrl: any,
}

export default class CropImageModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      crop: {
        unit: "%",
        width: 50,
        aspect: 3 / 1
      },
      croppedImageUrl: '',
    }
  }
  imageRef = null;
  fileUrl = '';

  onFinish = () => {
    const file = this.dataURLtoFile(this.state.croppedImageUrl, 'cover.jpg');
    this.props.onFinishedCallback(file);
  };

  onImageLoaded = (image: any) => {
    this.imageRef = image
  }

  onCropChange = (crop: any) => {
    this.setState({ crop });
  }

  onCropComplete = (crop: any) => {
    this.makeClientCrop(crop);
  };

  makeClientCrop(crop: any) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = this.getCroppedImg(this.imageRef, crop);
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image: any, crop: any) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    console.log('canvas', canvas.width, canvas.height);

    ctx && ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
    return dataUrl;
  }

  dataURLtoFile(dataurl: string, filename: string) {
    debugger;
    const arr = dataurl.split(',');
    const match = arr[0].match(/:(.*?);/);
    const mime = (match && match[1]) || '';
    let bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    let croppedImage = new File([u8arr], filename, { type: mime });
    return croppedImage;
  }

  render() {
    const { crop } = this.state;
    const src = this.props.src;

    return (
      <Overlay
        width={900}
        height={450}
        visible={this.props.visible}
        title={"Image Upload"}
        submitButtonText="Save"
        onSubmitClick={this.onFinish}
        contentHeight="450px"
        canProceed={true}
        isMissing={[]}
        onCancelClick={this.props.onCanceledCallback}
        onClickOutside={this.props.onCanceledCallback}
        onEsc={this.props.onCanceledCallback}
        deleteButton={null}
        saveDraftButton={null}
      >
        <Box direction="row">
          <Box width="100%" direction="column">
            {/* <Box direction="row">
              {croppedImageUrl && (
                <img alt="Crop" style={{ maxWidth: '150px' }} src={croppedImageUrl} />
              )}
            </Box> */}
            <Box direction="row" width={{ max: "800px" }}>
              {src && (
                <ReactCrop
                  src={src}
                  crop={crop}
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                  onChange={this.onCropChange}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Overlay>
    );
  }
}
