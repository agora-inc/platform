import React, { Component } from "react";
import { Box, Text, Layer } from "grommet";
import Button from "./Button";

interface OverlayProps {
  visible: boolean;
  onEsc: any;
  onClickOutside: any;
  title: string;
  submitButtonText: string;
  cancelButtonText?: string;
  onSubmitClick: any;
  onCancelClick: any;
  contentHeight: string;
  canProceed: boolean;
  width: number;
  height: number;
  extraButton?: any;
}

interface OverlaySectionProps {
  heading?: string;
  description?: string;
}

export class Overlay extends Component<OverlayProps> {
  render() {
    return (
      this.props.visible && (
        <Layer
          onEsc={this.props.onEsc}
          onClickOutside={this.props.onClickOutside}
          modal
          responsive
          animation="fadeIn"
          style={{
            width: this.props.width,
            height: this.props.height,
            borderRadius: 15,
            border: "3.5px solid black",
            padding: 0,
          }}
        >
          <Box align="center" width="100%" overflow="scroll">
            <Box
              justify="center"
              width="100%"
              background="#F5F5F5"
              pad={{ left: "24px" }}
              style={{
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                position: "sticky",
                top: 0,
                minHeight: "60px",
                zIndex: 10,
              }}
            >
              <Text size="24px" color="black" weight="bold">
                {this.props.title}
              </Text>
            </Box>
            <Box
              width="100%"
              align="center"
              pad={{ horizontal: "30px" }}
              gap="30px"
              margin={{ top: "20px" }}
              overflow="scroll"
              style={{ minHeight: this.props.contentHeight }}
            >
              {this.props.children}
            </Box>
            <Box
              direction="row"
              justify="end"
              align="center"
              gap="xsmall"
              width="100%"
              background="#F5F5F5"
              pad={{ right: "24px" }}
              style={{
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
                position: "sticky",
                bottom: 0,
                minHeight: "45px",
                zIndex: 10,
              }}
            >
              {this.props.extraButton}
              <Button
                height="35px"
                width="90px"
                text={this.props.cancelButtonText || "Cancel"}
                onClick={this.props.onCancelClick}
              />
              <Button
                disabled={!this.props.canProceed}
                height="35px"
                width="90px"
                text={this.props.submitButtonText}
                onClick={this.props.onSubmitClick}
              />
            </Box>
          </Box>
        </Layer>
      )
    );
  }
}

export class OverlaySection extends Component<OverlaySectionProps> {
  render() {
    return (
      <Box width="100%" align="center" gap="xsmall">
        {this.props.heading && (
          <Box
            height="30px"
            width="100%"
            background="#F3EACE"
            round="xsmall"
            pad="small"
            justify="center"
          >
            <Text size="16px" weight="bold" color="black">
              {this.props.heading}
            </Text>

          </Box>
        )}
        {this.props.children}
      </Box>
    );
  }
}
