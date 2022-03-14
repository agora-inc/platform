import React, { Component, useEffect, useState } from "react";
import { Box, DataTable, Text, CheckBox, TextInput, Grommet } from "grommet";
import { TalkService } from "../../Services/TalkService";
import ReactTooltip from "react-tooltip";
import { StatusInfo } from "grommet-icons";
import { useStore } from "../../store";
import { useAuth0 } from "@auth0/auth0-react";

const columns: any[] = [
  {
    property: "applicant_name",
    header: <b>Name</b>,
  },
  {
    property: "institution",
    header: <b>Institution</b>,
  },
  {
    property: "email",
    header: <b>Email</b>,
  },
  {
    property: "name",
    header: <b>Talk</b>,
  },
];

const auto_accept =
  "Select the default option for automatically accepting people to your seminars </br></br>" +
  "The accepted people will receive two emails: <br/>" +
  "- One <b> straight after acceptation </b> with all the event details except the link <br/>" +
  "- One <b>24 hours before the event</b> to share the streaming URL. <br/><br/>" +
  "If URL not available, the email is sent as soon as URL is added to event. ";

const reg_details =
  "Accepting a registration will send two emails to the applicant: <br/>" +
  "- One <b>now</b> with all the event details except the link <br/>" +
  "- One <b>24 hours before the event</b> to share the streaming URL. <br/><br/>" +
  "If URL not available, the email is sent as soon as URL is added to event. ";

const domains_list =
  "Enter the name of the domains you want to automatically accept, separated by commas. <br/>" +
  "Example: ox.ac.uk, cam.ac.uk";

type Registration = {
  id: number;
  talk_id: number;
  name: string;
  applicant_name: string;
  institution: string;
  email: string;
  website: string;
  user_id: number;
  status: string;
};

interface Props {
  channelId: number;
}

interface State {
  allRegistrationList: Registration[];
  pendingRegistrationList: Registration[];
  acceptedRegistrationList: Registration[];
  refusedRegistrationList: Registration[];
  itemDetail?: Registration;
  autoRegistration: string;
  acceptedDomains: string[];
}

export const RegistrationsTab = (props: Props) => {
  const [allRegistrationList, setAllRegistrationList] = useState<
    Registration[]
  >([]);
  const [pendingRegistrationList, setPendingRegistrationList] = useState<
    Registration[]
  >([]);
  const [acceptedRegistrationList, setAcceptedRegistrationList] = useState<
    Registration[]
  >([]);
  const [refusedRegistrationList, setRefusedRegistrationList] = useState<
    Registration[]
  >([]);
  const [itemDetail, setItemDetail] = useState<Registration | undefined>();
  const [autoRegistration, setAutoRegistration] = useState("Everybody");
  const [acceptedDomains, setAcceptedDomains] = useState<string[]>([]);

  const user = useStore((state) => state.loggedInUser);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchData();
  }, []);

  // TODO: in the future, update this endpoint such that it only returns the registration of events taht are going to happen in the FUTURE!
  const fetchData = async () => {
    const token = await getAccessTokenSilently();
    TalkService.getTalkRegistrations(
      null,
      props.channelId,
      null,
      (allRegistrations: Registration[]) => {
        setAllRegistrationList(allRegistrations);
        setPendingRegistrationList(
          allRegistrations.filter((r) => r.status === "pending")
        );
        setAcceptedRegistrationList(
          allRegistrations.filter((r) => r.status === "accepted")
        );
        setRefusedRegistrationList(
          allRegistrations.filter((r) => r.status === "refused")
        );
      },
      token
    );
  };

  const handleClickRow = (e: any) => {
    setItemDetail(e.datum);
  };

  const handleCheckBox = (name: string) => {
    setAutoRegistration(name);
  };

  const parseList = (e: any) => {
    setAcceptedDomains(e.target.value.split(","));
  };

  const accept = async () => {
    const token = await getAccessTokenSilently();
    TalkService.acceptTalkRegistration(itemDetail?.id || -1, () => {}, token);
    setPendingRegistrationList(
      pendingRegistrationList.filter((x) => x !== itemDetail)
    );
    setAcceptedRegistrationList([
      ...acceptedRegistrationList,
      itemDetail as Registration,
    ]);
  };

  const refuse = async () => {
    const token = await getAccessTokenSilently();
    TalkService.refuseTalkRegistration(itemDetail?.id || -1, () => {}, token);
    setPendingRegistrationList(
      pendingRegistrationList.filter((x) => x !== itemDetail)
    );
    setRefusedRegistrationList([
      ...refusedRegistrationList,
      itemDetail as Registration,
    ]);
  };

  const item = itemDetail!;
  const showItem = !!itemDetail;

  return (
    <Box direction="column">
      {/* <Box margin={{bottom: "60px"}} gap="15px">
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
          checked={autoRegistration == "Everybody"}
          onChange={() => handleCheckBox("Everybody")}
        />
        <CheckBox
          name="bug"
          label="Only academics"
          checked={autoRegistration == "Academics"}
          onChange={() => handleCheckBox("Academics")}
        />
        
        <Box direction="row" gap="0px"> 
          <CheckBox
            id="checkbox-domains"
            name="bug"
            label="Only emails ending by: "
            checked={autoRegistration == "domains"}
            onChange={() => handleCheckBox("domains")}
          />
          <StatusInfo style={{marginTop: "14px", marginRight: "10px"}} size="small" data-tip={domains_list} data-for='domains_list'/>
          <ReactTooltip id='domains_list' place="bottom" effect="solid" html={true} />
          <TextInput
            placeholder="List of domains"
            value={acceptedDomains.join(',')}
            onChange={(e: any) => e ? parseList(e) : ""}
            style={{width: "200px"}}
          />


        </Box>

      </Box> */}

      {pendingRegistrationList.length > 0 && (
        <>
          <Box direction="row" gap="small" margin={{ bottom: "12px" }}>
            <Text size="16px" weight="bold" color="black">
              Manual registration
            </Text>
            <StatusInfo
              style={{ marginTop: "3px" }}
              size="small"
              data-tip={reg_details}
              data-for="reg_details_info"
            />
            <ReactTooltip
              id="reg_details_info"
              place="right"
              effect="solid"
              html={true}
            />
          </Box>
          <Box
            direction="row"
            width="60%"
            background="#e5e5e5"
            round="7.5px"
            pad="10px"
            color="#5A5A5A"
            style={{ minHeight: "140px" }}
          >
            {!showItem && pendingRegistrationList.length > 0 && (
              <Text size="14px" color="grey" style={{ fontStyle: "italic" }}>
                {" "}
                Select an item from the pending registration list.
              </Text>
            )}

            {showItem && (
              <Box>
                <ul style={{ listStyle: "none", padding: 0, fontSize: "14px" }}>
                  <li>
                    <b>Name: </b>
                    {!(item.website === "") && (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.applicant_name}
                      </a>
                    )}
                    {item.website === "" && <>{item.applicant_name}</>}
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
                  <WineButton onClick={accept}>Accept</WineButton>
                  <WineButton onClick={refuse}>Refuse</WineButton>
                </Box>
              </Box>
            )}
          </Box>
        </>
      )}
      <Box direction="row" gap="small" margin={{ top: "24px", bottom: "12px" }}>
        <Text size="14px" weight="bold" color="grey">
          Pending registrations for future events
        </Text>
        <StatusInfo
          style={{ marginTop: "3px" }}
          size="small"
          data-tip
          data-for="pending_reg_info"
        />
        <ReactTooltip id="pending_reg_info" place="right" effect="solid">
          <p>Registrations for incoming events only is displayed </p>
        </ReactTooltip>
      </Box>
      <DataTable
        columns={columns}
        data={pendingRegistrationList}
        step={15}
        size="medium"
        onClickRow={handleClickRow}
      />

      {acceptedRegistrationList.length > 0 && (
        <>
          <Box
            direction="row"
            gap="small"
            margin={{ top: "45px", bottom: "12px" }}
          >
            <Text
              size="14px"
              weight="bold"
              color="grey"
              style={{ fontStyle: "italic" }}
            >
              Accepted registrations
            </Text>
          </Box>
          <DataTable
            columns={columns}
            data={acceptedRegistrationList}
            step={15}
            size="medium"
            // onClickRow={handleClickRow}
          />
        </>
      )}

      {refusedRegistrationList.length > 0 && (
        <>
          <Box
            direction="row"
            gap="small"
            margin={{ top: "45px", bottom: "12px" }}
          >
            <Text
              size="14px"
              weight="bold"
              color="grey"
              style={{ fontStyle: "italic" }}
            >
              Refused registrations
            </Text>
          </Box>
          <DataTable
            columns={columns}
            data={refusedRegistrationList}
            step={15}
            size="small"
            // onClickRow={handleClickRow}
          />
        </>
      )}
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
