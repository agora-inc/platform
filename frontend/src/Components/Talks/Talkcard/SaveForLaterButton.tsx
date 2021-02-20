import React, { Component } from "react";
import {
  Box,
  Button,
  Text,
  TextInput,
  Grid,
  Layer,
} from "grommet";
import { Overlay, OverlaySection } from "../../Core/Overlay";
import { Talk } from "../../../Services/TalkService";
import { User } from "../../../Services/UserService";
import LoginModal from "../../Account/LoginModal";
import SignUpButton from "../../Account/SignUpButton";
import CalendarButtons from "../CalendarButtons";
import ShareButtons from "../../Core/ShareButtons";

interface Props {
  talk: Talk,
  user: User | null;
}

interface State {
    showForm: boolean;
}

export default class TalkRegistrationButton extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      showForm: false,
    };
  }

  
  toggleModal = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  render() {
    // TO ADD: logic if user is already registered and event is already added
    return (
      <Box style={{maxHeight: "30px"}}>
        <Button
          label="Save for later"
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
          onSubmitClick={false}
          disableSubmitButton={true}
          submitButtonText=""
          canProceed={false}
          isMissing={[]}
          width={500}
          height={380}
          contentHeight="200px"
          title={"Add this talk in your 'Saved talks'"}
        >
        <OverlaySection>
            <Box direction="column" align="center">
                <Box direction="row" height="60px" gap="xsmall">
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
                    />  /  <SignUpButton callback={() => {}} />                    
                        to use this feature.
                </Box>            
            </Box>
          </OverlaySection>
        </Overlay>
      </Box>
    );
  }
}
