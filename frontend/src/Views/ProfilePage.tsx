import React, { useState, useEffect } from "react";
import { Box, CheckBox, Image, Text } from "grommet";
import { Workshop, DocumentText, Twitter, Configure, Save, Group } from "grommet-icons";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactTooltip from "react-tooltip";
import Identicon from "react-identicons";
import agoraLogo from "../assets/general/agora_logo_v2.1.svg";

import ImageCropUploader from "../Components/Channel/ImageCropUploader";
import { BioEntry } from "../Components/Profile/BioEntry";
import { PaperEntry } from "../Components/Profile/PaperEntry";
import { PresentationEntry } from "../Components/Profile/PresentationEntry";
import { TagsEntry } from "../Components/Profile/TagsEntry";
import { Topic } from "../Services/TopicService";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import DropdownChannelButton from "../Components/Channel/DropdownChannelButton";
import { Paper, Profile, ProfileService, Presentation } from "../Services/ProfileService";
import Loading from "../Components/Core/Loading";
import "../Styles/all-profiles-page.css";
import { DetailsEntry } from "../Components/Profile/DetailsEntry";
import CreateChannelButton from "../Components/Channel/CreateChannelButton";
import CreateChannelOverlay from "../Components/Channel/CreateChannelButton/CreateChannelOverlay";

import TopicSelector from "../Components/Talks/TopicSelector";
import { LinkSecondaryButton } from "../Components/Core/LinkSecondaryButton";
import { CreatePresentationButton } from "../Components/Homepage/CreatePresentationButton";

interface Props {
  location: { pathname: string }
}

const ProfilePage = (props: Props) => {
  const [profile, setProfile] = useState<Profile>();
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [showCreateChannelOverlay, setShowCreateChannelOverlay] = useState<boolean>(false);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [topics, setTopics] = useState<Topic[]>([])
  const [isPrevTopics, setIsPrevTopics] = useState<boolean[]>([])
  const [home, setHome] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [adminChannels, setAdminChannels] = useState<Channel[]>([])
  const [followingChannels, setFollowingChannels] = useState<Channel[]>([]);

  useEffect(() => {
    ProfileService.getProfile(getUserIdFromUrl(), setProfile);
  }, []);

  useEffect(() => {
    ChannelService.getChannelsForUser(
      getUserIdFromUrl(),
      ["owner"],
      (adminChannels: Channel[]) => {
        setAdminChannels(adminChannels);
      }
    );
    ChannelService.getChannelsForUser(
      getUserIdFromUrl(),
      ["follower"],
      (followingChannels: Channel[]) => {
        setFollowingChannels(followingChannels);
      }
    );
  }, [])

  useEffect(() => {
    if(profile){
      ProfileService.getProfilePhotoUrl(profile.user.id, 0, 
        (profilePicUrl: string) => {
          setProfilePhotoUrl(profilePicUrl)
        })
      }
  }, [profile])

  useEffect(() => {
    if (profile) {
      setTopics(profile.topics)
      setIsPrevTopics(profile.topics.map((topic: Topic) => topic ? true : false)) 
    }
  }, [profile])
  
  useEffect(() => {
    setUser(UserService.getCurrentUser())
  }, []);

  useEffect(() => {
    if (profile) {
      if (user && user.id === profile.user.id) {
        setHome(true)
      }
      setPapers(profile.papers)
      setPresentations(profile.presentations)
    }
  }, [profile, user]);

  function getUserIdFromUrl(): number {
    let userId = props.location.pathname.split("/")[2]
    if (!userId) {
      return -1;
    }
    return Number(userId);
  };

  function onProfilePhotoUpload(file: File): void {
    if (home && profile) {
      ProfileService.uploadProfilePhoto(
        profile.user.id,
        file,
        () => {
          window.location.reload();
        }
      );
    }
  };

  function removeProfilePhoto(): void {
    if (home && profile) {
      ProfileService.removeProfilePhoto(
        profile.user.id,
        () => {
          window.location.reload();
        }
      );
    }
  };

  function createNewPaper(): void {
    setPapers([...papers, {id: -1, title: "", authors: "", publisher: "", year: "", link: ""} ])
  }

  function addNewPresentation(new_presentation: Presentation): void {
    setPresentations([...presentations, new_presentation])
  }

  function updatePaper(index: number, new_paper: Paper): void {
    const temp = papers
    temp[index] = new_paper
    setPapers(temp)
  }

  function updatePresentation(index: number, new_presentation: Presentation): void {
    const temp = presentations
    temp[index] = new_presentation
    setPresentations(temp)
  }

  function deletePaper(id: number): void {
    setPapers(papers.filter(paper => paper.id !== id))
  }

  function deletePresentation(id: number): void {
    setPresentations(presentations.filter(presentation => presentation.id !== id))
    window.location.reload() // Alain: couldn't do better. Some weird things happening in the presentations array
  }

  function selectTopic(topic: Topic, num: number) : void {
    let temp = topics;
    temp[num] = topic;
    setTopics(temp);
  }

  function cancelTopic(num: number) : void {
    let temp = topics;
    temp[num] = {
      field: "",
      id: 0,
      is_primitive_node: false,
      parent_1_id: -1,
      parent_2_id: -1, 
      parent_3_id: -1,
    }
    setTopics(temp)
  }

  function postTopics(topics: Topic[]) : void {
    if (profile) {
      ProfileService.updateTopics(
        profile.user.id,
        topics.map((topic: Topic) => topic ? topic.id : null),
        (res: string) => {
          window.location.reload();
        }
      )  
    }
  }

  function defaultBio(): string {
    if(profile){
      return (
        profile.full_name + " is a young professor who has recently been getting a lot of traction and visibility within the community, thanks to their lattest work. Many researchers in the field have been speculating his nomination as a recipient of the next Nobel price." 
      )
    }
    else{
      return(
        "Insert your bio"
      )
    }
  }

  console.log("PREZZ", presentations)

  if (profile) {
    return (
      <>
      <img style={{ height: "auto", width: "auto", minWidth: "100%", minHeight: "100%" }} id="background-landing"
      // src={BackgroundImage}
      src="https://i.postimg.cc/RhmJmzM3/mora-social-media-cover-bad6db.jpg"
    />
      <Box width="80%" margin={{ left: "7.5%" }} style={{ position: "relative", top: "12vh" }} background="color6" pad="small">
        <Box
          direction="row"
          height="150px"
          align="center"
          justify="between"
        >
          <Box direction="row" align="center" gap="30px" width="60%" >
            <img 
              style={{maxWidth: "150px", maxHeight: "150px", borderRadius: "50px"}}
              src={profilePhotoUrl}
            />
            <Box direction="column" gap="6px" align="start">
              <Text 
                  size="26px"
                  color="color3"
                  weight="bold"
                >
                  {profile.full_name}
              </Text> 

              <Text
                  size="16px"
                  color="color1"
                  style={{ height: "20px", overflow: "auto" }}
                  margin={{ bottom: "20px"}}
                  weight="bold"
                >
                  {profile.user.position}
                  {profile.user.position !== "" && profile.user.institution !== "" 
                    ? ", " : ""} 
                  {profile.user.institution}
              </Text>

              <Box direction="row" gap="30px">
                {home && (
                  <Box 
                    direction="row"
                    align="end"
                    gap="50px"
                  >
                    <Box data-tip data-for="avatar_info">
                    <ImageCropUploader
                      text="Upload new picture"
                      onUpload={onProfilePhotoUpload}
                      width="150px"
                      height="25px"
                      widthModal={600}
                      heightModal={600}
                      textSize="12px"
                      hideToolTip={true}
                      aspect={3 / 2}
                    />
                      <ReactTooltip id='avatar_info' place="right" effect="solid">
                        <p>Recommended avatar dim: 400x400px</p>
                      </ReactTooltip>
                    </Box>
                  </Box>
                )}
                {(profile.has_photo === 1 && home) && (
                  <Box 
                    style={{ 
                      border: "solid black 1px", cursor: "pointer" 
                    }}
                    round="xsmall"
                    width="150px"
                    height="25px"
                    justify="center"
                    align="center"
                    background="#EAF1F1"
                    focusIndicator={true}
                    hoverIndicator="#DDDDDD"
                    onClick={(e: any) => {
                      e.stopPropagation()
                      removeProfilePhoto()
                    }}
                  >
                    <Text size="12px" weight="bold" color="black">
                      Remove
                    </Text>
                  </Box>
                )}
              </Box>

            </Box>
          </Box>
          {home && (
            <Box width="25%" align="end" direction="column" gap="20px">
            {/* <LinkSecondaryButton 
                    text="Give a talk"
                    link="agoras"
                    iconSize="18px"
                    mobile={false}
                    width="150px"
                    height="30px" 
              /> 

              <CreateChannelButton
                 onClick={() => {
                   setShowCreateChannelOverlay(!showCreateChannelOverlay)
                    console.log(!showCreateChannelOverlay)
                  }}
              />

              {(showCreateChannelOverlay && user) && (
                <CreateChannelOverlay
                  onBackClicked={setShowCreateChannelOverlay(!showCreateChannelOverlay)}
                  onComplete={() => {
                    setShowCreateChannelOverlay(!showCreateChannelOverlay);
                  }}
                  visible={true}
                  user={user}
                />
            )} */}

              <CreatePresentationButton
                width="200px"
                height="40px"
                iconSize="24px"
                textSize="14px"
                addNewPresentation={addNewPresentation}
              />

              <LinkSecondaryButton 
                text="Look for speakers"
                link="speakers"
                iconSize="24px"
                mobile={false}
                width="200px"
                height="40px" 
              />
            
            </Box>  
          )}

          {/* <Box direction="column" gap="10px" width="45%">
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
          </Box> */}
        </Box>

        <BioEntry bio={profile.user.bio ? profile.user.bio : defaultBio()} home={home} userId={profile.user.id} /> 

        <Box>
          <Tabs>
            <TabList>
              <Tab>
                <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                  <Workshop />
                  <Text size="14px"> 
                    Talk applications
                  </Text>
                </Box>
              </Tab>
              {home && (
                <Tab>
                  <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                    <Group color="grey" />
                    <Text size="14px"> 
                      Your <img src={agoraLogo} style={{ height: "13px", marginRight: "-1px", marginBottom: "-2.8px"}}/>
                    </Text>
                  </Box>
                </Tab>
              )}
              <Tab>
                <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                  <DocumentText />
                  <Text size="14px"> 
                    Papers
                  </Text>
                </Box>
              </Tab>
              {/* <Tab>
                <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                  <Twitter color="grey" />
                  <Text size="14px"> 
                    Tags & Tweets
                  </Text>
                </Box>
              </Tab> */}
              {home && (
                <Tab>
                  <Box direction="row" justify="center" pad="6px" gap="18px" margin={{left: "6px", right: "6px"}}>
                    <Configure />
                    <Text size="14px"> 
                      Account 
                    </Text>
                  </Box>
                </Tab>
              )}
            </TabList>

            <TabPanel style={{width: "78vw", minHeight: "800px"}}>
              {home && (
                <></>
                // <Box direction="row" gap="30%" margin={{top: "20px", bottom: "30px" }}>
                //   <Box
                //     data-tip data-for='add_presentation'
                //     focusIndicator={false}
                //     background="color1"
                //     round="xsmall"
                //     pad={{ vertical: "2px", horizontal: "xsmall" }}
                //     onClick={createNewPresentation}
                //     style={{
                //       width: "150px",
                //       height: "30px",
                //     }}
                //     hoverIndicator={true}
                //     justify="center"
                //     align="center"
                      
                //   >
                //     <Text color="white" size="small"> 
                //       Give a talk
                //     </Text>
                //     <ReactTooltip id="add_presentation" effect="solid">
                //       Fill below to allow seminar organisers to find you!
                //     </ReactTooltip>
                //   </Box>
                //   {/* <LinkSecondaryButton 
                //     text="Give a talk"
                //     link="agoras"
                //     iconSize="18px"
                //     mobile={false}
                //     width="150px"
                //     height="30px" 
                //   /> */}
                // </Box>
              )}
              {presentations.length !== 0 && (
                <>
                <Box direction="column" gap="48px">
                  {presentations.map((presentation: Presentation, index: number) => (
                    <PresentationEntry 
                      presentation={presentation} 
                      home={home} 
                      profile={profile}
                      userId={profile.user.id} 
                      index={index}
                      updatePresentation={updatePresentation} 
                      deletePresentation={deletePresentation} 
                    />
                  ))}
                </Box>
                {home 
                  ? (
                    <Box margin={{top: "50px"}}>
                      <LinkSecondaryButton 
                        text="Find seminar opportunities"
                        link="agoras"
                        iconSize="24px"
                        mobile={false}
                        width="250px"
                        height="40px" 
                      />
                    </Box>)
                  : (<></>)
                }
                </>
              )}
              {presentations.length === 0 && (
                <Text size="12px" color="DDDDDD" style={{fontStyle: 'italic'}}>
                  No pending talk application. Click on "Get invited to speak" to create one!
                </Text>
              )}
            </TabPanel>

            {home && (
              <TabPanel style={{width: "78vw", minHeight: "800px"}}>
                <Box
                  margin={{
                    bottom: "50px",
                    top: "small",
                    right: "small",
                  }}
                  focusIndicator={false}
                  justify="center"
                  gap="xsmall"
                  width="40%"
                >
                  <Text size="14px" weight="bold">
                    Manage your <img src={agoraLogo} style={{ height: "13px", marginRight: "-1px", marginBottom: "-2.8px"}}/>
                  </Text>
                  {adminChannels.length > 0 && (
                    <Box
                      overflow="auto"
                      gap="5px"
                      style={{maxHeight: "300px"}}
                      margin={{top: "10px", bottom: "10px"}}
                    > 
                      {adminChannels.map((channel: Channel) => (
                        <DropdownChannelButton
                          channel={channel}
                          isAdmin={true}
                          onClick={() => {}}
                        />
                      ))}
                    </Box>
                  )}
                  {adminChannels.length === 0 && (
                    <Text size="12px" color="DDDDDD" style={{marginTop: "5px", marginBottom: "5px", fontStyle: "italic" }}>
                      An agora is where seminar organizers publish the next talks, upload the recordings of the previous seminars, 
                      and where potential speakers apply to give a talk!
                    </Text>
                  )}

                  <CreateChannelButton
                    onClick={() => setShowCreateChannelOverlay(true)}
                    height="40px"
                    width="200px"
                  />
                </Box>

                {showCreateChannelOverlay && user && (
                  <CreateChannelOverlay
                    onBackClicked={() => setShowCreateChannelOverlay(false)}
                    onComplete={() => setShowCreateChannelOverlay(false)}
                    visible={true}
                    user={user}
                  />
                )}

                <Box
                  focusIndicator={false}
                  gap="xsmall"
                >
                  <Text size="14px" weight="bold">
                    Following
                  </Text>
                  <Box
                    style={{maxHeight: "300px", marginTop: "5px"}}
                    overflow="auto"
                    align="start"
                    gap="5px"
                  >
                    {followingChannels.length === 0 && (
                      <>
                      <Text size="12px" color="DDDDDD" style={{fontStyle: "italic"}} margin={{bottom: "15px"}}> 
                        The agoras you follow will be displayed here 
                      </Text>
                      <LinkSecondaryButton 
                        text="Find new agoras"
                        link="browse"
                        iconSize="18px"
                        mobile={false}
                        width="190px"
                        height="30px" 
                      /> 
                      </>

                    )}
                    {followingChannels.map((channel: Channel) => (
                    <DropdownChannelButton
                      channel={channel}
                      isAdmin={false}
                      onClick={() => {}}
                    />
                    ))}
                  </Box>
                </Box>
              </TabPanel>
            )}

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
                <Text size="12px" color="DDDDDD" style={{fontStyle: 'italic'}}>
                  Display some of your articles to seminar organisers
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

            {/* <TabPanel style={{width: "78vw", minHeight: "800px"}}>
              <Box direction="column" gap="30px">
                <TagsEntry tags={profile.tags} home={home} userId={profile.user.id} hasTitle={true} />

                <Text size="14px" weight="bold">
                  Twitter feed
                </Text> 

              </Box>
            </TabPanel> */}

            {home && (
              <TabPanel style={{width: "78vw", minHeight: "800px"}}>
                <Box direction="column" gap="50px">
                  <Box direction="column" gap="5px">
                    <Text size="14px" weight="bold">
                      Update your details
                    </Text>
                    <DetailsEntry
                      title='Full name'
                      dbKey='full_name'
                      value={profile.full_name}
                      userId={profile.user.id}
                      home={home}

                    />
                    <DetailsEntry
                      title='Academic position'
                      dbKey='position'
                      value={profile.user.position}
                      userId={profile.user.id}
                      home={home}
                    />
                    <DetailsEntry
                      title='Institution'
                      dbKey='institution'
                      value={profile.user.institution}
                      userId={profile.user.id}
                      home={home}
                    />
                    <DetailsEntry
                      title='Username'
                      dbKey='username'
                      value={profile.user.username}
                      userId={profile.user.id}
                      home={home}
                    />
                    <DetailsEntry
                      title='Email address'
                      dbKey='email'
                      value={profile.user.email}
                      userId={profile.user.id}
                      home={home}
                    />
                  </Box>

                  <Box direction="column" gap="30px">
                    <TagsEntry tags={profile.tags} home={home} userId={profile.user.id} hasTitle={true} />
                    {/* <Text size="14px" weight="bold">
                      Twitter feed
                    </Text> */}
                  </Box>

                  <Box gap="20px">
                    <Box direction="row" align="center" gap="10px">
                      <Text size="14px" weight="bold">
                        Choose your areas of expertise
                      </Text>
                      {home && (
                        <Box
                          data-tip data-for="save_topic"
                          height="24px" pad="4px"
                          style={{border: "1px solid grey"}} 
                          round="xsmall"
                          onClick={() => { postTopics(topics); }}   
                        >
                          <Save size="16px"/>
                          <ReactTooltip id="save_topic" effect="solid">
                            Click to save your topics! 
                          </ReactTooltip>
                        </Box>

                      )}
                    </Box>
                    <TopicSelector
                      onSelectedCallback={selectTopic}
                      onCanceledCallback={cancelTopic}
                      prevTopics={topics}
                      isPrevTopics={isPrevTopics} 
                      size="small"
                      marginTop="0px"
                      marginBottom="15px"
                      isHeader={true}
                    />
                  </Box>

                  {/* <Box direction="column" gap="15px">
                    <Text size="14px" weight="bold">
                      Profile picture
                    </Text>
                    <Box direction="row" gap="30px">
                      <Box data-tip data-for="avatar_info">
                        <ImageCropUploader
                          text="Upload new picture"
                          onUpload={onProfilePhotoUpload}
                          width="150px"
                          height="25px"
                          widthModal={600}
                          heightModal={600}
                          textSize="12px"
                          hideToolTip={true}
                          aspect={3 / 2}
                        />
                          <ReactTooltip id='avatar_info' place="right" effect="solid">
                            <p>Recommended avatar dim: 400x400px</p>
                          </ReactTooltip>
                      </Box>
                      {profile.has_photo === 1 && (
                        <Box 
                          style={{ 
                            border: "solid black 1px", cursor: "pointer" 
                          }}
                          round="xsmall"
                          width="150px"
                          height="25px"
                          justify="center"
                          align="center"
                          background="#EAF1F1"
                          focusIndicator={true}
                          hoverIndicator="#DDDDDD"
                          onClick={(e: any) => {
                            e.stopPropagation()
                            removeProfilePhoto()
                          }}
                        >
                          <Text size="12px" weight="bold" color="black">
                            Remove
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </Box> */}

                  <Box direction="column" gap="15px">
                    <Text size="14px" weight="bold">
                      External profiles
                    </Text>
                    <DetailsEntry
                      title='Twitter handle'
                      dbKey='twitter_handle'
                      value={profile.twitter_handle}
                      userId={profile.user.id}
                      home={home}
                    />
                    <DetailsEntry
                      title='Google Scholar'
                      dbKey='google_scholar_link'
                      value={profile.google_scholar_link}
                      userId={profile.user.id}
                      home={home}
                    />
                  </Box>


                  {/* <Text size="14px" weight="bold">
                    Become a verified academic
                      </Text> */}
                  <Box
                    onClick={UserService.logout}
                    width="150px"
                    height="25px"
                    style={{ position: "relative", border: "solid black 1px", cursor: "pointer" }}
                    round="xsmall"
                    justify="center"
                    align="center"
                    background="#EAF1F1"
                    focusIndicator={true}
                    hoverIndicator="#DDDDDD"
                    gap="xsmall"
                  >
                    <Text size="12px" weight="bold" color="black"> Log out </Text>
                  </Box>
                </Box>
              </TabPanel>
            )}
          </Tabs>
        </Box>
      </Box>
      </>
    );
  } else {
    return (
      <Box 
        direction="row" 
        gap="8px"
        align="center" 
        style={{ position: "relative", top: "15vh", left: "15vh" }}
      >
        <Loading size={21} color="black" />
        <Text size="16px" weight="bold" >
          Loading profile... 
        </Text>
      </Box>
    );
  }
};

export default ProfilePage;