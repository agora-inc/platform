import React, { Component, useState } from "react";
import { Box, TextInput, TextArea, Text } from "grommet";
import { Workshop } from "grommet-icons";
import ReactTooltip from "react-tooltip";
import { useAuth0 } from "@auth0/auth0-react";

import { Channel, ChannelService } from "../../Services/ChannelService";
import { Profile, ProfileService } from "../../Services/ProfileService";
import { Overlay, OverlaySection } from "../Core/Overlay";
import CreateChannelButton from "../Channel/CreateChannelButton";
import { CreateChannelOverlay } from "../Channel/CreateChannelButton/CreateChannelOverlay";
import { useStore } from "../../store";

interface Props {
  profile: Profile;
  presentationName: string;
  widthButton?: string;
  heightButton?: string;
  textButton?: string;
}

type Content = {
  contactEmail: string;
  date: string;
  message: string;
  hostingChannel: Channel | null;
};

const nullContent: Content = {
  contactEmail: "",
  date: "",
  message: "",
  hostingChannel: null,
};

export const InviteToTalkButton = (props: Props) => {
  const [content, setContent] = useState<Content>(nullContent);
  const [showForm, setShowForm] = useState(false);
  const [ownedChannels, setOwnedChannels] = useState<Channel[]>([]);
  const [showCreateChannelOverlay, setShowCreateChannelOverlay] =
    useState(false);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  const getOwnedChannels = async () => {
    if (user) {
      const token = await getAccessTokenSilently();
      ChannelService.getChannelsForUser(
        user.id,
        ["owner"],
        (res: Channel[]) => {
          setOwnedChannels(res);
        },
        token
      );
    }
  };

  const handleInput = (e: any, key: string) => {
    setContent({ ...content, [key]: e.target.value });
  };

  const handleFormSubmit = (e: any) => {
    // prevents the page from bein
    e.preventDefault();
    contactSpeaker();
    setShowForm(false);
  };

  const contactSpeaker = async () => {
    if (content.hostingChannel && user) {
      const token = await getAccessTokenSilently();
      ProfileService.sendTalkInvitation(
        user.id,
        props.profile.user.id,
        content.hostingChannel.id,
        content.date,
        content.message,
        content.contactEmail,
        props.presentationName,
        (answer: any) => {
          console.log("Successful application!" + answer);
        },
        token
      );
    }

    // TODO: add error handling if email is not succesffully sent.
    handleClearForm();
  };

  const handleClearForm = () => {
    // prevents the page from being refreshed on form submission
    setContent({
      contactEmail: "",
      message: "",
      date: "",
      hostingChannel: null,
    });
  };

  const toggleModal = () => {
    setShowForm(!showForm);
    handleClearForm();
  };

  const toggleCreateChannelOverlay = () => {
    setShowCreateChannelOverlay(!showCreateChannelOverlay);
  };

  const isComplete = () => {
    return (
      content.message !== "" &&
      content.contactEmail !== "" &&
      content.hostingChannel !== null
    );
  };

  const isMissing = () => {
    let res: string[] = [];
    if (!content.hostingChannel) {
      res.push("Channel name");
    }
    if (content.message === "") {
      res.push("content");
    }
    if (content.contactEmail === "") {
      res.push("Contact email");
    }
    return res;
  };

  return (
    <>
      <Box
        width={props.widthButton ? props.widthButton : "15vw"}
        data-tip
        data-for="invite_speaker"
        // margin={{ top: "20px", bottom: "20px" }}
        onClick={() => setShowForm(true)}
        background="#0C385B"
        round="xsmall"
        // pad={{bottom: "3px", top: "6px", left: "3px", right: "3px"}}
        height={props.heightButton ? props.heightButton : "40px"}
        justify="center"
        align="center"
        focusIndicator={false}
        // hoverIndicator="#2433b5"
        hoverIndicator="#BAD6DB"
        direction="row"
      >
        <Workshop size="15px" style={{ marginRight: "10px" }} />
        {props.textButton ? props.textButton : "Invite to speak"}
        <ReactTooltip id="invite_speaker" effect="solid">
          {props.profile.full_name} is looking to give talks: invite him!
        </ReactTooltip>
      </Box>

      <Overlay
        visible={showForm}
        onEsc={toggleModal}
        onCancelClick={toggleModal}
        onClickOutside={toggleModal}
        onSubmitClick={handleFormSubmit}
        submitButtonText="Send"
        canProceed={isComplete()}
        isMissing={isMissing()}
        width={900}
        height={500}
        contentHeight="350px"
        title={
          content.hostingChannel
            ? "Invite " +
              props.profile.full_name +
              " to talk within " +
              "'" +
              content.hostingChannel.name +
              "'"
            : "Invite " + props.profile.full_name + " to give a talk"
        }
      >
        {/* IF ADMIN HASN'T SELECTED AN AGORA + ADMIN DOES NOT HAVE AN AGORA */}
        {!content.hostingChannel && ownedChannels.length == 0 && (
          <OverlaySection>
            You must first create your community page before inviting speakers.
            <CreateChannelButton
              // height="50px"
              onClick={toggleCreateChannelOverlay}
            />
          </OverlaySection>
        )}

        {showCreateChannelOverlay && (
          <CreateChannelOverlay
            onBackClicked={toggleCreateChannelOverlay}
            onComplete={() => {
              toggleCreateChannelOverlay();
            }}
            visible={true}
          />
        )}

        {/* IF ADMIN HASN'T SELECTED AN AGORA + HAS AGORAS */}
        {!content.hostingChannel && ownedChannels.length > 0 && (
          <OverlaySection>
            {/* select an agora */}
            Select your hosting channel.
            <Box
              height="80%"
              margin={{ bottom: "15px", left: "8px", top: "8px" }}
              overflow="scroll"
            >
              {ownedChannels.map((channel: Channel) => (
                <Box
                  direction="row"
                  gap="xsmall"
                  // align="center"
                  pad="small"
                  justify="start"
                  onClick={() => {
                    setContent({ ...content, hostingChannel: channel });
                  }}
                  hoverIndicator={true}
                >
                  <Box
                    background="white"
                    justify="center"
                    align="center"
                    overflow="hidden"
                    style={{
                      minHeight: 30,
                      minWidth: 30,
                      maxHeight: 30,
                      maxWidth: 30,
                      borderRadius: 15,
                    }}
                  >
                    <img
                      src={ChannelService.getAvatar(channel.id)}
                      height={30}
                      width={30}
                    />
                  </Box>
                  <Text size="14px" style={{ justifyContent: "center" }}>
                    {channel.name}
                  </Text>
                </Box>
              ))}
            </Box>
          </OverlaySection>
        )}

        {/* AFTER ADMIN SELECTED AGORA */}
        {content.hostingChannel && (
          <OverlaySection>
            <Box width="100%" gap="2px">
              <TextArea
                placeholder={"Your message to " + props.profile.full_name}
                value={content.message}
                onChange={(e: any) => handleInput(e, "message")}
                rows={8}
              />
            </Box>
            <Box width="100%" gap="2px">
              <TextInput
                placeholder="Talk dates (if any)"
                value={content.date}
                onChange={(e: any) => handleInput(e, "date")}
              />
            </Box>
            <Box width="100%" gap="2px">
              <TextInput
                placeholder={
                  "Contact email to which " +
                  props.profile.full_name +
                  " will answer"
                }
                value={content.contactEmail}
                onChange={(e: any) => handleInput(e, "contactEmail")}
              />
            </Box>
          </OverlaySection>
        )}
      </Overlay>
    </>
  );
};
