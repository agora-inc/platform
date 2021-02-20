import React, { Component } from "react";
import {
  Box,
  Button,
  Text,
  Grid
} from "grommet";
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
      <Box style={{maxHeight: "30px"}}>
        <Button
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
        />
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
        {!(this.props.talk.visibility == "Everybody") || (
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

        {(this.props.talk.visibility == "Everybody") || (
            // <>
            //     <Text> 
            //         This event has a restricted audience.
            //     </Text>
            //     <Text> 
                //     To receive the seminar URL, you need to
                // </Text>
                // <TalkRegistrationFormButton
                //     talk={this.props.talk}
                //     user={this.props.user}
                // /> 
            //     <Box direction="column" align="center">
            //         <Box height="90px" direction="row">You can enjoy a free access to all the seminars of by 
            //             becoming a member of !
            //         </Box>
            //     </Box>
            // </>
            <>
                <Grid
                    rows={['80px', '30px', '30px', '50px', '50px']}
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
                        This event has a restricted audience.
                        </Text>
                        To receive the seminar URL, you need to
                        <Box pad="xsmall">
                            <TalkRegistrationFormButton
                                talk={this.props.talk}
                                user={this.props.user}
                            />
                        </Box>
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
                            <Box pad="xsmall">
                                <CalendarButtons
                                        talk={this.props.talk}
                                    />
                            </Box>
                    </Box>
                    <Box gridArea="share" direction="column" pad="xsmall">
                        2. Share this event with your friends and colleagues! 
                        <Box align="center" pad="xsmall">
                            <ShareButtons talk={this.props.talk}/>
                        </Box>
                    </Box>
                    <Box gridArea="register_suggestion" direction="row" pad="xsmall">
                        3. 
                        <Box pad="xsmall" direction="row">
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
                                /> / <SignUpButton callback={() => {}} />                    
                        </Box>
                                to save it in your "Saved talks"!
                        
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
