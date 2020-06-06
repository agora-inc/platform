import React, { Component } from "react";

interface Props {
  targetTime: number
}

interface State {
  currentTime: number
}

export default class UserManager extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentTime: new Date().getUTCSeconds()
    };
  }

  componentWillMount() {
    setInterval(() => {
      this.setState({currentTime: this.props.targetTime - new Date().getUTCSeconds()});
    }, 1000);
  }

  render() {
    return (
      <div className="App">
        <div>Countdown: {this.state.currentTime}</div>
      </div>
    );
  }
}
