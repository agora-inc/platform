import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text, Grid, Sidebar } from "grommet";
import CustomSideBar from "../Components/CustomSideBar";
import Carousel from "../Components/Carousel";
import PopularTagsBox from "../Components/PopularTagsBox";
import ScheduledStreamList from "../Components/ScheduledStreamList";
import RecommendedGrid from "../Components/RecommendedGrid";
import FooterComponent from "../Components/FooterComponent";
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
    ScheduledStreamService.getAllScheduledStreams(
      6,
      0,
      (scheduledStreams: ScheduledStream[]) => {
        console.log(scheduledStreams);
        this.setState({ scheduledStreams });
      }
    );
  };

  render() {
    console.log(new Date().toUTCString());
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
          <RecommendedGrid />
          {/* <FooterComponent /> */}
        </Box>
      </Box>
      // <Box
      //   // fill
      //   align="center"
      //   justify="end"
      //   pad="none"
      //   margin={{ top: "large", bottom: "none" }}
      //   // style={{ height: "150vh" }}
      // >
      //   <Link to="/streams" style={{ marginTop: 60, marginBottom: 25 }}>
      //     <Heading
      //       style={{ fontSize: 48 }}
      //       margin="none"
      //       className="sliding-underline"
      //     >
      //       Currently live
      //     </Heading>
      //   </Link>
      //   <Carousel />
      //   <ScheduledStreamList />
      //   <Link to="/videos" style={{ marginTop: 60, marginBottom: 25 }}>
      //     <Heading
      //       style={{ fontSize: 48 }}
      //       margin="none"
      //       className="sliding-underline"
      //     >
      //       Recent videos
      //     </Heading>
      //   </Link>
      //   <RecommendedGrid />
      //   <TrendingChannelsBox />
      //   <PopularTagsBox />
      //   <FooterComponent />
      // </Box>
    );
  }
}
