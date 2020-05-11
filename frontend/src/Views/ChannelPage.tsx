import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Box, Grid, Text, Video } from "grommet";
import DescriptionAndQuestions from "../Components/DescriptionAndQuestions";
import ChannelIdCard from "../Components/ChannelIdCard";
import Tag from "../Components/Tag";
import { View } from "grommet-icons";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";

interface Props {
  location: { pathname: string };
  streamId: number;
}

interface State {
  channel: Channel | null;
  admin: boolean;
  loading: boolean;
}

export default class ChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channel: null,
      admin: false,
      loading: true,
    };
  }

  componentWillMount() {
    this.fetchChannel();
  }

  fetchChannel = () => {
    ChannelService.getChannelByName(
      this.props.location.pathname.split("/")[2],
      (channel: Channel) => {
        let user = UserService.getCurrentUser();
        ChannelService.isUserInChannel(user.id, channel.id, (res: boolean) => {
          this.setState({ channel: channel, admin: res });
        });
      }
    );
  };

  render() {
    return (
      <Box>
        {this.state.admin ? (
          <Redirect
            to={{
              pathname: this.props.location.pathname + "/manage",
              state: { channel: this.state.channel },
            }}
          />
        ) : (
          <Box align="center" margin={{ top: "100px" }}>
            channel
          </Box>
        )}
      </Box>
    );
  }
}
