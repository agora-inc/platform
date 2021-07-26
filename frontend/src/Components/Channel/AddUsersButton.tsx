import React, { Component } from "react";
import { Box, Text, TextInput } from "grommet";
import { Search } from "grommet-icons";
// Find another library to make this component work
// import { Dropdown, Menu } from
import { User } from "../../Services/UserService";
import { ChannelService } from "../../Services/ChannelService";
import { SearchService } from "../../Services/SearchService";
import Identicon from "react-identicons";

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

export default class AddUsersButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchResults: [],
      searchString: "",
      expanded: false,
    };
  }

  toggleOverlay = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  search = (searchString: string) => {
    if (searchString === "") {
      this.setState({ searchString: searchString, searchResults: [] });
      return;
    }
    this.setState({ searchString }, () => {
      SearchService.search(
        ["user"],
        this.state.searchString,
        (results: { user: User[] }) => {
          this.setState({ searchResults: results.user });
        }
      );
    });
  };

  onUserSelected = (user: User) => {
    ChannelService.addUserToChannel(
      user.id,
      this.props.channelId,
      this.props.role,
      () => {
        this.props.onUserAddedCallback();
        this.setState({
          expanded: false,
          searchResults: [],
          searchString: "",
        });
      }
    );
  };

  

  menu = () => {
    {/*
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
    */}
  };


  render() {
    return (
          {/*
      <Dropdown
        overlay={this.menu()}
        trigger={["click"]}
        // overlayStyle={{ width: 250 }}
        visible={this.state.expanded}
      >
        <Box
          onClick={this.toggleOverlay}
          focusIndicator={false}
          width="70px"
          align="center"
          background="white"
          pad={{ horizontal: "small", vertical: "3px" }}
          round="xsmall"
          style={{ border: "2px solid black" }}
        >
          <Text color="black" style={{ fontWeight: 500 }}>
            Add
          </Text>
        </Box>
      </Dropdown>
      */}
    );
  } 
}
