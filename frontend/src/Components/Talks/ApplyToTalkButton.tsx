import React, { useState, useEffect } from "react";
import { Box, Text, TextInput, TextArea } from "grommet";
import { Presentation, Profile, ProfileService } from "../../Services/ProfileService";
import { Workshop } from "grommet-icons";


interface Props {

}

export const ApplyToTalkButton = (props: Props) => {
  const [isOverlay, setIsOverlay] = useState<boolean>(false);

  return (
    <Box
      onClick={() => setIsOverlay(true)}
      background="color1"
      round="xsmall"
      pad="xsmall"
      height="45px"
      width="155px"
      justify="center"
      align="center"
      focusIndicator={false}
      hoverIndicator="color5"
      margin={{ left: "0px" }}
      direction="row"
    >
      <Workshop size="20px" />
      <Text size="14px" margin={{left: "10px"}}> Give a talk</Text>
    </Box>
  );
}