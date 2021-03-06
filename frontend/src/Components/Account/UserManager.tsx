import React, { Component } from "react";
import { Box, Button, Text, TextArea } from "grommet";
import {UserSettings} from "grommet-icons";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import { UserService } from "../../Services/UserService";
import { Channel, ChannelService } from "../../Services/ChannelService";
import DropdownChannelButton from "../Channel/DropdownChannelButton";
import CreateChannelButton from "../Channel/CreateChannelButton";
import CreateChannelCard from "../Channel/CreateChannelCard";
import { Dropdown, Menu } from "antd";
import Identicon from "react-identicons";
import "../../Styles/header.css";
import "../../Styles/antd.css";
import "../../Styles/tooltip.css";
import PreferenceButton from "./PreferenceButton";
import SignUpButton from "./SignUpButton";
import agorasLogo from "../../assets/general/agoras_logo_v2.png";

const makeProfilePublicInfo =
  "Making your profile public means that it will be shown in the 'speaker marketplace' feature of the platform, and administrators of relevant agoras may reach out to you about speaking opportunities if you have contact details in your bio. This action can be undone at any time.";

interface Props {
  showLogin: boolean;
}

interface State {
  isLoggedIn: boolean;
  user: { id: number; username: string; bio: string; public: boolean } | null;
  channels: Channel[];
  showCreateChannelCard: boolean;
  showDropdown: boolean;
  editingBio: boolean;
}

export default class UserManager extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoggedIn: UserService.isLoggedIn(),
      user: UserService.getCurrentUser(),
      channels: [],
      showCreateChannelCard: false,
      showDropdown: false,
      editingBio: false,
    };
  }

  componentWillMount() {
    this.fetchChannels();
  }

  fetchChannels = () => {
    this.state.user &&
      ChannelService.getChannelsForUser(
        this.state.user.id,
        ["owner"],
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

  onBioChange = (bio: string) => {
    if (this.state.user) {
      this.setState({ ...this.state, user: { ...this.state.user, bio } });
    }
  };

  onBioSave = () => {
    if (this.state.user) {
      UserService.updateBio(
        this.state.user.id,
        this.state.user.bio,
        (updatedUser: any) => {
          if (this.state.user) {
            let user = { ...this.state.user, bio: updatedUser.bio };
            localStorage.setItem("user", JSON.stringify(user));
            this.setState({
              user,
            });
          }
        }
      );
    }
  };

  onMakePublicClicked = () => {
    if (this.state.user) {
      UserService.updatePublic(
        this.state.user.id,
        !this.state.user.public,
        (updatedUser: any) => {
          if (this.state.user) {
            let user = { ...this.state.user, public: updatedUser.public === 1 };
            localStorage.setItem("user", JSON.stringify(user));
            this.setState({ user }, () => {
              console.log(this.state.user);
            });
          }
        }
      );
    }
  };

  menu = () => {
    return this.state.showCreateChannelCard ? (
      <Menu
        style={{
          borderRadius: 10,
          marginTop: 5,
          overflow: "hidden",
          paddingBottom: 0,
          height: 175,
          width: 350,
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
          paddingBottom: 0,
          minHeight: 326,
          width: 450,
        }}
      >
        <Box
          margin={{ horizontal: "small" }}
          gap="xsmall"
          focusIndicator={false}
          style={{ pointerEvents: "none" }}
          direction="row"
        >
          <Box
            height="25px"
            width="25px"
            // round="12.5px"
            justify="start"
            align="start"
            overflow="hidden"
            direction="row"
          >
            <UserSettings size="medium"/>
          </Box>
          <Text weight="bold" size="20px">
            {this.state.user?.username}
          </Text>
        </Box>


        {/* TODO: INTEGRATE THIS 'add bio' functionality with profile homepage + 'speakers' page
        <Box margin={{ horizontal: "small" }} focusIndicator={false}>
          <Text
            size="12px"
            color="blue"
            style={{
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => {
              this.state.editingBio && this.onBioSave();
              this.setState({ editingBio: !this.state.editingBio });
            }}
          >
            {this.state.editingBio
              ? "save"
              : this.state.user?.bio
              ? "edit bio"
              : "add bio"}
          </Text>
          {this.state.editingBio && (
            <TextArea
              focusIndicator={false}
              value={this.state.user?.bio}
              onChange={(event) => this.onBioChange(event.target.value)}
              style={{ padding: 3 }}
            />
          )}
        </Box> */}


        <Menu.Divider />
        <Box gap="xsmall" pad={{ vertical: "medium" }} focusIndicator={false}>
          <Link
            to={{ pathname: "/schedule", state: { user: this.state.user } }}
            style={{ textDecoration: "none" }}
          >
            <Box
              onClick={this.toggleDropdown}
              background="#025377"
              round="xsmall"
              margin={{ horizontal: "small" }}
              pad="xsmall"
              height="40px"
              justify="center"
              align="center"
              focusIndicator={false}
              // hoverIndicator="#2433b5"
              hoverIndicator="#6DA3C7"
            >
              <Text size="14px"> My schedule </Text>
            </Box>
          </Link>
        </Box>
        <Menu.Divider />
        <Box
          margin={{
            bottom: "medium",
            top: "small",
            left: "small",
            right: "small",
          }}
          focusIndicator={false}
          // style={{ pointerEvents: "none" }}
          gap="xsmall"
        >
          <Text size="16px" color="grey">
            Manage your <img src={agorasLogo} style={{ height: "14px"}}/>
          </Text>
          <Box
            height={{max: "200px"}}
            overflow="auto"
          >
            {this.state.channels.map((channel: Channel) => (
            <DropdownChannelButton
              channel={channel}
              onClick={this.toggleDropdown}
            />
            ))}
          </Box>
          <CreateChannelButton onClick={this.toggleCreateChannelCard} />
        </Box>
        <Menu.Divider />
        {/*<Text weight="bold" color="black" margin="small">
          Account
          </Text>*/}
        {/* <Menu.Item
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
        </Menu.Item> */}

        {/* TODO: REINTEGRATE THIS 'PUBLIC' OR 'PRIVATE' PUBLIC SECTION WHEN 'speakers' page is done
        <Box
          margin={{ horizontal: "small", vertical: "xsmall" }}
          focusIndicator={false}
        >
          <Text size="12px" className="tooltip" style={{ width: "80px" }}>
            What's this?
            <span className="tooltiptext">{makeProfilePublicInfo}</span>
          </Text>
          <Box
            background="#E3E1E1"
            round="xsmall"
            pad="xsmall"
            height="40px"
            justify="center"
            align="center"
            focusIndicator={false}
            onClick={this.onMakePublicClicked}
          >
            <Text size="18px">
              {this.state.user?.public
                ? "Make profile private"
                : "Make profile public"}
            </Text>
          </Box>
        </Box> */}

        <Menu.Item>
          <Link
            to={{ pathname: "/saved", state: { user: this.state.user } }}
            style={{ textDecoration: "none" }}
            onClick={this.toggleDropdown}
          >
            <Text size="14px"> Bookmarks </Text>
          </Link>
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
          <Text size="14px"> Log out </Text>
        </Menu.Item>
      </Menu>
    );
  };

  loggedInStuff = (username: string) => {
    return (
      <Dropdown
        overlay={this.menu()}
        trigger={["click"]}
        overlayStyle={{ width: 450 }}
        visible={this.state.showDropdown}
        placement="bottomCenter"
      >
        <Button
          style={{
            height: 40,
            width: 40,
            // borderRadius: 20,
            overflow: "hidden",
          }}
          focusIndicator={false}
          onClick={this.toggleDropdown}
        >
          <UserSettings size="medium"/>
        </Button>
      </Dropdown>
    );
  };

  loggedOutStuff = (
    <Box direction="row" align="center" justify="center" gap="xsmall">
      <LoginModal
        open={this.props.showLogin}
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
      <SignUpButton
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
