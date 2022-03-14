import React, { Component, useEffect, useState } from "react";
import { Box, Text, TextInput } from "grommet";
import { Search } from "grommet-icons";
// Find another library to make this component work
// import { Dropdown, Menu } from
import { User } from "../../Services/UserService";
import { ChannelService } from "../../Services/ChannelService";
import { SearchService } from "../../Services/SearchService";
import Identicon from "react-identicons";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  role: string;
  existingUsers: User[];
  channelId: number;
  onUserAddedCallback: any;
}

interface State {
  searchResults: User[];
  searchString: string;
  expanded: boolean;
}

export const AddUsersButton = (props: Props) => {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchString, setSearchString] = useState("");
  const [expanded, setExpanded] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (searchString === "") {
      setSearchResults([]);
    } else {
      SearchService.search(["user"], searchString, setSearchResults);
    }
  }, [searchString]);

  const toggleOverlay = () => {
    setExpanded(!expanded);
  };

  const onUserSelected = async (user: User) => {
    const token = await getAccessTokenSilently();
    ChannelService.addUserToChannel(
      user.id,
      props.channelId,
      props.role,
      () => {
        props.onUserAddedCallback();
        setExpanded(false);
        setSearchResults([]);
        setSearchString("");
      },
      token
    );
  };

  const menu = () => {
    {
      /*
    return (
      <Menu
        style={{
          borderRadius: 7,
          overflow: "hidden",
          padding: 0,
          height: 270,
          width: 210,
        }}
      >
        <Box
          width="100%"
          height="45px"
          background="#EAF1F1"
          focusIndicator={false}
          justify="center"
          align="center"
          pad="small"
          //   margin={{ bottom: "xsmall" }}
        >
          <TextInput
            value={this.state.searchString}
            onChange={(e) => this.search(e.target.value)}
            focusIndicator={false}
            icon={<Search size="15px" />}
            reverse
            placeholder="search ..."
            style={{ height: "30px" }}
          />
        </Box>

        The below section will need rework.
        - Remove ability to browse

        {this.state.searchResults.map((user: User) => {
          if (
            !this.props.existingUsers.some((u) => u.username === user.username)
          )
            return (
              <Box
                onClick={() => this.onUserSelected(user)}
                focusIndicator={false}
                hoverIndicator={true}
                pad={{ horizontal: "small", vertical: "5px" }}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Box height="25" width="25" round="10px" overflow="hidden">
                  <Identicon string={user.username} size={25} />
                </Box>
                <Text
                  style={{ maxWidth: "180px" }}
                  margin={{ left: "xsmall" }}
                  size="18px"
                >
                  {user.username}
                </Text>
              </Box>
            );
        })}
      </Menu>
    );
    */
    }
  };

  return (
    <></>
    // <Dropdown
    //   overlay={this.menu()}
    //   trigger={["click"]}
    //   // overlayStyle={{ width: 250 }}
    //   visible={this.state.expanded}
    // >
    //   <Box
    //     onClick={this.toggleOverlay}
    //     focusIndicator={false}
    //     width="70px"
    //     align="center"
    //     background="white"
    //     pad={{ horizontal: "small", vertical: "3px" }}
    //     round="xsmall"
    //     style={{ border: "2px solid black" }}
    //   >
    //     <Text color="black" style={{ fontWeight: 500 }}>
    //       Add
    //     </Text>
    //   </Box>
    // </Dropdown>
  );
};
