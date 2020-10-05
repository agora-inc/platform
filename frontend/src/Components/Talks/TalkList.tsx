import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Heading, Text } from "grommet";
import TalkCard from "./TalkCard";
import PastTalkCard from "./PastTalkCard";
import { Talk, TalkService } from "../../Services/TalkService";
import { FormNextLink } from "grommet-icons";
import "../../Styles/home.css";
import "../../Styles/see-more-button.css";
import { User } from "../../Services/UserService";
import MediaQuery from "react-responsive";

interface Props {
  gridArea?: string;
  past?: boolean;
  onSave?: any;
  onUnsave?: any;
  talks: Talk[];
  title: boolean;
  seeMore: boolean;
  user: User | null;
}

export default class TalkList extends Component<Props> {
  render() {
    return (
      <Box width="100%">
        <Box
          width="100%"
          direction="column"
          gap="medium"
          align="end"
          margin={{ bottom: "15px" }}
        >
          {this.props.title && (
            <Text size="26px" weight="bold" color="black" margin="none">
              Upcoming talks
            </Text>
          )}
          <MediaQuery minDeviceWidth={992}>
          {this.props.seeMore && (
              <Link to="/upcoming" style={{ textDecoration: "none" }}>
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
                  <Text color="grey">See all </Text>
                  <FormNextLink color="grey" />
                </Box>
              </Link>
          )}
        </MediaQuery>
        </Box>
        <Box gap="small" direction="column" width="100%" height="100%" wrap>
          {this.props.past &&
            this.props.talks.map((talk: Talk) => (
              <PastTalkCard
                talk={talk}
                user={this.props.user}
                onSave={this.props.onSave}
                onUnsave={this.props.onUnsave}
              />
            ))}
          {!this.props.past &&
            this.props.talks.map((talk: Talk) => (
              <TalkCard talk={talk} user={this.props.user} />
            ))}
        </Box>
      </Box>
    );
  }
}
