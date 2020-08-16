import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Text, Box, TextInput, TextArea } from "grommet";
import AsyncButton from "../Core/AsyncButton";
import { Previous, Search, UserAdmin} from "grommet-icons";
import { ChannelService } from "../../Services/ChannelService";
import Button from "../Core/Button";


interface Props {
}

interface State {
    insertString: string;
    current_email: string
}

export default class EmailContactManagement extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
        insertString: "",
        current_email: "jojo@gmail.com"
    };
    // set current_email equal to the current email in db
  }

  onType = (insertString: string) => {
      this.setState({
        insertString: insertString,
      });
    };

  onSave = () => {
      // delete previous value (aka current_email) dans la db
      // save new value
  }

  render() {
    return (
        <Box margin={{top: "10px", bottom: "10px"}}>
        {this.state.current_email !== "" && (
            <Text
            weight="bold"
            //   color={this.props.fill ? "white" : "black"}
            size="16px"
            >Current contact email: <i>{this.state.current_email}</i></Text>
        )}
        <Box gap="20px" direction="row" margin={{top: "20px"}}>
            <TextInput
            value={this.state.insertString}
            onChange={(e) => this.onType(e.target.value)}
            //   icon={<UserAdmin />}
            reverse
            placeholder="New email of contact."
            style={{ width: "27vw", height: "4.5vh", justifySelf: "center" }}
            />

            <Button
                height="35px"
                width="90px"
                text="Save"
                onClick={this.onSave}
              />
        </Box>

      </Box>
    );
  }
}
