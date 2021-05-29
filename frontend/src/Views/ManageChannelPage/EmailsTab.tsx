import React, { Component } from "react";
import { Box, Select, Text, TextArea } from "grommet";
import ReactTooltip from "react-tooltip";
import { StatusInfo, Close } from "grommet-icons";
import { ChannelService } from "../../Services/ChannelService";


function range(end: number) {
  return Array.from(Array(end).keys())
}

type Reminder = {
  exist: boolean;
  days: number;
  hours: number; 
}

interface Props {
  channelId: number
}

interface State {
  reminders: Reminder[];
  mailingList: string;
  listEmailCorrect: string[];
  strEmailWrong: string;
}

export default class EmailsTab extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      reminders: [
        {exist: false, days: 0, hours: 0},
        {exist: false, days: 0, hours: 0}
      ],
      mailingList: "",
      listEmailCorrect: [],
      strEmailWrong: "",
    }
    this.getListEmail();
  }

  getListEmail = () => {
    ChannelService.getMailingList(
      this.props.channelId,
      (listEmailCorrect: string[]) => {
        this.setState({ listEmailCorrect });
      }
    )
  }

  toggleReminder = (i: number) => {
    return (
      () => {
        this.setState(prevState => {
          let reminders = prevState.reminders;
          reminders[i].exist = !reminders[i].exist;
          return {...prevState, reminders}
        })
      }
    );
  }

  pushDays = (i: number, n_days: string) => {
    this.setState(prevState => {
      let reminders = prevState.reminders;
      reminders[i].days = Number(n_days);
      return {...prevState, reminders}
    })
  }

  pushHours = (i: number, n_hours: string) => {
    this.setState(prevState => {
      let reminders = prevState.reminders;
      reminders[i].hours = Number(n_hours);
      return {...prevState, reminders}
    })
  }

  handleMailingList = (e: any) => {
    let value = e.target.value;
    this.setState({"mailingList": value});
  };

  parseMailingList = () => {
    let oldListEmail = this.state.listEmailCorrect;
    // get all emails constructed using non-alphanumerical characters except "@", ".", "_", and "-"
    let regExtraction = this.state.mailingList.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
    if (regExtraction === null){
      regExtraction = []
    }

    // filtering new admissibles emails from badly formatted ones
    let newListEmail = []
    let strEmailWrong = this.state.mailingList;
    for (var email of regExtraction) {
      let emailLower = email.toLowerCase();
      if (!oldListEmail.includes(emailLower)) {
        newListEmail.push(emailLower);
      }
      strEmailWrong = strEmailWrong.replace(email, "");
    }

    // clean box if empty
    strEmailWrong = strEmailWrong.replace(/[/\n\;\,]/g, " ")
    if (strEmailWrong.replace(/[\s]/g, "") === ""){
      strEmailWrong = "";
    }

    // add admissible emails to database
    ChannelService.addToMailingList(
      this.props.channelId,
      newListEmail,
      () => {},
    );

    this.setState({ listEmailCorrect: oldListEmail.concat(newListEmail) });
    this.setState({ strEmailWrong });
    this.setState({ mailingList: strEmailWrong})
  };

  renderReminder = (j: number) => {
    return (
      <Box direction="row" gap="6px" align="center">
        <Text size="16px" color="grey" margin={{right: "20px"}} > 
          Reminder {j+1}
        </Text>
        {!this.state.reminders[j].exist && (
          <Box
            focusIndicator={false}
            background="white"
            round="xsmall"
            pad={{ vertical: "2px", horizontal: "xsmall" }}
            onClick={this.toggleReminder(j)}
            style={{
              width: "60px", height: "26px",
              border: "1px solid #C2C2C2",
            }}
            hoverIndicator={true}
            align="center"
          >
            <Text color="grey" size="small"> 
              + Add 
            </Text>
          </Box>
        )}
        {this.state.reminders[j].exist && (
          <Box direction="row" gap="6px" align="center" justify="center">
            <input
              value={this.state.reminders[j].days}
              onChange={(e) => this.pushDays(j, e.target.value)}
              style={{
                width: "30px", height: "26px", padding: "4px",
                border: "1px solid #C2C2C2", borderRadius: "5px", 
              }}
            />
            <Text size="16px" color="grey" margin={{right: "15px"}}> day(s) </Text>
            <input
              value={this.state.reminders[j].hours}
              onChange={(e) => this.pushHours(j, e.target.value)}
              style={{
                width: "30px", height: "26px", padding: "4px",
                border: "1px solid #C2C2C2", borderRadius: "5px", 
              }}
            />
            <Text size="16px" color="grey" margin={{right: "20px"}}> hour(s) </Text>
            <Close size="20px" onClick={this.toggleReminder(j)} />
          </Box>
        )}
      </Box>
    ); 
  }


  render() {
    var reminders_email = "A reminder email will be sent to <br/>" + 
    "- your mailing list <br/>" +
    "- your followers <br/>" + 
    "- the registered participants <br/>" + 
    "before the start of your seminars. Decide how much time before, with up to two reminders."
    var mailing_list = "Add emails to your agora mailing list <br/>" + 
    "Example: joe@uni.ac.uk, jack@company.com"

    return (
      <Box direction="column" gap="20px">
        { /* <Box direction="row" gap="small" margin={{ bottom: "0px" }}>
          <Text size="16px" weight="bold" color="black"> 
            Email reminders
          </Text>
          <Text size="14px" style={{fontStyle: "italic", marginTop: "1.7px"}}  color="black"> 
            Default settings 
          </Text>
          <StatusInfo style={{marginTop: "3px"}} size="small" data-tip={reminders_email} data-for='reminder-emails'/>
          <ReactTooltip id='reminder-emails' place="right" effect="solid" html={true}/>
        </Box>

        {this.renderReminder(0)}
        {this.renderReminder(1)}
    */}

        <Box 
          direction="row"
          width="100%"
          gap="25%"
          margin={{top: "12px"}}
        >
          <Box 
            direction="column"
            width="50%"
            margin={{bottom: "50px"}}
          >
            <Box 
              direction="row"
              gap="small"
              margin={{bottom: "12px" }}
            >
              <Text size="14px" color="grey">
                Add people to your mailing list
              </Text>
              <StatusInfo style={{marginTop: "3px"}} size="small" data-tip={mailing_list} data-for='mailing-list'/>
              <ReactTooltip id='mailing-list' place="right" effect="solid" html={true}/>
            </Box>
            
            <TextArea
              placeholder="Enter your list of emails"
              value={this.state.mailingList}
              onChange={(e: any) => this.handleMailingList(e)}
              rows={4}
              style={{border: this.state.strEmailWrong.length === 0 ? "2px solid black" : "2px solid red"}}
              data-tip data-for='email'
            />
            <Box direction="row" width="100%" margin={{top: "15px"}}>
              <Box width="100%" direction="column"> 
                {this.state.listEmailCorrect.length > 0 && (
                  <Text color="green" size="14px" margin={{bottom: "6px"}}>
                    Emails successfully extracted from text.
                  </Text>
                )}
                {this.state.strEmailWrong.length > 0 && (
                  <Text color="red" size="14px">
                    Some emails are in the wrong format.
                  </Text>
                )}
              </Box>
              <Box
                onClick={this.parseMailingList}
                background="#0C385B"
                round="xsmall"
                // pad="xsmall"
                height="30px"
                width="18%"
                justify="center"
                align="center"
                focusIndicator={false}
                hoverIndicator="#0C385B"
              >
                <Text size="14px"> Add </Text>
              </Box>
            </Box>
          </Box>
          <Box 
            direction="column"
            width="25%"
            
          >
            <Text size="14px" color="grey" margin={{bottom: "12px"}}>
              Your mailing list ({this.state.listEmailCorrect.length})
            </Text>
            <Box
              height="134px"
              gap="2px" 
              overflow="auto"
              margin={{ bottom: "15px", left:"8px" }}
            >
              {this.state.listEmailCorrect.map((email: string) => (
                <Text size="12px"> {email} </Text>
              ))}
            </Box>
          </Box>
        </Box> 

        {/* <Box direction="row" gap="small">
          <Text size="16px" weight="bold" color="black"> 
            Send custom email to your audience
          </Text>
          <StatusInfo style={{marginTop: "3px"}} size="small" data-tip={reminders_email} data-for='reminder-emails'/>
          <ReactTooltip id='reminder-emails' place="right" effect="solid" html={true}/>
        </Box>
        
        <Text size="18px" weight="bold" color="#6DA3C7"> 
          Available soon!
        </Text> */}
      </Box> 
    );
  }
}

