import React, { useState, useEffect } from "react";
import { Box, Heading, Text } from "grommet";
import { ProfileCard } from "../Components/Profile/ProfileCard";
import Identicon from "react-identicons";

import { User, UserService } from "../Services/UserService";
import "../Styles/all-profiles-page.css";

const AllProfilesPage = () => {
  const [profiles, setProfiles] = useState<User[]>([]);

  useEffect(() => {
    UserService.getAllPublicUsers(setProfiles);
  });

  return (
    <Box width="90%" margin={{ left: "2.5%" }}>
      <Box
        direction="row"
        width="100%"
        justify="between"
        align="end"
        margin={{ bottom: "medium" }}
        style={{ position: "relative", top: "12vh" }}
      >
        <Heading
          color="color1"
          size="24px"
          margin="none"
          style={{ height: "20px" }}
        >
          All speakers
        </Heading>
      </Box>
      <Box
        direction="row"
        gap="1%"
        wrap
        // justify="center"
        margin={{ top: "20px" }}
      >
        {profiles.map((user: User) => (
          <ProfileCard profile={user} width="24%" />
        ))}
      </Box>
    </Box>
  );
};

export default AllProfilesPage;