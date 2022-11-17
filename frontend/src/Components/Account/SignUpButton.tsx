import React, { Component } from "react";
import { basePoint } from "../../config";
import { Box, Heading, Button, TextInput, Text } from "grommet";
import { Link, Route } from "react-router-dom";
import { StatusCritical, Group} from "grommet-icons";
import { UserService } from "../../Services/UserService";
import { Overlay } from "../Core/Overlay";
import { Channel, ChannelService } from "../../Services/ChannelService";
import { ProfileService } from "../../Services/ProfileService";
import { FaThemeisle } from "react-icons/fa";

interface Props {
  channelId?: number;
  callback: any;
  width?: string;
  height?: string;
  textSize?: string;
  text?: string;
  icon?: boolean;
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
              window.location.href = basePoint + "/profile/" + result.userId
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
      this.state.position !== "" &&
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
          direction="row"
        >
          {this.props.icon ? (<Group size="medium" style={{marginRight: "10px"}}/>) : "" }
          <Text size={this.state.textSize} weight="bold"> {this.props.text ? this.props.text : "Sign up"} </Text>
        </Box>
        
      </Box>
    );
  }
}
