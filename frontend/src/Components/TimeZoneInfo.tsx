import React, { Component } from "react";
import moment from "moment";
import "../Styles/tooltip.css";

type State = {
  time: string;
};

export default class TimeZoneInfo extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      time: moment().format("HH:mm"),
    };
  }

  componentWillMount() {
    setInterval(this.updateTime, 1000);
  }

  updateTime = () => {
    this.setState({ time: moment().format("HH:mm") });
  };

  //   componentWillUnmount() {
  //     clearInterval(this.interval);
  //   }

  render() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (
      <div className="tooltip" style={{ fontSize: 14, marginRight: 5 }}>
        {tz} {this.state.time}
        <span className="tooltiptext">
          When you create or view a talk, the time is shown in your local
          timezone
        </span>
      </div>
    );
  }
}
