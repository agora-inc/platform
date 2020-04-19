import React, { Component } from "react";
import { Box, Grommet, Heading, Layer, Button, Form, FormField } from "grommet";
import { StatusCritical } from "grommet-icons";
import { ReactComponent as Logo } from "../apollo.svg";
import { UserService } from "../Services/UserService";

interface Props {
  callback: any;
}

interface State {
  showModal: boolean;
  failed: boolean;
}

export default class LoginModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      failed: false,
    };
  }

  onSubmit = (e: any) => {
    let user = e.value;
    UserService.login(user.username, user.password, (result: boolean) => {
      if (result) {
        this.toggleModal();
        this.props.callback();
      } else {
        this.setState({ failed: true });
      }
    });
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
            width: 100,
            height: 45,
            fontSize: 20,
            fontWeight: "bold",
            padding: 0,
            margin: 6,
            backgroundColor: "#F2F2F2",
            border: "none",
            borderRadius: 15,
          }}
        />
        {this.state.showModal && (
          <Layer
            onEsc={this.toggleModal}
            onClickOutside={this.toggleModal}
            modal
            responsive
            animation="fadeIn"
            style={{ width: 400, borderRadius: 15 }}
          >
            <Box margin="large" align="center">
              <Logo style={{ height: "8vh" }} />
              <Heading level={2} style={{ marginBottom: 20 }}>
                Log in to Agora
              </Heading>
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
              <Form
                style={{ width: "100%", marginTop: 20 }}
                onSubmit={this.onSubmit}
              >
                <FormField name="username" placeholder="Username" />
                <FormField
                  name="password"
                  placeholder="Password"
                  style={{ marginBottom: 40 }}
                  type="password"
                />
                <Button
                  type="submit"
                  primary
                  label="Log in"
                  color="#61EC9F"
                  style={{ width: "100%", height: 45 }}
                />
              </Form>
            </Box>
          </Layer>
        )}
      </Box>
    );
  }
}
