import React, { Component } from "react";

import { User, UserService } from "../Services/UserService";
import ClapSoundList from "../Components/Streaming/Clapping/ClapSoundList";

interface Props {
  location: { pathname: string };
}

export default class Preferences extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    // console.log("Preferences logged");
  }

  render() {
    return <ClapSoundList />;
  }
}
