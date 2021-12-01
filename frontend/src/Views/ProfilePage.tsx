import React, { useState, useEffect } from "react";
import { Box, Heading, Text } from "grommet";
import Identicon from "react-identicons";

import { Profile, ProfileService } from "../Services/ProfileService";
import "../Styles/all-profiles-page.css";


interface Props {
  location: { pathname: string };
}

const ProfilePage = (props: Props) => {
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    ProfileService.getProfile(getUserIdFromUrl(), setProfile);
  });

  function getUserIdFromUrl(): number {
    let talkId = props.location.pathname.split("/")[2]
    if (!talkId) {
      return -1;
    }
    return Number(talkId);
  };

  return (
    <Box width="90%" margin={{ left: "2.5%" }} style={{ position: "relative", top: "12vh" }}>
      {profile?.user.id}
    </Box>
  );
};

export default ProfilePage;