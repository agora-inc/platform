import React, { Component, FunctionComponent, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import { Talk, TalkService } from "../../Services/TalkService";
import { TalkCard } from "../Talks/TalkCard";
import { User, UserService } from "../../Services/UserService";
import TrendingTalksList from "../../Components/Homepage/TrendingTalksList";
import { useStore } from "../../store";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  gridArea: string;
}

export const Carousel: FunctionComponent<Props> = (props) => {
  const [talks, setTalks] = useState<Talk[]>([]);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  const getTalks = async () => {
    const token = await getAccessTokenSilently();
    TalkService.getAllCurrentTalks(
      3,
      0,
      (data: { talks: Talk[]; count: number }) => {
        setTalks(data.talks);
      }
    );
  };

  const ifNoStreams = () => {
    return (
      <Box
        direction="row"
        width="100%"
        margin="none"
        pad="small"
        justify="between"
        round="xsmall"
        align="center"
        alignSelf="center"
        background="rgba(96, 110, 235, 0.7)"
      >
        <Text size="20px" weight="bold" color="black">
          No public talks happening right now
        </Text>
        <Box
          background="white"
          justify="center"
          align="center"
          style={{ border: "solid black 2px" }}
          round="xsmall"
          pad="xsmall"
        >
          <Link
            to="/past"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text size="16px" weight="bold" color="black">
              Explore previous talks
            </Text>
          </Link>
        </Box>
      </Box>
    );
  };

  const ifStreams = () => {
    return (
      <Box width="100%" margin={{ bottom: "20px" }}>
        <Text size="26px" weight="bold" color="color1" margin="none">
          Happening now
        </Text>
        <Box
          direction="row"
          gap="1.5%"
          width="100%"
          height="100%"
          margin={{ top: "10px" }}
        >
          {talks.map((talk: Talk) => (
            <TalkCard talk={talk} width="31.5%" isCurrent={true} />
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box align="start" margin={{ bottom: "20px" }}>
        <TrendingTalksList />
      </Box>
      <Box
      // width="100%"
      // height="100%"
      // gridArea={this.props.gridArea}
      // margin={{ top: "60px" }}
      >
        {talks.length != 0 && ifStreams()}
      </Box>
    </>
  );
};
