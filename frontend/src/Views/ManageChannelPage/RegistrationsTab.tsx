import React, { Component } from "react";
import { Box, DataTable, Text } from "grommet";
import { TalkService } from "../../Services/TalkService";

const columns: any[] = [
  {
    property: 'full_name',
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
    property: 'talk',
    header: <b>Talk</b>,
  },
];

type Registration = {
  id: number;
  full_name: string;
  institution: string;
  email: string;
  talk: string;
}

interface Props {
  channelId: number
}

interface State {
  registrationList: Registration[],
  itemDetail?: Registration,
}

export default class RegistrationsTab extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      registrationList: [],
    };
    this.fetchData();
  }

  fetchData = () => {
    const { channelId } = this.props;
    TalkService.getTalkRegistrations(null, channelId, null, 
      (registrationList: Registration[]) => {
        this.setState( {registrationList: registrationList})
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
    this.updateState();
  }
  
  refuse = () => {
    const item = this.state.itemDetail!;
    TalkService.refuseTalkRegistration(item.id, () => {});
    this.updateState();
  };

  updateState = () => {
    const item = this.state.itemDetail!;
    const list = this.state.registrationList.filter(x => x.email !== item.email);
    this.setState({ registrationList: list });
    this.setState({ itemDetail: undefined });
  }

  render() {
    const item = this.state.itemDetail!;
    const showItem = !!this.state.itemDetail;

    return (
      <Box direction="column">
        <Box direction="row" gap="small" margin={{ bottom: "12px" }}>
          <Text size="14px" weight="bold" color="black">
            Registration details
          </Text>
        </Box>
        <Box direction="row" 
          width="60%"
          background="#e5e5e5"
          round="7.5px"
          pad="10px" color="#5A5A5A"
          style={{ minHeight: "160px" }}
        >
          {!showItem &&
            <Text size="14px">Please select one item from list</Text>
          }
          {showItem &&
            <Box>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: "14px"}}>
                <li>
                  <b>Name: </b>
                  {item.full_name}
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
                  {item.talk}
                </li>
              </ul>
              <Box direction="row" gap="small">
                <WineButton onClick={this.accept}>Accept</WineButton>
                <WineButton onClick={this.refuse}>Refuse</WineButton>
              </Box>
            </Box>
          }
        </Box>
        <Box direction="row" gap="small" margin={{ top: "24px", bottom: "12px" }}>
          <Text size="14px" weight="bold" color="black">
            Registrations
          </Text>
        </Box>
        <DataTable
          columns={columns}
          data={this.state.registrationList}
          step={10}
          size="small"
          onClickRow={this.handleClickRow}
        />
      </Box>
    );
  }
}

const WineButton: React.FC<any> = (props) => {
  return (
    <Box
      onClick={props.onClick}
      background="#7E1115"
      round="xsmall"
      pad="xsmall"
      height="30px"
      width="70px"
      justify="center"
      align="center"
      focusIndicator={false}
      hoverIndicator="#5A0C0F"
    >
      <Text size="14px">{props.children}</Text>
    </Box>
  )
}