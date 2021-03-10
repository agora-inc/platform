import React, { Component } from "react";
import { Box, DataTable, Text } from "grommet";
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
}

export default class RegistrationsTab extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      allRegistrationList: [],
      pendingRegistrationList: [],
      acceptedRegistrationList: [],
      refusedRegistrationList: []
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

    // console.log("item", item);


    return (
      <Box direction="column">
        {(!showItem && (this.state.pendingRegistrationList.length == 0)) &&
            (<Text size="14px">No pending applications.</Text>
        )}

        {(this.state.pendingRegistrationList.length > 0) &&
          (
          <>
          <Box direction="row" gap="small" margin={{ bottom: "12px" }}>
            <Text size="14px" weight="bold" color="black">
              Registration details
            </Text>
            <StatusInfo size="small" data-tip data-for='reg_details_info'/>
                      <ReactTooltip id='reg_details_info' place="right" effect="solid">
                       <p>Accepting a registration will send two emails to the applicant: one <b>now</b> to acknowledge acceptation; another one <b>24 hours before the event</b> to share the streaming URL (if URL not available, email sent as soon as URL is added to event). </p>
                      </ReactTooltip>
          </Box>
          <Box direction="row" 
            width="60%"
            background="#e5e5e5"
            round="7.5px"
            pad="10px" color="#5A5A5A"
            style={{ minHeight: "140px" }}
          >
            {(!showItem && (this.state.pendingRegistrationList.length > 0)) &&
                (<Text size="14px"> Manage seminar registrations by selecting an item from the pending registration list.</Text>
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
          <Text size="14px" weight="bold" color="black">
            Pending registrations
          </Text>
          <StatusInfo size="small" data-tip data-for='pending_reg_info'/>
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
            <Text size="14px" weight="bold" color="black" style={{fontStyle: "italic"}}>
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
            <Text size="14px" weight="bold" color="black" style={{fontStyle: "italic"}}>
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
      background="#025377"
      round="xsmall"
      pad="xsmall"
      height="30px"
      width="70px"
      justify="center"
      align="center"
      focusIndicator={false}
      hoverIndicator="#025377"
    >
      <Text size="14px">{props.children}</Text>
    </Box>
  )
}