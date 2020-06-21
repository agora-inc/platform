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
import TreeClassification from "../Components/Homepage/TreeClassification";
import TopicClassification from "../Components/Homepage/TopicClassification";
import GraphClassification from "../Components/Homepage/GraphClassification";
import { Topic } from "../Services/TopicService";

interface State {
  user: User | null;
  talks: Talk[];
  topic: Topic;
}

export default class Home extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: UserService.getCurrentUser(),
      talks: [],
      topic: {field: "-",
              id: -1,
              is_primitive_node: false,
              parent_1_id: -1,
              parent_2_id: -1, 
              parent_3_id: -1}
    };
  } 

  componentWillMount() {
    this.fetchTalks();
  }

  componentWillUpdate() {
    this.fetchTalks();
  }

  fetchTalks = () => {
    TalkService.getAllFutureTalks(6, 0, (talks: Talk[]) => {
      let temp = this.state.topic
      console.log("Before", talks);
      console.log("Topic", temp)
      talks = talks.filter(function (talk: Talk) {
        return talk.topics[0].id === temp.id;
      })
      console.log("After", talks);
      this.setState({ 
        talks: talks
      });
    });
  };

  selectTopic = (temp: Topic) => {
    this.setState({
      topic: temp
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