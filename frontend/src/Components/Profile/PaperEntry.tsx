import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Text, TextInput } from "grommet";
import { Paper, ProfileService } from "../../Services/ProfileService";
import { Edit, Save } from "grommet-icons";


interface Props {
  paper: Paper;
  userId: number;
  index: number;
  callback?: any;
}

export const PaperEntry = (props: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(props.paper.id > 0 ? false : true);
  const [id, setId] = useState<number>(props.paper.id)
  const [title, setTitle] = useState<string>(props.paper.id > 0 ? props.paper.title : "")
  const [authors, setAuthors] = useState<string>(props.paper.id > 0 ? props.paper.authors : "")
  const [year, setYear] = useState<string>(props.paper.id > 0 ? props.paper.year : "")
  const [link, setLink] = useState<string>(props.paper.id > 0 ? props.paper.link : "")
  const [publisher, setPublisher] = useState<string>(props.paper.id > 0 ? props.paper.publisher : "")

  function savePaper(): void {
    ProfileService.updatePaper(
      props.userId,
      {
        id: id,
        title: title,
        authors: authors,
        year: year,
        link: link,
        publisher: publisher
      },
      setId
    )
  }

  return (
    <Box direction="row" align="center">
      {isEdit && (
        <Box direction="column" gap="6px" width="50%">
          <TextInput
            style={{width: "90%"}}
            placeholder="Title"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
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
            savePaper();
          }}   
        >
          <Save size="20px"/>
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