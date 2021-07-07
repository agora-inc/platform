import React, { Component } from "react";
import { Box, Text, Sidebar } from "grommet";
import TrendingChannelsList from "./TrendingChannelsList";
import SubscribedChannelsList from "../Account/SubscribedChannelsList";
import PopularTagsBox from "./PopularTagsBox";
import { User } from "../../Services/UserService";

interface Props {
  user: User | null;
}

export default class CustomSideBar extends Component<Props> {
  render() {
    return (
      <Sidebar
        background="#EFEFF1"
        width="20%"
        pad="none"
        style={{ minHeight: "100%" }}
        margin="none"
      >
        <Box
          margin={{ top: "9vh" }}
          pad={{ top: "3px" }}
          style={{ position: "sticky"}}
          gap="small"
        >
          <Box>
            <TrendingChannelsList />
          </Box>
          <Box height="50%">
            <SubscribedChannelsList user={this.props.user}/>
          </Box>
          {/* <PopularTagsBox /> */}
        </Box>
      </Sidebar>
    );
  }
}
