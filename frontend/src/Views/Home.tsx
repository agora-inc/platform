import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text, Grid, Sidebar } from "grommet";
import CustomSideBar from "../Components/Homepage/CustomSideBar";
import Carousel from "../Components/Homepage/Carousel";
import PopularTagsBox from "../Components/Homepage/PopularTagsBox";
import ScheduledStreamList from "../Components/ScheduledStreams/ScheduledStreamList";
import RecommendedGrid from "../Components/Homepage/RecommendedGrid";
import RecentTalksList from "../Components/Homepage/RecentTalksList";
import FooterComponent from "../Components/Homepage/FooterComponent";
import "../Styles/home.css";
import { User, UserService } from "../Services/UserService";
import {
  ScheduledStream,
  ScheduledStreamService,
} from "../Services/ScheduledStreamService";

interface State {
  user: User | null;
  scheduledStreams: ScheduledStream[];
}

export default class Home extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: UserService.getCurrentUser(),
      scheduledStreams: [],
    };
  }

  componentWillMount() {
    this.fetchScheduledStreams();
  }

  fetchScheduledStreams = () => {
    ScheduledStreamService.getAllFutureScheduledStreams(
      6,
      0,
      (scheduledStreams: ScheduledStream[]) => {
        console.log(scheduledStreams);
        this.setState({ scheduledStreams });
      }
    );
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
          <ScheduledStreamList
            scheduledStreams={this.state.scheduledStreams}
            title
            seeMore
            user={this.state.user}
          />
          <RecentTalksList />
          {/* <RecommendedGrid /> */}
        </Box>
      </Box>
    );
  }
}
