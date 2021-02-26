import React, { Component } from "react";
import {
  Box,
  Button,
  Text,
  Grid
} from "grommet";
import { FormNext } from "grommet-icons";
import { Overlay, OverlaySection } from "../../Core/Overlay";
import { Talk, TalkService } from "../../../Services/TalkService";
import { User } from "../../../Services/UserService";
import TalkRegistrationFormButton from "../Talkcard/TalkRegistrationFormButton";
import LoginModal from "../../Account/LoginModal";
import SignUpButton from "../../Account/SignUpButton";
import CalendarButtons from "../CalendarButtons";
import ShareButtons from "../../Core/ShareButtons";
import ReactTooltip from "react-tooltip";

interface Props {
  talk: Talk,
  user: User | null;
}

interface State {
    feedbackMsg: {
      confirmationMsg: string;
      errorMsg: string
    },
    showForm: boolean;
    feedbackModal: boolean;
}

export default class TalkRegistrationButton extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      feedbackMsg: {
        confirmationMsg: "Successful registration. You will automatically receive the information regarding that event by email as soon as an administrator treated your request.",
        errorMsg: ""
      },
      showForm: false,
      feedbackModal: false,
    };
  }

  toggleModal = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  computeEventUrl = () => {
    var url = `https://agora.stream/event/${this.props.talk.id}`;
    return url
  }

  render() {
    return (
      <Box style={{maxHeight: "35px"}}>
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
          data-tip data-for='apply_give_talk'
          onClick={this.toggleModal}
          background="white"
          round="xsmall"
          width="160px" height="35px"
          justify="center"
          align="center"
          focusIndicator={true}
          hoverIndicator="#EEEEEE"
        >
          <Text weight="bold" size="15px">
            Register 
          </Text>
        </Box> 
        <ReactTooltip id="apply_give_talk" effect="solid">
            Click to get access
          </ReactTooltip>
        <Overlay
          visible={this.state.showForm}
          onEsc={this.toggleModal}
          onCancelClick={this.toggleModal}
          onClickOutside={this.toggleModal}
          onSubmitClick={()=>{}}
          submitButtonText="Register"
          canProceed={false}
          disableSubmitButton={true}
          isMissing={[]}
          width={500}
          height={450}
          contentHeight="300px"
          title={"How to attend?"}
        >
        <OverlaySection>
        {this.props.talk.visibility === "Everybody" && (
            <>
                <Grid
                    rows={['60px', '30px', '30px', '30px', '30px']}
                    columns={['430px']}
                    gap="small"
                    areas={[
                        { name: 'info', start: [0, 0], end: [0, 0] },
                        { name: 'you_can_also', start: [0, 1], end: [0, 1] },
                        { name: 'calendar', start: [0, 2], end: [0, 2] },
                        { name: 'share', start: [0, 3], end: [0, 3] },
                        { name: 'register_suggestion', start: [0, 4], end: [0, 4] },

                    ]}
                    >
                    <Box gridArea="info" direction="column" align="center">
                        <Text weight="bold"> 
                            This event is public!
                        </Text>
                        Event URL: <a href={this.computeEventUrl()}>{this.computeEventUrl()}</a>
                    </Box>
                    <hr
                        style={{
                            color: "grey",
                            backgroundColor: "grey",
                            height: 5
                        }}
                    />
                    <Box gridArea="you_can_also" pad="xsmall" align="center">
                        <Text
                            weight="bold"
                            // size="14px"
                            // color="black"
                            style={{
                            // height: "30px",
                            // overflow: "auto",
                            fontStyle: "italic",
                            }}
                            // margin={{ bottom: "10px" }}
                        >
                            Next steps?
                            </Text>
                    </Box>
                    <Box gridArea="calendar" pad="xsmall" direction="row">
                            1. Add this event to your calendar!
                                <CalendarButtons
                                        talk={this.props.talk}
                                    />
                        </Box>
                    <Box gridArea="share" direction="column" pad="xsmall">
                        2. Apply to become a member to enjoy a frictionless access to all future seminars and talk recordings! <ShareButtons talk={this.props.talk}/>
                    </Box>
                    <Box gridArea="register_suggestion" direction="row" pad="xsmall">
                        3. <LoginModal
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
                                /> / <SignUpButton callback={() => {}} />                    
                                to save it in your "Saved talks!
                        
                    </Box>
                </Grid>
            </>
        )}

        {this.props.talk.visibility !== "Everybody" && (
          <>
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
                This event has a restricted audience
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
        )}
          </OverlaySection>
        </Overlay>
      </Box>
    );
  }
}
