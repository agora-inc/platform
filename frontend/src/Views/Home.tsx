import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text, Grid, Sidebar } from "grommet";
import CustomSideBar from "../Components/Homepage/CustomSideBar";
import Carousel from "../Components/Homepage/Carousel";
import PopularTagsBox from "../Components/Homepage/PopularTagsBox";
import TalkList from "../Components/Talks/TalkList";
import RecommendedGrid from "../Components/Homepage/RecommendedGrid";
import RecentTalksList from "../Components/Homepage/RecentTalksList";
import FooterComponent from "../Components/Homepage/FooterComponent";
import "../Styles/home.css";
import { User, UserService } from "../Services/UserService";
import { Talk, TalkService } from "../Services/TalkService";
import { Topic, TopicService } from "../Services/TopicService";
import TreeClassification from "../Components/Homepage/TreeClassification";
import TopicClassification from "../Components/Homepage/TopicClassification";
import GraphClassification from "../Components/Homepage/GraphClassification";

interface State {
  user: User | null;
  talks: Talk[];
  topics: Topic[];
  chosenTopic: Topic;
}

export default class Home extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: UserService.getCurrentUser(),
      talks: [],
      topics: [],
      chosenTopic: {
        field: "-",
        id: -1,
        is_primitive_node: false,
        parent_1_id: -1,
        parent_2_id: -1, 
        parent_3_id: -1
      }
    };
  } 

  componentWillMount() {
    this.fetchTalks();
  }

  componentWillUpdate() {
    this.fetchTalks();
  }

  fetchTalksByTopicWithChildren = () => {
    let listTalks: Talk[] = []
    TalkService.getAllFutureTalks(6, 0, (talks: Talk[]) => {
      listTalks = talks
    });
    if (this.state.chosenTopic.id == -1) {
      this.setState({ 
        talks: listTalks
      });
    } else {
      TopicService.getAll((allTopics: Topic[]) => {
        this.setState({ topics: allTopics });
      });


    }

  }

  fetchTalks = () => {
    if (this.state.chosenTopic.id == -1) {
      TalkService.getAllFutureTalks(6, 0, (talks: Talk[]) => {
        this.setState({ 
          talks: talks
        });
      });
    } else {
      TalkService.getAllFutureTalksForTopicWithChildren(6, 0, this.state.chosenTopic.id, (talks: Talk[]) => {
        this.setState({ 
          talks: talks
        });
      });
    }
  };

  selectTopic = (temp: Topic) => {
    this.setState({
      chosenTopic: temp
    });
  }

  render() {
    return (
      <Box direction="row">
        <CustomSideBar user={this.state.user} />
        <Box
          width="80%"
          height="100%"
          overflow="hidden"
          pad="medium"
          margin={{ top: "60px" }}
          style={{ overflowY: "scroll" }}
          gap="25px"
        >
          <Carousel gridArea="carousel" />
          <TopicClassification topicCallback={this.selectTopic} />
          <TalkList
            talks={this.state.talks}
            title
            seeMore
            user={this.state.user}
          />
          <RecentTalksList user={this.state.user} />
          {/* <RecommendedGrid /> */}
        </Box>
      </Box>
    );
  }
}

// <TreeClassification />