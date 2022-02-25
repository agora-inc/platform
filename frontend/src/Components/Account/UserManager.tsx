import React, { useState, useEffect } from "react";
import { Box, Text, Layer } from "grommet";
import { UserSettings } from "grommet-icons";

import { useStore } from "../../store";
import { UserService } from "../../Services/UserService";
import { ProfileService } from "../../Services/ProfileService";
import { Channel, ChannelService } from "../../Services/ChannelService";
import { LoginButton } from "./LoginButton";
import { Menu } from "./Menu";
import MediaQuery from "react-responsive";
import "../../Styles/header.css";
import "../../Styles/tooltip.css";

const makeProfilePublicInfo =
  "Making your profile public means that it will be shown in the 'speaker marketplace' feature of the platform," +
  "and administrators of relevant agoras may reach out to you about speaking opportunities if you have contact details in your bio." +
  "This action can be undone at any time.";

interface Props {
  showLogin: boolean;
}

export const UserManager = ({ showLogin: boolean }: Props) => {
  const user = useStore((state) => state.loggedInUser);
  const showDropdown = useStore((state) => state.showUserDropdown);
  const toggleDropdown = useStore((state) => state.toggleUserDropdown);
  const setUser = useStore((state) => state.setUser);
  const setAdminChannels = useStore((state) => state.setAdminChannels);
  const setMemberChannels = useStore((state) => state.setMemberChannels);
  const setFollowingChannels = useStore((state) => state.setFollowingChannels);

  const [showCreateChannelOverlay, setShowCreateChannelOverlay] =
    useState(false);
  const [editingBio, setEditingBio] = useState(false);

  useEffect(() => {
    fetchAdminChannels();
    fetchFollowingChannels();
    fetchMemberChannels();
  }, []);

  const fetchAdminChannels = () => {
    user &&
      ChannelService.getChannelsForUser(
        user.id,
        ["owner"],
        (adminChannels: Channel[]) => {
          setAdminChannels(adminChannels);
        }
      );
  };

  const fetchFollowingChannels = () => {
    user &&
      ChannelService.getChannelsForUser(
        user.id,
        ["follower"],
        (followingChannels: Channel[]) => {
          setFollowingChannels(followingChannels);
        }
      );
  };

  const fetchMemberChannels = () => {
    user &&
      ChannelService.getChannelsForUser(
        user.id,
        ["member"],
        (memberChannels: Channel[]) => {
          setMemberChannels(memberChannels);
        }
      );
  };

  const toggleCreateChannelOverlay = () => {
    setShowCreateChannelOverlay(!showCreateChannelOverlay);
  };

  const onBioChange = (bio: string) => {
    let u = user;
    if (u) {
      u.bio = bio;
      setUser(u);
    }
  };

  const onBioSave = () => {
    if (user && user.bio) {
      UserService.updateBio(user.id, user.bio, (updatedUser: any) => {
        setUser(updatedUser);
      });
    }
  };

  const onMakePublicClicked = () => {
    if (user) {
      UserService.updatePublic(user.id, !user.public, (updatedUser: any) => {
        setUser(updatedUser);
      });
    }
  };

  const onRedirectProfile = (history: any) => {
    if (user) {
      let id: number = user.id;
      // createProfile checks if there is a profile associated to the user
      // if yes, redirect. If no, create and redirect
      ProfileService.createProfile(user.id, "[your full name]", () => {
        return history.push("/profile/" + id);
      });
    }
  };

  const dynamicGreetings = () => {
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

  const loggedInStuff = (username: string) => {
    return (
      <>
        <Box
          margin={{ right: "1vw" }}
          focusIndicator={false}
          onClick={toggleDropdown}
          overflow="hidden"
        >
          <Box
            direction="row"
            gap="small"
            justify="center"
            align="center"
            margin={{ top: "3px" }}
          >
            <Text size="14px" margin={{ right: "15px" }} color="grey">
              {window.innerWidth > 800 ? <i>{dynamicGreetings()}</i> : ""}
              <b>{user?.username}!</b>
            </Text>
            <UserSettings size="medium" />
          </Box>
        </Box>
      </>
    );
  };

  const loggedOutStuff = (
    <MediaQuery minDeviceWidth={800}>
      <Box
        direction="row"
        align="center"
        justify="end"
        gap="xsmall"
        margin={{ right: "1vw" }}
      >
        <LoginButton
          callback={() => {
            fetchAdminChannels();
            fetchMemberChannels();
          }}
        />
      </Box>
    </MediaQuery>
  );

  const username = user ? user.username : "?";
  return (
    <Box direction="row" justify="end">
      {user ? loggedInStuff(username) : loggedOutStuff}
      {showDropdown && (
        <Layer
          modal={false}
          position="top-right"
          onEsc={toggleDropdown}
          onClickOutside={toggleDropdown}
          style={{
            position: "absolute",
            top: "6vw",
            right: "2vw",
          }}
          responsive
        >
          <Menu
            showOverlay={showCreateChannelOverlay}
            toggleShowOverlay={toggleCreateChannelOverlay}
            onChannelCreated={() => {
              fetchAdminChannels();
              fetchMemberChannels();
              toggleCreateChannelOverlay();
              toggleDropdown();
            }}
            onRedirectProfile={onRedirectProfile}
            onLogout={() => {
              toggleDropdown();
            }}
          />
        </Layer>
      )}
    </Box>
  );
};
