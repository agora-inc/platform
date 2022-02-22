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

  // componentDidUpdate(prevProps: {}) {
  //   this.updateResponsiveSettings();
  // }

  // componentWillMount() {
  //   // Limit to 1000 talks
  //   TalkService.getAllFutureTalks(100, 0, (allTalks: Talk[]) => {
  //     this.setState({
  //       allTalks: allTalks,
  //       chosenTalks: allTalks
  //     });
  //   });
  //   TopicService.getAll((allTopics: Topic[]) => {
  //     this.setState({ allTopics: allTopics });
  //   });

  //   this.fetchTalks();
  // }

  // componentWillUpdate() {
  //   this.fetchTalks();
  // }

  // fetchTalks = () => {
  //   if (this.state.chosenTopic.id == -1) {
  //     TalkService.getAllFutureTalks(6, 0, (talks: Talk[]) => {
  //       this.setState({
  //         allTalks: talks
  //       });
  //     });
  //   } else {
  //     TalkService.getAllFutureTalksForTopicWithChildren(6, 0, this.state.chosenTopic.id, (talks: Talk[]) => {
  //       this.setState({
  //         allTalks: talks
  //       });
  //     });
  //   }
  // };

  render() {
    return (
      <Box direction="row" justify="center">
        {/* Only show side-bar for desktop */}
        {/*<MediaQuery minDeviceWidth={992}>
          <CustomSideBar user={this.state.user} />
          </MediaQuery>*/}

        {/* <Box
          width="80%"
          height="100%"
          overflow="hidden"
          pad="medium"
          margin={{ top: "60px" }}
          style={{ overflowY: "scroll" }}
          gap="25px"
        > */}
        {/* <video
          autoPlay loop muted id="background-landing"
          style={{ height: "auto", width: "auto", minWidth: "100%", minHeight: "100%" }}
        >
          <source src="https://video.wixstatic.com/video/9b9d14_37244669d1c749ab8d1bf8b15762c61a/720p/mp4/file.mp4" type="video/mp4"/>
        </video>
         */}
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
          direction="column"
          style={{
            maxWidth: "1200px",
            padding: this.state.isMobile ? "20px 50px" : "120px 50px",
          }}
        >
          <Carousel gridArea="carousel" />
          {/*<TreeClassification />*/}
          <TopicTalkList
            seeMore={true}
            title={true}
            topicSearch={true}
            user={this.state.user}
          />
          {/*<MediaQuery minDeviceWidth={992}>
              <RecentTalksList user={this.state.user} />
      </MediaQuery> */}
          {/* <RecommendedGrid /> */}
          <FooterComponent />
        </Box>
        {/* </Box> */}
      </Box>
    );
  }
}
