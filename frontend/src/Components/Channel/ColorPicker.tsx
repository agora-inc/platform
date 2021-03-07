import React, { Component } from "react";
import { Box, DropButton, Text } from "grommet";
import { FormDown, FormUp } from "grommet-icons";
import ImageCropUploader from "./ImageCropUploader";
import { ChannelService } from "../../Services/ChannelService";
import ReactTooltip from "react-tooltip";
import { StatusInfo } from "grommet-icons";

interface Props {
  callback: any;
  selected: string;
  channelId?: number;
  hasCover: boolean;
}

interface State {
  open: boolean;
  options: string[];
  selected: string;
}

export default class ColorPicker extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selected: this.props.selected,
      open: false,
      options: [
        // "white",
        // "orange",
        // "goldenrod",
        // "teal",
        // "aquamarine",
        // "mediumslateblue",
        // "blueviolet",
      ],
    };
  }

  select = (option: string) => {
    this.setState({ selected: option }, () => {
      this.toggle();
      this.props.callback(option);
    });
  };

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  onCoverUpload = (file: File) => {
    this.props.channelId &&
      ChannelService.uploadCover(
        this.props.channelId,
        file,
        () => {
          window.location.reload();
        }
      );
  };

  onDeleteCoverClicked = () => {
    this.props.channelId &&
      ChannelService.removeCover(this.props.channelId, () => {
        window.location.reload();
      });
  };

  renderDropContent = () => {
    let remove_button;
    if (this.props.hasCover){
    remove_button =
      <Box
        width="100%"
        height="25px"
        background="#FF4040"
        round="xsmall"
        style={{ cursor: "pointer" }}
        align="center"
        justify="center"
        onClick={this.onDeleteCoverClicked}
      >
        <Text size="13px" weight="bold" color="white">
          Remove header
        </Text>
      </Box>
    }

    return (
      <Box
        width="139px"
        // margin={{ top: "5px" }}
        pad="small"
        background="#f2f2f2"
      >
        <Box direction="row" wrap>
          {this.state.options.map((option: string, index: number) => (
            <Box
              onClick={() => this.select(option)}
              width="30px"
              height="30px"
              round="xsmall"
              background={option}
              margin={{
                right: index + (1 % 3) === 0 ? "none" : "5px",
                left: index % 3 === 0 ? "none" : "5px",
                top: "5px",
                bottom: "5px",
              }}
            ></Box>
          ))}
        </Box>
        <Box gap="4px">
          {/* <ImageCropUploader
            text="Upload header"
            onUpload={this.onCoverUpload}
            width="100%"
          /> */}
          {remove_button}
        </Box>
      </Box>
    );
  };

  render() {
        let remove_button;
    if (this.props.hasCover){
    remove_button =
      <Box
        width={"150px"}
        height="30px"
        background="#FF4040"
        round="xsmall"
        style={{ cursor: "pointer" }}
        align="center"
        justify="center"
        onClick={this.onDeleteCoverClicked}
      >
        <Text size="13px" weight="bold" color="white">
          Remove header
        </Text>
      </Box>
    }
    return (
      <>
      {/* <Box
        width={this.state.open ? "139px" : "120px"}
        background="#f2f2f2"
        direction="row"
        justify="between"
        align="center"
        round="xsmall"
        style={
          this.state.open
            ? {
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
                transition: "width 75ms ease-in-out",
              }
            : {
                transition: "width 75ms ease-in-out",
              }
        }
        pad={{ left: "10px", vertical: "10px" }}
      >
        <Box
          width="50px"
          height="30px"
          round="xsmall"
          // background={this.state.selected}
          // style={{ zIndex: 100 }}
        >
          <Text weight="bold" size="14">
            Header
             <StatusInfo size="small" data-tip data-for='link_to_talk_info'/>
                      <ReactTooltip id='link_to_talk_info' place="right" effect="solid">
                       <p>Recommended dim: 1500x500px</p>
                      </ReactTooltip>
          </Text>
        </Box>
        <DropButton
          reverse
          // label={this.state.selected}
          color="#f2f2f2"
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            paddingRight: 10,
            background: "#f2f2f2",
          }}
          primary
          dropAlign={{ top: "bottom", right: "right" }}
          dropContent={this.renderDropContent()}
          icon={this.state.open ? <FormUp /> : <FormDown />}
          open={this.state.open}
          onOpen={this.toggle}
          onClose={this.toggle}
        />
      </Box> */}
      {/* This is a workaround because Modal don't work with DropButton */}
      <Box direction="row">
        <ImageCropUploader
          text="Upload header"
          onUpload={this.onCoverUpload}
          width="150px"
        />
        <Box margin= {{ right: "xsmall" }}/>
        {remove_button}

      </Box>
      </>
    );
  }
}
