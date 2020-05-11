import React, { Component } from "react";
import { Redirect } from "react-router";
import { Box, Text } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import Loading from "../Components/Loading";

interface Props {
  location: any;
}

interface State {
  channel: Channel | null;
  loading: boolean;
  allowed: boolean;
}

export default class ManageChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channel: null,
      loading: true,
      allowed: false,
    };
  }

  componentWillMount() {
    this.getChannelAndCheckAccess();
  }

  getChannelAndCheckAccess = () => {
    if (this.props.location.state) {
      this.setState({
        channel: this.props.location.state.channel,
        allowed: true,
        loading: false,
      });
    } else {
      ChannelService.getChannelByName(
        this.props.location.pathname.split("/")[2],
        (channel: Channel) => {
          let user = UserService.getCurrentUser();
          ChannelService.isUserInChannel(
            user.id,
            channel.id,
            (res: boolean) => {
              this.setState({ channel: channel, allowed: res, loading: false });
            }
          );
        }
      );
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <Box width="100%" height="100%" justify="center" align="center">
          <Loading color="black" size={50} />
        </Box>
      );
    } else {
      return this.state.allowed ? (
        <Box></Box>
      ) : (
        <Redirect
          to={{
            pathname: "/",
          }}
        />
      );
    }
  }
}
