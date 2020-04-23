import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Heading } from "grommet";
import Carousel from "../Components/Carousel";
import ScheduledStreamList from "../Components/ScheduledStreamList";
import RecommendedGrid from "../Components/RecommendedGrid";
import FooterComponent from "../Components/FooterComponent";
import "../Styles/home.css";

export default class Home extends Component {
  render() {
    return (
      <Box
        // fill
        align="center"
        justify="end"
        pad="none"
        margin={{ top: "large", bottom: "none" }}
        // style={{ height: "150vh" }}
      >
        <Carousel />
        <ScheduledStreamList />
        <Link to="/videos" style={{ marginTop: 60, marginBottom: 25 }}>
          <Heading
            style={{ fontSize: 48 }}
            margin="none"
            className="sliding-underline"
          >
            Recent videos
          </Heading>
        </Link>
        <RecommendedGrid />
        <FooterComponent />
      </Box>
    );
  }
}
