import React, { Component } from "react";
import { Box, Button, Text, TextArea, Layer } from "grommet";
import {UserSettings} from "grommet-icons";
import { Link, Redirect } from "react-router-dom";
import LoginModal from "./LoginModal";
import { UserService } from "../../Services/UserService";
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


const makeProfilePublicInfo =
  "Making your profile public means that it will be shown in the 'speaker marketplace' feature of the platform, and administrators of relevant agoras may reach out to you about speaking opportunities if you have contact details in your bio. This action can be undone at any time.";

interface Props {
  showLogin: boolean;
}

interface State {
  isLoggedIn: boolean;
  user: { id: number; username: string; bio: string; public: boolean } | null;
  adminChannels: Channel[];
  memberChannels: Channel[];
  followingChannels: Channel[];
  showCreateChannelOverlay: boolean;
  showDropdown: boolean;
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

  menu = () => {
    return this.state.showCreateChannelOverlay ? (
      <Box
        height="100%"
        width="350px"
        pad="small"
        style={{
          border: "2px solid grey",
          marginTop: 20,
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
          margin={{ horizontal: "small", top: "15px" }}
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

        <Box gap="xsmall" pad={{ vertical: "medium" }} focusIndicator={false}>
          <Link
            to={{ pathname: "/schedule", state: { user: this.state.user } }}
            style={{ textDecoration: "none" }}
          >
            <Box
              onClick={this.toggleDropdown}
              background="#6DA3C7"
              round="xsmall"
              margin={{ horizontal: "small" }}
              pad="xsmall"
              height="40px"
              justify="center"
              align="center"
              focusIndicator={false}
              // hoverIndicator="#2433b5"
              hoverIndicator="#0C385B"
            >
              <Text size="14px"> My schedule </Text>
            </Box>
          </Link>
        </Box>
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
            Manage your <img src={agoraLogo} style={{ height: "14px", marginBottom: "-3px"}}/>s
          </Text>
          <Box
            height={{max: "120px"}}
            overflow="auto"
          >
            {this.state.adminChannels.map((channel: Channel) => (
            <DropdownChannelButton
              channel={channel}
              onClick={this.toggleDropdown}
            />
            ))}
          </Box>
          <CreateChannelButton 
            onClick={this.toggleCreateChannelOverlay}
          />

        </Box>
        <hr  
          style={{
            width: "95%", 
            color: "#EEEEEE", 
            borderColor: "#EEEEEE",
            backgroundColor: "#EEEEEE"
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
          <Box
            height={{max: "120px"}}
            overflow="auto"
          >
            {this.state.followingChannels.map((channel: Channel) => (
            <DropdownChannelButton
              channel={channel}
              onClick={this.toggleDropdown}
            />
            ))}
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
            backgroundColor: "#EEEEEE"
          }} 
        />

        <Box
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
        </Box>
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

  dynamicGreetings= () => {
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
        "Hola, "
      ];
      var now = new Date;
      var hour = now.getHours()
      return dynamicGreetingsList[hour % dynamicGreetingsList.length]
  }


  loggedInStuff = (username: string) => {
    return (
      <>
      <Box margin={{right:"43px"}}>
        <Link
            to={{ pathname: "/info/welcome" }}
            style={{ textDecoration: "none" }}
          >
          <Button
            label={"About us"}
            style={{
              width: 90,
              height: 35,
              fontSize: 15,
              fontWeight: "bold",
              padding: 0,
              color: "0C385B",
              // margin: 6,
              backgroundColor: "#D3F930",
              border: "none",
              borderRadius: 7,
            }}
            hoverIndicator="#D3F930"
          />
        </Link>
      </Box>

      <Button
        style={{
          height: "100%",
          width: "100%",
          // borderRadius: 20,
          overflow: "hidden",
        }}
        
        focusIndicator={false}
        onClick={this.toggleDropdown}
      >
        <Box direction="row" gap="small">
          <Text size="14px" margin={{right: "15px", top: "3.43px"}} color="grey">
            {(window.innerWidth > 800) ? <i>{this.dynamicGreetings()}</i> : ""}
            <b>{this.state.user?.username}!</b>
          </Text>
            <UserSettings size="medium"/>
        </Box>
      </Button>
      </>
    );
  };

  loggedOutStuff = (
    <Box direction="row" align="center" justify="center" gap="xsmall">
        <Link
          to={{ pathname: "/info/welcome" }}
          style={{ textDecoration: "none" }}
        >
          <Button
            label={"About us"}
            style={{
              width: 90,
              height: 35,
              fontSize: 15,
              fontWeight: "bold",
              padding: 0,
              color: "0C385B",
              // margin: 6,
              backgroundColor: "#D3F930",
              border: "none",
              borderRadius: 7,
            }}
            hoverIndicator="#D3F930"
          />
        </Link>
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
        {this.state.showDropdown && (
          <Layer 
            modal={false}
            position="top-right"
            onEsc={this.toggleDropdown}
            onClickOutside={this.toggleDropdown}        
            style={{
              position: "absolute",
              top: 95,
              right: 30,
            }}
            responsive
          >
            {this.menu()}
          </Layer>
        )}
      </Box>

    );
  }
}
