import React, { Component } from "react";
import { Box, Text, Layer } from "grommet";
import Button from "./Button";
import { Close } from "grommet-icons";

interface OverlayProps {
  visible: boolean;
  onEsc?: any;
  onClickOutside?: any;
  title: string;
  submitButtonText: string;
  cancelButtonText?: string;
  onSubmitClick: any;
  onCancelClick?: any;
  contentHeight: string;
  canProceed: boolean;
  width: number;
  height: number;
  deleteButton?: any;
  saveDraftButton?: any;
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
          <Box align="center" width="100%" style={{ overflowY: "auto" }}>
            <Box
              justify="start"
              width="99.7%"
              background="#F5F5F5"
              direction="row"
              style={{
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                position: "sticky",
                top: 0,
                minHeight: "45px",
                zIndex: 10,
              }}
            >
              <Box pad="30px" alignSelf="center" fill={true}>
                <Text size="24px" color="black" weight="bold"  >
                  {this.props.title}
                </Text>
              </Box>
              <Box pad="32px" alignSelf="center">
                <Close onClick={this.props.onCancelClick} />
              </Box>
            </Box>
            
            <Box
              width="100%"
              align="center"
              pad={{ horizontal: "30px" }}
              gap="30px"
              margin={{ top: "20px" }}
              overflow="auto"
              style={{ minHeight: this.props.contentHeight }}
            >
              {this.props.children}
            </Box>
            <Box
              direction="row"
              justify="start"
              align="center"
              gap="xsmall"
              width="99.7%"
              background="#F5F5F5"
              style={{
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
                position: "sticky",
                bottom: 0,
                minHeight: "60px",
                zIndex: 10,
              }}
            >
              <Box fill={true} pad="30px"> {this.props.deleteButton} </Box>
              <Box > {this.props.saveDraftButton} </Box>
              <Box pad="32px"> 
                <Button
                  fill="#7E1115"
                  disabled={!this.props.canProceed}
                  height="35px"
                  width="170px"
                  text={this.props.submitButtonText}
                  onClick={this.props.onSubmitClick}
                  hoverIndicator="#5A0C0F"
                />
              </Box>
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