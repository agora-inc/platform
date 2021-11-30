import React, { useState, useEffect, FunctionComponent } from "react";
import { Box, Heading, Text, Image, Layer } from "grommet";
import { Link } from "react-router-dom";
import { Profile, ProfileService } from "../../Services/ProfileService";
import { FooterOverlayProfileCard } from "./FooterOverlayProfileCard";
import { } from "grommet-icons";

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
  var name = props.profile.full_name ? props.profile.full_name : props.profile.user.username
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
        <Box height="60%" direction="row" pad="10px">
          <Box direction="column" width={props.profile.has_photo ? "65%" : "80%"} gap="10px" margin={{bottom: "10px"}}> 
            <Text 
              weight="bold" 
              size="14px" 
              color="color3"
              style={{ height: "30px", overflow: "auto" }}
            >
              {name}
            </Text>
          
            <Text
              size="14px"
              color="color1"
              weight="bold"
              style={{ height: "30px", overflow: "auto" }}
            >
              {props.profile.user.position}, {props.profile.user.institution}
            </Text>
          </Box> 
          {props.profile.has_photo && (
            <Box width="40%">
              <Text> Image placeholder </Text>
              <Image 
                style={{position: 'absolute', top: 10, right: 10, aspectRatio: "3/2"}}
                src={getProfilePhotoUrl()}
                width="30%"
              />
            </Box>
          )}
        </Box>
        <Box height="60%" direction="row" pad="10px" gap="8px">
          {props.profile.tags.map((tag: string) => (
            <Box height="20px" background="#EEEEEE" round="xsmall" pad="small" justify="center"  >
              <Text size="11px" weight="bold"> 
                {tag}
              </Text>
            </Box> 
          ))}
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
      {showModal && (
        <Layer
          onEsc={() => {
            setShowModal(!showModal);
            setShowShadow(false);
          }}
          onClickOutside={() => {
            setShowModal(!showModal);
            setShowShadow(false);
          }}
          modal
          responsive
          animation="fadeIn"
          style={{
            width: 640,
            height: 540,
            borderRadius: 15,
            overflow: "hidden",
          }}
        >
          <Box
            pad="25px"
            height="80%"
            justify="between"
            gap="xsmall"
          >
            <Box
              style={{ minHeight: "200px", maxHeight: "540px" }}
              direction="column"
            >
              <Box direction="row" gap="xsmall" style={{ minHeight: "40px" }} align="center">
                <Link
                  className="channel"
                  to={`/profile/${props.profile.user.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    direction="row"
                    gap="xsmall"
                    align="center"
                    round="xsmall"
                    pad={{ vertical: "6px", horizontal: "6px" }}
                  >
                    <Text weight="bold" size="16px" color="color3">
                      {name}
                    </Text>
                  </Box>
                </Link>
              </Box>
            </Box>
          </Box>
          <FooterOverlayProfileCard
            user={props.profile.user}
          />
        </Layer>
      )}
    </Box>
  )
}