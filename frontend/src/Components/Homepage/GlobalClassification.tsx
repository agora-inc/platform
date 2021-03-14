import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Text } from "grommet";
import { Talk, TalkService } from "../../Services/TalkService";
import { FormNextLink } from "grommet-icons";
import "../../Styles/home.css";
import "../../Styles/see-more-button.css";
import "../../Styles/topic-talks-list.css";
import { User } from "../../Services/UserService";
import { Topic, TopicService } from "../../Services/TopicService";
import TopicClassification from "../../Components/Homepage/TopicClassification";
import MediaQuery from "react-responsive";

interface Props {
  user: User | null;
}

interface State {
  allTalks: Talk[];
  chosenTalks: Talk[];
  allTopics: Topic[];
  chosenTopic: Topic;
  audienceLevel: string[];
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
      audienceLevel: []
    };
  }

  componentWillMount() {
    TopicService.getAll((allTopics: Topic[]) => {
      this.setState({ allTopics: allTopics });
    });
    
    TalkService.getAvailableFutureTalks(
      50, 
      0, 
      this.props.user ? this.props.user.id : null,  
      (allTalks: Talk[]) => {
      this.setState({
        allTalks: allTalks,
        chosenTalks: allTalks,
      });
    });
  }

  filterChosenTalksByAudience = () => {
    let filteredTopics = []
    for (let talk of this.state.allTalks) {
      if (this.state.audienceLevel.includes(talk.audience_level)) {
        filteredTopics.push(talk);
      }
    };
    this.setState({chosenTalks: filteredTopics});
  };

  getTalksByTopicsAndAudience = (talks: Talk[], topicsId: number[]): Talk[] => {
    let res: Talk[] = [];
    for (let talk of talks) {
      let isIn: boolean = false;
      for (let topic of talk.topics) {
        if ((!isIn && topicsId.includes(topic.id)) && 
        this.state.audienceLevel.includes(talk.audience_level))  {
          isIn = true;
          res.push(talk);
        }
      }
    }
    return res;
  };

  getTalksByAudience = (talks: Talk[]): Talk[] => {
    let res: Talk[] = [];
    for (let talk of talks) {
      let isIn: boolean = false;
      if (this.state.audienceLevel.includes(talk.audience_level)) {
          res.push(talk);
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
        chosenTalks: this.getTalksByTopicsAndAudience(this.state.allTalks, childrenId),
      });
    } else {
      this.setState({
        chosenTalks: this.getTalksByAudience(this.state.allTalks)
      });
    }
    // this.filterChosenTalksByAudience();
  };

  selectTopic = (temp: Topic) => {
    this.setState({
      chosenTopic: temp,
    });
    this.fetchTalksByTopicWithChildren(temp);
  };

  render() {
    return (
      <Box 
        width="90%" 
        margin={{"bottom": "50px"}}
        background="#DDDDDD"
      >
  
        <TopicClassification 
          topicCallback={this.selectTopic}
          searchType={"Talks"} 
        />


      </Box>
    );
  }
}