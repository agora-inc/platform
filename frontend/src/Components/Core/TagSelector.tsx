import React, { FunctionComponent, useEffect, useState } from "react";
import { Box } from "grommet";
import { Add } from "grommet-icons";
import { useAuth0 } from "@auth0/auth0-react";

import { Tag, TagService } from "../../Services/TagService";
import Loading from "./Loading";

interface Props {
  onSelectedCallback: any;
  onDeselectedCallback: any;
  selected?: Tag[];
  width: string;
  height: string;
}

export const TagSelector: FunctionComponent<Props> = (props) => {
  const [all, setAll] = useState<Tag[]>([]);
  const [filtered, setFiltered] = useState<Tag[]>([]);
  const [selected, setSelected] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tagBeingCreated, setTagBeingCreated] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    TagService.getAll((tags: Tag[]) => {
      setAll(tags);
    });
  });

  const filterTags = (text: string) => {
    setSearchTerm(text);
    setFiltered(all.filter((t: Tag) => t.name.toLowerCase().includes(text)));
  };

  const onTagClicked = (tag: Tag) => {
    selected.includes(tag) ? deselectTag(tag) : selectTag(tag);
    // console.log(this.state);
  };

  const selectTag = (tag: Tag) => {
    setSelected([...selected, tag]);
    props.onSelectedCallback(tag);
  };

  const deselectTag = (tag: Tag) => {
    setSelected(selected.filter((t: Tag) => t !== tag));
    props.onDeselectedCallback(tag);
  };

  const createNewTag = async (tag: string) => {
    setTagBeingCreated(true);
    const token = await getAccessTokenSilently();
    TagService.createTag(
      tag,
      (allTags: Tag[]) => {
        setAll(allTags);
        setSearchTerm("");
        selectTag(allTags[0]);
        setTagBeingCreated(false);
      },
      token
    );
  };

  const showCreateOption = (tag: string) => {
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
        onClick={() => createNewTag(tag)}
      >
        {tagBeingCreated ? (
          <Loading size={24} color="#61EC9F" />
        ) : (
          <Box direction="row" justify="between" align="center" gap="xsmall">
            {tag} <Add size={"22px"} />
          </Box>
        )}
      </Box>
    );
  };

  const tagsToShow = searchTerm === "" ? all : filtered;
  return (
    <Box width="100%">
      <Box
        direction="row"
        align="center"
        gap="small"
        margin={{ bottom: "small" }}
      >
        {/* <Heading level={4}>Add some tags</Heading> 
          <Search
            placeholder="search..."
            onSearch={(value) => this.filterTags(value)}
            style={{ width: 225 }}
            onChange={(e) => this.filterTags(e.target.value)}
            value={this.state.searchTerm}
          />
          */}
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
          height: props.height,
          width: props.width,
        }}
      >
        {searchTerm !== "" && showCreateOption(searchTerm)}
        {tagsToShow.map((tag) => (
          <Box
            onClick={() => onTagClicked(tag)}
            background={
              selected.some((t) => t["name"] === tag["name"])
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
};
