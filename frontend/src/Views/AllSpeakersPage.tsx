import React, { useState, useEffect } from "react";
import { Box, Heading, Text } from "grommet";
import { ProfileCard } from "../Components/Profile/ProfileCard";
import TopicClassification from "../Components/Homepage/TopicClassification";
import { Topic } from "../Services/TopicService";
import { Profile, ProfileService } from "../Services/ProfileService";
import MoraFlexibleGrid from "../Components/Core/MoraFlexibleGrid";
import "../Styles/all-profiles-page.css";

const AllSpeakersPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [topic, setTopic] = useState<Topic>();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  let childElements: React.ReactNode[];

  const handleWindowResize = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    if (topic && topic.id > 0) {
      ProfileService.getPublicProfilesByTopicRecursive(
        topic.id,
        50,
        0,
        setProfiles
      );
    } else {
      ProfileService.getAllNonEmptyProfiles(50, 0, setProfiles);
    }

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [topic]);

  childElements = profiles.map((profile: Profile, index: number) => (
    <ProfileCard
      profile={profile}
      width="100%"
      key={index}
      windowWidth={windowWidth}
    />
  ));

  return (
    <Box width="90%" margin={{ left: "2.5%", top: "6vw" }} gap="30px">
      <Heading
        color="color1"
        size="24px"
        margin="none"
        style={{ height: "20px" }}
      >
        Find your speakers
      </Heading>
      <TopicClassification topicCallback={setTopic} searchType="Speakers" />
      <Box
        direction="row"
        gap="1%"
        wrap
        // justify="center"
        margin={{ top: "10px" }}
      >
        <MoraFlexibleGrid
          windowWidth={windowWidth}
          gridBreakpoints={[
            { screenSize: 1200, columns: 4 },
            { screenSize: 960, columns: 3 },
            { screenSize: 500, columns: 2 },
          ]}
          gap={10}
          childElements={childElements}
          justify="start"
        />
      </Box>
    </Box>
  );
};

export default AllSpeakersPage;
