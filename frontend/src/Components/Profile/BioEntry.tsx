import React, { useState, useEffect } from "react";
import { Box, Text, TextArea } from "grommet";
import { Paper, ProfileService } from "../../Services/ProfileService";
import { Edit, Save, Trash } from "grommet-icons";


interface Props {
  bio: string;
  home: boolean;
  userId?: number;
  width?: string;
}

export const BioEntry = (props: Props) => {
  const [bio, setBio] = useState<string>(props.bio);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  function updateBio(): void {
    if (props.home && props.userId) {
      ProfileService.updateBio(
        props.userId, bio, 
        () => {}
      )
    }
  }
  const width : string = props.width ? props.width : "47.4%" 
   
  return (
    <Box 
      direction="row" 
      align="center"
      gap="2%"
      margin={{bottom: "30px"}} 
      style={{height: "70px"}} 
      overflow="auto"
    >
      {!isEdit && bio !== "" && (
        <Text size="12px" style={{width: width}}>
          {bio}
        </Text>
      )}
      {!isEdit && bio === "" && (
        <Text size="12px" style={{width: "7%", fontStyle: "italic"}}>
          {props.bio}
        </Text>
      )}
      {props.home && isEdit && (
        <TextArea
          placeholder="Write a short bio"
          value={bio}
          style={{width: width, height: "70px"}}
          onChange={(e: any) => setBio(e.target.value)}
        />
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
            setIsEdit(!isEdit);
            updateBio();
          }}   
        >
          <Save size="20px"/>
        </Box>
      )}
    </Box>
  );
};