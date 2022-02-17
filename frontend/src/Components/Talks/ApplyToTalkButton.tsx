import React, { useState, useEffect } from "react";
import { Box, Text, TextInput, TextArea, Select } from "grommet";
import { Overlay, OverlaySection } from "../Core/Overlay";
import { User, UserService } from "../../Services/UserService";
import { Presentation, Profile, ProfileService } from "../../Services/ProfileService";
import { Workshop } from "grommet-icons";


interface Props {
  user: User
}

export const ApplyToTalkButton = (props: Props) => {
  const [isOverlay, setIsOverlay] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>();
  const [fullName, setFullName] = useState<string>("")
  const [email, setEmail] = useState<string>(
    props.user.email ? props.user.email : ""
  )
  const [position, setPosition] = useState<string>(
    props.user.position ? props.user.position : ""
  )
  const [institution, setInstitution] = useState<string>(
    props.user.institution ? props.user.institution : ""
  )
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    ProfileService.getProfile(
      props.user.id, 
      (profile: Profile) => {
        setProfile(profile)
        setFullName(profile.full_name)
      }
    )
  }, [profile])


  function isComplete(): boolean {
    return false
  }
  function isMissing(): string[] {
    return []
  }

  function handleSubmit(): void {

  }

  console.log("user", props.user)

  return (
    <>
    <Box
      onClick={() => setIsOverlay(true)}
      background="color1"
      round="xsmall"
      pad="xsmall"
      height="45px"
      width="155px"
      justify="center"
      align="center"
      focusIndicator={false}
      hoverIndicator="color5"
      margin={{ left: "0px" }}
      direction="row"
    >
      <Workshop size="20px" />
      <Text size="14px" margin={{left: "10px"}}> Give a talk</Text>
    </Box>
    <Overlay
      visible={isOverlay}
      onEsc={() => setIsOverlay(false)}
      onCancelClick={() => setIsOverlay(false)}
      onClickOutside={() => setIsOverlay(false)}
      onSubmitClick={handleSubmit}
      submitButtonText="Apply"
      canProceed={isComplete()}
      isMissing={isMissing()}
      width={600}
      height={700}
      contentHeight="550px"
      title="Talk application"
    >

    <OverlaySection>
      <Box width="100%" gap="2px">
        <TextInput
          placeholder="Full name"
          value={fullName}
          onChange={(e: any) => setFullName(e.target.value)}
          />
        </Box>
      <Box width="100%" gap="2px">
        <TextInput
          placeholder="Education level"
          value={position}
          onChange={(e: any) => setPosition(e.target.value)}
        />
      </Box>
      <Box width="100%" gap="2px">
        <TextInput
          placeholder="Current institution"
          value={institution}
          onChange={(e: any) => setInstitution(e.target.value)}
          />
      </Box>
      <Box width="100%" gap="2px">
        <TextInput
          placeholder="Email address"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          />
      </Box>
      {/*
      <Box width="100%" gap="2px">
        <TextInput
          placeholder="(Personal website)"
          value={this.state.user.personal_website}
          onChange={(e: any) => this.handleInput(e.target.value, "personal_website")}
        />
      </Box> */}
  
      <Box width="100%" gap="2px" margin={{bottom: "20px"}}>
        <TextArea
          placeholder="(Message)"
          value={message}
          onChange={(e: any) => setMessage(e.target.value)}
          rows={8}
        />
      </Box>
      </OverlaySection>
    </Overlay>
    </>

  );
}