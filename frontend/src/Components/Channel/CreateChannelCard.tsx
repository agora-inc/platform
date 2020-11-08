import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Text, Box, TextInput, TextArea, Button } from "grommet";
import AsyncButton from "../Core/AsyncButton";
import { User } from "../../Services/UserService";
import { Previous } from "grommet-icons";
import { ChannelService } from "../../Services/ChannelService";


import RichTextEditor from 'react-rte';







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
          // gap="xsmall"
          pad="none"
          margin={{ left: "-7px" }}
        >
          <Box
            onClick={() => this.props.onBackClicked()}
            focusIndicator={false}
          >
            <Previous color="black" />
          </Box>
          <Text weight="bold" color="black" size="14px">
            Create an Agora
          </Text>
        </Box>


        
        <Box gap="small">
          <TextInput
            style={{ width: 300 }}
            placeholder="Your Agora name"
            onChange={(e) => this.setState({ newChannelName: e.target.value })}
          />
          {/* <TextArea
            style={{ width: 300, height: 100 }}
            placeholder="Description"
            onChange={(e) =>
              this.setState({ newChannelDescription: e.target.value })
            }
          /> */}

          <AsyncButton
            color="#7E1115"
            fontColor="white"
            label="Create"
            disabled={
              this.state.newChannelName === ""
            }
            onClick={this.onCreateClicked}
            width="300px"
            height="40px"
            round="xsmall"
          />
        </Box>
      </Box>
    );
  }
}
