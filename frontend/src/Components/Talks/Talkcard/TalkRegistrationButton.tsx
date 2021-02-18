import React, { Component } from "react";
import {
  Box,
  Button,
  Text
} from "grommet";
import { Overlay, OverlaySection } from "../../Core/Overlay";
import { Talk, TalkService } from "../../../Services/TalkService";
import { User } from "../../../Services/UserService";
import TalkRegistrationFormButton from "../Talkcard/TalkRegistrationFormButton";
import LoginModal from "../../Account/LoginModal";
import SignUpButton from "../../Account/SignUpButton";
import CalendarButtons from "../CalendarButtons";
import ShareButtons from "../../Core/ShareButtons";

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

  render() {
    return (
      <Box style={{maxHeight: "30px"}}>
        <Button
          label="Attend"
          onClick={this.toggleModal}
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
        />
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
          height={350}
          contentHeight="200px"
          title={"Registration"}
        >
        <OverlaySection>
        {!(this.props.talk.visibility == "Everybody") || (
            <>
                <Text> 
                    This event is public
                </Text>
                <Box direction="column" align="center">
                    <Box height="90px" direction="row">1. Add it to calendar!
                        <CalendarButtons
                                talk={this.props.talk}
                            />
                    </Box>
                    <Box direction="row" height="90px">2.                  
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
                            />  or  <SignUpButton callback={() => {}} />                    
                                to save it in your bookmark!
                    </Box>            
                    <Box height="90px">
                        3. Share this talk with your friends or colleagues! <ShareButtons talk={this.props.talk}/>
                    </Box>
                </Box>
            </>
        )}

        {(this.props.talk.visibility == "Everybody") || (
            <>
                <Text> 
                    This event has a restricted audience.
                </Text>
                <Text> 
                    To receive the seminar URL, you need to
                </Text>
                <TalkRegistrationFormButton
                    talk={this.props.talk}
                    user={this.props.user}
                /> 
                <Box direction="column" align="center">
                    <Box height="90px" direction="row">You can enjoy a free access to all the seminars of by 
                        becoming a member of !
                    </Box>
                </Box>
            </>
        )}
          </OverlaySection>
        </Overlay>
      </Box>
    );
  }
}
