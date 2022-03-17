import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Text, TextInput, TextArea } from "grommet";
import { Presentation, Profile, ProfileService } from "../../Services/ProfileService";
import { Edit, Save, Trash } from "grommet-icons";
import InviteToTalkButton from "./InviteToTalkButton"
import { isExportAllDeclaration } from "@babel/types";


interface Props {
  presentation: Presentation;
  profile: Profile;
  index: number;
  home: boolean;
  userId?: number;
  width?: string;
  updatePresentation?: any;
  deletePresentation?: any;
  isOverlay?: boolean;
}

export const PresentationEntry = (props: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(props.presentation.id > 0 ? false : true);
  const [id, setId] = useState<number>(props.presentation.id)
  const [userId, setUserId] = useState<number>(props.presentation.user_id)
  const [title, setTitle] = useState<string>(props.presentation.id > 0 ? props.presentation.title : "")
  const [description, setDescription] = useState<string>(props.presentation.id > 0 ? props.presentation.description : "")
  const [link, setLink] = useState<string>(props.presentation.id > 0 ? props.presentation.link : "")
  const [duration, setDuration] = useState<number>(props.presentation.id > 0 ? props.presentation.duration : 0)
  const [dateCreated, setDateCreated] = useState<Date>(props.presentation.id > 0 ? new Date(props.presentation.date_created) : new Date)
  const [nDaysLeft, setNDaysLeft] = useState<number>(-1)
  const NDAYSMAX: number = 30;

  useEffect(() => {
    let now = new Date;
    setNDaysLeft(NDAYSMAX - Math.round((now.getTime() - dateCreated.getTime()) / (1000*60*60*24)))
  }, [dateCreated, nDaysLeft])


  function updatePresentation(renew: boolean = false): void {
    let now = new Date;
    if (props.home && props.updatePresentation && props.userId) {
      let temp_presentation: Presentation = {
        id: id,
        user_id: userId,
        title: title,
        description: description,
        link: link,
        duration: duration,
        date_created: renew ? formatDate(now) : formatDate(dateCreated),
      }

      ProfileService.updatePresentation(
        props.userId, temp_presentation, formatDate(now),
        (id: number) => {
          setId(id)
          temp_presentation.id = id
          if (renew) { setDateCreated(now) }
          props.updatePresentation(props.index, temp_presentation)
        }
      )
    }
  }

  function isValid(url: string) : boolean {
    var isValid = false;
    if(url.includes('https://')){
      isValid = true
    }
    if(url.includes('http://')){
      isValid = true
    }
    return isValid
  }

  function paperRedirect(): void {
    if (isValid(link))
    window.open(link, '_blank');
  }

  function formatDate(d: Date): string {
    return d.toISOString().slice(0, 19).replace("T", " ")
  }

  function deletePresentation(): void {
    if (props.home && props.deletePresentation) {
      ProfileService.deletePresentation(
        id, 
        () => props.deletePresentation(id)
      )
    }
  }

  const width : string = props.width ? props.width : "50%"
  return (
    <Box direction="row" align="center">
      {props.home && isEdit && (
        <Box direction="column" gap="12px" width={width}>
          <TextInput
            style={{width: "90%"}}
            placeholder="Title"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
          <TextArea
            style={{width: "90%", height: "120px"}}
            placeholder="Description"
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
          />
          <Box direction="row" gap="10px" width="80%" align="center">
            <TextInput
              style={{width: "200px"}}
              placeholder="Link to paper/slides"
              value={link}
              onChange={(e: any) => setLink(e.target.value)}
            />
            <Box direction="row" gap="10px" align="center">
              <TextInput
                style={{width: "90px"}}
                placeholder="Duration"
                value={duration}
                onChange={(e: any) => setDuration(e.target.value)}
              />
              <Text size="14px">
                minutes
              </Text>
            </Box>
          </Box>
          {!isValid(link) && link !== "" && (
            <Text size="11px" color="color3" weight="bold" margin={{top: "-8px"}}>
              url should start with https://
            </Text>
          )}

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
          onClick={deletePresentation}   
        >
          <Trash size="20px"/>
        </Box>
      )}
      {!isEdit && (
        <Box direction="column" gap="12px" width={width}>
          <Text size={props.isOverlay ? "15px" : "16px"} weight="bold"> 
            {title}
          </Text>
          <Box style={{maxHeight: props.isOverlay ? "80px" : "150px"}} width="90%" overflow="auto" margin={{left: "18px"}}>
            <Text size="14px" style={{fontStyle: "italic"}}> 
              {description}
            </Text>
          </Box>
          <Box direction="row" gap="5%" align="center">
            {isValid(link) && (
              <Box
                focusIndicator={false}
                background="white"
                round="xsmall"
                onClick={paperRedirect}
                style={{
                  width: "25%",
                  height: "28px",
                  border: "1px solid #C2C2C2",
                }}
                hoverIndicator={true}
                align="center"
                justify="center"
              >
                  <Text color="grey" size="small"> 
                    Link
                  </Text>
              </Box>
            )}
            {!isValid(link) && (
              <Box
                focusIndicator={false}
                style={{
                  width: "25%",
                  height: "28px",
                }}
              />
            )}

            <Text size="14px"> 
              Duration: {duration} min.
            </Text>
            {!props.isOverlay && props.home && nDaysLeft > 0 && (
              <Box
                focusIndicator={false}
                background="color5"
                round="xsmall"
                pad={{ vertical: "2px", horizontal: "xsmall" }}
                onClick={() => {}}
                style={{ width: "35%", height: "28px" }}
                hoverIndicator={false}
                align="center"
                justify="center"
              >
                <Text color="black" size="small"> 
                  {nDaysLeft} days until expired
                </Text>
              </Box>
            )}
            {!props.isOverlay && props.home && nDaysLeft < 1 && (
              <Box
                focusIndicator={false}
                background="color1"
                round="xsmall"
                pad={{ vertical: "2px", horizontal: "xsmall" }}
                onClick={() => updatePresentation(true)}
                style={{ width: "35%", height: "28px" }}
                hoverIndicator={true}
                align="center"
                justify="center"
              >
                <Text size="small"> 
                  Make it visible to organizers 
                </Text>
              </Box>
            )}
            {!props.isOverlay && !props.home && nDaysLeft > 0 && (
              <InviteToTalkButton profile={props.profile} presentationName={title} widthButton="35%" heightButton="28px" />
            )}
            {!props.isOverlay && !props.home && nDaysLeft < 1 && (
              <Box
                focusIndicator={false}
                background="#DDDDDD"
                round="xsmall"
                pad={{ vertical: "2px", horizontal: "xsmall" }}
                onClick={() => {}}
                style={{ width: "35%", height: "28px" }}
                align="center"
                justify="center"
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