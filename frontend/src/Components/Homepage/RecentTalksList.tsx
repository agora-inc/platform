import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import PastTalkCard from "../Talks/PastTalkCard";
import Loading from "../Core/Loading";
import { FormNextLink } from "grommet-icons";
import { Talk, TalkService } from "../../Services/TalkService";
import { User } from "../../Services/UserService";

interface State {
  talks: Talk[];
  loading: boolean;
}

interface Props {
  user: User | null;
}

export default class RecentTalksList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      talks: [],
      loading: true,
    };
  }

  componentWillMount() {
    this.fetchPastTalks();
  }

  fetchPastTalks = () => {
    TalkService.getAvailablePastTalks(
      6,
      0,
      this.props.user ? this.props.user.id : null,
      (data: { count: number; talks: Talk[] }) => {
        this.setState({ talks: data.talks, loading: false });
      }
    );
  };

  render() {
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
          {this.state.talks.map((talk: Talk) => (
            <PastTalkCard talk={talk} user={this.props.user} width={"32%"} />
          ))}
        </Box>
      </Box>
    );
  }
}
