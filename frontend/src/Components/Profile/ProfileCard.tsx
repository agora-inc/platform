import React, { useState, useEffect, FunctionComponent } from "react";
import { Box, Heading, Text, Image, Layer } from "grommet";
import { Link } from "react-router-dom";
import { Paper, Profile, ProfileService } from "../../Services/ProfileService";
import { FooterOverlayProfileCard } from "./FooterOverlayProfileCard";
import { PaperEntry } from "./PaperEntry";
import { DocumentText } from "grommet-icons";
import { TagsEntry } from "./TagsEntry";

interface Props {
  profile: Profile;
  width: string;
}

export const ProfileCard:FunctionComponent<Props> = (props) => { 
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showShadow, setShowShadow] = useState<boolean>(false);

  function getProfilePhotoUrl(): string {
    return ProfileService.getProfilePhoto(props.profile.user.id)
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
              size="11px"
              weight="bold"
              color="color1"
              style={{ height: "30px", overflow: "auto" }}
            >
              {props.profile.user.position}, {props.profile.user.institution}
            </Text>
          </Box> 
          {props.profile.has_photo && (
            <Box width="40%">
              <Image 
                style={{position: 'absolute', top: 15, right: 15, aspectRatio: "3/2"}}
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
            // gap="xsmall"
          >
            <Box
              direction="row"
            >
              <Box
                direction="column"
                width="65%"
              >
                <Box direction="row" gap="xsmall" style={{ height: "30px" }} align="center">
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
                    >
                      <Text weight="bold" size="18px" color="color3">
                        {name}
                      </Text>
                    </Box>
                  </Link>
                </Box>
                <Text
                  size="13px"
                  color="color1"
                  weight="bold"
                  style={{ height: "20px", overflow: "auto" }}
                  margin={{ bottom: "20px"}}
                >
                  {props.profile.user.position}, {props.profile.user.institution}
                </Text>
                <Box 
                  margin={{bottom: "20px"}}
                  style={{maxHeight: "100px", overflow: "auto"}}
                >
                  <Text size="12px"  >
                    {props.profile.user.bio}
                  </Text>
                </Box>
              </Box>
              <Image 
                style={{position: 'absolute', top: 25, right: 25, aspectRatio: "3/2"}}
                src={getProfilePhotoUrl()}
                width="30%"
              />
            </Box>

            <Box direction="row" gap="8px" align="center">
              <DocumentText size="15px" />
              <Text size="12px" style={{fontStyle: "italic"}}> 
                Latest papers
              </Text>
            </Box>
            <Box margin={{bottom: "30px", top: "-20px"}} gap="5px">
              {props.profile.papers.slice(0, 3).map((paper: Paper, index: number) => (
                <PaperEntry paper={paper} index={index} home={false} width="100%" />
              ))}
            </Box>
            <TagsEntry tags={props.profile.tags} home={false} hasTitle={false} marginBottom="10px" />
            
          </Box>
          
          <FooterOverlayProfileCard
            user={props.profile.user}
          />
        </Layer>
      )}
    </Box>
  )
}