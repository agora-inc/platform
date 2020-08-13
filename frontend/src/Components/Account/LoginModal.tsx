import React, { Component } from "react";
import { Box, Heading, Button, TextInput, Text } from "grommet";
import { StatusCritical, StatusGood } from "grommet-icons";
import { UserService } from "../../Services/UserService";
import { Overlay } from "../Core/Overlay";
import Loading from "../Core/Loading";

interface Props {
  callback: any;
  open?: boolean;
}

interface State {
  showModal: boolean;
  failed: boolean;
  username: string;
  password: string;
  forgotPasswordText: string;
}

export default class LoginModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: this.props.open || false,
      failed: false,
      username: "",
      password: "",
      forgotPasswordText: "Forgot password?",
    };
  }

  onSubmit = () => {
    UserService.login(
      this.state.username,
      this.state.password,
      (result: boolean) => {
        if (result) {
          this.toggleModal();
          this.props.callback();
        } else {
          this.setState({ failed: true });
        }
      }
    );
  };

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
      failed: false,
      forgotPasswordText: "Forgot password?",
    });
  };

  onForgotPasswordClicked = () => {
    if (this.state.forgotPasswordText !== "Forgot password?") {
      return;
    }
    this.setState({ forgotPasswordText: "Emailing reset link..." });
    UserService.emailChangePasswordLink(
      this.state.username,
      (success: boolean) => {
        if (success) {
          this.setState({ forgotPasswordText: "Email sent!" });
        } else {
          this.setState({
            forgotPasswordText: "Error sending email :( please try again later",
          });
        }
      }
    );
  };

  render() {
    return (
      <Box>
        <Button
          label="Log in"
          onClick={this.toggleModal}
          style={{
            width: 90,
            height: 35,
            fontSize: 17,
            fontWeight: "bold",
            padding: 0,
            // margin: 6,
            backgroundColor: "#F2F2F2",
            border: "none",
            borderRadius: 7,
          }}
        />
        <Overlay
          width={400}
          height={this.state.failed ? 420 : 320}
          visible={this.state.showModal}
          title="Log in"
          onEsc={this.toggleModal}
          onClickOutside={this.toggleModal}
          onCancelClick={this.toggleModal}
          submitButtonText="Log in "
          onSubmitClick={this.onSubmit}
          canProceed={true}
          contentHeight={this.state.failed ? "300px" : "200px"}
        >
          {this.state.failed && (
            <Box
              style={{ width: "100%" }}
              background="status-error"
              round="small"
              pad="small"
              direction="row"
              justify="between"
            >
              <Heading level={5} margin="none" color="white">
                Unrecognised credentials
              </Heading>
              <StatusCritical />
            </Box>
          )}

          <Box
            width="100%"
            height="100%"
            // justify="end"
            align="center"
            pad={{ bottom: "30px" }}
            gap="xsmall"
          >
            <Box width="100%" gap="2px">
              <TextInput
                placeholder="Username"
                onChange={(e) => this.setState({ username: e.target.value })}
              />
            </Box>
            <Box width="100%" gap="2px">
              <TextInput
                type="password"
                placeholder="Password"
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </Box>
            <Box
              style={{ alignSelf: "start", alignItems: "center" }}
              direction="row"
              gap="xsmall"
            >
              <Text
                onClick={this.onForgotPasswordClicked}
                style={{
                  color: "black",
                  fontSize: 16,
                  cursor:
                    this.state.forgotPasswordText === "Forgot password?"
                      ? "pointer"
                      : "",
                  textDecoration:
                    this.state.forgotPasswordText === "Forgot password?"
                      ? "underline"
                      : "",
                }}
              >
                {this.state.forgotPasswordText}
              </Text>
              {this.state.forgotPasswordText === "Emailing reset link..." && (
                <Loading color="black" size={16} />
              )}
              {this.state.forgotPasswordText === "Email sent!" && (
                <StatusGood size="16px" color="status-ok" />
              )}
            </Box>
          </Box>
        </Overlay>
      </Box>
    );
  }
}
