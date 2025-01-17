import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Text, TextInput } from "grommet";
import { Paper, ProfileService } from "../../Services/ProfileService";
import { Edit, Save, Trash } from "grommet-icons";


interface Props {
  tags: string[];
  home: boolean;
  hasTitle: boolean;
  marginBottom?: string;
  userId?: number;
}

export const TagsEntry = (props: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [tags, setTags] = useState<string[]>(props.tags)

  function updateTags(): void {
    if (props.home && props.userId) {    
      ProfileService.updateTags(props.userId, tags, () => {})
    }
  }

  function parse(str: string): void {
    setTags(str.split(","))
  }

  const marginBottom: string = props.marginBottom ? props.marginBottom : "0px" 

  return (
    <Box direction="column" margin={{bottom: marginBottom}}>
      <Box direction="row" align="center" gap="30px"  margin={{bottom: "10px"}}>
        {props.hasTitle && (
          <Text size="14px" weight="bold">
            Tags
          </Text>
        )}
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
            value={tags.join(',')}
            onChange={(e: any) => parse(e.target.value)}
          />
        </Box>
      )}
      {!isEdit && (
        <Box direction="row" gap="8px" wrap={true} overflow="auto">
          {tags.map((tag: string) => (
            <Box height="18px" background="#EEEEEE" round="xsmall" pad="small" justify="center"
              margin={{top: "2px", bottom: "2px"}}
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