import React, { Component, useState } from "react";
import { Box, DropButton, Text } from "grommet";
import { FormDown, FormUp } from "grommet-icons";
import ImageCropUploader from "./ImageCropUploader";
import { ChannelService } from "../../Services/ChannelService";
import ReactTooltip from "react-tooltip";
import { StatusInfo } from "grommet-icons";
import { useAuth0 } from "@auth0/auth0-react";

const options = [
  "white",
  "orange",
  "goldenrod",
  "teal",
  "aquamarine",
  "mediumslateblue",
  "blueviolet",
];

interface Props {
  callback: any;
  selected: string;
  channelId?: number;
  hasCover: boolean;
  width?: string;
  height?: string;
}

export const ColorPicker = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(props.selected);

  const { getAccessTokenSilently } = useAuth0();

  const select = (option: string) => {
    setSelected(option);
    toggle();
    props.callback(option);
  };

  const toggle = () => {
    setOpen(!open);
  };

  const onCoverUpload = async (file: File) => {
    const token = await getAccessTokenSilently();
    props.channelId &&
      ChannelService.uploadCover(
        props.channelId,
        file,
        () => {
          window.location.reload();
        },
        token
      );
  };

  const onDeleteCoverClicked = async () => {
    const token = await getAccessTokenSilently();
    props.channelId &&
      ChannelService.removeCover(
        props.channelId,
        () => {
          window.location.reload();
        },
        token
      );
  };

  const renderDropContent = () => {
    /* let remove_button;
  if (props.hasCover){
  remove_button =
    <Box
      onClick={onDeleteCoverClicked}
      background="#FF4040"
      // background="#F2F2F2"
      round="xsmall"
      width={props.width ? props.width : "100px"}
      height={props.height ? props.height : "35px"}
      justify="center"
      align="center"
      focusIndicator={true}
      hoverIndicator="#DDDDDD"
    >
      <Text size="13px" weight="bold" color="white">
        Remove header
      </Text>
    </Box>
  } */

    return (
      <Box
        width="139px"
        // margin={{ top: "5px" }}
        pad="small"
        background="#f2f2f2"
      >
        <Box direction="row" wrap>
          {options.map((option: string, index: number) => (
            <Box
              onClick={() => select(option)}
              round="xsmall"
              width={props.width ? props.width : "30px"}
              height={props.height ? props.height : "30px"}
              justify="center"
              align="center"
              focusIndicator={true}
              hoverIndicator="#DDDDDD"
            ></Box>
          ))}
        </Box>
        {/* <Box gap="4px">
        <ImageCropUploader
          text="Upload header"
          onUpload={onCoverUpload}
          width="100%"
        /> 
        {remove_button}
      </Box>*/}
      </Box>
    );
  };

  return (
    <>
      {/* <Box
    width={open ? "139px" : "120px"}
    background="#f2f2f2"
    direction="row"
    justify="between"
    align="center"
    round="xsmall"
    style={
      open
        ? {
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            transition: "width 75ms ease-in-out",
          }
        : {
            transition: "width 75ms ease-in-out",
          }
    }
    pad={{ left: "10px", vertical: "10px" }}
  >
    <Box
      width="50px"
      height="30px"
      round="xsmall"
      // background={selected}
      // style={{ zIndex: 100 }}
    >
      <Text weight="bold" size="14">
        Header
         <StatusInfo size="small" data-tip data-for='link_to_talk_info'/>
                  <ReactTooltip id='link_to_talk_info' place="right" effect="solid">
                   <p>Recommended dim: 1500x500px</p>
                  </ReactTooltip>
      </Text>
    </Box>
    <DropButton
      reverse
      // label={selected}
      color="#f2f2f2"
      style={{
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 10,
        background: "#f2f2f2",
      }}
      primary
      dropAlign={{ top: "bottom", right: "right" }}
      dropContent={renderDropContent()}
      icon={open ? <FormUp /> : <FormDown />}
      open={open}
      onOpen={toggle}
      onClose={toggle}
    />
  </Box> */}
      {/* This is a workaround because Modal don't work with DropButton */}
      <Box direction="row">
        <ImageCropUploader
          text="Upload header"
          onUpload={onCoverUpload}
          width="150px"
        />
        {/* <Box margin= {{ right: "xsmall" }}/>
    {remove_button} */}
      </Box>
    </>
  );
};
