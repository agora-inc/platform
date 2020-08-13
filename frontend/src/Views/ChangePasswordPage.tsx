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
};

export default class ChangePasswordPage extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      code: "",
      password: "",
      confirmPassword: "",
      redirect: false,
    };
  }

  componentWillMount() {
    let url = new URL(window.location.href);
    let code = url.searchParams.get("code") || "";
    this.setState({
      code,
    });
  }

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
          width={400}
          height={430}
          visible={true}
          title="Change password"
          submitButtonText="Submit"
          onSubmitClick={this.onSubmit}
          canProceed={this.isComplete()}
          contentHeight={"300px"}
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
