import React from "react";
import { Route } from "react-router-dom";
import { Box, Text } from "grommet";
import { UserSettings } from "grommet-icons";
import { useAuth0 } from "@auth0/auth0-react";

import { useStore } from "../../store";
import { Channel } from "../../Services/ChannelService";
import DropdownChannelButton from "../Channel/DropdownChannelButton";
import CreateChannelButton from "../Channel/CreateChannelButton";
import CreateChannelOverlay from "../Channel/CreateChannelButton/CreateChannelOverlay";
import agoraLogo from "../../assets/general/agora_logo_v2.1.svg";

interface Props {
  showOverlay: boolean;
  toggleShowOverlay: () => void;
  onChannelCreated: () => void;
  onRedirectProfile: (history: any) => void;
  onLogout: () => void;
}

export const Menu = ({
  showOverlay,
  toggleShowOverlay,
  onChannelCreated,
  onRedirectProfile,
  onLogout,
}: Props) => {
  const user = useStore((state) => state.loggedInUser);
  const toggleDropdown = useStore((state) => state.toggleUserDropdown);
  const adminChannels = useStore((state) => state.adminChannels);
  const followingChannels = useStore((state) => state.followingChannels);

  const { logout } = useAuth0();

  return showOverlay ? (
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
        onBackClicked={toggleShowOverlay}
        onComplete={onChannelCreated}
        visible={true}
        user={user}
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
          {user?.username}
        </Text>
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
          Manage your{" "}
          <img
            src={agoraLogo}
            style={{ height: "14px", marginBottom: "-3px" }}
          />
          s
        </Text>
        <Box height={{ max: "120px" }} overflow="auto">
          {adminChannels.map((channel: Channel) => (
            <DropdownChannelButton channel={channel} onClick={toggleDropdown} />
          ))}
        </Box>
        <CreateChannelButton
          // height="50px"
          onClick={toggleShowOverlay}
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
          {followingChannels.length === 0 && (
            <Text size="12px" color="#BBBBBB" style={{ fontStyle: "italic" }}>
              {" "}
              The agoras you follow will be displayed here{" "}
            </Text>
          )}
          {followingChannels.map((channel: Channel) => (
            <DropdownChannelButton channel={channel} onClick={toggleDropdown} />
          ))}
        </Box>
      </Box>
      <hr
        style={{
          width: "95%",
          color: "#EEEEEE",
          borderColor: "#EEEEEE",
          backgroundColor: "#EEEEEE",
        }}
      />
      {user && (
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
                onClick={() => onRedirectProfile(history)}
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
          logout();
          onLogout();
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
