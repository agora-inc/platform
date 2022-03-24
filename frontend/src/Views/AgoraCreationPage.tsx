import React, { Component } from "react";
import { User, UserService } from "../Services/UserService";
import { Box, Text, Grid } from "grommet";
import { Checkmark, Close, Linkedin, Twitter } from "grommet-icons";
import agorastreamLogo from "../assets/general/agora.stream_logo_300px.svg";
import agoraLogo from "../assets/general/agora_logo_v2.1.svg";

import ReactTooltip from "react-tooltip";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

import CreateChannelButton from "../Components/Channel/CreateChannelButton";
import CreateChannelOverlay from "../Components/Channel/CreateChannelButton/CreateChannelOverlay";
import { StreamingProductService } from "../Services/StreamingProductService";
import MediaQuery from "react-responsive";
import PricingPlans from "../Views/PricingPlans";
import agoraStreamFullLogo from "../assets/general/agora.stream_logo_300px.svg";

interface Props {
  user: User | null;
}

interface State {
  loading: boolean;
  text: string;
  sizeHeader: string;
  sizeItem: string;
  sizeText: string;
  agoraCreationOverlay: {
    showCreateChannelOverlay: boolean;
  };
  isMobile: boolean;
  isSmallScreen: boolean;
  windowWidth: number;
}

export default class AgoraCreationPage extends Component<Props, State> {
  private smallScreenBreakpoint: number;
  private mobileScreenBreakpoint: number;
  constructor(props: any) {
    super(props);
    this.mobileScreenBreakpoint = 992;
    this.smallScreenBreakpoint = 480;
    this.state = {
      loading: true,
      text: "",
      sizeHeader: "32px",
      sizeItem: "16px",
      sizeText: "14px",
      agoraCreationOverlay: {
        showCreateChannelOverlay: false,
      },
      isMobile: window.innerWidth < this.mobileScreenBreakpoint,
      isSmallScreen: window.innerWidth < this.smallScreenBreakpoint,
      windowWidth: window.innerWidth,
    };
  }

  updateResponsiveSettings = () => {
    this.setState({
      isMobile: window.innerWidth < this.mobileScreenBreakpoint,
      isSmallScreen: window.innerWidth < this.smallScreenBreakpoint,
      windowWidth: window.innerWidth,
    });
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateResponsiveSettings);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateResponsiveSettings);
  }

  toggleCreateChannelOverlay = () => {
    this.setState({
      agoraCreationOverlay: {
        showCreateChannelOverlay:
          !this.state.agoraCreationOverlay.showCreateChannelOverlay,
      },
    });
  };

  updateText = (e: any) => {
    this.setState({
      text: e.target.value,
    });
  };

  parse = (rawText: string) => {
    const textArr = rawText.split("$");
    return (
      <Box
        width="100%"
        height="100%"
        margin={{ left: "15px" }}
        overflow="scroll"
      >
        <Box
          //   height="100%"
          direction="row"
          wrap
          align="center"
          style={{
            overflowWrap: "break-word",
            wordBreak: "break-all",
          }}
        >
          {textArr.map((textElement: string, index) => {
            if (index % 2 == 0) {
              return (
                <Text
                  color="black"
                  style={{
                    marginLeft: 3,
                    marginRight: 3,
                    // whiteSpace: "pre",
                    overflowWrap: "break-word",
                    wordBreak: "break-all",
                  }}
                  size="18px"
                >
                  {textElement}
                </Text>
              );
            } else {
              if (textElement != "" && index != textArr.length - 1) {
                return <InlineMath math={textElement} />;
              }
            }
          })}
        </Box>
      </Box>
    );
  };

  render() {
    let path_image =
      "/home/cloud-user/plateform/agora/frontend/media/tutorial/adding_members/";
    var renderMobileView = window.innerWidth < 1000;

    console.log("width", window.innerWidth);

    return (
      <Box
        id="pricing"
        width="100vw"
        height="auto"
        align="center"
        // background="color6"
      >
        <Box width={renderMobileView ? "95%" : "70%"} alignContent="center">
          <Box margin={{ top: "70px" }} gap="30px">
            <Box direction="row" gap="30px" align="center">
              <Text size="25px" weight="bold" color="color1">
                Host your events now, for free!
              </Text>
              <CreateChannelButton
                onClick={this.toggleCreateChannelOverlay}
                width="190px"
                text={"Create your agora"}
              />
            </Box>

            <Text size="18px">
              An agora is a hub for your community. It is the place where you
              organise and list all your events, past or future.
            </Text>

            <Text size="18px">
              If you wish to empower your community with awesome features, check
              out the pricing below!
            </Text>
          </Box>

          {this.state.agoraCreationOverlay.showCreateChannelOverlay && (
            <CreateChannelOverlay
              onBackClicked={this.toggleCreateChannelOverlay}
              onComplete={() => {
                this.toggleCreateChannelOverlay();
              }}
              visible={true}
              user={this.props.user}
              windowWidth={this.state.windowWidth}
            />
          )}

          <PricingPlans
            callback={() => {}}
            channelId={null}
            userId={null}
            disabled={true}
            showDemo={false}
            headerTitle={true}
            title={" "}
            isMobile={this.state.isMobile}
          />
        </Box>
      </Box>
    );
  }
}
