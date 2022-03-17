import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Text, TextInput, TextArea, Select } from "grommet";
import { Catalog, ContactInfo, Group } from "grommet-icons";


interface Props {
  text: string;
  link: string;
  iconSize: string;
  mobile: boolean;
  width: string;
  height: string;
}

export const LinkSecondaryButton = (props: Props) => {

  function icon(name: string) {
    if (name === "agoras") {
      return <Catalog size={props.iconSize} />
    }
    if (name === "speakers" ) {
      return <ContactInfo size={props.iconSize} />
    }
    if (name == "browse"){}
      return <Group size={props.iconSize}/>
  }

  return (
    <Link
      to={{ pathname: "/" + props.link }}
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
        gap="12px"
        direction="row"
      >
        {icon(props.link)}
        <Text size="14px" weight="bold"> 
          {props.text}
        </Text>
      </Box>
    </Link>
  );
}