import React, { Component } from "react";
import { Box, Button, Text } from "grommet";
import LoginModal from "./LoginModal";
import { UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import DropdownChannelButton from "./DropdownChannelButton";
import CreateChannelButton from "./CreateChannelButton";
import CreateChannelCard from "./CreateChannelCard";
import { Dropdown, Menu } from "antd";
import Identicon from "react-identicons";
import "../Styles/header.css";
import "../Styles/antd.css";
import Preferences from "../Views/Preferences";
import PreferenceButton from "./PreferenceButton";

interface State {
  isLoggedIn: boolean;
  user: { id: number; username: string } | null;
  channels: Channel[];
  showCreateChannelCard: boolean;
  showDropdown: boolean;
}

export default class UserManager extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoggedIn: UserService.isLoggedIn(),
      user: UserService.getCurrentUser(),
      channels: [],
      showCreateChannelCard: false,
      showDropdown: false,
    };
  }

  componentWillMount() {
    this.fetchChannels();
  }

  fetchChannels = () => {
    this.state.user &&
      ChannelService.getChannelsForUser(
        this.state.user.id,
        ["owner", "member"],
        (channels: Channel[]) => {
          this.setState({ channels });
        }
      );
  };

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  };

  toggleCreateChannelCard = () => {
    this.setState({
      showCreateChannelCard: !this.state.showCreateChannelCard,
    });
  };

  menu = () => {
    return this.state.showCreateChannelCard ? (
      <Menu
        style={{
          borderRadius: 10,
          marginTop: 5,
          overflow: "hidden",
          paddingBottom: 0,
          height: 326,
          width: 250,
        }}
      >
        <CreateChannelCard
          onBackClicked={this.toggleCreateChannelCard}
          onComplete={() => {
            this.fetchChannels();
            this.toggleCreateChannelCard();
            this.toggleDropdown();
          }}
          user={this.state.user}
        />
      </Menu>
    ) : (
      <Menu
        onClick={() => {}}
        style={{
          borderRadius: 10,
          marginTop: 5,
          overflow: "hidden",
          paddingBottom: 0,
          minHeight: 326,
          width: 250,
        }}
      >
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
            <DropdownChannelButton
              channel={channel}
              onClick={this.toggleDropdown}
            />
          ))}
          <CreateChannelButton onClick={this.toggleCreateChannelCard} />
        </Box>
        <Menu.Divider />
        <Text weight="bold" color="black" margin="small">
          Account
        </Text>
        <Menu.Item
          onClick={this.toggleDropdown}
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
          <PreferenceButton />
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            UserService.logout();
            this.setState({
              isLoggedIn: UserService.isLoggedIn(),
              showDropdown: false,
            });
          }}
          style={{
            paddingBottom: 5,
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
      <Dropdown
        overlay={this.menu()}
        trigger={["click"]}
        overlayStyle={{ width: 250 }}
        visible={this.state.showDropdown}
      >
        <Button
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            overflow: "hidden",
          }}
          focusIndicator={false}
          onClick={this.toggleDropdown}
        >
          <Identicon string={this.state.user?.username} size={40} />
        </Button>
      </Dropdown>
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
      <Box direction="row" justify="end">
        {this.state.isLoggedIn
          ? this.loggedInStuff(username)
          : this.loggedOutStuff}
      </Box>
    );
  }
}
