import React, { Component } from "react";
import { Box, Button, Text } from "grommet";
import { User, Logout } from "grommet-icons";
import LoginModal from "./LoginModal";
import { UserService } from "../Services/UserService";
import GoLiveButton from "./GoLiveButton";
import { Avatar, Dropdown, Menu } from "antd";
import Identicon from "react-identicons";
import "../Styles/header.css";

interface State {
  isLoggedIn: boolean;
  user: { id: number; username: string } | null;
}

export default class UserManager extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoggedIn: UserService.isLoggedIn(),
      user: UserService.getCurrentUser(),
    };
  }

  menu = () => {
    return (
      <Menu style={{ borderRadius: 10, marginTop: 5 }}>
        <Box
          margin="small"
          gap="xsmall"
          focusIndicator={false}
          style={{ pointerEvents: "none" }}
        >
          <Identicon string={this.state.user?.username} size={25} />
          <Text weight="bold" size="20px">
            {this.state.user?.username}
          </Text>
        </Box>
        <Menu.Divider />
        <Menu.Item
          key="1"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "between",
            width: "100%",
          }}
        >
          <Text>My account</Text>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          key="2"
          onClick={() => {
            UserService.logout();
            this.setState({ isLoggedIn: UserService.isLoggedIn() });
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
          this.setState({
            isLoggedIn: UserService.isLoggedIn(),
            user: UserService.getCurrentUser(),
          });
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
