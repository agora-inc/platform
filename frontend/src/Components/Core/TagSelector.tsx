import React, { Component } from "react";
import { Box } from "grommet";
import { Tag, TagService } from "../../Services/TagService";
import { Input } from "antd";
import Loading from "./Loading";
import { Add } from "grommet-icons";
const { Search } = Input;

interface State {
  all: Tag[];
  filtered: Tag[];
  selected: Tag[];
  searchTerm: string;
  tagBeingCreated: boolean;
}

interface Props {
  onSelectedCallback: any;
  onDeselectedCallback: any;
  selected?: Tag[];
  width: string;
  height: string;
}

export default class TagSelector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      all: [],
      filtered: [],
      selected: this.props.selected ? this.props.selected : [],
      searchTerm: "",
      tagBeingCreated: false,
    };
  }

  componentWillMount() {
    TagService.getAll((tags: Tag[]) => {
      this.setState({ all: tags });
    });
  }

  filterTags = (text: string) => {
    this.setState({
      searchTerm: text,
      filtered: this.state.all.filter((t) =>
        t.name.toLowerCase().includes(text)
      ),
    });
  };

  onTagClicked = (tag: Tag) => {
    this.state.selected.includes(tag)
      ? this.deselectTag(tag)
      : this.selectTag(tag);
    console.log(this.state);
  };

  selectTag = (tag: Tag) => {
    this.setState({ selected: [...this.state.selected, tag] });
    this.props.onSelectedCallback(tag);
  };

  deselectTag = (tag: Tag) => {
    this.setState({
      selected: this.state.selected.filter(function (t) {
        return t !== tag;
      }),
    });
    this.props.onDeselectedCallback(tag);
  };

  createNewTag = (tag: string) => {
    this.setState({ tagBeingCreated: true }, () => {
      TagService.createTag(tag, (allTags: Tag[]) => {
        this.setState(
          { tagBeingCreated: false, all: allTags, searchTerm: "" },
          () => {
            this.selectTag(this.state.all[0]);
          }
        );
      });
    });
  };

  showCreateOption = (tag: string) => {
    return (
      <Box
        border={{ color: "#61EC9F", size: "small" }}
        align="center"
        justify="center"
        pad={{ horizontal: "medium", vertical: "small" }}
        margin={{ vertical: "xsmall", right: "xsmall", left: "none" }}
        round="medium"
        focusIndicator={false}
        style={{ height: 44 }}
        onClick={() => this.createNewTag(tag)}
      >
        {this.state.tagBeingCreated ? (
          <Loading size={24} color="#61EC9F" />
        ) : (
          <Box direction="row" justify="between" align="center" gap="xsmall">
            {tag} <Add size={"22px"} />
          </Box>
        )}
      </Box>
    );
  };

  render() {
    // console.log("selected:", this.state.selected);
    const tagsToShow =
      this.state.searchTerm === "" ? this.state.all : this.state.filtered;
    return (
      <Box width="100%">
        <Box
          direction="row"
          align="center"
          gap="small"
          margin={{ bottom: "small" }}
        >
          {/* <Heading level={4}>Add some tags</Heading> */}
          <Search
            placeholder="search..."
            onSearch={(value) => this.filterTags(value)}
            style={{ width: 225 }}
            onChange={(e) => this.filterTags(e.target.value)}
            value={this.state.searchTerm}
          />
        </Box>
        <Box
          direction="row"
          wrap
          overflow="scroll"
          margin="none"
          pad="xsmall"
          round="xsmall"
          justify="start"
          width="100%"
          background="rgba(206,254,233,0.3)"
          style={{
            justifySelf: "end",
            height: this.props.height,
            width: this.props.width,
          }}
        >
          {this.state.searchTerm !== "" &&
            this.showCreateOption(this.state.searchTerm)}
          {tagsToShow.map((tag) => (
            <Box
              onClick={() => this.onTagClicked(tag)}
              background={
                this.state.selected.some((t) => t["name"] === tag["name"])
                  ? "#606EEB"
                  : "#f3f3f3"
              }
              align="center"
              justify="center"
              pad={{ horizontal: "medium", vertical: "small" }}
              margin={{ vertical: "xsmall", right: "xsmall", left: "none" }}
              round="medium"
              focusIndicator={false}
              style={{ height: 44 }}
            >
              {tag.name}
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
}
