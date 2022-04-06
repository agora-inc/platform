import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Text, TextInput } from "grommet";
import { Paper, ProfileService } from "../../Services/ProfileService";
import { Edit, Save, Trash } from "grommet-icons";
import { useStore } from "../../store";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  tags: string[];
  home: boolean;
  hasTitle: boolean;
  marginBottom?: string;
}

export const TagsEntry = (props: Props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [tags, setTags] = useState(props.tags);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  const updateTags = async () => {
    if (props.home && user) {
      const token = await getAccessTokenSilently();
      ProfileService.updateTags(user.id, tags, () => {}, token);
    }
  };

  const parse = (str: string) => {
    setTags(str.split(","));
  };

  const marginBottom: string = props.marginBottom ? props.marginBottom : "0px";

  return (
    <Box direction="column" margin={{ bottom: marginBottom }}>
      <Box
        direction="row"
        align="center"
        gap="30px"
        margin={{ bottom: "10px" }}
      >
        {props.hasTitle && (
          <Text size="14px" weight="bold">
            Tags
          </Text>
        )}
        {props.home && !isEdit && (
          <Box
            height="30px"
            pad="5px"
            style={{ border: "1px solid grey" }}
            round="xsmall"
            onClick={() => setIsEdit(!isEdit)}
          >
            <Edit size="20px" />
          </Box>
        )}
        {props.home && isEdit && (
          <Box
            height="30px"
            pad="5px"
            style={{ border: "1px solid grey" }}
            round="xsmall"
            onClick={() => {
              setIsEdit(!isEdit);
              updateTags();
            }}
          >
            <Save size="20px" />
          </Box>
        )}
      </Box>
      {isEdit && (
        <Box direction="column" gap="6px" width="50%">
          <TextInput
            style={{ width: "90%" }}
            placeholder="Tags"
            value={tags.join(",")}
            onChange={(e: any) => parse(e.target.value)}
          />
        </Box>
      )}
      {!isEdit && (
        <Box direction="row" gap="8px" wrap={true} overflow="auto">
          {tags.map((tag: string) => (
            <Box
              height="18px"
              background="#EEEEEE"
              round="xsmall"
              pad="small"
              justify="center"
              margin={{ top: "2px", bottom: "2px" }}
            >
              <Text size="10px" weight="bold">
                {tag}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
