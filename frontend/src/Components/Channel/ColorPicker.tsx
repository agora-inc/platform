import React, { Component } from "react";
import { Box, DropButton, Text } from "grommet";
import { FormDown, FormUp } from "grommet-icons";
import ImageUploader from "../Core/ImageUploader";
import { ChannelService } from "../../Services/ChannelService";

interface Props {
  callback: any;
  selected: string;
  channelId?: number;
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
        "orange",
        "goldenrod",
        "teal",
        "aquamarine",
        "mediumslateblue",
        "blueviolet",
        "palevioletred",
        "lightcoral",
        "pink",
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

  onCoverUpload = (e: any) => {
    this.props.channelId &&
      ChannelService.uploadCover(
        this.props.channelId,
        e.target.files[0],
        () => {
          window.location.reload();
        }
      );
  };

  renderDropContent = () => {
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
        <ImageUploader
          text="upload cover"
          onUpload={this.onCoverUpload}
          width="100%"
        />
      </Box>
    );
  };

  render() {
    return (
      <Box
        width={this.state.open ? "139px" : "90px"}
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
          width="30px"
          height="30px"
          round="xsmall"
          background={this.state.selected}
          style={{ zIndex: 100 }}
        ></Box>
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
      </Box>
    );
  }
}
