import React, { Component } from "react";
import { Box, Text } from "grommet";
import { Tag } from "../Services/TagService";
import "../Styles/popular-tags-box.css";

interface Props {
  gridArea: string;
}

interface State {
  tags: string[];
}

export default class PopularTagsBox extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tags: [],
    };
  }

  componentWillMount() {
    const tags = [
      "Maths",
      "Bioengineering",
      "Computing",
      "Physics",
      "Machine Learning",
    ];
    this.setState({ tags });
  }

  render() {
    return (
      <Box
        pad={{ horizontal: "40px", top: "20px" }}
        width="100%"
        height="100%"
        round="15px"
        className="popular-tags-box"
        gridArea={this.props.gridArea}
      >
        <Text size="32px" weight="bold" color="black" margin="none">
          Popular Tags
        </Text>
        <Box direction="row" wrap margin={{ top: "20px" }} gap="small">
          {this.state.tags.map((tag: string) => (
            <Box
              background="white"
              pad={{ horizontal: "medium" }}
              height="30px"
              round="medium"
              justify="center"
              align="center"
              margin={{ bottom: "small" }}
            >
              <Text size="16px" weight="bold" color="black">
                {tag}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
}
