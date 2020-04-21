import React, { Component } from "react";
import { Box, DropButton, Text } from "grommet";
import { FormDown, Checkmark, FormCalendar, View } from "grommet-icons";

interface State {
  open: boolean;
  selected: string;
}

export default class SmallSelector extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      selected: "Date",
      open: false,
    };
  }

  select = (option: string) => {
    this.setState({ selected: option }, () => {
      this.toggle();
    });
  };

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  renderDropContent = () => {
    return (
      <Box
        pad="small"
        background="white"
        round="small"
        margin={{ top: "10px" }}
        style={{ borderRadius: 10, width: 230 }}
      >
        <Box
          background={this.state.selected === "Date" ? "#f2f2f2" : "white"}
          direction="row"
          justify="between"
          align="center"
          pad="xsmall"
          round="xsmall"
          onClick={() => this.select("Date")}
          focusIndicator={false}
          hoverIndicator="#f2f2f2"
        >
          <Box direction="row" align="center" gap="xsmall">
            <FormCalendar size="18px" color="black" />
            <Text size="16px" color="black">
              Date
            </Text>
          </Box>
          {this.state.selected === "Date" && (
            <Checkmark size="16px" color="black" />
          )}
        </Box>
        <Box
          background={this.state.selected === "Views" ? "#f2f2f2" : "white"}
          direction="row"
          justify="between"
          align="center"
          pad="xsmall"
          round="xsmall"
          onClick={() => this.select("Views")}
          focusIndicator={false}
          hoverIndicator="#f2f2f2"
        >
          <Box direction="row" align="center" gap="xsmall">
            <View size="16px" color="black" />
            <Text size="16px" color="black">
              Views
            </Text>
          </Box>
          {this.state.selected === "Views" && (
            <Checkmark size="16px" color="black" />
          )}
        </Box>
      </Box>
    );
  };

  render() {
    return (
      <DropButton
        label={this.state.selected}
        color="lightgrey"
        style={{ borderRadius: 5 }}
        primary
        dropAlign={{ top: "bottom", right: "right" }}
        dropContent={this.renderDropContent()}
        icon={<FormDown />}
        reverse
        open={this.state.open}
        onOpen={this.toggle}
        onClose={this.toggle}
      />
    );
  }
}
