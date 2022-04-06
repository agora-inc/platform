import React, { useState } from "react";
import { Box, Button, Text, TextInput, Layer, Grid } from "grommet";
import { FormNext } from "grommet-icons";
import { Overlay, OverlaySection } from "../../Core/Overlay";
import { Talk, TalkService } from "../../../Services/TalkService";
import { User } from "../../../Services/UserService";
import { useStore } from "../../../store";
import { useAuth0 } from "@auth0/auth0-react";

type Form = {
  fullName: string;
  institution: string;
  email: string;
  homepage: string;
};

type FeedbackMessage = {
  confirmationMsg: string;
  errorMsg: string;
};

interface Props {
  text?: string;
  talk: Talk;
  callback: any;
}

export const TalkRegistrationFormButton = (props: Props) => {
  const [form, setForm] = useState<Form>({
    fullName: "",
    institution: "",
    email: "",
    homepage: "",
  });
  const [feedbackMsg, setFeedbackMsg] = useState<FeedbackMessage>({
    confirmationMsg:
      "Successful registration. You will automatically receive the information regarding that event by email as soon as an administrator treated your request.",
    errorMsg: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  const toggleModal = () => {
    setShowForm(!showForm);
  };

  const toggleFeedbackModal = () => {
    setFeedbackModal(!feedbackModal);
    setShowForm(false);
  };

  const toggleFeedbackAndRegistrationModal = () => {
    setFeedbackModal(!feedbackModal);
    props.callback();
  };

  const handleInput = (e: any, key: string) => {
    let value = e.target.value;
    setForm({ ...form, [key]: value });
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (user == null) return;

    const token = await getAccessTokenSilently();

    TalkService.registerForTalk(
      props.talk.id,
      user.id,
      form.fullName,
      form.email,
      form.homepage,
      form.institution,
      (res: any) => {
        // display error received from method
        if (res !== "ok") {
          setFeedbackMsg({ ...feedbackMsg, errorMsg: res });
        }
      },
      token
    );
    toggleFeedbackModal();
  };

  const isComplete = () => {
    return form.fullName !== "" && form.email !== "" && form.institution !== "";
  };

  const isMissing = () => {
    let res: string[] = [];
    if (form.fullName === "") {
      res.push("Name");
    }
    if (form.email === "") {
      res.push("Email address");
    }
    if (form.institution === "") {
      res.push("Institution");
    }
    return res;
  };

  return (
    <Box style={{ maxHeight: "35px" }}>
      {/*<Button
        label={props.text ? props.text : "Register"}
        onClick={toggleModal}
        style={{
          width: 140,
          height: 35,
          fontSize: 15,
          fontWeight: "bold",
          padding: 0,
          // margin: 6,
          backgroundColor: "#F2F2F2",
          border: "none",
          borderRadius: 7,
        }}
      />*/}
      <Box
        onClick={toggleModal}
        background="#F2F2F2"
        round="xsmall"
        width="140px"
        height="35px"
        justify="center"
        align="center"
        focusIndicator={true}
        hoverIndicator="#DDDDDD"
      >
        <Text weight="bold" size="15px">
          {props.text ? props.text : "Watch"}
        </Text>
      </Box>
      <Overlay
        visible={showForm}
        onEsc={toggleModal}
        onCancelClick={toggleModal}
        onClickOutside={toggleModal}
        onSubmitClick={handleFormSubmit}
        submitButtonText="Register"
        canProceed={isComplete()}
        isMissing={isMissing()}
        width={500}
        height={350}
        contentHeight="200px"
        title={"Registration"}
      >
        <OverlaySection>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Full name"
              value={form.fullName}
              onChange={(e: any) => handleInput(e, "fullName")}
            />
          </Box>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Current institution"
              value={form.institution}
              onChange={(e: any) => handleInput(e, "institution")}
            />
          </Box>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="Email address"
              value={form.email}
              onChange={(e: any) => handleInput(e, "email")}
            />
          </Box>
          <Box width="100%" gap="2px">
            <TextInput
              placeholder="(Homepage)"
              value={form.homepage}
              onChange={(e: any) => handleInput(e, "homepage")}
            />
          </Box>
        </OverlaySection>
      </Overlay>
      {feedbackModal && (
        <Layer
          onEsc={toggleFeedbackModal}
          onClickOutside={toggleFeedbackModal}
          style={{
            width: 350,
            height: 200,
            borderRadius: 15,
            // border: "3.5px solid black",
            padding: 20,
          }}
        >
          <>
            <Grid
              rows={["120px", "40px"]}
              columns={["300px"]}
              // gap="small"
              areas={[
                { name: "info", start: [0, 0], end: [0, 0] },
                { name: "ok", start: [0, 1], end: [0, 1] },
              ]}
            >
              <Box
                gridArea="info"
                direction="column"
                align="start"
                justify="start"
                gap="15px"
              >
                <Text weight="bold" size="20px" textAlign="start">
                  {feedbackMsg.errorMsg === ""
                    ? "Thank you for registering!"
                    : "Something went wrong..."}
                </Text>
                <Box direction="row" align="start" pad="1px" justify="start">
                  <Text size="14px">
                    {feedbackMsg.errorMsg === ""
                      ? "You will receive a conference URL by email after review by the organisers"
                      : "Please report the issue using `Feedback`. Error: " +
                        feedbackMsg.errorMsg}
                  </Text>
                </Box>
              </Box>
              <Box
                gridArea="ok"
                onClick={toggleFeedbackAndRegistrationModal}
                background="#F2F2F2"
                round="xsmall"
                width="70px"
                height="35px"
                justify="center"
                align="center"
                focusIndicator={true}
                hoverIndicator="#DDDDDD"
              >
                <Text weight="bold" size="15px">
                  OK
                </Text>
              </Box>
            </Grid>
          </>
        </Layer>
      )}
    </Box>
  );
};
