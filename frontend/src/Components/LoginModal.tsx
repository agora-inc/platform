import React, { Component } from "react";
import { Box, Heading, Button, TextInput, Text } from "grommet";
import { StatusCritical } from "grommet-icons";
import { UserService } from "../Services/UserService";
import { Overlay } from "./Core/Overlay";

interface Props {
  callback: any;
}

interface State {
  showModal: boolean;
  failed: boolean;
  username: string;
  password: string;
}

export default class LoginModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      failed: false,
      username: "",
      password: "",
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
    this.setState({ showModal: !this.state.showModal, failed: false });
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
          height={400}
          visible={this.state.showModal}
          title="Log in"
          onEsc={this.toggleModal}
          onClickOutside={this.toggleModal}
          onCancelClick={this.toggleModal}
          submitButtonText="Log in"
          onSubmitClick={this.onSubmit}
          canProceed={true}
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
                Incorrect username or password
              </Heading>
            </Box>
          )}
          <Box
            width="100%"
            height="100%"
            justify="end"
            align="center"
            pad={{ bottom: "50px" }}
            gap="xsmall"
          >
            <Box width="100%" gap="2px">
              <Text size="14px" weight="bold" color="black">
                Username
              </Text>
              <TextInput
                placeholder="type something"
                onChange={(e) => this.setState({ username: e.target.value })}
              />
            </Box>
            <Box width="100%" gap="2px">
              <Text size="14px" weight="bold" color="black">
                Password
              </Text>
              <TextInput
                type="password"
                placeholder="type something"
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </Box>
          </Box>
        </Overlay>
      </Box>
    );
  }
}
