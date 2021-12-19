import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Text, TextInput } from "grommet";
import { Paper, ProfileService } from "../../Services/ProfileService";
import { Edit, Save, Trash } from "grommet-icons";


interface Props {
  tags: string[];
  home: boolean;
  userId: number;
  updateTags: any;
}

export const TagsEntry = (props: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [tags, setTags] = useState<string[]>(props.tags)

  function updateTags(): void {

  }

  function parse(str: string): void {
    setTags(str.split(","))
  }

  return (
    <Box direction="column" margin={{bottom: "30px"}}>
      <Box direction="row" align="center" gap="30px"  margin={{bottom: "10px"}}>
        <Text size="14px" weight="bold">
          Tags
        </Text>
        {props.home && !isEdit && (
          <Box
            height="30px" pad="5px"
            style={{border: "1px solid grey"}} 
            round="xsmall"
            onClick={() => setIsEdit(!isEdit)}   
          >
            <Edit size="20px"/>
          </Box>
        )}
        {props.home && isEdit && (
          <Box
            height="30px" pad="5px"
            style={{border: "1px solid grey"}} 
            round="xsmall"
            onClick={() => {
              setIsEdit(!isEdit)
              updateTags()
            }}   
          >
            <Save size="20px"/>
          </Box>
        )}
      </Box>
      {isEdit && (
        <Box direction="column" gap="6px" width="50%">
          <TextInput
            style={{width: "90%"}}
            placeholder="Tags"
            value={tags.join(', ')}
            onChange={(e: any) => parse(e.target.value)}
          />
        </Box>
      )}
      {!isEdit && (
        <Box height="60%" direction="row" pad="10px" gap="8px">
          {tags.map((tag: string) => (
            <Box height="20px" background="#EEEEEE" round="xsmall" pad="small" justify="center"  >
              <Text size="11px" weight="bold"> 
                {tag}
              </Text>
            </Box> 
          ))}
        </Box>
      )}
    </Box>
  );
};