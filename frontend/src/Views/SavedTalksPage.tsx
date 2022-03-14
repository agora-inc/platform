import React, { Component, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Box, Text, Heading } from "grommet";
import { Talk, TalkService } from "../Services/TalkService";
import { User, UserService } from "../Services/UserService";
import Loading from "../Components/Core/Loading";
import TalkList from "../Components/Talks/TalkList";
import { useStore } from "../store";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  location: { state: { user: User } };
}

export const SavedTalksPage = (props: Props) => {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchTalks();
  }, []);

  const fetchTalks = async () => {
    const token = await getAccessTokenSilently();
    user &&
      TalkService.getSavedTalksForUser(
        user.id,
        (talks: Talk[]) => {
          setTalks(talks);
          setLoading(false);
        },
        token
      );
  };

  return user === null ? (
    <Redirect to="/" />
  ) : (
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
            size="16px"
            margin="none"
            style={{ height: "20px" }}
          >
            Bookmarks
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
            <Text size="14px">You have</Text>
            <Box
              height="25px"
              width="25px"
              round="12.5px"
              justify="center"
              align="center"
              background="lightgray"
            >
              <Text weight="bold" size="14px">
                {talks.length}
              </Text>
            </Box>
            <Text size="14px">saved talks</Text>
          </Box>
        </Box>
        {loading && (
          <Box width="100%" align="center" margin={{ top: "200px" }}>
            <Loading size={50} color="black" />
          </Box>
        )}
        <TalkList
          past
          seeMore={false}
          talks={talks}
          title={false}
          onUnsave={fetchTalks}
        />
      </Box>
    </Box>
  );
};
