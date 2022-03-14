import React, { Component, useEffect, useState } from "react";
import { Box, DataTable, Text } from "grommet";
import { ChannelService } from "../../Services/ChannelService";
import { useAuth0 } from "@auth0/auth0-react";

export const columns: any[] = [
  {
    property: "full_name",
    header: <b>Name</b>,
  },
  {
    property: "position",
    header: <b>Position</b>,
  },
  {
    property: "institution",
    header: <b>Institution</b>,
  },
  {
    property: "email",
    header: <b>Email</b>,
  },
];

export const data: Applicant[] = [];

type Applicant = {
  full_name: string;
  email: string;
  institution: string;
  position: string;
  user_id: number;
  personal_homepage: string;
};

interface Props {
  channelId: number;
}

export const RequestsTab = (props: Props) => {
  const [applicantList, setApplicantList] = useState<Applicant[]>([]);
  const [itemDetail, setItemDetail] = useState<Applicant | undefined>();

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchMembershipRequests();
  }, []);

  const fetchMembershipRequests = async () => {
    const token = await getAccessTokenSilently();
    ChannelService.getMembershipApplications(
      props.channelId,
      (applicants: Applicant[]) => {
        setApplicantList(applicants);
      },
      token
    );
  };

  const handleClickRow = (e: any) => {
    setItemDetail(e.datum);
  };

  const accept = async () => {
    const token = await getAccessTokenSilently();
    const item = itemDetail!;
    ChannelService.acceptMembershipApplication(
      props.channelId,
      item.user_id,
      () => {},
      token
    );
    setApplicantList(
      applicantList.filter((x) => x.email !== itemDetail?.email)
    );
    setItemDetail(undefined);
  };

  const refuse = async () => {
    const token = await getAccessTokenSilently();
    const item = itemDetail!;
    ChannelService.cancelMembershipApplication(
      props.channelId,
      item.user_id,
      () => {},
      token
    );
    setApplicantList(
      applicantList.filter((x) => x.email !== itemDetail?.email)
    );
    setItemDetail(undefined);
  };

  const item = itemDetail!;
  const showItem = !!itemDetail;

  return (
    <Box direction="column">
      <Box direction="row" gap="small" margin={{ bottom: "12px" }}>
        <Text size="14px" weight="bold" color="black">
          Applicant details
        </Text>
      </Box>
      <Box
        direction="row"
        width="60%"
        background="#e5e5e5"
        round="7.5px"
        pad="10px"
        color="#5A5A5A"
        style={{ minHeight: "160px" }}
      >
        {!showItem && <Text size="14px">Please select one item from list</Text>}
        {showItem && (
          <Box>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "14px" }}>
              <li>
                <b>Name: </b>
                {item.full_name}
              </li>
              <li>
                <b>Education: </b>
                {item.position}
              </li>
              <li>
                <b>Institution: </b>
                {item.institution}
              </li>
              <li>
                <b>Homepage: </b>
                <a
                  href={item.personal_homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.personal_homepage}
                </a>
              </li>
              <li>
                <b>Email: </b>
                {item.email}
              </li>
            </ul>
            <Box direction="row" gap="small">
              <WineButton onClick={accept}>Accept</WineButton>
              <WineButton onClick={refuse}>Refuse</WineButton>
            </Box>
          </Box>
        )}
      </Box>
      <Box direction="row" gap="small" margin={{ top: "24px", bottom: "12px" }}>
        <Text size="14px" weight="bold" color="black">
          Applicants
        </Text>
      </Box>
      <DataTable
        columns={columns}
        data={applicantList}
        step={10}
        size="medium"
        onClickRow={handleClickRow}
      />
    </Box>
  );
};

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
      hoverIndicator="#BAD6DB"
    >
      <Text size="14px">{props.children}</Text>
    </Box>
  );
};
