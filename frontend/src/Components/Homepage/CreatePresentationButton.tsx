import React, { useState, useEffect } from "react";
import { Box, TextInput, TextArea, Text } from "grommet";
import { Overlay, OverlaySection } from "../Core/Overlay";
import ReactTooltip from "react-tooltip";
import { User,  UserService } from "../../Services/UserService"
import { Profile, ProfileService } from "../../Services/ProfileService";
import { Workshop } from "grommet-icons";


export const CreatePresentationButton = () =>  {
  const [showFormOverlay, setshowFormOverlay] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [link, setLink] = useState<string>("")
  const [duration, setDuration] = useState<number>(0)
  const [dateCreated, setDateCreated] = useState<Date>(new Date)

  function submitPresentation(): void {
    // If logged in, presentation is saved and user is redirect to profile page (make sure it exists)
    // If not logged in, Open another overlay "Sign up to save and advertise your presentation"
    // If already have an account, log in instead
    // All the fields from the sign up overlay
    // on submit, create an account with all the info, create a profile, create the presentation under that profile
    // redirect to profile page
  };

  function isComplete() : boolean {
    return (
      title !== "" && description !== "" && duration > 0
    );
  };

  function isMissing(): string[] {
    let res: string[] = []
    if (title === "") {
      res.push("Title")
    }
    if (description === "") {
      res.push("Description")
    }
    if (duration === 0) {
      res.push("Duration")
    }
    return res;
  }

  return (
    <>
      <Box
        width={"310px"}
        onClick={() => setshowFormOverlay(!showFormOverlay)}
        background="#0C385B"
        round="xsmall"
        height={"80px"}
        justify="center"
        align="center"
        focusIndicator={false}
        hoverIndicator="#BAD6DB"
        direction="row"
      >
        <Workshop size="30px" />
        <Text size="18px" margin={{left: "10px"}}> <b>Create</b> your first presentation </Text>
      </Box>

      <Overlay
        visible={showFormOverlay}
        onEsc={() => setshowFormOverlay(false)}
        onCancelClick={() => setshowFormOverlay(false)}
        onClickOutside={() => setshowFormOverlay(false)}
        onSubmitClick={submitPresentation}
        submitButtonText="Publish"
        canProceed={isComplete()}
        isMissing={isMissing()}
        width={550}
        height={450}
        contentHeight="300px"
        title={"Create your first presentation on mora!"}
      >
        <Box width="100%" gap="10px" margin={{top: "5px"}}>
          <TextInput
            placeholder="Title"
            value={title}
            onChange={(e: any) => setTitle(e)}
          />
          <TextArea
            placeholder={"Description"}
            value={description}
            onChange={(e: any) => setDescription(e)}
            rows={8}
          />
          <Box direction="row" gap="10px" width="80%" align="center">
            <TextInput
              style={{width: "200px"}}
              placeholder="Link to paper"
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
        </Box>

      </Overlay>
    </>
  );
}