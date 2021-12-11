import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
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

  useEffect(() => {
    setIsEdit(true)
  });

  function submitPaper(): void {

  }

  return (
    <Box direction="row">
      {isEdit && (
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
      {!isEdit && (
        <Box direction="column" gap="3px" width="50%">
          <Text size="14px" weight="bold"> 
            caca. {paper.title}
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
        onClick={() => setIsEdit(true)}   
      >
        <Edit size="20px"/>
      </Box>
    </Box>
  );
};