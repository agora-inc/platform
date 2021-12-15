import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Text, TextInput } from "grommet";
import { Paper, ProfileService } from "../../Services/ProfileService";
import { Edit, Save, Trash } from "grommet-icons";


interface Props {
  paper: Paper;
  userId: number;
  index: number;
  updatePaper: any;
  deletePaper: any
}

export const PaperEntry = (props: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(props.paper.id > 0 ? false : true);
  const [id, setId] = useState<number>(props.paper.id)
  const [title, setTitle] = useState<string>(props.paper.id > 0 ? props.paper.title : "")
  const [authors, setAuthors] = useState<string>(props.paper.id > 0 ? props.paper.authors : "")
  const [year, setYear] = useState<string>(props.paper.id > 0 ? props.paper.year : "")
  const [link, setLink] = useState<string>(props.paper.id > 0 ? props.paper.link : "")
  const [publisher, setPublisher] = useState<string>(props.paper.id > 0 ? props.paper.publisher : "")

  function updatePaper(): void {
    let temp_paper: Paper = {
      id: id,
      title: title,
      authors: authors,
      year: year,
      link: link,
      publisher: publisher
    }
    ProfileService.updatePaper(
      props.userId, temp_paper, 
      (id: number) => {
        setId(id)
        temp_paper.id = id
        props.updatePaper(props.index, temp_paper)
      }
    )
  }

  function deletePaper(): void {
    props.deletePaper(id)
    ProfileService.deletePaper(id, () => {})
  }

  return (
    <Box direction="row" align="center">
      {isEdit && (
        <Box direction="column" gap="6px" width="50%">
          <Box direction="row" gap="5px" width="90%" align="center">
            <Text size="14px" weight="bold"> 
              {props.index+1}.
            </Text>
            <TextInput
              placeholder="Title"
              value={title}
              onChange={(e: any) => setTitle(e.target.value)}
            />
          </Box>
          <Box direction="row" gap="10px" width="90%">
            <TextInput
              placeholder="Authors"
              value={authors}
              onChange={(e: any) => setAuthors(e.target.value)}
            />
            <TextInput
              style={{width: "50%"}}
              placeholder="Year"
              value={year}
              onChange={(e: any) => setYear(e.target.value)}
            />
            <TextInput
              placeholder="Publisher"
              value={publisher}
              onChange={(e: any) => setPublisher(e.target.value)}
            />
          </Box>
          <TextInput
            style={{width: "90%"}}
            placeholder="Link"
            value={link}
            onChange={(e: any) => setLink(e.target.value)}
          />
        </Box>
      )}
      {isEdit && (
        <Box
          height="30px" pad="5px"
          style={{border: "1px solid grey"}} 
          round="xsmall"
          onClick={() => {
            setIsEdit(!isEdit);
            updatePaper();
          }}   
        >
          <Save size="20px"/>
        </Box>
      )}
      {isEdit && (
        <Box
          height="30px" pad="5px"
          margin={{left: "30px"}}
          style={{border: "1px solid grey"}} 
          round="xsmall"
          onClick={deletePaper}   
        >
          <Trash size="20px"/>
        </Box>
      )}
      {!isEdit && (
        <Box direction="column" gap="3px" width="50%">
          <Text size="14px" weight="bold"> 
            {props.index+1}. {title}
          </Text>
          <Box direction="row"  gap="10px">
            <Text size="14px"> 
              {authors}, {year}
            </Text>
            <Link to={{pathname: link}} target="_blank">
            <Text size="14px" style={{fontStyle: "italic"}}> 
              {publisher}
            </Text>
            </Link>
          </Box>
        </Box>
      )}
      {!isEdit && (
        <Box
          height="30px" pad="5px"
          style={{border: "1px solid grey"}} 
          round="xsmall"
          onClick={() => setIsEdit(!isEdit)}   
        >
          <Edit size="20px"/>
        </Box>
      )}
    </Box>
  );
};