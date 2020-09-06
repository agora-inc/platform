import React, { useState } from "react";
import { Box, Text } from "grommet";

const DeleteAgoraButton = () => {
  return (
    <Box
      width="100px"
      height="25px"
      background="#FF4040"
      round="xsmall"
      style={{ cursor: "pointer" }}
      align="center"
      justify="center"
      margin={{ left: "5px" }}
    >
      <Text size="13px" weight="bold" color="white">
        Delete agora
      </Text>
    </Box>
  );
};

export default DeleteAgoraButton;
