import React, { Component, useEffect, useState } from "react";
import { Box, Text, Heading } from "grommet";
import { Talk, TalkService } from "../Services/TalkService";
import { User, UserService } from "../Services/UserService";
import TalkList from "../Components/Talks/TalkList";
import Loading from "../Components/Core/Loading";
import { useStore } from "../store";
import { useAuth0 } from "@auth0/auth0-react";

export const Schedule = () => {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchTalks();
  });

  const fetchTalks = async () => {
    const token = await getAccessTokenSilently();
    user &&
      TalkService.getRegisteredTalksForUser(
        user.id,
        (talks: Talk[]) => {
          setTalks(talks);
          setLoading(false);
        },
        token
      );
  };

  return (
    <Box
      pad={{ top: "10vh", bottom: "100px" }}
      width="100vw"
      height="100vh"
      align="center"
    >
      <Box margin={{ left: "2.5%" }} width="90%">
        <Box margin={{ bottom: "30px" }}>
          <Heading
            color="black"
            size="24px"
            margin="none"
            style={{ height: "20px" }}
          >
            Personal schedule
          </Heading>
        </Box>

        <Box
          width="553px"
          height="50px"
          background="#F3EACE"
          round="xsmall"
          pad="small"
          // gap="xsmall"
        >
          <Box direction="row" align="center" gap="xsmall">
            <Text> Currently registered for</Text>
            <Box
              height="25px"
              width="25px"
              round="12.5px"
              justify="center"
              align="center"
              background="lightgray"
            >
              <Text weight="bold">{talks.length}</Text>
            </Box>
            <Text> talks</Text>
          </Box>
        </Box>
        {loading && (
          <Box width="100%" align="center" margin={{ top: "200px" }}>
            <Loading size={50} color="black" />
          </Box>
        )}
        <TalkList seeMore={false} talks={talks} title={false} />
      </Box>
    </Box>
  );
};
