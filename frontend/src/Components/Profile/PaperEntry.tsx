import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Text, TextInput } from "grommet";
import { Paper } from "../../Services/ProfileService";
import { Edit } from "grommet-icons";


interface Props {
  paper: Paper;
  index: number
  callback?: any
}

export const PaperEntry = (props: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [paper, setPaper] = useState<Paper>(props.paper);

  function editPaper(e: string, arg: string): void {
    let temp: Paper = paper;
    setPaper(temp)
  }
  
  console.log("EDIT?", isEdit)
  return (
    <Box direction="row">
      {isEdit && (
        <Box direction="column" gap="3px" width="50%">
          <TextInput
            placeholder="Title"
            size="14px"
            value={paper.title}
            onChange={(e: any) => editPaper(e, "title")}
          />
          <Box direction="row"  gap="10px">
            <Text size="14px"> 
              {paper.authors}, {paper.year}
            </Text>
            <Link to={{pathname: paper.link}} target="_blank">
            <Text size="14px" style={{fontStyle: "italic"}}> 
              {paper.publisher}
            </Text>
            </Link>
          </Box>
        </Box>
      )}
      {!isEdit && (
        <Box direction="column" gap="3px" width="50%">
          <Text size="14px" weight="bold"> 
            {props.index+1}. {paper.title}
          </Text>
          <Box direction="row"  gap="10px">
            <Text size="14px"> 
              {paper.authors}, {paper.year}
            </Text>
            <Link to={{pathname: paper.link}} target="_blank">
            <Text size="14px" style={{fontStyle: "italic"}}> 
              {paper.publisher}
            </Text>
            </Link>
          </Box>
        </Box>
      )}
      <Box
        height="30px" pad="5px"
        style={{border: "1px solid #DDDDDD"}} 
        background="#OC285B"
        round="xsmall"
        onClick={() => setIsEdit(!isEdit)}   
      >
        <Edit size="20px"/>
      </Box>
    </Box>
  );
};