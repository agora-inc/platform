import React, { Component, useState } from "react";
import { Box, Select, Text, TextInput } from "grommet";
import ReactTooltip from "react-tooltip";

import { Overlay, OverlaySection } from "../Core/Overlay";
import { ChannelService } from "../../Services/ChannelService";
import { LoginButton } from "../Account/LoginButton";
import SignUpButton from "../Account/SignUpButton";
import { useAuth0 } from "@auth0/auth0-react";
import { useStore } from "../../store";

const titleOptions = [
  "Undergraduate",
  "Postgraduate",
  "PhD Candidate",
  "Dr",
  "Prof",
];

type Form = {
  fullName: string;
  email: string;
  title: string;
  personalWebsite: string;
  personalMessage: string;
  affiliation: string;
};

const nullForm: Form = {
  fullName: "",
  email: "",
  title: "",
  personalMessage: "",
  personalWebsite: "",
  affiliation: "",
};

interface Props {
  channelId: number;
  channelName: string;
  height?: string;
  widthButton?: string;
}

export const RequestMembershipButton = (props: Props) => {
  const [form, setForm] = useState(nullForm);
  const [showForm, setShowForm] = useState(false);
  const [contactAddresses, setContactAddresses] = useState("");

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  const fetchUserDetails = () => {
    // TODO: rework UserService.getCurrentUser() to give us all the data of the user
    //(GOAL: prevent the user to write multiple times the same details for appilcation)
    // var userData = UserService.getCurrentUser();
    // console.log("hihi");
    // console.log(userData);
    // setState({user: userData})
  };

  const handleInput = (e: any, key: string) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const setValueAcademicTitle = (e: any) => {
    handleInput(e, "title");
  };

  const handleFormSubmit = (e: any) => {
    // prevents the page from bein
    e.preventDefault();
    let userData = form;
    sendApplication();
    setShowForm(false);
  };

  const sendApplication = async () => {
    const token = await getAccessTokenSilently();
    user &&
      ChannelService.applyMembership(
        props.channelId,
        user.id.toString(),
        form.fullName,
        form.title,
        form.affiliation,
        form.email,
        form.personalWebsite,
        //TODO: Error handling
        () => {},
        token
      );
    // TODO: add error handling if email is not succesffully sent.
    handleClearForm();
  };

  const handleClearForm = () => {
    // prevents the page from being refreshed on form submission
    // setState({
    //   user:{
    //     speaker_title: "",
    //     speaker_name: "",
    //     // speaker_position : "",
    //     email: "",
    //     personalWebsite: "",
    //     personalMessage: "",
    //     affiliation: ""
    //     },
    //   talk: {
    //     talk_title: "",
    //     abstract: "",
    //     topics: [],
    //     // date: ""
    //     }
    //   }
    // );
  };

  const toggleModal = () => {
    setShowForm(!showForm);
  };

  const isComplete = () => {
    return (
      form.fullName !== "" &&
      form.title !== "" &&
      // user.speaker_position !== "" &&
      // user.personalWebsite !== "" &&
      // user.personalMessage !== "" &&
      form.email !== "" &&
      form.affiliation !== ""
    );
  };

  const isMissing = () => {
    let res: string[] = [];
    if (form.fullName === "") {
      res.push("Full name");
    }
    if (form.title === "") {
      res.push("Title/position");
    }
    if (form.email === "") {
      res.push("Email address");
    }
    if (form.affiliation === "") {
      res.push("Affiliation");
    }
    return res;
  };

  return (
    <Box>
      <Box
        data-tip
        data-for="membership_application_button"
        focusIndicator={false}
        width={props.widthButton ? props.widthButton : "12vw"}
        background="white"
        round="xsmall"
        height={props.height ? props.height : "30px"}
        pad={{ bottom: "6px", top: "6px", left: "3px", right: "3px" }}
        onClick={() => setShowForm(true)}
        style={{
          border: "1px solid #C2C2C2",
          minWidth: "25px",
        }}
        hoverIndicator={true}
        justify="center"
      >
        <Text size="14px" color="grey" alignSelf="center">
          Become a member
        </Text>
        <ReactTooltip id="membership_application_button" effect="solid">
          Get the instant access to all future seminars and past event
          recordings
        </ReactTooltip>
      </Box>

      <Overlay
        visible={showForm}
        onEsc={toggleModal}
        onCancelClick={toggleModal}
        onClickOutside={toggleModal}
        onSubmitClick={handleFormSubmit}
        submitButtonText="Apply"
        canProceed={isComplete()}
        isMissing={isMissing()}
        width={900}
        height={400}
        contentHeight="350px"
        title={"Membership application"}
      >
        {user === null && (
          <>
            <Box style={{ minHeight: "40%" }} />
            <Box direction="row" align="center" gap="10px">
              <LoginButton callback={() => {}} />
              <Text size="14px"> or </Text>
              <SignUpButton callback={() => {}} />
              <Text size="14px"> to apply </Text>
            </Box>
          </>
        )}

        {user && (
          <OverlaySection>
            <Box width="100%" gap="1px">
              <TextInput
                placeholder="Full name"
                value={form.fullName}
                onChange={(e: any) => handleInput(e, "fullName")}
              />
            </Box>
            <Box width="100%" gap="1px">
              <Select
                placeholder="Education"
                options={titleOptions}
                value={form.title}
                onChange={({ option }) => setValueAcademicTitle(option)}
              />
            </Box>
            <Box width="100%" gap="1px">
              <TextInput
                placeholder="Current affiliation"
                value={form.affiliation}
                onChange={(e: any) => handleInput(e, "affiliation")}
              />
            </Box>
            <Box width="100%" gap="1px">
              <TextInput
                placeholder="Email address"
                value={form.email}
                onChange={(e: any) => handleInput(e, "email")}
              />
            </Box>
            <Box width="100%" gap="1px">
              <TextInput
                placeholder="(Personal website)"
                value={form.personalWebsite}
                onChange={(e: any) => handleInput(e, "personalWebsite")}
              />
            </Box>
          </OverlaySection>
        )}
      </Overlay>
    </Box>
  );
};
