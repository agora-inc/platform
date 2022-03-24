import React, { Component } from "react";
import { Box, TextInput } from "grommet";
import { Overlay } from "../Components/Core/Overlay";
import { UserService } from "../Services/UserService";
import { Redirect } from "react-router-dom";

type State = {
  code: string;
  password: string;
  confirmPassword: string;
  redirect: boolean;
  isMobile: boolean;
  isSmallScreen: boolean;
  windowWidth: number;
};

export default class ChangePasswordPage extends Component<{}, State> {
  private smallScreenBreakpoint: number;
  private mobileScreenBreakpoint: number;
  constructor(props: any) {
    super(props);
    this.mobileScreenBreakpoint = 992;
    this.smallScreenBreakpoint = 480;
    this.state = {
      code: "",
      password: "",
      confirmPassword: "",
      redirect: false,
      isMobile: window.innerWidth < this.mobileScreenBreakpoint,
      isSmallScreen: window.innerWidth < this.smallScreenBreakpoint,
      windowWidth: window.innerWidth,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateResponsiveSettings);
  }

  componentWillMount() {
    let url = new URL(window.location.href);
    let code = url.searchParams.get("code") || "";
    this.setState({
      code,
    });
    window.removeEventListener("resize", this.updateResponsiveSettings);
  }

  updateResponsiveSettings = () => {
    this.setState({
      isMobile: window.innerWidth < this.mobileScreenBreakpoint,
      isSmallScreen: window.innerWidth < this.smallScreenBreakpoint,
      windowWidth: window.innerWidth,
    });
  };

  isComplete = () => {
    return (
      this.state.password !== "" &&
      this.state.password === this.state.confirmPassword
    );
  };

  onSubmit = () => {
    UserService.changePassword(
      this.state.password,
      this.state.code,
      (success: boolean) => {
        if (success) {
          this.setState({ redirect: true });
        }
      }
    );
  };

  render() {
    return (
      <Box
        width="100%"
        height="100%"
        overflow="hidden"
        pad="medium"
        align="center"
        justify="center"
      >
        {this.state.redirect && (
          <Redirect to={{ pathname: "/", search: "?showLogin=true" }} />
        )}
        <Overlay
          width={window.innerWidth < 768 ? 320 : 500}
          height={450}
          visible={true}
          title="Change password"
          submitButtonText="Submit"
          onSubmitClick={this.onSubmit}
          canProceed={this.isComplete()}
          contentHeight={"300px"}
          windowWidth={this.state.windowWidth}
        >
          {/* {this.state.error !== "" && (
            <Box
              style={{ width: "100%" }}
              background="status-error"
              round="small"
              pad="small"
              gap="small"
              direction="row"
            >
              <StatusCritical />
              <Heading level={5} margin="none" color="white">
                Error: {this.state.error}
              </Heading>
            </Box>
          )} */}
          <Box
            width="100%"
            height="100%"
            justify="end"
            align="center"
            pad={{ bottom: "10px" }}
            gap="xsmall"
          >
            <Box width="100%" gap="5px">
              <TextInput
                type="password"
                placeholder="New password"
                onChange={(e) => this.setState({ password: e.target.value })}
              />
              <TextInput
                type="password"
                placeholder="Confirm new password"
                onChange={(e) =>
                  this.setState({ confirmPassword: e.target.value })
                }
              />
            </Box>
          </Box>
        </Overlay>
      </Box>
    );
  }
}
