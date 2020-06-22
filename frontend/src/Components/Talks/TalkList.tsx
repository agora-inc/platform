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
import SignUpButton from "../Account/SignUpButton";

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

// interface State {
//   loading: boolean;
//   talks: Talk[];
// }

export default class TalkList extends Component<Props> {
  // constructor(props: Props) {
  //   super(props);
  //   this.state = {
  //     loading: true,
  //     talks: [],
  //   };
  // }

  // fetchTalks = () => {
  //   TalkService.getAllTalks(
  //     6,
  //     0,
  //     (talks: Talk[]) => {
  //       console.log(talks);
  //       this.setState({ talks, loading: false });
  //     }
  //   );
  // };

  ifTalks() {
    return (
      <Box width="100%">
        <Box
          width="100%"
          direction="row"
          gap="xsmall"
          align="end"
          margin={{ bottom: "15px" }}
        >
          {this.props.title && (
            <Text size="26px" weight="bold" color="black" margin="none">
              Upcoming talks
            </Text>
          )}
          {this.props.seeMore && (
            <Link to="/upcoming" style={{ textDecoration: "none" }}>
              <Box
                className="see-more-button"
                pad={{ vertical: "2px", horizontal: "xsmall" }}
                round="xsmall"
                style={{ border: "2px solid black" }}
                direction="row"
                align="end"
              >
                <Text color="black">See more</Text>
                <FormNextLink color="black" />
              </Box>
            </Link>
          )}
        </Box>
        <Box gap="small" direction="row" width="100%" height="100%" wrap>
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

  ifNoTalks = () => {
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
          No talk of that category exist.
        </Text>
        <Box
          background="white"
          justify="center"
          align="center"
          style={{ border: "solid black 2px" }}
          round="xsmall"
          pad="xsmall"
        >
          {!this.props.user && (
            <Text>
              tttt
            </Text>
            
          )}

          {this.props.user && (
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
                Create the first Agora
              </Text>
            </Link>
          )}
        </Box>
      </Box>
    );
  };

  render() {
    return (
      <Box>
      {this.props.talks.length === 0
        ? this.ifNoTalks()
        : this.ifTalks()}
      </Box>
    );
  }
}
