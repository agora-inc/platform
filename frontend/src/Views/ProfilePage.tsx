import React, { useState, useEffect } from "react";
import { Box, CheckBox, Text } from "grommet";
import { DocumentText, Twitter, Configure } from "grommet-icons";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import ReactTooltip from "react-tooltip";
import ImageUploader from "../Components/Core/ImageUploader";
import { PaperEntry } from "../Components/Profile/PaperEntry";
import { TagsEntry } from "../Components/Profile/TagsEntry";
import { User, UserService } from "../Services/UserService";
import { Paper, Profile, ProfileService } from "../Services/ProfileService";
import "../Styles/all-profiles-page.css";


interface Props {
  location: { pathname: string };
}

const ProfilePage = (props: Props) => {
  const [profile, setProfile] = useState<Profile>();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [home, setHome] = useState<boolean>(true);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    ProfileService.getProfile(getUserIdFromUrl(), setProfile);
  }, []);
  useEffect(() => {
    setUser(UserService.getCurrentUser())
  }, []);

  useEffect(() => {
    if (profile) {
      if (user && user.id === profile.user.id) {
        setHome(true)
      }
      setPapers(profile.papers)
    }
  }, [profile, user]);

  function getUserIdFromUrl(): number {
    let userId = props.location.pathname.split("/")[2]
    if (!userId) {
      return -1;
    }
    return Number(userId);
  };

  function createNewPaper(): void {
    setPapers([...papers, {id: -1, title: "", authors: "", publisher: "", year: "", link: ""} ])
  }

  function updatePaper(index: number, new_paper: Paper): void {
    const temp = papers
    temp[index] = new_paper
    setPapers(temp)
  }

  function deletePaper(id: number): void {
    setPapers(papers.filter(paper => paper.id !== id))
  }

  if (profile) {
    console.log("pap", papers)
    return (
      <Box width="80%" margin={{ left: "7.5%" }} style={{ position: "relative", top: "12vh" }}>
        <Box
          direction="row"
          height="160px"
          align="center"
          justify="between"
        >
          <Box direction="row" align="center" gap="small" width="55%">
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
          <Box direction="column" gap="10px" width="45%">
            <Box direction="row">
              <CheckBox
                name="feature"
                label="Verified academic"
                checked={profile.user.verified_academic ? profile.user.verified_academic : false}
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

        <Box width="55%" margin={{bottom: "30px"}} style={{maxHeight: "50px"}} overflow="auto">
          {profile.user.bio}
        </Box>

        <Box>
          <Tabs>
            <TabList>
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
                    Tags & Tweets
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
              {papers.length !== 0 && (
                <Box direction="column" gap="12px">
                  {papers.map((paper: Paper, index: number) => (
                    <PaperEntry paper={paper} home={home} userId={profile.user.id} index={index} 
                      updatePaper={updatePaper} deletePaper={deletePaper} 
                    />
                  ))}
                </Box>
              )}
              {papers.length === 0 && (
                <Text size="14px" style={{fontStyle: 'italic'}}>
                  No paper available
                </Text>
              )}
              {home && (
                <Box
                  focusIndicator={false}
                  background="white"
                  round="xsmall"
                  pad={{ vertical: "2px", horizontal: "xsmall" }}
                  onClick={createNewPaper}
                  style={{
                    width: "15%",
                    border: "1px solid #C2C2C2",
                  }}
                  hoverIndicator={true}
                  align="center"
                  margin={{top: "20px" }}   
                >
                  <Text color="grey" size="small"> 
                    + Add 
                  </Text>
                </Box>
              )}
            </TabPanel>

            <TabPanel style={{width: "78vw", minHeight: "800px"}}>
              <Box direction="column">
                <TagsEntry tags={profile.tags} home={home} userId={profile.user.id} 
                  hasTitle={true} updateTags={() => {}} />

                <Text size="14px" weight="bold">
                  Twitter feed
                </Text>

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