import React, { Component } from "react";
import { Box, Text, Layer } from "grommet";
import Button from "./Button";
import { Close } from "grommet-icons";
import ReactTooltip from "react-tooltip";

interface OverlayProps {
  visible: boolean;
  onEsc?: any;
  onClickOutside?: any;
  title: string;
  disableSubmitButton?: boolean;
  submitButtonText: string;
  onSubmitClick: any;
  cancelButtonText?: string;
  onCancelClick?: any;
  contentHeight: string;
  canProceed: boolean;
  isMissing?: string[];
  width: number | string;
  height: number;
  deleteButton?: any;
  saveDraftButton?: any;
  buttonOnMouseEnter?: any;
  windowWidth?: number;
}

interface OverlaySectionProps {
  heading?: string;
  description?: string;
}

export class Overlay extends Component<OverlayProps> {
  render() {
    let windowWidth = this.props.windowWidth || 769;
    return (
      this.props.visible && (
        <>
          {windowWidth < 768 && (
            <Box
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                background: "#00000080",
              }}
              onClick={this.props.onClickOutside}
            ></Box>
          )}
          <Layer
            onEsc={this.props.onEsc}
            onClickOutside={this.props.onClickOutside}
            modal={true}
            responsive={true}
            animation="fadeIn"
            // style={{
            //   width: this.props.width,
            //   height: this.props.height >= 650 ? "75%" : this.props.height,
            //   borderRadius: 15,
            //   // border: "3.5px solid black",
            //   padding: 0,
            // }}
            style={
              windowWidth < 768
                ? {
                    width: this.props.width,
                    height:
                      this.props.height >= 650 ? "75%" : this.props.height,
                    borderRadius: 15,
                    padding: 0,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }
                : {
                    width: this.props.width,
                    height:
                      this.props.height >= 650 ? "75%" : this.props.height,
                    borderRadius: 15,
                    /*border: "3.5px solid black",*/ padding: 0,
                  }
            }
          >
            <Box align="center" width="100%" style={{ overflowY: "auto" }}>
              <Box
                justify="start"
                width="99.7%"
                background="#eaf1f1"
                direction="row"
                style={{
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                  position: "sticky",
                  top: 0,
                  minHeight: "55px",
                  zIndex: 10,
                }}
              >
                <Box pad="30px" alignSelf="center" fill={true}>
                  <Text size="16px" color="black" weight="bold">
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
                background="#eaf1f1"
                style={{
                  borderBottomLeftRadius: "15px",
                  borderBottomRightRadius: "15px",
                  position: "sticky",
                  bottom: 0,
                  minHeight: "60px",
                  zIndex: 10,
                }}
              >
                <Box fill={true} pad="10px">
                  {" "}
                  {this.props.deleteButton}{" "}
                </Box>
                <Box> {this.props.saveDraftButton} </Box>
                {this.props.disableSubmitButton == true || (
                  <Box
                    data-tip
                    data-for="submitbutton"
                    margin={{ right: "32px" }}
                  >
                    <Button
                      fill={this.props.canProceed ? "#025377" : "#CCCCCC"}
                      disabled={!this.props.canProceed}
                      height="35px"
                      width="170px"
                      text={this.props.submitButtonText}
                      textColor="white"
                      onClick={this.props.onSubmitClick}
                      hoverIndicator="#6DA3C7"
                      onMouseEnter={this.props.buttonOnMouseEnter}
                    />
                    {!this.props.canProceed && this.props.isMissing && (
                      <ReactTooltip
                        id="submitbutton"
                        place="top"
                        effect="solid"
                      >
                        The following fields are missing
                        {this.props.isMissing.map((item, index) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ReactTooltip>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Layer>
        </>
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
            <Text size="14px" weight="bold" color="black">
              {this.props.heading}
            </Text>
          </Box>
        )}
        {this.props.children}
      </Box>
    );
  }
}
