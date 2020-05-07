import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import Loading from "./Loading";
import { Tag, TagService } from "../Services/TagService";
import "../Styles/popular-tags-box.css";

interface Props {
  gridArea: string;
}

interface State {
  tags: Tag[];
  loading: boolean;
}

export default class PopularTagsBox extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tags: [],
      loading: true,
    };
  }

  componentWillMount() {
    TagService.getPopular((tags: Tag[]) => {
      this.setState({ tags: tags, loading: false });
    });
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
        {this.state.loading && (
          <Box width="100%" height="80%" justify="center" align="center">
            <Loading color="black" size={50} />
          </Box>
        )}
        <Box direction="row" wrap margin={{ top: "20px" }} gap="small">
          {this.state.tags.map((tag: Tag) => (
            <Link to={`/tag/${tag.name}`} style={{ textDecoration: "none" }}>
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
                  {tag.name}
                </Text>
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    );
  }
}
