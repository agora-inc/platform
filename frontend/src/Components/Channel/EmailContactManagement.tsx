import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Text, Box, TextInput, TextArea } from "grommet";
import AsyncButton from "../Core/AsyncButton";
import { Previous, Search, UserAdmin} from "grommet-icons";
import { ChannelService } from "../../Services/ChannelService";
import Button from "../Core/Button";


interface Props {
    channelId: number,
    currentAddress: string,
    onAddAddress: any,
    onDeleteAddress: any,
}

interface State {
    insertString: string;
    currentAddress: string;
    invalidEmailFlag: boolean
}

export default class EmailContactManagement extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
        insertString: "",
        currentAddress: "",
        invalidEmailFlag: false
    };
    this.fetchContactAddresses();
    if (this.props.currentAddress !== ""){
      this.setState({currentAddress: this.props.currentAddress})
    }
    // set current_email equal to the current email in db
  }

  onType = (insertString: string) => {
      this.setState({
        insertString: insertString,
      });
    };

  fetchContactAddresses = () => {
    ChannelService.getContactAddresses(
      this.props.channelId,
      (contactAddresses: string) => {
        this.setState({ currentAddress: contactAddresses[0] });
      }
    );
  };

  onSave = () => {
    if (this.state.insertString.includes("@") 
    && !(this.state.insertString.includes(" ")) 
    && (this.state.insertString.includes("."))
    && !(this.state.insertString.includes("&"))
    && !(this.state.insertString.includes("?"))
    && !(this.state.insertString.includes("/"))
    && !(this.state.insertString.includes("#"))
    && !(this.state.insertString.includes(","))
    && !(this.state.insertString.includes("!"))
    && !(this.state.insertString.includes("%"))
    && !(this.state.insertString.includes("("))
    && !(this.state.insertString.includes(")"))
    && !(this.state.insertString.includes("{"))
    && !(this.state.insertString.includes("}"))
    && !(this.state.insertString.includes("'"))
    ){
      this.props.onDeleteAddress(this.state.currentAddress)
      this.props.onAddAddress(this.state.insertString);
      this.setState({
        currentAddress: this.state.insertString,
        insertString: "",
        invalidEmailFlag: false
    })
  } else {
      this.setState({invalidEmailFlag: true})
    }
  }

  render() {
    let invalid_email;
    if (this.state.invalidEmailFlag){
      invalid_email = <Text
                        weight="bold"
                        //   color={this.props.fill ? "white" : "black"}
                        size="16px"
                        color="red"
                        >Invalid email format</Text>
    }

    return (
        <Box margin={{top: "0px", bottom: "5px"}}>
        {this.state.currentAddress !== "" && (
          <>
            <Text
            weight="bold"
            //   color={this.props.fill ? "white" : "black"}
            size="14px"
            >Current contact email: <i>{this.state.currentAddress}</i></Text>
          </>
        )}
        {invalid_email}
        <Box gap="5px" direction="row" margin={{top: "5px"}}>
            <TextInput
            value={this.state.insertString}
            onChange={(e) => this.onType(e.target.value)}
            //   icon={<UserAdmin />}
            reverse
            placeholder="New contact email"
            style={{ width: "27vw", height: "4.5vh", justifySelf: "center" }}
            />

            <Box
              focusIndicator={false}
              width={"10vw"}
              background="white"
              round="xsmall"
              height={"30px"}
              pad={{bottom: "6px", top: "6px", left: "3px", right: "3px"}}
              onClick={this.onSave}
              style={{
                border: "1px solid #C2C2C2",
                minWidth: "25px"
              }}
              hoverIndicator={true}
              justify="center"
              >
              <Text 
                size="14px" 
                color="grey"
                alignSelf="center"
              >
                Save
              </Text>
            </Box>




        </Box>
      </Box>
    );
  }
}
