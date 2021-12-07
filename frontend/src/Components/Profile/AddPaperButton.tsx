import React, { useState, useEffect } from "react";
import { Box, Heading, Text } from "grommet";
import { Profile } from "../../Services/ProfileService";


interface Props {
  profile: Profile;
  callback?: any
}

export const AddPaperButton = (props: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  if (!isEdit) {
    return (
      <Box
        focusIndicator={false}
        background="white"
        round="xsmall"
        pad={{ vertical: "2px", horizontal: "xsmall" }}
        onClick={() => setIsEdit(true)}
        style={{
          width: "15%",
          border: "1px solid #C2C2C2",
        }}
        hoverIndicator={true}
        align="center"
        margin={{bottom: "24px"}}   
      >
        <Text color="grey" size="small"> 
          + Add 
        </Text>
      </Box>
    );
  } else {
    return null;
  }
};