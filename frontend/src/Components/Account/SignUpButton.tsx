import React, { Component } from "react";
import { Box, Heading, Button, TextInput, Text } from "grommet";
import { Link } from "react-router-dom";
import { StatusCritical } from "grommet-icons";
import { UserService } from "../../Services/UserService";
import { Overlay } from "../Core/Overlay";

interface Props {
  callback: any;
}

interface State {
  showModal: boolean;
  failed: boolean;
  username: string;
  password: string;
  confirmPassword: string;
}

export default class SignUpButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      failed: false,
      username: "",
      password: "",
      confirmPassword: "",
    };
  }

  onSubmit = () => {
    UserService.register(
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
    this.setState({ showModal: !this.state.showModal, failed: false });
  };

  isComplete = () => {
    return (
      this.state.username !== "" &&
      this.state.password !== "" &&
      this.state.confirmPassword === this.state.password
    );
  };

  render() {
    return (
      <Box>
        <Button
          label="Sign up"
          onClick={this.toggleModal}
          hoverIndicator={false}
          style={{
            width: 90,
            height: 35,
            fontSize: 17,
            fontWeight: "bold",
            color: "white",
            padding: 0,
            backgroundColor: "#7E1115",
            border: "none",
            borderRadius: 5,
          }}
        />
        <Overlay
          width={400}
          height={450}
          visible={this.state.showModal}
          title="Sign up"
          onEsc={this.toggleModal}
          onClickOutside={this.toggleModal}
          onCancelClick={this.toggleModal}
          submitButtonText="Sign up"
          onSubmitClick={this.onSubmit}
          canProceed={this.isComplete()}
          contentHeight="300px"
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
              <StatusCritical />
              <Heading level={5} margin="none" color="white">
                Error
              </Heading>
            </Box>
          )}
          <Box
            width="100%"
            height="100%"
            justify="end"
            align="center"
            pad={{ bottom: "10px" }}
            gap="xsmall"
          >
            <Box width="100%" gap="2px">
              <Text size="14px" color="black" margin={{ bottom: "24px" }}>
                This account will be associated with you as an individual - so
                you can choose any username you like. 
                After you've signed up you'll be able to create one or more {" "}
                <Link to={"/info/welcome"} onClick={this.toggleModal}>
                  <Text color="brand" weight="bold" size="14px">
                    Agoras
                  </Text>
                </Link>
                . These are what you'll use to organise talks.
              </Text>
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
            <Box width="100%" gap="2px">
              <TextInput
                type="password"
                placeholder="Confirm password"
                onChange={(e) =>
                  this.setState({ confirmPassword: e.target.value })
                }
              />
            </Box>

            <Text size="14px" color="black" margin={{top: "24px"}} alignSelf="start">
                By clicking Sign Up, you agree to our {" "}
                <Link to={"/info/tos"} onClick={this.toggleModal}>
                  <Text size="14px" weight="bold" color="brand">
                    terms
                  </Text>
                </Link>
                .
            </Text>
          </Box>
        </Overlay>
      </Box>
    );
  }
}
