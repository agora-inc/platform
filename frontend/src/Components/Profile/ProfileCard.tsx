import React, { useState, useEffect, FunctionComponent } from "react";
import { Box, Heading, Text, Image } from "grommet";
import { Profile, ProfileService } from "../../Services/ProfileService";
import { Calendar, UserExpert } from "grommet-icons";

interface Props {
  profile: Profile;
  width: string;
}

export const ProfileCard:FunctionComponent<Props> = (props) => { 
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showShadow, setShowShadow] = useState<boolean>(false);

  function getProfilePhotoUrl() {
    return ""
  }


  var renderMobileView = (window.innerWidth < 800);
  return (
    <Box 
      className="profile-card"
      focusIndicator={false}
      height="100%"
      width={props.width}
      style={{
        maxHeight: renderMobileView && showModal ? "600px" : "180px",
        position: "relative",
      }}
    >
      <Box
        onMouseEnter={() => setShowShadow(true)}
        onMouseLeave={() => { if (!showModal) setShowShadow(false) }}
        onClick={() => setShowModal(!showModal)}
        height="180px"
        width="100%"
        background="white"
        round="xsmall"
        justify="between"
        gap="10px"
        overflow="hidden"
      >
        <Box height="100%" pad="10px">
          <Box direction="column" width={props.profile.has_photo ? "65%" : "80%"} margin={{bottom: "10px"}}> 
            <Box
              direction="row"
              gap="xsmall"
              align="center"
              style={{ height: "45px" }}
              margin={{ bottom: "15px" }}
            >
              <Text weight="bold" size="14px" color="color3">
                {props.profile.user.username}
              </Text>
            </Box> 

            <Text
              size="14px"
              color="color1"
              weight="bold"
              style={{ minHeight: "60px", overflow: "auto" }}
            >
              {props.profile.user.institution}
            </Text>
          </Box> 
          {props.profile.has_photo && (
            <Box width="40%">
              <Image 
                style={{position: 'absolute', top: 10, right: 10, aspectRatio: "3/2"}}
                src={getProfilePhotoUrl()}
                width="30%"
              />
            </Box>
          )}
          <Box direction="row" gap="small">
            <UserExpert size="18px" />
          </Box>
          <Box direction="row" gap="small">
            <Calendar size="14px" />
          </Box>
        </Box>
      </Box>
      {showShadow && (
        <Box
          height="180px"
          width="100%"
          round="xsmall"
          style={{
            zIndex: -1,
            position: "absolute",
            top: 8,
            left: 8,
            opacity: 0.8,
          }}
          background="color1"
        ></Box>
      )}
    </Box>
  )
}