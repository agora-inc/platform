import React, { useState, useEffect } from "react";
import { Box, Text, TextInput, TextArea, Select } from "grommet";
import { Overlay, OverlaySection } from "../Core/Overlay";
import { User, UserService } from "../../Services/UserService";
import { Channel, ChannelService } from "../../Services/ChannelService";
import { Presentation, Profile, ProfileService } from "../../Services/ProfileService";
import { Workshop, LinkPrevious, LinkNext } from "grommet-icons";
import { PresentationEntry } from "../Profile/PresentationEntry";
import InstitutionalUsers from "../../Views/LandingPages/InstitutionalUsers";


interface Props {
  userId: number
  channelId: number;
  channelName: string;
}

export const ApplyToTalkButton = (props: Props) => {
  const [isOverlay, setIsOverlay] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>();
  // presentations
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [idxPresDisplay, setIdxPresDisplay] = useState<number>(0);
  // new presentation
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [link, setLink] = useState<string>("");
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

  function renderArrowButton(prev: boolean, idx: number, len: number) {
    let incr = prev ? -1 : 1;
    if ((prev && idx > 0) || (!prev && idx < len)) {
      return (
        <Box
          round="xsmall"
          pad={{ vertical: "4px", horizontal: "4px" }}
          style={{
            width: "28px",
            border: "1px solid #BBBBBB",
          }}
          onClick={() => setIdxPresDisplay(idxPresDisplay+incr)}
          hoverIndicator="#DDDDDD" 
        >
        {prev && <LinkPrevious color="#BBBBBB" size="18px" />}
        {!prev && <LinkNext color="#BBBBBB" size="18px" />}
      </Box>
      );
    } else {
      return (
        <Box width="28px" />
      );
    }

  }

  function isValid(url: string) : boolean {
    return (url.includes('https://') || url.includes('http://'))
  }

  function renderNewPresentation(): any {
    return (
      <Box direction="column" gap="12px" width="85%">
        <TextInput
          style={{width: "100%"}}
          placeholder="Title"
          value={title}
          onChange={(e: any) => setTitle(e.target.value)}
        />
        <TextArea
          style={{width: "100%", height: "120px"}}
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
    );
  }


  function isComplete(): boolean {
    let speakerInfo: boolean = fullName !== "" && position !== "" && institution !== "" && email !== "";
    if (idxPresDisplay === presentations.length) {
      return speakerInfo && title !== "" && description !== "" && duration !== "";
    } else {
      return speakerInfo
    }
  }

  function isMissing(): string[] {
    let res: string[] = []
    if (fullName === "") {res.push("Speaker full name")}
    if (position === "") {res.push("Speaker position")}
    if (institution === "") {res.push("Speaker institution")}
    if (email === "") {res.push("Speaker email")}
    if (idxPresDisplay === presentations.length) {
      if (title === "") {res.push("Presentation title")}
      if (description === "") {res.push("Presentation description")}
      if (duration === "") {res.push("Presentation duration")}
    }
    return res;
  }

  function sendApplication(): void {
    let email_topics_string = ""
    let raw_topics = profile ? profile.topics : []
    let topic_str = ""

    for (let i = 0; i < raw_topics.length; i++) {
      if (raw_topics[i] != null){
        topic_str = raw_topics[i]["field"].toString();
        if (email_topics_string != ""){
          email_topics_string = email_topics_string.concat(", ", topic_str)}
        else {
          email_topics_string = email_topics_string.concat(topic_str)
        }
      };
    }
    ChannelService.sendTalkApplicationEmail(
      props.channelId,
      props.channelName,
      fullName,
      position,
      institution,
      personalWebsite,
      email,
      idxPresDisplay < presentations.length ? presentations[idxPresDisplay].title : title,
      idxPresDisplay < presentations.length ? presentations[idxPresDisplay].description : description,
      email_topics_string,
      message,
      // TODO: Error handling
      (answer: any) => {
        console.log("Status: ", answer)
      }
     );
  }

  function handleSubmit(e: any): void {
    // prevents the page from bein
    e.preventDefault();
    sendApplication();
    setIsOverlay(false)
  }  

  return (
    <>
    <Box
      onClick={() => setIsOverlay(true)}
      background="color1"
      round="xsmall"
      pad="xsmall"
      height="45px"
      width="185px"
      justify="center"
      align="center"
      focusIndicator={false}
      hoverIndicator="color5"
      margin={{ left: "0px" }}
      direction="row"
    >
      <Workshop size="20px" />
      <Text size="14px" margin={{left: "10px"}}> Apply to give a talk</Text>
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
      height={750}
      contentHeight="750px"
      title="Talk application"
    >
      {profile && presentations.length > 0 && (
        <Box direction="row" width="100%" align="center" gap="15px"> 
          {renderArrowButton(true, idxPresDisplay, presentations.length)}
          {idxPresDisplay < presentations.length && (
            <Box width="85%" style={{border: "1px solid grey"}} pad="10px" round="xsmall">
              {presentations.map((presentation, i) => {
                if (i === idxPresDisplay) {
                  return ( 
                    <PresentationEntry 
                      presentation={presentation}
                      profile={profile}
                      index={idxPresDisplay}
                      home={false}
                      isOverlay={true}
                      width="100%"
                    />
                  );
                }
              })}
            </Box>
          )}  
          {idxPresDisplay === presentations.length && (
            renderNewPresentation()
          )}
          {renderArrowButton(false, idxPresDisplay, presentations.length)}
        </Box>
      )}
      {(!profile || presentations.length === 0) && (
        renderNewPresentation()
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
          placeholder="(Message to the organizer)"
          value={message}
          onChange={(e: any) => setMessage(e.target.value)}
          rows={8}
        />
      </Box>
    </Overlay>
    </>

  );
}