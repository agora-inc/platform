import React, { useState, useEffect } from "react";
import { Box, CheckBox, Text } from "grommet";
import { Overview, DocumentText, Twitter, Configure } from "grommet-icons";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import ReactTooltip from "react-tooltip";
import ImageUploader from "../Components/Core/ImageUploader";
import { User, UserService } from "../Services/UserService";
import { Paper, Profile, ProfileService } from "../Services/ProfileService";
import "../Styles/all-profiles-page.css";

import InviteToTalkButton from "../Components/Profile/InviteToTalkButton";

interface Props {
  location: { pathname: string }
}

const ProfilePage = (props: Props) => {
  const [profile, setProfile] = useState<Profile>();
  const [home, setHome] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>(UserService.getCurrentUser());

  useEffect(() => {
    ProfileService.getProfile(getUserIdFromUrl(), setProfile);
    if (profile && currentUser.id === profile.user.id) {
      setHome(true)
    }
  });

  function getUserIdFromUrl(): number {
    let talkId = props.location.pathname.split("/")[2]
    if (!talkId) {
      return -1;
    }
    return Number(talkId);
  };

  if (profile) {
    return (
      <Box width="80%" margin={{ left: "7.5%" }} style={{ position: "relative", top: "12vh" }}>
        <Box
          direction="row"
          height="160px"
          align="center"
          justify="between"
          margin={{bottom: "20px"}}

        >
          <Box direction="row" align="center" gap="small" width="65%">
            <Box
              width="100px"
              height="100px"
              round="50px"
              background="white"
              justify="center"
              align="center"
              style={{ minWidth: 100, minHeight: 100 }}
              overflow="hidden"
            >
              <img
                src={""}
                height={120}
                width={120}
              />
            </Box>

            <Box direction="column" gap="10px" align="start">
              <Text 
                size="26px"
                color="black"
                weight="bold"
              >
                {profile.full_name}
              </Text>

              {currentUser && 
                <InviteToTalkButton
                  invitingUser={currentUser}
                  profile={profile}
                />
              }

              <Box 
                direction="row"
                align="end"
                gap="5px"
              >
                <Box data-tip data-for="avatar_info">
                  <ImageUploader
                    text="Upload profile picture"
                    width={"150px"}
                    onUpload={() => {}}
                  />
                  <ReactTooltip id='avatar_info' place="right" effect="solid">
                    <p>Recommended avatar dim: 400x400px</p>
                  </ReactTooltip>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box direction="column" gap="10px" width="35%">
            <Box direction="row">
              <CheckBox
                name="feature"
                label="Verified academic"
                checked={profile.user.verified_academic}
                onChange={() => {}}
              />
            </Box>
            <Box direction="row">
              <CheckBox
                name="feature"
                label="Open to give a talk"
                checked={profile.open_give_talk}
                onChange={() => {}}
              />
            </Box>
            
          </Box>
        </Box>

        <Box>
          <Tabs>
            <TabList>
              <Tab>
                <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                  <Overview />
                  <Text size="14px"> 
                    Short bio 
                  </Text>
                </Box>
              </Tab>
              <Tab>
                <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                  <DocumentText />
                  <Text size="14px"> 
                    Papers
                  </Text>
                </Box>
              </Tab>
              <Tab>
                <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                  <Twitter color="grey" />
                  <Text size="14px"> 
                    Tweets
                  </Text>
                </Box>
              </Tab>
              <Tab>
                <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                  <Configure />
                  <Text size="14px"> 
                    Settings 
                  </Text>
                </Box>
              </Tab>
            </TabList>
            
            <TabPanel style={{width: "78vw", minHeight: "800px"}}>
              <Box>
                Bio
              </Box>
            </TabPanel>

            <TabPanel style={{width: "78vw", minHeight: "800px"}}>
              {profile.papers.length !== 0 && (
                <Box>
                  {profile.papers.map((paper: string) => (
                    <Box>
                      ---  
                    </Box>
                  ))}
                </Box>
              )}
              {profile.papers.length === 0 && (
                <Text size="14px" style={{fontStyle: 'italic'}}>
                  No paper available
                </Text>
              )}
            </TabPanel>

            <TabPanel style={{width: "78vw", minHeight: "800px"}}>
              <Box direction="column">
                Twitter
              </Box>
            </TabPanel>

            <TabPanel style={{width: "78vw", minHeight: "800px"}}>
              <Box direction="row" margin={{bottom: "60px"}}>
                Settings
              </Box>
            </TabPanel>

          </Tabs>
        </Box>
          
      </Box>
    );
  } else {
    return (
      <Text size="16px" weight="bold" style={{ position: "relative", top: "15vh", left: "15vh" }}>
        This profile does not exist.
      </Text>
    );
  }
};

export default ProfilePage;