import React, { Component } from "react";
import { Box, Text } from "grommet";
import { CalendarService } from "../Services/CalendarService";
import { Google } from "grommet-icons";

interface Props {
  startTime: string;
  endTime: string;
  name: string;
  description: string;
}

export default class AddToCalendarButtons extends Component<Props> {
  render() {
    return (
      <Box direction="row" width="100%" justify="between">
        <Box
          width="48%"
          height="35px"
          round="xsmall"
          background="white"
          style={{ border: "3px solid black" }}
          align="center"
          justify="center"
          direction="row"
          gap="4px"
        >
          <Text size="14px" weight="bold" color="black">
            Add to
          </Text>
          <Google size="14px" color="black" />
          <Text size="14px" weight="bold" color="black">
            Calendar
          </Text>
        </Box>
        <Box
          width="48%"
          height="35px"
          round="xsmall"
          background="white"
          style={{ border: "3px solid black" }}
          align="center"
          justify="center"
        >
          <Text size="14px" weight="bold" color="black">
            Download .ics file
          </Text>
        </Box>
      </Box>
    );
  }
}
