import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text, Grid, Sidebar, DropButton, Layer } from "grommet";
import { FormNext } from "grommet-icons";
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
import TopicTalkList from "../Components/Talks/TopicTalksList";
import TreeClassification from "../Components/Homepage/TreeClassification";
import MediaQuery from "react-responsive";

interface State {
  user: User | null;
  allTalks: Talk[];
  chosenTalks: Talk[];
  allTopics: Topic[];
  chosenTopic: Topic;
  isMobile: boolean;
  isSmallScreen: boolean;
  windowWidth: number;
}

export default class Home extends Component<{}, State> {
  private smallScreenBreakpoint: number;
  private mobileScreenBreakpoint: number;
  constructor(props: any) {
    super(props);
    this.mobileScreenBreakpoint = 992;
    this.smallScreenBreakpoint = 480;

    this.state = {
      user: UserService.getCurrentUser(),
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
      isMobile: window.innerWidth < this.mobileScreenBreakpoint,
      isSmallScreen: window.innerWidth < this.smallScreenBreakpoint,
      windowWidth: window.innerWidth,
    };
  }

  updateResponsiveSettings = () => {
    this.setState({
      isMobile: window.innerWidth < this.mobileScreenBreakpoint,
      isSmallScreen: window.innerWidth < this.smallScreenBreakpoint,
      windowWidth: window.innerWidth,
    });
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateResponsiveSettings);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateResponsiveSettings);
  }

  render() {
    let windowWidth = this.state.windowWidth;
    return (
      <>
        <img
          style={{
            height: "auto",
            width: "auto",
            minWidth: "100%",
            minHeight: "100%",
          }}
          id="background-landing"
          src="https://i.postimg.cc/RhmJmzM3/mora-social-media-cover-bad6db.jpg"
        />
        <Box
          pad={{ top: "10vh", bottom: "100px" }}
          align="start"
          style={{ overflowY: "auto" }}
          margin={{ left: "8%", right: "8%" }}
        >
          <Carousel gridArea="carousel" />
          {/*<TreeClassification />*/}
          <TopicTalkList
            seeMore={true}
            title={true}
            topicSearch={true}
            user={this.state.user}
            windowWidth={this.state.windowWidth}
          />
          {/*<MediaQuery minDeviceWidth={992}>
              <RecentTalksList user={this.state.user} />
      </MediaQuery> */}
          {/* <RecommendedGrid /> */}
          <FooterComponent />
        </Box>
        {/* </Box> */}
      </>
    );
  }
}
