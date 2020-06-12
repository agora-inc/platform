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

interface State {
  user: User | null;
  talks: Talk[];
}

export default class Home extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: UserService.getCurrentUser(),
      talks: [],
    };
  } 

  componentWillMount() {
    this.fetchTalks();
  }

  fetchTalks = () => {
    TalkService.getAllFutureTalks(6, 0, (talks: Talk[]) => {
      console.log(talks);
      this.setState({ talks });
    });
  };

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
          <TreeClassification />
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
