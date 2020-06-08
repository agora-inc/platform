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

  formatTime(time: number) {
    let days = (time / 86400) >> 0; 
    let temp = time % 86400;
    let hours = (temp / 3600) >> 0;
    temp = temp % 3600;
    let minutes = (temp / 60) >> 0;
    let dayString = "";
    if (days == 1) {
      dayString = days + " day ";
    } else if (days > 1) {
      dayString = days + " days ";
    }

    return dayString + ('0' + hours).slice(-2) + "h " + ('0' + minutes).slice(-2) + "m"
  }

  render() {
    return (
      <div className="App">
        <div>Link shown in: {this.formatTime(this.state.currentTime)}</div>
      </div>
    );
  }
}
