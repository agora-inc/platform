import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Text, Box, TextInput, TextArea, Button } from "grommet";
import AsyncButton from "../Core/AsyncButton";
import { User } from "../../Services/UserService";
import { Previous } from "grommet-icons";
import { ChannelService } from "../../Services/ChannelService";

interface Props {
  user: User | null;
  onBackClicked: any;
  onComplete: any;
}

interface State {
  newChannelName: string;
  newChannelDescription: string;
  redirect: boolean;
}

export default class CreateChannelCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      newChannelName: "",
      newChannelDescription: "",
      redirect: false,
    };
  }

  onCreateClicked = (callback: any) => {
    ChannelService.createChannel(
      this.state.newChannelName,
      this.state.newChannelDescription,
      this.props.user!.id,
      () => {
        callback();
        this.setState({ redirect: true }, () => {
          this.props.onComplete();
        });
      }
    );
  };

  render() {
    return this.state.redirect ? (
      <Redirect to={`/${this.state.newChannelName}`} />
    ) : (
      <Box
        width="100%"
        height="100%"
        background="white"
        pad="small"
        justify="between"
      >
        <Box
          direction="row"
          width="100%"
          gap="xsmall"
          pad="none"
          margin={{ left: "-7px" }}
        >
          <Box
            onClick={() => this.props.onBackClicked()}
            focusIndicator={false}
          >
            <Previous color="black" />
          </Box>
          <Text weight="bold" color="black">
            New channel
          </Text>
        </Box>
        <Box gap="small">
          <TextInput
            style={{ width: 225 }}
            placeholder="channel name"
            onChange={(e) => this.setState({ newChannelName: e.target.value })}
          />
          <TextArea
            style={{ width: 225 }}
            placeholder="channel description"
            onChange={(e) =>
              this.setState({ newChannelDescription: e.target.value })
            }
          />
          <AsyncButton
            color="black"
            fontColor="white"
            label="Create"
            disabled={
              this.state.newChannelName === "" ||
              this.state.newChannelDescription === ""
            }
            onClick={this.onCreateClicked}
            width="100%"
            height="40px"
          />
        </Box>
      </Box>
    );
  }
}