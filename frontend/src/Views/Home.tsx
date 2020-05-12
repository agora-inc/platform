import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text, Grid } from "grommet";
import Carousel from "../Components/Carousel";
import TrendingChannelsBox from "../Components/TrendingChannelsBox";
import PopularTagsBox from "../Components/PopularTagsBox";
import ScheduledStreamList from "../Components/ScheduledStreamList";
import RecommendedGrid from "../Components/RecommendedGrid";
import FooterComponent from "../Components/FooterComponent";
import "../Styles/home.css";

export default class Home extends Component {
  render() {
    return (
      <Box align="center" className="fadein">
        <Grid
          margin={{ top: "xlarge" }}
          rows={["homeRow1", "homeRow2", "homeRow3"]}
          columns={["homeColumn1", "homeColumn2"]}
          gap="40px"
          areas={[
            { name: "trendingChannels", start: [0, 0], end: [0, 1] },
            { name: "carousel", start: [1, 0], end: [1, 0] },
            { name: "popularTags", start: [0, 2], end: [0, 2] },
            { name: "scheduledStreams", start: [1, 1], end: [1, 2] },
          ]}
        >
          <TrendingChannelsBox gridArea="trendingChannels" />
          <Carousel gridArea="carousel" />
          <PopularTagsBox gridArea="popularTags" />
          <ScheduledStreamList gridArea="scheduledStreams" title={true} />
        </Grid>
        <RecommendedGrid />
        <FooterComponent />
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
