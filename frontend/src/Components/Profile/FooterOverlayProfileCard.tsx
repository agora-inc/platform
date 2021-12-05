import React, { useState, useEffect } from "react";
import { Box, Heading, Text } from "grommet";
import { User } from "../../Services/UserService";


interface Props {
  user: User;
}

export const FooterOverlayProfileCard = (props: Props) => {

  return (
    <Box>
      {props.user.username}
    </Box>
  );
};