import React, { useState, useEffect } from "react";
import { Box, Text, TextInput, TextArea } from "grommet";
import { Presentation, Profile, ProfileService } from "../../Services/ProfileService";
import {  } from "grommet-icons";


interface Props {
  presentation: Presentation;
  profile: Profile;
  index: number;
  home: boolean;
  userId?: number;
  width?: string;
  updatePresentation?: any;
  deletePresentation?: any;
  isOverlay?: boolean;
}

export const PresentationEntry = (props: Props) => {
  const [user, setUser] = useState<boolean>(props.presentation.id > 0 ? false : true);

  return (
    <Box direction="row" align="center">
      123
    </Box>
  );
}