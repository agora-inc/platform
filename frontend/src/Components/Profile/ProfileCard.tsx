import React, { useState, useEffect, FunctionComponent } from "react";
import { Box, Heading, Text, Image, Layer } from "grommet";
import { Link } from "react-router-dom";
import Identicon from "react-identicons";

import { Topic } from "../../Services/TopicService";
import { Paper, Profile, ProfileService } from "../../Services/ProfileService";
import { FooterOverlayProfileCard } from "./FooterOverlayProfileCard";
import { PaperEntry } from "./PaperEntry";
import { PresentationEntry } from "./PresentationEntry";
import { Workshop, DocumentText } from "grommet-icons";
import { TagsEntry } from "./TagsEntry";

interface Props {
  profile: Profile;
  width: string;
}

export const ProfileCard:FunctionComponent<Props> = (props) => { 
  const [showModal, setShowModal] = useState<boolean>(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");

  var renderMobileView = (window.innerWidth < 800);
  var name = props.profile.full_name ? props.profile.full_name : props.profile.user.username

  useEffect(() => {
    ProfileService.getProfilePhotoUrl(props.profile.user.id, 0, 
      (profilePicUrl: string) => {
        setProfilePhotoUrl(profilePicUrl)
      })
  }, []);

  return (
    <Box 
      className="profile-card"
      focusIndicator={false}
      height="100%"
      width={props.width}
      onClick={() => setShowModal(true)}
      background="white"
      round="xsmall"
      justify="between"
      overflow="hidden"
      style={{
        maxHeight: "180px",
        position: "relative",
      }}
    >
      <Box height="55%" direction="row" pad="5px">
        <Box direction="column" width={props.profile.has_photo === 1 ? "65%" : "80%"}> 
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
        <Box width="35%" round="10px">
            <img 
              style={{position: 'absolute', top: 15, right: 15, aspectRatio: "3/2", borderRadius: "10px"}}
              src={profilePhotoUrl}
              width="28%"
            />
        </Box>
      </Box>
      <Box height="45%" direction="row" gap="8px" wrap={true} overflow="auto" margin={{top: "20px"}}>
        {props.profile.tags.length > 0 && props.profile.tags.slice(0, 5).map((tag: string) => (
          <Box height="18px" background="#EEEEEE" round="xsmall" pad="small" 
            justify="center" margin={{top: "2px", bottom: "2px"}}
          >
            <Text size="10px" weight="bold"> 
              {tag}
            </Text>
          </Box> 
        ))}
        {props.profile.tags.length === 0 && props.profile.topics.length > 0 
          && props.profile.topics.map((topic: Topic) => (
            <Box height="18px" background="#EEEEEE" round="xsmall" pad="small" 
            justify="center" margin={{top: "2px", bottom: "2px"}}
          >
            <Text size="10px" weight="bold"> 
              {topic.field}
            </Text>
          </Box> 
          )) 
        }
      </Box>

      {showModal && (
        <Layer
          onEsc={() => {
            setShowModal(!showModal);
          }}
          onClickOutside={() => {
            setShowModal(!showModal);
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
            height="85%"
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
                <img 
                  style={{position: 'absolute', top: 15, right: 15, aspectRatio: "3/2", borderRadius: "10px"}}
                  src={profilePhotoUrl}
                  width="30%"
                />
            </Box>

            {props.profile.presentations.length === 0 && (
              <Box margin={{bottom: "20px", top: "0px"}} gap="5px">
                <Box direction="row" gap="8px" align="center" margin={{bottom: "10px"}}>
                  <DocumentText size="15px" />
                  <Text size="14px" weight="bold" color="color1"> 
                    My latest papers:
                  </Text>
                </Box>
                {props.profile.papers.slice(0, 3).map((paper: Paper, index: number) => (
                  <PaperEntry paper={paper} index={index} home={false} width="100%" />
                ))}
              </Box>
            )}
            {props.profile.presentations.length > 0 && (
              <Box margin={{bottom: "20px", top: "0px"}} gap="5px">
                <Box direction="row" gap="8px" align="center" margin={{bottom: "10px"}}>
                  <Workshop size="15px" />
                  <Text size="16px" weight="bold" color="color1"> 
                    I want to speak about...
                  </Text>
                </Box>
                <PresentationEntry 
                  presentation={props.profile.presentations[0]}
                  profile={props.profile} 
                  index={0}
                  home={false}
                  width="100%"
                  isOverlay={true} 
                />
              </Box>
            )}
            {props.profile.tags.length > 0 && (
              <TagsEntry tags={props.profile.tags} home={false} hasTitle={false} marginBottom="10px" />
            )}
            {props.profile.tags.length === 0 && props.profile.topics.length > 0 && (
              <Box direction="row" gap="8px" wrap={true} overflow="auto" margin={{bottom: "10px"}}>
                {props.profile.topics.map((topic: Topic) => (
                  <Box height="18px" background="#EEEEEE" round="xsmall" pad="small" 
                    justify="center" margin={{top: "2px", bottom: "2px"}}
                  >
                    <Text size="10px" weight="bold"> 
                      {topic.field}
                    </Text>
                </Box> 
                ))}
              </Box>
            )}
          </Box>
          
          <FooterOverlayProfileCard
            profile={props.profile}
            presentationName={props.profile.presentations.length > 0 ? props.profile.presentations[0].title : ""}
          />
        </Layer>
      )}
    </Box>
  )
}