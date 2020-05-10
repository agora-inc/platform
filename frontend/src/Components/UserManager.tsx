import React, { Component } from "react";
import { Box, Button, Text } from "grommet";
import { Deploy } from "grommet-icons";
import LoginModal from "./LoginModal";
import { UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import GoLiveButton from "./GoLiveButton";
import DropdownChannelButton from "./DropdownChannelButton";
import CreateChannelButton from "./CreateChannelButton";
import { Avatar, Dropdown, Menu } from "antd";
import Identicon from "react-identicons";
import "../Styles/header.css";

interface State {
  isLoggedIn: boolean;
  user: { id: number; username: string } | null;
  channels: Channel[];
}

export default class UserManager extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoggedIn: UserService.isLoggedIn(),
      user: UserService.getCurrentUser(),
      channels: [],
    };
  }

  componentWillMount() {
    this.fetchChannels();
  }

  fetchChannels = () => {
    this.state.user &&
      ChannelService.getChannelsForUser(
        this.state.user.id,
        (channels: Channel[]) => {
          this.setState({ channels });
        }
      );
  };

  menu = () => {
    return (
      <Menu style={{ borderRadius: 10, marginTop: 5 }}>
        <Box
          margin="small"
          gap="xsmall"
          focusIndicator={false}
          style={{ pointerEvents: "none" }}
        >
          <Box
            height="25px"
            width="25px"
            round="12.5px"
            justify="center"
            align="center"
            overflow="hidden"
          >
            <Identicon string={this.state.user?.username} size={25} />
          </Box>
          <Text weight="bold" size="20px">
            {this.state.user?.username}
          </Text>
        </Box>
        <Menu.Divider />
        <Box
          margin="small"
          focusIndicator={false}
          // style={{ pointerEvents: "none" }}
          gap="xsmall"
        >
          <Text weight="bold" color="black">
            My channels
          </Text>
          {this.state.channels.map((channel: Channel) => (
            <DropdownChannelButton channel={channel} />
          ))}
          <CreateChannelButton />
        </Box>
        <Menu.Divider />
        <Text weight="bold" color="black" margin="small">
          Account
        </Text>
        <Menu.Item
          key="1"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "between",
            width: "100%",
            marginTop: 3,
            paddingBottom: 3,
            paddingTop: 3,
          }}
        >
          <Text>Preferences</Text>
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            UserService.logout();
            this.setState({ isLoggedIn: UserService.isLoggedIn() });
          }}
          style={{
            paddingBottom: 3,
            paddingTop: 3,
          }}
        >
          <Text>Log out</Text>
        </Menu.Item>
      </Menu>
    );
  };

  loggedInStuff = (username: string) => {
    return (
      <Box direction="row" align="center" justify="center">
        <GoLiveButton margin="none" />
        <Dropdown
          overlay={this.menu()}
          trigger={["click"]}
          overlayStyle={{ width: 200 }}
        >
          <Button
            margin={{ left: "10px" }}
            style={{
              height: 45,
              width: 45,
              borderRadius: 22.5,
              overflow: "hidden",
            }}
            focusIndicator={false}
          >
            <Identicon string={this.state.user?.username} size={45} />
          </Button>
        </Dropdown>
      </Box>
    );
  };

  loggedOutStuff = (
    <Box direction="row" align="center" justify="center">
      <LoginModal
        callback={() => {
          this.setState(
            {
              isLoggedIn: UserService.isLoggedIn(),
              user: UserService.getCurrentUser(),
            },
            () => {
              this.fetchChannels();
            }
          );
        }}
      />
      <Button
        label="Sign up"
        onClick={() => {}}
        style={{
          width: 100,
          height: 45,
          fontSize: 20,
          fontWeight: "bold",
          padding: 0,
          margin: 6,
          backgroundColor: "#61EC9F",
          border: "none",
          borderRadius: 15,
        }}
      />
    </Box>
  );

  render() {
    const username = this.state.user ? this.state.user.username : "?";
    return (
      <Box style={{ width: 220 }} direction="row" justify="end">
        {this.state.isLoggedIn
          ? this.loggedInStuff(username)
          : this.loggedOutStuff}
      </Box>
    );
  }
}
