import React, { useState, useEffect } from "react";
import { Box, Heading, Text } from "grommet";
import { ProfileCard } from "../Components/Profile/ProfileCard";
import TopicClassification from "../Components/Homepage/TopicClassification";
import { Topic } from "../Services/TopicService";
import { Profile, ProfileService } from "../Services/ProfileService";
import "../Styles/all-profiles-page.css";

const AllSpeakersPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [topic, setTopic] = useState<Topic>();

  useEffect(() => {
    if (topic && topic.id > 0) {
      ProfileService.getPublicProfilesByTopicRecursive(topic.id, 50, 0, setProfiles)
    } else {
      ProfileService.getAllPublicProfiles(50, 0, setProfiles);
    }
  }, [topic]);

  return (
    <Box 
      width="90%" 
      margin={{ left: "2.5%", top: "6vw" }}
      gap="30px"
    >
      <Heading
        color="color1"
        size="24px"
        margin="none"
        style={{ height: "20px" }}
      >
        All speakers
      </Heading>
      <TopicClassification 
        topicCallback={setTopic}
        searchType="Speakers"
      />
      <Box
        direction="row"
        gap="1%"
        wrap
        // justify="center"
        margin={{ top: "10px" }}
      >
        {profiles.map((profile: Profile) => (
          <ProfileCard profile={profile} width="24%" />
        ))}
      </Box>
    </Box>
  );
};

export default AllSpeakersPage;