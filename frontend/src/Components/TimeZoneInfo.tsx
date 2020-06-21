import React, { Component, Fragment } from "react";
import { Text } from "grommet";
import "../Styles/tooltip.css";

export default class TimeZoneInfo extends Component {
  render() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (
      <div className="tooltip" style={{ fontSize: 15, marginRight: 5 }}>
        {tz}
        <span className="tooltiptext">
          When you create or view a talk, the time is shown in your local
          timezone
        </span>
      </div>
    );
  }
}
