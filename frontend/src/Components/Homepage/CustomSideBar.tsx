import React, { FunctionComponent } from "react";
import { Box, Sidebar } from "grommet";

import TrendingChannelsList from "./TrendingChannelsList";
import { SubscribedChannelsList } from "../Account/SubscribedChannelsList";

export const CustomSideBar: FunctionComponent = () => {
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
        style={{ position: "sticky" }}
        gap="small"
      >
        <Box>
          <TrendingChannelsList />
        </Box>
        <Box height="50%">
          <SubscribedChannelsList />
        </Box>
        {/* <PopularTagsBox /> */}
      </Box>
    </Sidebar>
  );
};
