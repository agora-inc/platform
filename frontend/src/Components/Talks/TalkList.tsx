import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Heading, Text } from "grommet";
import TalkCard from "./TalkCard";
import { Talk, TalkService } from "../../Services/TalkService";
import { FormNextLink } from "grommet-icons";
import "../../Styles/home.css";
import "../../Styles/see-more-button.css";
import { User } from "../../Services/UserService";

interface Props {
  gridArea?: string;
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

  // componentWillMount() {
  //   this.fetchTalks();
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

  render() {
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
          {this.props.talks.map((talk: Talk) => (
            <TalkCard talk={talk} user={this.props.user} />
          ))}
        </Box>
      </Box>
    );
  }
}
