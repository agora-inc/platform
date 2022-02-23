import React, { Component } from "react";
import { Box, Button, Text, Grid } from "grommet";
import { FormNext } from "grommet-icons";
import { Link, useHistory, Redirect } from "react-router-dom";
import { Overlay, OverlaySection } from "../../Core/Overlay";
import { Talk, TalkService } from "../../../Services/TalkService";
import { User } from "../../../Services/UserService";
import TalkRegistrationFormButton from "../Talkcard/TalkRegistrationFormButton";
import { ChannelService } from "../../../Services/ChannelService";
import SignUpButton from "../../Account/SignUpButton";
import CalendarButtons from "../CalendarButtons";
import ShareButtons from "../../Core/ShareButtons";
import ReactTooltip from "react-tooltip";

interface Props {
  talk: Talk;
  user: User | null;
  role: string | undefined;
  registered: boolean;
  registrationStatus: string;
}

interface State {
  feedbackMsg: {
    confirmationMsg: string;
    errorMsg: string;
  };
  showForm: boolean;
  feedbackModal: boolean;
  joinLobby: boolean;
}

export default class TalkRegistrationButton extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      feedbackMsg: {
        confirmationMsg:
          "Successful registration. You will automatically receive the information regarding that event by email as soon as an administrator treated your request.",
        errorMsg: "",
      },
      showForm: false,
      feedbackModal: false,
      joinLobby: false,
    };
  }

  returnRestrictedAndTitle = () => {
    if (this.props.talk.visibility === "Everybody") {
      return { restricted: false, mainTitle: "This event is public" };
    } else {
      if (this.props.role === "owner") {
        return {
          restricted: false,
          mainTitle: "You are an administrator of this agora",
        };
      } else if (this.props.role === "member") {
        return {
          restricted: false,
          mainTitle: "You are a member of this agora",
        };
      } else if (this.props.registered) {
        return {
          restricted: false,
          mainTitle: "You are already registered to this event",
        };
      } else if (this.props.registrationStatus === "pending") {
        return { restricted: true, mainTitle: "Registration pending" };
      } else {
        return {
          restricted: true,
          mainTitle: "This event has a controlled audience",
        };
      }
    }
  };

  toggleModal = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  render() {
    const { restricted, mainTitle } = this.returnRestrictedAndTitle();
    if (this.state.joinLobby) {
      window.scrollTo(0, 0);
      return <Redirect to={`/event/${this.props.talk.id}`} push={true} />;
    } else {
      return (
        <Box style={{ maxHeight: "35px" }}>
          {/*<Button
            data-tip data-for='apply_give_talk'
            label="Register"
            onClick={this.toggleModal}
            style={{
              width: 160,
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
            data-tip
            data-for="apply_give_talk"
            onClick={
              restricted
                ? this.toggleModal
                : () => this.setState({ joinLobby: true })
            }
            background="white"
            round="xsmall"
            width="160px"
            height="35px"
            justify="center"
            align="center"
            focusIndicator={true}
            hoverIndicator="#EEEEEE"
          >
            <Text weight="bold" size="15px">
              Enter
            </Text>
          </Box>
          <ReactTooltip id="apply_give_talk" effect="solid">
            Click to join the lobby
          </ReactTooltip>

          {restricted && (
            <Overlay
              visible={this.state.showForm}
              onEsc={this.toggleModal}
              onCancelClick={this.toggleModal}
              onClickOutside={this.toggleModal}
              onSubmitClick={() => {}}
              submitButtonText="Register"
              canProceed={false}
              disableSubmitButton={true}
              isMissing={[]}
              width={500}
              height={450}
              contentHeight="300px"
              title={"How to attend"}
            >
              <OverlaySection>
                {/* !restricted && (
            <>
            <Grid
              rows={['80px', '30px', '40px', '40px']}
              columns={['430px']}
              gap="small"
              areas={[
                  { name: 'info', start: [0, 0], end: [0, 0] },
                  { name: 'you_can_also', start: [0, 1], end: [0, 1] },
                  { name: 'calendar', start: [0, 2], end: [0, 2] },
                  { name: 'share', start: [0, 3], end: [0, 3] },
                  // { name: 'register_suggestion', start: [0, 4], end: [0, 4] },
              ]}
            >
              <Box gridArea="info" direction="column" align="start" gap="10px" >  
                <Text weight="bold" size="20px"> 
                  {mainTitle}
                </Text>
                <Box direction="row" align="center" pad="xsmall">
                  <FormNext size="20px" />
                  <Text size="14px"> The link will be displayed </Text>
                  <Box pad="xsmall">
                    <Link to={`/event/${this.props.talk.id}`} target="_blank">
                      <Text size="16px" weight="bold" color="#0C385B"> here </Text>
                    </Link>
                  </Box>
                  <Text size="14px"> shortly before the start. </Text>
                </Box>
              </Box>

              <Box gridArea="you_can_also" align="start" pad="10px">
                <Text
                  weight="bold"
                  size="14px"
                >
                  Next steps
                </Text>
              </Box>

              <Box gridArea="calendar" pad="xsmall" direction="row" align="center">
                <FormNext size="20px" />
                <Text size="14px" margin={{right: "10px"}}> Add this event to your calendar </Text>
                <Box pad="xsmall">
                  <CalendarButtons talk={this.props.talk} height="30px" />
                </Box>
              </Box>

              <Box gridArea="share" direction="row" pad="xsmall" align="center">
                <FormNext size="20px" />
                <Text size="14px" margin={{right: "10px"}}> Share it </Text> 
                <Box align="center" pad="xsmall">
                  <ShareButtons talk={this.props.talk} height="30px"/>
                </Box>
              </Box>
            </Grid>
            </>
          )*/}

                {this.props.registrationStatus !== "pending" && (
                  <>
                    <Grid
                      rows={["80px", "60px", "40px", "40px"]}
                      columns={["430px"]}
                      // gap="small"
                      areas={[
                        { name: "info", start: [0, 0], end: [0, 0] },
                        { name: "fill-in", start: [0, 1], end: [0, 1] },
                        { name: "member_info", start: [0, 2], end: [0, 2] },
                        { name: "sign-in", start: [0, 3], end: [0, 3] },
                      ]}
                    >
                      <Box
                        gridArea="info"
                        direction="column"
                        align="start"
                        justify="start"
                        gap="10px"
                      >
                        <Text weight="bold" size="20px" textAlign="start">
                          {mainTitle}
                        </Text>
                        <Box
                          direction="row"
                          align="center"
                          pad="1px"
                          justify="start"
                        >
                          <Text size="14px">
                            {" "}
                            To receive via email the link to the seminar:{" "}
                          </Text>
                        </Box>
                      </Box>

                      <Box gridArea="fill-in" pad="xsmall" align="center">
                        <TalkRegistrationFormButton
                          text="Fill in this form"
                          talk={this.props.talk}
                          user={this.props.user}
                          callback={this.toggleModal}
                        />
                      </Box>
                      {/* <Box gridArea="member_info" direction="column" align="start" justify="start" gap="10px" >
                  <Box direction="row" align="center" pad="1px" justify="start">
                    <Text size="14px">If you are a member of <b>{this.props.talk.channel_name}</b>, simply</Text>
                  </Box>
                </Box>
                
                <Box gridArea="sign-in" pad="xsmall" align="center">
                  <LoginModal
                    callback={() => {
                      return (
                        <Redirect to={`/event/${this.props.talk.id}`}/>
                      )
                    }}
                  />
                </Box> */}
                    </Grid>
                  </>

                  /*<>
            <Grid
              rows={['90px', '20px', '40px', '40px', '40px']}
              columns={['430px']}
              gap="small"
              areas={[
                  { name: 'info', start: [0, 0], end: [0, 0] },
                  { name: 'you_can_also', start: [0, 1], end: [0, 1] },
                  { name: 'calendar', start: [0, 2], end: [0, 2] },
                  { name: 'share', start: [0, 3], end: [0, 3] },
                  { name: 'register_suggestion', start: [0, 4], end: [0, 4] }
              ]}
            >
              <Box gridArea="info" direction="column" align="start" gap="10px" >
                
                <Text weight="bold" size="20px"> 
                  This event has a controlled audience
                </Text>
                <Box direction="row" align="center" pad="xsmall">
                  <FormNext size="20px" />
                  <Text size="14px">  To receive the link to the seminar </Text>
                  <Box pad="xsmall">
                    <TalkRegistrationFormButton
                        text="Fill in this form"
                        talk={this.props.talk}
                        user={this.props.user}
                    />
                  </Box>
                </Box>
              </Box>
              <Box gridArea="you_can_also" align="start">
                <Text
                  weight="bold"
                  size="20px"
                >
                  Next steps
                </Text>
              </Box>
              <Box gridArea="calendar" pad="xsmall" direction="row" align="center">
                <FormNext size="20px" />
                <Text size="14px"> Add this event to your calendar </Text>
                <Box pad="xsmall">
                  <CalendarButtons talk={this.props.talk} height="30px" />
                </Box>
              </Box>
              <Box gridArea="share" direction="row" pad="xsmall" align="center">
                <FormNext size="20px" />
                <Text size="14px"> Share this event </Text> 
                <Box align="center" pad="xsmall">
                  <ShareButtons talk={this.props.talk} height="30px"/>
                </Box>
              </Box>
              <Box gridArea="register_suggestion" direction="row" pad="xsmall" align="center">
                <FormNext size="20px" />
                <LoginModal
                  // open={this.props.showLogin}
                  callback={() => {
                  // this.setState(
                  //     {
                  //     isLoggedIn: UserService.isLoggedIn(),
                  //     user: UserService.getCurrentUser(),
                  //     },
                  //     () => {
                  //     this.fetchChannels();
                  //     }
                  // );
                  }}
                /> 
                <Text size="14px" margin={{left: "8px", right: "8px"}}> or </Text> 
                <SignUpButton callback={() => {}} />
                <Text size="14px" margin={{left: "8px", right: "4px"}}> to put it in your </Text>   
                <Text size="14px" style={{fontStyle: "italic"}}> Saved talks </Text>
              </Box>
            </Grid>        
            </>
            */
                )}

                {this.props.registrationStatus === "pending" && (
                  <>
                    <Grid
                      rows={["80px", "30px", "85px", "40px", "40px"]}
                      columns={["430px"]}
                      // gap="small"
                      areas={[
                        { name: "info", start: [0, 0], end: [0, 0] },
                        { name: "you-can-also", start: [0, 1], end: [0, 1] },
                        { name: "agora-member", start: [0, 2], end: [0, 2] },
                        { name: "calendar", start: [0, 3], end: [0, 3] },
                        { name: "share", start: [0, 4], end: [0, 4] },
                      ]}
                    >
                      <Box
                        gridArea="info"
                        direction="column"
                        align="start"
                        gap="10px"
                      >
                        <Text weight="bold" size="20px">
                          {mainTitle}
                        </Text>
                        <Box direction="row" align="center" pad="xsmall">
                          <FormNext size="20px" />
                          <Text size="14px">
                            {" "}
                            Please wait for the approval from the event
                            organiser{" "}
                          </Text>
                        </Box>
                      </Box>

                      <Box gridArea="you-can-also" align="start" pad="12px">
                        <Text weight="bold" size="14px">
                          Next steps
                        </Text>
                      </Box>

                      <Box
                        gridArea="agora-member"
                        gap="2px"
                        pad="xsmall"
                        direction="column"
                        align="start"
                        justify="center"
                      >
                        <Box direction="row" align="center">
                          <FormNext size="20px" />
                          <Text size="14px"> Apply to become a member of </Text>
                        </Box>
                        <Link
                          className="channel"
                          to={`/${this.props.talk.channel_name}`}
                          style={{ textDecoration: "none" }}
                        >
                          <Box
                            direction="row"
                            gap="xsmall"
                            align="center"
                            round="xsmall"
                            pad={{ vertical: "6px", horizontal: "6px" }}
                            margin={{ start: "25px" }}
                          >
                            <Box
                              justify="center"
                              align="center"
                              background="#efeff1"
                              overflow="hidden"
                              style={{
                                minHeight: 14,
                                minWidth: 14,
                                borderRadius: 7,
                              }}
                            >
                              <img
                                src={ChannelService.getAvatar(
                                  this.props.talk.channel_id
                                )}
                                height={14}
                                width={14}
                              />
                            </Box>
                            <Box justify="between">
                              <Text weight="bold" size="14px" color="black">
                                {this.props.talk.channel_name}
                              </Text>
                            </Box>
                          </Box>
                        </Link>
                        <Text size="14px" margin={{ start: "20px" }}>
                          {" "}
                          for an easier access to future seminars{" "}
                        </Text>
                      </Box>

                      <Box
                        gridArea="calendar"
                        pad="xsmall"
                        direction="row"
                        align="center"
                      >
                        <FormNext size="20px" />
                        <Text size="14px" margin={{ right: "10px" }}>
                          {" "}
                          Add this event to your calendar{" "}
                        </Text>
                        <Box pad="xsmall">
                          <CalendarButtons
                            talk={this.props.talk}
                            height="30px"
                          />
                        </Box>
                      </Box>

                      <Box
                        gridArea="share"
                        direction="row"
                        pad="xsmall"
                        align="center"
                      >
                        <FormNext size="20px" />
                        <Text size="14px" margin={{ right: "10px" }}>
                          {" "}
                          Share it{" "}
                        </Text>
                        <Box align="center" pad="xsmall">
                          <ShareButtons talk={this.props.talk} height="30px" />
                        </Box>
                      </Box>
                    </Grid>
                  </>
                )}
              </OverlaySection>
            </Overlay>
          )}
        </Box>
      );
    }
  }
}
