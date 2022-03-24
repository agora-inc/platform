import React, { useState, useEffect } from "react";
import { Box, CheckBox, Image, Text } from "grommet";
import {
  Workshop,
  DocumentText,
  Twitter,
  Configure,
  Save,
} from "grommet-icons";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ReactTooltip from "react-tooltip";
import Identicon from "react-identicons";

import ImageCropUploader from "../Components/Channel/ImageCropUploader";
import { BioEntry } from "../Components/Profile/BioEntry";
import { PaperEntry } from "../Components/Profile/PaperEntry";
import { PresentationEntry } from "../Components/Profile/PresentationEntry";
import { TagsEntry } from "../Components/Profile/TagsEntry";
import { Topic } from "../Services/TopicService";
import { User, UserService } from "../Services/UserService";
import {
  Paper,
  Profile,
  ProfileService,
  Presentation,
} from "../Services/ProfileService";
import Loading from "../Components/Core/Loading";
import "../Styles/all-profiles-page.css";
import { DetailsEntry } from "../Components/Profile/DetailsEntry";

import InviteToTalkButton from "../Components/Profile/InviteToTalkButton";
import TopicSelector from "../Components/Talks/TopicSelector";

interface Props {
  location: { pathname: string };
}

const ProfilePage = (props: Props) => {
  const [profile, setProfile] = useState<Profile>();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isPrevTopics, setIsPrevTopics] = useState<boolean[]>([]);
  const [home, setHome] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleWindowResize = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    ProfileService.getProfile(getUserIdFromUrl(), setProfile);
  }, []);

  useEffect(() => {
    if (profile) {
      setTopics(profile.topics);
      setIsPrevTopics(
        profile.topics.map((topic: Topic) => (topic ? true : false))
      );
    }
  }, [profile]);

  useEffect(() => {
    setUser(UserService.getCurrentUser());
    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    if (profile) {
      if (user && user.id === profile.user.id) {
        setHome(true);
      }
      setPapers(profile.papers);
      setPresentations(profile.presentations);
    }
  }, [profile, user]);

  function getUserIdFromUrl(): number {
    let userId = props.location.pathname.split("/")[2];
    if (!userId) {
      return -1;
    }
    return Number(userId);
  }

  function getProfilePhotoUrl(): string {
    if (profile) {
      return ProfileService.getProfilePhoto(profile.user.id);
    } else {
      return "";
    }
  }

  function onProfilePhotoUpload(file: File): void {
    if (home && profile) {
      ProfileService.uploadProfilePhoto(profile.user.id, file, () => {
        window.location.reload();
      });
    }
  }

  function removeProfilePhoto(): void {
    if (home && profile) {
      ProfileService.removeProfilePhoto(profile.user.id, () => {
        window.location.reload();
      });
    }
  }

  function createNewPaper(): void {
    setPapers([
      ...papers,
      { id: -1, title: "", authors: "", publisher: "", year: "", link: "" },
    ]);
  }

  function createNewPresentation(): void {
    setPresentations([
      ...presentations,
      {
        id: -1,
        user_id: -1,
        title: "",
        description: "",
        link: "",
        duration: 0,
        date_created: "",
      },
    ]);
  }

  function updatePaper(index: number, new_paper: Paper): void {
    const temp = papers;
    temp[index] = new_paper;
    setPapers(temp);
  }

  function updatePresentation(
    index: number,
    new_presentation: Presentation
  ): void {
    const temp = presentations;
    temp[index] = new_presentation;
    setPresentations(temp);
  }

  function deletePaper(id: number): void {
    setPapers(papers.filter((paper) => paper.id !== id));
  }

  function deletePresentation(id: number): void {
    setPresentations(
      presentations.filter((presentation) => presentation.id !== id)
    );
  }

  function selectTopic(topic: Topic, num: number): void {
    let temp = topics;
    temp[num] = topic;
    setTopics(temp);
  }

  function cancelTopic(num: number): void {
    let temp = topics;
    temp[num] = {
      field: "",
      id: 0,
      is_primitive_node: false,
      parent_1_id: -1,
      parent_2_id: -1,
      parent_3_id: -1,
    };
    setTopics(temp);
  }

  function postTopics(topics: Topic[]): void {
    if (profile) {
      ProfileService.updateTopics(
        profile.user.id,
        topics.map((topic: Topic) => (topic ? topic.id : null)),
        (res: string) => {
          window.location.reload();
        }
      );
    }
  }

  if (profile) {
    return (
      <Box
        width="80%"
        margin={{ left: "7.5%" }}
        style={{ position: "relative", top: "12vh" }}
      >
        <Box direction="row" height="160px" align="center" justify="between">
          <Box direction="row" align="start" gap="30px" width="55%">
            <Box
              width="150px"
              height="100px"
              round="50px"
              justify="center"
              align="center"
              overflow="hidden"
            >
              {profile.has_photo === 1 && (
                <img width={150} height={100} src={getProfilePhotoUrl()} />
              )}
              {profile.has_photo === 0 && (
                <Identicon
                  string={profile.user.username}
                  size={150}
                  style={{
                    height: "100px",
                    width: "100px",
                    minHeight: "150px",
                    minWidth: "100px",
                  }}
                />
              )}
            </Box>

            <Box direction="column" gap="6px" align="start">
              <Text size="26px" color="color3" weight="bold">
                {profile.full_name}
              </Text>
              <Text
                size="16px"
                color="color1"
                weight="bold"
                style={{ height: "20px", overflow: "auto" }}
                margin={{ bottom: "20px" }}
              >
                {profile.user.position} {profile.user.position && ","}{" "}
                {profile.user.institution}
              </Text>
            </Box>
          </Box>
        </Box>

        <BioEntry
          bio={profile.user.bio ? profile.user.bio : ""}
          home={home}
          userId={profile.user.id}
        />

        <Box>
          <Tabs>
            <TabList
              style={
                windowWidth < 899
                  ? {
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: "5px",
                      border: "none",
                    }
                  : {}
              }
            >
              <Tab style={windowWidth < 899 ? {} : {}}>
                <Box
                  direction="row"
                  justify="center"
                  pad="6px"
                  gap="18px"
                  margin={{ left: "6px", right: "6px" }}
                  align="center"
                >
                  <Workshop />
                  <Text size="14px">Presentations</Text>
                </Box>
              </Tab>
              <Tab>
                <Box
                  direction="row"
                  justify="center"
                  pad="6px"
                  gap="18px"
                  margin={{ left: "6px", right: "6px" }}
                  align="center"
                >
                  <DocumentText />
                  <Text size="14px">Papers</Text>
                </Box>
              </Tab>
              <Tab>
                <Box
                  direction="row"
                  justify="center"
                  pad="6px"
                  gap="18px"
                  margin={{ left: "6px", right: "6px" }}
                  align="center"
                >
                  <Twitter color="grey" />
                  <Text size="14px">Tags & Tweets</Text>
                </Box>
              </Tab>
              {home && (
                <Tab>
                  <Box
                    direction="row"
                    justify="center"
                    pad="6px"
                    gap="18px"
                    margin={{ left: "6px", right: "6px" }}
                    align="center"
                  >
                    <Configure />
                    <Text size="14px">Settings</Text>
                  </Box>
                </Tab>
              )}
            </TabList>

            <TabPanel style={{ width: "78vw", minHeight: "800px" }}>
              {home && (
                <Box
                  data-tip
                  data-for="add_presentation"
                  focusIndicator={false}
                  background="white"
                  round="xsmall"
                  pad={{ vertical: "2px", horizontal: "xsmall" }}
                  onClick={createNewPresentation}
                  style={{
                    width: "150px",
                    border: "1px solid #C2C2C2",
                  }}
                  hoverIndicator={true}
                  align="center"
                  margin={{ top: "20px", bottom: "30px" }}
                >
                  <Text color="grey" size="small">
                    + Add
                  </Text>
                  <ReactTooltip id="add_presentation" effect="solid">
                    Adding a presentation to your profile is the best way to get
                    seminar organizers' attention!
                  </ReactTooltip>
                </Box>
              )}
              {presentations.length !== 0 && (
                <Box direction="column" gap="48px">
                  {presentations.map(
                    (presentation: Presentation, index: number) => (
                      <PresentationEntry
                        presentation={presentation}
                        home={home}
                        profile={profile}
                        userId={profile.user.id}
                        index={index}
                        updatePresentation={updatePresentation}
                        deletePresentation={deletePresentation}
                        key={index}
                        windowWidth={windowWidth}
                      />
                    )
                  )}
                </Box>
              )}
              {presentations.length === 0 && (
                <Text size="14px" style={{ fontStyle: "italic" }}>
                  No presentation available
                </Text>
              )}
            </TabPanel>

            <TabPanel style={{ width: "78vw", minHeight: "800px" }}>
              {papers.length !== 0 && (
                <Box direction="column" gap="12px">
                  {papers.map((paper: Paper, index: number) => (
                    <PaperEntry
                      paper={paper}
                      home={home}
                      userId={profile.user.id}
                      index={index}
                      updatePaper={updatePaper}
                      deletePaper={deletePaper}
                      windowWidth={windowWidth}
                    />
                  ))}
                </Box>
              )}
              {papers.length === 0 && (
                <Text size="14px" style={{ fontStyle: "italic" }}>
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
                    width: "150px",
                    border: "1px solid #C2C2C2",
                  }}
                  hoverIndicator={true}
                  align="center"
                  margin={{ top: "20px" }}
                >
                  <Text color="grey" size="small">
                    + Add
                  </Text>
                </Box>
              )}
            </TabPanel>

            <TabPanel style={{ width: "78vw", minHeight: "800px" }}>
              <Box direction="column" gap="30px">
                <TagsEntry
                  tags={profile.tags}
                  home={home}
                  userId={profile.user.id}
                  hasTitle={true}
                />

                <Text size="14px" weight="bold">
                  Twitter feed
                </Text>
              </Box>
            </TabPanel>

            {home && (
              <TabPanel style={{ width: "78vw", minHeight: "800px" }}>
                <Box direction="column" gap="50px">
                  <Box
                    direction="column"
                    gap={windowWidth < 480 ? "15px" : "5px"}
                  >
                    <Text size="14px" weight="bold">
                      Update your details
                    </Text>
                    <DetailsEntry
                      title="Full name"
                      dbKey="full_name"
                      value={profile.full_name}
                      userId={profile.user.id}
                      home={home}
                      windowWidth={windowWidth}
                    />
                    <DetailsEntry
                      title="Academic position"
                      dbKey="position"
                      value={profile.user.position}
                      userId={profile.user.id}
                      home={home}
                      windowWidth={windowWidth}
                    />
                    <DetailsEntry
                      title="Institution"
                      dbKey="institution"
                      value={profile.user.institution}
                      userId={profile.user.id}
                      home={home}
                      windowWidth={windowWidth}
                    />
                    <DetailsEntry
                      title="Username"
                      dbKey="username"
                      value={profile.user.username}
                      userId={profile.user.id}
                      home={home}
                      windowWidth={windowWidth}
                    />
                    <DetailsEntry
                      title="Email address"
                      dbKey="email"
                      value={profile.user.email}
                      userId={profile.user.id}
                      home={home}
                      windowWidth={windowWidth}
                    />
                  </Box>
                  <Box gap="20px">
                    <Box direction="row" align="center" gap="10px">
                      <Text size="14px" weight="bold">
                        Choose your areas of expertise
                      </Text>
                      {home && (
                        <Box
                          data-tip
                          data-for="save_topic"
                          height="24px"
                          pad="4px"
                          style={{ border: "1px solid grey" }}
                          round="xsmall"
                          onClick={() => {
                            postTopics(topics);
                          }}
                        >
                          <Save size="16px" />
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

                  <Box direction="column" gap="15px">
                    <Text size="14px" weight="bold">
                      Profile picture
                    </Text>
                    <Box direction="row" gap="30px">
                      <Box direction="row" align="end">
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
                          <ReactTooltip
                            id="avatar_info"
                            place="right"
                            effect="solid"
                          >
                            <p>Recommended avatar dim: 400x400px</p>
                          </ReactTooltip>
                        </Box>
                      </Box>
                      {profile.has_photo === 1 && (
                        <Box
                          style={{
                            border: "solid black 1px",
                            cursor: "pointer",
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
                            e.stopPropagation();
                            removeProfilePhoto();
                          }}
                        >
                          <Text size="12px" weight="bold" color="black">
                            Remove
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Box direction="column" gap="15px">
                    <Text size="14px" weight="bold">
                      External profiles
                    </Text>
                    <DetailsEntry
                      title="Twitter handle"
                      dbKey="twitter_handle"
                      value={profile.twitter_handle}
                      userId={profile.user.id}
                      home={home}
                      windowWidth={windowWidth}
                    />
                    <DetailsEntry
                      title="Google Scholar"
                      dbKey="google_scholar_link"
                      value={profile.google_scholar_link}
                      userId={profile.user.id}
                      home={home}
                      windowWidth={windowWidth}
                    />
                  </Box>

                  {/* <Text size="14px" weight="bold">
                    Become a verified academic
                      </Text> */}
                </Box>
              </TabPanel>
            )}
          </Tabs>
        </Box>
      </Box>
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
        <Text size="16px" weight="bold">
          Loading profile...
        </Text>
      </Box>
    );
  }
};

export default ProfilePage;
