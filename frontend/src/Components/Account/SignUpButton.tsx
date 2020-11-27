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
  error: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export default class SignUpButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      error: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
    };
  }

  onSubmit = () => {
    UserService.register(
      this.state.username,
      this.state.password,
      this.state.email,
      (result: string) => {
        // console.log(result);
        if (result === "ok") {
          this.toggleModal();
          this.props.callback();
        } else {
          this.setState({ error: result });
        }
      }
    );
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal, error: "" });
  };

  isComplete = () => {
    return (
      this.state.username !== "" &&
      this.state.password !== "" &&
      this.state.confirmPassword === this.state.password &&
      this.isValidEmail(this.state.email)
    );
  };

  isValidEmail = (email: string) => {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  render() {
    return (
      <Box style={{maxHeight: "30px"}}>
        <Button
          label="Sign up"
          onClick={this.toggleModal}
          hoverIndicator={false}
          style={{
            width: 90,
            height: 35,
            fontSize: 16,
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
          height={this.state.error !== "" ? 600 : 500}
          visible={this.state.showModal}
          title="Sign up"
          onEsc={this.toggleModal}
          onClickOutside={this.toggleModal}
          onCancelClick={this.toggleModal}
          submitButtonText="Sign up"
          onSubmitClick={this.onSubmit}
          canProceed={this.isComplete()}
          contentHeight={this.state.error !== "" ? "450px" : "350px"}
        >
          {this.state.error !== "" && (
            <Box
              style={{ width: "100%" }}
              background="status-error"
              round="small"
              pad="small"
              gap="small"
              direction="row"
            >
              <StatusCritical/>
              <Heading level={5} margin="none" color="white">
                {/*Error: {this.state.error}*/}
                Error: Username or email already taken.
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
            <Box width="100%" gap="5px">
              <Text size="14px" color="black" margin={{ bottom: "24px" }}>
                This account will be associated with you as an individual - so
                you can choose any username you like. After you've signed up
                you'll be able to create one or more{" "}
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
              <TextInput
                placeholder="Email"
                onChange={(e) => this.setState({ email: e.target.value })}
              />
              <TextInput
                type="password"
                placeholder="Password"
                onChange={(e) => this.setState({ password: e.target.value })}
              />
              <TextInput
                type="password"
                placeholder="Confirm password"
                onChange={(e) =>
                  this.setState({ confirmPassword: e.target.value })
                }
              />
            </Box>

            <Text
              size="14px"
              color="black"
              margin={{ top: "24px" }}
              alignSelf="start"
            >
              By clicking Sign Up, you agree to our{" "}
              <Link to={"/info/tos"} onClick={this.toggleModal}>
                <Text size="14px" weight="bold" color="brand">
                  terms.
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
