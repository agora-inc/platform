import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { Box, TextInput, TextArea, Text, Layer, Heading } from "grommet";
import { Overlay } from "../Core/Overlay";
import { User, UserService } from "../../Services/UserService";
import { Presentation, ProfileService } from "../../Services/ProfileService";
import { Workshop, StatusCritical } from "grommet-icons";
import { LoginButton } from "../Account/LoginButton";
import { useStore } from "../../store";
import { useAuth0 } from "@auth0/auth0-react";

type Props = {
  width?: string;
  height?: string;
  iconSize?: string;
  textSize?: string;
  addNewPresentation?: any;
};

export const CreatePresentationButton = (props: Props) => {
  const [showFormOverlay, setshowFormOverlay] = useState(false);
  const [showSignUpOverlay, setShowSignUpOverlay] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [duration, setDuration] = useState(0);

  // sign up fields
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [institution, setInstitution] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  const formatDate = (d: Date): string => {
    return d.toISOString().slice(0, 19).replace("T", " ");
  };

  const submitPresentation = async (history: any) => {
    let now = new Date();
    if (user) {
      // If logged in, presentation is saved and user is redirect to profile page (make sure it exists)
      let temp_presentation: Presentation = {
        id: -1,
        user_id: user.id,
        title: title,
        description: description,
        link: link,
        duration: duration,
        date_created: formatDate(now),
      };

      const token = await getAccessTokenSilently();

      ProfileService.updatePresentation(
        user.id,
        temp_presentation,
        formatDate(now),
        (id: number) => {
          temp_presentation.id = id;
          if (props.addNewPresentation) {
            props.addNewPresentation(temp_presentation);
          }
          return history.push("/profile/" + user.id);
        },
        token
      );
    } else {
      // If not logged in, Open another overlay "Sign up to save and advertise your presentation" or log in instead
      // If already have an account, log in instead
      // on submit, create an account with all the info, create a profile, create the presentation under that profile
      // redirect to profile page
      setshowFormOverlay(false);
      setShowSignUpOverlay(true);
    }
  };

  const onLogin = async (history: any) => {
    if (!user) {
      return;
    }

    const token = await getAccessTokenSilently();

    // create presentation
    let now = new Date();
    let temp_presentation: Presentation = {
      id: -1,
      user_id: user.id,
      title: title,
      description: description,
      link: link,
      duration: duration,
      date_created: formatDate(now),
    };
    ProfileService.updatePresentation(
      user.id,
      temp_presentation,
      formatDate(now),
      (id: number) => {
        temp_presentation.id = id;
        if (props.addNewPresentation) {
          props.addNewPresentation(temp_presentation);
        }
      },
      token
    );

    // move history
    history.push("/profile/" + String(user.id));
  };

  // function onSignup(history: any): void {
  //   UserService.register(
  //     fullName,
  //     password,
  //     email,
  //     position,
  //     institution,
  //     0,
  //     (result: {status: string, userId: number}) => {
  //       if (result.status === "ok") {
  //         let now = new Date;
  //         let temp_presentation: Presentation = {
  //           id: -1,
  //           user_id: result.userId,
  //           title: title,
  //           description: description,
  //           link: link,
  //           duration: duration,
  //           date_created: formatDate(now),
  //         }
  //         ProfileService.createProfile(
  //           result.userId,
  //           fullName,
  //           () => {}
  //         )
  //         ProfileService.updatePresentation(
  //           result.userId, temp_presentation, formatDate(now),
  //           (id: number) => {
  //             temp_presentation.id = id
  //             if (props.addNewPresentation) {
  //               props.addNewPresentation(temp_presentation)
  //             }
  //           }
  //         )
  //         setShowSignUpOverlay(false)
  //         history.push('/profile/' + String(result.userId))
  //         } else {
  //         setError(result.status);
  //       }
  //     }
  //   );
  // }

  const isComplete = () => {
    return title !== "" && description !== "" && duration > 0;
  };

  const isMissing = (): string[] => {
    let res: string[] = [];
    if (title === "") {
      res.push("Title");
    }
    if (description === "") {
      res.push("Description");
    }
    if (duration === 0) {
      res.push("Duration");
    }
    return res;
  };

  return (
    <>
      <Box
        width={props.width ? props.width : "310px"}
        onClick={() => setshowFormOverlay(!showFormOverlay)}
        background="#0C385B"
        round="xsmall"
        height={props.height ? props.height : "80px"}
        justify="center"
        align="center"
        focusIndicator={false}
        hoverIndicator="#BAD6DB"
        direction="row"
      >
        <Workshop size={props.iconSize ? props.iconSize : "30px"} />
        <Text
          size={props.textSize ? props.textSize : "18px"}
          margin={{ left: "10px" }}
        >
          <b>Get invited</b> to speak
        </Text>
      </Box>
      <Route
        render={({ history }) => (
          <>
            <Overlay
              visible={showFormOverlay}
              onEsc={() => setshowFormOverlay(false)}
              onCancelClick={() => setshowFormOverlay(false)}
              onClickOutside={() => setshowFormOverlay(false)}
              onSubmitClick={() => {
                submitPresentation(history);
                setshowFormOverlay(false);
              }}
              submitButtonText="Continue"
              canProceed={isComplete()}
              isMissing={isMissing()}
              width={600}
              height={450}
              contentHeight="300px"
              title={"Describe your future talk to receive invitations!"}
            >
              <Box width="100%" gap="10px" margin={{ top: "5px" }}>
                <TextInput
                  placeholder="Title"
                  value={title}
                  onChange={(e: any) => setTitle(e.target.value)}
                />
                <TextArea
                  placeholder={"Description"}
                  value={description}
                  onChange={(e: any) => setDescription(e.target.value)}
                  rows={8}
                />
                <Box direction="row" gap="10px" width="80%" align="center">
                  <TextInput
                    placeholder="Title"
                    value={title}
                    onChange={(e: any) => setTitle(e.target.value)}
                  />
                  <TextArea
                    placeholder={"Description"}
                    value={description}
                    onChange={(e: any) => setDescription(e.target.value)}
                    rows={8}
                  />
                  <Box direction="row" gap="10px" width="80%" align="center">
                    <TextInput
                      style={{ width: "200px" }}
                      placeholder="Link to paper/slides"
                      value={link}
                      onChange={(e: any) => setLink(e.target.value)}
                    />
                    <Box direction="row" gap="10px" align="center">
                      <TextInput
                        style={{ width: "90px" }}
                        placeholder="Duration"
                        value={duration}
                        onChange={(e: any) => setDuration(e.target.value)}
                      />
                      <Text size="14px">minutes</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Overlay>

            {showSignUpOverlay && (
              <Layer
                onEsc={() => {
                  setshowFormOverlay(true);
                  setShowSignUpOverlay(false);
                }}
                onClickOutside={() => {
                  setshowFormOverlay(true);
                  setShowSignUpOverlay(false);
                }}
                modal
                responsive
                animation="fadeIn"
                style={{
                  width: 500,
                  height: 640,
                  borderRadius: 15,
                }}
              >
                <Box align="center" width="100%">
                  <Box
                    justify="start"
                    width="99.7%"
                    background="#eaf1f1"
                    align="center"
                    direction="row"
                    style={{
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                      position: "sticky",
                      top: 0,
                      minHeight: "55px",
                      zIndex: 10,
                    }}
                  >
                    <Box pad="30px" alignSelf="center" fill={true}>
                      <Text size="16px" color="black" weight="bold">
                        Sign up to get invited!
                      </Text>
                    </Box>
                  </Box>

                  {error !== "" && (
                    <Box
                      style={{ width: "100%" }}
                      background="#DDDDDD"
                      round="small"
                      pad="small"
                      gap="small"
                      direction="row"
                    >
                      <StatusCritical />
                      <Heading level={5} margin="none" color="grey">
                        {/*Error: {this.state.error}*/}
                        Error: Username or email already taken.
                      </Heading>
                    </Box>
                  )}

                  <Box
                    width="90%"
                    overflow="auto"
                    align="center"
                    gap="5px"
                    margin={{ top: "20px" }}
                  >
                    <Text size="12px" color="black" margin={{ bottom: "12px" }}>
                      You need a personal account to edit your presentation and
                      profile. This account will be associated with you as an
                      individual.
                    </Text>
                    {/* <TextInput
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                  /> */}
                    <TextInput
                      placeholder="Full name"
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <TextInput
                      placeholder="Position"
                      onChange={(e) => setPosition(e.target.value)}
                    />
                    <TextInput
                      placeholder="Institution"
                      onChange={(e) => setInstitution(e.target.value)}
                    />
                    <TextInput
                      placeholder="Academic email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextInput
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* <TextInput
                    type="password"
                    placeholder="Confirm password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  /> */}
                  </Box>
                </Box>

                <Box
                  style={{ minHeight: "30px" }}
                  direction="row"
                  alignSelf="end"
                  margin={{ top: "15px", bottom: "18px", right: "5%" }}
                >
                  <Box
                    style={{ minHeight: "30px" }}
                    direction="row"
                    alignSelf="end"
                    margin={{ top: "15px", bottom: "18px", right: "5%" }}
                  >
                    <Box
                      // onClick={() => onSignup(history)}
                      background="#0C385B"
                      hoverIndicator="#BAD6DB"
                      focusIndicator={false}
                      align="center"
                      justify="center"
                      width="100px"
                      height="35px"
                      round="xsmall"
                    >
                      <Text size="14px" weight="bold">
                        {" "}
                        Sign up{" "}
                      </Text>
                    </Box>
                  </Box>

                  <hr
                    style={{
                      width: "90%",
                      color: "#EEEEEE",
                      borderColor: "#EEEEEE",
                      backgroundColor: "#EEEEEE",
                    }}
                  />

                  <Text size="12px" color="black" style={{ width: "50%" }}>
                    If you already have an account, log in to add your new
                    presentation
                  </Text>
                  <LoginButton callback={() => onLogin(history)} />
                </Box>
              </Layer>
            )}
          </>
        )}
      />
    </>
  );
};
