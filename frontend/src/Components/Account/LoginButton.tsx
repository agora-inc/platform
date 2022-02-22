import React from "react";
import { Box, Text } from "grommet";
import { StatusCritical, StatusGood } from "grommet-icons";

import { UserService } from "../../Services/UserService";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  callback: any;
}

export const LoginButton = ({ callback: any }: Props) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Box style={{ maxHeight: "30px" }}>
      <Box
        onClick={loginWithRedirect}
        background="#F2F2F2"
        hoverIndicator="#BAD6DB"
        focusIndicator={false}
        align="center"
        justify="center"
        width="100px"
        height="35px"
        round="xsmall"
      >
        <Text size="14px" weight="bold">
          {" "}
          Log in{" "}
        </Text>
      </Box>
    </Box>
  );
};
