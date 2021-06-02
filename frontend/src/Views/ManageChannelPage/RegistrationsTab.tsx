import React, { Component } from "react";
import { Box, DataTable, Text, CheckBox, TextInput, Grommet } from "grommet";
import { TalkService } from "../../Services/TalkService";
import ReactTooltip from "react-tooltip";
import { StatusInfo } from "grommet-icons";


const columns: any[] = [
  {
    property: 'applicant_name',
    header: <b>Name</b>,
  },
  {
    property: 'institution',
    header: <b>Institution</b>,
  },
  {
    property: 'email',
    header: <b>Email</b>,
  },
  {
    property: 'name',
    header: <b>Talk</b>,
  },
];


type Registration = {
  id: number;
  talk_id: number;
  name: string;
  applicant_name: string;
  institution: string;
  email: string;
  website: string;
  user_id: number;
  status: string
}

interface Props {
  channelId: number
}

interface State {
  allRegistrationList: Registration[],
  pendingRegistrationList: Registration[],
  acceptedRegistrationList: Registration[],
  refusedRegistrationList: Registration[]
  itemDetail?: Registration,
  autoRegistration: string;
  acceptedDomains: string[];
}

export default class RegistrationsTab extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      allRegistrationList: [],
      pendingRegistrationList: [],
      acceptedRegistrationList: [],
      refusedRegistrationList: [],
      autoRegistration: "Everybody",
      acceptedDomains: [],
    };
    this.fetchData();
  }

  // TODO: in the future, update this endpoint such that it only returns the registration of events taht are going to happen in the FUTURE!
  fetchData = () => {
    const { channelId } = this.props;
    TalkService.getTalkRegistrations(null, channelId, null, 
      (allRegistrationList: Registration[]) => {
        let pendingRegistrationList = allRegistrationList.filter(x => x.status == "pending");
        let acceptedRegistrationList = allRegistrationList.filter(x => x.status == "accepted");
        let refusedRegistrationList = allRegistrationList.filter(x => x.status == "refused");

        this.setState( {allRegistrationList: allRegistrationList});
        this.setState( {acceptedRegistrationList: acceptedRegistrationList});
        this.setState( {refusedRegistrationList: refusedRegistrationList});
        this.setState( {pendingRegistrationList: pendingRegistrationList});
      }
    );
  }

  handleClickRow = (ev: any) => {
    let item: Registration = ev.datum;
    this.setState({ itemDetail: item });
  }

  handleCheckBox = (name: string) => {
    this.setState({
      autoRegistration: name
    });
  };

  parseList = (e: any) => {
    this.setState({
      acceptedDomains: e.target.value.split(',')
    });
  }

  accept = () => {
    const item = this.state.itemDetail!;
    TalkService.acceptTalkRegistration(item.id, () => {});

    let pendingRegistrationList = this.state.pendingRegistrationList.filter(x => x !== item);
    let acceptedRegistrationList = this.state.acceptedRegistrationList

    acceptedRegistrationList.push(item);
    this.setState( {pendingRegistrationList: pendingRegistrationList});
    this.setState( {acceptedRegistrationList: acceptedRegistrationList});
  }
  
  refuse = () => {
    const item = this.state.itemDetail!;
    TalkService.refuseTalkRegistration(item.id, () => {});

    let pendingRegistrationList = this.state.pendingRegistrationList.filter(x => x !== item);
    let refusedRegistrationList = this.state.refusedRegistrationList
    
    refusedRegistrationList.push(item);
    this.setState( {pendingRegistrationList: pendingRegistrationList});
    this.setState( {refusedRegistrationList: refusedRegistrationList});
  };

  // updateState = () => {
  //   const item = this.state.itemDetail!;

  //   let pendingRegistrationList = this.state.allRegistrationList.filter(x => x !== item);
  //   let acceptedRegistrationList = this.state.allRegistrationList.filter(x => x !== item);
  //   let refusedRegistrationList = this.state.allRegistrationList.filter(x => x !== item);

  //   if (item.status == "accepted"){
  //     acceptedRegistrationList.push(item);
  //   }
  //   else if (item.status == "refused"){
  //     refusedRegistrationList.push(item);
  //   }
  
  //   this.setState( {acceptedRegistrationList: acceptedRegistrationList});
  //   this.setState( {refusedRegistrationList: refusedRegistrationList});
  //   this.setState( {pendingRegistrationList: pendingRegistrationList});
  // }

  render() {
    const item = this.state.itemDetail!;
    const showItem = !!this.state.itemDetail;

    var auto_accept = "Select the default option for automatically accepting people to your seminars </br></br>" +
    "The accepted people will receive two emails: <br/>" + 
    "- One <b> straight after acceptation </b> with all the event details except the link <br/>" +
    "- One <b>24 hours before the event</b> to share the streaming URL. <br/><br/>" +
    "If URL not available, the email is sent as soon as URL is added to event. ";

    var reg_details = "Accepting a registration will send two emails to the applicant: <br/>" +  
    "- One <b>now</b> with all the event details except the link <br/>" + 
    "- One <b>24 hours before the event</b> to share the streaming URL. <br/><br/>" + 
    "If URL not available, the email is sent as soon as URL is added to event. ";

    var domains_list = "Enter the name of the domains you want to automatically accept, separated by commas. <br/>" + 
    "Example: ox.ac.uk, cam.ac.uk"

    return (
      <Box direction="column">
        <Box margin={{bottom: "60px"}} gap="15px">
          <Box direction="row" gap="small" margin={{ bottom: "0px" }}>
            <Text size="16px" weight="bold" color="black"> 
              Automatic registration 
            </Text>
            <StatusInfo style={{marginTop: "3px"}} size="small" data-tip={auto_accept} data-for='automatic-registration'/>
            <ReactTooltip id='automatic-registration' place="right" effect="solid" html={true}/>
          </Box>

          <CheckBox
            name="feature"
            label="Everyone"
            checked={this.state.autoRegistration == "Everybody"}
            onChange={() => this.handleCheckBox("Everybody")}
          />
          <CheckBox
            name="bug"
            label="Only academics"
            checked={this.state.autoRegistration == "Academics"}
            onChange={() => this.handleCheckBox("Academics")}
          />
          
          <Box direction="row" gap="0px"> 
            <CheckBox
              id="checkbox-domains"
              name="bug"
              label="Only emails ending by: "
              checked={this.state.autoRegistration == "domains"}
              onChange={() => this.handleCheckBox("domains")}
            />
            <StatusInfo style={{marginTop: "14px", marginRight: "10px"}} size="small" data-tip={domains_list} data-for='domains_list'/>
            <ReactTooltip id='domains_list' place="bottom" effect="solid" html={true} />
            <TextInput
              placeholder="List of domains"
              value={this.state.acceptedDomains.join(',')}
              onChange={(e: any) => e ? this.parseList(e) : ""}
              style={{width: "200px"}}
            />


          </Box>

        </Box>

        {(!showItem && (this.state.pendingRegistrationList.length == 0)) &&
            (<Text size="14px">No pending applications.</Text>
        )}

        {(this.state.pendingRegistrationList.length > 0) &&
          (
          <>
          <Box direction="row" gap="small" margin={{ bottom: "12px" }}>
            <Text size="16px" weight="bold" color="black">
              Manual registration
            </Text>
            <StatusInfo style={{marginTop: "3px"}} size="small" data-tip={reg_details} data-for='reg_details_info'/>
            <ReactTooltip id='reg_details_info' place="right" effect="solid" html={true} />
          </Box>
          <Box direction="row" 
            width="60%"
            background="#e5e5e5"
            round="7.5px"
            pad="10px" color="#5A5A5A"
            style={{ minHeight: "140px" }}
          >
            {(!showItem && (this.state.pendingRegistrationList.length > 0)) &&
                (<Text size="14px" color="grey" style={{fontStyle: "italic"}}> Select an item from the pending registration list.</Text>
            )}

            {showItem &&
              <Box>
                <ul style={{ listStyle: 'none', padding: 0, fontSize: "14px"}}>
                  <li>
                    <b>Name: </b>
                    {!(item.website === "") && (
                      <a href={item.website} target="_blank" rel="noopener noreferrer">
                        {item.applicant_name}
                      </a>
                      )
                    }
                    {(item.website === "") && (
                      <>{item.applicant_name}</>
                      )
                    }
                  </li>
                  <li>
                    <b>Institution: </b>
                    {item.institution}
                  </li>
                  <li>
                  <b>Email: </b>
                    {item.email}
                  </li>
                  <li>
                  <b>Talk: </b>
                    {item.name}
                  </li>
                </ul>
                <Box direction="row" gap="small">
                  <WineButton onClick={this.accept}>Accept</WineButton>
                  <WineButton onClick={this.refuse}>Refuse</WineButton>
                </Box>
              </Box>
            }
          </Box>
          </>)}
        <Box direction="row" gap="small" margin={{ top: "24px", bottom: "12px" }}>
          <Text size="14px" weight="bold" color="grey">
            Pending registrations
          </Text>
          <StatusInfo style={{marginTop: "3px"}} size="small" data-tip data-for='pending_reg_info'/>
          <ReactTooltip id='pending_reg_info' place="right" effect="solid">
            <p>Registrations for incoming events only is displayed </p>
          </ReactTooltip>
        </Box>
        <DataTable
          columns={columns}
          data={this.state.pendingRegistrationList}
          step={15}
          size="medium"
          onClickRow={this.handleClickRow}
        />

        {(this.state.acceptedRegistrationList.length > 0) && (
          <>
          <Box direction="row" gap="small" margin={{ top: "45px", bottom: "12px" }}>
            <Text size="14px" weight="bold" color="grey" style={{fontStyle: "italic"}}>
              Accepted registrations
            </Text>
          </Box>
          <DataTable
            columns={columns}
            data={this.state.acceptedRegistrationList}
            step={15}
            size="medium"
            // onClickRow={this.handleClickRow}
          />
        </>)}

        {(this.state.refusedRegistrationList.length > 0) && (
        <>
          <Box direction="row" gap="small" margin={{ top: "45px", bottom: "12px" }}>
            <Text size="14px" weight="bold" color="grey" style={{fontStyle: "italic"}}>
              Refused registrations
            </Text>
          </Box>
          <DataTable
            columns={columns}
            data={this.state.refusedRegistrationList}
            step={15}
            size="small"
            // onClickRow={this.handleClickRow}
          />
        </>)}
      </Box>
    );
  }
}

const WineButton: React.FC<any> = (props) => {
  return (
    <Box
      onClick={props.onClick}
      background="#0C385B"
      round="xsmall"
      pad="xsmall"
      height="30px"
      width="70px"
      justify="center"
      align="center"
      focusIndicator={false}
      hoverIndicator="#0C385B"
    >
      <Text size="14px">{props.children}</Text>
    </Box>
  )
}