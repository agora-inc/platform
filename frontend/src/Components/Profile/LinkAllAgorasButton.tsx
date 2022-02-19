import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Text, TextInput, TextArea, Select } from "grommet";
import { Workshop, LinkPrevious, LinkNext } from "grommet-icons";


interface Props {
  text: string;
  iconName: string;
  mobile: boolean;
  width: string;
  height: string;
}

export const ApplyToTalkButton = (props: Props) => {

  function icon(name: string) {
    if (name === "") {
      return 
    }
  }

  return (
    <Link
      to={{ pathname: "/agoras" }}
      style={{ textDecoration: "none" }}
    >
      <Box
        onClick={()=>{}}
        background="color7"
        round="xsmall"
        pad="xsmall"
        height={props.height}
        width={props.width}
        justify="center"
        align="center"
        focusIndicator={false}
        hoverIndicator="color6"
        margin={{ left: "0px" }}
        direction="row"
      >
        {icon(props.iconName)}
        <Text size="14px" weight="bold"> 
          {props.text}
        </Text>
      </Box>
    </Link>
  );
}