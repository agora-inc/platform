import React, { useState, useEffect } from "react";
import { Box, Heading, Text } from "grommet";
import { User } from "../../Services/UserService";
import { Calendar } from "grommet-icons";

interface Props {
  user: User;
}

export const FooterOverlayProfileCard = (props: Props) => {

  return (
    <Box direction="column" gap="small" width="100%" background="#d5d5d5">
      <Box direction="row" width="100%" align="center" gap="10px" margin={{left: "20px", right: "20px"}}>
        <Calendar size="16px" />
      </Box>
    </Box>
  );
};