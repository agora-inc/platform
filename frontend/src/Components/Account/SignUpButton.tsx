import React, { Component } from "react";
import { Box, Heading, Button, TextInput, Text } from "grommet";
import { Link, Route } from "react-router-dom";
import { StatusCritical } from "grommet-icons";
import { UserService } from "../../Services/UserService";
import { Overlay } from "../Core/Overlay";
import { Channel, ChannelService } from "../../Services/ChannelService";
import { ProfileService } from "../../Services/ProfileService";

interface Props {
  channelId?: number;
  callback: any;
  width?: string;
  height?: string;
  textSize?: string;
  text?: string;
}

interface State {
  showModal: boolean;
  error: string;
  username: string;
  fullName: string;
  position: string;
  institution: string;
  password: string;
  confirmPassword: string;
  email: string;
  width: string;
  height: string;
  textSize: string;

}

export default class SignUpButton extends Component<Props, State> {
  constructor(props: Props ) {
    super(props);
    this.state = {
      showModal: false,
      error: "",
      username: "",
      fullName: "",
      position: "",
      institution: "",
      password: "",
      confirmPassword: "",
      email: "",
      width: this.props.width ? this.props.width : "100px",
      height: this.props.height ? this.props.height : "35px",
      textSize: this.props.textSize ? this.props.textSize : "14px"
    };
  }

  onSubmit = () => {
    UserService.register(
      this.state.email,
      this.state.password,
      this.state.email,
      this.state.position,
      this.state.institution,
      this.props.channelId !== undefined ? this.props.channelId : 0,
      (result: {status: string, userId: number}) => {
        if (result.status === "ok") {
          ProfileService.createProfile(
            result.userId, 
            this.state.fullName, 
            () => {
              this.toggleModal();
              this.props.callback();
            }
          )
        } else {
          this.setState({ error: result.status });
        }
      }
    );
  };


  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal, error: "" });
  };

  isComplete = () => {
    return (
      // this.state.username !== "" &&
      this.state.fullName !== "" &&
      this.state.email !== "" &&
      // this.state.position !== "" &&
      this.state.institution !== "" &&
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
      <Box style={this.props.height ? {} : {maxHeight: "30px"}}>
        <Box
          onClick={this.toggleModal}
          background="#0C385B"
          hoverIndicator="#BAD6DB"
          focusIndicator={false}
          align="center"
          justify="center"
          width={this.state.width}
          height={this.state.height}
          round="xsmall"
        >
          <Text size={this.state.textSize} weight="bold"> {this.props.text ? this.props.text : "Sign up"} </Text>
        </Box>
        <Overlay
          width={500}
          height={this.state.error !== "" ? 660 : 600}
          visible={this.state.showModal}
          title="Sign up"
          onEsc={this.toggleModal}
          onClickOutside={this.toggleModal}
          onCancelClick={this.toggleModal}
          submitButtonText="Sign up"
          onSubmitClick={this.onSubmit}
          canProceed={this.isComplete()}
          contentHeight={this.state.error !== "" ? "530px" : "450px"}
        >
          {this.state.error !== "" && (
            <Box
              style={{ width: "100%" }}
              background="#DDDDDD"
              round="small"
              pad="small"
              gap="small"
              direction="row"
            >
              <StatusCritical/>
              <Heading level={5} margin="none" color="grey">
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
            <Box width="90%" gap="5px">
              <Text size="14px" color="black" margin={{ bottom: "24px" }}>
                This account will be associated with you as an individual. After you've signed up
                you'll be able to fill your profile and advertise your research. You may also have free access to premium features via your institution.
                {/*create one or more{" "}
                <Link to={"/info/welcome"} onClick={this.toggleModal}>
                  <Text color="color1" weight="bold" size="14px">
                    Agoras
                  </Text>
                </Link>
                . These are what you'll use to organise talks.*/}
              </Text>
              {/* <TextInput
                placeholder="Username"
                onChange={(e) => this.setState({ username: e.target.value })}
              /> */}
              <TextInput
                placeholder="Full name*"
                onChange={(e) => this.setState({ fullName: e.target.value })}
              />
              <TextInput
                placeholder="Position"
                onChange={(e) => this.setState({ position: e.target.value })}
              />
              <TextInput
                placeholder="Institution"
                onChange={(e) => this.setState({ institution: e.target.value })}
              />
              <TextInput
                placeholder="Email*"
                onChange={(e) => this.setState({ email: e.target.value })}
              />
              <TextInput
                type="password"
                placeholder="Password*"
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
                <Text size="14px" weight="bold" color="color1">
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
