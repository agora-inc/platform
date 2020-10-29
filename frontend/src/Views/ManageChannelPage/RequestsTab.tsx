import React, { Component } from "react";
import { Box, DataTable, Text } from "grommet";

export const columns: any[] = [
  {
    property: 'name',
    header: <b>Name</b>,
  },
  {
    property: 'position',
    header: <b>Position</b>,
  },
  {
    property: 'institution',
    header: <b>Institution</b>,
  },
  {
    property: 'email',
    header: <b>Email</b>,
  },
  // {
  //   property: 'date',
  //   header: <b>Creation Date</b>,
  //   render: (datum: any) => datum.date && new Date(datum.date).toLocaleDateString('en-US'),
  //   align: 'end',
  // },
];

export const data: Applicant[] = [];

for (let i = 1; i < 15; i += 1) {
  data.push({
    name: `Name ${i}`,
    email: `email${i * 135}@server.com`,
    institution: `Institution ${String.fromCharCode(64 + i)}`,
    position: `Pos`,
    // date: `2018-07-${(i % 30) + 1}`,
  });
}

type Applicant = {
  name: string;
  email: string;
  institution: string;
  position: string;
}

interface State {
  applicantList: Applicant[],
  itemDetail?: Applicant,
}

export default class RequestsTab extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      applicantList: data,
    };
  }

  handleClickRow = (ev: any) => {
    let item: Applicant = ev.datum;
    this.setState({ itemDetail: item });
  }

  accept = () => this.updateState();
  refuse = () => this.updateState();

  updateState = () => {
    const item = this.state.itemDetail!;
    const list = this.state.applicantList.filter(x => x.email !== item.email);
    this.setState({ applicantList: list });
    this.setState({ itemDetail: undefined });
  }

  render() {
    const item = this.state.itemDetail!;
    const showItem = !!this.state.itemDetail;

    return (
      <Box direction="column">
        <Box direction="row" gap="small" margin={{ bottom: "24px" }}>
          <Text size="24px" weight="bold" color="black">
            Applicant Details
          </Text>
        </Box>
        <Box width="50%"
          height="160px"
          background="#e5e5e5"
          round="7.5px"
          pad="10px" color="#5A5A5A"
        >
          {!showItem &&
            <Text>Please select one item from list</Text>
          }
          {showItem &&
            <Box>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>
                  <b>Name: </b>
                  {item.name}
                </li>
                <li>
                  <b>Position: </b>
                  {item.position}
                </li>
                <li>
                  <b>Insitution: </b>
                  {item.institution}
                </li>
                <li>
                  <b>Email: </b>
                  {item.email}
                </li>
              </ul>
              <Box direction="row" gap="small">
                <WineButton onClick={this.refuse}>Refuse</WineButton>
                <WineButton onClick={this.accept}>Accept</WineButton>
              </Box>
            </Box>
          }
        </Box>
        <Box direction="row" gap="small" margin={{ top: "12px", bottom: "24px" }}>
          <Text size="24px" weight="bold" color="black">
            Applicants
          </Text>
        </Box>
        <DataTable
          columns={columns}
          data={this.state.applicantList}
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
      height="40px"
      width="100px"
      justify="center"
      align="center"
      focusIndicator={false}
      hoverIndicator="#5A0C0F"
    >
      <Text size="18px">{props.children}</Text>
    </Box>
  )
}