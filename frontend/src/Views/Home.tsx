import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Heading } from "grommet";
import Carousel from "../Components/Carousel";
import RecommendedGrid from "../Components/RecommendedGrid";
import FooterComponent from "../Components/FooterComponent";

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
        <Link to="/videos" style={{ marginTop: 60, marginBottom: 20 }}>
          <Heading style={{ fontSize: 48 }} margin="none">
            Recent videos
          </Heading>
        </Link>
        <RecommendedGrid />
        <FooterComponent />
      </Box>
    );
  }
}
