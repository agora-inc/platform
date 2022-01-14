import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Text, TextInput } from "grommet";
import { Presentation, ProfileService } from "../../Services/ProfileService";
import { Edit, Save, Trash } from "grommet-icons";


interface Props {
  presentation: Presentation;
  index: number;
  home: boolean;
  userId?: number;
  width?: string;
  updatePresentation?: any;
  deletePresentation?: any
}

export const PresentationEntry = (props: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(props.presentation.id > 0 ? false : true);
  const [id, setId] = useState<number>(props.presentation.id)
  const [userId, setUserId] = useState<number>(props.presentation.user_id)
  const [title, setTitle] = useState<string>(props.presentation.id > 0 ? props.presentation.title : "")
  const [description, setDescription] = useState<string>(props.presentation.id > 0 ? props.presentation.description : "")
  const [link, setLink] = useState<string>(props.presentation.id > 0 ? props.presentation.link : "")
  const [duration, setDuration] = useState<number>(props.presentation.id > 0 ? props.presentation.duration : 0)
  const [open, setOpen] = useState<boolean>(props.presentation.id > 0 ? props.presentation.open : false)

  function updatePaper(): void {
    if (props.home && props.updatePresentation && props.userId) {
      let temp_presentation: Presentation = {
        id: id,
        user_id: userId,
        title: title,
        description: description,
        link: link,
        duration: duration,
        open: open
      }
      ProfileService.updatePresentation(
        props.userId, temp_presentation, 
        (id: number) => {
          setId(id)
          temp_presentation.id = id
          props.updatePresentation(props.index, temp_presentation)
        }
      )
    }
  }

  function deletePaper(): void {
    if (props.home && props.deletePresentation) {
      props.deletePresentation(id)
      ProfileService.deletePaper(id, () => {})
    }
  }

  const width : string = props.width ? props.width : "50%"  

  return (
    <Box direction="row" align="center">
      {props.home && isEdit && (
        <Box direction="column" gap="6px" width={width}>
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
              placeholder="Description"
              value={description}
              onChange={(e: any) => setDescription(e.target.value)}
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
      {props.home && isEdit && (
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
      {props.home && isEdit && (
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
        <Box direction="column" gap="3px" width={width}>
          <Text size="14px" weight="bold"> 
            {props.index+1}. {title}
          </Text>
          <Box direction="row"  gap="10px">
            <Text size="14px"> 
              {open}, {duration}
            </Text>
            <Link to={{pathname: link}} target="_blank">
            <Text size="14px" style={{fontStyle: "italic"}}> 
              {description}
            </Text>
            </Link>
          </Box>
        </Box>
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
    </Box>
  );
};