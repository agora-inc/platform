import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, Text } from "grommet";

import { PastTalkCard } from "../Talks/PastTalkCard";
import { Talk, TalkService } from "../../Services/TalkService";
import { useStore } from "../../store";

export const RecentTalksList: FunctionComponent = () => {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useStore((state) => state.loggedInUser);

  useEffect(() => {
    TalkService.getAvailablePastTalks(
      6,
      0,
      user ? user.id : null,
      (data: { count: number; talks: Talk[] }) => {
        setTalks(talks);
        setLoading(false);
      }
    );
  }, []);

  return (
    <Box width="100%">
      <Box
        width="100%"
        direction="row"
        gap="medium"
        align="end"
        margin={{ bottom: "20px" }}
      >
        <Text size="24px" weight="bold" color="color1" margin="none">
          Recent talks
        </Text>
        {/*
        <Link to="/past" style={{ textDecoration: "none" }}>
          <Box
            className="see-more-button"
            pad={{ vertical: "2px", horizontal: "xsmall" }}
            round="xsmall"
            style={{
              border: "2px solid #C2C2C2",
            }}
            direction="row"
            align="end"
          >      
            <Text color="grey">See all</Text>
            <FormNextLink color="grey" />
          </Box>
        </Link>
        */}
      </Box>
      <Box gap="small" direction="row" width="100%" height="100%" wrap>
        {talks.map((talk: Talk) => (
          <PastTalkCard talk={talk} width={"32%"} />
        ))}
      </Box>
    </Box>
  );
};
