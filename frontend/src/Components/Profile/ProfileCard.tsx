import React, { useState, useEffect, FunctionComponent } from "react";
import { Box, Heading, Text } from "grommet";
import { User, UserService } from "../../Services/UserService";

interface Props {
  profile: User;
  width: string;
}

export const ProfileCard:FunctionComponent<Props> = (props) => {  

  return (
    <Box width={props.width} className="profile-card">
      <Text> 123 </Text>
    </Box> 
  )

}