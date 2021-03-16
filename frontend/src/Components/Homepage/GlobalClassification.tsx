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
  chosenSubtopics: Topic[];
  audienceLevel: string[];
  allAudienceLevels: string[];
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
      chosenSubtopics: [],
      audienceLevel: [],
      allAudienceLevels: ["General audience", "Bachelor / Master", "PhD+"],
    };
  }

  componentWillMount() {
    TopicService.getAll((allTopics: Topic[]) => {
      this.setState({ allTopics });
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

  getPrimitiveNodes = () => {
    return this.state.allTopics
      .filter(function (topic: any) {
        return topic.is_primitive_node;
      });
  };

  getChildren = (topic: Topic) => {
    return this.state.allTopics
      .filter(function (temp: Topic) {
        return (
          temp.parent_1_id == topic.id ||
          temp.parent_2_id == topic.id ||
          temp.parent_3_id == topic.id
        );
      });
  };
  
  getIdTopicsToFetch = () => {
    if (this.state.chosenTopic.field === "-") {
      this.state.allTopics.map(topic => topic.id)
    } else if (this.state.chosenSubtopics === []) {
      this.getChildren(this.state.chosenTopic).map(topic => topic.id)
    } else {
      return this.state.chosenSubtopics.map(topic => topic.id)
    }
  }

  selectTopic = (temp: Topic) => {
    this.setState({
      chosenTopic: temp,
    });
    this.fetchTalksByTopicWithChildren(temp);
  };

  updateAudienceLevel = (txt: string) => {
    if (this.state.audienceLevel.includes(txt)) {
      this.setState(prevState => ({
        audienceLevel: prevState.audienceLevel.filter(e => e != txt)
      }))
    } else {
      this.setState(prevState => ({
        audienceLevel: prevState.audienceLevel.concat(txt)
      }))
    }
  }

  updateSubtopics = (topic: Topic) => {
    if (this.state.chosenSubtopics.includes(topic)) {
      this.setState(prevState => ({
        chosenSubtopics: prevState.chosenSubtopics.filter(e => e != topic)
      }))
    } else {
      this.setState(prevState => ({
        chosenSubtopics: prevState.chosenSubtopics.concat(topic)
      }))
    }
  }


  render() {
    return (
      <Box 
        width="97.5%" 
        margin={{"bottom": "50px", "left": "5px"}}
        background="#EEEEEE"
        direction="row"
        pad="12px"
        round="xsmall"
      >
        <Box direction="column" width="34%">
          <Text size="12px" weight="bold" margin={{bottom: "10px"}}> 
            Topic
          </Text>
          {this.getPrimitiveNodes().map((topic: Topic) =>
            <Box
              onClick={() => {this.setState({chosenTopic: topic})}}
              background={this.state.chosenTopic === topic ? "#E0E0E0" : "white"} 
              round="xsmall"
              pad="4px"
              width="60%"
              justify="center"
              align="center"
              focusIndicator={false}
              margin="3px"
              hoverIndicator={false}
            >
              {this.state.chosenTopic === topic && (
                <Text weight="bold" size="small">
                  {topic.field}
                </Text>)
              }
              {this.state.chosenTopic !== topic && (
                <Text size="small">
                  {topic.field}
                </Text>)
              }
            </Box>
          )}
        </Box> 

        <Box direction="column" width="34%">
          <Text size="12px" weight="bold" margin={{bottom: "10px"}}> 
            Sub-topic
          </Text>
          {this.state.chosenTopic.field === "-" && (
            <Text size="13px" style={{fontStyle: "italic"}}> 
              Select a topic to display its subtopics 
            </Text>
          )}
          {this.state.chosenTopic.field !== "-" && (
            this.getChildren(this.state.chosenTopic).map((topic: Topic) =>
              <Box
                onClick={() => {this.updateSubtopics(topic)}}
                background={this.state.chosenTopic === topic ? "#E0E0E0" : "white"} 
                round="xsmall"
                pad="4px"
                width="60%"
                justify="center"
                align="center"
                focusIndicator={false}
                margin="3px"
                hoverIndicator={false}
              >
                {this.state.chosenSubtopics.includes(topic) && (
                  <Text weight="bold" size="small">
                    {topic.field}
                  </Text>)
                }
                {!this.state.chosenSubtopics.includes(topic) && (
                  <Text size="small">
                    {topic.field}
                  </Text>)
                }
              </Box>
            )
          )}

        </Box> 

        <Box direction="column" width="32.5%">
          <Text size="12px" weight="bold" margin={{bottom: "10px"}}> 
            Audience level  
          </Text>
          {this.state.allAudienceLevels.map((txt: string) =>
            <Box
              onClick={() => {this.updateAudienceLevel(txt)}}
              background={this.state.chosenTopic.field === txt ? "#E0E0E0" : "white"} 
              round="xsmall"
              pad="4px"
              width="60%"
              justify="center"
              align="center"
              focusIndicator={false}
              margin="3px"
              hoverIndicator={false}
            >
              {this.state.audienceLevel.includes(txt) && (
                <Text weight="bold" size="small">
                  {txt}
                </Text>)
              }
              {!this.state.audienceLevel.includes(txt) && (
                <Text size="small">
                  {txt}
                </Text>)
              }
            </Box>
          )}
        </Box> 



      </Box>
    );
  }
}


{/*
<TopicClassification 
topicCallback={this.selectTopic}
searchType={"Talks"} 
/> */}