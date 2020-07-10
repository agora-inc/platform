import React, { Component } from "react";
import { Box, Text, Button } from "grommet";
import { User, UserService } from "../Services/UserService";
import LoginModal from "../Components/Account/LoginModal";
import ClapSoundList from "../Components/Streaming/ClapSoundList";

interface Props {
  location: { pathname: string };
}

interface State {
  user: User | null;
  isLoggedIn: boolean;
}

export default class Preferences extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoggedIn: UserService.isLoggedIn(),
      user: UserService.getCurrentUser(),
    };
  }

  componentDidMount() {
    // console.log("Preferences logged");
  }

  render() {
    return <ClapSoundList />;
  }
}
