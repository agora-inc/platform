import React, { Component } from "react";
import { Box, Select, Text } from "grommet";
import ReactTooltip from "react-tooltip";
import { StatusInfo } from "grommet-icons";


function range(end: number) {
  return Array.from(Array(end).keys())
}

interface Props {
  channelId: number
}

interface State {
  remainder1day: string;
  remainder1hour: string;
  remainder2day: string;
  remainder2hour: string;
}

export default class EmailsTab extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      remainder1day: "",
      remainder1hour: "",
      remainder2day: "",
      remainder2hour: "",
    };
  }



  render() {
    var reminders_email = "Select the default option for sending reminder emails"

    return (
      <Box direction="column" gap="20px">
        <Box direction="row" gap="small" margin={{ bottom: "0px" }}>
          <Text size="16px" weight="bold" color="black"> 
            Email reminders 
          </Text>
          <StatusInfo style={{marginTop: "3px"}} size="small" data-tip={reminders_email} data-for='reminder-emails'/>
          <ReactTooltip id='reminder-emails' place="right" effect="solid" html={true}/>
        </Box>

        <Box direction="row" gap="6px">
          <Text size="16px" color="grey" margin={{right: "20px"}} > Reminder 1 </Text>
          <input
            value={this.state.remainder1day}
            onChange={(e) => this.setState({ remainder1day: e.target.value })}
            style={{
              width: "30px", height: "20px", border: "1.5px solid #CCCCCC", borderRadius: "3px"
            }}
            
          />
          <Text size="16px" color="grey" margin={{right: "15px"}}> day(s) </Text>
          <input
            value={this.state.remainder1hour}
            onChange={(e) => this.setState({ remainder1hour: e.target.value })}
            style={{
              width: "30px", height: "20px", border: "1.5px solid #CCCCCC", borderRadius: "3px"
            }}
          />
          <Text size="16px" color="grey"> hour(s) </Text>
        </Box>

        <Box direction="row" gap="6px">
          <Text size="16px" color="grey" margin={{right: "20px"}} > Reminder 2 </Text>
          <input
            value={this.state.remainder2day}
            onChange={(e) => this.setState({ remainder2day: e.target.value })}
            style={{
              width: "30px", height: "20px", border: "1.5px solid #CCCCCC", borderRadius: "3px"
            }}
            
          />
          <Text size="16px" color="grey" margin={{right: "15px"}}> day(s) </Text>
          <input
            value={this.state.remainder2hour}
            onChange={(e) => this.setState({ remainder2hour: e.target.value })}
            style={{
              width: "30px", height: "20px", border: "1.5px solid #CCCCCC", borderRadius: "3px"
            }}
          />
          <Text size="16px" color="grey"> hour(s) </Text>
        </Box>



        <Box direction="row" gap="small" margin={{ top: "40px" }}>
          <Text size="16px" weight="bold" color="black"> 
            Send custom email to your audience
          </Text>
          <StatusInfo style={{marginTop: "3px"}} size="small" data-tip={reminders_email} data-for='reminder-emails'/>
          <ReactTooltip id='reminder-emails' place="right" effect="solid" html={true}/>
        </Box>
      </Box>
    );
  }
}

