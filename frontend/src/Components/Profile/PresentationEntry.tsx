import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Text, TextInput } from "grommet";
import { Presentation, ProfileService } from "../../Services/ProfileService";
import { Edit, Save, Trash } from "grommet-icons";
import { isExportAllDeclaration } from "@babel/types";


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
  const [dateCreated, setDateCreated] = useState<string>(props.presentation.id > 0 ? props.presentation.date_created : "")
  const [nDaysLeft, setNDaysLeft] = useState<number>(-1)
  const NDAYSMAX: number = 30;

  useEffect(() => {
    let now = new Date;
    let start = new Date(dateCreated);
    setNDaysLeft(NDAYSMAX - Math.round((now.getTime() - start.getTime()) / (1000*60*60*24)))
  }, [dateCreated, nDaysLeft])


  function updatePresentation(renew: boolean = false): void {
    let now = (new Date).toISOString()
    if (props.home && props.updatePresentation && props.userId) {
      let temp_presentation: Presentation = {
        id: id,
        user_id: userId,
        title: title,
        description: description,
        link: link,
        duration: duration,
        date_created: renew ? now : dateCreated,
      }

      console.log(temp_presentation)
      
      ProfileService.updatePresentation(
        props.userId, temp_presentation, now,
        (id: number) => {
          setId(id)
          temp_presentation.id = id
          if (renew) { setDateCreated(now) }
          props.updatePresentation(props.index, temp_presentation)
        }
      )
    }
  }

  function paperRedirect(): void {
    window.open(link, '_blank');
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
            updatePresentation();
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
        <Box direction="column" gap="12px" width={width}>
          <Text size="16px" weight="bold"> 
            {title}
          </Text>
          <Text size="14px" style={{fontStyle: "italic", width: "90%"}} margin={{left: "18px"}} > 
            {description}
          </Text>
          <Box direction="row" gap="5%" align="center">
            <Box
              focusIndicator={false}
              background="white"
              round="xsmall"
              pad={{ vertical: "2px", horizontal: "xsmall" }}
              onClick={paperRedirect}
              style={{
                width: "20%",
                border: "1px solid #C2C2C2",
              }}
              hoverIndicator={true}
              align="center"
            >
              <Text color="grey" size="small"> 
                Link to paper
              </Text>
            </Box>
            <Text size="14px"> 
              Duration: {duration} min.
            </Text>
            {props.home && nDaysLeft > 0 && (
              <Box
                focusIndicator={false}
                background="color5"
                round="xsmall"
                pad={{ vertical: "2px", horizontal: "xsmall" }}
                onClick={() => {}}
                style={{ width: "35%" }}
                hoverIndicator={false}
                align="center"
              >
                <Text color="black" size="small"> 
                  {nDaysLeft} days until expired
                </Text>
              </Box>
            )}
            {props.home && nDaysLeft < 1 && (
              <Box
                focusIndicator={false}
                background="color1"
                round="xsmall"
                pad={{ vertical: "2px", horizontal: "xsmall" }}
                onClick={() => updatePresentation(true)}
                style={{ width: "35%" }}
                hoverIndicator={true}
                align="center"
              >
                <Text size="small"> 
                  Make it visible to organizers 
                </Text>
              </Box>
            )}
            {!props.home && nDaysLeft > 0 && (
              <Box
                focusIndicator={false}
                background="color1"
                round="xsmall"
                pad={{ vertical: "2px", horizontal: "xsmall" }}
                onClick={() => {}}
                style={{ width: "35%" }}
                hoverIndicator={true}
                align="center"
              >
                <Text size="small"> 
                  Contact speaker
                </Text>
              </Box>
            )}
            {!props.home && nDaysLeft < 1 && (
              <Box
                focusIndicator={false}
                background="#DDDDDD"
                round="xsmall"
                pad={{ vertical: "2px", horizontal: "xsmall" }}
                onClick={() => {}}
                style={{ width: "35%" }}
                align="center"
              >
                <Text size="small"> 
                  Presentation expired 
                </Text>
              </Box>
            )}

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