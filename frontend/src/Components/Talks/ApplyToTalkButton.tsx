import React, { useState, useEffect } from "react";
import { Box, Text, TextInput, TextArea, Select } from "grommet";
import { Overlay, OverlaySection } from "../Core/Overlay";
import { User, UserService } from "../../Services/UserService";
import { Presentation, Profile, ProfileService } from "../../Services/ProfileService";
import { Workshop, LinkPrevious, LinkNext } from "grommet-icons";
import { PresentationEntry } from "../Profile/PresentationEntry";


interface Props {
  userId: number
}

export const ApplyToTalkButton = (props: Props) => {
  const [isOverlay, setIsOverlay] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>();
  // presentations
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [idxPresDisplay, setIdxPresDisplay] = useState<number>(0);
  const [newPresentation, setNewPresentation] = useState<Presentation>();
  // profile infô
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [position, setPosition] = useState<string>(""); 
  const [institution, setInstitution] = useState<string>(""); 
  const [personalWebsite, setPersonalWebsite] = useState<string>("");
  const [message, setMessage] = useState<string>(""); 

  useEffect(() => {
    ProfileService.getProfile(
      props.userId, 
      (profile: Profile) => {
        setProfile(profile)
        setPresentations(profile.presentations)
        setFullName(profile.full_name)
        setEmail(profile.user.email ? profile.user.email  : "")
        setPosition(profile.user.position ? profile.user.position  : "")
        setInstitution(profile.user.institution ? profile.user.institution : "")
        setPersonalWebsite(profile.user.personal_homepage ? profile.user.personal_homepage : "")
      }
    )
  }, [])

  function renderArrowButton(prev: boolean) {
    let incr = prev ? -1 : 1;
    return (
      <Box
        round="xsmall"
        pad={{ vertical: "4px", horizontal: "4px" }}
        style={{
          width: "24px",
          border: "1px solid #BBBBBB",
        }}
        margin={{left: prev ? "24px" : "0px", right: prev ? "0px" : "24px"}}
        onClick={() => setIdxPresDisplay(idxPresDisplay+incr)}
        hoverIndicator="#DDDDDD" 
      >
      {prev && <LinkPrevious color="#BBBBBB" size="18px" />}
      {!prev && <LinkNext color="#BBBBBB" size="18px" />}
    </Box>
    );
  }


  function isComplete(): boolean {
    return false
  }
  function isMissing(): string[] {
    return []
  }

  function handleSubmit(): void {

  }  

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
      width={550}
      height={700}
      contentHeight="700px"
      title="Talk application"
    >
      {profile && presentations.length > 0 && (
        <Box direction="row" width="100%" align="center"> 
          {idxPresDisplay > 0 && renderArrowButton(true)}
          <Box width="80%" style={{border: "1px solid grey"}} pad="5px">
            <PresentationEntry 
              presentation={presentations[idxPresDisplay]}
              profile={profile}
              index={idxPresDisplay}
              home={false}
              isOverlay={true}
            />
          </Box>
          {idxPresDisplay < presentations.length-1 && renderArrowButton(false)}
        </Box>
      )}
      {(!profile || presentations.length === 0) && (
        123
      )}
      
      <Box width="100%" direction="column" gap="8px">
        <TextInput
          placeholder="Full name"
          value={fullName}
          onChange={(e: any) => setFullName(e.target.value)}
          />
        <TextInput
          placeholder="Education level"
          value={position}
          onChange={(e: any) => setPosition(e.target.value)}
        />
        <TextInput
          placeholder="Current institution"
          value={institution}
          onChange={(e: any) => setInstitution(e.target.value)}
          />
        <TextInput
          placeholder="Email address"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          />
        <TextInput
          placeholder="(Personal website)"
          value={personalWebsite}
          onChange={(e: any) => setPersonalWebsite(e.target.value)}
        />
        <TextArea
          placeholder="(Message)"
          value={message}
          onChange={(e: any) => setMessage(e.target.value)}
          rows={8}
        />
      </Box>
    </Overlay>
    </>

  );
}