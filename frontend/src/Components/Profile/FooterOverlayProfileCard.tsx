import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Box, Heading, Text } from "grommet";
import { Profile } from "../../Services/ProfileService";
import { Calendar } from "grommet-icons";
import InviteToTalkButton from "../../Components/Profile/InviteToTalkButton"



interface Props {
  profile: Profile;
  // invitingUser: User
}

export const FooterOverlayProfileCard = (props: Props) => {
  const [viewProfile, setViewProfile] = useState<boolean>(false);

  if (viewProfile) {
    window.scrollTo(0, 0);
    return <Redirect to={`/profile/${props.profile.user.id}`} push={true} />
  } else {
    return (
      <Box direction="row" background="#d5d5d5" width="100%" align="center" height="15%" justify="center" gap="150px">
        <Box
          width="150px"
          height="40px"
          background="white"
          onClick={() => setViewProfile(true)} 
          align="center"
          round="xsmall"
          justify="center"
          hoverIndicator="color1"
        >
          <Text size="14px" weight="bold"> View more </Text>
        </Box>
        {/* <Box
          width="150px"
          height="40px"
          background="white"
          onClick={()=>{}} 
          align="center"
          round="xsmall"
          justify="center"
          hoverIndicator="color1"
        >
          <Text size="14px" weight="bold"> Invite speaker </Text>
        </Box>  */}
        <InviteToTalkButton
          profile={props.profile}
        />
      </Box>
    );
  }
};