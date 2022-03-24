import React, { Component } from "react";
import { Box, Button, Text, TextArea, Layer, Collapsible } from "grommet";
import { UserSettings } from "grommet-icons";
import { Link, Route, Redirect, useHistory } from "react-router-dom";
import LoginModal from "./LoginModal";
import { UserService } from "../../Services/UserService";
import { ProfileService } from "../../Services/ProfileService";
import { Channel, ChannelService } from "../../Services/ChannelService";
import DropdownChannelButton from "../Channel/DropdownChannelButton";
import CreateChannelButton from "../Channel/CreateChannelButton";
import CreateChannelOverlay from "../Channel/CreateChannelButton/CreateChannelOverlay";
import Identicon from "react-identicons";
import "../../Styles/header.css";
import "../../Styles/tooltip.css";
import PreferenceButton from "./PreferenceButton";
import SignUpButton from "./SignUpButton";
import agoraLogo from "../../assets/general/agora_logo_v2.1.svg";
import MediaQuery from "react-responsive";

const makeProfilePublicInfo =
  "Making your profile public means that it will be shown in the 'speaker marketplace' feature of the platform," +
  "and administrators of relevant agoras may reach out to you about speaking opportunities if you have contact details in your bio." +
  "This action can be undone at any time.";

interface Props {
  showLogin: boolean;
  isMobile: boolean;
}

interface State {
  isLoggedIn: boolean;
  user: { id: number; username: string; bio: string; public: boolean } | null;
  adminChannels: Channel[];
  memberChannels: Channel[];
  followingChannels: Channel[];
  showCreateChannelOverlay: boolean;
  showDropdown: boolean;
  showMobileDropdown: boolean;
  editingBio: boolean;
}

export default class UserManager extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoggedIn: UserService.isLoggedIn(),
      user: UserService.getCurrentUser(),
      adminChannels: [],
      memberChannels: [],
      followingChannels: [],
      showCreateChannelOverlay: false,
      showDropdown: false,
      showMobileDropdown: false,
      editingBio: false,
    };
  }

  componentWillMount() {
    this.fetchAdminChannels();
    this.fetchMemberChannels();
    this.fetchFollowingChannels();
  }

  fetchAdminChannels = () => {
    this.state.user &&
      ChannelService.getChannelsForUser(
        this.state.user.id,
        ["owner"],
        (adminChannels: Channel[]) => {
          this.setState({ adminChannels });
        }
      );
  };

  fetchFollowingChannels = () => {
    this.state.user &&
      ChannelService.getChannelsForUser(
        this.state.user.id,
        ["follower"],
        (followingChannels: Channel[]) => {
          this.setState({ followingChannels });
        }
      );
  };

  fetchMemberChannels = () => {
    this.state.user &&
      ChannelService.getChannelsForUser(
        this.state.user.id,
        ["member"],
        (memberChannels: Channel[]) => {
          this.setState({ memberChannels });
        }
      );
  };

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  };

  toggleMobileDropdown = () => {
    this.setState({ showMobileDropdown: !this.state.showMobileDropdown });
  };

  toggleCreateChannelOverlay = () => {
    this.setState({
      showCreateChannelOverlay: !this.state.showCreateChannelOverlay,
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

  onRedirectProfile = (history: any) => {
    if (this.state.user) {
      let id: number = this.state.user.id;
      // createProfile checks if there is a profile associated to the user
      // if yes, redirect. If no, create and redirect
      ProfileService.createProfile(
        this.state.user.id,
        "[your full name]",
        () => {
          return history.push("/profile/" + id);
        }
      );
    }
  };

  menu = () => {
    return this.state.showCreateChannelOverlay ? (
      <Box
        height="100%"
        width="350px"
        pad="small"
        style={{
          border: "1px solid grey",
          overflow: "hidden",
          paddingBottom: 0,
        }}
      >
        <CreateChannelOverlay
          onBackClicked={this.toggleCreateChannelOverlay}
          onComplete={() => {
            this.fetchAdminChannels();
            this.fetchMemberChannels();
            this.toggleCreateChannelOverlay();
            this.toggleDropdown();
          }}
          visible={true}
          user={this.state.user}
          windowWidth={window.innerWidth}
        />
      </Box>
    ) : (
      <Box
        width="450px"
        onClick={() => {}}
        round="10px"
        style={{
          border: "1px solid grey",
          minHeight: 326,
        }}
      >
        <Box
          margin={{ horizontal: "small", top: "15px", bottom: "20px" }}
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
            <UserSettings size="medium" />
          </Box>
          <Text weight="bold" size="20px" color="grey">
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
        {/*
        <Box gap="xsmall" pad={{ vertical: "medium" }} focusIndicator={false}>
          <Link
            to={{ pathname: "/schedule", state: { user: this.state.user } }}
            style={{ textDecoration: "none" }}
          >

            <Box
              onClick={this.toggleDropdown}
              background="#BAD6DB"
              round="xsmall"
              margin={{ horizontal: "small" }}
              pad="xsmall"
              height="50px"
              justify="center"
              align="center"
              focusIndicator={false}
              // hoverIndicator="#2433b5"
              hoverIndicator="#6DA3C7"
            >
              <Text size="14px" weight="bold"> My schedule </Text>
            </Box> 
          </Link>
        </Box>
        */}
        <Box
          margin={{
            bottom: "medium",
            top: "small",
            left: "small",
            right: "small",
          }}
          focusIndicator={false}
          justify="center"
          gap="xsmall"
        >
          <Text size="16px" color="grey">
            Manage your{" "}
            <img
              src={agoraLogo}
              style={{ height: "14px", marginBottom: "-3px" }}
            />
            s
          </Text>
          <Box height={{ max: "120px" }} overflow="auto">
            {this.state.adminChannels.map((channel: Channel, index: number) => (
              <DropdownChannelButton
                channel={channel}
                onClick={this.toggleDropdown}
                key={index}
              />
            ))}
          </Box>
          <CreateChannelButton
            // height="50px"
            onClick={this.toggleCreateChannelOverlay}
          />
        </Box>
        <hr
          style={{
            width: "95%",
            color: "#EEEEEE",
            borderColor: "#EEEEEE",
            backgroundColor: "#EEEEEE",
          }}
        />
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
            Following
          </Text>
          <Box height={{ max: "120px" }} overflow="auto" align="start">
            {this.state.followingChannels.length === 0 && (
              <Text size="12px" color="#BBBBBB" style={{ fontStyle: "italic" }}>
                {" "}
                The agoras you follow will be displayed here{" "}
              </Text>
            )}
            {this.state.followingChannels.map(
              (channel: Channel, index: number) => (
                <DropdownChannelButton
                  channel={channel}
                  onClick={this.toggleDropdown}
                  key={index}
                />
              )
            )}
          </Box>
        </Box>
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

        <hr
          style={{
            width: "95%",
            color: "#EEEEEE",
            borderColor: "#EEEEEE",
            backgroundColor: "#EEEEEE",
          }}
        />

        {/* <Box
          margin={{
            top: "small",
            left: "small",
            right: "small",
          }}
          focusIndicator={false}
          gap="xsmall"
        >
          <Link
            to={{ pathname: "/saved", state: { user: this.state.user } }}
            style={{ textDecoration: "none" }}
            onClick={this.toggleDropdown}
          >
            <Text size="14px"> Bookmarks </Text>
          </Link>
        </Box> */}
        {this.state.user && (
          <Box
            margin={{
              top: "12px",
              bottom: "12px",
              left: "small",
              right: "small",
            }}
            gap="small"
            align="center"
            justify="center"
            direction="row"
          >
            <Text
              textAlign="end"
              color="red"
              weight="bold"
              size="14px"
              margin={{ right: "3px" }}
            >
              {" "}
              New!{" "}
            </Text>
            <Route
              render={({ history }) => (
                <Box
                  background="color5"
                  width="150px"
                  pad="9px"
                  round="xsmall"
                  onClick={() => this.onRedirectProfile(history)}
                  align="center"
                  justify="center"
                  hoverIndicator="color1"
                >
                  <Text size="12px" weight="bold">
                    {" "}
                    View your profile{" "}
                  </Text>
                </Box>
              )}
            />
          </Box>
        )}
        <hr
          style={{
            width: "95%",
            color: "#EEEEEE",
            borderColor: "#EEEEEE",
            backgroundColor: "#EEEEEE",
          }}
        />
        <Box
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
          margin={{
            bottom: "small",
            top: "small",
            left: "small",
            right: "small",
          }}
          hoverIndicator={true}
          gap="xsmall"
        >
          <Text size="14px"> Log out </Text>
        </Box>
      </Box>
    );
  };

  dynamicGreetings = () => {
    // random greetings , now works with hours instead of days
    var dynamicGreetingsList = [
      "Hello, ",
      "Bonjour, ",
      "Ciao, ",
      "你好, ",
      "こんにちは, ",
      "Hallo, ",
      "سلام, ",
      "שלום, ",
      "안녕하세요, ",
      "Olá, ",
      "Привет, ",
      "Hola, ",
    ];
    var now = new Date();
    var hour = now.getHours();
    return dynamicGreetingsList[hour % dynamicGreetingsList.length];
  };

  loggedInStuff = (username: string) => {
    const isMobile = this.props.isMobile;
    return (
      <>
        <Box
          margin={{ right: "1vw" }}
          focusIndicator={false}
          onClick={isMobile ? this.toggleMobileDropdown : this.toggleDropdown}
          overflow="hidden"
        >
          <Box
            direction="row"
            gap="small"
            justify="center"
            align="center"
            margin={{ top: "3px" }}
          >
            <Text
              size="14px"
              margin={{ right: "15px" }}
              color={isMobile ? "white" : "grey"}
            >
              <i>{this.dynamicGreetings()}</i>
              {/*{(window.innerWidth > 800) ? <i>{this.dynamicGreetings()}</i> : ""}*/}
              <b>{this.state.user?.username}!</b>
            </Text>
            <UserSettings size="20" color={isMobile ? "white" : "grey"} />
          </Box>
        </Box>
      </>
    );
  };

  loggedOutStuff = (
    //<MediaQuery minDeviceWidth={800}>
    <Box
      direction="row"
      align="center"
      justify={this.props.isMobile ? "center" : "end"}
      gap="xsmall"
      margin={{ right: "1vw" }}
    >
      <LoginModal
        open={this.props.showLogin}
        callback={() => {
          this.setState(
            {
              isLoggedIn: UserService.isLoggedIn(),
              user: UserService.getCurrentUser(),
            },
            () => {
              this.fetchAdminChannels();
              this.fetchMemberChannels();
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
              this.fetchAdminChannels();
              this.fetchMemberChannels();
            }
          );
        }}
        windowWidth={window.innerWidth}
      />
    </Box>
    //</MediaQuery>
  );

  render() {
    const username = this.state.user ? this.state.user.username : "?";
    const isMobile = this.props.isMobile;
    return (
      <Box
        direction={isMobile ? "column" : "row"}
        justify={isMobile ? "center" : "end"}
      >
        {this.state.isLoggedIn
          ? this.loggedInStuff(username)
          : this.loggedOutStuff}
        {isMobile
          ? this.renderMobileUserMenu(username)
          : this.renderFullUserMenu(username)}
      </Box>
    );
  }

  renderFullUserMenu(username: string) {
    return (
      this.state.showDropdown && (
        <Layer
          modal={false}
          position="top-right"
          onEsc={this.toggleDropdown}
          onClickOutside={this.toggleDropdown}
          style={{
            position: "absolute",
            top: "6vw",
            right: "2vw",
          }}
          responsive
        >
          {this.menu()}
        </Layer>
      )
    );
  }

  renderMobileUserMenu(username: string) {
    return (
      <Collapsible open={this.state.showMobileDropdown}>
        <Box
          background="light-2"
          round="medium"
          pad="medium"
          align="center"
          justify="center"
        >
          {this.menu()}
        </Box>
      </Collapsible>
    );
  }
}
