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
  width: number;
  height: number;
  deleteButton?: any;
  saveDraftButton?: any;
  buttonOnMouseEnter?: any;
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
            height: this.props.height > 700 ? "82%" : this.props.height,
            borderRadius: 15,
            // border: "3.5px solid black",
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
                minHeight: "55px",
                zIndex: 10,
              }}
            >
              <Box pad="30px" alignSelf="center" fill={true}>
                <Text size="16px" color="black" weight="bold"  >
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
              <Box fill={true} pad="10px"> {this.props.deleteButton} </Box>
              <Box > {this.props.saveDraftButton} </Box>
              {(this.props.disableSubmitButton == true) || (
                <Box data-tip data-for='submitbutton' margin={{right: "32px"}}   > 
                  <Button
                    fill="#7E1115"
                    disabled={!this.props.canProceed}
                    height="35px"
                    width="170px"
                    text={this.props.submitButtonText}
                    onClick={this.props.onSubmitClick}
                    hoverIndicator="#5A0C0F"
                    onMouseEnter={this.props.buttonOnMouseEnter}
                  />
                  {!this.props.canProceed && this.props.isMissing && (
                    <ReactTooltip id='submitbutton' place="top" effect="solid">
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