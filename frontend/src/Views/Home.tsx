import React, { Component } from "react";
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
        <Heading style={{ fontSize: 48, marginTop: 60 }}>Recent videos</Heading>
        <RecommendedGrid />
        <FooterComponent />
      </Box>
    );
  }
}
