import React, { Component } from "react";
import { Box, Text, Sidebar } from "grommet";
import TrendingChannelsList from "./TrendingChannelsList";
import SubscribedChannelsList from "../SubscribedChannelsList";
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
          margin={{ top: "60px" }}
          pad={{ top: "3px" }}
          style={{ position: "sticky", top: 63 }}
          gap="small"
        >
          <TrendingChannelsList />
          <SubscribedChannelsList user={this.props.user} />
          <PopularTagsBox />
        </Box>
      </Sidebar>
    );
  }
}
