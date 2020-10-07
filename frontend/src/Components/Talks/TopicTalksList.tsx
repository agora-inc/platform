import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import TalkCard from "./TalkCard";
import PastTalkCard from "./PastTalkCard";
import { Talk, TalkService } from "../../Services/TalkService";
import { FormNextLink } from "grommet-icons";
import "../../Styles/home.css";
import "../../Styles/see-more-button.css";
import { User } from "../../Services/UserService";
import { Topic, TopicService } from "../../Services/TopicService";
import TopicClassification from "../../Components/Homepage/TopicClassification";

interface Props {
  gridArea?: string;
  past?: boolean;
  onSave?: any;
  onUnsave?: any;
  seeMore: boolean;
  title: boolean;
  topicSearch: boolean;
  user: User | null;
}

interface State {
  allTalks: Talk[];
  chosenTalks: Talk[];
  allTopics: Topic[];
  chosenTopic: Topic;
}

export default class TopicTalkList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      allTalks: [],
      chosenTalks: [],
      allTopics: [],
      chosenTopic: {
        field: "-",
        id: -1,
        is_primitive_node: false,
        parent_1_id: -1,
        parent_2_id: -1,
        parent_3_id: -1,
      },
    };
  }

  componentWillMount() {
    if (this.props.topicSearch) {
      TopicService.getAll((allTopics: Topic[]) => {
        this.setState({ allTopics: allTopics });
      });
    }

    // Limit to 1000 talks
    /*
    TalkService.getAllFutureTalks(1000, 0, (allTalks: Talk[]) => {
      this.setState({
        allTalks: allTalks,
        chosenTalks: allTalks,
      });
    });
    */
    
    TalkService.getAvailableFutureTalks(50, 0, this.props.user ? this.props.user.id : null, (allTalks: Talk[]) => {
      this.setState({
        allTalks: allTalks,
        chosenTalks: allTalks,
      });
    });
  }

  getTalksByTopics = (talks: Talk[], topicsId: number[]): Talk[] => {
    let res: Talk[] = [];
    for (let talk of talks) {
      let isIn: boolean = false;
      for (let topic of talk.topics) {
        if (!isIn && topicsId.includes(topic.id)) {
          isIn = true;
          res.push(talk);
        }
      }
    }
    return res;
  };

  fetchTalksByTopicWithChildren = (topic: Topic) => {
    if (topic.id >= 0) {
      let childrenId = TopicService.getDescendenceId(
        topic,
        this.state.allTopics
      );
      childrenId.push(topic.id);
      this.setState({
        chosenTalks: this.getTalksByTopics(this.state.allTalks, childrenId),
      });
    } else {
      this.setState({
        chosenTalks: this.state.allTalks,
      });
    }
  };

  selectTopic = (temp: Topic) => {
    this.setState({
      chosenTopic: temp,
    });
    this.fetchTalksByTopicWithChildren(temp);
  };

  ifTalks = () => {
    return (
      <Box
        width="100%"
        gap="small"
        direction="row"
        height="100%"
        wrap
        margin="none"
      >
        {this.props.past &&
          this.state.chosenTalks.map((talk: Talk) => (
            <PastTalkCard
              talk={talk}
              user={this.props.user}
              onSave={this.props.onSave}
              onUnsave={this.props.onUnsave}
            />
          ))}
        {!this.props.past &&
          this.state.chosenTalks.map((talk: Talk) => (
            <TalkCard talk={talk} user={this.props.user} />
          ))}
      </Box>
    );
  };

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
        background="#F3EACE"
      >
        <Text size="18px" weight="bold" color="grey">
          There are no talks in that category
        </Text>
      </Box>
    );
  };

  render() {
    return (
      <Box width="100%" margin={{"bottom": "100px"}}>
        <Box
          width="100%"
          direction="row"
          gap="medium"
          align="end"
          margin={{ bottom: "36px" }}
        >
          {this.props.title && (
            <Text size="26px" weight="bold" color="black" margin="none">
              Upcoming talks
            </Text>
          )}
          {/*this.props.seeMore && (
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
              )*/}
        </Box>

        {this.props.topicSearch && (
          <TopicClassification topicCallback={this.selectTopic} />
        )}

        {this.state.chosenTalks.length === 0
          ? this.ifNoTalks()
          : this.ifTalks()}
      </Box>
    );
  }
}
