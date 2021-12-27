import React, { useState, useEffect } from "react";
import { Box, Text, TextInput } from "grommet";
import { Paper, ProfileService } from "../../Services/ProfileService";
import { Edit, Save, Trash } from "grommet-icons";


interface Props {
  title: string,
  dbKey: string,
  value: string | undefined,
  userId: number,
  home: boolean,
}

export const DetailsEntry = (props: Props) => {
  const [value, setValue] = useState<string>(props.value ? props.value : "")
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>("")

  function postDetails(): void {
    if (props.home && props.userId) {
      ProfileService.updateDetails(
        props.userId, props.dbKey, value,
        (response: [string, number]) => {
          console.log("DETAILS: ", response[0], response[1])
          if (response[1] === 400) {
            setValue(props.value ? props.value : "")
            setErrorMsg(response[0])
          } else if (response[1] == 200) {
            setErrorMsg("")
          }
        }
      )
    }
  }

  return (
    <Box 
      direction="row" 
      align="center"
      justify="start"
      gap="20px"
    >
      <Text size="11px" style={{width: "95px"}}>
        {props.title}
      </Text>
      <Box direction="row" width="25%">
        {!isEdit && (
          <Text size="14px">
            {value}
          </Text>
        )}
        {props.home && isEdit && (
          <TextInput
            placeholder=""
            value={value}
            onChange={(e: any) => setValue(e.target.value)}
            style={{height: "30px"}}
          />
        )}
      </Box>
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
            postDetails();
          }}   
        >
          <Save size="20px"/>
        </Box>
      )}
      {props.home && errorMsg !== "" && (
        <Text size="14px" color="color3" weight="bold">
          {errorMsg}
        </Text>
      )}
    </Box>
  );
};